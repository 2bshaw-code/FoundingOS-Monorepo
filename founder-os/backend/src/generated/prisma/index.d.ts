/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AuthUser
 * 
 */
export type AuthUser = $Result.DefaultSelection<Prisma.$AuthUserPayload>
/**
 * Model PasskeyCredential
 * 
 */
export type PasskeyCredential = $Result.DefaultSelection<Prisma.$PasskeyCredentialPayload>
/**
 * Model PasskeyChallenge
 * 
 */
export type PasskeyChallenge = $Result.DefaultSelection<Prisma.$PasskeyChallengePayload>
/**
 * Model AuthSession
 * 
 */
export type AuthSession = $Result.DefaultSelection<Prisma.$AuthSessionPayload>
/**
 * Model PasswordReset
 * 
 */
export type PasswordReset = $Result.DefaultSelection<Prisma.$PasswordResetPayload>
/**
 * Model AuditEvent
 * 
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>
/**
 * Model AppHealthSnapshot
 * 
 */
export type AppHealthSnapshot = $Result.DefaultSelection<Prisma.$AppHealthSnapshotPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model CompanyModule
 * 
 */
export type CompanyModule = $Result.DefaultSelection<Prisma.$CompanyModulePayload>
/**
 * Model PackageApplication
 * 
 */
export type PackageApplication = $Result.DefaultSelection<Prisma.$PackageApplicationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuthUsers
 * const authUsers = await prisma.authUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AuthUsers
   * const authUsers = await prisma.authUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.authUser`: Exposes CRUD operations for the **AuthUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthUsers
    * const authUsers = await prisma.authUser.findMany()
    * ```
    */
  get authUser(): Prisma.AuthUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passkeyCredential`: Exposes CRUD operations for the **PasskeyCredential** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasskeyCredentials
    * const passkeyCredentials = await prisma.passkeyCredential.findMany()
    * ```
    */
  get passkeyCredential(): Prisma.PasskeyCredentialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passkeyChallenge`: Exposes CRUD operations for the **PasskeyChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasskeyChallenges
    * const passkeyChallenges = await prisma.passkeyChallenge.findMany()
    * ```
    */
  get passkeyChallenge(): Prisma.PasskeyChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authSession`: Exposes CRUD operations for the **AuthSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthSessions
    * const authSessions = await prisma.authSession.findMany()
    * ```
    */
  get authSession(): Prisma.AuthSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordReset`: Exposes CRUD operations for the **PasswordReset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResets
    * const passwordResets = await prisma.passwordReset.findMany()
    * ```
    */
  get passwordReset(): Prisma.PasswordResetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appHealthSnapshot`: Exposes CRUD operations for the **AppHealthSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppHealthSnapshots
    * const appHealthSnapshots = await prisma.appHealthSnapshot.findMany()
    * ```
    */
  get appHealthSnapshot(): Prisma.AppHealthSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.companyModule`: Exposes CRUD operations for the **CompanyModule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompanyModules
    * const companyModules = await prisma.companyModule.findMany()
    * ```
    */
  get companyModule(): Prisma.CompanyModuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.packageApplication`: Exposes CRUD operations for the **PackageApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PackageApplications
    * const packageApplications = await prisma.packageApplication.findMany()
    * ```
    */
  get packageApplication(): Prisma.PackageApplicationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AuthUser: 'AuthUser',
    PasskeyCredential: 'PasskeyCredential',
    PasskeyChallenge: 'PasskeyChallenge',
    AuthSession: 'AuthSession',
    PasswordReset: 'PasswordReset',
    AuditEvent: 'AuditEvent',
    AppHealthSnapshot: 'AppHealthSnapshot',
    Company: 'Company',
    CompanyModule: 'CompanyModule',
    PackageApplication: 'PackageApplication'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "authUser" | "passkeyCredential" | "passkeyChallenge" | "authSession" | "passwordReset" | "auditEvent" | "appHealthSnapshot" | "company" | "companyModule" | "packageApplication"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AuthUser: {
        payload: Prisma.$AuthUserPayload<ExtArgs>
        fields: Prisma.AuthUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          findFirst: {
            args: Prisma.AuthUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          findMany: {
            args: Prisma.AuthUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>[]
          }
          create: {
            args: Prisma.AuthUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          createMany: {
            args: Prisma.AuthUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>[]
          }
          delete: {
            args: Prisma.AuthUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          update: {
            args: Prisma.AuthUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          deleteMany: {
            args: Prisma.AuthUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>[]
          }
          upsert: {
            args: Prisma.AuthUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthUserPayload>
          }
          aggregate: {
            args: Prisma.AuthUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthUser>
          }
          groupBy: {
            args: Prisma.AuthUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthUserCountArgs<ExtArgs>
            result: $Utils.Optional<AuthUserCountAggregateOutputType> | number
          }
        }
      }
      PasskeyCredential: {
        payload: Prisma.$PasskeyCredentialPayload<ExtArgs>
        fields: Prisma.PasskeyCredentialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasskeyCredentialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasskeyCredentialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          findFirst: {
            args: Prisma.PasskeyCredentialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasskeyCredentialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          findMany: {
            args: Prisma.PasskeyCredentialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>[]
          }
          create: {
            args: Prisma.PasskeyCredentialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          createMany: {
            args: Prisma.PasskeyCredentialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasskeyCredentialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>[]
          }
          delete: {
            args: Prisma.PasskeyCredentialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          update: {
            args: Prisma.PasskeyCredentialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          deleteMany: {
            args: Prisma.PasskeyCredentialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasskeyCredentialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasskeyCredentialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>[]
          }
          upsert: {
            args: Prisma.PasskeyCredentialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyCredentialPayload>
          }
          aggregate: {
            args: Prisma.PasskeyCredentialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasskeyCredential>
          }
          groupBy: {
            args: Prisma.PasskeyCredentialGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasskeyCredentialGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasskeyCredentialCountArgs<ExtArgs>
            result: $Utils.Optional<PasskeyCredentialCountAggregateOutputType> | number
          }
        }
      }
      PasskeyChallenge: {
        payload: Prisma.$PasskeyChallengePayload<ExtArgs>
        fields: Prisma.PasskeyChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasskeyChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasskeyChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          findFirst: {
            args: Prisma.PasskeyChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasskeyChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          findMany: {
            args: Prisma.PasskeyChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>[]
          }
          create: {
            args: Prisma.PasskeyChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          createMany: {
            args: Prisma.PasskeyChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasskeyChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>[]
          }
          delete: {
            args: Prisma.PasskeyChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          update: {
            args: Prisma.PasskeyChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          deleteMany: {
            args: Prisma.PasskeyChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasskeyChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasskeyChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>[]
          }
          upsert: {
            args: Prisma.PasskeyChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasskeyChallengePayload>
          }
          aggregate: {
            args: Prisma.PasskeyChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasskeyChallenge>
          }
          groupBy: {
            args: Prisma.PasskeyChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasskeyChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasskeyChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<PasskeyChallengeCountAggregateOutputType> | number
          }
        }
      }
      AuthSession: {
        payload: Prisma.$AuthSessionPayload<ExtArgs>
        fields: Prisma.AuthSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findFirst: {
            args: Prisma.AuthSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findMany: {
            args: Prisma.AuthSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          create: {
            args: Prisma.AuthSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          createMany: {
            args: Prisma.AuthSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          delete: {
            args: Prisma.AuthSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          update: {
            args: Prisma.AuthSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          deleteMany: {
            args: Prisma.AuthSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          upsert: {
            args: Prisma.AuthSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          aggregate: {
            args: Prisma.AuthSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthSession>
          }
          groupBy: {
            args: Prisma.AuthSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionCountAggregateOutputType> | number
          }
        }
      }
      PasswordReset: {
        payload: Prisma.$PasswordResetPayload<ExtArgs>
        fields: Prisma.PasswordResetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          findMany: {
            args: Prisma.PasswordResetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          create: {
            args: Prisma.PasswordResetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          createMany: {
            args: Prisma.PasswordResetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          update: {
            args: Prisma.PasswordResetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordReset>
          }
          groupBy: {
            args: Prisma.PasswordResetGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCountAggregateOutputType> | number
          }
        }
      }
      AuditEvent: {
        payload: Prisma.$AuditEventPayload<ExtArgs>
        fields: Prisma.AuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findFirst: {
            args: Prisma.AuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findMany: {
            args: Prisma.AuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          create: {
            args: Prisma.AuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          createMany: {
            args: Prisma.AuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          delete: {
            args: Prisma.AuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          update: {
            args: Prisma.AuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          deleteMany: {
            args: Prisma.AuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          upsert: {
            args: Prisma.AuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          aggregate: {
            args: Prisma.AuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditEvent>
          }
          groupBy: {
            args: Prisma.AuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<AuditEventCountAggregateOutputType> | number
          }
        }
      }
      AppHealthSnapshot: {
        payload: Prisma.$AppHealthSnapshotPayload<ExtArgs>
        fields: Prisma.AppHealthSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppHealthSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppHealthSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          findFirst: {
            args: Prisma.AppHealthSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppHealthSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          findMany: {
            args: Prisma.AppHealthSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>[]
          }
          create: {
            args: Prisma.AppHealthSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          createMany: {
            args: Prisma.AppHealthSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppHealthSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>[]
          }
          delete: {
            args: Prisma.AppHealthSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          update: {
            args: Prisma.AppHealthSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.AppHealthSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppHealthSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppHealthSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.AppHealthSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppHealthSnapshotPayload>
          }
          aggregate: {
            args: Prisma.AppHealthSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppHealthSnapshot>
          }
          groupBy: {
            args: Prisma.AppHealthSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppHealthSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppHealthSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<AppHealthSnapshotCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      CompanyModule: {
        payload: Prisma.$CompanyModulePayload<ExtArgs>
        fields: Prisma.CompanyModuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyModuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyModuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          findFirst: {
            args: Prisma.CompanyModuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyModuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          findMany: {
            args: Prisma.CompanyModuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>[]
          }
          create: {
            args: Prisma.CompanyModuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          createMany: {
            args: Prisma.CompanyModuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyModuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>[]
          }
          delete: {
            args: Prisma.CompanyModuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          update: {
            args: Prisma.CompanyModuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          deleteMany: {
            args: Prisma.CompanyModuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyModuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyModuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>[]
          }
          upsert: {
            args: Prisma.CompanyModuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyModulePayload>
          }
          aggregate: {
            args: Prisma.CompanyModuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompanyModule>
          }
          groupBy: {
            args: Prisma.CompanyModuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyModuleCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyModuleCountAggregateOutputType> | number
          }
        }
      }
      PackageApplication: {
        payload: Prisma.$PackageApplicationPayload<ExtArgs>
        fields: Prisma.PackageApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PackageApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PackageApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          findFirst: {
            args: Prisma.PackageApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PackageApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          findMany: {
            args: Prisma.PackageApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>[]
          }
          create: {
            args: Prisma.PackageApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          createMany: {
            args: Prisma.PackageApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PackageApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>[]
          }
          delete: {
            args: Prisma.PackageApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          update: {
            args: Prisma.PackageApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          deleteMany: {
            args: Prisma.PackageApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PackageApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PackageApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>[]
          }
          upsert: {
            args: Prisma.PackageApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackageApplicationPayload>
          }
          aggregate: {
            args: Prisma.PackageApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePackageApplication>
          }
          groupBy: {
            args: Prisma.PackageApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PackageApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PackageApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<PackageApplicationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    authUser?: AuthUserOmit
    passkeyCredential?: PasskeyCredentialOmit
    passkeyChallenge?: PasskeyChallengeOmit
    authSession?: AuthSessionOmit
    passwordReset?: PasswordResetOmit
    auditEvent?: AuditEventOmit
    appHealthSnapshot?: AppHealthSnapshotOmit
    company?: CompanyOmit
    companyModule?: CompanyModuleOmit
    packageApplication?: PackageApplicationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuthUserCountOutputType
   */

  export type AuthUserCountOutputType = {
    sessions: number
    resets: number
    passkeys: number
  }

  export type AuthUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | AuthUserCountOutputTypeCountSessionsArgs
    resets?: boolean | AuthUserCountOutputTypeCountResetsArgs
    passkeys?: boolean | AuthUserCountOutputTypeCountPasskeysArgs
  }

  // Custom InputTypes
  /**
   * AuthUserCountOutputType without action
   */
  export type AuthUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUserCountOutputType
     */
    select?: AuthUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuthUserCountOutputType without action
   */
  export type AuthUserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
  }

  /**
   * AuthUserCountOutputType without action
   */
  export type AuthUserCountOutputTypeCountResetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetWhereInput
  }

  /**
   * AuthUserCountOutputType without action
   */
  export type AuthUserCountOutputTypeCountPasskeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasskeyCredentialWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    modules: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    modules?: boolean | CompanyCountOutputTypeCountModulesArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountModulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyModuleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AuthUser
   */

  export type AggregateAuthUser = {
    _count: AuthUserCountAggregateOutputType | null
    _min: AuthUserMinAggregateOutputType | null
    _max: AuthUserMaxAggregateOutputType | null
  }

  export type AuthUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    tenantId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    tenantId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthUserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    role: number
    tenantId: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthUserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthUserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthUserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    tenantId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthUser to aggregate.
     */
    where?: AuthUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthUsers to fetch.
     */
    orderBy?: AuthUserOrderByWithRelationInput | AuthUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthUsers
    **/
    _count?: true | AuthUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthUserMaxAggregateInputType
  }

  export type GetAuthUserAggregateType<T extends AuthUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthUser[P]>
      : GetScalarType<T[P], AggregateAuthUser[P]>
  }




  export type AuthUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthUserWhereInput
    orderBy?: AuthUserOrderByWithAggregationInput | AuthUserOrderByWithAggregationInput[]
    by: AuthUserScalarFieldEnum[] | AuthUserScalarFieldEnum
    having?: AuthUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthUserCountAggregateInputType | true
    _min?: AuthUserMinAggregateInputType
    _max?: AuthUserMaxAggregateInputType
  }

  export type AuthUserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    role: string
    tenantId: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: AuthUserCountAggregateOutputType | null
    _min: AuthUserMinAggregateOutputType | null
    _max: AuthUserMaxAggregateOutputType | null
  }

  type GetAuthUserGroupByPayload<T extends AuthUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthUserGroupByOutputType[P]>
            : GetScalarType<T[P], AuthUserGroupByOutputType[P]>
        }
      >
    >


  export type AuthUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | AuthUser$sessionsArgs<ExtArgs>
    resets?: boolean | AuthUser$resetsArgs<ExtArgs>
    passkeys?: boolean | AuthUser$passkeysArgs<ExtArgs>
    _count?: boolean | AuthUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authUser"]>

  export type AuthUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["authUser"]>

  export type AuthUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["authUser"]>

  export type AuthUserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    tenantId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "role" | "tenantId" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["authUser"]>
  export type AuthUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | AuthUser$sessionsArgs<ExtArgs>
    resets?: boolean | AuthUser$resetsArgs<ExtArgs>
    passkeys?: boolean | AuthUser$passkeysArgs<ExtArgs>
    _count?: boolean | AuthUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthUser"
    objects: {
      sessions: Prisma.$AuthSessionPayload<ExtArgs>[]
      resets: Prisma.$PasswordResetPayload<ExtArgs>[]
      passkeys: Prisma.$PasskeyCredentialPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      role: string
      tenantId: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authUser"]>
    composites: {}
  }

  type AuthUserGetPayload<S extends boolean | null | undefined | AuthUserDefaultArgs> = $Result.GetResult<Prisma.$AuthUserPayload, S>

  type AuthUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthUserCountAggregateInputType | true
    }

  export interface AuthUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthUser'], meta: { name: 'AuthUser' } }
    /**
     * Find zero or one AuthUser that matches the filter.
     * @param {AuthUserFindUniqueArgs} args - Arguments to find a AuthUser
     * @example
     * // Get one AuthUser
     * const authUser = await prisma.authUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthUserFindUniqueArgs>(args: SelectSubset<T, AuthUserFindUniqueArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthUserFindUniqueOrThrowArgs} args - Arguments to find a AuthUser
     * @example
     * // Get one AuthUser
     * const authUser = await prisma.authUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserFindFirstArgs} args - Arguments to find a AuthUser
     * @example
     * // Get one AuthUser
     * const authUser = await prisma.authUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthUserFindFirstArgs>(args?: SelectSubset<T, AuthUserFindFirstArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserFindFirstOrThrowArgs} args - Arguments to find a AuthUser
     * @example
     * // Get one AuthUser
     * const authUser = await prisma.authUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthUsers
     * const authUsers = await prisma.authUser.findMany()
     * 
     * // Get first 10 AuthUsers
     * const authUsers = await prisma.authUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authUserWithIdOnly = await prisma.authUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthUserFindManyArgs>(args?: SelectSubset<T, AuthUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthUser.
     * @param {AuthUserCreateArgs} args - Arguments to create a AuthUser.
     * @example
     * // Create one AuthUser
     * const AuthUser = await prisma.authUser.create({
     *   data: {
     *     // ... data to create a AuthUser
     *   }
     * })
     * 
     */
    create<T extends AuthUserCreateArgs>(args: SelectSubset<T, AuthUserCreateArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthUsers.
     * @param {AuthUserCreateManyArgs} args - Arguments to create many AuthUsers.
     * @example
     * // Create many AuthUsers
     * const authUser = await prisma.authUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthUserCreateManyArgs>(args?: SelectSubset<T, AuthUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthUsers and returns the data saved in the database.
     * @param {AuthUserCreateManyAndReturnArgs} args - Arguments to create many AuthUsers.
     * @example
     * // Create many AuthUsers
     * const authUser = await prisma.authUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthUsers and only return the `id`
     * const authUserWithIdOnly = await prisma.authUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthUserCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthUser.
     * @param {AuthUserDeleteArgs} args - Arguments to delete one AuthUser.
     * @example
     * // Delete one AuthUser
     * const AuthUser = await prisma.authUser.delete({
     *   where: {
     *     // ... filter to delete one AuthUser
     *   }
     * })
     * 
     */
    delete<T extends AuthUserDeleteArgs>(args: SelectSubset<T, AuthUserDeleteArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthUser.
     * @param {AuthUserUpdateArgs} args - Arguments to update one AuthUser.
     * @example
     * // Update one AuthUser
     * const authUser = await prisma.authUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthUserUpdateArgs>(args: SelectSubset<T, AuthUserUpdateArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthUsers.
     * @param {AuthUserDeleteManyArgs} args - Arguments to filter AuthUsers to delete.
     * @example
     * // Delete a few AuthUsers
     * const { count } = await prisma.authUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthUserDeleteManyArgs>(args?: SelectSubset<T, AuthUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthUsers
     * const authUser = await prisma.authUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthUserUpdateManyArgs>(args: SelectSubset<T, AuthUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthUsers and returns the data updated in the database.
     * @param {AuthUserUpdateManyAndReturnArgs} args - Arguments to update many AuthUsers.
     * @example
     * // Update many AuthUsers
     * const authUser = await prisma.authUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthUsers and only return the `id`
     * const authUserWithIdOnly = await prisma.authUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthUserUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthUser.
     * @param {AuthUserUpsertArgs} args - Arguments to update or create a AuthUser.
     * @example
     * // Update or create a AuthUser
     * const authUser = await prisma.authUser.upsert({
     *   create: {
     *     // ... data to create a AuthUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthUser we want to update
     *   }
     * })
     */
    upsert<T extends AuthUserUpsertArgs>(args: SelectSubset<T, AuthUserUpsertArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserCountArgs} args - Arguments to filter AuthUsers to count.
     * @example
     * // Count the number of AuthUsers
     * const count = await prisma.authUser.count({
     *   where: {
     *     // ... the filter for the AuthUsers we want to count
     *   }
     * })
    **/
    count<T extends AuthUserCountArgs>(
      args?: Subset<T, AuthUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthUserAggregateArgs>(args: Subset<T, AuthUserAggregateArgs>): Prisma.PrismaPromise<GetAuthUserAggregateType<T>>

    /**
     * Group by AuthUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthUserGroupByArgs['orderBy'] }
        : { orderBy?: AuthUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthUser model
   */
  readonly fields: AuthUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends AuthUser$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, AuthUser$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resets<T extends AuthUser$resetsArgs<ExtArgs> = {}>(args?: Subset<T, AuthUser$resetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    passkeys<T extends AuthUser$passkeysArgs<ExtArgs> = {}>(args?: Subset<T, AuthUser$passkeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthUser model
   */
  interface AuthUserFieldRefs {
    readonly id: FieldRef<"AuthUser", 'String'>
    readonly email: FieldRef<"AuthUser", 'String'>
    readonly passwordHash: FieldRef<"AuthUser", 'String'>
    readonly role: FieldRef<"AuthUser", 'String'>
    readonly tenantId: FieldRef<"AuthUser", 'String'>
    readonly active: FieldRef<"AuthUser", 'Boolean'>
    readonly createdAt: FieldRef<"AuthUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthUser findUnique
   */
  export type AuthUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter, which AuthUser to fetch.
     */
    where: AuthUserWhereUniqueInput
  }

  /**
   * AuthUser findUniqueOrThrow
   */
  export type AuthUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter, which AuthUser to fetch.
     */
    where: AuthUserWhereUniqueInput
  }

  /**
   * AuthUser findFirst
   */
  export type AuthUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter, which AuthUser to fetch.
     */
    where?: AuthUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthUsers to fetch.
     */
    orderBy?: AuthUserOrderByWithRelationInput | AuthUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthUsers.
     */
    cursor?: AuthUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthUsers.
     */
    distinct?: AuthUserScalarFieldEnum | AuthUserScalarFieldEnum[]
  }

  /**
   * AuthUser findFirstOrThrow
   */
  export type AuthUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter, which AuthUser to fetch.
     */
    where?: AuthUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthUsers to fetch.
     */
    orderBy?: AuthUserOrderByWithRelationInput | AuthUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthUsers.
     */
    cursor?: AuthUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthUsers.
     */
    distinct?: AuthUserScalarFieldEnum | AuthUserScalarFieldEnum[]
  }

  /**
   * AuthUser findMany
   */
  export type AuthUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter, which AuthUsers to fetch.
     */
    where?: AuthUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthUsers to fetch.
     */
    orderBy?: AuthUserOrderByWithRelationInput | AuthUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthUsers.
     */
    cursor?: AuthUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthUsers.
     */
    skip?: number
    distinct?: AuthUserScalarFieldEnum | AuthUserScalarFieldEnum[]
  }

  /**
   * AuthUser create
   */
  export type AuthUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthUser.
     */
    data: XOR<AuthUserCreateInput, AuthUserUncheckedCreateInput>
  }

  /**
   * AuthUser createMany
   */
  export type AuthUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthUsers.
     */
    data: AuthUserCreateManyInput | AuthUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthUser createManyAndReturn
   */
  export type AuthUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * The data used to create many AuthUsers.
     */
    data: AuthUserCreateManyInput | AuthUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthUser update
   */
  export type AuthUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthUser.
     */
    data: XOR<AuthUserUpdateInput, AuthUserUncheckedUpdateInput>
    /**
     * Choose, which AuthUser to update.
     */
    where: AuthUserWhereUniqueInput
  }

  /**
   * AuthUser updateMany
   */
  export type AuthUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthUsers.
     */
    data: XOR<AuthUserUpdateManyMutationInput, AuthUserUncheckedUpdateManyInput>
    /**
     * Filter which AuthUsers to update
     */
    where?: AuthUserWhereInput
    /**
     * Limit how many AuthUsers to update.
     */
    limit?: number
  }

  /**
   * AuthUser updateManyAndReturn
   */
  export type AuthUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * The data used to update AuthUsers.
     */
    data: XOR<AuthUserUpdateManyMutationInput, AuthUserUncheckedUpdateManyInput>
    /**
     * Filter which AuthUsers to update
     */
    where?: AuthUserWhereInput
    /**
     * Limit how many AuthUsers to update.
     */
    limit?: number
  }

  /**
   * AuthUser upsert
   */
  export type AuthUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthUser to update in case it exists.
     */
    where: AuthUserWhereUniqueInput
    /**
     * In case the AuthUser found by the `where` argument doesn't exist, create a new AuthUser with this data.
     */
    create: XOR<AuthUserCreateInput, AuthUserUncheckedCreateInput>
    /**
     * In case the AuthUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthUserUpdateInput, AuthUserUncheckedUpdateInput>
  }

  /**
   * AuthUser delete
   */
  export type AuthUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
    /**
     * Filter which AuthUser to delete.
     */
    where: AuthUserWhereUniqueInput
  }

  /**
   * AuthUser deleteMany
   */
  export type AuthUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthUsers to delete
     */
    where?: AuthUserWhereInput
    /**
     * Limit how many AuthUsers to delete.
     */
    limit?: number
  }

  /**
   * AuthUser.sessions
   */
  export type AuthUser$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    cursor?: AuthSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthUser.resets
   */
  export type AuthUser$resetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    where?: PasswordResetWhereInput
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    cursor?: PasswordResetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * AuthUser.passkeys
   */
  export type AuthUser$passkeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    where?: PasskeyCredentialWhereInput
    orderBy?: PasskeyCredentialOrderByWithRelationInput | PasskeyCredentialOrderByWithRelationInput[]
    cursor?: PasskeyCredentialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasskeyCredentialScalarFieldEnum | PasskeyCredentialScalarFieldEnum[]
  }

  /**
   * AuthUser without action
   */
  export type AuthUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthUser
     */
    select?: AuthUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthUser
     */
    omit?: AuthUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthUserInclude<ExtArgs> | null
  }


  /**
   * Model PasskeyCredential
   */

  export type AggregatePasskeyCredential = {
    _count: PasskeyCredentialCountAggregateOutputType | null
    _avg: PasskeyCredentialAvgAggregateOutputType | null
    _sum: PasskeyCredentialSumAggregateOutputType | null
    _min: PasskeyCredentialMinAggregateOutputType | null
    _max: PasskeyCredentialMaxAggregateOutputType | null
  }

  export type PasskeyCredentialAvgAggregateOutputType = {
    counter: number | null
  }

  export type PasskeyCredentialSumAggregateOutputType = {
    counter: bigint | null
  }

  export type PasskeyCredentialMinAggregateOutputType = {
    id: string | null
    credentialId: string | null
    publicKey: Bytes | null
    counter: bigint | null
    deviceType: string | null
    backedUp: boolean | null
    userId: string | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type PasskeyCredentialMaxAggregateOutputType = {
    id: string | null
    credentialId: string | null
    publicKey: Bytes | null
    counter: bigint | null
    deviceType: string | null
    backedUp: boolean | null
    userId: string | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type PasskeyCredentialCountAggregateOutputType = {
    id: number
    credentialId: number
    publicKey: number
    counter: number
    transports: number
    deviceType: number
    backedUp: number
    userId: number
    createdAt: number
    lastUsedAt: number
    _all: number
  }


  export type PasskeyCredentialAvgAggregateInputType = {
    counter?: true
  }

  export type PasskeyCredentialSumAggregateInputType = {
    counter?: true
  }

  export type PasskeyCredentialMinAggregateInputType = {
    id?: true
    credentialId?: true
    publicKey?: true
    counter?: true
    deviceType?: true
    backedUp?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type PasskeyCredentialMaxAggregateInputType = {
    id?: true
    credentialId?: true
    publicKey?: true
    counter?: true
    deviceType?: true
    backedUp?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type PasskeyCredentialCountAggregateInputType = {
    id?: true
    credentialId?: true
    publicKey?: true
    counter?: true
    transports?: true
    deviceType?: true
    backedUp?: true
    userId?: true
    createdAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type PasskeyCredentialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasskeyCredential to aggregate.
     */
    where?: PasskeyCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyCredentials to fetch.
     */
    orderBy?: PasskeyCredentialOrderByWithRelationInput | PasskeyCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasskeyCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasskeyCredentials
    **/
    _count?: true | PasskeyCredentialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasskeyCredentialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasskeyCredentialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasskeyCredentialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasskeyCredentialMaxAggregateInputType
  }

  export type GetPasskeyCredentialAggregateType<T extends PasskeyCredentialAggregateArgs> = {
        [P in keyof T & keyof AggregatePasskeyCredential]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasskeyCredential[P]>
      : GetScalarType<T[P], AggregatePasskeyCredential[P]>
  }




  export type PasskeyCredentialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasskeyCredentialWhereInput
    orderBy?: PasskeyCredentialOrderByWithAggregationInput | PasskeyCredentialOrderByWithAggregationInput[]
    by: PasskeyCredentialScalarFieldEnum[] | PasskeyCredentialScalarFieldEnum
    having?: PasskeyCredentialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasskeyCredentialCountAggregateInputType | true
    _avg?: PasskeyCredentialAvgAggregateInputType
    _sum?: PasskeyCredentialSumAggregateInputType
    _min?: PasskeyCredentialMinAggregateInputType
    _max?: PasskeyCredentialMaxAggregateInputType
  }

  export type PasskeyCredentialGroupByOutputType = {
    id: string
    credentialId: string
    publicKey: Bytes
    counter: bigint
    transports: JsonValue | null
    deviceType: string | null
    backedUp: boolean
    userId: string
    createdAt: Date
    lastUsedAt: Date | null
    _count: PasskeyCredentialCountAggregateOutputType | null
    _avg: PasskeyCredentialAvgAggregateOutputType | null
    _sum: PasskeyCredentialSumAggregateOutputType | null
    _min: PasskeyCredentialMinAggregateOutputType | null
    _max: PasskeyCredentialMaxAggregateOutputType | null
  }

  type GetPasskeyCredentialGroupByPayload<T extends PasskeyCredentialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasskeyCredentialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasskeyCredentialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasskeyCredentialGroupByOutputType[P]>
            : GetScalarType<T[P], PasskeyCredentialGroupByOutputType[P]>
        }
      >
    >


  export type PasskeyCredentialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    credentialId?: boolean
    publicKey?: boolean
    counter?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passkeyCredential"]>

  export type PasskeyCredentialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    credentialId?: boolean
    publicKey?: boolean
    counter?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passkeyCredential"]>

  export type PasskeyCredentialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    credentialId?: boolean
    publicKey?: boolean
    counter?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passkeyCredential"]>

  export type PasskeyCredentialSelectScalar = {
    id?: boolean
    credentialId?: boolean
    publicKey?: boolean
    counter?: boolean
    transports?: boolean
    deviceType?: boolean
    backedUp?: boolean
    userId?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }

  export type PasskeyCredentialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "credentialId" | "publicKey" | "counter" | "transports" | "deviceType" | "backedUp" | "userId" | "createdAt" | "lastUsedAt", ExtArgs["result"]["passkeyCredential"]>
  export type PasskeyCredentialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type PasskeyCredentialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type PasskeyCredentialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }

  export type $PasskeyCredentialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasskeyCredential"
    objects: {
      user: Prisma.$AuthUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      credentialId: string
      publicKey: Prisma.Bytes
      counter: bigint
      transports: Prisma.JsonValue | null
      deviceType: string | null
      backedUp: boolean
      userId: string
      createdAt: Date
      lastUsedAt: Date | null
    }, ExtArgs["result"]["passkeyCredential"]>
    composites: {}
  }

  type PasskeyCredentialGetPayload<S extends boolean | null | undefined | PasskeyCredentialDefaultArgs> = $Result.GetResult<Prisma.$PasskeyCredentialPayload, S>

  type PasskeyCredentialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasskeyCredentialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasskeyCredentialCountAggregateInputType | true
    }

  export interface PasskeyCredentialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasskeyCredential'], meta: { name: 'PasskeyCredential' } }
    /**
     * Find zero or one PasskeyCredential that matches the filter.
     * @param {PasskeyCredentialFindUniqueArgs} args - Arguments to find a PasskeyCredential
     * @example
     * // Get one PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasskeyCredentialFindUniqueArgs>(args: SelectSubset<T, PasskeyCredentialFindUniqueArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasskeyCredential that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasskeyCredentialFindUniqueOrThrowArgs} args - Arguments to find a PasskeyCredential
     * @example
     * // Get one PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasskeyCredentialFindUniqueOrThrowArgs>(args: SelectSubset<T, PasskeyCredentialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasskeyCredential that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialFindFirstArgs} args - Arguments to find a PasskeyCredential
     * @example
     * // Get one PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasskeyCredentialFindFirstArgs>(args?: SelectSubset<T, PasskeyCredentialFindFirstArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasskeyCredential that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialFindFirstOrThrowArgs} args - Arguments to find a PasskeyCredential
     * @example
     * // Get one PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasskeyCredentialFindFirstOrThrowArgs>(args?: SelectSubset<T, PasskeyCredentialFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasskeyCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasskeyCredentials
     * const passkeyCredentials = await prisma.passkeyCredential.findMany()
     * 
     * // Get first 10 PasskeyCredentials
     * const passkeyCredentials = await prisma.passkeyCredential.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passkeyCredentialWithIdOnly = await prisma.passkeyCredential.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasskeyCredentialFindManyArgs>(args?: SelectSubset<T, PasskeyCredentialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasskeyCredential.
     * @param {PasskeyCredentialCreateArgs} args - Arguments to create a PasskeyCredential.
     * @example
     * // Create one PasskeyCredential
     * const PasskeyCredential = await prisma.passkeyCredential.create({
     *   data: {
     *     // ... data to create a PasskeyCredential
     *   }
     * })
     * 
     */
    create<T extends PasskeyCredentialCreateArgs>(args: SelectSubset<T, PasskeyCredentialCreateArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasskeyCredentials.
     * @param {PasskeyCredentialCreateManyArgs} args - Arguments to create many PasskeyCredentials.
     * @example
     * // Create many PasskeyCredentials
     * const passkeyCredential = await prisma.passkeyCredential.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasskeyCredentialCreateManyArgs>(args?: SelectSubset<T, PasskeyCredentialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasskeyCredentials and returns the data saved in the database.
     * @param {PasskeyCredentialCreateManyAndReturnArgs} args - Arguments to create many PasskeyCredentials.
     * @example
     * // Create many PasskeyCredentials
     * const passkeyCredential = await prisma.passkeyCredential.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasskeyCredentials and only return the `id`
     * const passkeyCredentialWithIdOnly = await prisma.passkeyCredential.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasskeyCredentialCreateManyAndReturnArgs>(args?: SelectSubset<T, PasskeyCredentialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasskeyCredential.
     * @param {PasskeyCredentialDeleteArgs} args - Arguments to delete one PasskeyCredential.
     * @example
     * // Delete one PasskeyCredential
     * const PasskeyCredential = await prisma.passkeyCredential.delete({
     *   where: {
     *     // ... filter to delete one PasskeyCredential
     *   }
     * })
     * 
     */
    delete<T extends PasskeyCredentialDeleteArgs>(args: SelectSubset<T, PasskeyCredentialDeleteArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasskeyCredential.
     * @param {PasskeyCredentialUpdateArgs} args - Arguments to update one PasskeyCredential.
     * @example
     * // Update one PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasskeyCredentialUpdateArgs>(args: SelectSubset<T, PasskeyCredentialUpdateArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasskeyCredentials.
     * @param {PasskeyCredentialDeleteManyArgs} args - Arguments to filter PasskeyCredentials to delete.
     * @example
     * // Delete a few PasskeyCredentials
     * const { count } = await prisma.passkeyCredential.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasskeyCredentialDeleteManyArgs>(args?: SelectSubset<T, PasskeyCredentialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasskeyCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasskeyCredentials
     * const passkeyCredential = await prisma.passkeyCredential.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasskeyCredentialUpdateManyArgs>(args: SelectSubset<T, PasskeyCredentialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasskeyCredentials and returns the data updated in the database.
     * @param {PasskeyCredentialUpdateManyAndReturnArgs} args - Arguments to update many PasskeyCredentials.
     * @example
     * // Update many PasskeyCredentials
     * const passkeyCredential = await prisma.passkeyCredential.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasskeyCredentials and only return the `id`
     * const passkeyCredentialWithIdOnly = await prisma.passkeyCredential.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasskeyCredentialUpdateManyAndReturnArgs>(args: SelectSubset<T, PasskeyCredentialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasskeyCredential.
     * @param {PasskeyCredentialUpsertArgs} args - Arguments to update or create a PasskeyCredential.
     * @example
     * // Update or create a PasskeyCredential
     * const passkeyCredential = await prisma.passkeyCredential.upsert({
     *   create: {
     *     // ... data to create a PasskeyCredential
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasskeyCredential we want to update
     *   }
     * })
     */
    upsert<T extends PasskeyCredentialUpsertArgs>(args: SelectSubset<T, PasskeyCredentialUpsertArgs<ExtArgs>>): Prisma__PasskeyCredentialClient<$Result.GetResult<Prisma.$PasskeyCredentialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasskeyCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialCountArgs} args - Arguments to filter PasskeyCredentials to count.
     * @example
     * // Count the number of PasskeyCredentials
     * const count = await prisma.passkeyCredential.count({
     *   where: {
     *     // ... the filter for the PasskeyCredentials we want to count
     *   }
     * })
    **/
    count<T extends PasskeyCredentialCountArgs>(
      args?: Subset<T, PasskeyCredentialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasskeyCredentialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasskeyCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasskeyCredentialAggregateArgs>(args: Subset<T, PasskeyCredentialAggregateArgs>): Prisma.PrismaPromise<GetPasskeyCredentialAggregateType<T>>

    /**
     * Group by PasskeyCredential.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyCredentialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasskeyCredentialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasskeyCredentialGroupByArgs['orderBy'] }
        : { orderBy?: PasskeyCredentialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasskeyCredentialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasskeyCredentialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasskeyCredential model
   */
  readonly fields: PasskeyCredentialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasskeyCredential.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasskeyCredentialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuthUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthUserDefaultArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasskeyCredential model
   */
  interface PasskeyCredentialFieldRefs {
    readonly id: FieldRef<"PasskeyCredential", 'String'>
    readonly credentialId: FieldRef<"PasskeyCredential", 'String'>
    readonly publicKey: FieldRef<"PasskeyCredential", 'Bytes'>
    readonly counter: FieldRef<"PasskeyCredential", 'BigInt'>
    readonly transports: FieldRef<"PasskeyCredential", 'Json'>
    readonly deviceType: FieldRef<"PasskeyCredential", 'String'>
    readonly backedUp: FieldRef<"PasskeyCredential", 'Boolean'>
    readonly userId: FieldRef<"PasskeyCredential", 'String'>
    readonly createdAt: FieldRef<"PasskeyCredential", 'DateTime'>
    readonly lastUsedAt: FieldRef<"PasskeyCredential", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasskeyCredential findUnique
   */
  export type PasskeyCredentialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter, which PasskeyCredential to fetch.
     */
    where: PasskeyCredentialWhereUniqueInput
  }

  /**
   * PasskeyCredential findUniqueOrThrow
   */
  export type PasskeyCredentialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter, which PasskeyCredential to fetch.
     */
    where: PasskeyCredentialWhereUniqueInput
  }

  /**
   * PasskeyCredential findFirst
   */
  export type PasskeyCredentialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter, which PasskeyCredential to fetch.
     */
    where?: PasskeyCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyCredentials to fetch.
     */
    orderBy?: PasskeyCredentialOrderByWithRelationInput | PasskeyCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasskeyCredentials.
     */
    cursor?: PasskeyCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasskeyCredentials.
     */
    distinct?: PasskeyCredentialScalarFieldEnum | PasskeyCredentialScalarFieldEnum[]
  }

  /**
   * PasskeyCredential findFirstOrThrow
   */
  export type PasskeyCredentialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter, which PasskeyCredential to fetch.
     */
    where?: PasskeyCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyCredentials to fetch.
     */
    orderBy?: PasskeyCredentialOrderByWithRelationInput | PasskeyCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasskeyCredentials.
     */
    cursor?: PasskeyCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasskeyCredentials.
     */
    distinct?: PasskeyCredentialScalarFieldEnum | PasskeyCredentialScalarFieldEnum[]
  }

  /**
   * PasskeyCredential findMany
   */
  export type PasskeyCredentialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter, which PasskeyCredentials to fetch.
     */
    where?: PasskeyCredentialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyCredentials to fetch.
     */
    orderBy?: PasskeyCredentialOrderByWithRelationInput | PasskeyCredentialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasskeyCredentials.
     */
    cursor?: PasskeyCredentialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyCredentials.
     */
    skip?: number
    distinct?: PasskeyCredentialScalarFieldEnum | PasskeyCredentialScalarFieldEnum[]
  }

  /**
   * PasskeyCredential create
   */
  export type PasskeyCredentialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * The data needed to create a PasskeyCredential.
     */
    data: XOR<PasskeyCredentialCreateInput, PasskeyCredentialUncheckedCreateInput>
  }

  /**
   * PasskeyCredential createMany
   */
  export type PasskeyCredentialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasskeyCredentials.
     */
    data: PasskeyCredentialCreateManyInput | PasskeyCredentialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasskeyCredential createManyAndReturn
   */
  export type PasskeyCredentialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * The data used to create many PasskeyCredentials.
     */
    data: PasskeyCredentialCreateManyInput | PasskeyCredentialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasskeyCredential update
   */
  export type PasskeyCredentialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * The data needed to update a PasskeyCredential.
     */
    data: XOR<PasskeyCredentialUpdateInput, PasskeyCredentialUncheckedUpdateInput>
    /**
     * Choose, which PasskeyCredential to update.
     */
    where: PasskeyCredentialWhereUniqueInput
  }

  /**
   * PasskeyCredential updateMany
   */
  export type PasskeyCredentialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasskeyCredentials.
     */
    data: XOR<PasskeyCredentialUpdateManyMutationInput, PasskeyCredentialUncheckedUpdateManyInput>
    /**
     * Filter which PasskeyCredentials to update
     */
    where?: PasskeyCredentialWhereInput
    /**
     * Limit how many PasskeyCredentials to update.
     */
    limit?: number
  }

  /**
   * PasskeyCredential updateManyAndReturn
   */
  export type PasskeyCredentialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * The data used to update PasskeyCredentials.
     */
    data: XOR<PasskeyCredentialUpdateManyMutationInput, PasskeyCredentialUncheckedUpdateManyInput>
    /**
     * Filter which PasskeyCredentials to update
     */
    where?: PasskeyCredentialWhereInput
    /**
     * Limit how many PasskeyCredentials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasskeyCredential upsert
   */
  export type PasskeyCredentialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * The filter to search for the PasskeyCredential to update in case it exists.
     */
    where: PasskeyCredentialWhereUniqueInput
    /**
     * In case the PasskeyCredential found by the `where` argument doesn't exist, create a new PasskeyCredential with this data.
     */
    create: XOR<PasskeyCredentialCreateInput, PasskeyCredentialUncheckedCreateInput>
    /**
     * In case the PasskeyCredential was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasskeyCredentialUpdateInput, PasskeyCredentialUncheckedUpdateInput>
  }

  /**
   * PasskeyCredential delete
   */
  export type PasskeyCredentialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
    /**
     * Filter which PasskeyCredential to delete.
     */
    where: PasskeyCredentialWhereUniqueInput
  }

  /**
   * PasskeyCredential deleteMany
   */
  export type PasskeyCredentialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasskeyCredentials to delete
     */
    where?: PasskeyCredentialWhereInput
    /**
     * Limit how many PasskeyCredentials to delete.
     */
    limit?: number
  }

  /**
   * PasskeyCredential without action
   */
  export type PasskeyCredentialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyCredential
     */
    select?: PasskeyCredentialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyCredential
     */
    omit?: PasskeyCredentialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasskeyCredentialInclude<ExtArgs> | null
  }


  /**
   * Model PasskeyChallenge
   */

  export type AggregatePasskeyChallenge = {
    _count: PasskeyChallengeCountAggregateOutputType | null
    _min: PasskeyChallengeMinAggregateOutputType | null
    _max: PasskeyChallengeMaxAggregateOutputType | null
  }

  export type PasskeyChallengeMinAggregateOutputType = {
    id: string | null
    email: string | null
    challenge: string | null
    type: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasskeyChallengeMaxAggregateOutputType = {
    id: string | null
    email: string | null
    challenge: string | null
    type: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasskeyChallengeCountAggregateOutputType = {
    id: number
    email: number
    challenge: number
    type: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type PasskeyChallengeMinAggregateInputType = {
    id?: true
    email?: true
    challenge?: true
    type?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasskeyChallengeMaxAggregateInputType = {
    id?: true
    email?: true
    challenge?: true
    type?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasskeyChallengeCountAggregateInputType = {
    id?: true
    email?: true
    challenge?: true
    type?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasskeyChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasskeyChallenge to aggregate.
     */
    where?: PasskeyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyChallenges to fetch.
     */
    orderBy?: PasskeyChallengeOrderByWithRelationInput | PasskeyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasskeyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasskeyChallenges
    **/
    _count?: true | PasskeyChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasskeyChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasskeyChallengeMaxAggregateInputType
  }

  export type GetPasskeyChallengeAggregateType<T extends PasskeyChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregatePasskeyChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasskeyChallenge[P]>
      : GetScalarType<T[P], AggregatePasskeyChallenge[P]>
  }




  export type PasskeyChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasskeyChallengeWhereInput
    orderBy?: PasskeyChallengeOrderByWithAggregationInput | PasskeyChallengeOrderByWithAggregationInput[]
    by: PasskeyChallengeScalarFieldEnum[] | PasskeyChallengeScalarFieldEnum
    having?: PasskeyChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasskeyChallengeCountAggregateInputType | true
    _min?: PasskeyChallengeMinAggregateInputType
    _max?: PasskeyChallengeMaxAggregateInputType
  }

  export type PasskeyChallengeGroupByOutputType = {
    id: string
    email: string
    challenge: string
    type: string
    expiresAt: Date
    createdAt: Date
    _count: PasskeyChallengeCountAggregateOutputType | null
    _min: PasskeyChallengeMinAggregateOutputType | null
    _max: PasskeyChallengeMaxAggregateOutputType | null
  }

  type GetPasskeyChallengeGroupByPayload<T extends PasskeyChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasskeyChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasskeyChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasskeyChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], PasskeyChallengeGroupByOutputType[P]>
        }
      >
    >


  export type PasskeyChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    challenge?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passkeyChallenge"]>

  export type PasskeyChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    challenge?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passkeyChallenge"]>

  export type PasskeyChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    challenge?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passkeyChallenge"]>

  export type PasskeyChallengeSelectScalar = {
    id?: boolean
    email?: boolean
    challenge?: boolean
    type?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type PasskeyChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "challenge" | "type" | "expiresAt" | "createdAt", ExtArgs["result"]["passkeyChallenge"]>

  export type $PasskeyChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasskeyChallenge"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      challenge: string
      type: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["passkeyChallenge"]>
    composites: {}
  }

  type PasskeyChallengeGetPayload<S extends boolean | null | undefined | PasskeyChallengeDefaultArgs> = $Result.GetResult<Prisma.$PasskeyChallengePayload, S>

  type PasskeyChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasskeyChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasskeyChallengeCountAggregateInputType | true
    }

  export interface PasskeyChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasskeyChallenge'], meta: { name: 'PasskeyChallenge' } }
    /**
     * Find zero or one PasskeyChallenge that matches the filter.
     * @param {PasskeyChallengeFindUniqueArgs} args - Arguments to find a PasskeyChallenge
     * @example
     * // Get one PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasskeyChallengeFindUniqueArgs>(args: SelectSubset<T, PasskeyChallengeFindUniqueArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasskeyChallenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasskeyChallengeFindUniqueOrThrowArgs} args - Arguments to find a PasskeyChallenge
     * @example
     * // Get one PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasskeyChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, PasskeyChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasskeyChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeFindFirstArgs} args - Arguments to find a PasskeyChallenge
     * @example
     * // Get one PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasskeyChallengeFindFirstArgs>(args?: SelectSubset<T, PasskeyChallengeFindFirstArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasskeyChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeFindFirstOrThrowArgs} args - Arguments to find a PasskeyChallenge
     * @example
     * // Get one PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasskeyChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, PasskeyChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasskeyChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasskeyChallenges
     * const passkeyChallenges = await prisma.passkeyChallenge.findMany()
     * 
     * // Get first 10 PasskeyChallenges
     * const passkeyChallenges = await prisma.passkeyChallenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passkeyChallengeWithIdOnly = await prisma.passkeyChallenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasskeyChallengeFindManyArgs>(args?: SelectSubset<T, PasskeyChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasskeyChallenge.
     * @param {PasskeyChallengeCreateArgs} args - Arguments to create a PasskeyChallenge.
     * @example
     * // Create one PasskeyChallenge
     * const PasskeyChallenge = await prisma.passkeyChallenge.create({
     *   data: {
     *     // ... data to create a PasskeyChallenge
     *   }
     * })
     * 
     */
    create<T extends PasskeyChallengeCreateArgs>(args: SelectSubset<T, PasskeyChallengeCreateArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasskeyChallenges.
     * @param {PasskeyChallengeCreateManyArgs} args - Arguments to create many PasskeyChallenges.
     * @example
     * // Create many PasskeyChallenges
     * const passkeyChallenge = await prisma.passkeyChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasskeyChallengeCreateManyArgs>(args?: SelectSubset<T, PasskeyChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasskeyChallenges and returns the data saved in the database.
     * @param {PasskeyChallengeCreateManyAndReturnArgs} args - Arguments to create many PasskeyChallenges.
     * @example
     * // Create many PasskeyChallenges
     * const passkeyChallenge = await prisma.passkeyChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasskeyChallenges and only return the `id`
     * const passkeyChallengeWithIdOnly = await prisma.passkeyChallenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasskeyChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, PasskeyChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasskeyChallenge.
     * @param {PasskeyChallengeDeleteArgs} args - Arguments to delete one PasskeyChallenge.
     * @example
     * // Delete one PasskeyChallenge
     * const PasskeyChallenge = await prisma.passkeyChallenge.delete({
     *   where: {
     *     // ... filter to delete one PasskeyChallenge
     *   }
     * })
     * 
     */
    delete<T extends PasskeyChallengeDeleteArgs>(args: SelectSubset<T, PasskeyChallengeDeleteArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasskeyChallenge.
     * @param {PasskeyChallengeUpdateArgs} args - Arguments to update one PasskeyChallenge.
     * @example
     * // Update one PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasskeyChallengeUpdateArgs>(args: SelectSubset<T, PasskeyChallengeUpdateArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasskeyChallenges.
     * @param {PasskeyChallengeDeleteManyArgs} args - Arguments to filter PasskeyChallenges to delete.
     * @example
     * // Delete a few PasskeyChallenges
     * const { count } = await prisma.passkeyChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasskeyChallengeDeleteManyArgs>(args?: SelectSubset<T, PasskeyChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasskeyChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasskeyChallenges
     * const passkeyChallenge = await prisma.passkeyChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasskeyChallengeUpdateManyArgs>(args: SelectSubset<T, PasskeyChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasskeyChallenges and returns the data updated in the database.
     * @param {PasskeyChallengeUpdateManyAndReturnArgs} args - Arguments to update many PasskeyChallenges.
     * @example
     * // Update many PasskeyChallenges
     * const passkeyChallenge = await prisma.passkeyChallenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasskeyChallenges and only return the `id`
     * const passkeyChallengeWithIdOnly = await prisma.passkeyChallenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasskeyChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, PasskeyChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasskeyChallenge.
     * @param {PasskeyChallengeUpsertArgs} args - Arguments to update or create a PasskeyChallenge.
     * @example
     * // Update or create a PasskeyChallenge
     * const passkeyChallenge = await prisma.passkeyChallenge.upsert({
     *   create: {
     *     // ... data to create a PasskeyChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasskeyChallenge we want to update
     *   }
     * })
     */
    upsert<T extends PasskeyChallengeUpsertArgs>(args: SelectSubset<T, PasskeyChallengeUpsertArgs<ExtArgs>>): Prisma__PasskeyChallengeClient<$Result.GetResult<Prisma.$PasskeyChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasskeyChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeCountArgs} args - Arguments to filter PasskeyChallenges to count.
     * @example
     * // Count the number of PasskeyChallenges
     * const count = await prisma.passkeyChallenge.count({
     *   where: {
     *     // ... the filter for the PasskeyChallenges we want to count
     *   }
     * })
    **/
    count<T extends PasskeyChallengeCountArgs>(
      args?: Subset<T, PasskeyChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasskeyChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasskeyChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasskeyChallengeAggregateArgs>(args: Subset<T, PasskeyChallengeAggregateArgs>): Prisma.PrismaPromise<GetPasskeyChallengeAggregateType<T>>

    /**
     * Group by PasskeyChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasskeyChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasskeyChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasskeyChallengeGroupByArgs['orderBy'] }
        : { orderBy?: PasskeyChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasskeyChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasskeyChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasskeyChallenge model
   */
  readonly fields: PasskeyChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasskeyChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasskeyChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasskeyChallenge model
   */
  interface PasskeyChallengeFieldRefs {
    readonly id: FieldRef<"PasskeyChallenge", 'String'>
    readonly email: FieldRef<"PasskeyChallenge", 'String'>
    readonly challenge: FieldRef<"PasskeyChallenge", 'String'>
    readonly type: FieldRef<"PasskeyChallenge", 'String'>
    readonly expiresAt: FieldRef<"PasskeyChallenge", 'DateTime'>
    readonly createdAt: FieldRef<"PasskeyChallenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasskeyChallenge findUnique
   */
  export type PasskeyChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter, which PasskeyChallenge to fetch.
     */
    where: PasskeyChallengeWhereUniqueInput
  }

  /**
   * PasskeyChallenge findUniqueOrThrow
   */
  export type PasskeyChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter, which PasskeyChallenge to fetch.
     */
    where: PasskeyChallengeWhereUniqueInput
  }

  /**
   * PasskeyChallenge findFirst
   */
  export type PasskeyChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter, which PasskeyChallenge to fetch.
     */
    where?: PasskeyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyChallenges to fetch.
     */
    orderBy?: PasskeyChallengeOrderByWithRelationInput | PasskeyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasskeyChallenges.
     */
    cursor?: PasskeyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasskeyChallenges.
     */
    distinct?: PasskeyChallengeScalarFieldEnum | PasskeyChallengeScalarFieldEnum[]
  }

  /**
   * PasskeyChallenge findFirstOrThrow
   */
  export type PasskeyChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter, which PasskeyChallenge to fetch.
     */
    where?: PasskeyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyChallenges to fetch.
     */
    orderBy?: PasskeyChallengeOrderByWithRelationInput | PasskeyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasskeyChallenges.
     */
    cursor?: PasskeyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasskeyChallenges.
     */
    distinct?: PasskeyChallengeScalarFieldEnum | PasskeyChallengeScalarFieldEnum[]
  }

  /**
   * PasskeyChallenge findMany
   */
  export type PasskeyChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter, which PasskeyChallenges to fetch.
     */
    where?: PasskeyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasskeyChallenges to fetch.
     */
    orderBy?: PasskeyChallengeOrderByWithRelationInput | PasskeyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasskeyChallenges.
     */
    cursor?: PasskeyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasskeyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasskeyChallenges.
     */
    skip?: number
    distinct?: PasskeyChallengeScalarFieldEnum | PasskeyChallengeScalarFieldEnum[]
  }

  /**
   * PasskeyChallenge create
   */
  export type PasskeyChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * The data needed to create a PasskeyChallenge.
     */
    data: XOR<PasskeyChallengeCreateInput, PasskeyChallengeUncheckedCreateInput>
  }

  /**
   * PasskeyChallenge createMany
   */
  export type PasskeyChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasskeyChallenges.
     */
    data: PasskeyChallengeCreateManyInput | PasskeyChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasskeyChallenge createManyAndReturn
   */
  export type PasskeyChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many PasskeyChallenges.
     */
    data: PasskeyChallengeCreateManyInput | PasskeyChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasskeyChallenge update
   */
  export type PasskeyChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * The data needed to update a PasskeyChallenge.
     */
    data: XOR<PasskeyChallengeUpdateInput, PasskeyChallengeUncheckedUpdateInput>
    /**
     * Choose, which PasskeyChallenge to update.
     */
    where: PasskeyChallengeWhereUniqueInput
  }

  /**
   * PasskeyChallenge updateMany
   */
  export type PasskeyChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasskeyChallenges.
     */
    data: XOR<PasskeyChallengeUpdateManyMutationInput, PasskeyChallengeUncheckedUpdateManyInput>
    /**
     * Filter which PasskeyChallenges to update
     */
    where?: PasskeyChallengeWhereInput
    /**
     * Limit how many PasskeyChallenges to update.
     */
    limit?: number
  }

  /**
   * PasskeyChallenge updateManyAndReturn
   */
  export type PasskeyChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * The data used to update PasskeyChallenges.
     */
    data: XOR<PasskeyChallengeUpdateManyMutationInput, PasskeyChallengeUncheckedUpdateManyInput>
    /**
     * Filter which PasskeyChallenges to update
     */
    where?: PasskeyChallengeWhereInput
    /**
     * Limit how many PasskeyChallenges to update.
     */
    limit?: number
  }

  /**
   * PasskeyChallenge upsert
   */
  export type PasskeyChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * The filter to search for the PasskeyChallenge to update in case it exists.
     */
    where: PasskeyChallengeWhereUniqueInput
    /**
     * In case the PasskeyChallenge found by the `where` argument doesn't exist, create a new PasskeyChallenge with this data.
     */
    create: XOR<PasskeyChallengeCreateInput, PasskeyChallengeUncheckedCreateInput>
    /**
     * In case the PasskeyChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasskeyChallengeUpdateInput, PasskeyChallengeUncheckedUpdateInput>
  }

  /**
   * PasskeyChallenge delete
   */
  export type PasskeyChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
    /**
     * Filter which PasskeyChallenge to delete.
     */
    where: PasskeyChallengeWhereUniqueInput
  }

  /**
   * PasskeyChallenge deleteMany
   */
  export type PasskeyChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasskeyChallenges to delete
     */
    where?: PasskeyChallengeWhereInput
    /**
     * Limit how many PasskeyChallenges to delete.
     */
    limit?: number
  }

  /**
   * PasskeyChallenge without action
   */
  export type PasskeyChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasskeyChallenge
     */
    select?: PasskeyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasskeyChallenge
     */
    omit?: PasskeyChallengeOmit<ExtArgs> | null
  }


  /**
   * Model AuthSession
   */

  export type AggregateAuthSession = {
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  export type AuthSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    refreshTokenId: string | null
    deviceFingerprint: string | null
    ipPrefix: string | null
    expiresAt: Date | null
    rotatedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type AuthSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshTokenHash: string | null
    refreshTokenId: string | null
    deviceFingerprint: string | null
    ipPrefix: string | null
    expiresAt: Date | null
    rotatedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type AuthSessionCountAggregateOutputType = {
    id: number
    userId: number
    refreshTokenHash: number
    refreshTokenId: number
    deviceFingerprint: number
    ipPrefix: number
    expiresAt: number
    rotatedAt: number
    revokedAt: number
    createdAt: number
    _all: number
  }


  export type AuthSessionMinAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    refreshTokenId?: true
    deviceFingerprint?: true
    ipPrefix?: true
    expiresAt?: true
    rotatedAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type AuthSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    refreshTokenId?: true
    deviceFingerprint?: true
    ipPrefix?: true
    expiresAt?: true
    rotatedAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type AuthSessionCountAggregateInputType = {
    id?: true
    userId?: true
    refreshTokenHash?: true
    refreshTokenId?: true
    deviceFingerprint?: true
    ipPrefix?: true
    expiresAt?: true
    rotatedAt?: true
    revokedAt?: true
    createdAt?: true
    _all?: true
  }

  export type AuthSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSession to aggregate.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthSessions
    **/
    _count?: true | AuthSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthSessionMaxAggregateInputType
  }

  export type GetAuthSessionAggregateType<T extends AuthSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthSession[P]>
      : GetScalarType<T[P], AggregateAuthSession[P]>
  }




  export type AuthSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithAggregationInput | AuthSessionOrderByWithAggregationInput[]
    by: AuthSessionScalarFieldEnum[] | AuthSessionScalarFieldEnum
    having?: AuthSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthSessionCountAggregateInputType | true
    _min?: AuthSessionMinAggregateInputType
    _max?: AuthSessionMaxAggregateInputType
  }

  export type AuthSessionGroupByOutputType = {
    id: string
    userId: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix: string | null
    expiresAt: Date
    rotatedAt: Date
    revokedAt: Date | null
    createdAt: Date
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  type GetAuthSessionGroupByPayload<T extends AuthSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
        }
      >
    >


  export type AuthSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    refreshTokenId?: boolean
    deviceFingerprint?: boolean
    ipPrefix?: boolean
    expiresAt?: boolean
    rotatedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    refreshTokenId?: boolean
    deviceFingerprint?: boolean
    ipPrefix?: boolean
    expiresAt?: boolean
    rotatedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    refreshTokenId?: boolean
    deviceFingerprint?: boolean
    ipPrefix?: boolean
    expiresAt?: boolean
    rotatedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshTokenHash?: boolean
    refreshTokenId?: boolean
    deviceFingerprint?: boolean
    ipPrefix?: boolean
    expiresAt?: boolean
    rotatedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }

  export type AuthSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshTokenHash" | "refreshTokenId" | "deviceFingerprint" | "ipPrefix" | "expiresAt" | "rotatedAt" | "revokedAt" | "createdAt", ExtArgs["result"]["authSession"]>
  export type AuthSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }

  export type $AuthSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthSession"
    objects: {
      user: Prisma.$AuthUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshTokenHash: string
      refreshTokenId: string
      deviceFingerprint: string
      ipPrefix: string | null
      expiresAt: Date
      rotatedAt: Date
      revokedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["authSession"]>
    composites: {}
  }

  type AuthSessionGetPayload<S extends boolean | null | undefined | AuthSessionDefaultArgs> = $Result.GetResult<Prisma.$AuthSessionPayload, S>

  type AuthSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthSessionCountAggregateInputType | true
    }

  export interface AuthSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthSession'], meta: { name: 'AuthSession' } }
    /**
     * Find zero or one AuthSession that matches the filter.
     * @param {AuthSessionFindUniqueArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthSessionFindUniqueArgs>(args: SelectSubset<T, AuthSessionFindUniqueArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthSessionFindUniqueOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthSessionFindFirstArgs>(args?: SelectSubset<T, AuthSessionFindFirstArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthSessions
     * const authSessions = await prisma.authSession.findMany()
     * 
     * // Get first 10 AuthSessions
     * const authSessions = await prisma.authSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authSessionWithIdOnly = await prisma.authSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthSessionFindManyArgs>(args?: SelectSubset<T, AuthSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthSession.
     * @param {AuthSessionCreateArgs} args - Arguments to create a AuthSession.
     * @example
     * // Create one AuthSession
     * const AuthSession = await prisma.authSession.create({
     *   data: {
     *     // ... data to create a AuthSession
     *   }
     * })
     * 
     */
    create<T extends AuthSessionCreateArgs>(args: SelectSubset<T, AuthSessionCreateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthSessions.
     * @param {AuthSessionCreateManyArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthSessionCreateManyArgs>(args?: SelectSubset<T, AuthSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthSessions and returns the data saved in the database.
     * @param {AuthSessionCreateManyAndReturnArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthSession.
     * @param {AuthSessionDeleteArgs} args - Arguments to delete one AuthSession.
     * @example
     * // Delete one AuthSession
     * const AuthSession = await prisma.authSession.delete({
     *   where: {
     *     // ... filter to delete one AuthSession
     *   }
     * })
     * 
     */
    delete<T extends AuthSessionDeleteArgs>(args: SelectSubset<T, AuthSessionDeleteArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthSession.
     * @param {AuthSessionUpdateArgs} args - Arguments to update one AuthSession.
     * @example
     * // Update one AuthSession
     * const authSession = await prisma.authSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthSessionUpdateArgs>(args: SelectSubset<T, AuthSessionUpdateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthSessions.
     * @param {AuthSessionDeleteManyArgs} args - Arguments to filter AuthSessions to delete.
     * @example
     * // Delete a few AuthSessions
     * const { count } = await prisma.authSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthSessionDeleteManyArgs>(args?: SelectSubset<T, AuthSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthSessionUpdateManyArgs>(args: SelectSubset<T, AuthSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions and returns the data updated in the database.
     * @param {AuthSessionUpdateManyAndReturnArgs} args - Arguments to update many AuthSessions.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthSession.
     * @param {AuthSessionUpsertArgs} args - Arguments to update or create a AuthSession.
     * @example
     * // Update or create a AuthSession
     * const authSession = await prisma.authSession.upsert({
     *   create: {
     *     // ... data to create a AuthSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthSession we want to update
     *   }
     * })
     */
    upsert<T extends AuthSessionUpsertArgs>(args: SelectSubset<T, AuthSessionUpsertArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionCountArgs} args - Arguments to filter AuthSessions to count.
     * @example
     * // Count the number of AuthSessions
     * const count = await prisma.authSession.count({
     *   where: {
     *     // ... the filter for the AuthSessions we want to count
     *   }
     * })
    **/
    count<T extends AuthSessionCountArgs>(
      args?: Subset<T, AuthSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthSessionAggregateArgs>(args: Subset<T, AuthSessionAggregateArgs>): Prisma.PrismaPromise<GetAuthSessionAggregateType<T>>

    /**
     * Group by AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthSessionGroupByArgs['orderBy'] }
        : { orderBy?: AuthSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthSession model
   */
  readonly fields: AuthSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuthUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthUserDefaultArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthSession model
   */
  interface AuthSessionFieldRefs {
    readonly id: FieldRef<"AuthSession", 'String'>
    readonly userId: FieldRef<"AuthSession", 'String'>
    readonly refreshTokenHash: FieldRef<"AuthSession", 'String'>
    readonly refreshTokenId: FieldRef<"AuthSession", 'String'>
    readonly deviceFingerprint: FieldRef<"AuthSession", 'String'>
    readonly ipPrefix: FieldRef<"AuthSession", 'String'>
    readonly expiresAt: FieldRef<"AuthSession", 'DateTime'>
    readonly rotatedAt: FieldRef<"AuthSession", 'DateTime'>
    readonly revokedAt: FieldRef<"AuthSession", 'DateTime'>
    readonly createdAt: FieldRef<"AuthSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthSession findUnique
   */
  export type AuthSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findUniqueOrThrow
   */
  export type AuthSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findFirst
   */
  export type AuthSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findFirstOrThrow
   */
  export type AuthSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findMany
   */
  export type AuthSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSessions to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession create
   */
  export type AuthSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthSession.
     */
    data: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
  }

  /**
   * AuthSession createMany
   */
  export type AuthSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthSession createManyAndReturn
   */
  export type AuthSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession update
   */
  export type AuthSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthSession.
     */
    data: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
    /**
     * Choose, which AuthSession to update.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession updateMany
   */
  export type AuthSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
  }

  /**
   * AuthSession updateManyAndReturn
   */
  export type AuthSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession upsert
   */
  export type AuthSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthSession to update in case it exists.
     */
    where: AuthSessionWhereUniqueInput
    /**
     * In case the AuthSession found by the `where` argument doesn't exist, create a new AuthSession with this data.
     */
    create: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
    /**
     * In case the AuthSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
  }

  /**
   * AuthSession delete
   */
  export type AuthSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter which AuthSession to delete.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession deleteMany
   */
  export type AuthSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSessions to delete
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to delete.
     */
    limit?: number
  }

  /**
   * AuthSession without action
   */
  export type AuthSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
  }


  /**
   * Model PasswordReset
   */

  export type AggregatePasswordReset = {
    _count: PasswordResetCountAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  export type PasswordResetMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordReset to aggregate.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResets
    **/
    _count?: true | PasswordResetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetMaxAggregateInputType
  }

  export type GetPasswordResetAggregateType<T extends PasswordResetAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordReset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordReset[P]>
      : GetScalarType<T[P], AggregatePasswordReset[P]>
  }




  export type PasswordResetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetWhereInput
    orderBy?: PasswordResetOrderByWithAggregationInput | PasswordResetOrderByWithAggregationInput[]
    by: PasswordResetScalarFieldEnum[] | PasswordResetScalarFieldEnum
    having?: PasswordResetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetCountAggregateInputType | true
    _min?: PasswordResetMinAggregateInputType
    _max?: PasswordResetMaxAggregateInputType
  }

  export type PasswordResetGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: PasswordResetCountAggregateOutputType | null
    _min: PasswordResetMinAggregateOutputType | null
    _max: PasswordResetMaxAggregateOutputType | null
  }

  type GetPasswordResetGroupByPayload<T extends PasswordResetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordReset"]>

  export type PasswordResetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordReset"]>

  export type PasswordResetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordReset"]>

  export type PasswordResetSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "expiresAt" | "usedAt" | "createdAt", ExtArgs["result"]["passwordReset"]>
  export type PasswordResetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type PasswordResetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }
  export type PasswordResetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuthUserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordReset"
    objects: {
      user: Prisma.$AuthUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["passwordReset"]>
    composites: {}
  }

  type PasswordResetGetPayload<S extends boolean | null | undefined | PasswordResetDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetPayload, S>

  type PasswordResetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetCountAggregateInputType | true
    }

  export interface PasswordResetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordReset'], meta: { name: 'PasswordReset' } }
    /**
     * Find zero or one PasswordReset that matches the filter.
     * @param {PasswordResetFindUniqueArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetFindUniqueArgs>(args: SelectSubset<T, PasswordResetFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordReset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetFindUniqueOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordReset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetFindFirstArgs>(args?: SelectSubset<T, PasswordResetFindFirstArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordReset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindFirstOrThrowArgs} args - Arguments to find a PasswordReset
     * @example
     * // Get one PasswordReset
     * const passwordReset = await prisma.passwordReset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany()
     * 
     * // Get first 10 PasswordResets
     * const passwordResets = await prisma.passwordReset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetFindManyArgs>(args?: SelectSubset<T, PasswordResetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordReset.
     * @param {PasswordResetCreateArgs} args - Arguments to create a PasswordReset.
     * @example
     * // Create one PasswordReset
     * const PasswordReset = await prisma.passwordReset.create({
     *   data: {
     *     // ... data to create a PasswordReset
     *   }
     * })
     * 
     */
    create<T extends PasswordResetCreateArgs>(args: SelectSubset<T, PasswordResetCreateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResets.
     * @param {PasswordResetCreateManyArgs} args - Arguments to create many PasswordResets.
     * @example
     * // Create many PasswordResets
     * const passwordReset = await prisma.passwordReset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetCreateManyArgs>(args?: SelectSubset<T, PasswordResetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResets and returns the data saved in the database.
     * @param {PasswordResetCreateManyAndReturnArgs} args - Arguments to create many PasswordResets.
     * @example
     * // Create many PasswordResets
     * const passwordReset = await prisma.passwordReset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResets and only return the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordReset.
     * @param {PasswordResetDeleteArgs} args - Arguments to delete one PasswordReset.
     * @example
     * // Delete one PasswordReset
     * const PasswordReset = await prisma.passwordReset.delete({
     *   where: {
     *     // ... filter to delete one PasswordReset
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetDeleteArgs>(args: SelectSubset<T, PasswordResetDeleteArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordReset.
     * @param {PasswordResetUpdateArgs} args - Arguments to update one PasswordReset.
     * @example
     * // Update one PasswordReset
     * const passwordReset = await prisma.passwordReset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetUpdateArgs>(args: SelectSubset<T, PasswordResetUpdateArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResets.
     * @param {PasswordResetDeleteManyArgs} args - Arguments to filter PasswordResets to delete.
     * @example
     * // Delete a few PasswordResets
     * const { count } = await prisma.passwordReset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetDeleteManyArgs>(args?: SelectSubset<T, PasswordResetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResets
     * const passwordReset = await prisma.passwordReset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetUpdateManyArgs>(args: SelectSubset<T, PasswordResetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResets and returns the data updated in the database.
     * @param {PasswordResetUpdateManyAndReturnArgs} args - Arguments to update many PasswordResets.
     * @example
     * // Update many PasswordResets
     * const passwordReset = await prisma.passwordReset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResets and only return the `id`
     * const passwordResetWithIdOnly = await prisma.passwordReset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordReset.
     * @param {PasswordResetUpsertArgs} args - Arguments to update or create a PasswordReset.
     * @example
     * // Update or create a PasswordReset
     * const passwordReset = await prisma.passwordReset.upsert({
     *   create: {
     *     // ... data to create a PasswordReset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordReset we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetUpsertArgs>(args: SelectSubset<T, PasswordResetUpsertArgs<ExtArgs>>): Prisma__PasswordResetClient<$Result.GetResult<Prisma.$PasswordResetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCountArgs} args - Arguments to filter PasswordResets to count.
     * @example
     * // Count the number of PasswordResets
     * const count = await prisma.passwordReset.count({
     *   where: {
     *     // ... the filter for the PasswordResets we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetCountArgs>(
      args?: Subset<T, PasswordResetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetAggregateArgs>(args: Subset<T, PasswordResetAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetAggregateType<T>>

    /**
     * Group by PasswordReset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordReset model
   */
  readonly fields: PasswordResetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordReset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuthUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthUserDefaultArgs<ExtArgs>>): Prisma__AuthUserClient<$Result.GetResult<Prisma.$AuthUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordReset model
   */
  interface PasswordResetFieldRefs {
    readonly id: FieldRef<"PasswordReset", 'String'>
    readonly userId: FieldRef<"PasswordReset", 'String'>
    readonly tokenHash: FieldRef<"PasswordReset", 'String'>
    readonly expiresAt: FieldRef<"PasswordReset", 'DateTime'>
    readonly usedAt: FieldRef<"PasswordReset", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordReset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordReset findUnique
   */
  export type PasswordResetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findUniqueOrThrow
   */
  export type PasswordResetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset findFirst
   */
  export type PasswordResetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findFirstOrThrow
   */
  export type PasswordResetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter, which PasswordReset to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResets.
     */
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset findMany
   */
  export type PasswordResetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResets to fetch.
     */
    where?: PasswordResetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResets to fetch.
     */
    orderBy?: PasswordResetOrderByWithRelationInput | PasswordResetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResets.
     */
    cursor?: PasswordResetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResets.
     */
    skip?: number
    distinct?: PasswordResetScalarFieldEnum | PasswordResetScalarFieldEnum[]
  }

  /**
   * PasswordReset create
   */
  export type PasswordResetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordReset.
     */
    data: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
  }

  /**
   * PasswordReset createMany
   */
  export type PasswordResetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResets.
     */
    data: PasswordResetCreateManyInput | PasswordResetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordReset createManyAndReturn
   */
  export type PasswordResetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResets.
     */
    data: PasswordResetCreateManyInput | PasswordResetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordReset update
   */
  export type PasswordResetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordReset.
     */
    data: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
    /**
     * Choose, which PasswordReset to update.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset updateMany
   */
  export type PasswordResetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResets.
     */
    data: XOR<PasswordResetUpdateManyMutationInput, PasswordResetUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResets to update
     */
    where?: PasswordResetWhereInput
    /**
     * Limit how many PasswordResets to update.
     */
    limit?: number
  }

  /**
   * PasswordReset updateManyAndReturn
   */
  export type PasswordResetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResets.
     */
    data: XOR<PasswordResetUpdateManyMutationInput, PasswordResetUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResets to update
     */
    where?: PasswordResetWhereInput
    /**
     * Limit how many PasswordResets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordReset upsert
   */
  export type PasswordResetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordReset to update in case it exists.
     */
    where: PasswordResetWhereUniqueInput
    /**
     * In case the PasswordReset found by the `where` argument doesn't exist, create a new PasswordReset with this data.
     */
    create: XOR<PasswordResetCreateInput, PasswordResetUncheckedCreateInput>
    /**
     * In case the PasswordReset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetUpdateInput, PasswordResetUncheckedUpdateInput>
  }

  /**
   * PasswordReset delete
   */
  export type PasswordResetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
    /**
     * Filter which PasswordReset to delete.
     */
    where: PasswordResetWhereUniqueInput
  }

  /**
   * PasswordReset deleteMany
   */
  export type PasswordResetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResets to delete
     */
    where?: PasswordResetWhereInput
    /**
     * Limit how many PasswordResets to delete.
     */
    limit?: number
  }

  /**
   * PasswordReset without action
   */
  export type PasswordResetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordReset
     */
    select?: PasswordResetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordReset
     */
    omit?: PasswordResetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetInclude<ExtArgs> | null
  }


  /**
   * Model AuditEvent
   */

  export type AggregateAuditEvent = {
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  export type AuditEventMinAggregateOutputType = {
    id: string | null
    actorId: string | null
    action: string | null
    app: string | null
    createdAt: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    actorId: string | null
    action: string | null
    app: string | null
    createdAt: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    actorId: number
    action: number
    app: number
    createdAt: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    actorId?: true
    action?: true
    app?: true
    createdAt?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    actorId?: true
    action?: true
    app?: true
    createdAt?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    actorId?: true
    action?: true
    app?: true
    createdAt?: true
    _all?: true
  }

  export type AuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvent to aggregate.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditEvents
    **/
    _count?: true | AuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditEventMaxAggregateInputType
  }

  export type GetAuditEventAggregateType<T extends AuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditEvent[P]>
      : GetScalarType<T[P], AggregateAuditEvent[P]>
  }




  export type AuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithAggregationInput | AuditEventOrderByWithAggregationInput[]
    by: AuditEventScalarFieldEnum[] | AuditEventScalarFieldEnum
    having?: AuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditEventCountAggregateInputType | true
    _min?: AuditEventMinAggregateInputType
    _max?: AuditEventMaxAggregateInputType
  }

  export type AuditEventGroupByOutputType = {
    id: string
    actorId: string
    action: string
    app: string
    createdAt: Date
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  type GetAuditEventGroupByPayload<T extends AuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
        }
      >
    >


  export type AuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    action?: boolean
    app?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    action?: boolean
    app?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    action?: boolean
    app?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    actorId?: boolean
    action?: boolean
    app?: boolean
    createdAt?: boolean
  }

  export type AuditEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actorId" | "action" | "app" | "createdAt", ExtArgs["result"]["auditEvent"]>

  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      actorId: string
      action: string
      app: string
      createdAt: Date
    }, ExtArgs["result"]["auditEvent"]>
    composites: {}
  }

  type AuditEventGetPayload<S extends boolean | null | undefined | AuditEventDefaultArgs> = $Result.GetResult<Prisma.$AuditEventPayload, S>

  type AuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditEventCountAggregateInputType | true
    }

  export interface AuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditEvent'], meta: { name: 'AuditEvent' } }
    /**
     * Find zero or one AuditEvent that matches the filter.
     * @param {AuditEventFindUniqueArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditEventFindUniqueArgs>(args: SelectSubset<T, AuditEventFindUniqueArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditEventFindUniqueOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditEventFindFirstArgs>(args?: SelectSubset<T, AuditEventFindFirstArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany()
     * 
     * // Get first 10 AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditEventFindManyArgs>(args?: SelectSubset<T, AuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditEvent.
     * @param {AuditEventCreateArgs} args - Arguments to create a AuditEvent.
     * @example
     * // Create one AuditEvent
     * const AuditEvent = await prisma.auditEvent.create({
     *   data: {
     *     // ... data to create a AuditEvent
     *   }
     * })
     * 
     */
    create<T extends AuditEventCreateArgs>(args: SelectSubset<T, AuditEventCreateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditEvents.
     * @param {AuditEventCreateManyArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditEventCreateManyArgs>(args?: SelectSubset<T, AuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditEvents and returns the data saved in the database.
     * @param {AuditEventCreateManyAndReturnArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditEvent.
     * @param {AuditEventDeleteArgs} args - Arguments to delete one AuditEvent.
     * @example
     * // Delete one AuditEvent
     * const AuditEvent = await prisma.auditEvent.delete({
     *   where: {
     *     // ... filter to delete one AuditEvent
     *   }
     * })
     * 
     */
    delete<T extends AuditEventDeleteArgs>(args: SelectSubset<T, AuditEventDeleteArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditEvent.
     * @param {AuditEventUpdateArgs} args - Arguments to update one AuditEvent.
     * @example
     * // Update one AuditEvent
     * const auditEvent = await prisma.auditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditEventUpdateArgs>(args: SelectSubset<T, AuditEventUpdateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditEvents.
     * @param {AuditEventDeleteManyArgs} args - Arguments to filter AuditEvents to delete.
     * @example
     * // Delete a few AuditEvents
     * const { count } = await prisma.auditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditEventDeleteManyArgs>(args?: SelectSubset<T, AuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditEventUpdateManyArgs>(args: SelectSubset<T, AuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents and returns the data updated in the database.
     * @param {AuditEventUpdateManyAndReturnArgs} args - Arguments to update many AuditEvents.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditEvent.
     * @param {AuditEventUpsertArgs} args - Arguments to update or create a AuditEvent.
     * @example
     * // Update or create a AuditEvent
     * const auditEvent = await prisma.auditEvent.upsert({
     *   create: {
     *     // ... data to create a AuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends AuditEventUpsertArgs>(args: SelectSubset<T, AuditEventUpsertArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventCountArgs} args - Arguments to filter AuditEvents to count.
     * @example
     * // Count the number of AuditEvents
     * const count = await prisma.auditEvent.count({
     *   where: {
     *     // ... the filter for the AuditEvents we want to count
     *   }
     * })
    **/
    count<T extends AuditEventCountArgs>(
      args?: Subset<T, AuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditEventAggregateArgs>(args: Subset<T, AuditEventAggregateArgs>): Prisma.PrismaPromise<GetAuditEventAggregateType<T>>

    /**
     * Group by AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditEventGroupByArgs['orderBy'] }
        : { orderBy?: AuditEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditEvent model
   */
  readonly fields: AuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditEvent model
   */
  interface AuditEventFieldRefs {
    readonly id: FieldRef<"AuditEvent", 'String'>
    readonly actorId: FieldRef<"AuditEvent", 'String'>
    readonly action: FieldRef<"AuditEvent", 'String'>
    readonly app: FieldRef<"AuditEvent", 'String'>
    readonly createdAt: FieldRef<"AuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditEvent findUnique
   */
  export type AuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findUniqueOrThrow
   */
  export type AuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findFirst
   */
  export type AuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findFirstOrThrow
   */
  export type AuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findMany
   */
  export type AuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter, which AuditEvents to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent create
   */
  export type AuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditEvent.
     */
    data: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
  }

  /**
   * AuditEvent createMany
   */
  export type AuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent createManyAndReturn
   */
  export type AuditEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent update
   */
  export type AuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditEvent.
     */
    data: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
    /**
     * Choose, which AuditEvent to update.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent updateMany
   */
  export type AuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
  }

  /**
   * AuditEvent updateManyAndReturn
   */
  export type AuditEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
  }

  /**
   * AuditEvent upsert
   */
  export type AuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditEvent to update in case it exists.
     */
    where: AuditEventWhereUniqueInput
    /**
     * In case the AuditEvent found by the `where` argument doesn't exist, create a new AuditEvent with this data.
     */
    create: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
    /**
     * In case the AuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
  }

  /**
   * AuditEvent delete
   */
  export type AuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Filter which AuditEvent to delete.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent deleteMany
   */
  export type AuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvents to delete
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to delete.
     */
    limit?: number
  }

  /**
   * AuditEvent without action
   */
  export type AuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
  }


  /**
   * Model AppHealthSnapshot
   */

  export type AggregateAppHealthSnapshot = {
    _count: AppHealthSnapshotCountAggregateOutputType | null
    _min: AppHealthSnapshotMinAggregateOutputType | null
    _max: AppHealthSnapshotMaxAggregateOutputType | null
  }

  export type AppHealthSnapshotMinAggregateOutputType = {
    id: string | null
    app: string | null
    status: string | null
    checkedAt: Date | null
  }

  export type AppHealthSnapshotMaxAggregateOutputType = {
    id: string | null
    app: string | null
    status: string | null
    checkedAt: Date | null
  }

  export type AppHealthSnapshotCountAggregateOutputType = {
    id: number
    app: number
    status: number
    details: number
    checkedAt: number
    _all: number
  }


  export type AppHealthSnapshotMinAggregateInputType = {
    id?: true
    app?: true
    status?: true
    checkedAt?: true
  }

  export type AppHealthSnapshotMaxAggregateInputType = {
    id?: true
    app?: true
    status?: true
    checkedAt?: true
  }

  export type AppHealthSnapshotCountAggregateInputType = {
    id?: true
    app?: true
    status?: true
    details?: true
    checkedAt?: true
    _all?: true
  }

  export type AppHealthSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppHealthSnapshot to aggregate.
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppHealthSnapshots to fetch.
     */
    orderBy?: AppHealthSnapshotOrderByWithRelationInput | AppHealthSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppHealthSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppHealthSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppHealthSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppHealthSnapshots
    **/
    _count?: true | AppHealthSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppHealthSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppHealthSnapshotMaxAggregateInputType
  }

  export type GetAppHealthSnapshotAggregateType<T extends AppHealthSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateAppHealthSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppHealthSnapshot[P]>
      : GetScalarType<T[P], AggregateAppHealthSnapshot[P]>
  }




  export type AppHealthSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppHealthSnapshotWhereInput
    orderBy?: AppHealthSnapshotOrderByWithAggregationInput | AppHealthSnapshotOrderByWithAggregationInput[]
    by: AppHealthSnapshotScalarFieldEnum[] | AppHealthSnapshotScalarFieldEnum
    having?: AppHealthSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppHealthSnapshotCountAggregateInputType | true
    _min?: AppHealthSnapshotMinAggregateInputType
    _max?: AppHealthSnapshotMaxAggregateInputType
  }

  export type AppHealthSnapshotGroupByOutputType = {
    id: string
    app: string
    status: string
    details: JsonValue | null
    checkedAt: Date
    _count: AppHealthSnapshotCountAggregateOutputType | null
    _min: AppHealthSnapshotMinAggregateOutputType | null
    _max: AppHealthSnapshotMaxAggregateOutputType | null
  }

  type GetAppHealthSnapshotGroupByPayload<T extends AppHealthSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppHealthSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppHealthSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppHealthSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], AppHealthSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type AppHealthSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    status?: boolean
    details?: boolean
    checkedAt?: boolean
  }, ExtArgs["result"]["appHealthSnapshot"]>

  export type AppHealthSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    status?: boolean
    details?: boolean
    checkedAt?: boolean
  }, ExtArgs["result"]["appHealthSnapshot"]>

  export type AppHealthSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    status?: boolean
    details?: boolean
    checkedAt?: boolean
  }, ExtArgs["result"]["appHealthSnapshot"]>

  export type AppHealthSnapshotSelectScalar = {
    id?: boolean
    app?: boolean
    status?: boolean
    details?: boolean
    checkedAt?: boolean
  }

  export type AppHealthSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "app" | "status" | "details" | "checkedAt", ExtArgs["result"]["appHealthSnapshot"]>

  export type $AppHealthSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppHealthSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      app: string
      status: string
      details: Prisma.JsonValue | null
      checkedAt: Date
    }, ExtArgs["result"]["appHealthSnapshot"]>
    composites: {}
  }

  type AppHealthSnapshotGetPayload<S extends boolean | null | undefined | AppHealthSnapshotDefaultArgs> = $Result.GetResult<Prisma.$AppHealthSnapshotPayload, S>

  type AppHealthSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppHealthSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppHealthSnapshotCountAggregateInputType | true
    }

  export interface AppHealthSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppHealthSnapshot'], meta: { name: 'AppHealthSnapshot' } }
    /**
     * Find zero or one AppHealthSnapshot that matches the filter.
     * @param {AppHealthSnapshotFindUniqueArgs} args - Arguments to find a AppHealthSnapshot
     * @example
     * // Get one AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppHealthSnapshotFindUniqueArgs>(args: SelectSubset<T, AppHealthSnapshotFindUniqueArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppHealthSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppHealthSnapshotFindUniqueOrThrowArgs} args - Arguments to find a AppHealthSnapshot
     * @example
     * // Get one AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppHealthSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, AppHealthSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppHealthSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotFindFirstArgs} args - Arguments to find a AppHealthSnapshot
     * @example
     * // Get one AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppHealthSnapshotFindFirstArgs>(args?: SelectSubset<T, AppHealthSnapshotFindFirstArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppHealthSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotFindFirstOrThrowArgs} args - Arguments to find a AppHealthSnapshot
     * @example
     * // Get one AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppHealthSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, AppHealthSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppHealthSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppHealthSnapshots
     * const appHealthSnapshots = await prisma.appHealthSnapshot.findMany()
     * 
     * // Get first 10 AppHealthSnapshots
     * const appHealthSnapshots = await prisma.appHealthSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appHealthSnapshotWithIdOnly = await prisma.appHealthSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppHealthSnapshotFindManyArgs>(args?: SelectSubset<T, AppHealthSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppHealthSnapshot.
     * @param {AppHealthSnapshotCreateArgs} args - Arguments to create a AppHealthSnapshot.
     * @example
     * // Create one AppHealthSnapshot
     * const AppHealthSnapshot = await prisma.appHealthSnapshot.create({
     *   data: {
     *     // ... data to create a AppHealthSnapshot
     *   }
     * })
     * 
     */
    create<T extends AppHealthSnapshotCreateArgs>(args: SelectSubset<T, AppHealthSnapshotCreateArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppHealthSnapshots.
     * @param {AppHealthSnapshotCreateManyArgs} args - Arguments to create many AppHealthSnapshots.
     * @example
     * // Create many AppHealthSnapshots
     * const appHealthSnapshot = await prisma.appHealthSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppHealthSnapshotCreateManyArgs>(args?: SelectSubset<T, AppHealthSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppHealthSnapshots and returns the data saved in the database.
     * @param {AppHealthSnapshotCreateManyAndReturnArgs} args - Arguments to create many AppHealthSnapshots.
     * @example
     * // Create many AppHealthSnapshots
     * const appHealthSnapshot = await prisma.appHealthSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppHealthSnapshots and only return the `id`
     * const appHealthSnapshotWithIdOnly = await prisma.appHealthSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppHealthSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, AppHealthSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppHealthSnapshot.
     * @param {AppHealthSnapshotDeleteArgs} args - Arguments to delete one AppHealthSnapshot.
     * @example
     * // Delete one AppHealthSnapshot
     * const AppHealthSnapshot = await prisma.appHealthSnapshot.delete({
     *   where: {
     *     // ... filter to delete one AppHealthSnapshot
     *   }
     * })
     * 
     */
    delete<T extends AppHealthSnapshotDeleteArgs>(args: SelectSubset<T, AppHealthSnapshotDeleteArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppHealthSnapshot.
     * @param {AppHealthSnapshotUpdateArgs} args - Arguments to update one AppHealthSnapshot.
     * @example
     * // Update one AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppHealthSnapshotUpdateArgs>(args: SelectSubset<T, AppHealthSnapshotUpdateArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppHealthSnapshots.
     * @param {AppHealthSnapshotDeleteManyArgs} args - Arguments to filter AppHealthSnapshots to delete.
     * @example
     * // Delete a few AppHealthSnapshots
     * const { count } = await prisma.appHealthSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppHealthSnapshotDeleteManyArgs>(args?: SelectSubset<T, AppHealthSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppHealthSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppHealthSnapshots
     * const appHealthSnapshot = await prisma.appHealthSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppHealthSnapshotUpdateManyArgs>(args: SelectSubset<T, AppHealthSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppHealthSnapshots and returns the data updated in the database.
     * @param {AppHealthSnapshotUpdateManyAndReturnArgs} args - Arguments to update many AppHealthSnapshots.
     * @example
     * // Update many AppHealthSnapshots
     * const appHealthSnapshot = await prisma.appHealthSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppHealthSnapshots and only return the `id`
     * const appHealthSnapshotWithIdOnly = await prisma.appHealthSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppHealthSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, AppHealthSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppHealthSnapshot.
     * @param {AppHealthSnapshotUpsertArgs} args - Arguments to update or create a AppHealthSnapshot.
     * @example
     * // Update or create a AppHealthSnapshot
     * const appHealthSnapshot = await prisma.appHealthSnapshot.upsert({
     *   create: {
     *     // ... data to create a AppHealthSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppHealthSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends AppHealthSnapshotUpsertArgs>(args: SelectSubset<T, AppHealthSnapshotUpsertArgs<ExtArgs>>): Prisma__AppHealthSnapshotClient<$Result.GetResult<Prisma.$AppHealthSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppHealthSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotCountArgs} args - Arguments to filter AppHealthSnapshots to count.
     * @example
     * // Count the number of AppHealthSnapshots
     * const count = await prisma.appHealthSnapshot.count({
     *   where: {
     *     // ... the filter for the AppHealthSnapshots we want to count
     *   }
     * })
    **/
    count<T extends AppHealthSnapshotCountArgs>(
      args?: Subset<T, AppHealthSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppHealthSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppHealthSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppHealthSnapshotAggregateArgs>(args: Subset<T, AppHealthSnapshotAggregateArgs>): Prisma.PrismaPromise<GetAppHealthSnapshotAggregateType<T>>

    /**
     * Group by AppHealthSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppHealthSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppHealthSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppHealthSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: AppHealthSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppHealthSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppHealthSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppHealthSnapshot model
   */
  readonly fields: AppHealthSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppHealthSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppHealthSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppHealthSnapshot model
   */
  interface AppHealthSnapshotFieldRefs {
    readonly id: FieldRef<"AppHealthSnapshot", 'String'>
    readonly app: FieldRef<"AppHealthSnapshot", 'String'>
    readonly status: FieldRef<"AppHealthSnapshot", 'String'>
    readonly details: FieldRef<"AppHealthSnapshot", 'Json'>
    readonly checkedAt: FieldRef<"AppHealthSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppHealthSnapshot findUnique
   */
  export type AppHealthSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which AppHealthSnapshot to fetch.
     */
    where: AppHealthSnapshotWhereUniqueInput
  }

  /**
   * AppHealthSnapshot findUniqueOrThrow
   */
  export type AppHealthSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which AppHealthSnapshot to fetch.
     */
    where: AppHealthSnapshotWhereUniqueInput
  }

  /**
   * AppHealthSnapshot findFirst
   */
  export type AppHealthSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which AppHealthSnapshot to fetch.
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppHealthSnapshots to fetch.
     */
    orderBy?: AppHealthSnapshotOrderByWithRelationInput | AppHealthSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppHealthSnapshots.
     */
    cursor?: AppHealthSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppHealthSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppHealthSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppHealthSnapshots.
     */
    distinct?: AppHealthSnapshotScalarFieldEnum | AppHealthSnapshotScalarFieldEnum[]
  }

  /**
   * AppHealthSnapshot findFirstOrThrow
   */
  export type AppHealthSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which AppHealthSnapshot to fetch.
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppHealthSnapshots to fetch.
     */
    orderBy?: AppHealthSnapshotOrderByWithRelationInput | AppHealthSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppHealthSnapshots.
     */
    cursor?: AppHealthSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppHealthSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppHealthSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppHealthSnapshots.
     */
    distinct?: AppHealthSnapshotScalarFieldEnum | AppHealthSnapshotScalarFieldEnum[]
  }

  /**
   * AppHealthSnapshot findMany
   */
  export type AppHealthSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which AppHealthSnapshots to fetch.
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppHealthSnapshots to fetch.
     */
    orderBy?: AppHealthSnapshotOrderByWithRelationInput | AppHealthSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppHealthSnapshots.
     */
    cursor?: AppHealthSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppHealthSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppHealthSnapshots.
     */
    skip?: number
    distinct?: AppHealthSnapshotScalarFieldEnum | AppHealthSnapshotScalarFieldEnum[]
  }

  /**
   * AppHealthSnapshot create
   */
  export type AppHealthSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a AppHealthSnapshot.
     */
    data: XOR<AppHealthSnapshotCreateInput, AppHealthSnapshotUncheckedCreateInput>
  }

  /**
   * AppHealthSnapshot createMany
   */
  export type AppHealthSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppHealthSnapshots.
     */
    data: AppHealthSnapshotCreateManyInput | AppHealthSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppHealthSnapshot createManyAndReturn
   */
  export type AppHealthSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many AppHealthSnapshots.
     */
    data: AppHealthSnapshotCreateManyInput | AppHealthSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppHealthSnapshot update
   */
  export type AppHealthSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a AppHealthSnapshot.
     */
    data: XOR<AppHealthSnapshotUpdateInput, AppHealthSnapshotUncheckedUpdateInput>
    /**
     * Choose, which AppHealthSnapshot to update.
     */
    where: AppHealthSnapshotWhereUniqueInput
  }

  /**
   * AppHealthSnapshot updateMany
   */
  export type AppHealthSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppHealthSnapshots.
     */
    data: XOR<AppHealthSnapshotUpdateManyMutationInput, AppHealthSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which AppHealthSnapshots to update
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * Limit how many AppHealthSnapshots to update.
     */
    limit?: number
  }

  /**
   * AppHealthSnapshot updateManyAndReturn
   */
  export type AppHealthSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update AppHealthSnapshots.
     */
    data: XOR<AppHealthSnapshotUpdateManyMutationInput, AppHealthSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which AppHealthSnapshots to update
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * Limit how many AppHealthSnapshots to update.
     */
    limit?: number
  }

  /**
   * AppHealthSnapshot upsert
   */
  export type AppHealthSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the AppHealthSnapshot to update in case it exists.
     */
    where: AppHealthSnapshotWhereUniqueInput
    /**
     * In case the AppHealthSnapshot found by the `where` argument doesn't exist, create a new AppHealthSnapshot with this data.
     */
    create: XOR<AppHealthSnapshotCreateInput, AppHealthSnapshotUncheckedCreateInput>
    /**
     * In case the AppHealthSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppHealthSnapshotUpdateInput, AppHealthSnapshotUncheckedUpdateInput>
  }

  /**
   * AppHealthSnapshot delete
   */
  export type AppHealthSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
    /**
     * Filter which AppHealthSnapshot to delete.
     */
    where: AppHealthSnapshotWhereUniqueInput
  }

  /**
   * AppHealthSnapshot deleteMany
   */
  export type AppHealthSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppHealthSnapshots to delete
     */
    where?: AppHealthSnapshotWhereInput
    /**
     * Limit how many AppHealthSnapshots to delete.
     */
    limit?: number
  }

  /**
   * AppHealthSnapshot without action
   */
  export type AppHealthSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppHealthSnapshot
     */
    select?: AppHealthSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppHealthSnapshot
     */
    omit?: AppHealthSnapshotOmit<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    publicWebsiteUrl: string | null
    ownerConsoleUrl: string | null
    merchantConsoleUrl: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    publicWebsiteUrl: string | null
    ownerConsoleUrl: string | null
    merchantConsoleUrl: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    publicWebsiteUrl: number
    ownerConsoleUrl: number
    merchantConsoleUrl: number
    active: number
    settings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    publicWebsiteUrl?: true
    ownerConsoleUrl?: true
    merchantConsoleUrl?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    publicWebsiteUrl?: true
    ownerConsoleUrl?: true
    merchantConsoleUrl?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    publicWebsiteUrl?: true
    ownerConsoleUrl?: true
    merchantConsoleUrl?: true
    active?: true
    settings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    slug: string
    publicWebsiteUrl: string | null
    ownerConsoleUrl: string | null
    merchantConsoleUrl: string | null
    active: boolean
    settings: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    publicWebsiteUrl?: boolean
    ownerConsoleUrl?: boolean
    merchantConsoleUrl?: boolean
    active?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean | Company$modulesArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    publicWebsiteUrl?: boolean
    ownerConsoleUrl?: boolean
    merchantConsoleUrl?: boolean
    active?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    publicWebsiteUrl?: boolean
    ownerConsoleUrl?: boolean
    merchantConsoleUrl?: boolean
    active?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    publicWebsiteUrl?: boolean
    ownerConsoleUrl?: boolean
    merchantConsoleUrl?: boolean
    active?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "publicWebsiteUrl" | "ownerConsoleUrl" | "merchantConsoleUrl" | "active" | "settings" | "createdAt" | "updatedAt", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    modules?: boolean | Company$modulesArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      modules: Prisma.$CompanyModulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      publicWebsiteUrl: string | null
      ownerConsoleUrl: string | null
      merchantConsoleUrl: string | null
      active: boolean
      settings: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies and returns the data updated in the database.
     * @param {CompanyUpdateManyAndReturnArgs} args - Arguments to update many Companies.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    modules<T extends Company$modulesArgs<ExtArgs> = {}>(args?: Subset<T, Company$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly slug: FieldRef<"Company", 'String'>
    readonly publicWebsiteUrl: FieldRef<"Company", 'String'>
    readonly ownerConsoleUrl: FieldRef<"Company", 'String'>
    readonly merchantConsoleUrl: FieldRef<"Company", 'String'>
    readonly active: FieldRef<"Company", 'Boolean'>
    readonly settings: FieldRef<"Company", 'Json'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
    readonly updatedAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company updateManyAndReturn
   */
  export type CompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to delete.
     */
    limit?: number
  }

  /**
   * Company.modules
   */
  export type Company$modulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    where?: CompanyModuleWhereInput
    orderBy?: CompanyModuleOrderByWithRelationInput | CompanyModuleOrderByWithRelationInput[]
    cursor?: CompanyModuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompanyModuleScalarFieldEnum | CompanyModuleScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model CompanyModule
   */

  export type AggregateCompanyModule = {
    _count: CompanyModuleCountAggregateOutputType | null
    _min: CompanyModuleMinAggregateOutputType | null
    _max: CompanyModuleMaxAggregateOutputType | null
  }

  export type CompanyModuleMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    module: string | null
    enabled: boolean | null
    updatedAt: Date | null
  }

  export type CompanyModuleMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    module: string | null
    enabled: boolean | null
    updatedAt: Date | null
  }

  export type CompanyModuleCountAggregateOutputType = {
    id: number
    companyId: number
    module: number
    enabled: number
    settings: number
    updatedAt: number
    _all: number
  }


  export type CompanyModuleMinAggregateInputType = {
    id?: true
    companyId?: true
    module?: true
    enabled?: true
    updatedAt?: true
  }

  export type CompanyModuleMaxAggregateInputType = {
    id?: true
    companyId?: true
    module?: true
    enabled?: true
    updatedAt?: true
  }

  export type CompanyModuleCountAggregateInputType = {
    id?: true
    companyId?: true
    module?: true
    enabled?: true
    settings?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyModuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyModule to aggregate.
     */
    where?: CompanyModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyModules to fetch.
     */
    orderBy?: CompanyModuleOrderByWithRelationInput | CompanyModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompanyModules
    **/
    _count?: true | CompanyModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyModuleMaxAggregateInputType
  }

  export type GetCompanyModuleAggregateType<T extends CompanyModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateCompanyModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanyModule[P]>
      : GetScalarType<T[P], AggregateCompanyModule[P]>
  }




  export type CompanyModuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyModuleWhereInput
    orderBy?: CompanyModuleOrderByWithAggregationInput | CompanyModuleOrderByWithAggregationInput[]
    by: CompanyModuleScalarFieldEnum[] | CompanyModuleScalarFieldEnum
    having?: CompanyModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyModuleCountAggregateInputType | true
    _min?: CompanyModuleMinAggregateInputType
    _max?: CompanyModuleMaxAggregateInputType
  }

  export type CompanyModuleGroupByOutputType = {
    id: string
    companyId: string
    module: string
    enabled: boolean
    settings: JsonValue | null
    updatedAt: Date
    _count: CompanyModuleCountAggregateOutputType | null
    _min: CompanyModuleMinAggregateOutputType | null
    _max: CompanyModuleMaxAggregateOutputType | null
  }

  type GetCompanyModuleGroupByPayload<T extends CompanyModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyModuleGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyModuleGroupByOutputType[P]>
        }
      >
    >


  export type CompanyModuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    module?: boolean
    enabled?: boolean
    settings?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyModule"]>

  export type CompanyModuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    module?: boolean
    enabled?: boolean
    settings?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyModule"]>

  export type CompanyModuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    module?: boolean
    enabled?: boolean
    settings?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyModule"]>

  export type CompanyModuleSelectScalar = {
    id?: boolean
    companyId?: boolean
    module?: boolean
    enabled?: boolean
    settings?: boolean
    updatedAt?: boolean
  }

  export type CompanyModuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "module" | "enabled" | "settings" | "updatedAt", ExtArgs["result"]["companyModule"]>
  export type CompanyModuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }
  export type CompanyModuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }
  export type CompanyModuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $CompanyModulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompanyModule"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      module: string
      enabled: boolean
      settings: Prisma.JsonValue | null
      updatedAt: Date
    }, ExtArgs["result"]["companyModule"]>
    composites: {}
  }

  type CompanyModuleGetPayload<S extends boolean | null | undefined | CompanyModuleDefaultArgs> = $Result.GetResult<Prisma.$CompanyModulePayload, S>

  type CompanyModuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyModuleCountAggregateInputType | true
    }

  export interface CompanyModuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompanyModule'], meta: { name: 'CompanyModule' } }
    /**
     * Find zero or one CompanyModule that matches the filter.
     * @param {CompanyModuleFindUniqueArgs} args - Arguments to find a CompanyModule
     * @example
     * // Get one CompanyModule
     * const companyModule = await prisma.companyModule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyModuleFindUniqueArgs>(args: SelectSubset<T, CompanyModuleFindUniqueArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompanyModule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyModuleFindUniqueOrThrowArgs} args - Arguments to find a CompanyModule
     * @example
     * // Get one CompanyModule
     * const companyModule = await prisma.companyModule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyModuleFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyModule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleFindFirstArgs} args - Arguments to find a CompanyModule
     * @example
     * // Get one CompanyModule
     * const companyModule = await prisma.companyModule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyModuleFindFirstArgs>(args?: SelectSubset<T, CompanyModuleFindFirstArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyModule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleFindFirstOrThrowArgs} args - Arguments to find a CompanyModule
     * @example
     * // Get one CompanyModule
     * const companyModule = await prisma.companyModule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyModuleFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompanyModules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompanyModules
     * const companyModules = await prisma.companyModule.findMany()
     * 
     * // Get first 10 CompanyModules
     * const companyModules = await prisma.companyModule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyModuleWithIdOnly = await prisma.companyModule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyModuleFindManyArgs>(args?: SelectSubset<T, CompanyModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompanyModule.
     * @param {CompanyModuleCreateArgs} args - Arguments to create a CompanyModule.
     * @example
     * // Create one CompanyModule
     * const CompanyModule = await prisma.companyModule.create({
     *   data: {
     *     // ... data to create a CompanyModule
     *   }
     * })
     * 
     */
    create<T extends CompanyModuleCreateArgs>(args: SelectSubset<T, CompanyModuleCreateArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompanyModules.
     * @param {CompanyModuleCreateManyArgs} args - Arguments to create many CompanyModules.
     * @example
     * // Create many CompanyModules
     * const companyModule = await prisma.companyModule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyModuleCreateManyArgs>(args?: SelectSubset<T, CompanyModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompanyModules and returns the data saved in the database.
     * @param {CompanyModuleCreateManyAndReturnArgs} args - Arguments to create many CompanyModules.
     * @example
     * // Create many CompanyModules
     * const companyModule = await prisma.companyModule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompanyModules and only return the `id`
     * const companyModuleWithIdOnly = await prisma.companyModule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyModuleCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CompanyModule.
     * @param {CompanyModuleDeleteArgs} args - Arguments to delete one CompanyModule.
     * @example
     * // Delete one CompanyModule
     * const CompanyModule = await prisma.companyModule.delete({
     *   where: {
     *     // ... filter to delete one CompanyModule
     *   }
     * })
     * 
     */
    delete<T extends CompanyModuleDeleteArgs>(args: SelectSubset<T, CompanyModuleDeleteArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompanyModule.
     * @param {CompanyModuleUpdateArgs} args - Arguments to update one CompanyModule.
     * @example
     * // Update one CompanyModule
     * const companyModule = await prisma.companyModule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyModuleUpdateArgs>(args: SelectSubset<T, CompanyModuleUpdateArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompanyModules.
     * @param {CompanyModuleDeleteManyArgs} args - Arguments to filter CompanyModules to delete.
     * @example
     * // Delete a few CompanyModules
     * const { count } = await prisma.companyModule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyModuleDeleteManyArgs>(args?: SelectSubset<T, CompanyModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompanyModules
     * const companyModule = await prisma.companyModule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyModuleUpdateManyArgs>(args: SelectSubset<T, CompanyModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyModules and returns the data updated in the database.
     * @param {CompanyModuleUpdateManyAndReturnArgs} args - Arguments to update many CompanyModules.
     * @example
     * // Update many CompanyModules
     * const companyModule = await prisma.companyModule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CompanyModules and only return the `id`
     * const companyModuleWithIdOnly = await prisma.companyModule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompanyModuleUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CompanyModule.
     * @param {CompanyModuleUpsertArgs} args - Arguments to update or create a CompanyModule.
     * @example
     * // Update or create a CompanyModule
     * const companyModule = await prisma.companyModule.upsert({
     *   create: {
     *     // ... data to create a CompanyModule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompanyModule we want to update
     *   }
     * })
     */
    upsert<T extends CompanyModuleUpsertArgs>(args: SelectSubset<T, CompanyModuleUpsertArgs<ExtArgs>>): Prisma__CompanyModuleClient<$Result.GetResult<Prisma.$CompanyModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompanyModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleCountArgs} args - Arguments to filter CompanyModules to count.
     * @example
     * // Count the number of CompanyModules
     * const count = await prisma.companyModule.count({
     *   where: {
     *     // ... the filter for the CompanyModules we want to count
     *   }
     * })
    **/
    count<T extends CompanyModuleCountArgs>(
      args?: Subset<T, CompanyModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompanyModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyModuleAggregateArgs>(args: Subset<T, CompanyModuleAggregateArgs>): Prisma.PrismaPromise<GetCompanyModuleAggregateType<T>>

    /**
     * Group by CompanyModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyModuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyModuleGroupByArgs['orderBy'] }
        : { orderBy?: CompanyModuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompanyModule model
   */
  readonly fields: CompanyModuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompanyModule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyModuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompanyModule model
   */
  interface CompanyModuleFieldRefs {
    readonly id: FieldRef<"CompanyModule", 'String'>
    readonly companyId: FieldRef<"CompanyModule", 'String'>
    readonly module: FieldRef<"CompanyModule", 'String'>
    readonly enabled: FieldRef<"CompanyModule", 'Boolean'>
    readonly settings: FieldRef<"CompanyModule", 'Json'>
    readonly updatedAt: FieldRef<"CompanyModule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompanyModule findUnique
   */
  export type CompanyModuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter, which CompanyModule to fetch.
     */
    where: CompanyModuleWhereUniqueInput
  }

  /**
   * CompanyModule findUniqueOrThrow
   */
  export type CompanyModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter, which CompanyModule to fetch.
     */
    where: CompanyModuleWhereUniqueInput
  }

  /**
   * CompanyModule findFirst
   */
  export type CompanyModuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter, which CompanyModule to fetch.
     */
    where?: CompanyModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyModules to fetch.
     */
    orderBy?: CompanyModuleOrderByWithRelationInput | CompanyModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyModules.
     */
    cursor?: CompanyModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyModules.
     */
    distinct?: CompanyModuleScalarFieldEnum | CompanyModuleScalarFieldEnum[]
  }

  /**
   * CompanyModule findFirstOrThrow
   */
  export type CompanyModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter, which CompanyModule to fetch.
     */
    where?: CompanyModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyModules to fetch.
     */
    orderBy?: CompanyModuleOrderByWithRelationInput | CompanyModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyModules.
     */
    cursor?: CompanyModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyModules.
     */
    distinct?: CompanyModuleScalarFieldEnum | CompanyModuleScalarFieldEnum[]
  }

  /**
   * CompanyModule findMany
   */
  export type CompanyModuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter, which CompanyModules to fetch.
     */
    where?: CompanyModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyModules to fetch.
     */
    orderBy?: CompanyModuleOrderByWithRelationInput | CompanyModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompanyModules.
     */
    cursor?: CompanyModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyModules.
     */
    skip?: number
    distinct?: CompanyModuleScalarFieldEnum | CompanyModuleScalarFieldEnum[]
  }

  /**
   * CompanyModule create
   */
  export type CompanyModuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a CompanyModule.
     */
    data: XOR<CompanyModuleCreateInput, CompanyModuleUncheckedCreateInput>
  }

  /**
   * CompanyModule createMany
   */
  export type CompanyModuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompanyModules.
     */
    data: CompanyModuleCreateManyInput | CompanyModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompanyModule createManyAndReturn
   */
  export type CompanyModuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * The data used to create many CompanyModules.
     */
    data: CompanyModuleCreateManyInput | CompanyModuleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CompanyModule update
   */
  export type CompanyModuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a CompanyModule.
     */
    data: XOR<CompanyModuleUpdateInput, CompanyModuleUncheckedUpdateInput>
    /**
     * Choose, which CompanyModule to update.
     */
    where: CompanyModuleWhereUniqueInput
  }

  /**
   * CompanyModule updateMany
   */
  export type CompanyModuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompanyModules.
     */
    data: XOR<CompanyModuleUpdateManyMutationInput, CompanyModuleUncheckedUpdateManyInput>
    /**
     * Filter which CompanyModules to update
     */
    where?: CompanyModuleWhereInput
    /**
     * Limit how many CompanyModules to update.
     */
    limit?: number
  }

  /**
   * CompanyModule updateManyAndReturn
   */
  export type CompanyModuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * The data used to update CompanyModules.
     */
    data: XOR<CompanyModuleUpdateManyMutationInput, CompanyModuleUncheckedUpdateManyInput>
    /**
     * Filter which CompanyModules to update
     */
    where?: CompanyModuleWhereInput
    /**
     * Limit how many CompanyModules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CompanyModule upsert
   */
  export type CompanyModuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the CompanyModule to update in case it exists.
     */
    where: CompanyModuleWhereUniqueInput
    /**
     * In case the CompanyModule found by the `where` argument doesn't exist, create a new CompanyModule with this data.
     */
    create: XOR<CompanyModuleCreateInput, CompanyModuleUncheckedCreateInput>
    /**
     * In case the CompanyModule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyModuleUpdateInput, CompanyModuleUncheckedUpdateInput>
  }

  /**
   * CompanyModule delete
   */
  export type CompanyModuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
    /**
     * Filter which CompanyModule to delete.
     */
    where: CompanyModuleWhereUniqueInput
  }

  /**
   * CompanyModule deleteMany
   */
  export type CompanyModuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyModules to delete
     */
    where?: CompanyModuleWhereInput
    /**
     * Limit how many CompanyModules to delete.
     */
    limit?: number
  }

  /**
   * CompanyModule without action
   */
  export type CompanyModuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyModule
     */
    select?: CompanyModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyModule
     */
    omit?: CompanyModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyModuleInclude<ExtArgs> | null
  }


  /**
   * Model PackageApplication
   */

  export type AggregatePackageApplication = {
    _count: PackageApplicationCountAggregateOutputType | null
    _min: PackageApplicationMinAggregateOutputType | null
    _max: PackageApplicationMaxAggregateOutputType | null
  }

  export type PackageApplicationMinAggregateOutputType = {
    id: string | null
    app: string | null
    plan: string | null
    businessName: string | null
    contactName: string | null
    email: string | null
    phone: string | null
    location: string | null
    businessType: string | null
    requirements: string | null
    status: string | null
    submittedBy: string | null
    tenantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageApplicationMaxAggregateOutputType = {
    id: string | null
    app: string | null
    plan: string | null
    businessName: string | null
    contactName: string | null
    email: string | null
    phone: string | null
    location: string | null
    businessType: string | null
    requirements: string | null
    status: string | null
    submittedBy: string | null
    tenantId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageApplicationCountAggregateOutputType = {
    id: number
    app: number
    plan: number
    businessName: number
    contactName: number
    email: number
    phone: number
    location: number
    businessType: number
    requirements: number
    status: number
    submittedBy: number
    tenantId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PackageApplicationMinAggregateInputType = {
    id?: true
    app?: true
    plan?: true
    businessName?: true
    contactName?: true
    email?: true
    phone?: true
    location?: true
    businessType?: true
    requirements?: true
    status?: true
    submittedBy?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageApplicationMaxAggregateInputType = {
    id?: true
    app?: true
    plan?: true
    businessName?: true
    contactName?: true
    email?: true
    phone?: true
    location?: true
    businessType?: true
    requirements?: true
    status?: true
    submittedBy?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageApplicationCountAggregateInputType = {
    id?: true
    app?: true
    plan?: true
    businessName?: true
    contactName?: true
    email?: true
    phone?: true
    location?: true
    businessType?: true
    requirements?: true
    status?: true
    submittedBy?: true
    tenantId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PackageApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PackageApplication to aggregate.
     */
    where?: PackageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackageApplications to fetch.
     */
    orderBy?: PackageApplicationOrderByWithRelationInput | PackageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PackageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PackageApplications
    **/
    _count?: true | PackageApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PackageApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PackageApplicationMaxAggregateInputType
  }

  export type GetPackageApplicationAggregateType<T extends PackageApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregatePackageApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePackageApplication[P]>
      : GetScalarType<T[P], AggregatePackageApplication[P]>
  }




  export type PackageApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageApplicationWhereInput
    orderBy?: PackageApplicationOrderByWithAggregationInput | PackageApplicationOrderByWithAggregationInput[]
    by: PackageApplicationScalarFieldEnum[] | PackageApplicationScalarFieldEnum
    having?: PackageApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PackageApplicationCountAggregateInputType | true
    _min?: PackageApplicationMinAggregateInputType
    _max?: PackageApplicationMaxAggregateInputType
  }

  export type PackageApplicationGroupByOutputType = {
    id: string
    app: string
    plan: string
    businessName: string
    contactName: string
    email: string
    phone: string | null
    location: string | null
    businessType: string | null
    requirements: string
    status: string
    submittedBy: string
    tenantId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PackageApplicationCountAggregateOutputType | null
    _min: PackageApplicationMinAggregateOutputType | null
    _max: PackageApplicationMaxAggregateOutputType | null
  }

  type GetPackageApplicationGroupByPayload<T extends PackageApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PackageApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PackageApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PackageApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], PackageApplicationGroupByOutputType[P]>
        }
      >
    >


  export type PackageApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    plan?: boolean
    businessName?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    location?: boolean
    businessType?: boolean
    requirements?: boolean
    status?: boolean
    submittedBy?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["packageApplication"]>

  export type PackageApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    plan?: boolean
    businessName?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    location?: boolean
    businessType?: boolean
    requirements?: boolean
    status?: boolean
    submittedBy?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["packageApplication"]>

  export type PackageApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    app?: boolean
    plan?: boolean
    businessName?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    location?: boolean
    businessType?: boolean
    requirements?: boolean
    status?: boolean
    submittedBy?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["packageApplication"]>

  export type PackageApplicationSelectScalar = {
    id?: boolean
    app?: boolean
    plan?: boolean
    businessName?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    location?: boolean
    businessType?: boolean
    requirements?: boolean
    status?: boolean
    submittedBy?: boolean
    tenantId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PackageApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "app" | "plan" | "businessName" | "contactName" | "email" | "phone" | "location" | "businessType" | "requirements" | "status" | "submittedBy" | "tenantId" | "createdAt" | "updatedAt", ExtArgs["result"]["packageApplication"]>

  export type $PackageApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PackageApplication"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      app: string
      plan: string
      businessName: string
      contactName: string
      email: string
      phone: string | null
      location: string | null
      businessType: string | null
      requirements: string
      status: string
      submittedBy: string
      tenantId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["packageApplication"]>
    composites: {}
  }

  type PackageApplicationGetPayload<S extends boolean | null | undefined | PackageApplicationDefaultArgs> = $Result.GetResult<Prisma.$PackageApplicationPayload, S>

  type PackageApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PackageApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PackageApplicationCountAggregateInputType | true
    }

  export interface PackageApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PackageApplication'], meta: { name: 'PackageApplication' } }
    /**
     * Find zero or one PackageApplication that matches the filter.
     * @param {PackageApplicationFindUniqueArgs} args - Arguments to find a PackageApplication
     * @example
     * // Get one PackageApplication
     * const packageApplication = await prisma.packageApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PackageApplicationFindUniqueArgs>(args: SelectSubset<T, PackageApplicationFindUniqueArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PackageApplication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PackageApplicationFindUniqueOrThrowArgs} args - Arguments to find a PackageApplication
     * @example
     * // Get one PackageApplication
     * const packageApplication = await prisma.packageApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PackageApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, PackageApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PackageApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationFindFirstArgs} args - Arguments to find a PackageApplication
     * @example
     * // Get one PackageApplication
     * const packageApplication = await prisma.packageApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PackageApplicationFindFirstArgs>(args?: SelectSubset<T, PackageApplicationFindFirstArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PackageApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationFindFirstOrThrowArgs} args - Arguments to find a PackageApplication
     * @example
     * // Get one PackageApplication
     * const packageApplication = await prisma.packageApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PackageApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, PackageApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PackageApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PackageApplications
     * const packageApplications = await prisma.packageApplication.findMany()
     * 
     * // Get first 10 PackageApplications
     * const packageApplications = await prisma.packageApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const packageApplicationWithIdOnly = await prisma.packageApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PackageApplicationFindManyArgs>(args?: SelectSubset<T, PackageApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PackageApplication.
     * @param {PackageApplicationCreateArgs} args - Arguments to create a PackageApplication.
     * @example
     * // Create one PackageApplication
     * const PackageApplication = await prisma.packageApplication.create({
     *   data: {
     *     // ... data to create a PackageApplication
     *   }
     * })
     * 
     */
    create<T extends PackageApplicationCreateArgs>(args: SelectSubset<T, PackageApplicationCreateArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PackageApplications.
     * @param {PackageApplicationCreateManyArgs} args - Arguments to create many PackageApplications.
     * @example
     * // Create many PackageApplications
     * const packageApplication = await prisma.packageApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PackageApplicationCreateManyArgs>(args?: SelectSubset<T, PackageApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PackageApplications and returns the data saved in the database.
     * @param {PackageApplicationCreateManyAndReturnArgs} args - Arguments to create many PackageApplications.
     * @example
     * // Create many PackageApplications
     * const packageApplication = await prisma.packageApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PackageApplications and only return the `id`
     * const packageApplicationWithIdOnly = await prisma.packageApplication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PackageApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, PackageApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PackageApplication.
     * @param {PackageApplicationDeleteArgs} args - Arguments to delete one PackageApplication.
     * @example
     * // Delete one PackageApplication
     * const PackageApplication = await prisma.packageApplication.delete({
     *   where: {
     *     // ... filter to delete one PackageApplication
     *   }
     * })
     * 
     */
    delete<T extends PackageApplicationDeleteArgs>(args: SelectSubset<T, PackageApplicationDeleteArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PackageApplication.
     * @param {PackageApplicationUpdateArgs} args - Arguments to update one PackageApplication.
     * @example
     * // Update one PackageApplication
     * const packageApplication = await prisma.packageApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PackageApplicationUpdateArgs>(args: SelectSubset<T, PackageApplicationUpdateArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PackageApplications.
     * @param {PackageApplicationDeleteManyArgs} args - Arguments to filter PackageApplications to delete.
     * @example
     * // Delete a few PackageApplications
     * const { count } = await prisma.packageApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PackageApplicationDeleteManyArgs>(args?: SelectSubset<T, PackageApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PackageApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PackageApplications
     * const packageApplication = await prisma.packageApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PackageApplicationUpdateManyArgs>(args: SelectSubset<T, PackageApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PackageApplications and returns the data updated in the database.
     * @param {PackageApplicationUpdateManyAndReturnArgs} args - Arguments to update many PackageApplications.
     * @example
     * // Update many PackageApplications
     * const packageApplication = await prisma.packageApplication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PackageApplications and only return the `id`
     * const packageApplicationWithIdOnly = await prisma.packageApplication.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PackageApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, PackageApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PackageApplication.
     * @param {PackageApplicationUpsertArgs} args - Arguments to update or create a PackageApplication.
     * @example
     * // Update or create a PackageApplication
     * const packageApplication = await prisma.packageApplication.upsert({
     *   create: {
     *     // ... data to create a PackageApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PackageApplication we want to update
     *   }
     * })
     */
    upsert<T extends PackageApplicationUpsertArgs>(args: SelectSubset<T, PackageApplicationUpsertArgs<ExtArgs>>): Prisma__PackageApplicationClient<$Result.GetResult<Prisma.$PackageApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PackageApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationCountArgs} args - Arguments to filter PackageApplications to count.
     * @example
     * // Count the number of PackageApplications
     * const count = await prisma.packageApplication.count({
     *   where: {
     *     // ... the filter for the PackageApplications we want to count
     *   }
     * })
    **/
    count<T extends PackageApplicationCountArgs>(
      args?: Subset<T, PackageApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PackageApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PackageApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PackageApplicationAggregateArgs>(args: Subset<T, PackageApplicationAggregateArgs>): Prisma.PrismaPromise<GetPackageApplicationAggregateType<T>>

    /**
     * Group by PackageApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PackageApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PackageApplicationGroupByArgs['orderBy'] }
        : { orderBy?: PackageApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PackageApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackageApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PackageApplication model
   */
  readonly fields: PackageApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PackageApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PackageApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PackageApplication model
   */
  interface PackageApplicationFieldRefs {
    readonly id: FieldRef<"PackageApplication", 'String'>
    readonly app: FieldRef<"PackageApplication", 'String'>
    readonly plan: FieldRef<"PackageApplication", 'String'>
    readonly businessName: FieldRef<"PackageApplication", 'String'>
    readonly contactName: FieldRef<"PackageApplication", 'String'>
    readonly email: FieldRef<"PackageApplication", 'String'>
    readonly phone: FieldRef<"PackageApplication", 'String'>
    readonly location: FieldRef<"PackageApplication", 'String'>
    readonly businessType: FieldRef<"PackageApplication", 'String'>
    readonly requirements: FieldRef<"PackageApplication", 'String'>
    readonly status: FieldRef<"PackageApplication", 'String'>
    readonly submittedBy: FieldRef<"PackageApplication", 'String'>
    readonly tenantId: FieldRef<"PackageApplication", 'String'>
    readonly createdAt: FieldRef<"PackageApplication", 'DateTime'>
    readonly updatedAt: FieldRef<"PackageApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PackageApplication findUnique
   */
  export type PackageApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter, which PackageApplication to fetch.
     */
    where: PackageApplicationWhereUniqueInput
  }

  /**
   * PackageApplication findUniqueOrThrow
   */
  export type PackageApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter, which PackageApplication to fetch.
     */
    where: PackageApplicationWhereUniqueInput
  }

  /**
   * PackageApplication findFirst
   */
  export type PackageApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter, which PackageApplication to fetch.
     */
    where?: PackageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackageApplications to fetch.
     */
    orderBy?: PackageApplicationOrderByWithRelationInput | PackageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PackageApplications.
     */
    cursor?: PackageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PackageApplications.
     */
    distinct?: PackageApplicationScalarFieldEnum | PackageApplicationScalarFieldEnum[]
  }

  /**
   * PackageApplication findFirstOrThrow
   */
  export type PackageApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter, which PackageApplication to fetch.
     */
    where?: PackageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackageApplications to fetch.
     */
    orderBy?: PackageApplicationOrderByWithRelationInput | PackageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PackageApplications.
     */
    cursor?: PackageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PackageApplications.
     */
    distinct?: PackageApplicationScalarFieldEnum | PackageApplicationScalarFieldEnum[]
  }

  /**
   * PackageApplication findMany
   */
  export type PackageApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter, which PackageApplications to fetch.
     */
    where?: PackageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PackageApplications to fetch.
     */
    orderBy?: PackageApplicationOrderByWithRelationInput | PackageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PackageApplications.
     */
    cursor?: PackageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PackageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PackageApplications.
     */
    skip?: number
    distinct?: PackageApplicationScalarFieldEnum | PackageApplicationScalarFieldEnum[]
  }

  /**
   * PackageApplication create
   */
  export type PackageApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * The data needed to create a PackageApplication.
     */
    data: XOR<PackageApplicationCreateInput, PackageApplicationUncheckedCreateInput>
  }

  /**
   * PackageApplication createMany
   */
  export type PackageApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PackageApplications.
     */
    data: PackageApplicationCreateManyInput | PackageApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PackageApplication createManyAndReturn
   */
  export type PackageApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many PackageApplications.
     */
    data: PackageApplicationCreateManyInput | PackageApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PackageApplication update
   */
  export type PackageApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * The data needed to update a PackageApplication.
     */
    data: XOR<PackageApplicationUpdateInput, PackageApplicationUncheckedUpdateInput>
    /**
     * Choose, which PackageApplication to update.
     */
    where: PackageApplicationWhereUniqueInput
  }

  /**
   * PackageApplication updateMany
   */
  export type PackageApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PackageApplications.
     */
    data: XOR<PackageApplicationUpdateManyMutationInput, PackageApplicationUncheckedUpdateManyInput>
    /**
     * Filter which PackageApplications to update
     */
    where?: PackageApplicationWhereInput
    /**
     * Limit how many PackageApplications to update.
     */
    limit?: number
  }

  /**
   * PackageApplication updateManyAndReturn
   */
  export type PackageApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * The data used to update PackageApplications.
     */
    data: XOR<PackageApplicationUpdateManyMutationInput, PackageApplicationUncheckedUpdateManyInput>
    /**
     * Filter which PackageApplications to update
     */
    where?: PackageApplicationWhereInput
    /**
     * Limit how many PackageApplications to update.
     */
    limit?: number
  }

  /**
   * PackageApplication upsert
   */
  export type PackageApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * The filter to search for the PackageApplication to update in case it exists.
     */
    where: PackageApplicationWhereUniqueInput
    /**
     * In case the PackageApplication found by the `where` argument doesn't exist, create a new PackageApplication with this data.
     */
    create: XOR<PackageApplicationCreateInput, PackageApplicationUncheckedCreateInput>
    /**
     * In case the PackageApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PackageApplicationUpdateInput, PackageApplicationUncheckedUpdateInput>
  }

  /**
   * PackageApplication delete
   */
  export type PackageApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
    /**
     * Filter which PackageApplication to delete.
     */
    where: PackageApplicationWhereUniqueInput
  }

  /**
   * PackageApplication deleteMany
   */
  export type PackageApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PackageApplications to delete
     */
    where?: PackageApplicationWhereInput
    /**
     * Limit how many PackageApplications to delete.
     */
    limit?: number
  }

  /**
   * PackageApplication without action
   */
  export type PackageApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageApplication
     */
    select?: PackageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PackageApplication
     */
    omit?: PackageApplicationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuthUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    tenantId: 'tenantId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthUserScalarFieldEnum = (typeof AuthUserScalarFieldEnum)[keyof typeof AuthUserScalarFieldEnum]


  export const PasskeyCredentialScalarFieldEnum: {
    id: 'id',
    credentialId: 'credentialId',
    publicKey: 'publicKey',
    counter: 'counter',
    transports: 'transports',
    deviceType: 'deviceType',
    backedUp: 'backedUp',
    userId: 'userId',
    createdAt: 'createdAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type PasskeyCredentialScalarFieldEnum = (typeof PasskeyCredentialScalarFieldEnum)[keyof typeof PasskeyCredentialScalarFieldEnum]


  export const PasskeyChallengeScalarFieldEnum: {
    id: 'id',
    email: 'email',
    challenge: 'challenge',
    type: 'type',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type PasskeyChallengeScalarFieldEnum = (typeof PasskeyChallengeScalarFieldEnum)[keyof typeof PasskeyChallengeScalarFieldEnum]


  export const AuthSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshTokenHash: 'refreshTokenHash',
    refreshTokenId: 'refreshTokenId',
    deviceFingerprint: 'deviceFingerprint',
    ipPrefix: 'ipPrefix',
    expiresAt: 'expiresAt',
    rotatedAt: 'rotatedAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt'
  };

  export type AuthSessionScalarFieldEnum = (typeof AuthSessionScalarFieldEnum)[keyof typeof AuthSessionScalarFieldEnum]


  export const PasswordResetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetScalarFieldEnum = (typeof PasswordResetScalarFieldEnum)[keyof typeof PasswordResetScalarFieldEnum]


  export const AuditEventScalarFieldEnum: {
    id: 'id',
    actorId: 'actorId',
    action: 'action',
    app: 'app',
    createdAt: 'createdAt'
  };

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


  export const AppHealthSnapshotScalarFieldEnum: {
    id: 'id',
    app: 'app',
    status: 'status',
    details: 'details',
    checkedAt: 'checkedAt'
  };

  export type AppHealthSnapshotScalarFieldEnum = (typeof AppHealthSnapshotScalarFieldEnum)[keyof typeof AppHealthSnapshotScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    publicWebsiteUrl: 'publicWebsiteUrl',
    ownerConsoleUrl: 'ownerConsoleUrl',
    merchantConsoleUrl: 'merchantConsoleUrl',
    active: 'active',
    settings: 'settings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const CompanyModuleScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    module: 'module',
    enabled: 'enabled',
    settings: 'settings',
    updatedAt: 'updatedAt'
  };

  export type CompanyModuleScalarFieldEnum = (typeof CompanyModuleScalarFieldEnum)[keyof typeof CompanyModuleScalarFieldEnum]


  export const PackageApplicationScalarFieldEnum: {
    id: 'id',
    app: 'app',
    plan: 'plan',
    businessName: 'businessName',
    contactName: 'contactName',
    email: 'email',
    phone: 'phone',
    location: 'location',
    businessType: 'businessType',
    requirements: 'requirements',
    status: 'status',
    submittedBy: 'submittedBy',
    tenantId: 'tenantId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PackageApplicationScalarFieldEnum = (typeof PackageApplicationScalarFieldEnum)[keyof typeof PackageApplicationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AuthUserWhereInput = {
    AND?: AuthUserWhereInput | AuthUserWhereInput[]
    OR?: AuthUserWhereInput[]
    NOT?: AuthUserWhereInput | AuthUserWhereInput[]
    id?: StringFilter<"AuthUser"> | string
    email?: StringFilter<"AuthUser"> | string
    passwordHash?: StringFilter<"AuthUser"> | string
    role?: StringFilter<"AuthUser"> | string
    tenantId?: StringNullableFilter<"AuthUser"> | string | null
    active?: BoolFilter<"AuthUser"> | boolean
    createdAt?: DateTimeFilter<"AuthUser"> | Date | string
    updatedAt?: DateTimeFilter<"AuthUser"> | Date | string
    sessions?: AuthSessionListRelationFilter
    resets?: PasswordResetListRelationFilter
    passkeys?: PasskeyCredentialListRelationFilter
  }

  export type AuthUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: AuthSessionOrderByRelationAggregateInput
    resets?: PasswordResetOrderByRelationAggregateInput
    passkeys?: PasskeyCredentialOrderByRelationAggregateInput
  }

  export type AuthUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AuthUserWhereInput | AuthUserWhereInput[]
    OR?: AuthUserWhereInput[]
    NOT?: AuthUserWhereInput | AuthUserWhereInput[]
    passwordHash?: StringFilter<"AuthUser"> | string
    role?: StringFilter<"AuthUser"> | string
    tenantId?: StringNullableFilter<"AuthUser"> | string | null
    active?: BoolFilter<"AuthUser"> | boolean
    createdAt?: DateTimeFilter<"AuthUser"> | Date | string
    updatedAt?: DateTimeFilter<"AuthUser"> | Date | string
    sessions?: AuthSessionListRelationFilter
    resets?: PasswordResetListRelationFilter
    passkeys?: PasskeyCredentialListRelationFilter
  }, "id" | "email">

  export type AuthUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthUserCountOrderByAggregateInput
    _max?: AuthUserMaxOrderByAggregateInput
    _min?: AuthUserMinOrderByAggregateInput
  }

  export type AuthUserScalarWhereWithAggregatesInput = {
    AND?: AuthUserScalarWhereWithAggregatesInput | AuthUserScalarWhereWithAggregatesInput[]
    OR?: AuthUserScalarWhereWithAggregatesInput[]
    NOT?: AuthUserScalarWhereWithAggregatesInput | AuthUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthUser"> | string
    email?: StringWithAggregatesFilter<"AuthUser"> | string
    passwordHash?: StringWithAggregatesFilter<"AuthUser"> | string
    role?: StringWithAggregatesFilter<"AuthUser"> | string
    tenantId?: StringNullableWithAggregatesFilter<"AuthUser"> | string | null
    active?: BoolWithAggregatesFilter<"AuthUser"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AuthUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthUser"> | Date | string
  }

  export type PasskeyCredentialWhereInput = {
    AND?: PasskeyCredentialWhereInput | PasskeyCredentialWhereInput[]
    OR?: PasskeyCredentialWhereInput[]
    NOT?: PasskeyCredentialWhereInput | PasskeyCredentialWhereInput[]
    id?: StringFilter<"PasskeyCredential"> | string
    credentialId?: StringFilter<"PasskeyCredential"> | string
    publicKey?: BytesFilter<"PasskeyCredential"> | Bytes
    counter?: BigIntFilter<"PasskeyCredential"> | bigint | number
    transports?: JsonNullableFilter<"PasskeyCredential">
    deviceType?: StringNullableFilter<"PasskeyCredential"> | string | null
    backedUp?: BoolFilter<"PasskeyCredential"> | boolean
    userId?: StringFilter<"PasskeyCredential"> | string
    createdAt?: DateTimeFilter<"PasskeyCredential"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"PasskeyCredential"> | Date | string | null
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }

  export type PasskeyCredentialOrderByWithRelationInput = {
    id?: SortOrder
    credentialId?: SortOrder
    publicKey?: SortOrder
    counter?: SortOrder
    transports?: SortOrderInput | SortOrder
    deviceType?: SortOrderInput | SortOrder
    backedUp?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    user?: AuthUserOrderByWithRelationInput
  }

  export type PasskeyCredentialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    credentialId?: string
    AND?: PasskeyCredentialWhereInput | PasskeyCredentialWhereInput[]
    OR?: PasskeyCredentialWhereInput[]
    NOT?: PasskeyCredentialWhereInput | PasskeyCredentialWhereInput[]
    publicKey?: BytesFilter<"PasskeyCredential"> | Bytes
    counter?: BigIntFilter<"PasskeyCredential"> | bigint | number
    transports?: JsonNullableFilter<"PasskeyCredential">
    deviceType?: StringNullableFilter<"PasskeyCredential"> | string | null
    backedUp?: BoolFilter<"PasskeyCredential"> | boolean
    userId?: StringFilter<"PasskeyCredential"> | string
    createdAt?: DateTimeFilter<"PasskeyCredential"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"PasskeyCredential"> | Date | string | null
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }, "id" | "credentialId">

  export type PasskeyCredentialOrderByWithAggregationInput = {
    id?: SortOrder
    credentialId?: SortOrder
    publicKey?: SortOrder
    counter?: SortOrder
    transports?: SortOrderInput | SortOrder
    deviceType?: SortOrderInput | SortOrder
    backedUp?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    _count?: PasskeyCredentialCountOrderByAggregateInput
    _avg?: PasskeyCredentialAvgOrderByAggregateInput
    _max?: PasskeyCredentialMaxOrderByAggregateInput
    _min?: PasskeyCredentialMinOrderByAggregateInput
    _sum?: PasskeyCredentialSumOrderByAggregateInput
  }

  export type PasskeyCredentialScalarWhereWithAggregatesInput = {
    AND?: PasskeyCredentialScalarWhereWithAggregatesInput | PasskeyCredentialScalarWhereWithAggregatesInput[]
    OR?: PasskeyCredentialScalarWhereWithAggregatesInput[]
    NOT?: PasskeyCredentialScalarWhereWithAggregatesInput | PasskeyCredentialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasskeyCredential"> | string
    credentialId?: StringWithAggregatesFilter<"PasskeyCredential"> | string
    publicKey?: BytesWithAggregatesFilter<"PasskeyCredential"> | Bytes
    counter?: BigIntWithAggregatesFilter<"PasskeyCredential"> | bigint | number
    transports?: JsonNullableWithAggregatesFilter<"PasskeyCredential">
    deviceType?: StringNullableWithAggregatesFilter<"PasskeyCredential"> | string | null
    backedUp?: BoolWithAggregatesFilter<"PasskeyCredential"> | boolean
    userId?: StringWithAggregatesFilter<"PasskeyCredential"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PasskeyCredential"> | Date | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"PasskeyCredential"> | Date | string | null
  }

  export type PasskeyChallengeWhereInput = {
    AND?: PasskeyChallengeWhereInput | PasskeyChallengeWhereInput[]
    OR?: PasskeyChallengeWhereInput[]
    NOT?: PasskeyChallengeWhereInput | PasskeyChallengeWhereInput[]
    id?: StringFilter<"PasskeyChallenge"> | string
    email?: StringFilter<"PasskeyChallenge"> | string
    challenge?: StringFilter<"PasskeyChallenge"> | string
    type?: StringFilter<"PasskeyChallenge"> | string
    expiresAt?: DateTimeFilter<"PasskeyChallenge"> | Date | string
    createdAt?: DateTimeFilter<"PasskeyChallenge"> | Date | string
  }

  export type PasskeyChallengeOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    challenge?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasskeyChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PasskeyChallengeWhereInput | PasskeyChallengeWhereInput[]
    OR?: PasskeyChallengeWhereInput[]
    NOT?: PasskeyChallengeWhereInput | PasskeyChallengeWhereInput[]
    email?: StringFilter<"PasskeyChallenge"> | string
    challenge?: StringFilter<"PasskeyChallenge"> | string
    type?: StringFilter<"PasskeyChallenge"> | string
    expiresAt?: DateTimeFilter<"PasskeyChallenge"> | Date | string
    createdAt?: DateTimeFilter<"PasskeyChallenge"> | Date | string
  }, "id">

  export type PasskeyChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    challenge?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: PasskeyChallengeCountOrderByAggregateInput
    _max?: PasskeyChallengeMaxOrderByAggregateInput
    _min?: PasskeyChallengeMinOrderByAggregateInput
  }

  export type PasskeyChallengeScalarWhereWithAggregatesInput = {
    AND?: PasskeyChallengeScalarWhereWithAggregatesInput | PasskeyChallengeScalarWhereWithAggregatesInput[]
    OR?: PasskeyChallengeScalarWhereWithAggregatesInput[]
    NOT?: PasskeyChallengeScalarWhereWithAggregatesInput | PasskeyChallengeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasskeyChallenge"> | string
    email?: StringWithAggregatesFilter<"PasskeyChallenge"> | string
    challenge?: StringWithAggregatesFilter<"PasskeyChallenge"> | string
    type?: StringWithAggregatesFilter<"PasskeyChallenge"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasskeyChallenge"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PasskeyChallenge"> | Date | string
  }

  export type AuthSessionWhereInput = {
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    userId?: StringFilter<"AuthSession"> | string
    refreshTokenHash?: StringFilter<"AuthSession"> | string
    refreshTokenId?: StringFilter<"AuthSession"> | string
    deviceFingerprint?: StringFilter<"AuthSession"> | string
    ipPrefix?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    rotatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }

  export type AuthSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    refreshTokenId?: SortOrder
    deviceFingerprint?: SortOrder
    ipPrefix?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    rotatedAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: AuthUserOrderByWithRelationInput
  }

  export type AuthSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    userId?: StringFilter<"AuthSession"> | string
    refreshTokenHash?: StringFilter<"AuthSession"> | string
    refreshTokenId?: StringFilter<"AuthSession"> | string
    deviceFingerprint?: StringFilter<"AuthSession"> | string
    ipPrefix?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    rotatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }, "id">

  export type AuthSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    refreshTokenId?: SortOrder
    deviceFingerprint?: SortOrder
    ipPrefix?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    rotatedAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuthSessionCountOrderByAggregateInput
    _max?: AuthSessionMaxOrderByAggregateInput
    _min?: AuthSessionMinOrderByAggregateInput
  }

  export type AuthSessionScalarWhereWithAggregatesInput = {
    AND?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    OR?: AuthSessionScalarWhereWithAggregatesInput[]
    NOT?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthSession"> | string
    userId?: StringWithAggregatesFilter<"AuthSession"> | string
    refreshTokenHash?: StringWithAggregatesFilter<"AuthSession"> | string
    refreshTokenId?: StringWithAggregatesFilter<"AuthSession"> | string
    deviceFingerprint?: StringWithAggregatesFilter<"AuthSession"> | string
    ipPrefix?: StringNullableWithAggregatesFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    rotatedAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
  }

  export type PasswordResetWhereInput = {
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    id?: StringFilter<"PasswordReset"> | string
    userId?: StringFilter<"PasswordReset"> | string
    tokenHash?: StringFilter<"PasswordReset"> | string
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }

  export type PasswordResetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: AuthUserOrderByWithRelationInput
  }

  export type PasswordResetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: PasswordResetWhereInput | PasswordResetWhereInput[]
    OR?: PasswordResetWhereInput[]
    NOT?: PasswordResetWhereInput | PasswordResetWhereInput[]
    userId?: StringFilter<"PasswordReset"> | string
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
    user?: XOR<AuthUserScalarRelationFilter, AuthUserWhereInput>
  }, "id" | "tokenHash">

  export type PasswordResetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetCountOrderByAggregateInput
    _max?: PasswordResetMaxOrderByAggregateInput
    _min?: PasswordResetMinOrderByAggregateInput
  }

  export type PasswordResetScalarWhereWithAggregatesInput = {
    AND?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    OR?: PasswordResetScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetScalarWhereWithAggregatesInput | PasswordResetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordReset"> | string
    userId?: StringWithAggregatesFilter<"PasswordReset"> | string
    tokenHash?: StringWithAggregatesFilter<"PasswordReset"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PasswordReset"> | Date | string
  }

  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    actorId?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    app?: StringFilter<"AuditEvent"> | string
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    app?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    actorId?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    app?: StringFilter<"AuditEvent"> | string
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    app?: SortOrder
    createdAt?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorId?: StringWithAggregatesFilter<"AuditEvent"> | string
    action?: StringWithAggregatesFilter<"AuditEvent"> | string
    app?: StringWithAggregatesFilter<"AuditEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type AppHealthSnapshotWhereInput = {
    AND?: AppHealthSnapshotWhereInput | AppHealthSnapshotWhereInput[]
    OR?: AppHealthSnapshotWhereInput[]
    NOT?: AppHealthSnapshotWhereInput | AppHealthSnapshotWhereInput[]
    id?: StringFilter<"AppHealthSnapshot"> | string
    app?: StringFilter<"AppHealthSnapshot"> | string
    status?: StringFilter<"AppHealthSnapshot"> | string
    details?: JsonNullableFilter<"AppHealthSnapshot">
    checkedAt?: DateTimeFilter<"AppHealthSnapshot"> | Date | string
  }

  export type AppHealthSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    app?: SortOrder
    status?: SortOrder
    details?: SortOrderInput | SortOrder
    checkedAt?: SortOrder
  }

  export type AppHealthSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppHealthSnapshotWhereInput | AppHealthSnapshotWhereInput[]
    OR?: AppHealthSnapshotWhereInput[]
    NOT?: AppHealthSnapshotWhereInput | AppHealthSnapshotWhereInput[]
    app?: StringFilter<"AppHealthSnapshot"> | string
    status?: StringFilter<"AppHealthSnapshot"> | string
    details?: JsonNullableFilter<"AppHealthSnapshot">
    checkedAt?: DateTimeFilter<"AppHealthSnapshot"> | Date | string
  }, "id">

  export type AppHealthSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    app?: SortOrder
    status?: SortOrder
    details?: SortOrderInput | SortOrder
    checkedAt?: SortOrder
    _count?: AppHealthSnapshotCountOrderByAggregateInput
    _max?: AppHealthSnapshotMaxOrderByAggregateInput
    _min?: AppHealthSnapshotMinOrderByAggregateInput
  }

  export type AppHealthSnapshotScalarWhereWithAggregatesInput = {
    AND?: AppHealthSnapshotScalarWhereWithAggregatesInput | AppHealthSnapshotScalarWhereWithAggregatesInput[]
    OR?: AppHealthSnapshotScalarWhereWithAggregatesInput[]
    NOT?: AppHealthSnapshotScalarWhereWithAggregatesInput | AppHealthSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AppHealthSnapshot"> | string
    app?: StringWithAggregatesFilter<"AppHealthSnapshot"> | string
    status?: StringWithAggregatesFilter<"AppHealthSnapshot"> | string
    details?: JsonNullableWithAggregatesFilter<"AppHealthSnapshot">
    checkedAt?: DateTimeWithAggregatesFilter<"AppHealthSnapshot"> | Date | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    slug?: StringFilter<"Company"> | string
    publicWebsiteUrl?: StringNullableFilter<"Company"> | string | null
    ownerConsoleUrl?: StringNullableFilter<"Company"> | string | null
    merchantConsoleUrl?: StringNullableFilter<"Company"> | string | null
    active?: BoolFilter<"Company"> | boolean
    settings?: JsonNullableFilter<"Company">
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    modules?: CompanyModuleListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    publicWebsiteUrl?: SortOrderInput | SortOrder
    ownerConsoleUrl?: SortOrderInput | SortOrder
    merchantConsoleUrl?: SortOrderInput | SortOrder
    active?: SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modules?: CompanyModuleOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    publicWebsiteUrl?: StringNullableFilter<"Company"> | string | null
    ownerConsoleUrl?: StringNullableFilter<"Company"> | string | null
    merchantConsoleUrl?: StringNullableFilter<"Company"> | string | null
    active?: BoolFilter<"Company"> | boolean
    settings?: JsonNullableFilter<"Company">
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    modules?: CompanyModuleListRelationFilter
  }, "id" | "slug">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    publicWebsiteUrl?: SortOrderInput | SortOrder
    ownerConsoleUrl?: SortOrderInput | SortOrder
    merchantConsoleUrl?: SortOrderInput | SortOrder
    active?: SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    slug?: StringWithAggregatesFilter<"Company"> | string
    publicWebsiteUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    ownerConsoleUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    merchantConsoleUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    active?: BoolWithAggregatesFilter<"Company"> | boolean
    settings?: JsonNullableWithAggregatesFilter<"Company">
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type CompanyModuleWhereInput = {
    AND?: CompanyModuleWhereInput | CompanyModuleWhereInput[]
    OR?: CompanyModuleWhereInput[]
    NOT?: CompanyModuleWhereInput | CompanyModuleWhereInput[]
    id?: StringFilter<"CompanyModule"> | string
    companyId?: StringFilter<"CompanyModule"> | string
    module?: StringFilter<"CompanyModule"> | string
    enabled?: BoolFilter<"CompanyModule"> | boolean
    settings?: JsonNullableFilter<"CompanyModule">
    updatedAt?: DateTimeFilter<"CompanyModule"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
  }

  export type CompanyModuleOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    module?: SortOrder
    enabled?: SortOrder
    settings?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
  }

  export type CompanyModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    companyId_module?: CompanyModuleCompanyIdModuleCompoundUniqueInput
    AND?: CompanyModuleWhereInput | CompanyModuleWhereInput[]
    OR?: CompanyModuleWhereInput[]
    NOT?: CompanyModuleWhereInput | CompanyModuleWhereInput[]
    companyId?: StringFilter<"CompanyModule"> | string
    module?: StringFilter<"CompanyModule"> | string
    enabled?: BoolFilter<"CompanyModule"> | boolean
    settings?: JsonNullableFilter<"CompanyModule">
    updatedAt?: DateTimeFilter<"CompanyModule"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
  }, "id" | "companyId_module">

  export type CompanyModuleOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    module?: SortOrder
    enabled?: SortOrder
    settings?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: CompanyModuleCountOrderByAggregateInput
    _max?: CompanyModuleMaxOrderByAggregateInput
    _min?: CompanyModuleMinOrderByAggregateInput
  }

  export type CompanyModuleScalarWhereWithAggregatesInput = {
    AND?: CompanyModuleScalarWhereWithAggregatesInput | CompanyModuleScalarWhereWithAggregatesInput[]
    OR?: CompanyModuleScalarWhereWithAggregatesInput[]
    NOT?: CompanyModuleScalarWhereWithAggregatesInput | CompanyModuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompanyModule"> | string
    companyId?: StringWithAggregatesFilter<"CompanyModule"> | string
    module?: StringWithAggregatesFilter<"CompanyModule"> | string
    enabled?: BoolWithAggregatesFilter<"CompanyModule"> | boolean
    settings?: JsonNullableWithAggregatesFilter<"CompanyModule">
    updatedAt?: DateTimeWithAggregatesFilter<"CompanyModule"> | Date | string
  }

  export type PackageApplicationWhereInput = {
    AND?: PackageApplicationWhereInput | PackageApplicationWhereInput[]
    OR?: PackageApplicationWhereInput[]
    NOT?: PackageApplicationWhereInput | PackageApplicationWhereInput[]
    id?: StringFilter<"PackageApplication"> | string
    app?: StringFilter<"PackageApplication"> | string
    plan?: StringFilter<"PackageApplication"> | string
    businessName?: StringFilter<"PackageApplication"> | string
    contactName?: StringFilter<"PackageApplication"> | string
    email?: StringFilter<"PackageApplication"> | string
    phone?: StringNullableFilter<"PackageApplication"> | string | null
    location?: StringNullableFilter<"PackageApplication"> | string | null
    businessType?: StringNullableFilter<"PackageApplication"> | string | null
    requirements?: StringFilter<"PackageApplication"> | string
    status?: StringFilter<"PackageApplication"> | string
    submittedBy?: StringFilter<"PackageApplication"> | string
    tenantId?: StringNullableFilter<"PackageApplication"> | string | null
    createdAt?: DateTimeFilter<"PackageApplication"> | Date | string
    updatedAt?: DateTimeFilter<"PackageApplication"> | Date | string
  }

  export type PackageApplicationOrderByWithRelationInput = {
    id?: SortOrder
    app?: SortOrder
    plan?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    businessType?: SortOrderInput | SortOrder
    requirements?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PackageApplicationWhereInput | PackageApplicationWhereInput[]
    OR?: PackageApplicationWhereInput[]
    NOT?: PackageApplicationWhereInput | PackageApplicationWhereInput[]
    app?: StringFilter<"PackageApplication"> | string
    plan?: StringFilter<"PackageApplication"> | string
    businessName?: StringFilter<"PackageApplication"> | string
    contactName?: StringFilter<"PackageApplication"> | string
    email?: StringFilter<"PackageApplication"> | string
    phone?: StringNullableFilter<"PackageApplication"> | string | null
    location?: StringNullableFilter<"PackageApplication"> | string | null
    businessType?: StringNullableFilter<"PackageApplication"> | string | null
    requirements?: StringFilter<"PackageApplication"> | string
    status?: StringFilter<"PackageApplication"> | string
    submittedBy?: StringFilter<"PackageApplication"> | string
    tenantId?: StringNullableFilter<"PackageApplication"> | string | null
    createdAt?: DateTimeFilter<"PackageApplication"> | Date | string
    updatedAt?: DateTimeFilter<"PackageApplication"> | Date | string
  }, "id">

  export type PackageApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    app?: SortOrder
    plan?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    businessType?: SortOrderInput | SortOrder
    requirements?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PackageApplicationCountOrderByAggregateInput
    _max?: PackageApplicationMaxOrderByAggregateInput
    _min?: PackageApplicationMinOrderByAggregateInput
  }

  export type PackageApplicationScalarWhereWithAggregatesInput = {
    AND?: PackageApplicationScalarWhereWithAggregatesInput | PackageApplicationScalarWhereWithAggregatesInput[]
    OR?: PackageApplicationScalarWhereWithAggregatesInput[]
    NOT?: PackageApplicationScalarWhereWithAggregatesInput | PackageApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PackageApplication"> | string
    app?: StringWithAggregatesFilter<"PackageApplication"> | string
    plan?: StringWithAggregatesFilter<"PackageApplication"> | string
    businessName?: StringWithAggregatesFilter<"PackageApplication"> | string
    contactName?: StringWithAggregatesFilter<"PackageApplication"> | string
    email?: StringWithAggregatesFilter<"PackageApplication"> | string
    phone?: StringNullableWithAggregatesFilter<"PackageApplication"> | string | null
    location?: StringNullableWithAggregatesFilter<"PackageApplication"> | string | null
    businessType?: StringNullableWithAggregatesFilter<"PackageApplication"> | string | null
    requirements?: StringWithAggregatesFilter<"PackageApplication"> | string
    status?: StringWithAggregatesFilter<"PackageApplication"> | string
    submittedBy?: StringWithAggregatesFilter<"PackageApplication"> | string
    tenantId?: StringNullableWithAggregatesFilter<"PackageApplication"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PackageApplication"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PackageApplication"> | Date | string
  }

  export type AuthUserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    resets?: PasswordResetCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialCreateNestedManyWithoutUserInput
  }

  export type AuthUserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    resets?: PasswordResetUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialUncheckedCreateNestedManyWithoutUserInput
  }

  export type AuthUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    resets?: PasswordResetUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUpdateManyWithoutUserNestedInput
  }

  export type AuthUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    resets?: PasswordResetUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuthUserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyCredentialCreateInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
    user: AuthUserCreateNestedOneWithoutPasskeysInput
  }

  export type PasskeyCredentialUncheckedCreateInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    userId: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyCredentialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: AuthUserUpdateOneRequiredWithoutPasskeysNestedInput
  }

  export type PasskeyCredentialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyCredentialCreateManyInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    userId: string
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyCredentialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyCredentialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyChallengeCreateInput = {
    id?: string
    email: string
    challenge: string
    type: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasskeyChallengeUncheckedCreateInput = {
    id?: string
    email: string
    challenge: string
    type: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasskeyChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    challenge?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    challenge?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyChallengeCreateManyInput = {
    id?: string
    email: string
    challenge: string
    type: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasskeyChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    challenge?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    challenge?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateInput = {
    id?: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    user: AuthUserCreateNestedOneWithoutSessionsInput
  }

  export type AuthSessionUncheckedCreateInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: AuthUserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type AuthSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateManyInput = {
    id?: string
    userId: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    user: AuthUserCreateNestedOneWithoutResetsInput
  }

  export type PasswordResetUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: AuthUserUpdateOneRequiredWithoutResetsNestedInput
  }

  export type PasswordResetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateInput = {
    id?: string
    actorId: string
    action: string
    app: string
    createdAt?: Date | string
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    actorId: string
    action: string
    app: string
    createdAt?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    actorId: string
    action: string
    app: string
    createdAt?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppHealthSnapshotCreateInput = {
    id?: string
    app: string
    status: string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: Date | string
  }

  export type AppHealthSnapshotUncheckedCreateInput = {
    id?: string
    app: string
    status: string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: Date | string
  }

  export type AppHealthSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppHealthSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppHealthSnapshotCreateManyInput = {
    id?: string
    app: string
    status: string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: Date | string
  }

  export type AppHealthSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppHealthSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    checkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyCreateInput = {
    id?: string
    name: string
    slug: string
    publicWebsiteUrl?: string | null
    ownerConsoleUrl?: string | null
    merchantConsoleUrl?: string | null
    active?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: CompanyModuleCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    publicWebsiteUrl?: string | null
    ownerConsoleUrl?: string | null
    merchantConsoleUrl?: string | null
    active?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: CompanyModuleUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: CompanyModuleUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: CompanyModuleUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: string
    name: string
    slug: string
    publicWebsiteUrl?: string | null
    ownerConsoleUrl?: string | null
    merchantConsoleUrl?: string | null
    active?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyModuleCreateInput = {
    id?: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutModulesInput
  }

  export type CompanyModuleUncheckedCreateInput = {
    id?: string
    companyId: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type CompanyModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutModulesNestedInput
  }

  export type CompanyModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyModuleCreateManyInput = {
    id?: string
    companyId: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type CompanyModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageApplicationCreateInput = {
    id?: string
    app: string
    plan: string
    businessName: string
    contactName: string
    email: string
    phone?: string | null
    location?: string | null
    businessType?: string | null
    requirements: string
    status?: string
    submittedBy: string
    tenantId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageApplicationUncheckedCreateInput = {
    id?: string
    app: string
    plan: string
    businessName: string
    contactName: string
    email: string
    phone?: string | null
    location?: string | null
    businessType?: string | null
    requirements: string
    status?: string
    submittedBy: string
    tenantId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageApplicationCreateManyInput = {
    id?: string
    app: string
    plan: string
    businessName: string
    contactName: string
    email: string
    phone?: string | null
    location?: string | null
    businessType?: string | null
    requirements: string
    status?: string
    submittedBy: string
    tenantId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    app?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    businessType?: NullableStringFieldUpdateOperationsInput | string | null
    requirements?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    submittedBy?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuthSessionListRelationFilter = {
    every?: AuthSessionWhereInput
    some?: AuthSessionWhereInput
    none?: AuthSessionWhereInput
  }

  export type PasswordResetListRelationFilter = {
    every?: PasswordResetWhereInput
    some?: PasswordResetWhereInput
    none?: PasswordResetWhereInput
  }

  export type PasskeyCredentialListRelationFilter = {
    every?: PasskeyCredentialWhereInput
    some?: PasskeyCredentialWhereInput
    none?: PasskeyCredentialWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuthSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasswordResetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasskeyCredentialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    tenantId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AuthUserScalarRelationFilter = {
    is?: AuthUserWhereInput
    isNot?: AuthUserWhereInput
  }

  export type PasskeyCredentialCountOrderByAggregateInput = {
    id?: SortOrder
    credentialId?: SortOrder
    publicKey?: SortOrder
    counter?: SortOrder
    transports?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type PasskeyCredentialAvgOrderByAggregateInput = {
    counter?: SortOrder
  }

  export type PasskeyCredentialMaxOrderByAggregateInput = {
    id?: SortOrder
    credentialId?: SortOrder
    publicKey?: SortOrder
    counter?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type PasskeyCredentialMinOrderByAggregateInput = {
    id?: SortOrder
    credentialId?: SortOrder
    publicKey?: SortOrder
    counter?: SortOrder
    deviceType?: SortOrder
    backedUp?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type PasskeyCredentialSumOrderByAggregateInput = {
    counter?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PasskeyChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    challenge?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasskeyChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    challenge?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasskeyChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    challenge?: SortOrder
    type?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    refreshTokenId?: SortOrder
    deviceFingerprint?: SortOrder
    ipPrefix?: SortOrder
    expiresAt?: SortOrder
    rotatedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    refreshTokenId?: SortOrder
    deviceFingerprint?: SortOrder
    ipPrefix?: SortOrder
    expiresAt?: SortOrder
    rotatedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshTokenHash?: SortOrder
    refreshTokenId?: SortOrder
    deviceFingerprint?: SortOrder
    ipPrefix?: SortOrder
    expiresAt?: SortOrder
    rotatedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    app?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    app?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    app?: SortOrder
    createdAt?: SortOrder
  }

  export type AppHealthSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    status?: SortOrder
    details?: SortOrder
    checkedAt?: SortOrder
  }

  export type AppHealthSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    status?: SortOrder
    checkedAt?: SortOrder
  }

  export type AppHealthSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    status?: SortOrder
    checkedAt?: SortOrder
  }

  export type CompanyModuleListRelationFilter = {
    every?: CompanyModuleWhereInput
    some?: CompanyModuleWhereInput
    none?: CompanyModuleWhereInput
  }

  export type CompanyModuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    publicWebsiteUrl?: SortOrder
    ownerConsoleUrl?: SortOrder
    merchantConsoleUrl?: SortOrder
    active?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    publicWebsiteUrl?: SortOrder
    ownerConsoleUrl?: SortOrder
    merchantConsoleUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    publicWebsiteUrl?: SortOrder
    ownerConsoleUrl?: SortOrder
    merchantConsoleUrl?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyScalarRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type CompanyModuleCompanyIdModuleCompoundUniqueInput = {
    companyId: string
    module: string
  }

  export type CompanyModuleCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    module?: SortOrder
    enabled?: SortOrder
    settings?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    module?: SortOrder
    enabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyModuleMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    module?: SortOrder
    enabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    plan?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    businessType?: SortOrder
    requirements?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    plan?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    businessType?: SortOrder
    requirements?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    app?: SortOrder
    plan?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    businessType?: SortOrder
    requirements?: SortOrder
    status?: SortOrder
    submittedBy?: SortOrder
    tenantId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type PasswordResetCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput> | PasswordResetCreateWithoutUserInput[] | PasswordResetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCreateOrConnectWithoutUserInput | PasswordResetCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetCreateManyUserInputEnvelope
    connect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
  }

  export type PasskeyCredentialCreateNestedManyWithoutUserInput = {
    create?: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput> | PasskeyCredentialCreateWithoutUserInput[] | PasskeyCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCredentialCreateOrConnectWithoutUserInput | PasskeyCredentialCreateOrConnectWithoutUserInput[]
    createMany?: PasskeyCredentialCreateManyUserInputEnvelope
    connect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
  }

  export type AuthSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type PasswordResetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput> | PasswordResetCreateWithoutUserInput[] | PasswordResetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCreateOrConnectWithoutUserInput | PasswordResetCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetCreateManyUserInputEnvelope
    connect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
  }

  export type PasskeyCredentialUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput> | PasskeyCredentialCreateWithoutUserInput[] | PasskeyCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCredentialCreateOrConnectWithoutUserInput | PasskeyCredentialCreateOrConnectWithoutUserInput[]
    createMany?: PasskeyCredentialCreateManyUserInputEnvelope
    connect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuthSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutUserInput | AuthSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutUserInput | AuthSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutUserInput | AuthSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type PasswordResetUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput> | PasswordResetCreateWithoutUserInput[] | PasswordResetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCreateOrConnectWithoutUserInput | PasswordResetCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetUpsertWithWhereUniqueWithoutUserInput | PasswordResetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetCreateManyUserInputEnvelope
    set?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    disconnect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    delete?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    connect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    update?: PasswordResetUpdateWithWhereUniqueWithoutUserInput | PasswordResetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetUpdateManyWithWhereWithoutUserInput | PasswordResetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetScalarWhereInput | PasswordResetScalarWhereInput[]
  }

  export type PasskeyCredentialUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput> | PasskeyCredentialCreateWithoutUserInput[] | PasskeyCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCredentialCreateOrConnectWithoutUserInput | PasskeyCredentialCreateOrConnectWithoutUserInput[]
    upsert?: PasskeyCredentialUpsertWithWhereUniqueWithoutUserInput | PasskeyCredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasskeyCredentialCreateManyUserInputEnvelope
    set?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    disconnect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    delete?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    connect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    update?: PasskeyCredentialUpdateWithWhereUniqueWithoutUserInput | PasskeyCredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasskeyCredentialUpdateManyWithWhereWithoutUserInput | PasskeyCredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasskeyCredentialScalarWhereInput | PasskeyCredentialScalarWhereInput[]
  }

  export type AuthSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutUserInput | AuthSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutUserInput | AuthSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutUserInput | AuthSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type PasswordResetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput> | PasswordResetCreateWithoutUserInput[] | PasswordResetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCreateOrConnectWithoutUserInput | PasswordResetCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetUpsertWithWhereUniqueWithoutUserInput | PasswordResetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetCreateManyUserInputEnvelope
    set?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    disconnect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    delete?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    connect?: PasswordResetWhereUniqueInput | PasswordResetWhereUniqueInput[]
    update?: PasswordResetUpdateWithWhereUniqueWithoutUserInput | PasswordResetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetUpdateManyWithWhereWithoutUserInput | PasswordResetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetScalarWhereInput | PasswordResetScalarWhereInput[]
  }

  export type PasskeyCredentialUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput> | PasskeyCredentialCreateWithoutUserInput[] | PasskeyCredentialUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasskeyCredentialCreateOrConnectWithoutUserInput | PasskeyCredentialCreateOrConnectWithoutUserInput[]
    upsert?: PasskeyCredentialUpsertWithWhereUniqueWithoutUserInput | PasskeyCredentialUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasskeyCredentialCreateManyUserInputEnvelope
    set?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    disconnect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    delete?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    connect?: PasskeyCredentialWhereUniqueInput | PasskeyCredentialWhereUniqueInput[]
    update?: PasskeyCredentialUpdateWithWhereUniqueWithoutUserInput | PasskeyCredentialUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasskeyCredentialUpdateManyWithWhereWithoutUserInput | PasskeyCredentialUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasskeyCredentialScalarWhereInput | PasskeyCredentialScalarWhereInput[]
  }

  export type AuthUserCreateNestedOneWithoutPasskeysInput = {
    create?: XOR<AuthUserCreateWithoutPasskeysInput, AuthUserUncheckedCreateWithoutPasskeysInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutPasskeysInput
    connect?: AuthUserWhereUniqueInput
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Bytes
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AuthUserUpdateOneRequiredWithoutPasskeysNestedInput = {
    create?: XOR<AuthUserCreateWithoutPasskeysInput, AuthUserUncheckedCreateWithoutPasskeysInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutPasskeysInput
    upsert?: AuthUserUpsertWithoutPasskeysInput
    connect?: AuthUserWhereUniqueInput
    update?: XOR<XOR<AuthUserUpdateToOneWithWhereWithoutPasskeysInput, AuthUserUpdateWithoutPasskeysInput>, AuthUserUncheckedUpdateWithoutPasskeysInput>
  }

  export type AuthUserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<AuthUserCreateWithoutSessionsInput, AuthUserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutSessionsInput
    connect?: AuthUserWhereUniqueInput
  }

  export type AuthUserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<AuthUserCreateWithoutSessionsInput, AuthUserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutSessionsInput
    upsert?: AuthUserUpsertWithoutSessionsInput
    connect?: AuthUserWhereUniqueInput
    update?: XOR<XOR<AuthUserUpdateToOneWithWhereWithoutSessionsInput, AuthUserUpdateWithoutSessionsInput>, AuthUserUncheckedUpdateWithoutSessionsInput>
  }

  export type AuthUserCreateNestedOneWithoutResetsInput = {
    create?: XOR<AuthUserCreateWithoutResetsInput, AuthUserUncheckedCreateWithoutResetsInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutResetsInput
    connect?: AuthUserWhereUniqueInput
  }

  export type AuthUserUpdateOneRequiredWithoutResetsNestedInput = {
    create?: XOR<AuthUserCreateWithoutResetsInput, AuthUserUncheckedCreateWithoutResetsInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutResetsInput
    upsert?: AuthUserUpsertWithoutResetsInput
    connect?: AuthUserWhereUniqueInput
    update?: XOR<XOR<AuthUserUpdateToOneWithWhereWithoutResetsInput, AuthUserUpdateWithoutResetsInput>, AuthUserUncheckedUpdateWithoutResetsInput>
  }

  export type CompanyModuleCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput> | CompanyModuleCreateWithoutCompanyInput[] | CompanyModuleUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyModuleCreateOrConnectWithoutCompanyInput | CompanyModuleCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyModuleCreateManyCompanyInputEnvelope
    connect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
  }

  export type CompanyModuleUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput> | CompanyModuleCreateWithoutCompanyInput[] | CompanyModuleUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyModuleCreateOrConnectWithoutCompanyInput | CompanyModuleCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyModuleCreateManyCompanyInputEnvelope
    connect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
  }

  export type CompanyModuleUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput> | CompanyModuleCreateWithoutCompanyInput[] | CompanyModuleUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyModuleCreateOrConnectWithoutCompanyInput | CompanyModuleCreateOrConnectWithoutCompanyInput[]
    upsert?: CompanyModuleUpsertWithWhereUniqueWithoutCompanyInput | CompanyModuleUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CompanyModuleCreateManyCompanyInputEnvelope
    set?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    disconnect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    delete?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    connect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    update?: CompanyModuleUpdateWithWhereUniqueWithoutCompanyInput | CompanyModuleUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CompanyModuleUpdateManyWithWhereWithoutCompanyInput | CompanyModuleUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CompanyModuleScalarWhereInput | CompanyModuleScalarWhereInput[]
  }

  export type CompanyModuleUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput> | CompanyModuleCreateWithoutCompanyInput[] | CompanyModuleUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyModuleCreateOrConnectWithoutCompanyInput | CompanyModuleCreateOrConnectWithoutCompanyInput[]
    upsert?: CompanyModuleUpsertWithWhereUniqueWithoutCompanyInput | CompanyModuleUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CompanyModuleCreateManyCompanyInputEnvelope
    set?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    disconnect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    delete?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    connect?: CompanyModuleWhereUniqueInput | CompanyModuleWhereUniqueInput[]
    update?: CompanyModuleUpdateWithWhereUniqueWithoutCompanyInput | CompanyModuleUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CompanyModuleUpdateManyWithWhereWithoutCompanyInput | CompanyModuleUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CompanyModuleScalarWhereInput | CompanyModuleScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutModulesInput = {
    create?: XOR<CompanyCreateWithoutModulesInput, CompanyUncheckedCreateWithoutModulesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutModulesInput
    connect?: CompanyWhereUniqueInput
  }

  export type CompanyUpdateOneRequiredWithoutModulesNestedInput = {
    create?: XOR<CompanyCreateWithoutModulesInput, CompanyUncheckedCreateWithoutModulesInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutModulesInput
    upsert?: CompanyUpsertWithoutModulesInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutModulesInput, CompanyUpdateWithoutModulesInput>, CompanyUncheckedUpdateWithoutModulesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AuthSessionCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthSessionUncheckedCreateWithoutUserInput = {
    id?: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthSessionCreateOrConnectWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    create: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput>
  }

  export type AuthSessionCreateManyUserInputEnvelope = {
    data: AuthSessionCreateManyUserInput | AuthSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetUncheckedCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCreateOrConnectWithoutUserInput = {
    where: PasswordResetWhereUniqueInput
    create: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetCreateManyUserInputEnvelope = {
    data: PasswordResetCreateManyUserInput | PasswordResetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasskeyCredentialCreateWithoutUserInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyCredentialUncheckedCreateWithoutUserInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type PasskeyCredentialCreateOrConnectWithoutUserInput = {
    where: PasskeyCredentialWhereUniqueInput
    create: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput>
  }

  export type PasskeyCredentialCreateManyUserInputEnvelope = {
    data: PasskeyCredentialCreateManyUserInput | PasskeyCredentialCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuthSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    update: XOR<AuthSessionUpdateWithoutUserInput, AuthSessionUncheckedUpdateWithoutUserInput>
    create: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput>
  }

  export type AuthSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    data: XOR<AuthSessionUpdateWithoutUserInput, AuthSessionUncheckedUpdateWithoutUserInput>
  }

  export type AuthSessionUpdateManyWithWhereWithoutUserInput = {
    where: AuthSessionScalarWhereInput
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthSessionScalarWhereInput = {
    AND?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    OR?: AuthSessionScalarWhereInput[]
    NOT?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    userId?: StringFilter<"AuthSession"> | string
    refreshTokenHash?: StringFilter<"AuthSession"> | string
    refreshTokenId?: StringFilter<"AuthSession"> | string
    deviceFingerprint?: StringFilter<"AuthSession"> | string
    ipPrefix?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    rotatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
  }

  export type PasswordResetUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetWhereUniqueInput
    update: XOR<PasswordResetUpdateWithoutUserInput, PasswordResetUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetCreateWithoutUserInput, PasswordResetUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetWhereUniqueInput
    data: XOR<PasswordResetUpdateWithoutUserInput, PasswordResetUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetScalarWhereInput
    data: XOR<PasswordResetUpdateManyMutationInput, PasswordResetUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetScalarWhereInput = {
    AND?: PasswordResetScalarWhereInput | PasswordResetScalarWhereInput[]
    OR?: PasswordResetScalarWhereInput[]
    NOT?: PasswordResetScalarWhereInput | PasswordResetScalarWhereInput[]
    id?: StringFilter<"PasswordReset"> | string
    userId?: StringFilter<"PasswordReset"> | string
    tokenHash?: StringFilter<"PasswordReset"> | string
    expiresAt?: DateTimeFilter<"PasswordReset"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordReset"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordReset"> | Date | string
  }

  export type PasskeyCredentialUpsertWithWhereUniqueWithoutUserInput = {
    where: PasskeyCredentialWhereUniqueInput
    update: XOR<PasskeyCredentialUpdateWithoutUserInput, PasskeyCredentialUncheckedUpdateWithoutUserInput>
    create: XOR<PasskeyCredentialCreateWithoutUserInput, PasskeyCredentialUncheckedCreateWithoutUserInput>
  }

  export type PasskeyCredentialUpdateWithWhereUniqueWithoutUserInput = {
    where: PasskeyCredentialWhereUniqueInput
    data: XOR<PasskeyCredentialUpdateWithoutUserInput, PasskeyCredentialUncheckedUpdateWithoutUserInput>
  }

  export type PasskeyCredentialUpdateManyWithWhereWithoutUserInput = {
    where: PasskeyCredentialScalarWhereInput
    data: XOR<PasskeyCredentialUpdateManyMutationInput, PasskeyCredentialUncheckedUpdateManyWithoutUserInput>
  }

  export type PasskeyCredentialScalarWhereInput = {
    AND?: PasskeyCredentialScalarWhereInput | PasskeyCredentialScalarWhereInput[]
    OR?: PasskeyCredentialScalarWhereInput[]
    NOT?: PasskeyCredentialScalarWhereInput | PasskeyCredentialScalarWhereInput[]
    id?: StringFilter<"PasskeyCredential"> | string
    credentialId?: StringFilter<"PasskeyCredential"> | string
    publicKey?: BytesFilter<"PasskeyCredential"> | Bytes
    counter?: BigIntFilter<"PasskeyCredential"> | bigint | number
    transports?: JsonNullableFilter<"PasskeyCredential">
    deviceType?: StringNullableFilter<"PasskeyCredential"> | string | null
    backedUp?: BoolFilter<"PasskeyCredential"> | boolean
    userId?: StringFilter<"PasskeyCredential"> | string
    createdAt?: DateTimeFilter<"PasskeyCredential"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"PasskeyCredential"> | Date | string | null
  }

  export type AuthUserCreateWithoutPasskeysInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    resets?: PasswordResetCreateNestedManyWithoutUserInput
  }

  export type AuthUserUncheckedCreateWithoutPasskeysInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    resets?: PasswordResetUncheckedCreateNestedManyWithoutUserInput
  }

  export type AuthUserCreateOrConnectWithoutPasskeysInput = {
    where: AuthUserWhereUniqueInput
    create: XOR<AuthUserCreateWithoutPasskeysInput, AuthUserUncheckedCreateWithoutPasskeysInput>
  }

  export type AuthUserUpsertWithoutPasskeysInput = {
    update: XOR<AuthUserUpdateWithoutPasskeysInput, AuthUserUncheckedUpdateWithoutPasskeysInput>
    create: XOR<AuthUserCreateWithoutPasskeysInput, AuthUserUncheckedCreateWithoutPasskeysInput>
    where?: AuthUserWhereInput
  }

  export type AuthUserUpdateToOneWithWhereWithoutPasskeysInput = {
    where?: AuthUserWhereInput
    data: XOR<AuthUserUpdateWithoutPasskeysInput, AuthUserUncheckedUpdateWithoutPasskeysInput>
  }

  export type AuthUserUpdateWithoutPasskeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    resets?: PasswordResetUpdateManyWithoutUserNestedInput
  }

  export type AuthUserUncheckedUpdateWithoutPasskeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    resets?: PasswordResetUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuthUserCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    resets?: PasswordResetCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialCreateNestedManyWithoutUserInput
  }

  export type AuthUserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    resets?: PasswordResetUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialUncheckedCreateNestedManyWithoutUserInput
  }

  export type AuthUserCreateOrConnectWithoutSessionsInput = {
    where: AuthUserWhereUniqueInput
    create: XOR<AuthUserCreateWithoutSessionsInput, AuthUserUncheckedCreateWithoutSessionsInput>
  }

  export type AuthUserUpsertWithoutSessionsInput = {
    update: XOR<AuthUserUpdateWithoutSessionsInput, AuthUserUncheckedUpdateWithoutSessionsInput>
    create: XOR<AuthUserCreateWithoutSessionsInput, AuthUserUncheckedCreateWithoutSessionsInput>
    where?: AuthUserWhereInput
  }

  export type AuthUserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: AuthUserWhereInput
    data: XOR<AuthUserUpdateWithoutSessionsInput, AuthUserUncheckedUpdateWithoutSessionsInput>
  }

  export type AuthUserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resets?: PasswordResetUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUpdateManyWithoutUserNestedInput
  }

  export type AuthUserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resets?: PasswordResetUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuthUserCreateWithoutResetsInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialCreateNestedManyWithoutUserInput
  }

  export type AuthUserUncheckedCreateWithoutResetsInput = {
    id?: string
    email: string
    passwordHash: string
    role: string
    tenantId?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    passkeys?: PasskeyCredentialUncheckedCreateNestedManyWithoutUserInput
  }

  export type AuthUserCreateOrConnectWithoutResetsInput = {
    where: AuthUserWhereUniqueInput
    create: XOR<AuthUserCreateWithoutResetsInput, AuthUserUncheckedCreateWithoutResetsInput>
  }

  export type AuthUserUpsertWithoutResetsInput = {
    update: XOR<AuthUserUpdateWithoutResetsInput, AuthUserUncheckedUpdateWithoutResetsInput>
    create: XOR<AuthUserCreateWithoutResetsInput, AuthUserUncheckedCreateWithoutResetsInput>
    where?: AuthUserWhereInput
  }

  export type AuthUserUpdateToOneWithWhereWithoutResetsInput = {
    where?: AuthUserWhereInput
    data: XOR<AuthUserUpdateWithoutResetsInput, AuthUserUncheckedUpdateWithoutResetsInput>
  }

  export type AuthUserUpdateWithoutResetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUpdateManyWithoutUserNestedInput
  }

  export type AuthUserUncheckedUpdateWithoutResetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    passkeys?: PasskeyCredentialUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CompanyModuleCreateWithoutCompanyInput = {
    id?: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type CompanyModuleUncheckedCreateWithoutCompanyInput = {
    id?: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type CompanyModuleCreateOrConnectWithoutCompanyInput = {
    where: CompanyModuleWhereUniqueInput
    create: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput>
  }

  export type CompanyModuleCreateManyCompanyInputEnvelope = {
    data: CompanyModuleCreateManyCompanyInput | CompanyModuleCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type CompanyModuleUpsertWithWhereUniqueWithoutCompanyInput = {
    where: CompanyModuleWhereUniqueInput
    update: XOR<CompanyModuleUpdateWithoutCompanyInput, CompanyModuleUncheckedUpdateWithoutCompanyInput>
    create: XOR<CompanyModuleCreateWithoutCompanyInput, CompanyModuleUncheckedCreateWithoutCompanyInput>
  }

  export type CompanyModuleUpdateWithWhereUniqueWithoutCompanyInput = {
    where: CompanyModuleWhereUniqueInput
    data: XOR<CompanyModuleUpdateWithoutCompanyInput, CompanyModuleUncheckedUpdateWithoutCompanyInput>
  }

  export type CompanyModuleUpdateManyWithWhereWithoutCompanyInput = {
    where: CompanyModuleScalarWhereInput
    data: XOR<CompanyModuleUpdateManyMutationInput, CompanyModuleUncheckedUpdateManyWithoutCompanyInput>
  }

  export type CompanyModuleScalarWhereInput = {
    AND?: CompanyModuleScalarWhereInput | CompanyModuleScalarWhereInput[]
    OR?: CompanyModuleScalarWhereInput[]
    NOT?: CompanyModuleScalarWhereInput | CompanyModuleScalarWhereInput[]
    id?: StringFilter<"CompanyModule"> | string
    companyId?: StringFilter<"CompanyModule"> | string
    module?: StringFilter<"CompanyModule"> | string
    enabled?: BoolFilter<"CompanyModule"> | boolean
    settings?: JsonNullableFilter<"CompanyModule">
    updatedAt?: DateTimeFilter<"CompanyModule"> | Date | string
  }

  export type CompanyCreateWithoutModulesInput = {
    id?: string
    name: string
    slug: string
    publicWebsiteUrl?: string | null
    ownerConsoleUrl?: string | null
    merchantConsoleUrl?: string | null
    active?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUncheckedCreateWithoutModulesInput = {
    id?: string
    name: string
    slug: string
    publicWebsiteUrl?: string | null
    ownerConsoleUrl?: string | null
    merchantConsoleUrl?: string | null
    active?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyCreateOrConnectWithoutModulesInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutModulesInput, CompanyUncheckedCreateWithoutModulesInput>
  }

  export type CompanyUpsertWithoutModulesInput = {
    update: XOR<CompanyUpdateWithoutModulesInput, CompanyUncheckedUpdateWithoutModulesInput>
    create: XOR<CompanyCreateWithoutModulesInput, CompanyUncheckedCreateWithoutModulesInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutModulesInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutModulesInput, CompanyUncheckedUpdateWithoutModulesInput>
  }

  export type CompanyUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    publicWebsiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    merchantConsoleUrl?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateManyUserInput = {
    id?: string
    refreshTokenHash: string
    refreshTokenId: string
    deviceFingerprint: string
    ipPrefix?: string | null
    expiresAt: Date | string
    rotatedAt?: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCreateManyUserInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasskeyCredentialCreateManyUserInput = {
    id?: string
    credentialId: string
    publicKey: Bytes
    counter?: bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: string | null
    backedUp?: boolean
    createdAt?: Date | string
    lastUsedAt?: Date | string | null
  }

  export type AuthSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    refreshTokenId?: StringFieldUpdateOperationsInput | string
    deviceFingerprint?: StringFieldUpdateOperationsInput | string
    ipPrefix?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rotatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasskeyCredentialUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyCredentialUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasskeyCredentialUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    credentialId?: StringFieldUpdateOperationsInput | string
    publicKey?: BytesFieldUpdateOperationsInput | Bytes
    counter?: BigIntFieldUpdateOperationsInput | bigint | number
    transports?: NullableJsonNullValueInput | InputJsonValue
    deviceType?: NullableStringFieldUpdateOperationsInput | string | null
    backedUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompanyModuleCreateManyCompanyInput = {
    id?: string
    module: string
    enabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type CompanyModuleUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyModuleUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyModuleUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}