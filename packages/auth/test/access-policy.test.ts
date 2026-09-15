import { canAccess } from '../src/index.js'

if (!canAccess('admin') || !canAccess('staff') || !canAccess('user')) {
  throw new Error('Default access policy must allow every supported role.')
}

if (canAccess('guest') || canAccess('admin', ['user'])) {
  throw new Error('Access policy must reject unsupported and unapproved roles.')
}
