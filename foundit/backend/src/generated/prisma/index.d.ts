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
 * Model MarketplaceMerchant
 * 
 */
export type MarketplaceMerchant = $Result.DefaultSelection<Prisma.$MarketplaceMerchantPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ScrapedLink
 * 
 */
export type ScrapedLink = $Result.DefaultSelection<Prisma.$ScrapedLinkPayload>
/**
 * Model ScrapeSource
 * 
 */
export type ScrapeSource = $Result.DefaultSelection<Prisma.$ScrapeSourcePayload>
/**
 * Model ScrapeRun
 * 
 */
export type ScrapeRun = $Result.DefaultSelection<Prisma.$ScrapeRunPayload>

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
   * `prisma.marketplaceMerchant`: Exposes CRUD operations for the **MarketplaceMerchant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MarketplaceMerchants
    * const marketplaceMerchants = await prisma.marketplaceMerchant.findMany()
    * ```
    */
  get marketplaceMerchant(): Prisma.MarketplaceMerchantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scrapedLink`: Exposes CRUD operations for the **ScrapedLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapedLinks
    * const scrapedLinks = await prisma.scrapedLink.findMany()
    * ```
    */
  get scrapedLink(): Prisma.ScrapedLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scrapeSource`: Exposes CRUD operations for the **ScrapeSource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapeSources
    * const scrapeSources = await prisma.scrapeSource.findMany()
    * ```
    */
  get scrapeSource(): Prisma.ScrapeSourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scrapeRun`: Exposes CRUD operations for the **ScrapeRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapeRuns
    * const scrapeRuns = await prisma.scrapeRun.findMany()
    * ```
    */
  get scrapeRun(): Prisma.ScrapeRunDelegate<ExtArgs, ClientOptions>;
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
    MarketplaceMerchant: 'MarketplaceMerchant',
    Product: 'Product',
    ScrapedLink: 'ScrapedLink',
    ScrapeSource: 'ScrapeSource',
    ScrapeRun: 'ScrapeRun'
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
      modelProps: "authUser" | "authSession" | "passwordReset" | "marketplaceMerchant" | "product" | "scrapedLink" | "scrapeSource" | "scrapeRun"
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
      MarketplaceMerchant: {
        payload: Prisma.$MarketplaceMerchantPayload<ExtArgs>
        fields: Prisma.MarketplaceMerchantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketplaceMerchantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketplaceMerchantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          findFirst: {
            args: Prisma.MarketplaceMerchantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketplaceMerchantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          findMany: {
            args: Prisma.MarketplaceMerchantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>[]
          }
          create: {
            args: Prisma.MarketplaceMerchantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          createMany: {
            args: Prisma.MarketplaceMerchantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarketplaceMerchantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>[]
          }
          delete: {
            args: Prisma.MarketplaceMerchantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          update: {
            args: Prisma.MarketplaceMerchantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          deleteMany: {
            args: Prisma.MarketplaceMerchantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketplaceMerchantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MarketplaceMerchantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>[]
          }
          upsert: {
            args: Prisma.MarketplaceMerchantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketplaceMerchantPayload>
          }
          aggregate: {
            args: Prisma.MarketplaceMerchantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarketplaceMerchant>
          }
          groupBy: {
            args: Prisma.MarketplaceMerchantGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketplaceMerchantGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarketplaceMerchantCountArgs<ExtArgs>
            result: $Utils.Optional<MarketplaceMerchantCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ScrapedLink: {
        payload: Prisma.$ScrapedLinkPayload<ExtArgs>
        fields: Prisma.ScrapedLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScrapedLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScrapedLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          findFirst: {
            args: Prisma.ScrapedLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScrapedLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          findMany: {
            args: Prisma.ScrapedLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>[]
          }
          create: {
            args: Prisma.ScrapedLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          createMany: {
            args: Prisma.ScrapedLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScrapedLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>[]
          }
          delete: {
            args: Prisma.ScrapedLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          update: {
            args: Prisma.ScrapedLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          deleteMany: {
            args: Prisma.ScrapedLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScrapedLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScrapedLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>[]
          }
          upsert: {
            args: Prisma.ScrapedLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapedLinkPayload>
          }
          aggregate: {
            args: Prisma.ScrapedLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScrapedLink>
          }
          groupBy: {
            args: Prisma.ScrapedLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScrapedLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScrapedLinkCountArgs<ExtArgs>
            result: $Utils.Optional<ScrapedLinkCountAggregateOutputType> | number
          }
        }
      }
      ScrapeSource: {
        payload: Prisma.$ScrapeSourcePayload<ExtArgs>
        fields: Prisma.ScrapeSourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScrapeSourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScrapeSourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          findFirst: {
            args: Prisma.ScrapeSourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScrapeSourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          findMany: {
            args: Prisma.ScrapeSourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>[]
          }
          create: {
            args: Prisma.ScrapeSourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          createMany: {
            args: Prisma.ScrapeSourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScrapeSourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>[]
          }
          delete: {
            args: Prisma.ScrapeSourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          update: {
            args: Prisma.ScrapeSourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          deleteMany: {
            args: Prisma.ScrapeSourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScrapeSourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScrapeSourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>[]
          }
          upsert: {
            args: Prisma.ScrapeSourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeSourcePayload>
          }
          aggregate: {
            args: Prisma.ScrapeSourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScrapeSource>
          }
          groupBy: {
            args: Prisma.ScrapeSourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScrapeSourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScrapeSourceCountArgs<ExtArgs>
            result: $Utils.Optional<ScrapeSourceCountAggregateOutputType> | number
          }
        }
      }
      ScrapeRun: {
        payload: Prisma.$ScrapeRunPayload<ExtArgs>
        fields: Prisma.ScrapeRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScrapeRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScrapeRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          findFirst: {
            args: Prisma.ScrapeRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScrapeRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          findMany: {
            args: Prisma.ScrapeRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          create: {
            args: Prisma.ScrapeRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          createMany: {
            args: Prisma.ScrapeRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScrapeRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          delete: {
            args: Prisma.ScrapeRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          update: {
            args: Prisma.ScrapeRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          deleteMany: {
            args: Prisma.ScrapeRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScrapeRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScrapeRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>[]
          }
          upsert: {
            args: Prisma.ScrapeRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeRunPayload>
          }
          aggregate: {
            args: Prisma.ScrapeRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScrapeRun>
          }
          groupBy: {
            args: Prisma.ScrapeRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScrapeRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScrapeRunCountArgs<ExtArgs>
            result: $Utils.Optional<ScrapeRunCountAggregateOutputType> | number
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
    marketplaceMerchant?: MarketplaceMerchantOmit
    product?: ProductOmit
    scrapedLink?: ScrapedLinkOmit
    scrapeSource?: ScrapeSourceOmit
    scrapeRun?: ScrapeRunOmit
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
   * Count Type MarketplaceMerchantCountOutputType
   */

  export type MarketplaceMerchantCountOutputType = {
    products: number
  }

  export type MarketplaceMerchantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | MarketplaceMerchantCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * MarketplaceMerchantCountOutputType without action
   */
  export type MarketplaceMerchantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchantCountOutputType
     */
    select?: MarketplaceMerchantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MarketplaceMerchantCountOutputType without action
   */
  export type MarketplaceMerchantCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ScrapeSourceCountOutputType
   */

  export type ScrapeSourceCountOutputType = {
    items: number
    runs: number
  }

  export type ScrapeSourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ScrapeSourceCountOutputTypeCountItemsArgs
    runs?: boolean | ScrapeSourceCountOutputTypeCountRunsArgs
  }

  // Custom InputTypes
  /**
   * ScrapeSourceCountOutputType without action
   */
  export type ScrapeSourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSourceCountOutputType
     */
    select?: ScrapeSourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScrapeSourceCountOutputType without action
   */
  export type ScrapeSourceCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapedLinkWhereInput
  }

  /**
   * ScrapeSourceCountOutputType without action
   */
  export type ScrapeSourceCountOutputTypeCountRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeRunWhereInput
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
   * Model MarketplaceMerchant
   */

  export type AggregateMarketplaceMerchant = {
    _count: MarketplaceMerchantCountAggregateOutputType | null
    _min: MarketplaceMerchantMinAggregateOutputType | null
    _max: MarketplaceMerchantMaxAggregateOutputType | null
  }

  export type MarketplaceMerchantMinAggregateOutputType = {
    id: string | null
    name: string | null
    wrosMerchantId: string | null
    createdAt: Date | null
  }

  export type MarketplaceMerchantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    wrosMerchantId: string | null
    createdAt: Date | null
  }

  export type MarketplaceMerchantCountAggregateOutputType = {
    id: number
    name: number
    wrosMerchantId: number
    createdAt: number
    _all: number
  }


  export type MarketplaceMerchantMinAggregateInputType = {
    id?: true
    name?: true
    wrosMerchantId?: true
    createdAt?: true
  }

  export type MarketplaceMerchantMaxAggregateInputType = {
    id?: true
    name?: true
    wrosMerchantId?: true
    createdAt?: true
  }

  export type MarketplaceMerchantCountAggregateInputType = {
    id?: true
    name?: true
    wrosMerchantId?: true
    createdAt?: true
    _all?: true
  }

  export type MarketplaceMerchantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketplaceMerchant to aggregate.
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketplaceMerchants to fetch.
     */
    orderBy?: MarketplaceMerchantOrderByWithRelationInput | MarketplaceMerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketplaceMerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketplaceMerchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketplaceMerchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MarketplaceMerchants
    **/
    _count?: true | MarketplaceMerchantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketplaceMerchantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketplaceMerchantMaxAggregateInputType
  }

  export type GetMarketplaceMerchantAggregateType<T extends MarketplaceMerchantAggregateArgs> = {
        [P in keyof T & keyof AggregateMarketplaceMerchant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarketplaceMerchant[P]>
      : GetScalarType<T[P], AggregateMarketplaceMerchant[P]>
  }




  export type MarketplaceMerchantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketplaceMerchantWhereInput
    orderBy?: MarketplaceMerchantOrderByWithAggregationInput | MarketplaceMerchantOrderByWithAggregationInput[]
    by: MarketplaceMerchantScalarFieldEnum[] | MarketplaceMerchantScalarFieldEnum
    having?: MarketplaceMerchantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketplaceMerchantCountAggregateInputType | true
    _min?: MarketplaceMerchantMinAggregateInputType
    _max?: MarketplaceMerchantMaxAggregateInputType
  }

  export type MarketplaceMerchantGroupByOutputType = {
    id: string
    name: string
    wrosMerchantId: string | null
    createdAt: Date
    _count: MarketplaceMerchantCountAggregateOutputType | null
    _min: MarketplaceMerchantMinAggregateOutputType | null
    _max: MarketplaceMerchantMaxAggregateOutputType | null
  }

  type GetMarketplaceMerchantGroupByPayload<T extends MarketplaceMerchantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketplaceMerchantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketplaceMerchantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketplaceMerchantGroupByOutputType[P]>
            : GetScalarType<T[P], MarketplaceMerchantGroupByOutputType[P]>
        }
      >
    >


  export type MarketplaceMerchantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    wrosMerchantId?: boolean
    createdAt?: boolean
    products?: boolean | MarketplaceMerchant$productsArgs<ExtArgs>
    _count?: boolean | MarketplaceMerchantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["marketplaceMerchant"]>

  export type MarketplaceMerchantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    wrosMerchantId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["marketplaceMerchant"]>

  export type MarketplaceMerchantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    wrosMerchantId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["marketplaceMerchant"]>

  export type MarketplaceMerchantSelectScalar = {
    id?: boolean
    name?: boolean
    wrosMerchantId?: boolean
    createdAt?: boolean
  }

  export type MarketplaceMerchantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "wrosMerchantId" | "createdAt", ExtArgs["result"]["marketplaceMerchant"]>
  export type MarketplaceMerchantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | MarketplaceMerchant$productsArgs<ExtArgs>
    _count?: boolean | MarketplaceMerchantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MarketplaceMerchantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MarketplaceMerchantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MarketplaceMerchantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MarketplaceMerchant"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      wrosMerchantId: string | null
      createdAt: Date
    }, ExtArgs["result"]["marketplaceMerchant"]>
    composites: {}
  }

  type MarketplaceMerchantGetPayload<S extends boolean | null | undefined | MarketplaceMerchantDefaultArgs> = $Result.GetResult<Prisma.$MarketplaceMerchantPayload, S>

  type MarketplaceMerchantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MarketplaceMerchantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MarketplaceMerchantCountAggregateInputType | true
    }

  export interface MarketplaceMerchantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MarketplaceMerchant'], meta: { name: 'MarketplaceMerchant' } }
    /**
     * Find zero or one MarketplaceMerchant that matches the filter.
     * @param {MarketplaceMerchantFindUniqueArgs} args - Arguments to find a MarketplaceMerchant
     * @example
     * // Get one MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketplaceMerchantFindUniqueArgs>(args: SelectSubset<T, MarketplaceMerchantFindUniqueArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MarketplaceMerchant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarketplaceMerchantFindUniqueOrThrowArgs} args - Arguments to find a MarketplaceMerchant
     * @example
     * // Get one MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketplaceMerchantFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketplaceMerchantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketplaceMerchant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantFindFirstArgs} args - Arguments to find a MarketplaceMerchant
     * @example
     * // Get one MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketplaceMerchantFindFirstArgs>(args?: SelectSubset<T, MarketplaceMerchantFindFirstArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketplaceMerchant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantFindFirstOrThrowArgs} args - Arguments to find a MarketplaceMerchant
     * @example
     * // Get one MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketplaceMerchantFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketplaceMerchantFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MarketplaceMerchants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MarketplaceMerchants
     * const marketplaceMerchants = await prisma.marketplaceMerchant.findMany()
     * 
     * // Get first 10 MarketplaceMerchants
     * const marketplaceMerchants = await prisma.marketplaceMerchant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketplaceMerchantWithIdOnly = await prisma.marketplaceMerchant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketplaceMerchantFindManyArgs>(args?: SelectSubset<T, MarketplaceMerchantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MarketplaceMerchant.
     * @param {MarketplaceMerchantCreateArgs} args - Arguments to create a MarketplaceMerchant.
     * @example
     * // Create one MarketplaceMerchant
     * const MarketplaceMerchant = await prisma.marketplaceMerchant.create({
     *   data: {
     *     // ... data to create a MarketplaceMerchant
     *   }
     * })
     * 
     */
    create<T extends MarketplaceMerchantCreateArgs>(args: SelectSubset<T, MarketplaceMerchantCreateArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MarketplaceMerchants.
     * @param {MarketplaceMerchantCreateManyArgs} args - Arguments to create many MarketplaceMerchants.
     * @example
     * // Create many MarketplaceMerchants
     * const marketplaceMerchant = await prisma.marketplaceMerchant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketplaceMerchantCreateManyArgs>(args?: SelectSubset<T, MarketplaceMerchantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MarketplaceMerchants and returns the data saved in the database.
     * @param {MarketplaceMerchantCreateManyAndReturnArgs} args - Arguments to create many MarketplaceMerchants.
     * @example
     * // Create many MarketplaceMerchants
     * const marketplaceMerchant = await prisma.marketplaceMerchant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MarketplaceMerchants and only return the `id`
     * const marketplaceMerchantWithIdOnly = await prisma.marketplaceMerchant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarketplaceMerchantCreateManyAndReturnArgs>(args?: SelectSubset<T, MarketplaceMerchantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MarketplaceMerchant.
     * @param {MarketplaceMerchantDeleteArgs} args - Arguments to delete one MarketplaceMerchant.
     * @example
     * // Delete one MarketplaceMerchant
     * const MarketplaceMerchant = await prisma.marketplaceMerchant.delete({
     *   where: {
     *     // ... filter to delete one MarketplaceMerchant
     *   }
     * })
     * 
     */
    delete<T extends MarketplaceMerchantDeleteArgs>(args: SelectSubset<T, MarketplaceMerchantDeleteArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MarketplaceMerchant.
     * @param {MarketplaceMerchantUpdateArgs} args - Arguments to update one MarketplaceMerchant.
     * @example
     * // Update one MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketplaceMerchantUpdateArgs>(args: SelectSubset<T, MarketplaceMerchantUpdateArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MarketplaceMerchants.
     * @param {MarketplaceMerchantDeleteManyArgs} args - Arguments to filter MarketplaceMerchants to delete.
     * @example
     * // Delete a few MarketplaceMerchants
     * const { count } = await prisma.marketplaceMerchant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketplaceMerchantDeleteManyArgs>(args?: SelectSubset<T, MarketplaceMerchantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketplaceMerchants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MarketplaceMerchants
     * const marketplaceMerchant = await prisma.marketplaceMerchant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketplaceMerchantUpdateManyArgs>(args: SelectSubset<T, MarketplaceMerchantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketplaceMerchants and returns the data updated in the database.
     * @param {MarketplaceMerchantUpdateManyAndReturnArgs} args - Arguments to update many MarketplaceMerchants.
     * @example
     * // Update many MarketplaceMerchants
     * const marketplaceMerchant = await prisma.marketplaceMerchant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MarketplaceMerchants and only return the `id`
     * const marketplaceMerchantWithIdOnly = await prisma.marketplaceMerchant.updateManyAndReturn({
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
    updateManyAndReturn<T extends MarketplaceMerchantUpdateManyAndReturnArgs>(args: SelectSubset<T, MarketplaceMerchantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MarketplaceMerchant.
     * @param {MarketplaceMerchantUpsertArgs} args - Arguments to update or create a MarketplaceMerchant.
     * @example
     * // Update or create a MarketplaceMerchant
     * const marketplaceMerchant = await prisma.marketplaceMerchant.upsert({
     *   create: {
     *     // ... data to create a MarketplaceMerchant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MarketplaceMerchant we want to update
     *   }
     * })
     */
    upsert<T extends MarketplaceMerchantUpsertArgs>(args: SelectSubset<T, MarketplaceMerchantUpsertArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MarketplaceMerchants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantCountArgs} args - Arguments to filter MarketplaceMerchants to count.
     * @example
     * // Count the number of MarketplaceMerchants
     * const count = await prisma.marketplaceMerchant.count({
     *   where: {
     *     // ... the filter for the MarketplaceMerchants we want to count
     *   }
     * })
    **/
    count<T extends MarketplaceMerchantCountArgs>(
      args?: Subset<T, MarketplaceMerchantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketplaceMerchantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MarketplaceMerchant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MarketplaceMerchantAggregateArgs>(args: Subset<T, MarketplaceMerchantAggregateArgs>): Prisma.PrismaPromise<GetMarketplaceMerchantAggregateType<T>>

    /**
     * Group by MarketplaceMerchant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketplaceMerchantGroupByArgs} args - Group by arguments.
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
      T extends MarketplaceMerchantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketplaceMerchantGroupByArgs['orderBy'] }
        : { orderBy?: MarketplaceMerchantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MarketplaceMerchantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketplaceMerchantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MarketplaceMerchant model
   */
  readonly fields: MarketplaceMerchantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MarketplaceMerchant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketplaceMerchantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends MarketplaceMerchant$productsArgs<ExtArgs> = {}>(args?: Subset<T, MarketplaceMerchant$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the MarketplaceMerchant model
   */
  interface MarketplaceMerchantFieldRefs {
    readonly id: FieldRef<"MarketplaceMerchant", 'String'>
    readonly name: FieldRef<"MarketplaceMerchant", 'String'>
    readonly wrosMerchantId: FieldRef<"MarketplaceMerchant", 'String'>
    readonly createdAt: FieldRef<"MarketplaceMerchant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MarketplaceMerchant findUnique
   */
  export type MarketplaceMerchantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter, which MarketplaceMerchant to fetch.
     */
    where: MarketplaceMerchantWhereUniqueInput
  }

  /**
   * MarketplaceMerchant findUniqueOrThrow
   */
  export type MarketplaceMerchantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter, which MarketplaceMerchant to fetch.
     */
    where: MarketplaceMerchantWhereUniqueInput
  }

  /**
   * MarketplaceMerchant findFirst
   */
  export type MarketplaceMerchantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter, which MarketplaceMerchant to fetch.
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketplaceMerchants to fetch.
     */
    orderBy?: MarketplaceMerchantOrderByWithRelationInput | MarketplaceMerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketplaceMerchants.
     */
    cursor?: MarketplaceMerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketplaceMerchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketplaceMerchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketplaceMerchants.
     */
    distinct?: MarketplaceMerchantScalarFieldEnum | MarketplaceMerchantScalarFieldEnum[]
  }

  /**
   * MarketplaceMerchant findFirstOrThrow
   */
  export type MarketplaceMerchantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter, which MarketplaceMerchant to fetch.
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketplaceMerchants to fetch.
     */
    orderBy?: MarketplaceMerchantOrderByWithRelationInput | MarketplaceMerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketplaceMerchants.
     */
    cursor?: MarketplaceMerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketplaceMerchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketplaceMerchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketplaceMerchants.
     */
    distinct?: MarketplaceMerchantScalarFieldEnum | MarketplaceMerchantScalarFieldEnum[]
  }

  /**
   * MarketplaceMerchant findMany
   */
  export type MarketplaceMerchantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter, which MarketplaceMerchants to fetch.
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketplaceMerchants to fetch.
     */
    orderBy?: MarketplaceMerchantOrderByWithRelationInput | MarketplaceMerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MarketplaceMerchants.
     */
    cursor?: MarketplaceMerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketplaceMerchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketplaceMerchants.
     */
    skip?: number
    distinct?: MarketplaceMerchantScalarFieldEnum | MarketplaceMerchantScalarFieldEnum[]
  }

  /**
   * MarketplaceMerchant create
   */
  export type MarketplaceMerchantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * The data needed to create a MarketplaceMerchant.
     */
    data: XOR<MarketplaceMerchantCreateInput, MarketplaceMerchantUncheckedCreateInput>
  }

  /**
   * MarketplaceMerchant createMany
   */
  export type MarketplaceMerchantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MarketplaceMerchants.
     */
    data: MarketplaceMerchantCreateManyInput | MarketplaceMerchantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketplaceMerchant createManyAndReturn
   */
  export type MarketplaceMerchantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * The data used to create many MarketplaceMerchants.
     */
    data: MarketplaceMerchantCreateManyInput | MarketplaceMerchantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketplaceMerchant update
   */
  export type MarketplaceMerchantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * The data needed to update a MarketplaceMerchant.
     */
    data: XOR<MarketplaceMerchantUpdateInput, MarketplaceMerchantUncheckedUpdateInput>
    /**
     * Choose, which MarketplaceMerchant to update.
     */
    where: MarketplaceMerchantWhereUniqueInput
  }

  /**
   * MarketplaceMerchant updateMany
   */
  export type MarketplaceMerchantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MarketplaceMerchants.
     */
    data: XOR<MarketplaceMerchantUpdateManyMutationInput, MarketplaceMerchantUncheckedUpdateManyInput>
    /**
     * Filter which MarketplaceMerchants to update
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * Limit how many MarketplaceMerchants to update.
     */
    limit?: number
  }

  /**
   * MarketplaceMerchant updateManyAndReturn
   */
  export type MarketplaceMerchantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * The data used to update MarketplaceMerchants.
     */
    data: XOR<MarketplaceMerchantUpdateManyMutationInput, MarketplaceMerchantUncheckedUpdateManyInput>
    /**
     * Filter which MarketplaceMerchants to update
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * Limit how many MarketplaceMerchants to update.
     */
    limit?: number
  }

  /**
   * MarketplaceMerchant upsert
   */
  export type MarketplaceMerchantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * The filter to search for the MarketplaceMerchant to update in case it exists.
     */
    where: MarketplaceMerchantWhereUniqueInput
    /**
     * In case the MarketplaceMerchant found by the `where` argument doesn't exist, create a new MarketplaceMerchant with this data.
     */
    create: XOR<MarketplaceMerchantCreateInput, MarketplaceMerchantUncheckedCreateInput>
    /**
     * In case the MarketplaceMerchant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketplaceMerchantUpdateInput, MarketplaceMerchantUncheckedUpdateInput>
  }

  /**
   * MarketplaceMerchant delete
   */
  export type MarketplaceMerchantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
    /**
     * Filter which MarketplaceMerchant to delete.
     */
    where: MarketplaceMerchantWhereUniqueInput
  }

  /**
   * MarketplaceMerchant deleteMany
   */
  export type MarketplaceMerchantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketplaceMerchants to delete
     */
    where?: MarketplaceMerchantWhereInput
    /**
     * Limit how many MarketplaceMerchants to delete.
     */
    limit?: number
  }

  /**
   * MarketplaceMerchant.products
   */
  export type MarketplaceMerchant$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * MarketplaceMerchant without action
   */
  export type MarketplaceMerchantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketplaceMerchant
     */
    select?: MarketplaceMerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketplaceMerchant
     */
    omit?: MarketplaceMerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketplaceMerchantInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    title: string | null
    merchantId: string | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    title: string | null
    merchantId: string | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    title: number
    merchantId: number
    _all: number
  }


  export type ProductMinAggregateInputType = {
    id?: true
    title?: true
    merchantId?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    title?: true
    merchantId?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    title?: true
    merchantId?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    title: string
    merchantId: string
    _count: ProductCountAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    merchantId?: boolean
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    merchantId?: boolean
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    merchantId?: boolean
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    title?: boolean
    merchantId?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "merchantId", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MarketplaceMerchantDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      merchant: Prisma.$MarketplaceMerchantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      merchantId: string
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
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
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    merchant<T extends MarketplaceMerchantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MarketplaceMerchantDefaultArgs<ExtArgs>>): Prisma__MarketplaceMerchantClient<$Result.GetResult<Prisma.$MarketplaceMerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly title: FieldRef<"Product", 'String'>
    readonly merchantId: FieldRef<"Product", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ScrapedLink
   */

  export type AggregateScrapedLink = {
    _count: ScrapedLinkCountAggregateOutputType | null
    _avg: ScrapedLinkAvgAggregateOutputType | null
    _sum: ScrapedLinkSumAggregateOutputType | null
    _min: ScrapedLinkMinAggregateOutputType | null
    _max: ScrapedLinkMaxAggregateOutputType | null
  }

  export type ScrapedLinkAvgAggregateOutputType = {
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
  }

  export type ScrapedLinkSumAggregateOutputType = {
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
  }

  export type ScrapedLinkMinAggregateOutputType = {
    id: string | null
    url: string | null
    sourceHost: string | null
    title: string | null
    description: string | null
    imageUrl: string | null
    tenantId: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    status: string | null
    priority: boolean | null
    claimedBy: string | null
    claimedAt: Date | null
    rehomedAt: Date | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    wrosLeadId: string | null
    sourceId: string | null
    scrapedAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapedLinkMaxAggregateOutputType = {
    id: string | null
    url: string | null
    sourceHost: string | null
    title: string | null
    description: string | null
    imageUrl: string | null
    tenantId: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    status: string | null
    priority: boolean | null
    claimedBy: string | null
    claimedAt: Date | null
    rehomedAt: Date | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    wrosLeadId: string | null
    sourceId: string | null
    scrapedAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapedLinkCountAggregateOutputType = {
    id: number
    url: number
    sourceHost: number
    title: number
    description: number
    imageUrl: number
    tenantId: number
    merchantName: number
    companyName: number
    contactEmail: number
    contactPhone: number
    status: number
    priority: number
    claimedBy: number
    claimedAt: number
    rehomedAt: number
    listingFeePence: number
    placementFeePence: number
    deliveryFeePence: number
    premiumFeePence: number
    wrosLeadId: number
    sourceId: number
    scrapedAt: number
    updatedAt: number
    _all: number
  }


  export type ScrapedLinkAvgAggregateInputType = {
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
  }

  export type ScrapedLinkSumAggregateInputType = {
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
  }

  export type ScrapedLinkMinAggregateInputType = {
    id?: true
    url?: true
    sourceHost?: true
    title?: true
    description?: true
    imageUrl?: true
    tenantId?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    priority?: true
    claimedBy?: true
    claimedAt?: true
    rehomedAt?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    wrosLeadId?: true
    sourceId?: true
    scrapedAt?: true
    updatedAt?: true
  }

  export type ScrapedLinkMaxAggregateInputType = {
    id?: true
    url?: true
    sourceHost?: true
    title?: true
    description?: true
    imageUrl?: true
    tenantId?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    priority?: true
    claimedBy?: true
    claimedAt?: true
    rehomedAt?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    wrosLeadId?: true
    sourceId?: true
    scrapedAt?: true
    updatedAt?: true
  }

  export type ScrapedLinkCountAggregateInputType = {
    id?: true
    url?: true
    sourceHost?: true
    title?: true
    description?: true
    imageUrl?: true
    tenantId?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    status?: true
    priority?: true
    claimedBy?: true
    claimedAt?: true
    rehomedAt?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    wrosLeadId?: true
    sourceId?: true
    scrapedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScrapedLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapedLink to aggregate.
     */
    where?: ScrapedLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapedLinks to fetch.
     */
    orderBy?: ScrapedLinkOrderByWithRelationInput | ScrapedLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScrapedLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapedLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapedLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapedLinks
    **/
    _count?: true | ScrapedLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScrapedLinkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScrapedLinkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapedLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapedLinkMaxAggregateInputType
  }

  export type GetScrapedLinkAggregateType<T extends ScrapedLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapedLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapedLink[P]>
      : GetScalarType<T[P], AggregateScrapedLink[P]>
  }




  export type ScrapedLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapedLinkWhereInput
    orderBy?: ScrapedLinkOrderByWithAggregationInput | ScrapedLinkOrderByWithAggregationInput[]
    by: ScrapedLinkScalarFieldEnum[] | ScrapedLinkScalarFieldEnum
    having?: ScrapedLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapedLinkCountAggregateInputType | true
    _avg?: ScrapedLinkAvgAggregateInputType
    _sum?: ScrapedLinkSumAggregateInputType
    _min?: ScrapedLinkMinAggregateInputType
    _max?: ScrapedLinkMaxAggregateInputType
  }

  export type ScrapedLinkGroupByOutputType = {
    id: string
    url: string
    sourceHost: string
    title: string
    description: string | null
    imageUrl: string | null
    tenantId: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    status: string
    priority: boolean
    claimedBy: string | null
    claimedAt: Date | null
    rehomedAt: Date | null
    listingFeePence: number
    placementFeePence: number
    deliveryFeePence: number
    premiumFeePence: number
    wrosLeadId: string | null
    sourceId: string | null
    scrapedAt: Date
    updatedAt: Date
    _count: ScrapedLinkCountAggregateOutputType | null
    _avg: ScrapedLinkAvgAggregateOutputType | null
    _sum: ScrapedLinkSumAggregateOutputType | null
    _min: ScrapedLinkMinAggregateOutputType | null
    _max: ScrapedLinkMaxAggregateOutputType | null
  }

  type GetScrapedLinkGroupByPayload<T extends ScrapedLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScrapedLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapedLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapedLinkGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapedLinkGroupByOutputType[P]>
        }
      >
    >


  export type ScrapedLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    sourceHost?: boolean
    title?: boolean
    description?: boolean
    imageUrl?: boolean
    tenantId?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    priority?: boolean
    claimedBy?: boolean
    claimedAt?: boolean
    rehomedAt?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    wrosLeadId?: boolean
    sourceId?: boolean
    scrapedAt?: boolean
    updatedAt?: boolean
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }, ExtArgs["result"]["scrapedLink"]>

  export type ScrapedLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    sourceHost?: boolean
    title?: boolean
    description?: boolean
    imageUrl?: boolean
    tenantId?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    priority?: boolean
    claimedBy?: boolean
    claimedAt?: boolean
    rehomedAt?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    wrosLeadId?: boolean
    sourceId?: boolean
    scrapedAt?: boolean
    updatedAt?: boolean
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }, ExtArgs["result"]["scrapedLink"]>

  export type ScrapedLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    sourceHost?: boolean
    title?: boolean
    description?: boolean
    imageUrl?: boolean
    tenantId?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    priority?: boolean
    claimedBy?: boolean
    claimedAt?: boolean
    rehomedAt?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    wrosLeadId?: boolean
    sourceId?: boolean
    scrapedAt?: boolean
    updatedAt?: boolean
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }, ExtArgs["result"]["scrapedLink"]>

  export type ScrapedLinkSelectScalar = {
    id?: boolean
    url?: boolean
    sourceHost?: boolean
    title?: boolean
    description?: boolean
    imageUrl?: boolean
    tenantId?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    status?: boolean
    priority?: boolean
    claimedBy?: boolean
    claimedAt?: boolean
    rehomedAt?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    wrosLeadId?: boolean
    sourceId?: boolean
    scrapedAt?: boolean
    updatedAt?: boolean
  }

  export type ScrapedLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "sourceHost" | "title" | "description" | "imageUrl" | "tenantId" | "merchantName" | "companyName" | "contactEmail" | "contactPhone" | "status" | "priority" | "claimedBy" | "claimedAt" | "rehomedAt" | "listingFeePence" | "placementFeePence" | "deliveryFeePence" | "premiumFeePence" | "wrosLeadId" | "sourceId" | "scrapedAt" | "updatedAt", ExtArgs["result"]["scrapedLink"]>
  export type ScrapedLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }
  export type ScrapedLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }
  export type ScrapedLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapedLink$sourceArgs<ExtArgs>
  }

  export type $ScrapedLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScrapedLink"
    objects: {
      source: Prisma.$ScrapeSourcePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      sourceHost: string
      title: string
      description: string | null
      imageUrl: string | null
      tenantId: string | null
      merchantName: string | null
      companyName: string | null
      contactEmail: string | null
      contactPhone: string | null
      status: string
      priority: boolean
      claimedBy: string | null
      claimedAt: Date | null
      rehomedAt: Date | null
      listingFeePence: number
      placementFeePence: number
      deliveryFeePence: number
      premiumFeePence: number
      wrosLeadId: string | null
      sourceId: string | null
      scrapedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scrapedLink"]>
    composites: {}
  }

  type ScrapedLinkGetPayload<S extends boolean | null | undefined | ScrapedLinkDefaultArgs> = $Result.GetResult<Prisma.$ScrapedLinkPayload, S>

  type ScrapedLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScrapedLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScrapedLinkCountAggregateInputType | true
    }

  export interface ScrapedLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScrapedLink'], meta: { name: 'ScrapedLink' } }
    /**
     * Find zero or one ScrapedLink that matches the filter.
     * @param {ScrapedLinkFindUniqueArgs} args - Arguments to find a ScrapedLink
     * @example
     * // Get one ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapedLinkFindUniqueArgs>(args: SelectSubset<T, ScrapedLinkFindUniqueArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScrapedLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapedLinkFindUniqueOrThrowArgs} args - Arguments to find a ScrapedLink
     * @example
     * // Get one ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapedLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, ScrapedLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapedLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkFindFirstArgs} args - Arguments to find a ScrapedLink
     * @example
     * // Get one ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapedLinkFindFirstArgs>(args?: SelectSubset<T, ScrapedLinkFindFirstArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapedLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkFindFirstOrThrowArgs} args - Arguments to find a ScrapedLink
     * @example
     * // Get one ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapedLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, ScrapedLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScrapedLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapedLinks
     * const scrapedLinks = await prisma.scrapedLink.findMany()
     * 
     * // Get first 10 ScrapedLinks
     * const scrapedLinks = await prisma.scrapedLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapedLinkWithIdOnly = await prisma.scrapedLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScrapedLinkFindManyArgs>(args?: SelectSubset<T, ScrapedLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScrapedLink.
     * @param {ScrapedLinkCreateArgs} args - Arguments to create a ScrapedLink.
     * @example
     * // Create one ScrapedLink
     * const ScrapedLink = await prisma.scrapedLink.create({
     *   data: {
     *     // ... data to create a ScrapedLink
     *   }
     * })
     * 
     */
    create<T extends ScrapedLinkCreateArgs>(args: SelectSubset<T, ScrapedLinkCreateArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScrapedLinks.
     * @param {ScrapedLinkCreateManyArgs} args - Arguments to create many ScrapedLinks.
     * @example
     * // Create many ScrapedLinks
     * const scrapedLink = await prisma.scrapedLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScrapedLinkCreateManyArgs>(args?: SelectSubset<T, ScrapedLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScrapedLinks and returns the data saved in the database.
     * @param {ScrapedLinkCreateManyAndReturnArgs} args - Arguments to create many ScrapedLinks.
     * @example
     * // Create many ScrapedLinks
     * const scrapedLink = await prisma.scrapedLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScrapedLinks and only return the `id`
     * const scrapedLinkWithIdOnly = await prisma.scrapedLink.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScrapedLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, ScrapedLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScrapedLink.
     * @param {ScrapedLinkDeleteArgs} args - Arguments to delete one ScrapedLink.
     * @example
     * // Delete one ScrapedLink
     * const ScrapedLink = await prisma.scrapedLink.delete({
     *   where: {
     *     // ... filter to delete one ScrapedLink
     *   }
     * })
     * 
     */
    delete<T extends ScrapedLinkDeleteArgs>(args: SelectSubset<T, ScrapedLinkDeleteArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScrapedLink.
     * @param {ScrapedLinkUpdateArgs} args - Arguments to update one ScrapedLink.
     * @example
     * // Update one ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScrapedLinkUpdateArgs>(args: SelectSubset<T, ScrapedLinkUpdateArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScrapedLinks.
     * @param {ScrapedLinkDeleteManyArgs} args - Arguments to filter ScrapedLinks to delete.
     * @example
     * // Delete a few ScrapedLinks
     * const { count } = await prisma.scrapedLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScrapedLinkDeleteManyArgs>(args?: SelectSubset<T, ScrapedLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapedLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapedLinks
     * const scrapedLink = await prisma.scrapedLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScrapedLinkUpdateManyArgs>(args: SelectSubset<T, ScrapedLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapedLinks and returns the data updated in the database.
     * @param {ScrapedLinkUpdateManyAndReturnArgs} args - Arguments to update many ScrapedLinks.
     * @example
     * // Update many ScrapedLinks
     * const scrapedLink = await prisma.scrapedLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScrapedLinks and only return the `id`
     * const scrapedLinkWithIdOnly = await prisma.scrapedLink.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScrapedLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, ScrapedLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScrapedLink.
     * @param {ScrapedLinkUpsertArgs} args - Arguments to update or create a ScrapedLink.
     * @example
     * // Update or create a ScrapedLink
     * const scrapedLink = await prisma.scrapedLink.upsert({
     *   create: {
     *     // ... data to create a ScrapedLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapedLink we want to update
     *   }
     * })
     */
    upsert<T extends ScrapedLinkUpsertArgs>(args: SelectSubset<T, ScrapedLinkUpsertArgs<ExtArgs>>): Prisma__ScrapedLinkClient<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScrapedLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkCountArgs} args - Arguments to filter ScrapedLinks to count.
     * @example
     * // Count the number of ScrapedLinks
     * const count = await prisma.scrapedLink.count({
     *   where: {
     *     // ... the filter for the ScrapedLinks we want to count
     *   }
     * })
    **/
    count<T extends ScrapedLinkCountArgs>(
      args?: Subset<T, ScrapedLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapedLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapedLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScrapedLinkAggregateArgs>(args: Subset<T, ScrapedLinkAggregateArgs>): Prisma.PrismaPromise<GetScrapedLinkAggregateType<T>>

    /**
     * Group by ScrapedLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapedLinkGroupByArgs} args - Group by arguments.
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
      T extends ScrapedLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapedLinkGroupByArgs['orderBy'] }
        : { orderBy?: ScrapedLinkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScrapedLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapedLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScrapedLink model
   */
  readonly fields: ScrapedLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapedLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScrapedLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends ScrapedLink$sourceArgs<ExtArgs> = {}>(args?: Subset<T, ScrapedLink$sourceArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ScrapedLink model
   */
  interface ScrapedLinkFieldRefs {
    readonly id: FieldRef<"ScrapedLink", 'String'>
    readonly url: FieldRef<"ScrapedLink", 'String'>
    readonly sourceHost: FieldRef<"ScrapedLink", 'String'>
    readonly title: FieldRef<"ScrapedLink", 'String'>
    readonly description: FieldRef<"ScrapedLink", 'String'>
    readonly imageUrl: FieldRef<"ScrapedLink", 'String'>
    readonly tenantId: FieldRef<"ScrapedLink", 'String'>
    readonly merchantName: FieldRef<"ScrapedLink", 'String'>
    readonly companyName: FieldRef<"ScrapedLink", 'String'>
    readonly contactEmail: FieldRef<"ScrapedLink", 'String'>
    readonly contactPhone: FieldRef<"ScrapedLink", 'String'>
    readonly status: FieldRef<"ScrapedLink", 'String'>
    readonly priority: FieldRef<"ScrapedLink", 'Boolean'>
    readonly claimedBy: FieldRef<"ScrapedLink", 'String'>
    readonly claimedAt: FieldRef<"ScrapedLink", 'DateTime'>
    readonly rehomedAt: FieldRef<"ScrapedLink", 'DateTime'>
    readonly listingFeePence: FieldRef<"ScrapedLink", 'Int'>
    readonly placementFeePence: FieldRef<"ScrapedLink", 'Int'>
    readonly deliveryFeePence: FieldRef<"ScrapedLink", 'Int'>
    readonly premiumFeePence: FieldRef<"ScrapedLink", 'Int'>
    readonly wrosLeadId: FieldRef<"ScrapedLink", 'String'>
    readonly sourceId: FieldRef<"ScrapedLink", 'String'>
    readonly scrapedAt: FieldRef<"ScrapedLink", 'DateTime'>
    readonly updatedAt: FieldRef<"ScrapedLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScrapedLink findUnique
   */
  export type ScrapedLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter, which ScrapedLink to fetch.
     */
    where: ScrapedLinkWhereUniqueInput
  }

  /**
   * ScrapedLink findUniqueOrThrow
   */
  export type ScrapedLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter, which ScrapedLink to fetch.
     */
    where: ScrapedLinkWhereUniqueInput
  }

  /**
   * ScrapedLink findFirst
   */
  export type ScrapedLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter, which ScrapedLink to fetch.
     */
    where?: ScrapedLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapedLinks to fetch.
     */
    orderBy?: ScrapedLinkOrderByWithRelationInput | ScrapedLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapedLinks.
     */
    cursor?: ScrapedLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapedLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapedLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapedLinks.
     */
    distinct?: ScrapedLinkScalarFieldEnum | ScrapedLinkScalarFieldEnum[]
  }

  /**
   * ScrapedLink findFirstOrThrow
   */
  export type ScrapedLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter, which ScrapedLink to fetch.
     */
    where?: ScrapedLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapedLinks to fetch.
     */
    orderBy?: ScrapedLinkOrderByWithRelationInput | ScrapedLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapedLinks.
     */
    cursor?: ScrapedLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapedLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapedLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapedLinks.
     */
    distinct?: ScrapedLinkScalarFieldEnum | ScrapedLinkScalarFieldEnum[]
  }

  /**
   * ScrapedLink findMany
   */
  export type ScrapedLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter, which ScrapedLinks to fetch.
     */
    where?: ScrapedLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapedLinks to fetch.
     */
    orderBy?: ScrapedLinkOrderByWithRelationInput | ScrapedLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapedLinks.
     */
    cursor?: ScrapedLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapedLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapedLinks.
     */
    skip?: number
    distinct?: ScrapedLinkScalarFieldEnum | ScrapedLinkScalarFieldEnum[]
  }

  /**
   * ScrapedLink create
   */
  export type ScrapedLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a ScrapedLink.
     */
    data: XOR<ScrapedLinkCreateInput, ScrapedLinkUncheckedCreateInput>
  }

  /**
   * ScrapedLink createMany
   */
  export type ScrapedLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapedLinks.
     */
    data: ScrapedLinkCreateManyInput | ScrapedLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapedLink createManyAndReturn
   */
  export type ScrapedLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * The data used to create many ScrapedLinks.
     */
    data: ScrapedLinkCreateManyInput | ScrapedLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapedLink update
   */
  export type ScrapedLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a ScrapedLink.
     */
    data: XOR<ScrapedLinkUpdateInput, ScrapedLinkUncheckedUpdateInput>
    /**
     * Choose, which ScrapedLink to update.
     */
    where: ScrapedLinkWhereUniqueInput
  }

  /**
   * ScrapedLink updateMany
   */
  export type ScrapedLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapedLinks.
     */
    data: XOR<ScrapedLinkUpdateManyMutationInput, ScrapedLinkUncheckedUpdateManyInput>
    /**
     * Filter which ScrapedLinks to update
     */
    where?: ScrapedLinkWhereInput
    /**
     * Limit how many ScrapedLinks to update.
     */
    limit?: number
  }

  /**
   * ScrapedLink updateManyAndReturn
   */
  export type ScrapedLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * The data used to update ScrapedLinks.
     */
    data: XOR<ScrapedLinkUpdateManyMutationInput, ScrapedLinkUncheckedUpdateManyInput>
    /**
     * Filter which ScrapedLinks to update
     */
    where?: ScrapedLinkWhereInput
    /**
     * Limit how many ScrapedLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapedLink upsert
   */
  export type ScrapedLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the ScrapedLink to update in case it exists.
     */
    where: ScrapedLinkWhereUniqueInput
    /**
     * In case the ScrapedLink found by the `where` argument doesn't exist, create a new ScrapedLink with this data.
     */
    create: XOR<ScrapedLinkCreateInput, ScrapedLinkUncheckedCreateInput>
    /**
     * In case the ScrapedLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScrapedLinkUpdateInput, ScrapedLinkUncheckedUpdateInput>
  }

  /**
   * ScrapedLink delete
   */
  export type ScrapedLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    /**
     * Filter which ScrapedLink to delete.
     */
    where: ScrapedLinkWhereUniqueInput
  }

  /**
   * ScrapedLink deleteMany
   */
  export type ScrapedLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapedLinks to delete
     */
    where?: ScrapedLinkWhereInput
    /**
     * Limit how many ScrapedLinks to delete.
     */
    limit?: number
  }

  /**
   * ScrapedLink.source
   */
  export type ScrapedLink$sourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    where?: ScrapeSourceWhereInput
  }

  /**
   * ScrapedLink without action
   */
  export type ScrapedLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
  }


  /**
   * Model ScrapeSource
   */

  export type AggregateScrapeSource = {
    _count: ScrapeSourceCountAggregateOutputType | null
    _avg: ScrapeSourceAvgAggregateOutputType | null
    _sum: ScrapeSourceSumAggregateOutputType | null
    _min: ScrapeSourceMinAggregateOutputType | null
    _max: ScrapeSourceMaxAggregateOutputType | null
  }

  export type ScrapeSourceAvgAggregateOutputType = {
    intervalMinutes: number | null
    maxItemsPerRun: number | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    consecutiveFailures: number | null
  }

  export type ScrapeSourceSumAggregateOutputType = {
    intervalMinutes: number | null
    maxItemsPerRun: number | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    consecutiveFailures: number | null
  }

  export type ScrapeSourceMinAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    url: string | null
    active: boolean | null
    tenantId: string | null
    intervalMinutes: number | null
    maxItemsPerRun: number | null
    itemSelector: string | null
    linkSelector: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    nextRunAt: Date | null
    lastRunAt: Date | null
    lastSuccessAt: Date | null
    lastError: string | null
    consecutiveFailures: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapeSourceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    category: string | null
    url: string | null
    active: boolean | null
    tenantId: string | null
    intervalMinutes: number | null
    maxItemsPerRun: number | null
    itemSelector: string | null
    linkSelector: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    listingFeePence: number | null
    placementFeePence: number | null
    deliveryFeePence: number | null
    premiumFeePence: number | null
    nextRunAt: Date | null
    lastRunAt: Date | null
    lastSuccessAt: Date | null
    lastError: string | null
    consecutiveFailures: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapeSourceCountAggregateOutputType = {
    id: number
    name: number
    category: number
    url: number
    active: number
    tenantId: number
    intervalMinutes: number
    maxItemsPerRun: number
    itemSelector: number
    linkSelector: number
    merchantName: number
    companyName: number
    contactEmail: number
    contactPhone: number
    listingFeePence: number
    placementFeePence: number
    deliveryFeePence: number
    premiumFeePence: number
    nextRunAt: number
    lastRunAt: number
    lastSuccessAt: number
    lastError: number
    consecutiveFailures: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScrapeSourceAvgAggregateInputType = {
    intervalMinutes?: true
    maxItemsPerRun?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    consecutiveFailures?: true
  }

  export type ScrapeSourceSumAggregateInputType = {
    intervalMinutes?: true
    maxItemsPerRun?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    consecutiveFailures?: true
  }

  export type ScrapeSourceMinAggregateInputType = {
    id?: true
    name?: true
    category?: true
    url?: true
    active?: true
    tenantId?: true
    intervalMinutes?: true
    maxItemsPerRun?: true
    itemSelector?: true
    linkSelector?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    nextRunAt?: true
    lastRunAt?: true
    lastSuccessAt?: true
    lastError?: true
    consecutiveFailures?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapeSourceMaxAggregateInputType = {
    id?: true
    name?: true
    category?: true
    url?: true
    active?: true
    tenantId?: true
    intervalMinutes?: true
    maxItemsPerRun?: true
    itemSelector?: true
    linkSelector?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    nextRunAt?: true
    lastRunAt?: true
    lastSuccessAt?: true
    lastError?: true
    consecutiveFailures?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapeSourceCountAggregateInputType = {
    id?: true
    name?: true
    category?: true
    url?: true
    active?: true
    tenantId?: true
    intervalMinutes?: true
    maxItemsPerRun?: true
    itemSelector?: true
    linkSelector?: true
    merchantName?: true
    companyName?: true
    contactEmail?: true
    contactPhone?: true
    listingFeePence?: true
    placementFeePence?: true
    deliveryFeePence?: true
    premiumFeePence?: true
    nextRunAt?: true
    lastRunAt?: true
    lastSuccessAt?: true
    lastError?: true
    consecutiveFailures?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScrapeSourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeSource to aggregate.
     */
    where?: ScrapeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeSources to fetch.
     */
    orderBy?: ScrapeSourceOrderByWithRelationInput | ScrapeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScrapeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapeSources
    **/
    _count?: true | ScrapeSourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScrapeSourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScrapeSourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapeSourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapeSourceMaxAggregateInputType
  }

  export type GetScrapeSourceAggregateType<T extends ScrapeSourceAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapeSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapeSource[P]>
      : GetScalarType<T[P], AggregateScrapeSource[P]>
  }




  export type ScrapeSourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeSourceWhereInput
    orderBy?: ScrapeSourceOrderByWithAggregationInput | ScrapeSourceOrderByWithAggregationInput[]
    by: ScrapeSourceScalarFieldEnum[] | ScrapeSourceScalarFieldEnum
    having?: ScrapeSourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapeSourceCountAggregateInputType | true
    _avg?: ScrapeSourceAvgAggregateInputType
    _sum?: ScrapeSourceSumAggregateInputType
    _min?: ScrapeSourceMinAggregateInputType
    _max?: ScrapeSourceMaxAggregateInputType
  }

  export type ScrapeSourceGroupByOutputType = {
    id: string
    name: string
    category: string
    url: string
    active: boolean
    tenantId: string | null
    intervalMinutes: number
    maxItemsPerRun: number
    itemSelector: string | null
    linkSelector: string | null
    merchantName: string | null
    companyName: string | null
    contactEmail: string | null
    contactPhone: string | null
    listingFeePence: number
    placementFeePence: number
    deliveryFeePence: number
    premiumFeePence: number
    nextRunAt: Date
    lastRunAt: Date | null
    lastSuccessAt: Date | null
    lastError: string | null
    consecutiveFailures: number
    createdAt: Date
    updatedAt: Date
    _count: ScrapeSourceCountAggregateOutputType | null
    _avg: ScrapeSourceAvgAggregateOutputType | null
    _sum: ScrapeSourceSumAggregateOutputType | null
    _min: ScrapeSourceMinAggregateOutputType | null
    _max: ScrapeSourceMaxAggregateOutputType | null
  }

  type GetScrapeSourceGroupByPayload<T extends ScrapeSourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScrapeSourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapeSourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapeSourceGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapeSourceGroupByOutputType[P]>
        }
      >
    >


  export type ScrapeSourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    url?: boolean
    active?: boolean
    tenantId?: boolean
    intervalMinutes?: boolean
    maxItemsPerRun?: boolean
    itemSelector?: boolean
    linkSelector?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    nextRunAt?: boolean
    lastRunAt?: boolean
    lastSuccessAt?: boolean
    lastError?: boolean
    consecutiveFailures?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | ScrapeSource$itemsArgs<ExtArgs>
    runs?: boolean | ScrapeSource$runsArgs<ExtArgs>
    _count?: boolean | ScrapeSourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeSource"]>

  export type ScrapeSourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    url?: boolean
    active?: boolean
    tenantId?: boolean
    intervalMinutes?: boolean
    maxItemsPerRun?: boolean
    itemSelector?: boolean
    linkSelector?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    nextRunAt?: boolean
    lastRunAt?: boolean
    lastSuccessAt?: boolean
    lastError?: boolean
    consecutiveFailures?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scrapeSource"]>

  export type ScrapeSourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    category?: boolean
    url?: boolean
    active?: boolean
    tenantId?: boolean
    intervalMinutes?: boolean
    maxItemsPerRun?: boolean
    itemSelector?: boolean
    linkSelector?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    nextRunAt?: boolean
    lastRunAt?: boolean
    lastSuccessAt?: boolean
    lastError?: boolean
    consecutiveFailures?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scrapeSource"]>

  export type ScrapeSourceSelectScalar = {
    id?: boolean
    name?: boolean
    category?: boolean
    url?: boolean
    active?: boolean
    tenantId?: boolean
    intervalMinutes?: boolean
    maxItemsPerRun?: boolean
    itemSelector?: boolean
    linkSelector?: boolean
    merchantName?: boolean
    companyName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    listingFeePence?: boolean
    placementFeePence?: boolean
    deliveryFeePence?: boolean
    premiumFeePence?: boolean
    nextRunAt?: boolean
    lastRunAt?: boolean
    lastSuccessAt?: boolean
    lastError?: boolean
    consecutiveFailures?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScrapeSourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "category" | "url" | "active" | "tenantId" | "intervalMinutes" | "maxItemsPerRun" | "itemSelector" | "linkSelector" | "merchantName" | "companyName" | "contactEmail" | "contactPhone" | "listingFeePence" | "placementFeePence" | "deliveryFeePence" | "premiumFeePence" | "nextRunAt" | "lastRunAt" | "lastSuccessAt" | "lastError" | "consecutiveFailures" | "createdAt" | "updatedAt", ExtArgs["result"]["scrapeSource"]>
  export type ScrapeSourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ScrapeSource$itemsArgs<ExtArgs>
    runs?: boolean | ScrapeSource$runsArgs<ExtArgs>
    _count?: boolean | ScrapeSourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScrapeSourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ScrapeSourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ScrapeSourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScrapeSource"
    objects: {
      items: Prisma.$ScrapedLinkPayload<ExtArgs>[]
      runs: Prisma.$ScrapeRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      category: string
      url: string
      active: boolean
      tenantId: string | null
      intervalMinutes: number
      maxItemsPerRun: number
      itemSelector: string | null
      linkSelector: string | null
      merchantName: string | null
      companyName: string | null
      contactEmail: string | null
      contactPhone: string | null
      listingFeePence: number
      placementFeePence: number
      deliveryFeePence: number
      premiumFeePence: number
      nextRunAt: Date
      lastRunAt: Date | null
      lastSuccessAt: Date | null
      lastError: string | null
      consecutiveFailures: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scrapeSource"]>
    composites: {}
  }

  type ScrapeSourceGetPayload<S extends boolean | null | undefined | ScrapeSourceDefaultArgs> = $Result.GetResult<Prisma.$ScrapeSourcePayload, S>

  type ScrapeSourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScrapeSourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScrapeSourceCountAggregateInputType | true
    }

  export interface ScrapeSourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScrapeSource'], meta: { name: 'ScrapeSource' } }
    /**
     * Find zero or one ScrapeSource that matches the filter.
     * @param {ScrapeSourceFindUniqueArgs} args - Arguments to find a ScrapeSource
     * @example
     * // Get one ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapeSourceFindUniqueArgs>(args: SelectSubset<T, ScrapeSourceFindUniqueArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScrapeSource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapeSourceFindUniqueOrThrowArgs} args - Arguments to find a ScrapeSource
     * @example
     * // Get one ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapeSourceFindUniqueOrThrowArgs>(args: SelectSubset<T, ScrapeSourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeSource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceFindFirstArgs} args - Arguments to find a ScrapeSource
     * @example
     * // Get one ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapeSourceFindFirstArgs>(args?: SelectSubset<T, ScrapeSourceFindFirstArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeSource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceFindFirstOrThrowArgs} args - Arguments to find a ScrapeSource
     * @example
     * // Get one ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapeSourceFindFirstOrThrowArgs>(args?: SelectSubset<T, ScrapeSourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScrapeSources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapeSources
     * const scrapeSources = await prisma.scrapeSource.findMany()
     * 
     * // Get first 10 ScrapeSources
     * const scrapeSources = await prisma.scrapeSource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapeSourceWithIdOnly = await prisma.scrapeSource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScrapeSourceFindManyArgs>(args?: SelectSubset<T, ScrapeSourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScrapeSource.
     * @param {ScrapeSourceCreateArgs} args - Arguments to create a ScrapeSource.
     * @example
     * // Create one ScrapeSource
     * const ScrapeSource = await prisma.scrapeSource.create({
     *   data: {
     *     // ... data to create a ScrapeSource
     *   }
     * })
     * 
     */
    create<T extends ScrapeSourceCreateArgs>(args: SelectSubset<T, ScrapeSourceCreateArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScrapeSources.
     * @param {ScrapeSourceCreateManyArgs} args - Arguments to create many ScrapeSources.
     * @example
     * // Create many ScrapeSources
     * const scrapeSource = await prisma.scrapeSource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScrapeSourceCreateManyArgs>(args?: SelectSubset<T, ScrapeSourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScrapeSources and returns the data saved in the database.
     * @param {ScrapeSourceCreateManyAndReturnArgs} args - Arguments to create many ScrapeSources.
     * @example
     * // Create many ScrapeSources
     * const scrapeSource = await prisma.scrapeSource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScrapeSources and only return the `id`
     * const scrapeSourceWithIdOnly = await prisma.scrapeSource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScrapeSourceCreateManyAndReturnArgs>(args?: SelectSubset<T, ScrapeSourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScrapeSource.
     * @param {ScrapeSourceDeleteArgs} args - Arguments to delete one ScrapeSource.
     * @example
     * // Delete one ScrapeSource
     * const ScrapeSource = await prisma.scrapeSource.delete({
     *   where: {
     *     // ... filter to delete one ScrapeSource
     *   }
     * })
     * 
     */
    delete<T extends ScrapeSourceDeleteArgs>(args: SelectSubset<T, ScrapeSourceDeleteArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScrapeSource.
     * @param {ScrapeSourceUpdateArgs} args - Arguments to update one ScrapeSource.
     * @example
     * // Update one ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScrapeSourceUpdateArgs>(args: SelectSubset<T, ScrapeSourceUpdateArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScrapeSources.
     * @param {ScrapeSourceDeleteManyArgs} args - Arguments to filter ScrapeSources to delete.
     * @example
     * // Delete a few ScrapeSources
     * const { count } = await prisma.scrapeSource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScrapeSourceDeleteManyArgs>(args?: SelectSubset<T, ScrapeSourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapeSources
     * const scrapeSource = await prisma.scrapeSource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScrapeSourceUpdateManyArgs>(args: SelectSubset<T, ScrapeSourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeSources and returns the data updated in the database.
     * @param {ScrapeSourceUpdateManyAndReturnArgs} args - Arguments to update many ScrapeSources.
     * @example
     * // Update many ScrapeSources
     * const scrapeSource = await prisma.scrapeSource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScrapeSources and only return the `id`
     * const scrapeSourceWithIdOnly = await prisma.scrapeSource.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScrapeSourceUpdateManyAndReturnArgs>(args: SelectSubset<T, ScrapeSourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScrapeSource.
     * @param {ScrapeSourceUpsertArgs} args - Arguments to update or create a ScrapeSource.
     * @example
     * // Update or create a ScrapeSource
     * const scrapeSource = await prisma.scrapeSource.upsert({
     *   create: {
     *     // ... data to create a ScrapeSource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapeSource we want to update
     *   }
     * })
     */
    upsert<T extends ScrapeSourceUpsertArgs>(args: SelectSubset<T, ScrapeSourceUpsertArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScrapeSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceCountArgs} args - Arguments to filter ScrapeSources to count.
     * @example
     * // Count the number of ScrapeSources
     * const count = await prisma.scrapeSource.count({
     *   where: {
     *     // ... the filter for the ScrapeSources we want to count
     *   }
     * })
    **/
    count<T extends ScrapeSourceCountArgs>(
      args?: Subset<T, ScrapeSourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapeSourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapeSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScrapeSourceAggregateArgs>(args: Subset<T, ScrapeSourceAggregateArgs>): Prisma.PrismaPromise<GetScrapeSourceAggregateType<T>>

    /**
     * Group by ScrapeSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeSourceGroupByArgs} args - Group by arguments.
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
      T extends ScrapeSourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapeSourceGroupByArgs['orderBy'] }
        : { orderBy?: ScrapeSourceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScrapeSourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapeSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScrapeSource model
   */
  readonly fields: ScrapeSourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapeSource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScrapeSourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends ScrapeSource$itemsArgs<ExtArgs> = {}>(args?: Subset<T, ScrapeSource$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapedLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    runs<T extends ScrapeSource$runsArgs<ExtArgs> = {}>(args?: Subset<T, ScrapeSource$runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ScrapeSource model
   */
  interface ScrapeSourceFieldRefs {
    readonly id: FieldRef<"ScrapeSource", 'String'>
    readonly name: FieldRef<"ScrapeSource", 'String'>
    readonly category: FieldRef<"ScrapeSource", 'String'>
    readonly url: FieldRef<"ScrapeSource", 'String'>
    readonly active: FieldRef<"ScrapeSource", 'Boolean'>
    readonly tenantId: FieldRef<"ScrapeSource", 'String'>
    readonly intervalMinutes: FieldRef<"ScrapeSource", 'Int'>
    readonly maxItemsPerRun: FieldRef<"ScrapeSource", 'Int'>
    readonly itemSelector: FieldRef<"ScrapeSource", 'String'>
    readonly linkSelector: FieldRef<"ScrapeSource", 'String'>
    readonly merchantName: FieldRef<"ScrapeSource", 'String'>
    readonly companyName: FieldRef<"ScrapeSource", 'String'>
    readonly contactEmail: FieldRef<"ScrapeSource", 'String'>
    readonly contactPhone: FieldRef<"ScrapeSource", 'String'>
    readonly listingFeePence: FieldRef<"ScrapeSource", 'Int'>
    readonly placementFeePence: FieldRef<"ScrapeSource", 'Int'>
    readonly deliveryFeePence: FieldRef<"ScrapeSource", 'Int'>
    readonly premiumFeePence: FieldRef<"ScrapeSource", 'Int'>
    readonly nextRunAt: FieldRef<"ScrapeSource", 'DateTime'>
    readonly lastRunAt: FieldRef<"ScrapeSource", 'DateTime'>
    readonly lastSuccessAt: FieldRef<"ScrapeSource", 'DateTime'>
    readonly lastError: FieldRef<"ScrapeSource", 'String'>
    readonly consecutiveFailures: FieldRef<"ScrapeSource", 'Int'>
    readonly createdAt: FieldRef<"ScrapeSource", 'DateTime'>
    readonly updatedAt: FieldRef<"ScrapeSource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScrapeSource findUnique
   */
  export type ScrapeSourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeSource to fetch.
     */
    where: ScrapeSourceWhereUniqueInput
  }

  /**
   * ScrapeSource findUniqueOrThrow
   */
  export type ScrapeSourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeSource to fetch.
     */
    where: ScrapeSourceWhereUniqueInput
  }

  /**
   * ScrapeSource findFirst
   */
  export type ScrapeSourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeSource to fetch.
     */
    where?: ScrapeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeSources to fetch.
     */
    orderBy?: ScrapeSourceOrderByWithRelationInput | ScrapeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeSources.
     */
    cursor?: ScrapeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeSources.
     */
    distinct?: ScrapeSourceScalarFieldEnum | ScrapeSourceScalarFieldEnum[]
  }

  /**
   * ScrapeSource findFirstOrThrow
   */
  export type ScrapeSourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeSource to fetch.
     */
    where?: ScrapeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeSources to fetch.
     */
    orderBy?: ScrapeSourceOrderByWithRelationInput | ScrapeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeSources.
     */
    cursor?: ScrapeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeSources.
     */
    distinct?: ScrapeSourceScalarFieldEnum | ScrapeSourceScalarFieldEnum[]
  }

  /**
   * ScrapeSource findMany
   */
  export type ScrapeSourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeSources to fetch.
     */
    where?: ScrapeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeSources to fetch.
     */
    orderBy?: ScrapeSourceOrderByWithRelationInput | ScrapeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapeSources.
     */
    cursor?: ScrapeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeSources.
     */
    skip?: number
    distinct?: ScrapeSourceScalarFieldEnum | ScrapeSourceScalarFieldEnum[]
  }

  /**
   * ScrapeSource create
   */
  export type ScrapeSourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * The data needed to create a ScrapeSource.
     */
    data: XOR<ScrapeSourceCreateInput, ScrapeSourceUncheckedCreateInput>
  }

  /**
   * ScrapeSource createMany
   */
  export type ScrapeSourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapeSources.
     */
    data: ScrapeSourceCreateManyInput | ScrapeSourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapeSource createManyAndReturn
   */
  export type ScrapeSourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * The data used to create many ScrapeSources.
     */
    data: ScrapeSourceCreateManyInput | ScrapeSourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapeSource update
   */
  export type ScrapeSourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * The data needed to update a ScrapeSource.
     */
    data: XOR<ScrapeSourceUpdateInput, ScrapeSourceUncheckedUpdateInput>
    /**
     * Choose, which ScrapeSource to update.
     */
    where: ScrapeSourceWhereUniqueInput
  }

  /**
   * ScrapeSource updateMany
   */
  export type ScrapeSourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapeSources.
     */
    data: XOR<ScrapeSourceUpdateManyMutationInput, ScrapeSourceUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeSources to update
     */
    where?: ScrapeSourceWhereInput
    /**
     * Limit how many ScrapeSources to update.
     */
    limit?: number
  }

  /**
   * ScrapeSource updateManyAndReturn
   */
  export type ScrapeSourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * The data used to update ScrapeSources.
     */
    data: XOR<ScrapeSourceUpdateManyMutationInput, ScrapeSourceUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeSources to update
     */
    where?: ScrapeSourceWhereInput
    /**
     * Limit how many ScrapeSources to update.
     */
    limit?: number
  }

  /**
   * ScrapeSource upsert
   */
  export type ScrapeSourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * The filter to search for the ScrapeSource to update in case it exists.
     */
    where: ScrapeSourceWhereUniqueInput
    /**
     * In case the ScrapeSource found by the `where` argument doesn't exist, create a new ScrapeSource with this data.
     */
    create: XOR<ScrapeSourceCreateInput, ScrapeSourceUncheckedCreateInput>
    /**
     * In case the ScrapeSource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScrapeSourceUpdateInput, ScrapeSourceUncheckedUpdateInput>
  }

  /**
   * ScrapeSource delete
   */
  export type ScrapeSourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
    /**
     * Filter which ScrapeSource to delete.
     */
    where: ScrapeSourceWhereUniqueInput
  }

  /**
   * ScrapeSource deleteMany
   */
  export type ScrapeSourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeSources to delete
     */
    where?: ScrapeSourceWhereInput
    /**
     * Limit how many ScrapeSources to delete.
     */
    limit?: number
  }

  /**
   * ScrapeSource.items
   */
  export type ScrapeSource$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapedLink
     */
    select?: ScrapedLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapedLink
     */
    omit?: ScrapedLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapedLinkInclude<ExtArgs> | null
    where?: ScrapedLinkWhereInput
    orderBy?: ScrapedLinkOrderByWithRelationInput | ScrapedLinkOrderByWithRelationInput[]
    cursor?: ScrapedLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScrapedLinkScalarFieldEnum | ScrapedLinkScalarFieldEnum[]
  }

  /**
   * ScrapeSource.runs
   */
  export type ScrapeSource$runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    where?: ScrapeRunWhereInput
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    cursor?: ScrapeRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeSource without action
   */
  export type ScrapeSourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeSource
     */
    select?: ScrapeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeSource
     */
    omit?: ScrapeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeSourceInclude<ExtArgs> | null
  }


  /**
   * Model ScrapeRun
   */

  export type AggregateScrapeRun = {
    _count: ScrapeRunCountAggregateOutputType | null
    _avg: ScrapeRunAvgAggregateOutputType | null
    _sum: ScrapeRunSumAggregateOutputType | null
    _min: ScrapeRunMinAggregateOutputType | null
    _max: ScrapeRunMaxAggregateOutputType | null
  }

  export type ScrapeRunAvgAggregateOutputType = {
    discovered: number | null
    ingested: number | null
    leadsPushed: number | null
  }

  export type ScrapeRunSumAggregateOutputType = {
    discovered: number | null
    ingested: number | null
    leadsPushed: number | null
  }

  export type ScrapeRunMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    status: string | null
    discovered: number | null
    ingested: number | null
    leadsPushed: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type ScrapeRunMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    status: string | null
    discovered: number | null
    ingested: number | null
    leadsPushed: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type ScrapeRunCountAggregateOutputType = {
    id: number
    sourceId: number
    status: number
    discovered: number
    ingested: number
    leadsPushed: number
    errors: number
    startedAt: number
    completedAt: number
    _all: number
  }


  export type ScrapeRunAvgAggregateInputType = {
    discovered?: true
    ingested?: true
    leadsPushed?: true
  }

  export type ScrapeRunSumAggregateInputType = {
    discovered?: true
    ingested?: true
    leadsPushed?: true
  }

  export type ScrapeRunMinAggregateInputType = {
    id?: true
    sourceId?: true
    status?: true
    discovered?: true
    ingested?: true
    leadsPushed?: true
    startedAt?: true
    completedAt?: true
  }

  export type ScrapeRunMaxAggregateInputType = {
    id?: true
    sourceId?: true
    status?: true
    discovered?: true
    ingested?: true
    leadsPushed?: true
    startedAt?: true
    completedAt?: true
  }

  export type ScrapeRunCountAggregateInputType = {
    id?: true
    sourceId?: true
    status?: true
    discovered?: true
    ingested?: true
    leadsPushed?: true
    errors?: true
    startedAt?: true
    completedAt?: true
    _all?: true
  }

  export type ScrapeRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeRun to aggregate.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapeRuns
    **/
    _count?: true | ScrapeRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScrapeRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScrapeRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapeRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapeRunMaxAggregateInputType
  }

  export type GetScrapeRunAggregateType<T extends ScrapeRunAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapeRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapeRun[P]>
      : GetScalarType<T[P], AggregateScrapeRun[P]>
  }




  export type ScrapeRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeRunWhereInput
    orderBy?: ScrapeRunOrderByWithAggregationInput | ScrapeRunOrderByWithAggregationInput[]
    by: ScrapeRunScalarFieldEnum[] | ScrapeRunScalarFieldEnum
    having?: ScrapeRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapeRunCountAggregateInputType | true
    _avg?: ScrapeRunAvgAggregateInputType
    _sum?: ScrapeRunSumAggregateInputType
    _min?: ScrapeRunMinAggregateInputType
    _max?: ScrapeRunMaxAggregateInputType
  }

  export type ScrapeRunGroupByOutputType = {
    id: string
    sourceId: string
    status: string
    discovered: number
    ingested: number
    leadsPushed: number
    errors: JsonValue | null
    startedAt: Date
    completedAt: Date | null
    _count: ScrapeRunCountAggregateOutputType | null
    _avg: ScrapeRunAvgAggregateOutputType | null
    _sum: ScrapeRunSumAggregateOutputType | null
    _min: ScrapeRunMinAggregateOutputType | null
    _max: ScrapeRunMaxAggregateOutputType | null
  }

  type GetScrapeRunGroupByPayload<T extends ScrapeRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScrapeRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapeRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapeRunGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapeRunGroupByOutputType[P]>
        }
      >
    >


  export type ScrapeRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    status?: boolean
    discovered?: boolean
    ingested?: boolean
    leadsPushed?: boolean
    errors?: boolean
    startedAt?: boolean
    completedAt?: boolean
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    status?: boolean
    discovered?: boolean
    ingested?: boolean
    leadsPushed?: boolean
    errors?: boolean
    startedAt?: boolean
    completedAt?: boolean
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    status?: boolean
    discovered?: boolean
    ingested?: boolean
    leadsPushed?: boolean
    errors?: boolean
    startedAt?: boolean
    completedAt?: boolean
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scrapeRun"]>

  export type ScrapeRunSelectScalar = {
    id?: boolean
    sourceId?: boolean
    status?: boolean
    discovered?: boolean
    ingested?: boolean
    leadsPushed?: boolean
    errors?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }

  export type ScrapeRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "status" | "discovered" | "ingested" | "leadsPushed" | "errors" | "startedAt" | "completedAt", ExtArgs["result"]["scrapeRun"]>
  export type ScrapeRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }
  export type ScrapeRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }
  export type ScrapeRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ScrapeSourceDefaultArgs<ExtArgs>
  }

  export type $ScrapeRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScrapeRun"
    objects: {
      source: Prisma.$ScrapeSourcePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      status: string
      discovered: number
      ingested: number
      leadsPushed: number
      errors: Prisma.JsonValue | null
      startedAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["scrapeRun"]>
    composites: {}
  }

  type ScrapeRunGetPayload<S extends boolean | null | undefined | ScrapeRunDefaultArgs> = $Result.GetResult<Prisma.$ScrapeRunPayload, S>

  type ScrapeRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScrapeRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScrapeRunCountAggregateInputType | true
    }

  export interface ScrapeRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScrapeRun'], meta: { name: 'ScrapeRun' } }
    /**
     * Find zero or one ScrapeRun that matches the filter.
     * @param {ScrapeRunFindUniqueArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapeRunFindUniqueArgs>(args: SelectSubset<T, ScrapeRunFindUniqueArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScrapeRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapeRunFindUniqueOrThrowArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapeRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ScrapeRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindFirstArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapeRunFindFirstArgs>(args?: SelectSubset<T, ScrapeRunFindFirstArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindFirstOrThrowArgs} args - Arguments to find a ScrapeRun
     * @example
     * // Get one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapeRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ScrapeRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScrapeRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapeRuns
     * const scrapeRuns = await prisma.scrapeRun.findMany()
     * 
     * // Get first 10 ScrapeRuns
     * const scrapeRuns = await prisma.scrapeRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScrapeRunFindManyArgs>(args?: SelectSubset<T, ScrapeRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScrapeRun.
     * @param {ScrapeRunCreateArgs} args - Arguments to create a ScrapeRun.
     * @example
     * // Create one ScrapeRun
     * const ScrapeRun = await prisma.scrapeRun.create({
     *   data: {
     *     // ... data to create a ScrapeRun
     *   }
     * })
     * 
     */
    create<T extends ScrapeRunCreateArgs>(args: SelectSubset<T, ScrapeRunCreateArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScrapeRuns.
     * @param {ScrapeRunCreateManyArgs} args - Arguments to create many ScrapeRuns.
     * @example
     * // Create many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScrapeRunCreateManyArgs>(args?: SelectSubset<T, ScrapeRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScrapeRuns and returns the data saved in the database.
     * @param {ScrapeRunCreateManyAndReturnArgs} args - Arguments to create many ScrapeRuns.
     * @example
     * // Create many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScrapeRuns and only return the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScrapeRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ScrapeRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScrapeRun.
     * @param {ScrapeRunDeleteArgs} args - Arguments to delete one ScrapeRun.
     * @example
     * // Delete one ScrapeRun
     * const ScrapeRun = await prisma.scrapeRun.delete({
     *   where: {
     *     // ... filter to delete one ScrapeRun
     *   }
     * })
     * 
     */
    delete<T extends ScrapeRunDeleteArgs>(args: SelectSubset<T, ScrapeRunDeleteArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScrapeRun.
     * @param {ScrapeRunUpdateArgs} args - Arguments to update one ScrapeRun.
     * @example
     * // Update one ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScrapeRunUpdateArgs>(args: SelectSubset<T, ScrapeRunUpdateArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScrapeRuns.
     * @param {ScrapeRunDeleteManyArgs} args - Arguments to filter ScrapeRuns to delete.
     * @example
     * // Delete a few ScrapeRuns
     * const { count } = await prisma.scrapeRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScrapeRunDeleteManyArgs>(args?: SelectSubset<T, ScrapeRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScrapeRunUpdateManyArgs>(args: SelectSubset<T, ScrapeRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeRuns and returns the data updated in the database.
     * @param {ScrapeRunUpdateManyAndReturnArgs} args - Arguments to update many ScrapeRuns.
     * @example
     * // Update many ScrapeRuns
     * const scrapeRun = await prisma.scrapeRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScrapeRuns and only return the `id`
     * const scrapeRunWithIdOnly = await prisma.scrapeRun.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScrapeRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ScrapeRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScrapeRun.
     * @param {ScrapeRunUpsertArgs} args - Arguments to update or create a ScrapeRun.
     * @example
     * // Update or create a ScrapeRun
     * const scrapeRun = await prisma.scrapeRun.upsert({
     *   create: {
     *     // ... data to create a ScrapeRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapeRun we want to update
     *   }
     * })
     */
    upsert<T extends ScrapeRunUpsertArgs>(args: SelectSubset<T, ScrapeRunUpsertArgs<ExtArgs>>): Prisma__ScrapeRunClient<$Result.GetResult<Prisma.$ScrapeRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScrapeRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunCountArgs} args - Arguments to filter ScrapeRuns to count.
     * @example
     * // Count the number of ScrapeRuns
     * const count = await prisma.scrapeRun.count({
     *   where: {
     *     // ... the filter for the ScrapeRuns we want to count
     *   }
     * })
    **/
    count<T extends ScrapeRunCountArgs>(
      args?: Subset<T, ScrapeRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapeRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapeRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScrapeRunAggregateArgs>(args: Subset<T, ScrapeRunAggregateArgs>): Prisma.PrismaPromise<GetScrapeRunAggregateType<T>>

    /**
     * Group by ScrapeRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeRunGroupByArgs} args - Group by arguments.
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
      T extends ScrapeRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapeRunGroupByArgs['orderBy'] }
        : { orderBy?: ScrapeRunGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScrapeRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapeRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScrapeRun model
   */
  readonly fields: ScrapeRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapeRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScrapeRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends ScrapeSourceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ScrapeSourceDefaultArgs<ExtArgs>>): Prisma__ScrapeSourceClient<$Result.GetResult<Prisma.$ScrapeSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ScrapeRun model
   */
  interface ScrapeRunFieldRefs {
    readonly id: FieldRef<"ScrapeRun", 'String'>
    readonly sourceId: FieldRef<"ScrapeRun", 'String'>
    readonly status: FieldRef<"ScrapeRun", 'String'>
    readonly discovered: FieldRef<"ScrapeRun", 'Int'>
    readonly ingested: FieldRef<"ScrapeRun", 'Int'>
    readonly leadsPushed: FieldRef<"ScrapeRun", 'Int'>
    readonly errors: FieldRef<"ScrapeRun", 'Json'>
    readonly startedAt: FieldRef<"ScrapeRun", 'DateTime'>
    readonly completedAt: FieldRef<"ScrapeRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScrapeRun findUnique
   */
  export type ScrapeRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun findUniqueOrThrow
   */
  export type ScrapeRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun findFirst
   */
  export type ScrapeRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeRuns.
     */
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun findFirstOrThrow
   */
  export type ScrapeRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRun to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeRuns.
     */
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun findMany
   */
  export type ScrapeRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter, which ScrapeRuns to fetch.
     */
    where?: ScrapeRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeRuns to fetch.
     */
    orderBy?: ScrapeRunOrderByWithRelationInput | ScrapeRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapeRuns.
     */
    cursor?: ScrapeRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeRuns.
     */
    skip?: number
    distinct?: ScrapeRunScalarFieldEnum | ScrapeRunScalarFieldEnum[]
  }

  /**
   * ScrapeRun create
   */
  export type ScrapeRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ScrapeRun.
     */
    data: XOR<ScrapeRunCreateInput, ScrapeRunUncheckedCreateInput>
  }

  /**
   * ScrapeRun createMany
   */
  export type ScrapeRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapeRuns.
     */
    data: ScrapeRunCreateManyInput | ScrapeRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapeRun createManyAndReturn
   */
  export type ScrapeRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * The data used to create many ScrapeRuns.
     */
    data: ScrapeRunCreateManyInput | ScrapeRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapeRun update
   */
  export type ScrapeRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ScrapeRun.
     */
    data: XOR<ScrapeRunUpdateInput, ScrapeRunUncheckedUpdateInput>
    /**
     * Choose, which ScrapeRun to update.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun updateMany
   */
  export type ScrapeRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapeRuns.
     */
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeRuns to update
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to update.
     */
    limit?: number
  }

  /**
   * ScrapeRun updateManyAndReturn
   */
  export type ScrapeRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * The data used to update ScrapeRuns.
     */
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeRuns to update
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScrapeRun upsert
   */
  export type ScrapeRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ScrapeRun to update in case it exists.
     */
    where: ScrapeRunWhereUniqueInput
    /**
     * In case the ScrapeRun found by the `where` argument doesn't exist, create a new ScrapeRun with this data.
     */
    create: XOR<ScrapeRunCreateInput, ScrapeRunUncheckedCreateInput>
    /**
     * In case the ScrapeRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScrapeRunUpdateInput, ScrapeRunUncheckedUpdateInput>
  }

  /**
   * ScrapeRun delete
   */
  export type ScrapeRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
    /**
     * Filter which ScrapeRun to delete.
     */
    where: ScrapeRunWhereUniqueInput
  }

  /**
   * ScrapeRun deleteMany
   */
  export type ScrapeRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeRuns to delete
     */
    where?: ScrapeRunWhereInput
    /**
     * Limit how many ScrapeRuns to delete.
     */
    limit?: number
  }

  /**
   * ScrapeRun without action
   */
  export type ScrapeRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeRun
     */
    select?: ScrapeRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeRun
     */
    omit?: ScrapeRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScrapeRunInclude<ExtArgs> | null
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


  export const MarketplaceMerchantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    wrosMerchantId: 'wrosMerchantId',
    createdAt: 'createdAt'
  };

  export type MarketplaceMerchantScalarFieldEnum = (typeof MarketplaceMerchantScalarFieldEnum)[keyof typeof MarketplaceMerchantScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    title: 'title',
    merchantId: 'merchantId'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ScrapedLinkScalarFieldEnum: {
    id: 'id',
    url: 'url',
    sourceHost: 'sourceHost',
    title: 'title',
    description: 'description',
    imageUrl: 'imageUrl',
    tenantId: 'tenantId',
    merchantName: 'merchantName',
    companyName: 'companyName',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    status: 'status',
    priority: 'priority',
    claimedBy: 'claimedBy',
    claimedAt: 'claimedAt',
    rehomedAt: 'rehomedAt',
    listingFeePence: 'listingFeePence',
    placementFeePence: 'placementFeePence',
    deliveryFeePence: 'deliveryFeePence',
    premiumFeePence: 'premiumFeePence',
    wrosLeadId: 'wrosLeadId',
    sourceId: 'sourceId',
    scrapedAt: 'scrapedAt',
    updatedAt: 'updatedAt'
  };

  export type ScrapedLinkScalarFieldEnum = (typeof ScrapedLinkScalarFieldEnum)[keyof typeof ScrapedLinkScalarFieldEnum]


  export const ScrapeSourceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    category: 'category',
    url: 'url',
    active: 'active',
    tenantId: 'tenantId',
    intervalMinutes: 'intervalMinutes',
    maxItemsPerRun: 'maxItemsPerRun',
    itemSelector: 'itemSelector',
    linkSelector: 'linkSelector',
    merchantName: 'merchantName',
    companyName: 'companyName',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    listingFeePence: 'listingFeePence',
    placementFeePence: 'placementFeePence',
    deliveryFeePence: 'deliveryFeePence',
    premiumFeePence: 'premiumFeePence',
    nextRunAt: 'nextRunAt',
    lastRunAt: 'lastRunAt',
    lastSuccessAt: 'lastSuccessAt',
    lastError: 'lastError',
    consecutiveFailures: 'consecutiveFailures',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScrapeSourceScalarFieldEnum = (typeof ScrapeSourceScalarFieldEnum)[keyof typeof ScrapeSourceScalarFieldEnum]


  export const ScrapeRunScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    status: 'status',
    discovered: 'discovered',
    ingested: 'ingested',
    leadsPushed: 'leadsPushed',
    errors: 'errors',
    startedAt: 'startedAt',
    completedAt: 'completedAt'
  };

  export type ScrapeRunScalarFieldEnum = (typeof ScrapeRunScalarFieldEnum)[keyof typeof ScrapeRunScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


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

  export type MarketplaceMerchantWhereInput = {
    AND?: MarketplaceMerchantWhereInput | MarketplaceMerchantWhereInput[]
    OR?: MarketplaceMerchantWhereInput[]
    NOT?: MarketplaceMerchantWhereInput | MarketplaceMerchantWhereInput[]
    id?: StringFilter<"MarketplaceMerchant"> | string
    name?: StringFilter<"MarketplaceMerchant"> | string
    wrosMerchantId?: StringNullableFilter<"MarketplaceMerchant"> | string | null
    createdAt?: DateTimeFilter<"MarketplaceMerchant"> | Date | string
    products?: ProductListRelationFilter
  }

  export type MarketplaceMerchantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    wrosMerchantId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type MarketplaceMerchantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MarketplaceMerchantWhereInput | MarketplaceMerchantWhereInput[]
    OR?: MarketplaceMerchantWhereInput[]
    NOT?: MarketplaceMerchantWhereInput | MarketplaceMerchantWhereInput[]
    name?: StringFilter<"MarketplaceMerchant"> | string
    wrosMerchantId?: StringNullableFilter<"MarketplaceMerchant"> | string | null
    createdAt?: DateTimeFilter<"MarketplaceMerchant"> | Date | string
    products?: ProductListRelationFilter
  }, "id">

  export type MarketplaceMerchantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    wrosMerchantId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MarketplaceMerchantCountOrderByAggregateInput
    _max?: MarketplaceMerchantMaxOrderByAggregateInput
    _min?: MarketplaceMerchantMinOrderByAggregateInput
  }

  export type MarketplaceMerchantScalarWhereWithAggregatesInput = {
    AND?: MarketplaceMerchantScalarWhereWithAggregatesInput | MarketplaceMerchantScalarWhereWithAggregatesInput[]
    OR?: MarketplaceMerchantScalarWhereWithAggregatesInput[]
    NOT?: MarketplaceMerchantScalarWhereWithAggregatesInput | MarketplaceMerchantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MarketplaceMerchant"> | string
    name?: StringWithAggregatesFilter<"MarketplaceMerchant"> | string
    wrosMerchantId?: StringNullableWithAggregatesFilter<"MarketplaceMerchant"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MarketplaceMerchant"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    title?: StringFilter<"Product"> | string
    merchantId?: StringFilter<"Product"> | string
    merchant?: XOR<MarketplaceMerchantScalarRelationFilter, MarketplaceMerchantWhereInput>
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    merchantId?: SortOrder
    merchant?: MarketplaceMerchantOrderByWithRelationInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    title?: StringFilter<"Product"> | string
    merchantId?: StringFilter<"Product"> | string
    merchant?: XOR<MarketplaceMerchantScalarRelationFilter, MarketplaceMerchantWhereInput>
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    merchantId?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    title?: StringWithAggregatesFilter<"Product"> | string
    merchantId?: StringWithAggregatesFilter<"Product"> | string
  }

  export type ScrapedLinkWhereInput = {
    AND?: ScrapedLinkWhereInput | ScrapedLinkWhereInput[]
    OR?: ScrapedLinkWhereInput[]
    NOT?: ScrapedLinkWhereInput | ScrapedLinkWhereInput[]
    id?: StringFilter<"ScrapedLink"> | string
    url?: StringFilter<"ScrapedLink"> | string
    sourceHost?: StringFilter<"ScrapedLink"> | string
    title?: StringFilter<"ScrapedLink"> | string
    description?: StringNullableFilter<"ScrapedLink"> | string | null
    imageUrl?: StringNullableFilter<"ScrapedLink"> | string | null
    tenantId?: StringNullableFilter<"ScrapedLink"> | string | null
    merchantName?: StringNullableFilter<"ScrapedLink"> | string | null
    companyName?: StringNullableFilter<"ScrapedLink"> | string | null
    contactEmail?: StringNullableFilter<"ScrapedLink"> | string | null
    contactPhone?: StringNullableFilter<"ScrapedLink"> | string | null
    status?: StringFilter<"ScrapedLink"> | string
    priority?: BoolFilter<"ScrapedLink"> | boolean
    claimedBy?: StringNullableFilter<"ScrapedLink"> | string | null
    claimedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    rehomedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    listingFeePence?: IntFilter<"ScrapedLink"> | number
    placementFeePence?: IntFilter<"ScrapedLink"> | number
    deliveryFeePence?: IntFilter<"ScrapedLink"> | number
    premiumFeePence?: IntFilter<"ScrapedLink"> | number
    wrosLeadId?: StringNullableFilter<"ScrapedLink"> | string | null
    sourceId?: StringNullableFilter<"ScrapedLink"> | string | null
    scrapedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
    source?: XOR<ScrapeSourceNullableScalarRelationFilter, ScrapeSourceWhereInput> | null
  }

  export type ScrapedLinkOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    sourceHost?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    tenantId?: SortOrderInput | SortOrder
    merchantName?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    claimedBy?: SortOrderInput | SortOrder
    claimedAt?: SortOrderInput | SortOrder
    rehomedAt?: SortOrderInput | SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    wrosLeadId?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    scrapedAt?: SortOrder
    updatedAt?: SortOrder
    source?: ScrapeSourceOrderByWithRelationInput
  }

  export type ScrapedLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: ScrapedLinkWhereInput | ScrapedLinkWhereInput[]
    OR?: ScrapedLinkWhereInput[]
    NOT?: ScrapedLinkWhereInput | ScrapedLinkWhereInput[]
    sourceHost?: StringFilter<"ScrapedLink"> | string
    title?: StringFilter<"ScrapedLink"> | string
    description?: StringNullableFilter<"ScrapedLink"> | string | null
    imageUrl?: StringNullableFilter<"ScrapedLink"> | string | null
    tenantId?: StringNullableFilter<"ScrapedLink"> | string | null
    merchantName?: StringNullableFilter<"ScrapedLink"> | string | null
    companyName?: StringNullableFilter<"ScrapedLink"> | string | null
    contactEmail?: StringNullableFilter<"ScrapedLink"> | string | null
    contactPhone?: StringNullableFilter<"ScrapedLink"> | string | null
    status?: StringFilter<"ScrapedLink"> | string
    priority?: BoolFilter<"ScrapedLink"> | boolean
    claimedBy?: StringNullableFilter<"ScrapedLink"> | string | null
    claimedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    rehomedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    listingFeePence?: IntFilter<"ScrapedLink"> | number
    placementFeePence?: IntFilter<"ScrapedLink"> | number
    deliveryFeePence?: IntFilter<"ScrapedLink"> | number
    premiumFeePence?: IntFilter<"ScrapedLink"> | number
    wrosLeadId?: StringNullableFilter<"ScrapedLink"> | string | null
    sourceId?: StringNullableFilter<"ScrapedLink"> | string | null
    scrapedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
    source?: XOR<ScrapeSourceNullableScalarRelationFilter, ScrapeSourceWhereInput> | null
  }, "id" | "url">

  export type ScrapedLinkOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    sourceHost?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    tenantId?: SortOrderInput | SortOrder
    merchantName?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    claimedBy?: SortOrderInput | SortOrder
    claimedAt?: SortOrderInput | SortOrder
    rehomedAt?: SortOrderInput | SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    wrosLeadId?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    scrapedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScrapedLinkCountOrderByAggregateInput
    _avg?: ScrapedLinkAvgOrderByAggregateInput
    _max?: ScrapedLinkMaxOrderByAggregateInput
    _min?: ScrapedLinkMinOrderByAggregateInput
    _sum?: ScrapedLinkSumOrderByAggregateInput
  }

  export type ScrapedLinkScalarWhereWithAggregatesInput = {
    AND?: ScrapedLinkScalarWhereWithAggregatesInput | ScrapedLinkScalarWhereWithAggregatesInput[]
    OR?: ScrapedLinkScalarWhereWithAggregatesInput[]
    NOT?: ScrapedLinkScalarWhereWithAggregatesInput | ScrapedLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScrapedLink"> | string
    url?: StringWithAggregatesFilter<"ScrapedLink"> | string
    sourceHost?: StringWithAggregatesFilter<"ScrapedLink"> | string
    title?: StringWithAggregatesFilter<"ScrapedLink"> | string
    description?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    tenantId?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    merchantName?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    companyName?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    status?: StringWithAggregatesFilter<"ScrapedLink"> | string
    priority?: BoolWithAggregatesFilter<"ScrapedLink"> | boolean
    claimedBy?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    claimedAt?: DateTimeNullableWithAggregatesFilter<"ScrapedLink"> | Date | string | null
    rehomedAt?: DateTimeNullableWithAggregatesFilter<"ScrapedLink"> | Date | string | null
    listingFeePence?: IntWithAggregatesFilter<"ScrapedLink"> | number
    placementFeePence?: IntWithAggregatesFilter<"ScrapedLink"> | number
    deliveryFeePence?: IntWithAggregatesFilter<"ScrapedLink"> | number
    premiumFeePence?: IntWithAggregatesFilter<"ScrapedLink"> | number
    wrosLeadId?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    sourceId?: StringNullableWithAggregatesFilter<"ScrapedLink"> | string | null
    scrapedAt?: DateTimeWithAggregatesFilter<"ScrapedLink"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ScrapedLink"> | Date | string
  }

  export type ScrapeSourceWhereInput = {
    AND?: ScrapeSourceWhereInput | ScrapeSourceWhereInput[]
    OR?: ScrapeSourceWhereInput[]
    NOT?: ScrapeSourceWhereInput | ScrapeSourceWhereInput[]
    id?: StringFilter<"ScrapeSource"> | string
    name?: StringFilter<"ScrapeSource"> | string
    category?: StringFilter<"ScrapeSource"> | string
    url?: StringFilter<"ScrapeSource"> | string
    active?: BoolFilter<"ScrapeSource"> | boolean
    tenantId?: StringNullableFilter<"ScrapeSource"> | string | null
    intervalMinutes?: IntFilter<"ScrapeSource"> | number
    maxItemsPerRun?: IntFilter<"ScrapeSource"> | number
    itemSelector?: StringNullableFilter<"ScrapeSource"> | string | null
    linkSelector?: StringNullableFilter<"ScrapeSource"> | string | null
    merchantName?: StringNullableFilter<"ScrapeSource"> | string | null
    companyName?: StringNullableFilter<"ScrapeSource"> | string | null
    contactEmail?: StringNullableFilter<"ScrapeSource"> | string | null
    contactPhone?: StringNullableFilter<"ScrapeSource"> | string | null
    listingFeePence?: IntFilter<"ScrapeSource"> | number
    placementFeePence?: IntFilter<"ScrapeSource"> | number
    deliveryFeePence?: IntFilter<"ScrapeSource"> | number
    premiumFeePence?: IntFilter<"ScrapeSource"> | number
    nextRunAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    lastRunAt?: DateTimeNullableFilter<"ScrapeSource"> | Date | string | null
    lastSuccessAt?: DateTimeNullableFilter<"ScrapeSource"> | Date | string | null
    lastError?: StringNullableFilter<"ScrapeSource"> | string | null
    consecutiveFailures?: IntFilter<"ScrapeSource"> | number
    createdAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    items?: ScrapedLinkListRelationFilter
    runs?: ScrapeRunListRelationFilter
  }

  export type ScrapeSourceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    url?: SortOrder
    active?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    itemSelector?: SortOrderInput | SortOrder
    linkSelector?: SortOrderInput | SortOrder
    merchantName?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    nextRunAt?: SortOrder
    lastRunAt?: SortOrderInput | SortOrder
    lastSuccessAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    consecutiveFailures?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: ScrapedLinkOrderByRelationAggregateInput
    runs?: ScrapeRunOrderByRelationAggregateInput
  }

  export type ScrapeSourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: ScrapeSourceWhereInput | ScrapeSourceWhereInput[]
    OR?: ScrapeSourceWhereInput[]
    NOT?: ScrapeSourceWhereInput | ScrapeSourceWhereInput[]
    name?: StringFilter<"ScrapeSource"> | string
    category?: StringFilter<"ScrapeSource"> | string
    active?: BoolFilter<"ScrapeSource"> | boolean
    tenantId?: StringNullableFilter<"ScrapeSource"> | string | null
    intervalMinutes?: IntFilter<"ScrapeSource"> | number
    maxItemsPerRun?: IntFilter<"ScrapeSource"> | number
    itemSelector?: StringNullableFilter<"ScrapeSource"> | string | null
    linkSelector?: StringNullableFilter<"ScrapeSource"> | string | null
    merchantName?: StringNullableFilter<"ScrapeSource"> | string | null
    companyName?: StringNullableFilter<"ScrapeSource"> | string | null
    contactEmail?: StringNullableFilter<"ScrapeSource"> | string | null
    contactPhone?: StringNullableFilter<"ScrapeSource"> | string | null
    listingFeePence?: IntFilter<"ScrapeSource"> | number
    placementFeePence?: IntFilter<"ScrapeSource"> | number
    deliveryFeePence?: IntFilter<"ScrapeSource"> | number
    premiumFeePence?: IntFilter<"ScrapeSource"> | number
    nextRunAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    lastRunAt?: DateTimeNullableFilter<"ScrapeSource"> | Date | string | null
    lastSuccessAt?: DateTimeNullableFilter<"ScrapeSource"> | Date | string | null
    lastError?: StringNullableFilter<"ScrapeSource"> | string | null
    consecutiveFailures?: IntFilter<"ScrapeSource"> | number
    createdAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapeSource"> | Date | string
    items?: ScrapedLinkListRelationFilter
    runs?: ScrapeRunListRelationFilter
  }, "id" | "url">

  export type ScrapeSourceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    url?: SortOrder
    active?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    itemSelector?: SortOrderInput | SortOrder
    linkSelector?: SortOrderInput | SortOrder
    merchantName?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    nextRunAt?: SortOrder
    lastRunAt?: SortOrderInput | SortOrder
    lastSuccessAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    consecutiveFailures?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScrapeSourceCountOrderByAggregateInput
    _avg?: ScrapeSourceAvgOrderByAggregateInput
    _max?: ScrapeSourceMaxOrderByAggregateInput
    _min?: ScrapeSourceMinOrderByAggregateInput
    _sum?: ScrapeSourceSumOrderByAggregateInput
  }

  export type ScrapeSourceScalarWhereWithAggregatesInput = {
    AND?: ScrapeSourceScalarWhereWithAggregatesInput | ScrapeSourceScalarWhereWithAggregatesInput[]
    OR?: ScrapeSourceScalarWhereWithAggregatesInput[]
    NOT?: ScrapeSourceScalarWhereWithAggregatesInput | ScrapeSourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScrapeSource"> | string
    name?: StringWithAggregatesFilter<"ScrapeSource"> | string
    category?: StringWithAggregatesFilter<"ScrapeSource"> | string
    url?: StringWithAggregatesFilter<"ScrapeSource"> | string
    active?: BoolWithAggregatesFilter<"ScrapeSource"> | boolean
    tenantId?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    intervalMinutes?: IntWithAggregatesFilter<"ScrapeSource"> | number
    maxItemsPerRun?: IntWithAggregatesFilter<"ScrapeSource"> | number
    itemSelector?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    linkSelector?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    merchantName?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    companyName?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    listingFeePence?: IntWithAggregatesFilter<"ScrapeSource"> | number
    placementFeePence?: IntWithAggregatesFilter<"ScrapeSource"> | number
    deliveryFeePence?: IntWithAggregatesFilter<"ScrapeSource"> | number
    premiumFeePence?: IntWithAggregatesFilter<"ScrapeSource"> | number
    nextRunAt?: DateTimeWithAggregatesFilter<"ScrapeSource"> | Date | string
    lastRunAt?: DateTimeNullableWithAggregatesFilter<"ScrapeSource"> | Date | string | null
    lastSuccessAt?: DateTimeNullableWithAggregatesFilter<"ScrapeSource"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"ScrapeSource"> | string | null
    consecutiveFailures?: IntWithAggregatesFilter<"ScrapeSource"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ScrapeSource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ScrapeSource"> | Date | string
  }

  export type ScrapeRunWhereInput = {
    AND?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    OR?: ScrapeRunWhereInput[]
    NOT?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    id?: StringFilter<"ScrapeRun"> | string
    sourceId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    discovered?: IntFilter<"ScrapeRun"> | number
    ingested?: IntFilter<"ScrapeRun"> | number
    leadsPushed?: IntFilter<"ScrapeRun"> | number
    errors?: JsonNullableFilter<"ScrapeRun">
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
    source?: XOR<ScrapeSourceScalarRelationFilter, ScrapeSourceWhereInput>
  }

  export type ScrapeRunOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
    errors?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    source?: ScrapeSourceOrderByWithRelationInput
  }

  export type ScrapeRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    OR?: ScrapeRunWhereInput[]
    NOT?: ScrapeRunWhereInput | ScrapeRunWhereInput[]
    sourceId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    discovered?: IntFilter<"ScrapeRun"> | number
    ingested?: IntFilter<"ScrapeRun"> | number
    leadsPushed?: IntFilter<"ScrapeRun"> | number
    errors?: JsonNullableFilter<"ScrapeRun">
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
    source?: XOR<ScrapeSourceScalarRelationFilter, ScrapeSourceWhereInput>
  }, "id">

  export type ScrapeRunOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
    errors?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: ScrapeRunCountOrderByAggregateInput
    _avg?: ScrapeRunAvgOrderByAggregateInput
    _max?: ScrapeRunMaxOrderByAggregateInput
    _min?: ScrapeRunMinOrderByAggregateInput
    _sum?: ScrapeRunSumOrderByAggregateInput
  }

  export type ScrapeRunScalarWhereWithAggregatesInput = {
    AND?: ScrapeRunScalarWhereWithAggregatesInput | ScrapeRunScalarWhereWithAggregatesInput[]
    OR?: ScrapeRunScalarWhereWithAggregatesInput[]
    NOT?: ScrapeRunScalarWhereWithAggregatesInput | ScrapeRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScrapeRun"> | string
    sourceId?: StringWithAggregatesFilter<"ScrapeRun"> | string
    status?: StringWithAggregatesFilter<"ScrapeRun"> | string
    discovered?: IntWithAggregatesFilter<"ScrapeRun"> | number
    ingested?: IntWithAggregatesFilter<"ScrapeRun"> | number
    leadsPushed?: IntWithAggregatesFilter<"ScrapeRun"> | number
    errors?: JsonNullableWithAggregatesFilter<"ScrapeRun">
    startedAt?: DateTimeWithAggregatesFilter<"ScrapeRun"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"ScrapeRun"> | Date | string | null
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

  export type MarketplaceMerchantCreateInput = {
    id?: string
    name: string
    wrosMerchantId?: string | null
    createdAt?: Date | string
    products?: ProductCreateNestedManyWithoutMerchantInput
  }

  export type MarketplaceMerchantUncheckedCreateInput = {
    id?: string
    name: string
    wrosMerchantId?: string | null
    createdAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type MarketplaceMerchantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutMerchantNestedInput
  }

  export type MarketplaceMerchantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type MarketplaceMerchantCreateManyInput = {
    id?: string
    name: string
    wrosMerchantId?: string | null
    createdAt?: Date | string
  }

  export type MarketplaceMerchantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketplaceMerchantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    title: string
    merchant: MarketplaceMerchantCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    title: string
    merchantId: string
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    merchant?: MarketplaceMerchantUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
  }

  export type ProductCreateManyInput = {
    id?: string
    title: string
    merchantId: string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
  }

  export type ScrapedLinkCreateInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
    source?: ScrapeSourceCreateNestedOneWithoutItemsInput
  }

  export type ScrapedLinkUncheckedCreateInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    sourceId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapedLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: ScrapeSourceUpdateOneWithoutItemsNestedInput
  }

  export type ScrapedLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapedLinkCreateManyInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    sourceId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapedLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapedLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeSourceCreateInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ScrapedLinkCreateNestedManyWithoutSourceInput
    runs?: ScrapeRunCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceUncheckedCreateInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ScrapedLinkUncheckedCreateNestedManyWithoutSourceInput
    runs?: ScrapeRunUncheckedCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ScrapedLinkUpdateManyWithoutSourceNestedInput
    runs?: ScrapeRunUpdateManyWithoutSourceNestedInput
  }

  export type ScrapeSourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ScrapedLinkUncheckedUpdateManyWithoutSourceNestedInput
    runs?: ScrapeRunUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type ScrapeSourceCreateManyInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapeSourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeSourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeRunCreateInput = {
    id?: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    source: ScrapeSourceCreateNestedOneWithoutRunsInput
  }

  export type ScrapeRunUncheckedCreateInput = {
    id?: string
    sourceId: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScrapeRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    source?: ScrapeSourceUpdateOneRequiredWithoutRunsNestedInput
  }

  export type ScrapeRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunCreateManyInput = {
    id?: string
    sourceId: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScrapeRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MarketplaceMerchantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    wrosMerchantId?: SortOrder
    createdAt?: SortOrder
  }

  export type MarketplaceMerchantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    wrosMerchantId?: SortOrder
    createdAt?: SortOrder
  }

  export type MarketplaceMerchantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    wrosMerchantId?: SortOrder
    createdAt?: SortOrder
  }

  export type MarketplaceMerchantScalarRelationFilter = {
    is?: MarketplaceMerchantWhereInput
    isNot?: MarketplaceMerchantWhereInput
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    merchantId?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    merchantId?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    merchantId?: SortOrder
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

  export type ScrapeSourceNullableScalarRelationFilter = {
    is?: ScrapeSourceWhereInput | null
    isNot?: ScrapeSourceWhereInput | null
  }

  export type ScrapedLinkCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    sourceHost?: SortOrder
    title?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    tenantId?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    claimedBy?: SortOrder
    claimedAt?: SortOrder
    rehomedAt?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    wrosLeadId?: SortOrder
    sourceId?: SortOrder
    scrapedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapedLinkAvgOrderByAggregateInput = {
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
  }

  export type ScrapedLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    sourceHost?: SortOrder
    title?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    tenantId?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    claimedBy?: SortOrder
    claimedAt?: SortOrder
    rehomedAt?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    wrosLeadId?: SortOrder
    sourceId?: SortOrder
    scrapedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapedLinkMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    sourceHost?: SortOrder
    title?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    tenantId?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    claimedBy?: SortOrder
    claimedAt?: SortOrder
    rehomedAt?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    wrosLeadId?: SortOrder
    sourceId?: SortOrder
    scrapedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapedLinkSumOrderByAggregateInput = {
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
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

  export type ScrapedLinkListRelationFilter = {
    every?: ScrapedLinkWhereInput
    some?: ScrapedLinkWhereInput
    none?: ScrapedLinkWhereInput
  }

  export type ScrapeRunListRelationFilter = {
    every?: ScrapeRunWhereInput
    some?: ScrapeRunWhereInput
    none?: ScrapeRunWhereInput
  }

  export type ScrapedLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScrapeRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScrapeSourceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    url?: SortOrder
    active?: SortOrder
    tenantId?: SortOrder
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    itemSelector?: SortOrder
    linkSelector?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    nextRunAt?: SortOrder
    lastRunAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastError?: SortOrder
    consecutiveFailures?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeSourceAvgOrderByAggregateInput = {
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    consecutiveFailures?: SortOrder
  }

  export type ScrapeSourceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    url?: SortOrder
    active?: SortOrder
    tenantId?: SortOrder
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    itemSelector?: SortOrder
    linkSelector?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    nextRunAt?: SortOrder
    lastRunAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastError?: SortOrder
    consecutiveFailures?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeSourceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    category?: SortOrder
    url?: SortOrder
    active?: SortOrder
    tenantId?: SortOrder
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    itemSelector?: SortOrder
    linkSelector?: SortOrder
    merchantName?: SortOrder
    companyName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    nextRunAt?: SortOrder
    lastRunAt?: SortOrder
    lastSuccessAt?: SortOrder
    lastError?: SortOrder
    consecutiveFailures?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeSourceSumOrderByAggregateInput = {
    intervalMinutes?: SortOrder
    maxItemsPerRun?: SortOrder
    listingFeePence?: SortOrder
    placementFeePence?: SortOrder
    deliveryFeePence?: SortOrder
    premiumFeePence?: SortOrder
    consecutiveFailures?: SortOrder
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

  export type ScrapeSourceScalarRelationFilter = {
    is?: ScrapeSourceWhereInput
    isNot?: ScrapeSourceWhereInput
  }

  export type ScrapeRunCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
    errors?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScrapeRunAvgOrderByAggregateInput = {
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
  }

  export type ScrapeRunMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScrapeRunMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    status?: SortOrder
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ScrapeRunSumOrderByAggregateInput = {
    discovered?: SortOrder
    ingested?: SortOrder
    leadsPushed?: SortOrder
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

  export type ProductCreateNestedManyWithoutMerchantInput = {
    create?: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput> | ProductCreateWithoutMerchantInput[] | ProductUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMerchantInput | ProductCreateOrConnectWithoutMerchantInput[]
    createMany?: ProductCreateManyMerchantInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput> | ProductCreateWithoutMerchantInput[] | ProductUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMerchantInput | ProductCreateOrConnectWithoutMerchantInput[]
    createMany?: ProductCreateManyMerchantInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput> | ProductCreateWithoutMerchantInput[] | ProductUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMerchantInput | ProductCreateOrConnectWithoutMerchantInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutMerchantInput | ProductUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: ProductCreateManyMerchantInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutMerchantInput | ProductUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutMerchantInput | ProductUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput> | ProductCreateWithoutMerchantInput[] | ProductUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutMerchantInput | ProductCreateOrConnectWithoutMerchantInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutMerchantInput | ProductUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: ProductCreateManyMerchantInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutMerchantInput | ProductUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutMerchantInput | ProductUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type MarketplaceMerchantCreateNestedOneWithoutProductsInput = {
    create?: XOR<MarketplaceMerchantCreateWithoutProductsInput, MarketplaceMerchantUncheckedCreateWithoutProductsInput>
    connectOrCreate?: MarketplaceMerchantCreateOrConnectWithoutProductsInput
    connect?: MarketplaceMerchantWhereUniqueInput
  }

  export type MarketplaceMerchantUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<MarketplaceMerchantCreateWithoutProductsInput, MarketplaceMerchantUncheckedCreateWithoutProductsInput>
    connectOrCreate?: MarketplaceMerchantCreateOrConnectWithoutProductsInput
    upsert?: MarketplaceMerchantUpsertWithoutProductsInput
    connect?: MarketplaceMerchantWhereUniqueInput
    update?: XOR<XOR<MarketplaceMerchantUpdateToOneWithWhereWithoutProductsInput, MarketplaceMerchantUpdateWithoutProductsInput>, MarketplaceMerchantUncheckedUpdateWithoutProductsInput>
  }

  export type ScrapeSourceCreateNestedOneWithoutItemsInput = {
    create?: XOR<ScrapeSourceCreateWithoutItemsInput, ScrapeSourceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ScrapeSourceCreateOrConnectWithoutItemsInput
    connect?: ScrapeSourceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ScrapeSourceUpdateOneWithoutItemsNestedInput = {
    create?: XOR<ScrapeSourceCreateWithoutItemsInput, ScrapeSourceUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ScrapeSourceCreateOrConnectWithoutItemsInput
    upsert?: ScrapeSourceUpsertWithoutItemsInput
    disconnect?: ScrapeSourceWhereInput | boolean
    delete?: ScrapeSourceWhereInput | boolean
    connect?: ScrapeSourceWhereUniqueInput
    update?: XOR<XOR<ScrapeSourceUpdateToOneWithWhereWithoutItemsInput, ScrapeSourceUpdateWithoutItemsInput>, ScrapeSourceUncheckedUpdateWithoutItemsInput>
  }

  export type ScrapedLinkCreateNestedManyWithoutSourceInput = {
    create?: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput> | ScrapedLinkCreateWithoutSourceInput[] | ScrapedLinkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapedLinkCreateOrConnectWithoutSourceInput | ScrapedLinkCreateOrConnectWithoutSourceInput[]
    createMany?: ScrapedLinkCreateManySourceInputEnvelope
    connect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
  }

  export type ScrapeRunCreateNestedManyWithoutSourceInput = {
    create?: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput> | ScrapeRunCreateWithoutSourceInput[] | ScrapeRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutSourceInput | ScrapeRunCreateOrConnectWithoutSourceInput[]
    createMany?: ScrapeRunCreateManySourceInputEnvelope
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
  }

  export type ScrapedLinkUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput> | ScrapedLinkCreateWithoutSourceInput[] | ScrapedLinkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapedLinkCreateOrConnectWithoutSourceInput | ScrapedLinkCreateOrConnectWithoutSourceInput[]
    createMany?: ScrapedLinkCreateManySourceInputEnvelope
    connect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
  }

  export type ScrapeRunUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput> | ScrapeRunCreateWithoutSourceInput[] | ScrapeRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutSourceInput | ScrapeRunCreateOrConnectWithoutSourceInput[]
    createMany?: ScrapeRunCreateManySourceInputEnvelope
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
  }

  export type ScrapedLinkUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput> | ScrapedLinkCreateWithoutSourceInput[] | ScrapedLinkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapedLinkCreateOrConnectWithoutSourceInput | ScrapedLinkCreateOrConnectWithoutSourceInput[]
    upsert?: ScrapedLinkUpsertWithWhereUniqueWithoutSourceInput | ScrapedLinkUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ScrapedLinkCreateManySourceInputEnvelope
    set?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    disconnect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    delete?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    connect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    update?: ScrapedLinkUpdateWithWhereUniqueWithoutSourceInput | ScrapedLinkUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ScrapedLinkUpdateManyWithWhereWithoutSourceInput | ScrapedLinkUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ScrapedLinkScalarWhereInput | ScrapedLinkScalarWhereInput[]
  }

  export type ScrapeRunUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput> | ScrapeRunCreateWithoutSourceInput[] | ScrapeRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutSourceInput | ScrapeRunCreateOrConnectWithoutSourceInput[]
    upsert?: ScrapeRunUpsertWithWhereUniqueWithoutSourceInput | ScrapeRunUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ScrapeRunCreateManySourceInputEnvelope
    set?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    disconnect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    delete?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    update?: ScrapeRunUpdateWithWhereUniqueWithoutSourceInput | ScrapeRunUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ScrapeRunUpdateManyWithWhereWithoutSourceInput | ScrapeRunUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
  }

  export type ScrapedLinkUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput> | ScrapedLinkCreateWithoutSourceInput[] | ScrapedLinkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapedLinkCreateOrConnectWithoutSourceInput | ScrapedLinkCreateOrConnectWithoutSourceInput[]
    upsert?: ScrapedLinkUpsertWithWhereUniqueWithoutSourceInput | ScrapedLinkUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ScrapedLinkCreateManySourceInputEnvelope
    set?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    disconnect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    delete?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    connect?: ScrapedLinkWhereUniqueInput | ScrapedLinkWhereUniqueInput[]
    update?: ScrapedLinkUpdateWithWhereUniqueWithoutSourceInput | ScrapedLinkUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ScrapedLinkUpdateManyWithWhereWithoutSourceInput | ScrapedLinkUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ScrapedLinkScalarWhereInput | ScrapedLinkScalarWhereInput[]
  }

  export type ScrapeRunUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput> | ScrapeRunCreateWithoutSourceInput[] | ScrapeRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ScrapeRunCreateOrConnectWithoutSourceInput | ScrapeRunCreateOrConnectWithoutSourceInput[]
    upsert?: ScrapeRunUpsertWithWhereUniqueWithoutSourceInput | ScrapeRunUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ScrapeRunCreateManySourceInputEnvelope
    set?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    disconnect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    delete?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    connect?: ScrapeRunWhereUniqueInput | ScrapeRunWhereUniqueInput[]
    update?: ScrapeRunUpdateWithWhereUniqueWithoutSourceInput | ScrapeRunUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ScrapeRunUpdateManyWithWhereWithoutSourceInput | ScrapeRunUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
  }

  export type ScrapeSourceCreateNestedOneWithoutRunsInput = {
    create?: XOR<ScrapeSourceCreateWithoutRunsInput, ScrapeSourceUncheckedCreateWithoutRunsInput>
    connectOrCreate?: ScrapeSourceCreateOrConnectWithoutRunsInput
    connect?: ScrapeSourceWhereUniqueInput
  }

  export type ScrapeSourceUpdateOneRequiredWithoutRunsNestedInput = {
    create?: XOR<ScrapeSourceCreateWithoutRunsInput, ScrapeSourceUncheckedCreateWithoutRunsInput>
    connectOrCreate?: ScrapeSourceCreateOrConnectWithoutRunsInput
    upsert?: ScrapeSourceUpsertWithoutRunsInput
    connect?: ScrapeSourceWhereUniqueInput
    update?: XOR<XOR<ScrapeSourceUpdateToOneWithWhereWithoutRunsInput, ScrapeSourceUpdateWithoutRunsInput>, ScrapeSourceUncheckedUpdateWithoutRunsInput>
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

  export type ProductCreateWithoutMerchantInput = {
    id?: string
    title: string
  }

  export type ProductUncheckedCreateWithoutMerchantInput = {
    id?: string
    title: string
  }

  export type ProductCreateOrConnectWithoutMerchantInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput>
  }

  export type ProductCreateManyMerchantInputEnvelope = {
    data: ProductCreateManyMerchantInput | ProductCreateManyMerchantInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutMerchantInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutMerchantInput, ProductUncheckedUpdateWithoutMerchantInput>
    create: XOR<ProductCreateWithoutMerchantInput, ProductUncheckedCreateWithoutMerchantInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutMerchantInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutMerchantInput, ProductUncheckedUpdateWithoutMerchantInput>
  }

  export type ProductUpdateManyWithWhereWithoutMerchantInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutMerchantInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    title?: StringFilter<"Product"> | string
    merchantId?: StringFilter<"Product"> | string
  }

  export type MarketplaceMerchantCreateWithoutProductsInput = {
    id?: string
    name: string
    wrosMerchantId?: string | null
    createdAt?: Date | string
  }

  export type MarketplaceMerchantUncheckedCreateWithoutProductsInput = {
    id?: string
    name: string
    wrosMerchantId?: string | null
    createdAt?: Date | string
  }

  export type MarketplaceMerchantCreateOrConnectWithoutProductsInput = {
    where: MarketplaceMerchantWhereUniqueInput
    create: XOR<MarketplaceMerchantCreateWithoutProductsInput, MarketplaceMerchantUncheckedCreateWithoutProductsInput>
  }

  export type MarketplaceMerchantUpsertWithoutProductsInput = {
    update: XOR<MarketplaceMerchantUpdateWithoutProductsInput, MarketplaceMerchantUncheckedUpdateWithoutProductsInput>
    create: XOR<MarketplaceMerchantCreateWithoutProductsInput, MarketplaceMerchantUncheckedCreateWithoutProductsInput>
    where?: MarketplaceMerchantWhereInput
  }

  export type MarketplaceMerchantUpdateToOneWithWhereWithoutProductsInput = {
    where?: MarketplaceMerchantWhereInput
    data: XOR<MarketplaceMerchantUpdateWithoutProductsInput, MarketplaceMerchantUncheckedUpdateWithoutProductsInput>
  }

  export type MarketplaceMerchantUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketplaceMerchantUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wrosMerchantId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeSourceCreateWithoutItemsInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: ScrapeRunCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    runs?: ScrapeRunUncheckedCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceCreateOrConnectWithoutItemsInput = {
    where: ScrapeSourceWhereUniqueInput
    create: XOR<ScrapeSourceCreateWithoutItemsInput, ScrapeSourceUncheckedCreateWithoutItemsInput>
  }

  export type ScrapeSourceUpsertWithoutItemsInput = {
    update: XOR<ScrapeSourceUpdateWithoutItemsInput, ScrapeSourceUncheckedUpdateWithoutItemsInput>
    create: XOR<ScrapeSourceCreateWithoutItemsInput, ScrapeSourceUncheckedCreateWithoutItemsInput>
    where?: ScrapeSourceWhereInput
  }

  export type ScrapeSourceUpdateToOneWithWhereWithoutItemsInput = {
    where?: ScrapeSourceWhereInput
    data: XOR<ScrapeSourceUpdateWithoutItemsInput, ScrapeSourceUncheckedUpdateWithoutItemsInput>
  }

  export type ScrapeSourceUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: ScrapeRunUpdateManyWithoutSourceNestedInput
  }

  export type ScrapeSourceUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    runs?: ScrapeRunUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type ScrapedLinkCreateWithoutSourceInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapedLinkUncheckedCreateWithoutSourceInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapedLinkCreateOrConnectWithoutSourceInput = {
    where: ScrapedLinkWhereUniqueInput
    create: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput>
  }

  export type ScrapedLinkCreateManySourceInputEnvelope = {
    data: ScrapedLinkCreateManySourceInput | ScrapedLinkCreateManySourceInput[]
    skipDuplicates?: boolean
  }

  export type ScrapeRunCreateWithoutSourceInput = {
    id?: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScrapeRunUncheckedCreateWithoutSourceInput = {
    id?: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScrapeRunCreateOrConnectWithoutSourceInput = {
    where: ScrapeRunWhereUniqueInput
    create: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput>
  }

  export type ScrapeRunCreateManySourceInputEnvelope = {
    data: ScrapeRunCreateManySourceInput | ScrapeRunCreateManySourceInput[]
    skipDuplicates?: boolean
  }

  export type ScrapedLinkUpsertWithWhereUniqueWithoutSourceInput = {
    where: ScrapedLinkWhereUniqueInput
    update: XOR<ScrapedLinkUpdateWithoutSourceInput, ScrapedLinkUncheckedUpdateWithoutSourceInput>
    create: XOR<ScrapedLinkCreateWithoutSourceInput, ScrapedLinkUncheckedCreateWithoutSourceInput>
  }

  export type ScrapedLinkUpdateWithWhereUniqueWithoutSourceInput = {
    where: ScrapedLinkWhereUniqueInput
    data: XOR<ScrapedLinkUpdateWithoutSourceInput, ScrapedLinkUncheckedUpdateWithoutSourceInput>
  }

  export type ScrapedLinkUpdateManyWithWhereWithoutSourceInput = {
    where: ScrapedLinkScalarWhereInput
    data: XOR<ScrapedLinkUpdateManyMutationInput, ScrapedLinkUncheckedUpdateManyWithoutSourceInput>
  }

  export type ScrapedLinkScalarWhereInput = {
    AND?: ScrapedLinkScalarWhereInput | ScrapedLinkScalarWhereInput[]
    OR?: ScrapedLinkScalarWhereInput[]
    NOT?: ScrapedLinkScalarWhereInput | ScrapedLinkScalarWhereInput[]
    id?: StringFilter<"ScrapedLink"> | string
    url?: StringFilter<"ScrapedLink"> | string
    sourceHost?: StringFilter<"ScrapedLink"> | string
    title?: StringFilter<"ScrapedLink"> | string
    description?: StringNullableFilter<"ScrapedLink"> | string | null
    imageUrl?: StringNullableFilter<"ScrapedLink"> | string | null
    tenantId?: StringNullableFilter<"ScrapedLink"> | string | null
    merchantName?: StringNullableFilter<"ScrapedLink"> | string | null
    companyName?: StringNullableFilter<"ScrapedLink"> | string | null
    contactEmail?: StringNullableFilter<"ScrapedLink"> | string | null
    contactPhone?: StringNullableFilter<"ScrapedLink"> | string | null
    status?: StringFilter<"ScrapedLink"> | string
    priority?: BoolFilter<"ScrapedLink"> | boolean
    claimedBy?: StringNullableFilter<"ScrapedLink"> | string | null
    claimedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    rehomedAt?: DateTimeNullableFilter<"ScrapedLink"> | Date | string | null
    listingFeePence?: IntFilter<"ScrapedLink"> | number
    placementFeePence?: IntFilter<"ScrapedLink"> | number
    deliveryFeePence?: IntFilter<"ScrapedLink"> | number
    premiumFeePence?: IntFilter<"ScrapedLink"> | number
    wrosLeadId?: StringNullableFilter<"ScrapedLink"> | string | null
    sourceId?: StringNullableFilter<"ScrapedLink"> | string | null
    scrapedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapedLink"> | Date | string
  }

  export type ScrapeRunUpsertWithWhereUniqueWithoutSourceInput = {
    where: ScrapeRunWhereUniqueInput
    update: XOR<ScrapeRunUpdateWithoutSourceInput, ScrapeRunUncheckedUpdateWithoutSourceInput>
    create: XOR<ScrapeRunCreateWithoutSourceInput, ScrapeRunUncheckedCreateWithoutSourceInput>
  }

  export type ScrapeRunUpdateWithWhereUniqueWithoutSourceInput = {
    where: ScrapeRunWhereUniqueInput
    data: XOR<ScrapeRunUpdateWithoutSourceInput, ScrapeRunUncheckedUpdateWithoutSourceInput>
  }

  export type ScrapeRunUpdateManyWithWhereWithoutSourceInput = {
    where: ScrapeRunScalarWhereInput
    data: XOR<ScrapeRunUpdateManyMutationInput, ScrapeRunUncheckedUpdateManyWithoutSourceInput>
  }

  export type ScrapeRunScalarWhereInput = {
    AND?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
    OR?: ScrapeRunScalarWhereInput[]
    NOT?: ScrapeRunScalarWhereInput | ScrapeRunScalarWhereInput[]
    id?: StringFilter<"ScrapeRun"> | string
    sourceId?: StringFilter<"ScrapeRun"> | string
    status?: StringFilter<"ScrapeRun"> | string
    discovered?: IntFilter<"ScrapeRun"> | number
    ingested?: IntFilter<"ScrapeRun"> | number
    leadsPushed?: IntFilter<"ScrapeRun"> | number
    errors?: JsonNullableFilter<"ScrapeRun">
    startedAt?: DateTimeFilter<"ScrapeRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"ScrapeRun"> | Date | string | null
  }

  export type ScrapeSourceCreateWithoutRunsInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ScrapedLinkCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceUncheckedCreateWithoutRunsInput = {
    id?: string
    name: string
    category: string
    url: string
    active?: boolean
    tenantId?: string | null
    intervalMinutes?: number
    maxItemsPerRun?: number
    itemSelector?: string | null
    linkSelector?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    nextRunAt?: Date | string
    lastRunAt?: Date | string | null
    lastSuccessAt?: Date | string | null
    lastError?: string | null
    consecutiveFailures?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ScrapedLinkUncheckedCreateNestedManyWithoutSourceInput
  }

  export type ScrapeSourceCreateOrConnectWithoutRunsInput = {
    where: ScrapeSourceWhereUniqueInput
    create: XOR<ScrapeSourceCreateWithoutRunsInput, ScrapeSourceUncheckedCreateWithoutRunsInput>
  }

  export type ScrapeSourceUpsertWithoutRunsInput = {
    update: XOR<ScrapeSourceUpdateWithoutRunsInput, ScrapeSourceUncheckedUpdateWithoutRunsInput>
    create: XOR<ScrapeSourceCreateWithoutRunsInput, ScrapeSourceUncheckedCreateWithoutRunsInput>
    where?: ScrapeSourceWhereInput
  }

  export type ScrapeSourceUpdateToOneWithWhereWithoutRunsInput = {
    where?: ScrapeSourceWhereInput
    data: XOR<ScrapeSourceUpdateWithoutRunsInput, ScrapeSourceUncheckedUpdateWithoutRunsInput>
  }

  export type ScrapeSourceUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ScrapedLinkUpdateManyWithoutSourceNestedInput
  }

  export type ScrapeSourceUncheckedUpdateWithoutRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    intervalMinutes?: IntFieldUpdateOperationsInput | number
    maxItemsPerRun?: IntFieldUpdateOperationsInput | number
    itemSelector?: NullableStringFieldUpdateOperationsInput | string | null
    linkSelector?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    nextRunAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSuccessAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    consecutiveFailures?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ScrapedLinkUncheckedUpdateManyWithoutSourceNestedInput
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

  export type ProductCreateManyMerchantInput = {
    id?: string
    title: string
  }

  export type ProductUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
  }

  export type ProductUncheckedUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
  }

  export type ProductUncheckedUpdateManyWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
  }

  export type ScrapedLinkCreateManySourceInput = {
    id?: string
    url: string
    sourceHost: string
    title: string
    description?: string | null
    imageUrl?: string | null
    tenantId?: string | null
    merchantName?: string | null
    companyName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    status?: string
    priority?: boolean
    claimedBy?: string | null
    claimedAt?: Date | string | null
    rehomedAt?: Date | string | null
    listingFeePence?: number
    placementFeePence?: number
    deliveryFeePence?: number
    premiumFeePence?: number
    wrosLeadId?: string | null
    scrapedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapeRunCreateManySourceInput = {
    id?: string
    status?: string
    discovered?: number
    ingested?: number
    leadsPushed?: number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ScrapedLinkUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapedLinkUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapedLinkUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    sourceHost?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    merchantName?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rehomedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listingFeePence?: IntFieldUpdateOperationsInput | number
    placementFeePence?: IntFieldUpdateOperationsInput | number
    deliveryFeePence?: IntFieldUpdateOperationsInput | number
    premiumFeePence?: IntFieldUpdateOperationsInput | number
    wrosLeadId?: NullableStringFieldUpdateOperationsInput | string | null
    scrapedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeRunUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScrapeRunUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    discovered?: IntFieldUpdateOperationsInput | number
    ingested?: IntFieldUpdateOperationsInput | number
    leadsPushed?: IntFieldUpdateOperationsInput | number
    errors?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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