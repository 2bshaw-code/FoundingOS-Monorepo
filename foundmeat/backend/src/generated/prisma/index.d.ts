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
 * Model MeatTrader
 * 
 */
export type MeatTrader = $Result.DefaultSelection<Prisma.$MeatTraderPayload>
/**
 * Model StockListing
 * 
 */
export type StockListing = $Result.DefaultSelection<Prisma.$StockListingPayload>

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
   * `prisma.meatTrader`: Exposes CRUD operations for the **MeatTrader** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeatTraders
    * const meatTraders = await prisma.meatTrader.findMany()
    * ```
    */
  get meatTrader(): Prisma.MeatTraderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockListing`: Exposes CRUD operations for the **StockListing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockListings
    * const stockListings = await prisma.stockListing.findMany()
    * ```
    */
  get stockListing(): Prisma.StockListingDelegate<ExtArgs, ClientOptions>;
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
    AuthSession: 'AuthSession',
    PasswordReset: 'PasswordReset',
    MeatTrader: 'MeatTrader',
    StockListing: 'StockListing'
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
      modelProps: "authUser" | "authSession" | "passwordReset" | "meatTrader" | "stockListing"
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
      MeatTrader: {
        payload: Prisma.$MeatTraderPayload<ExtArgs>
        fields: Prisma.MeatTraderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeatTraderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeatTraderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          findFirst: {
            args: Prisma.MeatTraderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeatTraderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          findMany: {
            args: Prisma.MeatTraderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>[]
          }
          create: {
            args: Prisma.MeatTraderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          createMany: {
            args: Prisma.MeatTraderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeatTraderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>[]
          }
          delete: {
            args: Prisma.MeatTraderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          update: {
            args: Prisma.MeatTraderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          deleteMany: {
            args: Prisma.MeatTraderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeatTraderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeatTraderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>[]
          }
          upsert: {
            args: Prisma.MeatTraderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeatTraderPayload>
          }
          aggregate: {
            args: Prisma.MeatTraderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeatTrader>
          }
          groupBy: {
            args: Prisma.MeatTraderGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeatTraderGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeatTraderCountArgs<ExtArgs>
            result: $Utils.Optional<MeatTraderCountAggregateOutputType> | number
          }
        }
      }
      StockListing: {
        payload: Prisma.$StockListingPayload<ExtArgs>
        fields: Prisma.StockListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          findFirst: {
            args: Prisma.StockListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          findMany: {
            args: Prisma.StockListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>[]
          }
          create: {
            args: Prisma.StockListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          createMany: {
            args: Prisma.StockListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>[]
          }
          delete: {
            args: Prisma.StockListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          update: {
            args: Prisma.StockListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          deleteMany: {
            args: Prisma.StockListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockListingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>[]
          }
          upsert: {
            args: Prisma.StockListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockListingPayload>
          }
          aggregate: {
            args: Prisma.StockListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockListing>
          }
          groupBy: {
            args: Prisma.StockListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockListingCountArgs<ExtArgs>
            result: $Utils.Optional<StockListingCountAggregateOutputType> | number
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
    authSession?: AuthSessionOmit
    passwordReset?: PasswordResetOmit
    meatTrader?: MeatTraderOmit
    stockListing?: StockListingOmit
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
  }

  export type AuthUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | AuthUserCountOutputTypeCountSessionsArgs
    resets?: boolean | AuthUserCountOutputTypeCountResetsArgs
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
   * Count Type MeatTraderCountOutputType
   */

  export type MeatTraderCountOutputType = {
    listings: number
  }

  export type MeatTraderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listings?: boolean | MeatTraderCountOutputTypeCountListingsArgs
  }

  // Custom InputTypes
  /**
   * MeatTraderCountOutputType without action
   */
  export type MeatTraderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTraderCountOutputType
     */
    select?: MeatTraderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeatTraderCountOutputType without action
   */
  export type MeatTraderCountOutputTypeCountListingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockListingWhereInput
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
    _count?: boolean | AuthUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuthUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuthUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthUser"
    objects: {
      sessions: Prisma.$AuthSessionPayload<ExtArgs>[]
      resets: Prisma.$PasswordResetPayload<ExtArgs>[]
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
   * Model MeatTrader
   */

  export type AggregateMeatTrader = {
    _count: MeatTraderCountAggregateOutputType | null
    _min: MeatTraderMinAggregateOutputType | null
    _max: MeatTraderMaxAggregateOutputType | null
  }

  export type MeatTraderMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    package: string | null
    createdAt: Date | null
  }

  export type MeatTraderMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    package: string | null
    createdAt: Date | null
  }

  export type MeatTraderCountAggregateOutputType = {
    id: number
    name: number
    type: number
    package: number
    createdAt: number
    _all: number
  }


  export type MeatTraderMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    package?: true
    createdAt?: true
  }

  export type MeatTraderMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    package?: true
    createdAt?: true
  }

  export type MeatTraderCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    package?: true
    createdAt?: true
    _all?: true
  }

  export type MeatTraderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeatTrader to aggregate.
     */
    where?: MeatTraderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeatTraders to fetch.
     */
    orderBy?: MeatTraderOrderByWithRelationInput | MeatTraderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeatTraderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeatTraders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeatTraders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeatTraders
    **/
    _count?: true | MeatTraderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeatTraderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeatTraderMaxAggregateInputType
  }

  export type GetMeatTraderAggregateType<T extends MeatTraderAggregateArgs> = {
        [P in keyof T & keyof AggregateMeatTrader]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeatTrader[P]>
      : GetScalarType<T[P], AggregateMeatTrader[P]>
  }




  export type MeatTraderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeatTraderWhereInput
    orderBy?: MeatTraderOrderByWithAggregationInput | MeatTraderOrderByWithAggregationInput[]
    by: MeatTraderScalarFieldEnum[] | MeatTraderScalarFieldEnum
    having?: MeatTraderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeatTraderCountAggregateInputType | true
    _min?: MeatTraderMinAggregateInputType
    _max?: MeatTraderMaxAggregateInputType
  }

  export type MeatTraderGroupByOutputType = {
    id: string
    name: string
    type: string
    package: string
    createdAt: Date
    _count: MeatTraderCountAggregateOutputType | null
    _min: MeatTraderMinAggregateOutputType | null
    _max: MeatTraderMaxAggregateOutputType | null
  }

  type GetMeatTraderGroupByPayload<T extends MeatTraderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeatTraderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeatTraderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeatTraderGroupByOutputType[P]>
            : GetScalarType<T[P], MeatTraderGroupByOutputType[P]>
        }
      >
    >


  export type MeatTraderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    package?: boolean
    createdAt?: boolean
    listings?: boolean | MeatTrader$listingsArgs<ExtArgs>
    _count?: boolean | MeatTraderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meatTrader"]>

  export type MeatTraderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    package?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["meatTrader"]>

  export type MeatTraderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    package?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["meatTrader"]>

  export type MeatTraderSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    package?: boolean
    createdAt?: boolean
  }

  export type MeatTraderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "package" | "createdAt", ExtArgs["result"]["meatTrader"]>
  export type MeatTraderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listings?: boolean | MeatTrader$listingsArgs<ExtArgs>
    _count?: boolean | MeatTraderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MeatTraderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MeatTraderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MeatTraderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeatTrader"
    objects: {
      listings: Prisma.$StockListingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      package: string
      createdAt: Date
    }, ExtArgs["result"]["meatTrader"]>
    composites: {}
  }

  type MeatTraderGetPayload<S extends boolean | null | undefined | MeatTraderDefaultArgs> = $Result.GetResult<Prisma.$MeatTraderPayload, S>

  type MeatTraderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeatTraderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeatTraderCountAggregateInputType | true
    }

  export interface MeatTraderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeatTrader'], meta: { name: 'MeatTrader' } }
    /**
     * Find zero or one MeatTrader that matches the filter.
     * @param {MeatTraderFindUniqueArgs} args - Arguments to find a MeatTrader
     * @example
     * // Get one MeatTrader
     * const meatTrader = await prisma.meatTrader.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeatTraderFindUniqueArgs>(args: SelectSubset<T, MeatTraderFindUniqueArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeatTrader that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeatTraderFindUniqueOrThrowArgs} args - Arguments to find a MeatTrader
     * @example
     * // Get one MeatTrader
     * const meatTrader = await prisma.meatTrader.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeatTraderFindUniqueOrThrowArgs>(args: SelectSubset<T, MeatTraderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeatTrader that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderFindFirstArgs} args - Arguments to find a MeatTrader
     * @example
     * // Get one MeatTrader
     * const meatTrader = await prisma.meatTrader.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeatTraderFindFirstArgs>(args?: SelectSubset<T, MeatTraderFindFirstArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeatTrader that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderFindFirstOrThrowArgs} args - Arguments to find a MeatTrader
     * @example
     * // Get one MeatTrader
     * const meatTrader = await prisma.meatTrader.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeatTraderFindFirstOrThrowArgs>(args?: SelectSubset<T, MeatTraderFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeatTraders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeatTraders
     * const meatTraders = await prisma.meatTrader.findMany()
     * 
     * // Get first 10 MeatTraders
     * const meatTraders = await prisma.meatTrader.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meatTraderWithIdOnly = await prisma.meatTrader.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeatTraderFindManyArgs>(args?: SelectSubset<T, MeatTraderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeatTrader.
     * @param {MeatTraderCreateArgs} args - Arguments to create a MeatTrader.
     * @example
     * // Create one MeatTrader
     * const MeatTrader = await prisma.meatTrader.create({
     *   data: {
     *     // ... data to create a MeatTrader
     *   }
     * })
     * 
     */
    create<T extends MeatTraderCreateArgs>(args: SelectSubset<T, MeatTraderCreateArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeatTraders.
     * @param {MeatTraderCreateManyArgs} args - Arguments to create many MeatTraders.
     * @example
     * // Create many MeatTraders
     * const meatTrader = await prisma.meatTrader.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeatTraderCreateManyArgs>(args?: SelectSubset<T, MeatTraderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeatTraders and returns the data saved in the database.
     * @param {MeatTraderCreateManyAndReturnArgs} args - Arguments to create many MeatTraders.
     * @example
     * // Create many MeatTraders
     * const meatTrader = await prisma.meatTrader.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeatTraders and only return the `id`
     * const meatTraderWithIdOnly = await prisma.meatTrader.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeatTraderCreateManyAndReturnArgs>(args?: SelectSubset<T, MeatTraderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeatTrader.
     * @param {MeatTraderDeleteArgs} args - Arguments to delete one MeatTrader.
     * @example
     * // Delete one MeatTrader
     * const MeatTrader = await prisma.meatTrader.delete({
     *   where: {
     *     // ... filter to delete one MeatTrader
     *   }
     * })
     * 
     */
    delete<T extends MeatTraderDeleteArgs>(args: SelectSubset<T, MeatTraderDeleteArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeatTrader.
     * @param {MeatTraderUpdateArgs} args - Arguments to update one MeatTrader.
     * @example
     * // Update one MeatTrader
     * const meatTrader = await prisma.meatTrader.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeatTraderUpdateArgs>(args: SelectSubset<T, MeatTraderUpdateArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeatTraders.
     * @param {MeatTraderDeleteManyArgs} args - Arguments to filter MeatTraders to delete.
     * @example
     * // Delete a few MeatTraders
     * const { count } = await prisma.meatTrader.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeatTraderDeleteManyArgs>(args?: SelectSubset<T, MeatTraderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeatTraders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeatTraders
     * const meatTrader = await prisma.meatTrader.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeatTraderUpdateManyArgs>(args: SelectSubset<T, MeatTraderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeatTraders and returns the data updated in the database.
     * @param {MeatTraderUpdateManyAndReturnArgs} args - Arguments to update many MeatTraders.
     * @example
     * // Update many MeatTraders
     * const meatTrader = await prisma.meatTrader.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeatTraders and only return the `id`
     * const meatTraderWithIdOnly = await prisma.meatTrader.updateManyAndReturn({
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
    updateManyAndReturn<T extends MeatTraderUpdateManyAndReturnArgs>(args: SelectSubset<T, MeatTraderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeatTrader.
     * @param {MeatTraderUpsertArgs} args - Arguments to update or create a MeatTrader.
     * @example
     * // Update or create a MeatTrader
     * const meatTrader = await prisma.meatTrader.upsert({
     *   create: {
     *     // ... data to create a MeatTrader
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeatTrader we want to update
     *   }
     * })
     */
    upsert<T extends MeatTraderUpsertArgs>(args: SelectSubset<T, MeatTraderUpsertArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeatTraders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderCountArgs} args - Arguments to filter MeatTraders to count.
     * @example
     * // Count the number of MeatTraders
     * const count = await prisma.meatTrader.count({
     *   where: {
     *     // ... the filter for the MeatTraders we want to count
     *   }
     * })
    **/
    count<T extends MeatTraderCountArgs>(
      args?: Subset<T, MeatTraderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeatTraderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeatTrader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MeatTraderAggregateArgs>(args: Subset<T, MeatTraderAggregateArgs>): Prisma.PrismaPromise<GetMeatTraderAggregateType<T>>

    /**
     * Group by MeatTrader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeatTraderGroupByArgs} args - Group by arguments.
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
      T extends MeatTraderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeatTraderGroupByArgs['orderBy'] }
        : { orderBy?: MeatTraderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MeatTraderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeatTraderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeatTrader model
   */
  readonly fields: MeatTraderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeatTrader.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeatTraderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listings<T extends MeatTrader$listingsArgs<ExtArgs> = {}>(args?: Subset<T, MeatTrader$listingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the MeatTrader model
   */
  interface MeatTraderFieldRefs {
    readonly id: FieldRef<"MeatTrader", 'String'>
    readonly name: FieldRef<"MeatTrader", 'String'>
    readonly type: FieldRef<"MeatTrader", 'String'>
    readonly package: FieldRef<"MeatTrader", 'String'>
    readonly createdAt: FieldRef<"MeatTrader", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MeatTrader findUnique
   */
  export type MeatTraderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter, which MeatTrader to fetch.
     */
    where: MeatTraderWhereUniqueInput
  }

  /**
   * MeatTrader findUniqueOrThrow
   */
  export type MeatTraderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter, which MeatTrader to fetch.
     */
    where: MeatTraderWhereUniqueInput
  }

  /**
   * MeatTrader findFirst
   */
  export type MeatTraderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter, which MeatTrader to fetch.
     */
    where?: MeatTraderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeatTraders to fetch.
     */
    orderBy?: MeatTraderOrderByWithRelationInput | MeatTraderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeatTraders.
     */
    cursor?: MeatTraderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeatTraders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeatTraders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeatTraders.
     */
    distinct?: MeatTraderScalarFieldEnum | MeatTraderScalarFieldEnum[]
  }

  /**
   * MeatTrader findFirstOrThrow
   */
  export type MeatTraderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter, which MeatTrader to fetch.
     */
    where?: MeatTraderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeatTraders to fetch.
     */
    orderBy?: MeatTraderOrderByWithRelationInput | MeatTraderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeatTraders.
     */
    cursor?: MeatTraderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeatTraders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeatTraders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeatTraders.
     */
    distinct?: MeatTraderScalarFieldEnum | MeatTraderScalarFieldEnum[]
  }

  /**
   * MeatTrader findMany
   */
  export type MeatTraderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter, which MeatTraders to fetch.
     */
    where?: MeatTraderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeatTraders to fetch.
     */
    orderBy?: MeatTraderOrderByWithRelationInput | MeatTraderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeatTraders.
     */
    cursor?: MeatTraderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeatTraders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeatTraders.
     */
    skip?: number
    distinct?: MeatTraderScalarFieldEnum | MeatTraderScalarFieldEnum[]
  }

  /**
   * MeatTrader create
   */
  export type MeatTraderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * The data needed to create a MeatTrader.
     */
    data: XOR<MeatTraderCreateInput, MeatTraderUncheckedCreateInput>
  }

  /**
   * MeatTrader createMany
   */
  export type MeatTraderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeatTraders.
     */
    data: MeatTraderCreateManyInput | MeatTraderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeatTrader createManyAndReturn
   */
  export type MeatTraderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * The data used to create many MeatTraders.
     */
    data: MeatTraderCreateManyInput | MeatTraderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeatTrader update
   */
  export type MeatTraderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * The data needed to update a MeatTrader.
     */
    data: XOR<MeatTraderUpdateInput, MeatTraderUncheckedUpdateInput>
    /**
     * Choose, which MeatTrader to update.
     */
    where: MeatTraderWhereUniqueInput
  }

  /**
   * MeatTrader updateMany
   */
  export type MeatTraderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeatTraders.
     */
    data: XOR<MeatTraderUpdateManyMutationInput, MeatTraderUncheckedUpdateManyInput>
    /**
     * Filter which MeatTraders to update
     */
    where?: MeatTraderWhereInput
    /**
     * Limit how many MeatTraders to update.
     */
    limit?: number
  }

  /**
   * MeatTrader updateManyAndReturn
   */
  export type MeatTraderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * The data used to update MeatTraders.
     */
    data: XOR<MeatTraderUpdateManyMutationInput, MeatTraderUncheckedUpdateManyInput>
    /**
     * Filter which MeatTraders to update
     */
    where?: MeatTraderWhereInput
    /**
     * Limit how many MeatTraders to update.
     */
    limit?: number
  }

  /**
   * MeatTrader upsert
   */
  export type MeatTraderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * The filter to search for the MeatTrader to update in case it exists.
     */
    where: MeatTraderWhereUniqueInput
    /**
     * In case the MeatTrader found by the `where` argument doesn't exist, create a new MeatTrader with this data.
     */
    create: XOR<MeatTraderCreateInput, MeatTraderUncheckedCreateInput>
    /**
     * In case the MeatTrader was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeatTraderUpdateInput, MeatTraderUncheckedUpdateInput>
  }

  /**
   * MeatTrader delete
   */
  export type MeatTraderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
    /**
     * Filter which MeatTrader to delete.
     */
    where: MeatTraderWhereUniqueInput
  }

  /**
   * MeatTrader deleteMany
   */
  export type MeatTraderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeatTraders to delete
     */
    where?: MeatTraderWhereInput
    /**
     * Limit how many MeatTraders to delete.
     */
    limit?: number
  }

  /**
   * MeatTrader.listings
   */
  export type MeatTrader$listingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    where?: StockListingWhereInput
    orderBy?: StockListingOrderByWithRelationInput | StockListingOrderByWithRelationInput[]
    cursor?: StockListingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockListingScalarFieldEnum | StockListingScalarFieldEnum[]
  }

  /**
   * MeatTrader without action
   */
  export type MeatTraderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeatTrader
     */
    select?: MeatTraderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeatTrader
     */
    omit?: MeatTraderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeatTraderInclude<ExtArgs> | null
  }


  /**
   * Model StockListing
   */

  export type AggregateStockListing = {
    _count: StockListingCountAggregateOutputType | null
    _avg: StockListingAvgAggregateOutputType | null
    _sum: StockListingSumAggregateOutputType | null
    _min: StockListingMinAggregateOutputType | null
    _max: StockListingMaxAggregateOutputType | null
  }

  export type StockListingAvgAggregateOutputType = {
    pricePence: number | null
    quantity: number | null
  }

  export type StockListingSumAggregateOutputType = {
    pricePence: number | null
    quantity: number | null
  }

  export type StockListingMinAggregateOutputType = {
    id: string | null
    cut: string | null
    pricePence: number | null
    quantity: number | null
    traderId: string | null
  }

  export type StockListingMaxAggregateOutputType = {
    id: string | null
    cut: string | null
    pricePence: number | null
    quantity: number | null
    traderId: string | null
  }

  export type StockListingCountAggregateOutputType = {
    id: number
    cut: number
    pricePence: number
    quantity: number
    traderId: number
    _all: number
  }


  export type StockListingAvgAggregateInputType = {
    pricePence?: true
    quantity?: true
  }

  export type StockListingSumAggregateInputType = {
    pricePence?: true
    quantity?: true
  }

  export type StockListingMinAggregateInputType = {
    id?: true
    cut?: true
    pricePence?: true
    quantity?: true
    traderId?: true
  }

  export type StockListingMaxAggregateInputType = {
    id?: true
    cut?: true
    pricePence?: true
    quantity?: true
    traderId?: true
  }

  export type StockListingCountAggregateInputType = {
    id?: true
    cut?: true
    pricePence?: true
    quantity?: true
    traderId?: true
    _all?: true
  }

  export type StockListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockListing to aggregate.
     */
    where?: StockListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockListings to fetch.
     */
    orderBy?: StockListingOrderByWithRelationInput | StockListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockListings
    **/
    _count?: true | StockListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockListingMaxAggregateInputType
  }

  export type GetStockListingAggregateType<T extends StockListingAggregateArgs> = {
        [P in keyof T & keyof AggregateStockListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockListing[P]>
      : GetScalarType<T[P], AggregateStockListing[P]>
  }




  export type StockListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockListingWhereInput
    orderBy?: StockListingOrderByWithAggregationInput | StockListingOrderByWithAggregationInput[]
    by: StockListingScalarFieldEnum[] | StockListingScalarFieldEnum
    having?: StockListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockListingCountAggregateInputType | true
    _avg?: StockListingAvgAggregateInputType
    _sum?: StockListingSumAggregateInputType
    _min?: StockListingMinAggregateInputType
    _max?: StockListingMaxAggregateInputType
  }

  export type StockListingGroupByOutputType = {
    id: string
    cut: string
    pricePence: number
    quantity: number
    traderId: string
    _count: StockListingCountAggregateOutputType | null
    _avg: StockListingAvgAggregateOutputType | null
    _sum: StockListingSumAggregateOutputType | null
    _min: StockListingMinAggregateOutputType | null
    _max: StockListingMaxAggregateOutputType | null
  }

  type GetStockListingGroupByPayload<T extends StockListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockListingGroupByOutputType[P]>
            : GetScalarType<T[P], StockListingGroupByOutputType[P]>
        }
      >
    >


  export type StockListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cut?: boolean
    pricePence?: boolean
    quantity?: boolean
    traderId?: boolean
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockListing"]>

  export type StockListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cut?: boolean
    pricePence?: boolean
    quantity?: boolean
    traderId?: boolean
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockListing"]>

  export type StockListingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cut?: boolean
    pricePence?: boolean
    quantity?: boolean
    traderId?: boolean
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockListing"]>

  export type StockListingSelectScalar = {
    id?: boolean
    cut?: boolean
    pricePence?: boolean
    quantity?: boolean
    traderId?: boolean
  }

  export type StockListingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cut" | "pricePence" | "quantity" | "traderId", ExtArgs["result"]["stockListing"]>
  export type StockListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }
  export type StockListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }
  export type StockListingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trader?: boolean | MeatTraderDefaultArgs<ExtArgs>
  }

  export type $StockListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockListing"
    objects: {
      trader: Prisma.$MeatTraderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cut: string
      pricePence: number
      quantity: number
      traderId: string
    }, ExtArgs["result"]["stockListing"]>
    composites: {}
  }

  type StockListingGetPayload<S extends boolean | null | undefined | StockListingDefaultArgs> = $Result.GetResult<Prisma.$StockListingPayload, S>

  type StockListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockListingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockListingCountAggregateInputType | true
    }

  export interface StockListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockListing'], meta: { name: 'StockListing' } }
    /**
     * Find zero or one StockListing that matches the filter.
     * @param {StockListingFindUniqueArgs} args - Arguments to find a StockListing
     * @example
     * // Get one StockListing
     * const stockListing = await prisma.stockListing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockListingFindUniqueArgs>(args: SelectSubset<T, StockListingFindUniqueArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockListing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockListingFindUniqueOrThrowArgs} args - Arguments to find a StockListing
     * @example
     * // Get one StockListing
     * const stockListing = await prisma.stockListing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockListingFindUniqueOrThrowArgs>(args: SelectSubset<T, StockListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockListing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingFindFirstArgs} args - Arguments to find a StockListing
     * @example
     * // Get one StockListing
     * const stockListing = await prisma.stockListing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockListingFindFirstArgs>(args?: SelectSubset<T, StockListingFindFirstArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockListing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingFindFirstOrThrowArgs} args - Arguments to find a StockListing
     * @example
     * // Get one StockListing
     * const stockListing = await prisma.stockListing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockListingFindFirstOrThrowArgs>(args?: SelectSubset<T, StockListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockListings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockListings
     * const stockListings = await prisma.stockListing.findMany()
     * 
     * // Get first 10 StockListings
     * const stockListings = await prisma.stockListing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockListingWithIdOnly = await prisma.stockListing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockListingFindManyArgs>(args?: SelectSubset<T, StockListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockListing.
     * @param {StockListingCreateArgs} args - Arguments to create a StockListing.
     * @example
     * // Create one StockListing
     * const StockListing = await prisma.stockListing.create({
     *   data: {
     *     // ... data to create a StockListing
     *   }
     * })
     * 
     */
    create<T extends StockListingCreateArgs>(args: SelectSubset<T, StockListingCreateArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockListings.
     * @param {StockListingCreateManyArgs} args - Arguments to create many StockListings.
     * @example
     * // Create many StockListings
     * const stockListing = await prisma.stockListing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockListingCreateManyArgs>(args?: SelectSubset<T, StockListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockListings and returns the data saved in the database.
     * @param {StockListingCreateManyAndReturnArgs} args - Arguments to create many StockListings.
     * @example
     * // Create many StockListings
     * const stockListing = await prisma.stockListing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockListings and only return the `id`
     * const stockListingWithIdOnly = await prisma.stockListing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockListingCreateManyAndReturnArgs>(args?: SelectSubset<T, StockListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockListing.
     * @param {StockListingDeleteArgs} args - Arguments to delete one StockListing.
     * @example
     * // Delete one StockListing
     * const StockListing = await prisma.stockListing.delete({
     *   where: {
     *     // ... filter to delete one StockListing
     *   }
     * })
     * 
     */
    delete<T extends StockListingDeleteArgs>(args: SelectSubset<T, StockListingDeleteArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockListing.
     * @param {StockListingUpdateArgs} args - Arguments to update one StockListing.
     * @example
     * // Update one StockListing
     * const stockListing = await prisma.stockListing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockListingUpdateArgs>(args: SelectSubset<T, StockListingUpdateArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockListings.
     * @param {StockListingDeleteManyArgs} args - Arguments to filter StockListings to delete.
     * @example
     * // Delete a few StockListings
     * const { count } = await prisma.stockListing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockListingDeleteManyArgs>(args?: SelectSubset<T, StockListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockListings
     * const stockListing = await prisma.stockListing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockListingUpdateManyArgs>(args: SelectSubset<T, StockListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockListings and returns the data updated in the database.
     * @param {StockListingUpdateManyAndReturnArgs} args - Arguments to update many StockListings.
     * @example
     * // Update many StockListings
     * const stockListing = await prisma.stockListing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockListings and only return the `id`
     * const stockListingWithIdOnly = await prisma.stockListing.updateManyAndReturn({
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
    updateManyAndReturn<T extends StockListingUpdateManyAndReturnArgs>(args: SelectSubset<T, StockListingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockListing.
     * @param {StockListingUpsertArgs} args - Arguments to update or create a StockListing.
     * @example
     * // Update or create a StockListing
     * const stockListing = await prisma.stockListing.upsert({
     *   create: {
     *     // ... data to create a StockListing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockListing we want to update
     *   }
     * })
     */
    upsert<T extends StockListingUpsertArgs>(args: SelectSubset<T, StockListingUpsertArgs<ExtArgs>>): Prisma__StockListingClient<$Result.GetResult<Prisma.$StockListingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockListings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingCountArgs} args - Arguments to filter StockListings to count.
     * @example
     * // Count the number of StockListings
     * const count = await prisma.stockListing.count({
     *   where: {
     *     // ... the filter for the StockListings we want to count
     *   }
     * })
    **/
    count<T extends StockListingCountArgs>(
      args?: Subset<T, StockListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StockListingAggregateArgs>(args: Subset<T, StockListingAggregateArgs>): Prisma.PrismaPromise<GetStockListingAggregateType<T>>

    /**
     * Group by StockListing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockListingGroupByArgs} args - Group by arguments.
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
      T extends StockListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockListingGroupByArgs['orderBy'] }
        : { orderBy?: StockListingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StockListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockListing model
   */
  readonly fields: StockListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockListing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trader<T extends MeatTraderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeatTraderDefaultArgs<ExtArgs>>): Prisma__MeatTraderClient<$Result.GetResult<Prisma.$MeatTraderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StockListing model
   */
  interface StockListingFieldRefs {
    readonly id: FieldRef<"StockListing", 'String'>
    readonly cut: FieldRef<"StockListing", 'String'>
    readonly pricePence: FieldRef<"StockListing", 'Int'>
    readonly quantity: FieldRef<"StockListing", 'Int'>
    readonly traderId: FieldRef<"StockListing", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StockListing findUnique
   */
  export type StockListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter, which StockListing to fetch.
     */
    where: StockListingWhereUniqueInput
  }

  /**
   * StockListing findUniqueOrThrow
   */
  export type StockListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter, which StockListing to fetch.
     */
    where: StockListingWhereUniqueInput
  }

  /**
   * StockListing findFirst
   */
  export type StockListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter, which StockListing to fetch.
     */
    where?: StockListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockListings to fetch.
     */
    orderBy?: StockListingOrderByWithRelationInput | StockListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockListings.
     */
    cursor?: StockListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockListings.
     */
    distinct?: StockListingScalarFieldEnum | StockListingScalarFieldEnum[]
  }

  /**
   * StockListing findFirstOrThrow
   */
  export type StockListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter, which StockListing to fetch.
     */
    where?: StockListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockListings to fetch.
     */
    orderBy?: StockListingOrderByWithRelationInput | StockListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockListings.
     */
    cursor?: StockListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockListings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockListings.
     */
    distinct?: StockListingScalarFieldEnum | StockListingScalarFieldEnum[]
  }

  /**
   * StockListing findMany
   */
  export type StockListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter, which StockListings to fetch.
     */
    where?: StockListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockListings to fetch.
     */
    orderBy?: StockListingOrderByWithRelationInput | StockListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockListings.
     */
    cursor?: StockListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockListings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockListings.
     */
    skip?: number
    distinct?: StockListingScalarFieldEnum | StockListingScalarFieldEnum[]
  }

  /**
   * StockListing create
   */
  export type StockListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * The data needed to create a StockListing.
     */
    data: XOR<StockListingCreateInput, StockListingUncheckedCreateInput>
  }

  /**
   * StockListing createMany
   */
  export type StockListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockListings.
     */
    data: StockListingCreateManyInput | StockListingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockListing createManyAndReturn
   */
  export type StockListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * The data used to create many StockListings.
     */
    data: StockListingCreateManyInput | StockListingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockListing update
   */
  export type StockListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * The data needed to update a StockListing.
     */
    data: XOR<StockListingUpdateInput, StockListingUncheckedUpdateInput>
    /**
     * Choose, which StockListing to update.
     */
    where: StockListingWhereUniqueInput
  }

  /**
   * StockListing updateMany
   */
  export type StockListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockListings.
     */
    data: XOR<StockListingUpdateManyMutationInput, StockListingUncheckedUpdateManyInput>
    /**
     * Filter which StockListings to update
     */
    where?: StockListingWhereInput
    /**
     * Limit how many StockListings to update.
     */
    limit?: number
  }

  /**
   * StockListing updateManyAndReturn
   */
  export type StockListingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * The data used to update StockListings.
     */
    data: XOR<StockListingUpdateManyMutationInput, StockListingUncheckedUpdateManyInput>
    /**
     * Filter which StockListings to update
     */
    where?: StockListingWhereInput
    /**
     * Limit how many StockListings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockListing upsert
   */
  export type StockListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * The filter to search for the StockListing to update in case it exists.
     */
    where: StockListingWhereUniqueInput
    /**
     * In case the StockListing found by the `where` argument doesn't exist, create a new StockListing with this data.
     */
    create: XOR<StockListingCreateInput, StockListingUncheckedCreateInput>
    /**
     * In case the StockListing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockListingUpdateInput, StockListingUncheckedUpdateInput>
  }

  /**
   * StockListing delete
   */
  export type StockListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
    /**
     * Filter which StockListing to delete.
     */
    where: StockListingWhereUniqueInput
  }

  /**
   * StockListing deleteMany
   */
  export type StockListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockListings to delete
     */
    where?: StockListingWhereInput
    /**
     * Limit how many StockListings to delete.
     */
    limit?: number
  }

  /**
   * StockListing without action
   */
  export type StockListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockListing
     */
    select?: StockListingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockListing
     */
    omit?: StockListingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockListingInclude<ExtArgs> | null
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


  export const MeatTraderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    package: 'package',
    createdAt: 'createdAt'
  };

  export type MeatTraderScalarFieldEnum = (typeof MeatTraderScalarFieldEnum)[keyof typeof MeatTraderScalarFieldEnum]


  export const StockListingScalarFieldEnum: {
    id: 'id',
    cut: 'cut',
    pricePence: 'pricePence',
    quantity: 'quantity',
    traderId: 'traderId'
  };

  export type StockListingScalarFieldEnum = (typeof StockListingScalarFieldEnum)[keyof typeof StockListingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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

  export type MeatTraderWhereInput = {
    AND?: MeatTraderWhereInput | MeatTraderWhereInput[]
    OR?: MeatTraderWhereInput[]
    NOT?: MeatTraderWhereInput | MeatTraderWhereInput[]
    id?: StringFilter<"MeatTrader"> | string
    name?: StringFilter<"MeatTrader"> | string
    type?: StringFilter<"MeatTrader"> | string
    package?: StringFilter<"MeatTrader"> | string
    createdAt?: DateTimeFilter<"MeatTrader"> | Date | string
    listings?: StockListingListRelationFilter
  }

  export type MeatTraderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
    listings?: StockListingOrderByRelationAggregateInput
  }

  export type MeatTraderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MeatTraderWhereInput | MeatTraderWhereInput[]
    OR?: MeatTraderWhereInput[]
    NOT?: MeatTraderWhereInput | MeatTraderWhereInput[]
    name?: StringFilter<"MeatTrader"> | string
    type?: StringFilter<"MeatTrader"> | string
    package?: StringFilter<"MeatTrader"> | string
    createdAt?: DateTimeFilter<"MeatTrader"> | Date | string
    listings?: StockListingListRelationFilter
  }, "id">

  export type MeatTraderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
    _count?: MeatTraderCountOrderByAggregateInput
    _max?: MeatTraderMaxOrderByAggregateInput
    _min?: MeatTraderMinOrderByAggregateInput
  }

  export type MeatTraderScalarWhereWithAggregatesInput = {
    AND?: MeatTraderScalarWhereWithAggregatesInput | MeatTraderScalarWhereWithAggregatesInput[]
    OR?: MeatTraderScalarWhereWithAggregatesInput[]
    NOT?: MeatTraderScalarWhereWithAggregatesInput | MeatTraderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeatTrader"> | string
    name?: StringWithAggregatesFilter<"MeatTrader"> | string
    type?: StringWithAggregatesFilter<"MeatTrader"> | string
    package?: StringWithAggregatesFilter<"MeatTrader"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MeatTrader"> | Date | string
  }

  export type StockListingWhereInput = {
    AND?: StockListingWhereInput | StockListingWhereInput[]
    OR?: StockListingWhereInput[]
    NOT?: StockListingWhereInput | StockListingWhereInput[]
    id?: StringFilter<"StockListing"> | string
    cut?: StringFilter<"StockListing"> | string
    pricePence?: IntFilter<"StockListing"> | number
    quantity?: IntFilter<"StockListing"> | number
    traderId?: StringFilter<"StockListing"> | string
    trader?: XOR<MeatTraderScalarRelationFilter, MeatTraderWhereInput>
  }

  export type StockListingOrderByWithRelationInput = {
    id?: SortOrder
    cut?: SortOrder
    pricePence?: SortOrder
    quantity?: SortOrder
    traderId?: SortOrder
    trader?: MeatTraderOrderByWithRelationInput
  }

  export type StockListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StockListingWhereInput | StockListingWhereInput[]
    OR?: StockListingWhereInput[]
    NOT?: StockListingWhereInput | StockListingWhereInput[]
    cut?: StringFilter<"StockListing"> | string
    pricePence?: IntFilter<"StockListing"> | number
    quantity?: IntFilter<"StockListing"> | number
    traderId?: StringFilter<"StockListing"> | string
    trader?: XOR<MeatTraderScalarRelationFilter, MeatTraderWhereInput>
  }, "id">

  export type StockListingOrderByWithAggregationInput = {
    id?: SortOrder
    cut?: SortOrder
    pricePence?: SortOrder
    quantity?: SortOrder
    traderId?: SortOrder
    _count?: StockListingCountOrderByAggregateInput
    _avg?: StockListingAvgOrderByAggregateInput
    _max?: StockListingMaxOrderByAggregateInput
    _min?: StockListingMinOrderByAggregateInput
    _sum?: StockListingSumOrderByAggregateInput
  }

  export type StockListingScalarWhereWithAggregatesInput = {
    AND?: StockListingScalarWhereWithAggregatesInput | StockListingScalarWhereWithAggregatesInput[]
    OR?: StockListingScalarWhereWithAggregatesInput[]
    NOT?: StockListingScalarWhereWithAggregatesInput | StockListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockListing"> | string
    cut?: StringWithAggregatesFilter<"StockListing"> | string
    pricePence?: IntWithAggregatesFilter<"StockListing"> | number
    quantity?: IntWithAggregatesFilter<"StockListing"> | number
    traderId?: StringWithAggregatesFilter<"StockListing"> | string
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

  export type MeatTraderCreateInput = {
    id?: string
    name: string
    type: string
    package: string
    createdAt?: Date | string
    listings?: StockListingCreateNestedManyWithoutTraderInput
  }

  export type MeatTraderUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    package: string
    createdAt?: Date | string
    listings?: StockListingUncheckedCreateNestedManyWithoutTraderInput
  }

  export type MeatTraderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: StockListingUpdateManyWithoutTraderNestedInput
  }

  export type MeatTraderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listings?: StockListingUncheckedUpdateManyWithoutTraderNestedInput
  }

  export type MeatTraderCreateManyInput = {
    id?: string
    name: string
    type: string
    package: string
    createdAt?: Date | string
  }

  export type MeatTraderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeatTraderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockListingCreateInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
    trader: MeatTraderCreateNestedOneWithoutListingsInput
  }

  export type StockListingUncheckedCreateInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
    traderId: string
  }

  export type StockListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    trader?: MeatTraderUpdateOneRequiredWithoutListingsNestedInput
  }

  export type StockListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    traderId?: StringFieldUpdateOperationsInput | string
  }

  export type StockListingCreateManyInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
    traderId: string
  }

  export type StockListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type StockListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    traderId?: StringFieldUpdateOperationsInput | string
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

  export type StockListingListRelationFilter = {
    every?: StockListingWhereInput
    some?: StockListingWhereInput
    none?: StockListingWhereInput
  }

  export type StockListingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MeatTraderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type MeatTraderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type MeatTraderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    package?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type MeatTraderScalarRelationFilter = {
    is?: MeatTraderWhereInput
    isNot?: MeatTraderWhereInput
  }

  export type StockListingCountOrderByAggregateInput = {
    id?: SortOrder
    cut?: SortOrder
    pricePence?: SortOrder
    quantity?: SortOrder
    traderId?: SortOrder
  }

  export type StockListingAvgOrderByAggregateInput = {
    pricePence?: SortOrder
    quantity?: SortOrder
  }

  export type StockListingMaxOrderByAggregateInput = {
    id?: SortOrder
    cut?: SortOrder
    pricePence?: SortOrder
    quantity?: SortOrder
    traderId?: SortOrder
  }

  export type StockListingMinOrderByAggregateInput = {
    id?: SortOrder
    cut?: SortOrder
    pricePence?: SortOrder
    quantity?: SortOrder
    traderId?: SortOrder
  }

  export type StockListingSumOrderByAggregateInput = {
    pricePence?: SortOrder
    quantity?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type AuthUserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<AuthUserCreateWithoutSessionsInput, AuthUserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AuthUserCreateOrConnectWithoutSessionsInput
    connect?: AuthUserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type StockListingCreateNestedManyWithoutTraderInput = {
    create?: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput> | StockListingCreateWithoutTraderInput[] | StockListingUncheckedCreateWithoutTraderInput[]
    connectOrCreate?: StockListingCreateOrConnectWithoutTraderInput | StockListingCreateOrConnectWithoutTraderInput[]
    createMany?: StockListingCreateManyTraderInputEnvelope
    connect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
  }

  export type StockListingUncheckedCreateNestedManyWithoutTraderInput = {
    create?: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput> | StockListingCreateWithoutTraderInput[] | StockListingUncheckedCreateWithoutTraderInput[]
    connectOrCreate?: StockListingCreateOrConnectWithoutTraderInput | StockListingCreateOrConnectWithoutTraderInput[]
    createMany?: StockListingCreateManyTraderInputEnvelope
    connect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
  }

  export type StockListingUpdateManyWithoutTraderNestedInput = {
    create?: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput> | StockListingCreateWithoutTraderInput[] | StockListingUncheckedCreateWithoutTraderInput[]
    connectOrCreate?: StockListingCreateOrConnectWithoutTraderInput | StockListingCreateOrConnectWithoutTraderInput[]
    upsert?: StockListingUpsertWithWhereUniqueWithoutTraderInput | StockListingUpsertWithWhereUniqueWithoutTraderInput[]
    createMany?: StockListingCreateManyTraderInputEnvelope
    set?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    disconnect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    delete?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    connect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    update?: StockListingUpdateWithWhereUniqueWithoutTraderInput | StockListingUpdateWithWhereUniqueWithoutTraderInput[]
    updateMany?: StockListingUpdateManyWithWhereWithoutTraderInput | StockListingUpdateManyWithWhereWithoutTraderInput[]
    deleteMany?: StockListingScalarWhereInput | StockListingScalarWhereInput[]
  }

  export type StockListingUncheckedUpdateManyWithoutTraderNestedInput = {
    create?: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput> | StockListingCreateWithoutTraderInput[] | StockListingUncheckedCreateWithoutTraderInput[]
    connectOrCreate?: StockListingCreateOrConnectWithoutTraderInput | StockListingCreateOrConnectWithoutTraderInput[]
    upsert?: StockListingUpsertWithWhereUniqueWithoutTraderInput | StockListingUpsertWithWhereUniqueWithoutTraderInput[]
    createMany?: StockListingCreateManyTraderInputEnvelope
    set?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    disconnect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    delete?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    connect?: StockListingWhereUniqueInput | StockListingWhereUniqueInput[]
    update?: StockListingUpdateWithWhereUniqueWithoutTraderInput | StockListingUpdateWithWhereUniqueWithoutTraderInput[]
    updateMany?: StockListingUpdateManyWithWhereWithoutTraderInput | StockListingUpdateManyWithWhereWithoutTraderInput[]
    deleteMany?: StockListingScalarWhereInput | StockListingScalarWhereInput[]
  }

  export type MeatTraderCreateNestedOneWithoutListingsInput = {
    create?: XOR<MeatTraderCreateWithoutListingsInput, MeatTraderUncheckedCreateWithoutListingsInput>
    connectOrCreate?: MeatTraderCreateOrConnectWithoutListingsInput
    connect?: MeatTraderWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MeatTraderUpdateOneRequiredWithoutListingsNestedInput = {
    create?: XOR<MeatTraderCreateWithoutListingsInput, MeatTraderUncheckedCreateWithoutListingsInput>
    connectOrCreate?: MeatTraderCreateOrConnectWithoutListingsInput
    upsert?: MeatTraderUpsertWithoutListingsInput
    connect?: MeatTraderWhereUniqueInput
    update?: XOR<XOR<MeatTraderUpdateToOneWithWhereWithoutListingsInput, MeatTraderUpdateWithoutListingsInput>, MeatTraderUncheckedUpdateWithoutListingsInput>
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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
  }

  export type StockListingCreateWithoutTraderInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
  }

  export type StockListingUncheckedCreateWithoutTraderInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
  }

  export type StockListingCreateOrConnectWithoutTraderInput = {
    where: StockListingWhereUniqueInput
    create: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput>
  }

  export type StockListingCreateManyTraderInputEnvelope = {
    data: StockListingCreateManyTraderInput | StockListingCreateManyTraderInput[]
    skipDuplicates?: boolean
  }

  export type StockListingUpsertWithWhereUniqueWithoutTraderInput = {
    where: StockListingWhereUniqueInput
    update: XOR<StockListingUpdateWithoutTraderInput, StockListingUncheckedUpdateWithoutTraderInput>
    create: XOR<StockListingCreateWithoutTraderInput, StockListingUncheckedCreateWithoutTraderInput>
  }

  export type StockListingUpdateWithWhereUniqueWithoutTraderInput = {
    where: StockListingWhereUniqueInput
    data: XOR<StockListingUpdateWithoutTraderInput, StockListingUncheckedUpdateWithoutTraderInput>
  }

  export type StockListingUpdateManyWithWhereWithoutTraderInput = {
    where: StockListingScalarWhereInput
    data: XOR<StockListingUpdateManyMutationInput, StockListingUncheckedUpdateManyWithoutTraderInput>
  }

  export type StockListingScalarWhereInput = {
    AND?: StockListingScalarWhereInput | StockListingScalarWhereInput[]
    OR?: StockListingScalarWhereInput[]
    NOT?: StockListingScalarWhereInput | StockListingScalarWhereInput[]
    id?: StringFilter<"StockListing"> | string
    cut?: StringFilter<"StockListing"> | string
    pricePence?: IntFilter<"StockListing"> | number
    quantity?: IntFilter<"StockListing"> | number
    traderId?: StringFilter<"StockListing"> | string
  }

  export type MeatTraderCreateWithoutListingsInput = {
    id?: string
    name: string
    type: string
    package: string
    createdAt?: Date | string
  }

  export type MeatTraderUncheckedCreateWithoutListingsInput = {
    id?: string
    name: string
    type: string
    package: string
    createdAt?: Date | string
  }

  export type MeatTraderCreateOrConnectWithoutListingsInput = {
    where: MeatTraderWhereUniqueInput
    create: XOR<MeatTraderCreateWithoutListingsInput, MeatTraderUncheckedCreateWithoutListingsInput>
  }

  export type MeatTraderUpsertWithoutListingsInput = {
    update: XOR<MeatTraderUpdateWithoutListingsInput, MeatTraderUncheckedUpdateWithoutListingsInput>
    create: XOR<MeatTraderCreateWithoutListingsInput, MeatTraderUncheckedCreateWithoutListingsInput>
    where?: MeatTraderWhereInput
  }

  export type MeatTraderUpdateToOneWithWhereWithoutListingsInput = {
    where?: MeatTraderWhereInput
    data: XOR<MeatTraderUpdateWithoutListingsInput, MeatTraderUncheckedUpdateWithoutListingsInput>
  }

  export type MeatTraderUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeatTraderUncheckedUpdateWithoutListingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    package?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StockListingCreateManyTraderInput = {
    id?: string
    cut: string
    pricePence: number
    quantity: number
  }

  export type StockListingUpdateWithoutTraderInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type StockListingUncheckedUpdateWithoutTraderInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type StockListingUncheckedUpdateManyWithoutTraderInput = {
    id?: StringFieldUpdateOperationsInput | string
    cut?: StringFieldUpdateOperationsInput | string
    pricePence?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
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