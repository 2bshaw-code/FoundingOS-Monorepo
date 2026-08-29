#!/usr/bin/env node
import { cpSync, existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const security = JSON.parse(readFileSync(join(root, 'config/backup-security.json'), 'utf8'))
const spec = JSON.parse(readFileSync(join(root, 'scripts/ecosystem-snapshot-spec.json'), 'utf8'))
const labelIndex = process.argv.indexOf('--label')
const label = labelIndex === -1 ? new Date().toISOString().replace(/[:.]/g, '-') : process.argv[labelIndex + 1]
const output = join(root, 'backups', `ecosystem-full-backup-${label}`)

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options })
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status}.`)
}

function encrypt(source, destination, secret) {
  const result = spawnSync(
    'openssl',
    ['enc', '-aes-256-cbc', '-pbkdf2', '-salt', '-pass', 'stdin', '-in', source, '-out', destination],
    { input: `${secret}\n`, stdio: ['pipe', 'inherit', 'inherit'] },
  )
  if (result.status !== 0) throw new Error(`openssl failed with exit code ${result.status}.`)
}

function collectEnvironmentFiles(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) collectEnvironmentFiles(path, files)
    else if (entry.isFile() && (entry.name === '.env' || entry.name.startsWith('.env.'))) files.push(path)
  }
  return files
}

function copySource(path, staging) {
  const source = join(root, path)
  if (!existsSync(source)) throw new Error(`Required snapshot path is missing: ${path}`)
  cpSync(source, join(staging, path), {
    recursive: true,
    filter: (entry) => {
      const name = basename(entry)
      return name !== 'node_modules' && name !== '.next' && name !== '.git' && name !== '.env' && !name.startsWith('.env.')
    },
  })
}

function password() {
  return execFileSync('security', ['find-generic-password', '-w', '-s', security.keychainService], { encoding: 'utf8' }).trim()
}

function main() {
  if (existsSync(output)) throw new Error(`Refusing to overwrite existing snapshot: ${output}`)
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to capture the database state.')

  const staging = mkdtempSync(join(tmpdir(), 'foundingos-snapshot-'))
  try {
    const secret = password()
    for (const path of [...spec.applications, ...spec.sharedServices, ...spec.routingConfigs]) copySource(path, staging)

    const envFiles = collectEnvironmentFiles(root)
    const envList = join(staging, 'environment-files.txt')
    writeFileSync(envList, envFiles.map((path) => relative(root, path)).join('\n'))
    run('tar', ['-C', root, '-czf', join(staging, 'environment.tar.gz'), '-T', envList])
    encrypt(join(staging, 'environment.tar.gz'), join(staging, 'environment.enc'), secret)
    rmSync(join(staging, 'environment.tar.gz'))
    rmSync(envList)

    const databaseDump = join(staging, 'database.sql')
    run('pg_dump', ['--dbname', process.env.DATABASE_URL, '--format=plain', '--file', databaseDump])
    encrypt(databaseDump, join(staging, 'database.enc'), secret)
    rmSync(databaseDump)

    writeFileSync(join(staging, 'manifest.json'), JSON.stringify({
      version: spec.version,
      label,
      createdAt: new Date().toISOString(),
      brands: spec.brands,
      applications: spec.applications,
      sharedServices: spec.sharedServices,
      routingConfigs: spec.routingConfigs,
      database: 'database.enc',
      environments: 'environment.enc',
      encryption: 'AES-256-CBC with PBKDF2',
    }, null, 2))
    mkdirSync(dirname(output), { recursive: true })
    cpSync(staging, output, { recursive: true })
    for (const destination of [security.remoteLocationA, security.remoteLocationB]) {
      run('rsync', ['-a', '--delete', `${output}/`, `${join(destination, basename(output))}/`])
    }
  } finally {
    rmSync(staging, { recursive: true, force: true })
  }
}

main()
