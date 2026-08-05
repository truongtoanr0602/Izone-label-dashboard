
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model class_daily_snapshots
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type class_daily_snapshots = $Result.DefaultSelection<Prisma.$class_daily_snapshotsPayload>
/**
 * Model classes
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type classes = $Result.DefaultSelection<Prisma.$classesPayload>
/**
 * Model label_change_logs
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type label_change_logs = $Result.DefaultSelection<Prisma.$label_change_logsPayload>
/**
 * Model pass_reviews
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type pass_reviews = $Result.DefaultSelection<Prisma.$pass_reviewsPayload>
/**
 * Model student_daily_records
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type student_daily_records = $Result.DefaultSelection<Prisma.$student_daily_recordsPayload>
/**
 * Model students
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type students = $Result.DefaultSelection<Prisma.$studentsPayload>
/**
 * Model system_configs
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type system_configs = $Result.DefaultSelection<Prisma.$system_configsPayload>
/**
 * Model system_logs
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type system_logs = $Result.DefaultSelection<Prisma.$system_logsPayload>
/**
 * Model teachers
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type teachers = $Result.DefaultSelection<Prisma.$teachersPayload>
/**
 * Model test_scores
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type test_scores = $Result.DefaultSelection<Prisma.$test_scoresPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Class_daily_snapshots
 * const class_daily_snapshots = await prisma.class_daily_snapshots.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Class_daily_snapshots
   * const class_daily_snapshots = await prisma.class_daily_snapshots.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.class_daily_snapshots`: Exposes CRUD operations for the **class_daily_snapshots** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Class_daily_snapshots
    * const class_daily_snapshots = await prisma.class_daily_snapshots.findMany()
    * ```
    */
  get class_daily_snapshots(): Prisma.class_daily_snapshotsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.classes`: Exposes CRUD operations for the **classes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Classes
    * const classes = await prisma.classes.findMany()
    * ```
    */
  get classes(): Prisma.classesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.label_change_logs`: Exposes CRUD operations for the **label_change_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Label_change_logs
    * const label_change_logs = await prisma.label_change_logs.findMany()
    * ```
    */
  get label_change_logs(): Prisma.label_change_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pass_reviews`: Exposes CRUD operations for the **pass_reviews** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pass_reviews
    * const pass_reviews = await prisma.pass_reviews.findMany()
    * ```
    */
  get pass_reviews(): Prisma.pass_reviewsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.student_daily_records`: Exposes CRUD operations for the **student_daily_records** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Student_daily_records
    * const student_daily_records = await prisma.student_daily_records.findMany()
    * ```
    */
  get student_daily_records(): Prisma.student_daily_recordsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.students`: Exposes CRUD operations for the **students** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.students.findMany()
    * ```
    */
  get students(): Prisma.studentsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.system_configs`: Exposes CRUD operations for the **system_configs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more System_configs
    * const system_configs = await prisma.system_configs.findMany()
    * ```
    */
  get system_configs(): Prisma.system_configsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.system_logs`: Exposes CRUD operations for the **system_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more System_logs
    * const system_logs = await prisma.system_logs.findMany()
    * ```
    */
  get system_logs(): Prisma.system_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teachers`: Exposes CRUD operations for the **teachers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teachers
    * const teachers = await prisma.teachers.findMany()
    * ```
    */
  get teachers(): Prisma.teachersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.test_scores`: Exposes CRUD operations for the **test_scores** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Test_scores
    * const test_scores = await prisma.test_scores.findMany()
    * ```
    */
  get test_scores(): Prisma.test_scoresDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

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
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
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
    class_daily_snapshots: 'class_daily_snapshots',
    classes: 'classes',
    label_change_logs: 'label_change_logs',
    pass_reviews: 'pass_reviews',
    student_daily_records: 'student_daily_records',
    students: 'students',
    system_configs: 'system_configs',
    system_logs: 'system_logs',
    teachers: 'teachers',
    test_scores: 'test_scores'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "class_daily_snapshots" | "classes" | "label_change_logs" | "pass_reviews" | "student_daily_records" | "students" | "system_configs" | "system_logs" | "teachers" | "test_scores"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      class_daily_snapshots: {
        payload: Prisma.$class_daily_snapshotsPayload<ExtArgs>
        fields: Prisma.class_daily_snapshotsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.class_daily_snapshotsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.class_daily_snapshotsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          findFirst: {
            args: Prisma.class_daily_snapshotsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.class_daily_snapshotsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          findMany: {
            args: Prisma.class_daily_snapshotsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>[]
          }
          create: {
            args: Prisma.class_daily_snapshotsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          createMany: {
            args: Prisma.class_daily_snapshotsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.class_daily_snapshotsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>[]
          }
          delete: {
            args: Prisma.class_daily_snapshotsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          update: {
            args: Prisma.class_daily_snapshotsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          deleteMany: {
            args: Prisma.class_daily_snapshotsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.class_daily_snapshotsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.class_daily_snapshotsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>[]
          }
          upsert: {
            args: Prisma.class_daily_snapshotsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$class_daily_snapshotsPayload>
          }
          aggregate: {
            args: Prisma.Class_daily_snapshotsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClass_daily_snapshots>
          }
          groupBy: {
            args: Prisma.class_daily_snapshotsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Class_daily_snapshotsGroupByOutputType>[]
          }
          count: {
            args: Prisma.class_daily_snapshotsCountArgs<ExtArgs>
            result: $Utils.Optional<Class_daily_snapshotsCountAggregateOutputType> | number
          }
        }
      }
      classes: {
        payload: Prisma.$classesPayload<ExtArgs>
        fields: Prisma.classesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.classesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.classesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          findFirst: {
            args: Prisma.classesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.classesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          findMany: {
            args: Prisma.classesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>[]
          }
          create: {
            args: Prisma.classesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          createMany: {
            args: Prisma.classesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.classesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>[]
          }
          delete: {
            args: Prisma.classesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          update: {
            args: Prisma.classesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          deleteMany: {
            args: Prisma.classesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.classesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.classesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>[]
          }
          upsert: {
            args: Prisma.classesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$classesPayload>
          }
          aggregate: {
            args: Prisma.ClassesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClasses>
          }
          groupBy: {
            args: Prisma.classesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassesGroupByOutputType>[]
          }
          count: {
            args: Prisma.classesCountArgs<ExtArgs>
            result: $Utils.Optional<ClassesCountAggregateOutputType> | number
          }
        }
      }
      label_change_logs: {
        payload: Prisma.$label_change_logsPayload<ExtArgs>
        fields: Prisma.label_change_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.label_change_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.label_change_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          findFirst: {
            args: Prisma.label_change_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.label_change_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          findMany: {
            args: Prisma.label_change_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>[]
          }
          create: {
            args: Prisma.label_change_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          createMany: {
            args: Prisma.label_change_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.label_change_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>[]
          }
          delete: {
            args: Prisma.label_change_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          update: {
            args: Prisma.label_change_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          deleteMany: {
            args: Prisma.label_change_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.label_change_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.label_change_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>[]
          }
          upsert: {
            args: Prisma.label_change_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$label_change_logsPayload>
          }
          aggregate: {
            args: Prisma.Label_change_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabel_change_logs>
          }
          groupBy: {
            args: Prisma.label_change_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Label_change_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.label_change_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Label_change_logsCountAggregateOutputType> | number
          }
        }
      }
      pass_reviews: {
        payload: Prisma.$pass_reviewsPayload<ExtArgs>
        fields: Prisma.pass_reviewsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pass_reviewsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pass_reviewsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          findFirst: {
            args: Prisma.pass_reviewsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pass_reviewsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          findMany: {
            args: Prisma.pass_reviewsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>[]
          }
          create: {
            args: Prisma.pass_reviewsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          createMany: {
            args: Prisma.pass_reviewsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.pass_reviewsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>[]
          }
          delete: {
            args: Prisma.pass_reviewsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          update: {
            args: Prisma.pass_reviewsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          deleteMany: {
            args: Prisma.pass_reviewsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pass_reviewsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.pass_reviewsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>[]
          }
          upsert: {
            args: Prisma.pass_reviewsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pass_reviewsPayload>
          }
          aggregate: {
            args: Prisma.Pass_reviewsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePass_reviews>
          }
          groupBy: {
            args: Prisma.pass_reviewsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Pass_reviewsGroupByOutputType>[]
          }
          count: {
            args: Prisma.pass_reviewsCountArgs<ExtArgs>
            result: $Utils.Optional<Pass_reviewsCountAggregateOutputType> | number
          }
        }
      }
      student_daily_records: {
        payload: Prisma.$student_daily_recordsPayload<ExtArgs>
        fields: Prisma.student_daily_recordsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.student_daily_recordsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.student_daily_recordsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          findFirst: {
            args: Prisma.student_daily_recordsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.student_daily_recordsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          findMany: {
            args: Prisma.student_daily_recordsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>[]
          }
          create: {
            args: Prisma.student_daily_recordsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          createMany: {
            args: Prisma.student_daily_recordsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.student_daily_recordsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>[]
          }
          delete: {
            args: Prisma.student_daily_recordsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          update: {
            args: Prisma.student_daily_recordsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          deleteMany: {
            args: Prisma.student_daily_recordsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.student_daily_recordsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.student_daily_recordsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>[]
          }
          upsert: {
            args: Prisma.student_daily_recordsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$student_daily_recordsPayload>
          }
          aggregate: {
            args: Prisma.Student_daily_recordsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent_daily_records>
          }
          groupBy: {
            args: Prisma.student_daily_recordsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Student_daily_recordsGroupByOutputType>[]
          }
          count: {
            args: Prisma.student_daily_recordsCountArgs<ExtArgs>
            result: $Utils.Optional<Student_daily_recordsCountAggregateOutputType> | number
          }
        }
      }
      students: {
        payload: Prisma.$studentsPayload<ExtArgs>
        fields: Prisma.studentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.studentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.studentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          findFirst: {
            args: Prisma.studentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.studentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          findMany: {
            args: Prisma.studentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>[]
          }
          create: {
            args: Prisma.studentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          createMany: {
            args: Prisma.studentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.studentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>[]
          }
          delete: {
            args: Prisma.studentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          update: {
            args: Prisma.studentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          deleteMany: {
            args: Prisma.studentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.studentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.studentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>[]
          }
          upsert: {
            args: Prisma.studentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$studentsPayload>
          }
          aggregate: {
            args: Prisma.StudentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudents>
          }
          groupBy: {
            args: Prisma.studentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.studentsCountArgs<ExtArgs>
            result: $Utils.Optional<StudentsCountAggregateOutputType> | number
          }
        }
      }
      system_configs: {
        payload: Prisma.$system_configsPayload<ExtArgs>
        fields: Prisma.system_configsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.system_configsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.system_configsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          findFirst: {
            args: Prisma.system_configsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.system_configsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          findMany: {
            args: Prisma.system_configsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>[]
          }
          create: {
            args: Prisma.system_configsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          createMany: {
            args: Prisma.system_configsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.system_configsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>[]
          }
          delete: {
            args: Prisma.system_configsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          update: {
            args: Prisma.system_configsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          deleteMany: {
            args: Prisma.system_configsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.system_configsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.system_configsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>[]
          }
          upsert: {
            args: Prisma.system_configsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_configsPayload>
          }
          aggregate: {
            args: Prisma.System_configsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystem_configs>
          }
          groupBy: {
            args: Prisma.system_configsGroupByArgs<ExtArgs>
            result: $Utils.Optional<System_configsGroupByOutputType>[]
          }
          count: {
            args: Prisma.system_configsCountArgs<ExtArgs>
            result: $Utils.Optional<System_configsCountAggregateOutputType> | number
          }
        }
      }
      system_logs: {
        payload: Prisma.$system_logsPayload<ExtArgs>
        fields: Prisma.system_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.system_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.system_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          findFirst: {
            args: Prisma.system_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.system_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          findMany: {
            args: Prisma.system_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>[]
          }
          create: {
            args: Prisma.system_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          createMany: {
            args: Prisma.system_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.system_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>[]
          }
          delete: {
            args: Prisma.system_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          update: {
            args: Prisma.system_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          deleteMany: {
            args: Prisma.system_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.system_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.system_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>[]
          }
          upsert: {
            args: Prisma.system_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$system_logsPayload>
          }
          aggregate: {
            args: Prisma.System_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystem_logs>
          }
          groupBy: {
            args: Prisma.system_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<System_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.system_logsCountArgs<ExtArgs>
            result: $Utils.Optional<System_logsCountAggregateOutputType> | number
          }
        }
      }
      teachers: {
        payload: Prisma.$teachersPayload<ExtArgs>
        fields: Prisma.teachersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.teachersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.teachersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          findFirst: {
            args: Prisma.teachersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.teachersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          findMany: {
            args: Prisma.teachersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>[]
          }
          create: {
            args: Prisma.teachersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          createMany: {
            args: Prisma.teachersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.teachersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>[]
          }
          delete: {
            args: Prisma.teachersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          update: {
            args: Prisma.teachersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          deleteMany: {
            args: Prisma.teachersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.teachersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.teachersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>[]
          }
          upsert: {
            args: Prisma.teachersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$teachersPayload>
          }
          aggregate: {
            args: Prisma.TeachersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeachers>
          }
          groupBy: {
            args: Prisma.teachersGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeachersGroupByOutputType>[]
          }
          count: {
            args: Prisma.teachersCountArgs<ExtArgs>
            result: $Utils.Optional<TeachersCountAggregateOutputType> | number
          }
        }
      }
      test_scores: {
        payload: Prisma.$test_scoresPayload<ExtArgs>
        fields: Prisma.test_scoresFieldRefs
        operations: {
          findUnique: {
            args: Prisma.test_scoresFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.test_scoresFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          findFirst: {
            args: Prisma.test_scoresFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.test_scoresFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          findMany: {
            args: Prisma.test_scoresFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>[]
          }
          create: {
            args: Prisma.test_scoresCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          createMany: {
            args: Prisma.test_scoresCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.test_scoresCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>[]
          }
          delete: {
            args: Prisma.test_scoresDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          update: {
            args: Prisma.test_scoresUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          deleteMany: {
            args: Prisma.test_scoresDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.test_scoresUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.test_scoresUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>[]
          }
          upsert: {
            args: Prisma.test_scoresUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$test_scoresPayload>
          }
          aggregate: {
            args: Prisma.Test_scoresAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTest_scores>
          }
          groupBy: {
            args: Prisma.test_scoresGroupByArgs<ExtArgs>
            result: $Utils.Optional<Test_scoresGroupByOutputType>[]
          }
          count: {
            args: Prisma.test_scoresCountArgs<ExtArgs>
            result: $Utils.Optional<Test_scoresCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    class_daily_snapshots?: class_daily_snapshotsOmit
    classes?: classesOmit
    label_change_logs?: label_change_logsOmit
    pass_reviews?: pass_reviewsOmit
    student_daily_records?: student_daily_recordsOmit
    students?: studentsOmit
    system_configs?: system_configsOmit
    system_logs?: system_logsOmit
    teachers?: teachersOmit
    test_scores?: test_scoresOmit
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
   * Count Type ClassesCountOutputType
   */

  export type ClassesCountOutputType = {
    class_daily_snapshots: number
    label_change_logs: number
    pass_reviews: number
    student_daily_records: number
    students: number
    test_scores: number
  }

  export type ClassesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    class_daily_snapshots?: boolean | ClassesCountOutputTypeCountClass_daily_snapshotsArgs
    label_change_logs?: boolean | ClassesCountOutputTypeCountLabel_change_logsArgs
    pass_reviews?: boolean | ClassesCountOutputTypeCountPass_reviewsArgs
    student_daily_records?: boolean | ClassesCountOutputTypeCountStudent_daily_recordsArgs
    students?: boolean | ClassesCountOutputTypeCountStudentsArgs
    test_scores?: boolean | ClassesCountOutputTypeCountTest_scoresArgs
  }

  // Custom InputTypes
  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassesCountOutputType
     */
    select?: ClassesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountClass_daily_snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: class_daily_snapshotsWhereInput
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountLabel_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: label_change_logsWhereInput
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountPass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pass_reviewsWhereInput
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountStudent_daily_recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: student_daily_recordsWhereInput
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: studentsWhereInput
  }

  /**
   * ClassesCountOutputType without action
   */
  export type ClassesCountOutputTypeCountTest_scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: test_scoresWhereInput
  }


  /**
   * Count Type StudentsCountOutputType
   */

  export type StudentsCountOutputType = {
    label_change_logs: number
    pass_reviews: number
    student_daily_records: number
    test_scores: number
  }

  export type StudentsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    label_change_logs?: boolean | StudentsCountOutputTypeCountLabel_change_logsArgs
    pass_reviews?: boolean | StudentsCountOutputTypeCountPass_reviewsArgs
    student_daily_records?: boolean | StudentsCountOutputTypeCountStudent_daily_recordsArgs
    test_scores?: boolean | StudentsCountOutputTypeCountTest_scoresArgs
  }

  // Custom InputTypes
  /**
   * StudentsCountOutputType without action
   */
  export type StudentsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentsCountOutputType
     */
    select?: StudentsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentsCountOutputType without action
   */
  export type StudentsCountOutputTypeCountLabel_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: label_change_logsWhereInput
  }

  /**
   * StudentsCountOutputType without action
   */
  export type StudentsCountOutputTypeCountPass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pass_reviewsWhereInput
  }

  /**
   * StudentsCountOutputType without action
   */
  export type StudentsCountOutputTypeCountStudent_daily_recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: student_daily_recordsWhereInput
  }

  /**
   * StudentsCountOutputType without action
   */
  export type StudentsCountOutputTypeCountTest_scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: test_scoresWhereInput
  }


  /**
   * Count Type TeachersCountOutputType
   */

  export type TeachersCountOutputType = {
    classes: number
    label_change_logs: number
    pass_reviews: number
  }

  export type TeachersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | TeachersCountOutputTypeCountClassesArgs
    label_change_logs?: boolean | TeachersCountOutputTypeCountLabel_change_logsArgs
    pass_reviews?: boolean | TeachersCountOutputTypeCountPass_reviewsArgs
  }

  // Custom InputTypes
  /**
   * TeachersCountOutputType without action
   */
  export type TeachersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeachersCountOutputType
     */
    select?: TeachersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeachersCountOutputType without action
   */
  export type TeachersCountOutputTypeCountClassesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: classesWhereInput
  }

  /**
   * TeachersCountOutputType without action
   */
  export type TeachersCountOutputTypeCountLabel_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: label_change_logsWhereInput
  }

  /**
   * TeachersCountOutputType without action
   */
  export type TeachersCountOutputTypeCountPass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pass_reviewsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model class_daily_snapshots
   */

  export type AggregateClass_daily_snapshots = {
    _count: Class_daily_snapshotsCountAggregateOutputType | null
    _avg: Class_daily_snapshotsAvgAggregateOutputType | null
    _sum: Class_daily_snapshotsSumAggregateOutputType | null
    _min: Class_daily_snapshotsMinAggregateOutputType | null
    _max: Class_daily_snapshotsMaxAggregateOutputType | null
  }

  export type Class_daily_snapshotsAvgAggregateOutputType = {
    id: number | null
    class_id: number | null
    completed_sessions: number | null
    progress_pct: Decimal | null
    active_students: number | null
    on_hold_students: number | null
    dropped_students: number | null
    transferred_students: number | null
    attendance_avg: Decimal | null
    homework_avg: Decimal | null
    pass_chuan_rate: Decimal | null
    pass_mem_rate: Decimal | null
    label_yellow: number | null
    label_red: number | null
    label_grey: number | null
    label_no_data: number | null
    risk_pct: Decimal | null
  }

  export type Class_daily_snapshotsSumAggregateOutputType = {
    id: bigint | null
    class_id: number | null
    completed_sessions: number | null
    progress_pct: Decimal | null
    active_students: number | null
    on_hold_students: number | null
    dropped_students: number | null
    transferred_students: number | null
    attendance_avg: Decimal | null
    homework_avg: Decimal | null
    pass_chuan_rate: Decimal | null
    pass_mem_rate: Decimal | null
    label_yellow: number | null
    label_red: number | null
    label_grey: number | null
    label_no_data: number | null
    risk_pct: Decimal | null
  }

  export type Class_daily_snapshotsMinAggregateOutputType = {
    id: bigint | null
    class_id: number | null
    snapshot_date: Date | null
    completed_sessions: number | null
    progress_pct: Decimal | null
    active_students: number | null
    on_hold_students: number | null
    dropped_students: number | null
    transferred_students: number | null
    attendance_avg: Decimal | null
    homework_avg: Decimal | null
    pass_chuan_rate: Decimal | null
    pass_mem_rate: Decimal | null
    label_yellow: number | null
    label_red: number | null
    label_grey: number | null
    label_no_data: number | null
    risk_pct: Decimal | null
    is_alarm_triggered: boolean | null
    health_status: string | null
    scraped_at: Date | null
  }

  export type Class_daily_snapshotsMaxAggregateOutputType = {
    id: bigint | null
    class_id: number | null
    snapshot_date: Date | null
    completed_sessions: number | null
    progress_pct: Decimal | null
    active_students: number | null
    on_hold_students: number | null
    dropped_students: number | null
    transferred_students: number | null
    attendance_avg: Decimal | null
    homework_avg: Decimal | null
    pass_chuan_rate: Decimal | null
    pass_mem_rate: Decimal | null
    label_yellow: number | null
    label_red: number | null
    label_grey: number | null
    label_no_data: number | null
    risk_pct: Decimal | null
    is_alarm_triggered: boolean | null
    health_status: string | null
    scraped_at: Date | null
  }

  export type Class_daily_snapshotsCountAggregateOutputType = {
    id: number
    class_id: number
    snapshot_date: number
    completed_sessions: number
    progress_pct: number
    active_students: number
    on_hold_students: number
    dropped_students: number
    transferred_students: number
    attendance_avg: number
    homework_avg: number
    pass_chuan_rate: number
    pass_mem_rate: number
    label_yellow: number
    label_red: number
    label_grey: number
    label_no_data: number
    risk_pct: number
    is_alarm_triggered: number
    health_status: number
    scraped_at: number
    _all: number
  }


  export type Class_daily_snapshotsAvgAggregateInputType = {
    id?: true
    class_id?: true
    completed_sessions?: true
    progress_pct?: true
    active_students?: true
    on_hold_students?: true
    dropped_students?: true
    transferred_students?: true
    attendance_avg?: true
    homework_avg?: true
    pass_chuan_rate?: true
    pass_mem_rate?: true
    label_yellow?: true
    label_red?: true
    label_grey?: true
    label_no_data?: true
    risk_pct?: true
  }

  export type Class_daily_snapshotsSumAggregateInputType = {
    id?: true
    class_id?: true
    completed_sessions?: true
    progress_pct?: true
    active_students?: true
    on_hold_students?: true
    dropped_students?: true
    transferred_students?: true
    attendance_avg?: true
    homework_avg?: true
    pass_chuan_rate?: true
    pass_mem_rate?: true
    label_yellow?: true
    label_red?: true
    label_grey?: true
    label_no_data?: true
    risk_pct?: true
  }

  export type Class_daily_snapshotsMinAggregateInputType = {
    id?: true
    class_id?: true
    snapshot_date?: true
    completed_sessions?: true
    progress_pct?: true
    active_students?: true
    on_hold_students?: true
    dropped_students?: true
    transferred_students?: true
    attendance_avg?: true
    homework_avg?: true
    pass_chuan_rate?: true
    pass_mem_rate?: true
    label_yellow?: true
    label_red?: true
    label_grey?: true
    label_no_data?: true
    risk_pct?: true
    is_alarm_triggered?: true
    health_status?: true
    scraped_at?: true
  }

  export type Class_daily_snapshotsMaxAggregateInputType = {
    id?: true
    class_id?: true
    snapshot_date?: true
    completed_sessions?: true
    progress_pct?: true
    active_students?: true
    on_hold_students?: true
    dropped_students?: true
    transferred_students?: true
    attendance_avg?: true
    homework_avg?: true
    pass_chuan_rate?: true
    pass_mem_rate?: true
    label_yellow?: true
    label_red?: true
    label_grey?: true
    label_no_data?: true
    risk_pct?: true
    is_alarm_triggered?: true
    health_status?: true
    scraped_at?: true
  }

  export type Class_daily_snapshotsCountAggregateInputType = {
    id?: true
    class_id?: true
    snapshot_date?: true
    completed_sessions?: true
    progress_pct?: true
    active_students?: true
    on_hold_students?: true
    dropped_students?: true
    transferred_students?: true
    attendance_avg?: true
    homework_avg?: true
    pass_chuan_rate?: true
    pass_mem_rate?: true
    label_yellow?: true
    label_red?: true
    label_grey?: true
    label_no_data?: true
    risk_pct?: true
    is_alarm_triggered?: true
    health_status?: true
    scraped_at?: true
    _all?: true
  }

  export type Class_daily_snapshotsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which class_daily_snapshots to aggregate.
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of class_daily_snapshots to fetch.
     */
    orderBy?: class_daily_snapshotsOrderByWithRelationInput | class_daily_snapshotsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: class_daily_snapshotsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` class_daily_snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` class_daily_snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned class_daily_snapshots
    **/
    _count?: true | Class_daily_snapshotsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Class_daily_snapshotsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Class_daily_snapshotsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Class_daily_snapshotsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Class_daily_snapshotsMaxAggregateInputType
  }

  export type GetClass_daily_snapshotsAggregateType<T extends Class_daily_snapshotsAggregateArgs> = {
        [P in keyof T & keyof AggregateClass_daily_snapshots]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClass_daily_snapshots[P]>
      : GetScalarType<T[P], AggregateClass_daily_snapshots[P]>
  }




  export type class_daily_snapshotsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: class_daily_snapshotsWhereInput
    orderBy?: class_daily_snapshotsOrderByWithAggregationInput | class_daily_snapshotsOrderByWithAggregationInput[]
    by: Class_daily_snapshotsScalarFieldEnum[] | Class_daily_snapshotsScalarFieldEnum
    having?: class_daily_snapshotsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Class_daily_snapshotsCountAggregateInputType | true
    _avg?: Class_daily_snapshotsAvgAggregateInputType
    _sum?: Class_daily_snapshotsSumAggregateInputType
    _min?: Class_daily_snapshotsMinAggregateInputType
    _max?: Class_daily_snapshotsMaxAggregateInputType
  }

  export type Class_daily_snapshotsGroupByOutputType = {
    id: bigint
    class_id: number
    snapshot_date: Date
    completed_sessions: number
    progress_pct: Decimal | null
    active_students: number
    on_hold_students: number
    dropped_students: number
    transferred_students: number
    attendance_avg: Decimal | null
    homework_avg: Decimal | null
    pass_chuan_rate: Decimal | null
    pass_mem_rate: Decimal | null
    label_yellow: number
    label_red: number
    label_grey: number
    label_no_data: number
    risk_pct: Decimal | null
    is_alarm_triggered: boolean
    health_status: string | null
    scraped_at: Date
    _count: Class_daily_snapshotsCountAggregateOutputType | null
    _avg: Class_daily_snapshotsAvgAggregateOutputType | null
    _sum: Class_daily_snapshotsSumAggregateOutputType | null
    _min: Class_daily_snapshotsMinAggregateOutputType | null
    _max: Class_daily_snapshotsMaxAggregateOutputType | null
  }

  type GetClass_daily_snapshotsGroupByPayload<T extends class_daily_snapshotsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Class_daily_snapshotsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Class_daily_snapshotsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Class_daily_snapshotsGroupByOutputType[P]>
            : GetScalarType<T[P], Class_daily_snapshotsGroupByOutputType[P]>
        }
      >
    >


  export type class_daily_snapshotsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    class_id?: boolean
    snapshot_date?: boolean
    completed_sessions?: boolean
    progress_pct?: boolean
    active_students?: boolean
    on_hold_students?: boolean
    dropped_students?: boolean
    transferred_students?: boolean
    attendance_avg?: boolean
    homework_avg?: boolean
    pass_chuan_rate?: boolean
    pass_mem_rate?: boolean
    label_yellow?: boolean
    label_red?: boolean
    label_grey?: boolean
    label_no_data?: boolean
    risk_pct?: boolean
    is_alarm_triggered?: boolean
    health_status?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["class_daily_snapshots"]>

  export type class_daily_snapshotsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    class_id?: boolean
    snapshot_date?: boolean
    completed_sessions?: boolean
    progress_pct?: boolean
    active_students?: boolean
    on_hold_students?: boolean
    dropped_students?: boolean
    transferred_students?: boolean
    attendance_avg?: boolean
    homework_avg?: boolean
    pass_chuan_rate?: boolean
    pass_mem_rate?: boolean
    label_yellow?: boolean
    label_red?: boolean
    label_grey?: boolean
    label_no_data?: boolean
    risk_pct?: boolean
    is_alarm_triggered?: boolean
    health_status?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["class_daily_snapshots"]>

  export type class_daily_snapshotsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    class_id?: boolean
    snapshot_date?: boolean
    completed_sessions?: boolean
    progress_pct?: boolean
    active_students?: boolean
    on_hold_students?: boolean
    dropped_students?: boolean
    transferred_students?: boolean
    attendance_avg?: boolean
    homework_avg?: boolean
    pass_chuan_rate?: boolean
    pass_mem_rate?: boolean
    label_yellow?: boolean
    label_red?: boolean
    label_grey?: boolean
    label_no_data?: boolean
    risk_pct?: boolean
    is_alarm_triggered?: boolean
    health_status?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["class_daily_snapshots"]>

  export type class_daily_snapshotsSelectScalar = {
    id?: boolean
    class_id?: boolean
    snapshot_date?: boolean
    completed_sessions?: boolean
    progress_pct?: boolean
    active_students?: boolean
    on_hold_students?: boolean
    dropped_students?: boolean
    transferred_students?: boolean
    attendance_avg?: boolean
    homework_avg?: boolean
    pass_chuan_rate?: boolean
    pass_mem_rate?: boolean
    label_yellow?: boolean
    label_red?: boolean
    label_grey?: boolean
    label_no_data?: boolean
    risk_pct?: boolean
    is_alarm_triggered?: boolean
    health_status?: boolean
    scraped_at?: boolean
  }

  export type class_daily_snapshotsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "class_id" | "snapshot_date" | "completed_sessions" | "progress_pct" | "active_students" | "on_hold_students" | "dropped_students" | "transferred_students" | "attendance_avg" | "homework_avg" | "pass_chuan_rate" | "pass_mem_rate" | "label_yellow" | "label_red" | "label_grey" | "label_no_data" | "risk_pct" | "is_alarm_triggered" | "health_status" | "scraped_at", ExtArgs["result"]["class_daily_snapshots"]>
  export type class_daily_snapshotsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }
  export type class_daily_snapshotsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }
  export type class_daily_snapshotsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }

  export type $class_daily_snapshotsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "class_daily_snapshots"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      class_id: number
      snapshot_date: Date
      completed_sessions: number
      progress_pct: Prisma.Decimal | null
      active_students: number
      on_hold_students: number
      dropped_students: number
      transferred_students: number
      attendance_avg: Prisma.Decimal | null
      homework_avg: Prisma.Decimal | null
      pass_chuan_rate: Prisma.Decimal | null
      pass_mem_rate: Prisma.Decimal | null
      label_yellow: number
      label_red: number
      label_grey: number
      label_no_data: number
      risk_pct: Prisma.Decimal | null
      is_alarm_triggered: boolean
      health_status: string | null
      scraped_at: Date
    }, ExtArgs["result"]["class_daily_snapshots"]>
    composites: {}
  }

  type class_daily_snapshotsGetPayload<S extends boolean | null | undefined | class_daily_snapshotsDefaultArgs> = $Result.GetResult<Prisma.$class_daily_snapshotsPayload, S>

  type class_daily_snapshotsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<class_daily_snapshotsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Class_daily_snapshotsCountAggregateInputType | true
    }

  export interface class_daily_snapshotsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['class_daily_snapshots'], meta: { name: 'class_daily_snapshots' } }
    /**
     * Find zero or one Class_daily_snapshots that matches the filter.
     * @param {class_daily_snapshotsFindUniqueArgs} args - Arguments to find a Class_daily_snapshots
     * @example
     * // Get one Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends class_daily_snapshotsFindUniqueArgs>(args: SelectSubset<T, class_daily_snapshotsFindUniqueArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Class_daily_snapshots that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {class_daily_snapshotsFindUniqueOrThrowArgs} args - Arguments to find a Class_daily_snapshots
     * @example
     * // Get one Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends class_daily_snapshotsFindUniqueOrThrowArgs>(args: SelectSubset<T, class_daily_snapshotsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Class_daily_snapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsFindFirstArgs} args - Arguments to find a Class_daily_snapshots
     * @example
     * // Get one Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends class_daily_snapshotsFindFirstArgs>(args?: SelectSubset<T, class_daily_snapshotsFindFirstArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Class_daily_snapshots that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsFindFirstOrThrowArgs} args - Arguments to find a Class_daily_snapshots
     * @example
     * // Get one Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends class_daily_snapshotsFindFirstOrThrowArgs>(args?: SelectSubset<T, class_daily_snapshotsFindFirstOrThrowArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Class_daily_snapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findMany()
     * 
     * // Get first 10 Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const class_daily_snapshotsWithIdOnly = await prisma.class_daily_snapshots.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends class_daily_snapshotsFindManyArgs>(args?: SelectSubset<T, class_daily_snapshotsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Class_daily_snapshots.
     * @param {class_daily_snapshotsCreateArgs} args - Arguments to create a Class_daily_snapshots.
     * @example
     * // Create one Class_daily_snapshots
     * const Class_daily_snapshots = await prisma.class_daily_snapshots.create({
     *   data: {
     *     // ... data to create a Class_daily_snapshots
     *   }
     * })
     * 
     */
    create<T extends class_daily_snapshotsCreateArgs>(args: SelectSubset<T, class_daily_snapshotsCreateArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Class_daily_snapshots.
     * @param {class_daily_snapshotsCreateManyArgs} args - Arguments to create many Class_daily_snapshots.
     * @example
     * // Create many Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends class_daily_snapshotsCreateManyArgs>(args?: SelectSubset<T, class_daily_snapshotsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Class_daily_snapshots and returns the data saved in the database.
     * @param {class_daily_snapshotsCreateManyAndReturnArgs} args - Arguments to create many Class_daily_snapshots.
     * @example
     * // Create many Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Class_daily_snapshots and only return the `id`
     * const class_daily_snapshotsWithIdOnly = await prisma.class_daily_snapshots.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends class_daily_snapshotsCreateManyAndReturnArgs>(args?: SelectSubset<T, class_daily_snapshotsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Class_daily_snapshots.
     * @param {class_daily_snapshotsDeleteArgs} args - Arguments to delete one Class_daily_snapshots.
     * @example
     * // Delete one Class_daily_snapshots
     * const Class_daily_snapshots = await prisma.class_daily_snapshots.delete({
     *   where: {
     *     // ... filter to delete one Class_daily_snapshots
     *   }
     * })
     * 
     */
    delete<T extends class_daily_snapshotsDeleteArgs>(args: SelectSubset<T, class_daily_snapshotsDeleteArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Class_daily_snapshots.
     * @param {class_daily_snapshotsUpdateArgs} args - Arguments to update one Class_daily_snapshots.
     * @example
     * // Update one Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends class_daily_snapshotsUpdateArgs>(args: SelectSubset<T, class_daily_snapshotsUpdateArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Class_daily_snapshots.
     * @param {class_daily_snapshotsDeleteManyArgs} args - Arguments to filter Class_daily_snapshots to delete.
     * @example
     * // Delete a few Class_daily_snapshots
     * const { count } = await prisma.class_daily_snapshots.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends class_daily_snapshotsDeleteManyArgs>(args?: SelectSubset<T, class_daily_snapshotsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Class_daily_snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends class_daily_snapshotsUpdateManyArgs>(args: SelectSubset<T, class_daily_snapshotsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Class_daily_snapshots and returns the data updated in the database.
     * @param {class_daily_snapshotsUpdateManyAndReturnArgs} args - Arguments to update many Class_daily_snapshots.
     * @example
     * // Update many Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Class_daily_snapshots and only return the `id`
     * const class_daily_snapshotsWithIdOnly = await prisma.class_daily_snapshots.updateManyAndReturn({
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
    updateManyAndReturn<T extends class_daily_snapshotsUpdateManyAndReturnArgs>(args: SelectSubset<T, class_daily_snapshotsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Class_daily_snapshots.
     * @param {class_daily_snapshotsUpsertArgs} args - Arguments to update or create a Class_daily_snapshots.
     * @example
     * // Update or create a Class_daily_snapshots
     * const class_daily_snapshots = await prisma.class_daily_snapshots.upsert({
     *   create: {
     *     // ... data to create a Class_daily_snapshots
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Class_daily_snapshots we want to update
     *   }
     * })
     */
    upsert<T extends class_daily_snapshotsUpsertArgs>(args: SelectSubset<T, class_daily_snapshotsUpsertArgs<ExtArgs>>): Prisma__class_daily_snapshotsClient<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Class_daily_snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsCountArgs} args - Arguments to filter Class_daily_snapshots to count.
     * @example
     * // Count the number of Class_daily_snapshots
     * const count = await prisma.class_daily_snapshots.count({
     *   where: {
     *     // ... the filter for the Class_daily_snapshots we want to count
     *   }
     * })
    **/
    count<T extends class_daily_snapshotsCountArgs>(
      args?: Subset<T, class_daily_snapshotsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Class_daily_snapshotsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Class_daily_snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Class_daily_snapshotsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Class_daily_snapshotsAggregateArgs>(args: Subset<T, Class_daily_snapshotsAggregateArgs>): Prisma.PrismaPromise<GetClass_daily_snapshotsAggregateType<T>>

    /**
     * Group by Class_daily_snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {class_daily_snapshotsGroupByArgs} args - Group by arguments.
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
      T extends class_daily_snapshotsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: class_daily_snapshotsGroupByArgs['orderBy'] }
        : { orderBy?: class_daily_snapshotsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, class_daily_snapshotsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClass_daily_snapshotsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the class_daily_snapshots model
   */
  readonly fields: class_daily_snapshotsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for class_daily_snapshots.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__class_daily_snapshotsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the class_daily_snapshots model
   */
  interface class_daily_snapshotsFieldRefs {
    readonly id: FieldRef<"class_daily_snapshots", 'BigInt'>
    readonly class_id: FieldRef<"class_daily_snapshots", 'Int'>
    readonly snapshot_date: FieldRef<"class_daily_snapshots", 'DateTime'>
    readonly completed_sessions: FieldRef<"class_daily_snapshots", 'Int'>
    readonly progress_pct: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly active_students: FieldRef<"class_daily_snapshots", 'Int'>
    readonly on_hold_students: FieldRef<"class_daily_snapshots", 'Int'>
    readonly dropped_students: FieldRef<"class_daily_snapshots", 'Int'>
    readonly transferred_students: FieldRef<"class_daily_snapshots", 'Int'>
    readonly attendance_avg: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly homework_avg: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly pass_chuan_rate: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly pass_mem_rate: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly label_yellow: FieldRef<"class_daily_snapshots", 'Int'>
    readonly label_red: FieldRef<"class_daily_snapshots", 'Int'>
    readonly label_grey: FieldRef<"class_daily_snapshots", 'Int'>
    readonly label_no_data: FieldRef<"class_daily_snapshots", 'Int'>
    readonly risk_pct: FieldRef<"class_daily_snapshots", 'Decimal'>
    readonly is_alarm_triggered: FieldRef<"class_daily_snapshots", 'Boolean'>
    readonly health_status: FieldRef<"class_daily_snapshots", 'String'>
    readonly scraped_at: FieldRef<"class_daily_snapshots", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * class_daily_snapshots findUnique
   */
  export type class_daily_snapshotsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter, which class_daily_snapshots to fetch.
     */
    where: class_daily_snapshotsWhereUniqueInput
  }

  /**
   * class_daily_snapshots findUniqueOrThrow
   */
  export type class_daily_snapshotsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter, which class_daily_snapshots to fetch.
     */
    where: class_daily_snapshotsWhereUniqueInput
  }

  /**
   * class_daily_snapshots findFirst
   */
  export type class_daily_snapshotsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter, which class_daily_snapshots to fetch.
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of class_daily_snapshots to fetch.
     */
    orderBy?: class_daily_snapshotsOrderByWithRelationInput | class_daily_snapshotsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for class_daily_snapshots.
     */
    cursor?: class_daily_snapshotsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` class_daily_snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` class_daily_snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of class_daily_snapshots.
     */
    distinct?: Class_daily_snapshotsScalarFieldEnum | Class_daily_snapshotsScalarFieldEnum[]
  }

  /**
   * class_daily_snapshots findFirstOrThrow
   */
  export type class_daily_snapshotsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter, which class_daily_snapshots to fetch.
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of class_daily_snapshots to fetch.
     */
    orderBy?: class_daily_snapshotsOrderByWithRelationInput | class_daily_snapshotsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for class_daily_snapshots.
     */
    cursor?: class_daily_snapshotsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` class_daily_snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` class_daily_snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of class_daily_snapshots.
     */
    distinct?: Class_daily_snapshotsScalarFieldEnum | Class_daily_snapshotsScalarFieldEnum[]
  }

  /**
   * class_daily_snapshots findMany
   */
  export type class_daily_snapshotsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter, which class_daily_snapshots to fetch.
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of class_daily_snapshots to fetch.
     */
    orderBy?: class_daily_snapshotsOrderByWithRelationInput | class_daily_snapshotsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing class_daily_snapshots.
     */
    cursor?: class_daily_snapshotsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` class_daily_snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` class_daily_snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of class_daily_snapshots.
     */
    distinct?: Class_daily_snapshotsScalarFieldEnum | Class_daily_snapshotsScalarFieldEnum[]
  }

  /**
   * class_daily_snapshots create
   */
  export type class_daily_snapshotsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * The data needed to create a class_daily_snapshots.
     */
    data: XOR<class_daily_snapshotsCreateInput, class_daily_snapshotsUncheckedCreateInput>
  }

  /**
   * class_daily_snapshots createMany
   */
  export type class_daily_snapshotsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many class_daily_snapshots.
     */
    data: class_daily_snapshotsCreateManyInput | class_daily_snapshotsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * class_daily_snapshots createManyAndReturn
   */
  export type class_daily_snapshotsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * The data used to create many class_daily_snapshots.
     */
    data: class_daily_snapshotsCreateManyInput | class_daily_snapshotsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * class_daily_snapshots update
   */
  export type class_daily_snapshotsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * The data needed to update a class_daily_snapshots.
     */
    data: XOR<class_daily_snapshotsUpdateInput, class_daily_snapshotsUncheckedUpdateInput>
    /**
     * Choose, which class_daily_snapshots to update.
     */
    where: class_daily_snapshotsWhereUniqueInput
  }

  /**
   * class_daily_snapshots updateMany
   */
  export type class_daily_snapshotsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update class_daily_snapshots.
     */
    data: XOR<class_daily_snapshotsUpdateManyMutationInput, class_daily_snapshotsUncheckedUpdateManyInput>
    /**
     * Filter which class_daily_snapshots to update
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * Limit how many class_daily_snapshots to update.
     */
    limit?: number
  }

  /**
   * class_daily_snapshots updateManyAndReturn
   */
  export type class_daily_snapshotsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * The data used to update class_daily_snapshots.
     */
    data: XOR<class_daily_snapshotsUpdateManyMutationInput, class_daily_snapshotsUncheckedUpdateManyInput>
    /**
     * Filter which class_daily_snapshots to update
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * Limit how many class_daily_snapshots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * class_daily_snapshots upsert
   */
  export type class_daily_snapshotsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * The filter to search for the class_daily_snapshots to update in case it exists.
     */
    where: class_daily_snapshotsWhereUniqueInput
    /**
     * In case the class_daily_snapshots found by the `where` argument doesn't exist, create a new class_daily_snapshots with this data.
     */
    create: XOR<class_daily_snapshotsCreateInput, class_daily_snapshotsUncheckedCreateInput>
    /**
     * In case the class_daily_snapshots was found with the provided `where` argument, update it with this data.
     */
    update: XOR<class_daily_snapshotsUpdateInput, class_daily_snapshotsUncheckedUpdateInput>
  }

  /**
   * class_daily_snapshots delete
   */
  export type class_daily_snapshotsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    /**
     * Filter which class_daily_snapshots to delete.
     */
    where: class_daily_snapshotsWhereUniqueInput
  }

  /**
   * class_daily_snapshots deleteMany
   */
  export type class_daily_snapshotsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which class_daily_snapshots to delete
     */
    where?: class_daily_snapshotsWhereInput
    /**
     * Limit how many class_daily_snapshots to delete.
     */
    limit?: number
  }

  /**
   * class_daily_snapshots without action
   */
  export type class_daily_snapshotsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
  }


  /**
   * Model classes
   */

  export type AggregateClasses = {
    _count: ClassesCountAggregateOutputType | null
    _avg: ClassesAvgAggregateOutputType | null
    _sum: ClassesSumAggregateOutputType | null
    _min: ClassesMinAggregateOutputType | null
    _max: ClassesMaxAggregateOutputType | null
  }

  export type ClassesAvgAggregateOutputType = {
    class_id: number | null
    course_id: number | null
    teacher_id: number | null
    total_sessions: number | null
  }

  export type ClassesSumAggregateOutputType = {
    class_id: number | null
    course_id: number | null
    teacher_id: number | null
    total_sessions: number | null
  }

  export type ClassesMinAggregateOutputType = {
    class_id: number | null
    class_name: string | null
    course_id: number | null
    teacher_id: number | null
    lead_email: string | null
    status: string | null
    schedule: string | null
    location: string | null
    opening_date: Date | null
    ending_date: Date | null
    total_sessions: number | null
    portal_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ClassesMaxAggregateOutputType = {
    class_id: number | null
    class_name: string | null
    course_id: number | null
    teacher_id: number | null
    lead_email: string | null
    status: string | null
    schedule: string | null
    location: string | null
    opening_date: Date | null
    ending_date: Date | null
    total_sessions: number | null
    portal_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ClassesCountAggregateOutputType = {
    class_id: number
    class_name: number
    course_id: number
    teacher_id: number
    lead_email: number
    status: number
    schedule: number
    location: number
    opening_date: number
    ending_date: number
    total_sessions: number
    portal_url: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ClassesAvgAggregateInputType = {
    class_id?: true
    course_id?: true
    teacher_id?: true
    total_sessions?: true
  }

  export type ClassesSumAggregateInputType = {
    class_id?: true
    course_id?: true
    teacher_id?: true
    total_sessions?: true
  }

  export type ClassesMinAggregateInputType = {
    class_id?: true
    class_name?: true
    course_id?: true
    teacher_id?: true
    lead_email?: true
    status?: true
    schedule?: true
    location?: true
    opening_date?: true
    ending_date?: true
    total_sessions?: true
    portal_url?: true
    created_at?: true
    updated_at?: true
  }

  export type ClassesMaxAggregateInputType = {
    class_id?: true
    class_name?: true
    course_id?: true
    teacher_id?: true
    lead_email?: true
    status?: true
    schedule?: true
    location?: true
    opening_date?: true
    ending_date?: true
    total_sessions?: true
    portal_url?: true
    created_at?: true
    updated_at?: true
  }

  export type ClassesCountAggregateInputType = {
    class_id?: true
    class_name?: true
    course_id?: true
    teacher_id?: true
    lead_email?: true
    status?: true
    schedule?: true
    location?: true
    opening_date?: true
    ending_date?: true
    total_sessions?: true
    portal_url?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ClassesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which classes to aggregate.
     */
    where?: classesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of classes to fetch.
     */
    orderBy?: classesOrderByWithRelationInput | classesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: classesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned classes
    **/
    _count?: true | ClassesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClassesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClassesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassesMaxAggregateInputType
  }

  export type GetClassesAggregateType<T extends ClassesAggregateArgs> = {
        [P in keyof T & keyof AggregateClasses]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClasses[P]>
      : GetScalarType<T[P], AggregateClasses[P]>
  }




  export type classesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: classesWhereInput
    orderBy?: classesOrderByWithAggregationInput | classesOrderByWithAggregationInput[]
    by: ClassesScalarFieldEnum[] | ClassesScalarFieldEnum
    having?: classesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassesCountAggregateInputType | true
    _avg?: ClassesAvgAggregateInputType
    _sum?: ClassesSumAggregateInputType
    _min?: ClassesMinAggregateInputType
    _max?: ClassesMaxAggregateInputType
  }

  export type ClassesGroupByOutputType = {
    class_id: number
    class_name: string
    course_id: number
    teacher_id: number
    lead_email: string | null
    status: string
    schedule: string | null
    location: string | null
    opening_date: Date
    ending_date: Date | null
    total_sessions: number
    portal_url: string | null
    created_at: Date
    updated_at: Date
    _count: ClassesCountAggregateOutputType | null
    _avg: ClassesAvgAggregateOutputType | null
    _sum: ClassesSumAggregateOutputType | null
    _min: ClassesMinAggregateOutputType | null
    _max: ClassesMaxAggregateOutputType | null
  }

  type GetClassesGroupByPayload<T extends classesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassesGroupByOutputType[P]>
            : GetScalarType<T[P], ClassesGroupByOutputType[P]>
        }
      >
    >


  export type classesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    class_id?: boolean
    class_name?: boolean
    course_id?: boolean
    teacher_id?: boolean
    lead_email?: boolean
    status?: boolean
    schedule?: boolean
    location?: boolean
    opening_date?: boolean
    ending_date?: boolean
    total_sessions?: boolean
    portal_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    class_daily_snapshots?: boolean | classes$class_daily_snapshotsArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
    label_change_logs?: boolean | classes$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | classes$pass_reviewsArgs<ExtArgs>
    student_daily_records?: boolean | classes$student_daily_recordsArgs<ExtArgs>
    students?: boolean | classes$studentsArgs<ExtArgs>
    test_scores?: boolean | classes$test_scoresArgs<ExtArgs>
    _count?: boolean | ClassesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classes"]>

  export type classesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    class_id?: boolean
    class_name?: boolean
    course_id?: boolean
    teacher_id?: boolean
    lead_email?: boolean
    status?: boolean
    schedule?: boolean
    location?: boolean
    opening_date?: boolean
    ending_date?: boolean
    total_sessions?: boolean
    portal_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classes"]>

  export type classesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    class_id?: boolean
    class_name?: boolean
    course_id?: boolean
    teacher_id?: boolean
    lead_email?: boolean
    status?: boolean
    schedule?: boolean
    location?: boolean
    opening_date?: boolean
    ending_date?: boolean
    total_sessions?: boolean
    portal_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classes"]>

  export type classesSelectScalar = {
    class_id?: boolean
    class_name?: boolean
    course_id?: boolean
    teacher_id?: boolean
    lead_email?: boolean
    status?: boolean
    schedule?: boolean
    location?: boolean
    opening_date?: boolean
    ending_date?: boolean
    total_sessions?: boolean
    portal_url?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type classesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"class_id" | "class_name" | "course_id" | "teacher_id" | "lead_email" | "status" | "schedule" | "location" | "opening_date" | "ending_date" | "total_sessions" | "portal_url" | "created_at" | "updated_at", ExtArgs["result"]["classes"]>
  export type classesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    class_daily_snapshots?: boolean | classes$class_daily_snapshotsArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
    label_change_logs?: boolean | classes$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | classes$pass_reviewsArgs<ExtArgs>
    student_daily_records?: boolean | classes$student_daily_recordsArgs<ExtArgs>
    students?: boolean | classes$studentsArgs<ExtArgs>
    test_scores?: boolean | classes$test_scoresArgs<ExtArgs>
    _count?: boolean | ClassesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type classesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }
  export type classesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }

  export type $classesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "classes"
    objects: {
      class_daily_snapshots: Prisma.$class_daily_snapshotsPayload<ExtArgs>[]
      teachers: Prisma.$teachersPayload<ExtArgs>
      label_change_logs: Prisma.$label_change_logsPayload<ExtArgs>[]
      pass_reviews: Prisma.$pass_reviewsPayload<ExtArgs>[]
      student_daily_records: Prisma.$student_daily_recordsPayload<ExtArgs>[]
      students: Prisma.$studentsPayload<ExtArgs>[]
      test_scores: Prisma.$test_scoresPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      class_id: number
      class_name: string
      course_id: number
      teacher_id: number
      lead_email: string | null
      status: string
      schedule: string | null
      location: string | null
      opening_date: Date
      ending_date: Date | null
      total_sessions: number
      portal_url: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["classes"]>
    composites: {}
  }

  type classesGetPayload<S extends boolean | null | undefined | classesDefaultArgs> = $Result.GetResult<Prisma.$classesPayload, S>

  type classesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<classesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassesCountAggregateInputType | true
    }

  export interface classesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['classes'], meta: { name: 'classes' } }
    /**
     * Find zero or one Classes that matches the filter.
     * @param {classesFindUniqueArgs} args - Arguments to find a Classes
     * @example
     * // Get one Classes
     * const classes = await prisma.classes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends classesFindUniqueArgs>(args: SelectSubset<T, classesFindUniqueArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Classes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {classesFindUniqueOrThrowArgs} args - Arguments to find a Classes
     * @example
     * // Get one Classes
     * const classes = await prisma.classes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends classesFindUniqueOrThrowArgs>(args: SelectSubset<T, classesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesFindFirstArgs} args - Arguments to find a Classes
     * @example
     * // Get one Classes
     * const classes = await prisma.classes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends classesFindFirstArgs>(args?: SelectSubset<T, classesFindFirstArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesFindFirstOrThrowArgs} args - Arguments to find a Classes
     * @example
     * // Get one Classes
     * const classes = await prisma.classes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends classesFindFirstOrThrowArgs>(args?: SelectSubset<T, classesFindFirstOrThrowArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Classes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Classes
     * const classes = await prisma.classes.findMany()
     * 
     * // Get first 10 Classes
     * const classes = await prisma.classes.findMany({ take: 10 })
     * 
     * // Only select the `class_id`
     * const classesWithClass_idOnly = await prisma.classes.findMany({ select: { class_id: true } })
     * 
     */
    findMany<T extends classesFindManyArgs>(args?: SelectSubset<T, classesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Classes.
     * @param {classesCreateArgs} args - Arguments to create a Classes.
     * @example
     * // Create one Classes
     * const Classes = await prisma.classes.create({
     *   data: {
     *     // ... data to create a Classes
     *   }
     * })
     * 
     */
    create<T extends classesCreateArgs>(args: SelectSubset<T, classesCreateArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Classes.
     * @param {classesCreateManyArgs} args - Arguments to create many Classes.
     * @example
     * // Create many Classes
     * const classes = await prisma.classes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends classesCreateManyArgs>(args?: SelectSubset<T, classesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Classes and returns the data saved in the database.
     * @param {classesCreateManyAndReturnArgs} args - Arguments to create many Classes.
     * @example
     * // Create many Classes
     * const classes = await prisma.classes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Classes and only return the `class_id`
     * const classesWithClass_idOnly = await prisma.classes.createManyAndReturn({
     *   select: { class_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends classesCreateManyAndReturnArgs>(args?: SelectSubset<T, classesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Classes.
     * @param {classesDeleteArgs} args - Arguments to delete one Classes.
     * @example
     * // Delete one Classes
     * const Classes = await prisma.classes.delete({
     *   where: {
     *     // ... filter to delete one Classes
     *   }
     * })
     * 
     */
    delete<T extends classesDeleteArgs>(args: SelectSubset<T, classesDeleteArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Classes.
     * @param {classesUpdateArgs} args - Arguments to update one Classes.
     * @example
     * // Update one Classes
     * const classes = await prisma.classes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends classesUpdateArgs>(args: SelectSubset<T, classesUpdateArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Classes.
     * @param {classesDeleteManyArgs} args - Arguments to filter Classes to delete.
     * @example
     * // Delete a few Classes
     * const { count } = await prisma.classes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends classesDeleteManyArgs>(args?: SelectSubset<T, classesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Classes
     * const classes = await prisma.classes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends classesUpdateManyArgs>(args: SelectSubset<T, classesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classes and returns the data updated in the database.
     * @param {classesUpdateManyAndReturnArgs} args - Arguments to update many Classes.
     * @example
     * // Update many Classes
     * const classes = await prisma.classes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Classes and only return the `class_id`
     * const classesWithClass_idOnly = await prisma.classes.updateManyAndReturn({
     *   select: { class_id: true },
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
    updateManyAndReturn<T extends classesUpdateManyAndReturnArgs>(args: SelectSubset<T, classesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Classes.
     * @param {classesUpsertArgs} args - Arguments to update or create a Classes.
     * @example
     * // Update or create a Classes
     * const classes = await prisma.classes.upsert({
     *   create: {
     *     // ... data to create a Classes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Classes we want to update
     *   }
     * })
     */
    upsert<T extends classesUpsertArgs>(args: SelectSubset<T, classesUpsertArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesCountArgs} args - Arguments to filter Classes to count.
     * @example
     * // Count the number of Classes
     * const count = await prisma.classes.count({
     *   where: {
     *     // ... the filter for the Classes we want to count
     *   }
     * })
    **/
    count<T extends classesCountArgs>(
      args?: Subset<T, classesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassesAggregateArgs>(args: Subset<T, ClassesAggregateArgs>): Prisma.PrismaPromise<GetClassesAggregateType<T>>

    /**
     * Group by Classes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {classesGroupByArgs} args - Group by arguments.
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
      T extends classesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: classesGroupByArgs['orderBy'] }
        : { orderBy?: classesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, classesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the classes model
   */
  readonly fields: classesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for classes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__classesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    class_daily_snapshots<T extends classes$class_daily_snapshotsArgs<ExtArgs> = {}>(args?: Subset<T, classes$class_daily_snapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$class_daily_snapshotsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teachers<T extends teachersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, teachersDefaultArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    label_change_logs<T extends classes$label_change_logsArgs<ExtArgs> = {}>(args?: Subset<T, classes$label_change_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pass_reviews<T extends classes$pass_reviewsArgs<ExtArgs> = {}>(args?: Subset<T, classes$pass_reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    student_daily_records<T extends classes$student_daily_recordsArgs<ExtArgs> = {}>(args?: Subset<T, classes$student_daily_recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    students<T extends classes$studentsArgs<ExtArgs> = {}>(args?: Subset<T, classes$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    test_scores<T extends classes$test_scoresArgs<ExtArgs> = {}>(args?: Subset<T, classes$test_scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the classes model
   */
  interface classesFieldRefs {
    readonly class_id: FieldRef<"classes", 'Int'>
    readonly class_name: FieldRef<"classes", 'String'>
    readonly course_id: FieldRef<"classes", 'Int'>
    readonly teacher_id: FieldRef<"classes", 'Int'>
    readonly lead_email: FieldRef<"classes", 'String'>
    readonly status: FieldRef<"classes", 'String'>
    readonly schedule: FieldRef<"classes", 'String'>
    readonly location: FieldRef<"classes", 'String'>
    readonly opening_date: FieldRef<"classes", 'DateTime'>
    readonly ending_date: FieldRef<"classes", 'DateTime'>
    readonly total_sessions: FieldRef<"classes", 'Int'>
    readonly portal_url: FieldRef<"classes", 'String'>
    readonly created_at: FieldRef<"classes", 'DateTime'>
    readonly updated_at: FieldRef<"classes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * classes findUnique
   */
  export type classesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter, which classes to fetch.
     */
    where: classesWhereUniqueInput
  }

  /**
   * classes findUniqueOrThrow
   */
  export type classesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter, which classes to fetch.
     */
    where: classesWhereUniqueInput
  }

  /**
   * classes findFirst
   */
  export type classesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter, which classes to fetch.
     */
    where?: classesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of classes to fetch.
     */
    orderBy?: classesOrderByWithRelationInput | classesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for classes.
     */
    cursor?: classesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of classes.
     */
    distinct?: ClassesScalarFieldEnum | ClassesScalarFieldEnum[]
  }

  /**
   * classes findFirstOrThrow
   */
  export type classesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter, which classes to fetch.
     */
    where?: classesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of classes to fetch.
     */
    orderBy?: classesOrderByWithRelationInput | classesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for classes.
     */
    cursor?: classesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of classes.
     */
    distinct?: ClassesScalarFieldEnum | ClassesScalarFieldEnum[]
  }

  /**
   * classes findMany
   */
  export type classesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter, which classes to fetch.
     */
    where?: classesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of classes to fetch.
     */
    orderBy?: classesOrderByWithRelationInput | classesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing classes.
     */
    cursor?: classesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` classes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` classes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of classes.
     */
    distinct?: ClassesScalarFieldEnum | ClassesScalarFieldEnum[]
  }

  /**
   * classes create
   */
  export type classesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * The data needed to create a classes.
     */
    data: XOR<classesCreateInput, classesUncheckedCreateInput>
  }

  /**
   * classes createMany
   */
  export type classesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many classes.
     */
    data: classesCreateManyInput | classesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * classes createManyAndReturn
   */
  export type classesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * The data used to create many classes.
     */
    data: classesCreateManyInput | classesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * classes update
   */
  export type classesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * The data needed to update a classes.
     */
    data: XOR<classesUpdateInput, classesUncheckedUpdateInput>
    /**
     * Choose, which classes to update.
     */
    where: classesWhereUniqueInput
  }

  /**
   * classes updateMany
   */
  export type classesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update classes.
     */
    data: XOR<classesUpdateManyMutationInput, classesUncheckedUpdateManyInput>
    /**
     * Filter which classes to update
     */
    where?: classesWhereInput
    /**
     * Limit how many classes to update.
     */
    limit?: number
  }

  /**
   * classes updateManyAndReturn
   */
  export type classesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * The data used to update classes.
     */
    data: XOR<classesUpdateManyMutationInput, classesUncheckedUpdateManyInput>
    /**
     * Filter which classes to update
     */
    where?: classesWhereInput
    /**
     * Limit how many classes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * classes upsert
   */
  export type classesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * The filter to search for the classes to update in case it exists.
     */
    where: classesWhereUniqueInput
    /**
     * In case the classes found by the `where` argument doesn't exist, create a new classes with this data.
     */
    create: XOR<classesCreateInput, classesUncheckedCreateInput>
    /**
     * In case the classes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<classesUpdateInput, classesUncheckedUpdateInput>
  }

  /**
   * classes delete
   */
  export type classesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    /**
     * Filter which classes to delete.
     */
    where: classesWhereUniqueInput
  }

  /**
   * classes deleteMany
   */
  export type classesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which classes to delete
     */
    where?: classesWhereInput
    /**
     * Limit how many classes to delete.
     */
    limit?: number
  }

  /**
   * classes.class_daily_snapshots
   */
  export type classes$class_daily_snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the class_daily_snapshots
     */
    select?: class_daily_snapshotsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the class_daily_snapshots
     */
    omit?: class_daily_snapshotsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: class_daily_snapshotsInclude<ExtArgs> | null
    where?: class_daily_snapshotsWhereInput
    orderBy?: class_daily_snapshotsOrderByWithRelationInput | class_daily_snapshotsOrderByWithRelationInput[]
    cursor?: class_daily_snapshotsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Class_daily_snapshotsScalarFieldEnum | Class_daily_snapshotsScalarFieldEnum[]
  }

  /**
   * classes.label_change_logs
   */
  export type classes$label_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    where?: label_change_logsWhereInput
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    cursor?: label_change_logsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * classes.pass_reviews
   */
  export type classes$pass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    where?: pass_reviewsWhereInput
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    cursor?: pass_reviewsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * classes.student_daily_records
   */
  export type classes$student_daily_recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    where?: student_daily_recordsWhereInput
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    cursor?: student_daily_recordsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Student_daily_recordsScalarFieldEnum | Student_daily_recordsScalarFieldEnum[]
  }

  /**
   * classes.students
   */
  export type classes$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    where?: studentsWhereInput
    orderBy?: studentsOrderByWithRelationInput | studentsOrderByWithRelationInput[]
    cursor?: studentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentsScalarFieldEnum | StudentsScalarFieldEnum[]
  }

  /**
   * classes.test_scores
   */
  export type classes$test_scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    where?: test_scoresWhereInput
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    cursor?: test_scoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Test_scoresScalarFieldEnum | Test_scoresScalarFieldEnum[]
  }

  /**
   * classes without action
   */
  export type classesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
  }


  /**
   * Model label_change_logs
   */

  export type AggregateLabel_change_logs = {
    _count: Label_change_logsCountAggregateOutputType | null
    _avg: Label_change_logsAvgAggregateOutputType | null
    _sum: Label_change_logsSumAggregateOutputType | null
    _min: Label_change_logsMinAggregateOutputType | null
    _max: Label_change_logsMaxAggregateOutputType | null
  }

  export type Label_change_logsAvgAggregateOutputType = {
    id: number | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    step_count: number | null
    test_average_after: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
  }

  export type Label_change_logsSumAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    step_count: number | null
    test_average_after: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
  }

  export type Label_change_logsMinAggregateOutputType = {
    id: bigint | null
    log_id: string | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    from_label: string | null
    to_label: string | null
    direction: string | null
    severity: string | null
    step_count: number | null
    reason: string | null
    checkpoint: string | null
    test_average_after: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    email_sent: boolean | null
    email_sent_at: Date | null
    created_at: Date | null
  }

  export type Label_change_logsMaxAggregateOutputType = {
    id: bigint | null
    log_id: string | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    from_label: string | null
    to_label: string | null
    direction: string | null
    severity: string | null
    step_count: number | null
    reason: string | null
    checkpoint: string | null
    test_average_after: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    email_sent: boolean | null
    email_sent_at: Date | null
    created_at: Date | null
  }

  export type Label_change_logsCountAggregateOutputType = {
    id: number
    log_id: number
    student_id: number
    class_id: number
    teacher_id: number
    from_label: number
    to_label: number
    direction: number
    severity: number
    step_count: number
    reason: number
    checkpoint: number
    test_average_after: number
    attendance_pct: number
    homework_pct: number
    email_sent: number
    email_sent_at: number
    created_at: number
    _all: number
  }


  export type Label_change_logsAvgAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    step_count?: true
    test_average_after?: true
    attendance_pct?: true
    homework_pct?: true
  }

  export type Label_change_logsSumAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    step_count?: true
    test_average_after?: true
    attendance_pct?: true
    homework_pct?: true
  }

  export type Label_change_logsMinAggregateInputType = {
    id?: true
    log_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    from_label?: true
    to_label?: true
    direction?: true
    severity?: true
    step_count?: true
    reason?: true
    checkpoint?: true
    test_average_after?: true
    attendance_pct?: true
    homework_pct?: true
    email_sent?: true
    email_sent_at?: true
    created_at?: true
  }

  export type Label_change_logsMaxAggregateInputType = {
    id?: true
    log_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    from_label?: true
    to_label?: true
    direction?: true
    severity?: true
    step_count?: true
    reason?: true
    checkpoint?: true
    test_average_after?: true
    attendance_pct?: true
    homework_pct?: true
    email_sent?: true
    email_sent_at?: true
    created_at?: true
  }

  export type Label_change_logsCountAggregateInputType = {
    id?: true
    log_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    from_label?: true
    to_label?: true
    direction?: true
    severity?: true
    step_count?: true
    reason?: true
    checkpoint?: true
    test_average_after?: true
    attendance_pct?: true
    homework_pct?: true
    email_sent?: true
    email_sent_at?: true
    created_at?: true
    _all?: true
  }

  export type Label_change_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which label_change_logs to aggregate.
     */
    where?: label_change_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of label_change_logs to fetch.
     */
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: label_change_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` label_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` label_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned label_change_logs
    **/
    _count?: true | Label_change_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Label_change_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Label_change_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Label_change_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Label_change_logsMaxAggregateInputType
  }

  export type GetLabel_change_logsAggregateType<T extends Label_change_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateLabel_change_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabel_change_logs[P]>
      : GetScalarType<T[P], AggregateLabel_change_logs[P]>
  }




  export type label_change_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: label_change_logsWhereInput
    orderBy?: label_change_logsOrderByWithAggregationInput | label_change_logsOrderByWithAggregationInput[]
    by: Label_change_logsScalarFieldEnum[] | Label_change_logsScalarFieldEnum
    having?: label_change_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Label_change_logsCountAggregateInputType | true
    _avg?: Label_change_logsAvgAggregateInputType
    _sum?: Label_change_logsSumAggregateInputType
    _min?: Label_change_logsMinAggregateInputType
    _max?: Label_change_logsMaxAggregateInputType
  }

  export type Label_change_logsGroupByOutputType = {
    id: bigint
    log_id: string
    student_id: number
    class_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity: string | null
    step_count: number | null
    reason: string | null
    checkpoint: string | null
    test_average_after: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    email_sent: boolean | null
    email_sent_at: Date | null
    created_at: Date
    _count: Label_change_logsCountAggregateOutputType | null
    _avg: Label_change_logsAvgAggregateOutputType | null
    _sum: Label_change_logsSumAggregateOutputType | null
    _min: Label_change_logsMinAggregateOutputType | null
    _max: Label_change_logsMaxAggregateOutputType | null
  }

  type GetLabel_change_logsGroupByPayload<T extends label_change_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Label_change_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Label_change_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Label_change_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Label_change_logsGroupByOutputType[P]>
        }
      >
    >


  export type label_change_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    from_label?: boolean
    to_label?: boolean
    direction?: boolean
    severity?: boolean
    step_count?: boolean
    reason?: boolean
    checkpoint?: boolean
    test_average_after?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    email_sent?: boolean
    email_sent_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["label_change_logs"]>

  export type label_change_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    from_label?: boolean
    to_label?: boolean
    direction?: boolean
    severity?: boolean
    step_count?: boolean
    reason?: boolean
    checkpoint?: boolean
    test_average_after?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    email_sent?: boolean
    email_sent_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["label_change_logs"]>

  export type label_change_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    from_label?: boolean
    to_label?: boolean
    direction?: boolean
    severity?: boolean
    step_count?: boolean
    reason?: boolean
    checkpoint?: boolean
    test_average_after?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    email_sent?: boolean
    email_sent_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["label_change_logs"]>

  export type label_change_logsSelectScalar = {
    id?: boolean
    log_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    from_label?: boolean
    to_label?: boolean
    direction?: boolean
    severity?: boolean
    step_count?: boolean
    reason?: boolean
    checkpoint?: boolean
    test_average_after?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    email_sent?: boolean
    email_sent_at?: boolean
    created_at?: boolean
  }

  export type label_change_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "log_id" | "student_id" | "class_id" | "teacher_id" | "from_label" | "to_label" | "direction" | "severity" | "step_count" | "reason" | "checkpoint" | "test_average_after" | "attendance_pct" | "homework_pct" | "email_sent" | "email_sent_at" | "created_at", ExtArgs["result"]["label_change_logs"]>
  export type label_change_logsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }
  export type label_change_logsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }
  export type label_change_logsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }

  export type $label_change_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "label_change_logs"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>
      students: Prisma.$studentsPayload<ExtArgs>
      teachers: Prisma.$teachersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      log_id: string
      student_id: number
      class_id: number
      teacher_id: number
      from_label: string
      to_label: string
      direction: string
      severity: string | null
      step_count: number | null
      reason: string | null
      checkpoint: string | null
      test_average_after: Prisma.Decimal | null
      attendance_pct: Prisma.Decimal | null
      homework_pct: Prisma.Decimal | null
      email_sent: boolean | null
      email_sent_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["label_change_logs"]>
    composites: {}
  }

  type label_change_logsGetPayload<S extends boolean | null | undefined | label_change_logsDefaultArgs> = $Result.GetResult<Prisma.$label_change_logsPayload, S>

  type label_change_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<label_change_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Label_change_logsCountAggregateInputType | true
    }

  export interface label_change_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['label_change_logs'], meta: { name: 'label_change_logs' } }
    /**
     * Find zero or one Label_change_logs that matches the filter.
     * @param {label_change_logsFindUniqueArgs} args - Arguments to find a Label_change_logs
     * @example
     * // Get one Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends label_change_logsFindUniqueArgs>(args: SelectSubset<T, label_change_logsFindUniqueArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Label_change_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {label_change_logsFindUniqueOrThrowArgs} args - Arguments to find a Label_change_logs
     * @example
     * // Get one Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends label_change_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, label_change_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Label_change_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsFindFirstArgs} args - Arguments to find a Label_change_logs
     * @example
     * // Get one Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends label_change_logsFindFirstArgs>(args?: SelectSubset<T, label_change_logsFindFirstArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Label_change_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsFindFirstOrThrowArgs} args - Arguments to find a Label_change_logs
     * @example
     * // Get one Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends label_change_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, label_change_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Label_change_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findMany()
     * 
     * // Get first 10 Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const label_change_logsWithIdOnly = await prisma.label_change_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends label_change_logsFindManyArgs>(args?: SelectSubset<T, label_change_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Label_change_logs.
     * @param {label_change_logsCreateArgs} args - Arguments to create a Label_change_logs.
     * @example
     * // Create one Label_change_logs
     * const Label_change_logs = await prisma.label_change_logs.create({
     *   data: {
     *     // ... data to create a Label_change_logs
     *   }
     * })
     * 
     */
    create<T extends label_change_logsCreateArgs>(args: SelectSubset<T, label_change_logsCreateArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Label_change_logs.
     * @param {label_change_logsCreateManyArgs} args - Arguments to create many Label_change_logs.
     * @example
     * // Create many Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends label_change_logsCreateManyArgs>(args?: SelectSubset<T, label_change_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Label_change_logs and returns the data saved in the database.
     * @param {label_change_logsCreateManyAndReturnArgs} args - Arguments to create many Label_change_logs.
     * @example
     * // Create many Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Label_change_logs and only return the `id`
     * const label_change_logsWithIdOnly = await prisma.label_change_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends label_change_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, label_change_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Label_change_logs.
     * @param {label_change_logsDeleteArgs} args - Arguments to delete one Label_change_logs.
     * @example
     * // Delete one Label_change_logs
     * const Label_change_logs = await prisma.label_change_logs.delete({
     *   where: {
     *     // ... filter to delete one Label_change_logs
     *   }
     * })
     * 
     */
    delete<T extends label_change_logsDeleteArgs>(args: SelectSubset<T, label_change_logsDeleteArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Label_change_logs.
     * @param {label_change_logsUpdateArgs} args - Arguments to update one Label_change_logs.
     * @example
     * // Update one Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends label_change_logsUpdateArgs>(args: SelectSubset<T, label_change_logsUpdateArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Label_change_logs.
     * @param {label_change_logsDeleteManyArgs} args - Arguments to filter Label_change_logs to delete.
     * @example
     * // Delete a few Label_change_logs
     * const { count } = await prisma.label_change_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends label_change_logsDeleteManyArgs>(args?: SelectSubset<T, label_change_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Label_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends label_change_logsUpdateManyArgs>(args: SelectSubset<T, label_change_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Label_change_logs and returns the data updated in the database.
     * @param {label_change_logsUpdateManyAndReturnArgs} args - Arguments to update many Label_change_logs.
     * @example
     * // Update many Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Label_change_logs and only return the `id`
     * const label_change_logsWithIdOnly = await prisma.label_change_logs.updateManyAndReturn({
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
    updateManyAndReturn<T extends label_change_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, label_change_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Label_change_logs.
     * @param {label_change_logsUpsertArgs} args - Arguments to update or create a Label_change_logs.
     * @example
     * // Update or create a Label_change_logs
     * const label_change_logs = await prisma.label_change_logs.upsert({
     *   create: {
     *     // ... data to create a Label_change_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Label_change_logs we want to update
     *   }
     * })
     */
    upsert<T extends label_change_logsUpsertArgs>(args: SelectSubset<T, label_change_logsUpsertArgs<ExtArgs>>): Prisma__label_change_logsClient<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Label_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsCountArgs} args - Arguments to filter Label_change_logs to count.
     * @example
     * // Count the number of Label_change_logs
     * const count = await prisma.label_change_logs.count({
     *   where: {
     *     // ... the filter for the Label_change_logs we want to count
     *   }
     * })
    **/
    count<T extends label_change_logsCountArgs>(
      args?: Subset<T, label_change_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Label_change_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Label_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Label_change_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Label_change_logsAggregateArgs>(args: Subset<T, Label_change_logsAggregateArgs>): Prisma.PrismaPromise<GetLabel_change_logsAggregateType<T>>

    /**
     * Group by Label_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {label_change_logsGroupByArgs} args - Group by arguments.
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
      T extends label_change_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: label_change_logsGroupByArgs['orderBy'] }
        : { orderBy?: label_change_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, label_change_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabel_change_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the label_change_logs model
   */
  readonly fields: label_change_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for label_change_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__label_change_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    students<T extends studentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, studentsDefaultArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    teachers<T extends teachersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, teachersDefaultArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the label_change_logs model
   */
  interface label_change_logsFieldRefs {
    readonly id: FieldRef<"label_change_logs", 'BigInt'>
    readonly log_id: FieldRef<"label_change_logs", 'String'>
    readonly student_id: FieldRef<"label_change_logs", 'Int'>
    readonly class_id: FieldRef<"label_change_logs", 'Int'>
    readonly teacher_id: FieldRef<"label_change_logs", 'Int'>
    readonly from_label: FieldRef<"label_change_logs", 'String'>
    readonly to_label: FieldRef<"label_change_logs", 'String'>
    readonly direction: FieldRef<"label_change_logs", 'String'>
    readonly severity: FieldRef<"label_change_logs", 'String'>
    readonly step_count: FieldRef<"label_change_logs", 'Int'>
    readonly reason: FieldRef<"label_change_logs", 'String'>
    readonly checkpoint: FieldRef<"label_change_logs", 'String'>
    readonly test_average_after: FieldRef<"label_change_logs", 'Decimal'>
    readonly attendance_pct: FieldRef<"label_change_logs", 'Decimal'>
    readonly homework_pct: FieldRef<"label_change_logs", 'Decimal'>
    readonly email_sent: FieldRef<"label_change_logs", 'Boolean'>
    readonly email_sent_at: FieldRef<"label_change_logs", 'DateTime'>
    readonly created_at: FieldRef<"label_change_logs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * label_change_logs findUnique
   */
  export type label_change_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter, which label_change_logs to fetch.
     */
    where: label_change_logsWhereUniqueInput
  }

  /**
   * label_change_logs findUniqueOrThrow
   */
  export type label_change_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter, which label_change_logs to fetch.
     */
    where: label_change_logsWhereUniqueInput
  }

  /**
   * label_change_logs findFirst
   */
  export type label_change_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter, which label_change_logs to fetch.
     */
    where?: label_change_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of label_change_logs to fetch.
     */
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for label_change_logs.
     */
    cursor?: label_change_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` label_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` label_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of label_change_logs.
     */
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * label_change_logs findFirstOrThrow
   */
  export type label_change_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter, which label_change_logs to fetch.
     */
    where?: label_change_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of label_change_logs to fetch.
     */
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for label_change_logs.
     */
    cursor?: label_change_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` label_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` label_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of label_change_logs.
     */
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * label_change_logs findMany
   */
  export type label_change_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter, which label_change_logs to fetch.
     */
    where?: label_change_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of label_change_logs to fetch.
     */
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing label_change_logs.
     */
    cursor?: label_change_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` label_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` label_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of label_change_logs.
     */
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * label_change_logs create
   */
  export type label_change_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * The data needed to create a label_change_logs.
     */
    data: XOR<label_change_logsCreateInput, label_change_logsUncheckedCreateInput>
  }

  /**
   * label_change_logs createMany
   */
  export type label_change_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many label_change_logs.
     */
    data: label_change_logsCreateManyInput | label_change_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * label_change_logs createManyAndReturn
   */
  export type label_change_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * The data used to create many label_change_logs.
     */
    data: label_change_logsCreateManyInput | label_change_logsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * label_change_logs update
   */
  export type label_change_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * The data needed to update a label_change_logs.
     */
    data: XOR<label_change_logsUpdateInput, label_change_logsUncheckedUpdateInput>
    /**
     * Choose, which label_change_logs to update.
     */
    where: label_change_logsWhereUniqueInput
  }

  /**
   * label_change_logs updateMany
   */
  export type label_change_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update label_change_logs.
     */
    data: XOR<label_change_logsUpdateManyMutationInput, label_change_logsUncheckedUpdateManyInput>
    /**
     * Filter which label_change_logs to update
     */
    where?: label_change_logsWhereInput
    /**
     * Limit how many label_change_logs to update.
     */
    limit?: number
  }

  /**
   * label_change_logs updateManyAndReturn
   */
  export type label_change_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * The data used to update label_change_logs.
     */
    data: XOR<label_change_logsUpdateManyMutationInput, label_change_logsUncheckedUpdateManyInput>
    /**
     * Filter which label_change_logs to update
     */
    where?: label_change_logsWhereInput
    /**
     * Limit how many label_change_logs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * label_change_logs upsert
   */
  export type label_change_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * The filter to search for the label_change_logs to update in case it exists.
     */
    where: label_change_logsWhereUniqueInput
    /**
     * In case the label_change_logs found by the `where` argument doesn't exist, create a new label_change_logs with this data.
     */
    create: XOR<label_change_logsCreateInput, label_change_logsUncheckedCreateInput>
    /**
     * In case the label_change_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<label_change_logsUpdateInput, label_change_logsUncheckedUpdateInput>
  }

  /**
   * label_change_logs delete
   */
  export type label_change_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    /**
     * Filter which label_change_logs to delete.
     */
    where: label_change_logsWhereUniqueInput
  }

  /**
   * label_change_logs deleteMany
   */
  export type label_change_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which label_change_logs to delete
     */
    where?: label_change_logsWhereInput
    /**
     * Limit how many label_change_logs to delete.
     */
    limit?: number
  }

  /**
   * label_change_logs without action
   */
  export type label_change_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
  }


  /**
   * Model pass_reviews
   */

  export type AggregatePass_reviews = {
    _count: Pass_reviewsCountAggregateOutputType | null
    _avg: Pass_reviewsAvgAggregateOutputType | null
    _sum: Pass_reviewsSumAggregateOutputType | null
    _min: Pass_reviewsMinAggregateOutputType | null
    _max: Pass_reviewsMaxAggregateOutputType | null
  }

  export type Pass_reviewsAvgAggregateOutputType = {
    id: number | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    test_average: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
  }

  export type Pass_reviewsSumAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    test_average: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
  }

  export type Pass_reviewsMinAggregateOutputType = {
    id: bigint | null
    review_id: string | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    pass_mem_group: string | null
    test_average: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    review_status: string | null
    teacher_decision: string | null
    teacher_comment: string | null
    confirmed_at: Date | null
    deadline: Date | null
    is_overdue: boolean | null
    escalated_to_lead: boolean | null
    lead_email_sent: boolean | null
    created_at: Date | null
  }

  export type Pass_reviewsMaxAggregateOutputType = {
    id: bigint | null
    review_id: string | null
    student_id: number | null
    class_id: number | null
    teacher_id: number | null
    pass_mem_group: string | null
    test_average: Decimal | null
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    review_status: string | null
    teacher_decision: string | null
    teacher_comment: string | null
    confirmed_at: Date | null
    deadline: Date | null
    is_overdue: boolean | null
    escalated_to_lead: boolean | null
    lead_email_sent: boolean | null
    created_at: Date | null
  }

  export type Pass_reviewsCountAggregateOutputType = {
    id: number
    review_id: number
    student_id: number
    class_id: number
    teacher_id: number
    pass_mem_group: number
    test_average: number
    attendance_pct: number
    homework_pct: number
    review_status: number
    teacher_decision: number
    teacher_comment: number
    confirmed_at: number
    deadline: number
    is_overdue: number
    escalated_to_lead: number
    lead_email_sent: number
    created_at: number
    _all: number
  }


  export type Pass_reviewsAvgAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    test_average?: true
    attendance_pct?: true
    homework_pct?: true
  }

  export type Pass_reviewsSumAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    test_average?: true
    attendance_pct?: true
    homework_pct?: true
  }

  export type Pass_reviewsMinAggregateInputType = {
    id?: true
    review_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    pass_mem_group?: true
    test_average?: true
    attendance_pct?: true
    homework_pct?: true
    review_status?: true
    teacher_decision?: true
    teacher_comment?: true
    confirmed_at?: true
    deadline?: true
    is_overdue?: true
    escalated_to_lead?: true
    lead_email_sent?: true
    created_at?: true
  }

  export type Pass_reviewsMaxAggregateInputType = {
    id?: true
    review_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    pass_mem_group?: true
    test_average?: true
    attendance_pct?: true
    homework_pct?: true
    review_status?: true
    teacher_decision?: true
    teacher_comment?: true
    confirmed_at?: true
    deadline?: true
    is_overdue?: true
    escalated_to_lead?: true
    lead_email_sent?: true
    created_at?: true
  }

  export type Pass_reviewsCountAggregateInputType = {
    id?: true
    review_id?: true
    student_id?: true
    class_id?: true
    teacher_id?: true
    pass_mem_group?: true
    test_average?: true
    attendance_pct?: true
    homework_pct?: true
    review_status?: true
    teacher_decision?: true
    teacher_comment?: true
    confirmed_at?: true
    deadline?: true
    is_overdue?: true
    escalated_to_lead?: true
    lead_email_sent?: true
    created_at?: true
    _all?: true
  }

  export type Pass_reviewsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pass_reviews to aggregate.
     */
    where?: pass_reviewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pass_reviews to fetch.
     */
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pass_reviewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pass_reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pass_reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pass_reviews
    **/
    _count?: true | Pass_reviewsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Pass_reviewsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Pass_reviewsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Pass_reviewsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Pass_reviewsMaxAggregateInputType
  }

  export type GetPass_reviewsAggregateType<T extends Pass_reviewsAggregateArgs> = {
        [P in keyof T & keyof AggregatePass_reviews]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePass_reviews[P]>
      : GetScalarType<T[P], AggregatePass_reviews[P]>
  }




  export type pass_reviewsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pass_reviewsWhereInput
    orderBy?: pass_reviewsOrderByWithAggregationInput | pass_reviewsOrderByWithAggregationInput[]
    by: Pass_reviewsScalarFieldEnum[] | Pass_reviewsScalarFieldEnum
    having?: pass_reviewsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Pass_reviewsCountAggregateInputType | true
    _avg?: Pass_reviewsAvgAggregateInputType
    _sum?: Pass_reviewsSumAggregateInputType
    _min?: Pass_reviewsMinAggregateInputType
    _max?: Pass_reviewsMaxAggregateInputType
  }

  export type Pass_reviewsGroupByOutputType = {
    id: bigint
    review_id: string
    student_id: number
    class_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal
    attendance_pct: Decimal | null
    homework_pct: Decimal | null
    review_status: string
    teacher_decision: string | null
    teacher_comment: string | null
    confirmed_at: Date | null
    deadline: Date
    is_overdue: boolean
    escalated_to_lead: boolean
    lead_email_sent: boolean
    created_at: Date
    _count: Pass_reviewsCountAggregateOutputType | null
    _avg: Pass_reviewsAvgAggregateOutputType | null
    _sum: Pass_reviewsSumAggregateOutputType | null
    _min: Pass_reviewsMinAggregateOutputType | null
    _max: Pass_reviewsMaxAggregateOutputType | null
  }

  type GetPass_reviewsGroupByPayload<T extends pass_reviewsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Pass_reviewsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Pass_reviewsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Pass_reviewsGroupByOutputType[P]>
            : GetScalarType<T[P], Pass_reviewsGroupByOutputType[P]>
        }
      >
    >


  export type pass_reviewsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    review_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    pass_mem_group?: boolean
    test_average?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    review_status?: boolean
    teacher_decision?: boolean
    teacher_comment?: boolean
    confirmed_at?: boolean
    deadline?: boolean
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pass_reviews"]>

  export type pass_reviewsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    review_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    pass_mem_group?: boolean
    test_average?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    review_status?: boolean
    teacher_decision?: boolean
    teacher_comment?: boolean
    confirmed_at?: boolean
    deadline?: boolean
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pass_reviews"]>

  export type pass_reviewsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    review_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    pass_mem_group?: boolean
    test_average?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    review_status?: boolean
    teacher_decision?: boolean
    teacher_comment?: boolean
    confirmed_at?: boolean
    deadline?: boolean
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pass_reviews"]>

  export type pass_reviewsSelectScalar = {
    id?: boolean
    review_id?: boolean
    student_id?: boolean
    class_id?: boolean
    teacher_id?: boolean
    pass_mem_group?: boolean
    test_average?: boolean
    attendance_pct?: boolean
    homework_pct?: boolean
    review_status?: boolean
    teacher_decision?: boolean
    teacher_comment?: boolean
    confirmed_at?: boolean
    deadline?: boolean
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: boolean
  }

  export type pass_reviewsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "review_id" | "student_id" | "class_id" | "teacher_id" | "pass_mem_group" | "test_average" | "attendance_pct" | "homework_pct" | "review_status" | "teacher_decision" | "teacher_comment" | "confirmed_at" | "deadline" | "is_overdue" | "escalated_to_lead" | "lead_email_sent" | "created_at", ExtArgs["result"]["pass_reviews"]>
  export type pass_reviewsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }
  export type pass_reviewsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }
  export type pass_reviewsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
    teachers?: boolean | teachersDefaultArgs<ExtArgs>
  }

  export type $pass_reviewsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pass_reviews"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>
      students: Prisma.$studentsPayload<ExtArgs>
      teachers: Prisma.$teachersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      review_id: string
      student_id: number
      class_id: number
      teacher_id: number
      pass_mem_group: string
      test_average: Prisma.Decimal
      attendance_pct: Prisma.Decimal | null
      homework_pct: Prisma.Decimal | null
      review_status: string
      teacher_decision: string | null
      teacher_comment: string | null
      confirmed_at: Date | null
      deadline: Date
      is_overdue: boolean
      escalated_to_lead: boolean
      lead_email_sent: boolean
      created_at: Date
    }, ExtArgs["result"]["pass_reviews"]>
    composites: {}
  }

  type pass_reviewsGetPayload<S extends boolean | null | undefined | pass_reviewsDefaultArgs> = $Result.GetResult<Prisma.$pass_reviewsPayload, S>

  type pass_reviewsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pass_reviewsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Pass_reviewsCountAggregateInputType | true
    }

  export interface pass_reviewsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pass_reviews'], meta: { name: 'pass_reviews' } }
    /**
     * Find zero or one Pass_reviews that matches the filter.
     * @param {pass_reviewsFindUniqueArgs} args - Arguments to find a Pass_reviews
     * @example
     * // Get one Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pass_reviewsFindUniqueArgs>(args: SelectSubset<T, pass_reviewsFindUniqueArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pass_reviews that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pass_reviewsFindUniqueOrThrowArgs} args - Arguments to find a Pass_reviews
     * @example
     * // Get one Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pass_reviewsFindUniqueOrThrowArgs>(args: SelectSubset<T, pass_reviewsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pass_reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsFindFirstArgs} args - Arguments to find a Pass_reviews
     * @example
     * // Get one Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pass_reviewsFindFirstArgs>(args?: SelectSubset<T, pass_reviewsFindFirstArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pass_reviews that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsFindFirstOrThrowArgs} args - Arguments to find a Pass_reviews
     * @example
     * // Get one Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pass_reviewsFindFirstOrThrowArgs>(args?: SelectSubset<T, pass_reviewsFindFirstOrThrowArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pass_reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findMany()
     * 
     * // Get first 10 Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pass_reviewsWithIdOnly = await prisma.pass_reviews.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends pass_reviewsFindManyArgs>(args?: SelectSubset<T, pass_reviewsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pass_reviews.
     * @param {pass_reviewsCreateArgs} args - Arguments to create a Pass_reviews.
     * @example
     * // Create one Pass_reviews
     * const Pass_reviews = await prisma.pass_reviews.create({
     *   data: {
     *     // ... data to create a Pass_reviews
     *   }
     * })
     * 
     */
    create<T extends pass_reviewsCreateArgs>(args: SelectSubset<T, pass_reviewsCreateArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pass_reviews.
     * @param {pass_reviewsCreateManyArgs} args - Arguments to create many Pass_reviews.
     * @example
     * // Create many Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pass_reviewsCreateManyArgs>(args?: SelectSubset<T, pass_reviewsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pass_reviews and returns the data saved in the database.
     * @param {pass_reviewsCreateManyAndReturnArgs} args - Arguments to create many Pass_reviews.
     * @example
     * // Create many Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pass_reviews and only return the `id`
     * const pass_reviewsWithIdOnly = await prisma.pass_reviews.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends pass_reviewsCreateManyAndReturnArgs>(args?: SelectSubset<T, pass_reviewsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pass_reviews.
     * @param {pass_reviewsDeleteArgs} args - Arguments to delete one Pass_reviews.
     * @example
     * // Delete one Pass_reviews
     * const Pass_reviews = await prisma.pass_reviews.delete({
     *   where: {
     *     // ... filter to delete one Pass_reviews
     *   }
     * })
     * 
     */
    delete<T extends pass_reviewsDeleteArgs>(args: SelectSubset<T, pass_reviewsDeleteArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pass_reviews.
     * @param {pass_reviewsUpdateArgs} args - Arguments to update one Pass_reviews.
     * @example
     * // Update one Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pass_reviewsUpdateArgs>(args: SelectSubset<T, pass_reviewsUpdateArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pass_reviews.
     * @param {pass_reviewsDeleteManyArgs} args - Arguments to filter Pass_reviews to delete.
     * @example
     * // Delete a few Pass_reviews
     * const { count } = await prisma.pass_reviews.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pass_reviewsDeleteManyArgs>(args?: SelectSubset<T, pass_reviewsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pass_reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pass_reviewsUpdateManyArgs>(args: SelectSubset<T, pass_reviewsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pass_reviews and returns the data updated in the database.
     * @param {pass_reviewsUpdateManyAndReturnArgs} args - Arguments to update many Pass_reviews.
     * @example
     * // Update many Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pass_reviews and only return the `id`
     * const pass_reviewsWithIdOnly = await prisma.pass_reviews.updateManyAndReturn({
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
    updateManyAndReturn<T extends pass_reviewsUpdateManyAndReturnArgs>(args: SelectSubset<T, pass_reviewsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pass_reviews.
     * @param {pass_reviewsUpsertArgs} args - Arguments to update or create a Pass_reviews.
     * @example
     * // Update or create a Pass_reviews
     * const pass_reviews = await prisma.pass_reviews.upsert({
     *   create: {
     *     // ... data to create a Pass_reviews
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pass_reviews we want to update
     *   }
     * })
     */
    upsert<T extends pass_reviewsUpsertArgs>(args: SelectSubset<T, pass_reviewsUpsertArgs<ExtArgs>>): Prisma__pass_reviewsClient<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pass_reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsCountArgs} args - Arguments to filter Pass_reviews to count.
     * @example
     * // Count the number of Pass_reviews
     * const count = await prisma.pass_reviews.count({
     *   where: {
     *     // ... the filter for the Pass_reviews we want to count
     *   }
     * })
    **/
    count<T extends pass_reviewsCountArgs>(
      args?: Subset<T, pass_reviewsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Pass_reviewsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pass_reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Pass_reviewsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Pass_reviewsAggregateArgs>(args: Subset<T, Pass_reviewsAggregateArgs>): Prisma.PrismaPromise<GetPass_reviewsAggregateType<T>>

    /**
     * Group by Pass_reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pass_reviewsGroupByArgs} args - Group by arguments.
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
      T extends pass_reviewsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pass_reviewsGroupByArgs['orderBy'] }
        : { orderBy?: pass_reviewsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, pass_reviewsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPass_reviewsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pass_reviews model
   */
  readonly fields: pass_reviewsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pass_reviews.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pass_reviewsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    students<T extends studentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, studentsDefaultArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    teachers<T extends teachersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, teachersDefaultArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the pass_reviews model
   */
  interface pass_reviewsFieldRefs {
    readonly id: FieldRef<"pass_reviews", 'BigInt'>
    readonly review_id: FieldRef<"pass_reviews", 'String'>
    readonly student_id: FieldRef<"pass_reviews", 'Int'>
    readonly class_id: FieldRef<"pass_reviews", 'Int'>
    readonly teacher_id: FieldRef<"pass_reviews", 'Int'>
    readonly pass_mem_group: FieldRef<"pass_reviews", 'String'>
    readonly test_average: FieldRef<"pass_reviews", 'Decimal'>
    readonly attendance_pct: FieldRef<"pass_reviews", 'Decimal'>
    readonly homework_pct: FieldRef<"pass_reviews", 'Decimal'>
    readonly review_status: FieldRef<"pass_reviews", 'String'>
    readonly teacher_decision: FieldRef<"pass_reviews", 'String'>
    readonly teacher_comment: FieldRef<"pass_reviews", 'String'>
    readonly confirmed_at: FieldRef<"pass_reviews", 'DateTime'>
    readonly deadline: FieldRef<"pass_reviews", 'DateTime'>
    readonly is_overdue: FieldRef<"pass_reviews", 'Boolean'>
    readonly escalated_to_lead: FieldRef<"pass_reviews", 'Boolean'>
    readonly lead_email_sent: FieldRef<"pass_reviews", 'Boolean'>
    readonly created_at: FieldRef<"pass_reviews", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * pass_reviews findUnique
   */
  export type pass_reviewsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter, which pass_reviews to fetch.
     */
    where: pass_reviewsWhereUniqueInput
  }

  /**
   * pass_reviews findUniqueOrThrow
   */
  export type pass_reviewsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter, which pass_reviews to fetch.
     */
    where: pass_reviewsWhereUniqueInput
  }

  /**
   * pass_reviews findFirst
   */
  export type pass_reviewsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter, which pass_reviews to fetch.
     */
    where?: pass_reviewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pass_reviews to fetch.
     */
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pass_reviews.
     */
    cursor?: pass_reviewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pass_reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pass_reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pass_reviews.
     */
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * pass_reviews findFirstOrThrow
   */
  export type pass_reviewsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter, which pass_reviews to fetch.
     */
    where?: pass_reviewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pass_reviews to fetch.
     */
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pass_reviews.
     */
    cursor?: pass_reviewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pass_reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pass_reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pass_reviews.
     */
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * pass_reviews findMany
   */
  export type pass_reviewsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter, which pass_reviews to fetch.
     */
    where?: pass_reviewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pass_reviews to fetch.
     */
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pass_reviews.
     */
    cursor?: pass_reviewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pass_reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pass_reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pass_reviews.
     */
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * pass_reviews create
   */
  export type pass_reviewsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * The data needed to create a pass_reviews.
     */
    data: XOR<pass_reviewsCreateInput, pass_reviewsUncheckedCreateInput>
  }

  /**
   * pass_reviews createMany
   */
  export type pass_reviewsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pass_reviews.
     */
    data: pass_reviewsCreateManyInput | pass_reviewsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pass_reviews createManyAndReturn
   */
  export type pass_reviewsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * The data used to create many pass_reviews.
     */
    data: pass_reviewsCreateManyInput | pass_reviewsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * pass_reviews update
   */
  export type pass_reviewsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * The data needed to update a pass_reviews.
     */
    data: XOR<pass_reviewsUpdateInput, pass_reviewsUncheckedUpdateInput>
    /**
     * Choose, which pass_reviews to update.
     */
    where: pass_reviewsWhereUniqueInput
  }

  /**
   * pass_reviews updateMany
   */
  export type pass_reviewsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pass_reviews.
     */
    data: XOR<pass_reviewsUpdateManyMutationInput, pass_reviewsUncheckedUpdateManyInput>
    /**
     * Filter which pass_reviews to update
     */
    where?: pass_reviewsWhereInput
    /**
     * Limit how many pass_reviews to update.
     */
    limit?: number
  }

  /**
   * pass_reviews updateManyAndReturn
   */
  export type pass_reviewsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * The data used to update pass_reviews.
     */
    data: XOR<pass_reviewsUpdateManyMutationInput, pass_reviewsUncheckedUpdateManyInput>
    /**
     * Filter which pass_reviews to update
     */
    where?: pass_reviewsWhereInput
    /**
     * Limit how many pass_reviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * pass_reviews upsert
   */
  export type pass_reviewsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * The filter to search for the pass_reviews to update in case it exists.
     */
    where: pass_reviewsWhereUniqueInput
    /**
     * In case the pass_reviews found by the `where` argument doesn't exist, create a new pass_reviews with this data.
     */
    create: XOR<pass_reviewsCreateInput, pass_reviewsUncheckedCreateInput>
    /**
     * In case the pass_reviews was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pass_reviewsUpdateInput, pass_reviewsUncheckedUpdateInput>
  }

  /**
   * pass_reviews delete
   */
  export type pass_reviewsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    /**
     * Filter which pass_reviews to delete.
     */
    where: pass_reviewsWhereUniqueInput
  }

  /**
   * pass_reviews deleteMany
   */
  export type pass_reviewsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pass_reviews to delete
     */
    where?: pass_reviewsWhereInput
    /**
     * Limit how many pass_reviews to delete.
     */
    limit?: number
  }

  /**
   * pass_reviews without action
   */
  export type pass_reviewsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
  }


  /**
   * Model student_daily_records
   */

  export type AggregateStudent_daily_records = {
    _count: Student_daily_recordsCountAggregateOutputType | null
    _avg: Student_daily_recordsAvgAggregateOutputType | null
    _sum: Student_daily_recordsSumAggregateOutputType | null
    _min: Student_daily_recordsMinAggregateOutputType | null
    _max: Student_daily_recordsMaxAggregateOutputType | null
  }

  export type Student_daily_recordsAvgAggregateOutputType = {
    id: number | null
    student_id: number | null
    class_id: number | null
    attendance_pct: Decimal | null
    attendance_present: number | null
    attendance_total: number | null
    homework_pct: Decimal | null
    homework_done: number | null
    homework_total: number | null
    test_1: Decimal | null
    test_2: Decimal | null
    test_3: Decimal | null
    test_4: Decimal | null
    test_5: Decimal | null
    test_6: Decimal | null
    tests_taken: number | null
    test_average: Decimal | null
  }

  export type Student_daily_recordsSumAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    attendance_pct: Decimal | null
    attendance_present: number | null
    attendance_total: number | null
    homework_pct: Decimal | null
    homework_done: number | null
    homework_total: number | null
    test_1: Decimal | null
    test_2: Decimal | null
    test_3: Decimal | null
    test_4: Decimal | null
    test_5: Decimal | null
    test_6: Decimal | null
    tests_taken: number | null
    test_average: Decimal | null
  }

  export type Student_daily_recordsMinAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    record_date: Date | null
    attendance_pct: Decimal | null
    attendance_present: number | null
    attendance_total: number | null
    homework_pct: Decimal | null
    homework_done: number | null
    homework_total: number | null
    test_1: Decimal | null
    test_2: Decimal | null
    test_3: Decimal | null
    test_4: Decimal | null
    test_5: Decimal | null
    test_6: Decimal | null
    tests_taken: number | null
    test_average: Decimal | null
    current_label: string | null
    previous_label: string | null
    benchmark_label: string | null
    has_label_changed: boolean | null
    label_change_direction: string | null
    last_checkpoint: string | null
    pass_chuan_status: string | null
    pass_chuan_reasons: string | null
    pass_mem_status: string | null
    pass_mem_group: string | null
    pass_mem_label: string | null
    flag_attendance_drop: boolean | null
    flag_homework_drop: boolean | null
    flag_cheating: boolean | null
    flag_needs_review: boolean | null
    teacher_feedback_btvn: string | null
    teacher_feedback_orient: string | null
    teacher_note: string | null
    teacher_temp_label: string | null
    scraped_at: Date | null
  }

  export type Student_daily_recordsMaxAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    record_date: Date | null
    attendance_pct: Decimal | null
    attendance_present: number | null
    attendance_total: number | null
    homework_pct: Decimal | null
    homework_done: number | null
    homework_total: number | null
    test_1: Decimal | null
    test_2: Decimal | null
    test_3: Decimal | null
    test_4: Decimal | null
    test_5: Decimal | null
    test_6: Decimal | null
    tests_taken: number | null
    test_average: Decimal | null
    current_label: string | null
    previous_label: string | null
    benchmark_label: string | null
    has_label_changed: boolean | null
    label_change_direction: string | null
    last_checkpoint: string | null
    pass_chuan_status: string | null
    pass_chuan_reasons: string | null
    pass_mem_status: string | null
    pass_mem_group: string | null
    pass_mem_label: string | null
    flag_attendance_drop: boolean | null
    flag_homework_drop: boolean | null
    flag_cheating: boolean | null
    flag_needs_review: boolean | null
    teacher_feedback_btvn: string | null
    teacher_feedback_orient: string | null
    teacher_note: string | null
    teacher_temp_label: string | null
    scraped_at: Date | null
  }

  export type Student_daily_recordsCountAggregateOutputType = {
    id: number
    student_id: number
    class_id: number
    record_date: number
    attendance_pct: number
    attendance_present: number
    attendance_total: number
    homework_pct: number
    homework_done: number
    homework_total: number
    test_1: number
    test_2: number
    test_3: number
    test_4: number
    test_5: number
    test_6: number
    tests_taken: number
    test_average: number
    current_label: number
    previous_label: number
    benchmark_label: number
    has_label_changed: number
    label_change_direction: number
    last_checkpoint: number
    pass_chuan_status: number
    pass_chuan_reasons: number
    pass_mem_status: number
    pass_mem_group: number
    pass_mem_label: number
    flag_attendance_drop: number
    flag_homework_drop: number
    flag_cheating: number
    flag_needs_review: number
    teacher_feedback_btvn: number
    teacher_feedback_orient: number
    teacher_note: number
    teacher_temp_label: number
    scraped_at: number
    _all: number
  }


  export type Student_daily_recordsAvgAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    attendance_pct?: true
    attendance_present?: true
    attendance_total?: true
    homework_pct?: true
    homework_done?: true
    homework_total?: true
    test_1?: true
    test_2?: true
    test_3?: true
    test_4?: true
    test_5?: true
    test_6?: true
    tests_taken?: true
    test_average?: true
  }

  export type Student_daily_recordsSumAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    attendance_pct?: true
    attendance_present?: true
    attendance_total?: true
    homework_pct?: true
    homework_done?: true
    homework_total?: true
    test_1?: true
    test_2?: true
    test_3?: true
    test_4?: true
    test_5?: true
    test_6?: true
    tests_taken?: true
    test_average?: true
  }

  export type Student_daily_recordsMinAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    record_date?: true
    attendance_pct?: true
    attendance_present?: true
    attendance_total?: true
    homework_pct?: true
    homework_done?: true
    homework_total?: true
    test_1?: true
    test_2?: true
    test_3?: true
    test_4?: true
    test_5?: true
    test_6?: true
    tests_taken?: true
    test_average?: true
    current_label?: true
    previous_label?: true
    benchmark_label?: true
    has_label_changed?: true
    label_change_direction?: true
    last_checkpoint?: true
    pass_chuan_status?: true
    pass_chuan_reasons?: true
    pass_mem_status?: true
    pass_mem_group?: true
    pass_mem_label?: true
    flag_attendance_drop?: true
    flag_homework_drop?: true
    flag_cheating?: true
    flag_needs_review?: true
    teacher_feedback_btvn?: true
    teacher_feedback_orient?: true
    teacher_note?: true
    teacher_temp_label?: true
    scraped_at?: true
  }

  export type Student_daily_recordsMaxAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    record_date?: true
    attendance_pct?: true
    attendance_present?: true
    attendance_total?: true
    homework_pct?: true
    homework_done?: true
    homework_total?: true
    test_1?: true
    test_2?: true
    test_3?: true
    test_4?: true
    test_5?: true
    test_6?: true
    tests_taken?: true
    test_average?: true
    current_label?: true
    previous_label?: true
    benchmark_label?: true
    has_label_changed?: true
    label_change_direction?: true
    last_checkpoint?: true
    pass_chuan_status?: true
    pass_chuan_reasons?: true
    pass_mem_status?: true
    pass_mem_group?: true
    pass_mem_label?: true
    flag_attendance_drop?: true
    flag_homework_drop?: true
    flag_cheating?: true
    flag_needs_review?: true
    teacher_feedback_btvn?: true
    teacher_feedback_orient?: true
    teacher_note?: true
    teacher_temp_label?: true
    scraped_at?: true
  }

  export type Student_daily_recordsCountAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    record_date?: true
    attendance_pct?: true
    attendance_present?: true
    attendance_total?: true
    homework_pct?: true
    homework_done?: true
    homework_total?: true
    test_1?: true
    test_2?: true
    test_3?: true
    test_4?: true
    test_5?: true
    test_6?: true
    tests_taken?: true
    test_average?: true
    current_label?: true
    previous_label?: true
    benchmark_label?: true
    has_label_changed?: true
    label_change_direction?: true
    last_checkpoint?: true
    pass_chuan_status?: true
    pass_chuan_reasons?: true
    pass_mem_status?: true
    pass_mem_group?: true
    pass_mem_label?: true
    flag_attendance_drop?: true
    flag_homework_drop?: true
    flag_cheating?: true
    flag_needs_review?: true
    teacher_feedback_btvn?: true
    teacher_feedback_orient?: true
    teacher_note?: true
    teacher_temp_label?: true
    scraped_at?: true
    _all?: true
  }

  export type Student_daily_recordsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which student_daily_records to aggregate.
     */
    where?: student_daily_recordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_daily_records to fetch.
     */
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: student_daily_recordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_daily_records from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_daily_records.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned student_daily_records
    **/
    _count?: true | Student_daily_recordsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Student_daily_recordsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Student_daily_recordsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Student_daily_recordsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Student_daily_recordsMaxAggregateInputType
  }

  export type GetStudent_daily_recordsAggregateType<T extends Student_daily_recordsAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent_daily_records]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent_daily_records[P]>
      : GetScalarType<T[P], AggregateStudent_daily_records[P]>
  }




  export type student_daily_recordsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: student_daily_recordsWhereInput
    orderBy?: student_daily_recordsOrderByWithAggregationInput | student_daily_recordsOrderByWithAggregationInput[]
    by: Student_daily_recordsScalarFieldEnum[] | Student_daily_recordsScalarFieldEnum
    having?: student_daily_recordsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Student_daily_recordsCountAggregateInputType | true
    _avg?: Student_daily_recordsAvgAggregateInputType
    _sum?: Student_daily_recordsSumAggregateInputType
    _min?: Student_daily_recordsMinAggregateInputType
    _max?: Student_daily_recordsMaxAggregateInputType
  }

  export type Student_daily_recordsGroupByOutputType = {
    id: bigint
    student_id: number
    class_id: number
    record_date: Date
    attendance_pct: Decimal | null
    attendance_present: number | null
    attendance_total: number | null
    homework_pct: Decimal | null
    homework_done: number | null
    homework_total: number | null
    test_1: Decimal | null
    test_2: Decimal | null
    test_3: Decimal | null
    test_4: Decimal | null
    test_5: Decimal | null
    test_6: Decimal | null
    tests_taken: number | null
    test_average: Decimal | null
    current_label: string | null
    previous_label: string | null
    benchmark_label: string | null
    has_label_changed: boolean | null
    label_change_direction: string | null
    last_checkpoint: string | null
    pass_chuan_status: string | null
    pass_chuan_reasons: string | null
    pass_mem_status: string | null
    pass_mem_group: string | null
    pass_mem_label: string | null
    flag_attendance_drop: boolean | null
    flag_homework_drop: boolean | null
    flag_cheating: boolean | null
    flag_needs_review: boolean | null
    teacher_feedback_btvn: string | null
    teacher_feedback_orient: string | null
    teacher_note: string | null
    teacher_temp_label: string | null
    scraped_at: Date
    _count: Student_daily_recordsCountAggregateOutputType | null
    _avg: Student_daily_recordsAvgAggregateOutputType | null
    _sum: Student_daily_recordsSumAggregateOutputType | null
    _min: Student_daily_recordsMinAggregateOutputType | null
    _max: Student_daily_recordsMaxAggregateOutputType | null
  }

  type GetStudent_daily_recordsGroupByPayload<T extends student_daily_recordsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Student_daily_recordsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Student_daily_recordsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Student_daily_recordsGroupByOutputType[P]>
            : GetScalarType<T[P], Student_daily_recordsGroupByOutputType[P]>
        }
      >
    >


  export type student_daily_recordsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    record_date?: boolean
    attendance_pct?: boolean
    attendance_present?: boolean
    attendance_total?: boolean
    homework_pct?: boolean
    homework_done?: boolean
    homework_total?: boolean
    test_1?: boolean
    test_2?: boolean
    test_3?: boolean
    test_4?: boolean
    test_5?: boolean
    test_6?: boolean
    tests_taken?: boolean
    test_average?: boolean
    current_label?: boolean
    previous_label?: boolean
    benchmark_label?: boolean
    has_label_changed?: boolean
    label_change_direction?: boolean
    last_checkpoint?: boolean
    pass_chuan_status?: boolean
    pass_chuan_reasons?: boolean
    pass_mem_status?: boolean
    pass_mem_group?: boolean
    pass_mem_label?: boolean
    flag_attendance_drop?: boolean
    flag_homework_drop?: boolean
    flag_cheating?: boolean
    flag_needs_review?: boolean
    teacher_feedback_btvn?: boolean
    teacher_feedback_orient?: boolean
    teacher_note?: boolean
    teacher_temp_label?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student_daily_records"]>

  export type student_daily_recordsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    record_date?: boolean
    attendance_pct?: boolean
    attendance_present?: boolean
    attendance_total?: boolean
    homework_pct?: boolean
    homework_done?: boolean
    homework_total?: boolean
    test_1?: boolean
    test_2?: boolean
    test_3?: boolean
    test_4?: boolean
    test_5?: boolean
    test_6?: boolean
    tests_taken?: boolean
    test_average?: boolean
    current_label?: boolean
    previous_label?: boolean
    benchmark_label?: boolean
    has_label_changed?: boolean
    label_change_direction?: boolean
    last_checkpoint?: boolean
    pass_chuan_status?: boolean
    pass_chuan_reasons?: boolean
    pass_mem_status?: boolean
    pass_mem_group?: boolean
    pass_mem_label?: boolean
    flag_attendance_drop?: boolean
    flag_homework_drop?: boolean
    flag_cheating?: boolean
    flag_needs_review?: boolean
    teacher_feedback_btvn?: boolean
    teacher_feedback_orient?: boolean
    teacher_note?: boolean
    teacher_temp_label?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student_daily_records"]>

  export type student_daily_recordsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    record_date?: boolean
    attendance_pct?: boolean
    attendance_present?: boolean
    attendance_total?: boolean
    homework_pct?: boolean
    homework_done?: boolean
    homework_total?: boolean
    test_1?: boolean
    test_2?: boolean
    test_3?: boolean
    test_4?: boolean
    test_5?: boolean
    test_6?: boolean
    tests_taken?: boolean
    test_average?: boolean
    current_label?: boolean
    previous_label?: boolean
    benchmark_label?: boolean
    has_label_changed?: boolean
    label_change_direction?: boolean
    last_checkpoint?: boolean
    pass_chuan_status?: boolean
    pass_chuan_reasons?: boolean
    pass_mem_status?: boolean
    pass_mem_group?: boolean
    pass_mem_label?: boolean
    flag_attendance_drop?: boolean
    flag_homework_drop?: boolean
    flag_cheating?: boolean
    flag_needs_review?: boolean
    teacher_feedback_btvn?: boolean
    teacher_feedback_orient?: boolean
    teacher_note?: boolean
    teacher_temp_label?: boolean
    scraped_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student_daily_records"]>

  export type student_daily_recordsSelectScalar = {
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    record_date?: boolean
    attendance_pct?: boolean
    attendance_present?: boolean
    attendance_total?: boolean
    homework_pct?: boolean
    homework_done?: boolean
    homework_total?: boolean
    test_1?: boolean
    test_2?: boolean
    test_3?: boolean
    test_4?: boolean
    test_5?: boolean
    test_6?: boolean
    tests_taken?: boolean
    test_average?: boolean
    current_label?: boolean
    previous_label?: boolean
    benchmark_label?: boolean
    has_label_changed?: boolean
    label_change_direction?: boolean
    last_checkpoint?: boolean
    pass_chuan_status?: boolean
    pass_chuan_reasons?: boolean
    pass_mem_status?: boolean
    pass_mem_group?: boolean
    pass_mem_label?: boolean
    flag_attendance_drop?: boolean
    flag_homework_drop?: boolean
    flag_cheating?: boolean
    flag_needs_review?: boolean
    teacher_feedback_btvn?: boolean
    teacher_feedback_orient?: boolean
    teacher_note?: boolean
    teacher_temp_label?: boolean
    scraped_at?: boolean
  }

  export type student_daily_recordsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "student_id" | "class_id" | "record_date" | "attendance_pct" | "attendance_present" | "attendance_total" | "homework_pct" | "homework_done" | "homework_total" | "test_1" | "test_2" | "test_3" | "test_4" | "test_5" | "test_6" | "tests_taken" | "test_average" | "current_label" | "previous_label" | "benchmark_label" | "has_label_changed" | "label_change_direction" | "last_checkpoint" | "pass_chuan_status" | "pass_chuan_reasons" | "pass_mem_status" | "pass_mem_group" | "pass_mem_label" | "flag_attendance_drop" | "flag_homework_drop" | "flag_cheating" | "flag_needs_review" | "teacher_feedback_btvn" | "teacher_feedback_orient" | "teacher_note" | "teacher_temp_label" | "scraped_at", ExtArgs["result"]["student_daily_records"]>
  export type student_daily_recordsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }
  export type student_daily_recordsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }
  export type student_daily_recordsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }

  export type $student_daily_recordsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "student_daily_records"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>
      students: Prisma.$studentsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      student_id: number
      class_id: number
      record_date: Date
      attendance_pct: Prisma.Decimal | null
      attendance_present: number | null
      attendance_total: number | null
      homework_pct: Prisma.Decimal | null
      homework_done: number | null
      homework_total: number | null
      test_1: Prisma.Decimal | null
      test_2: Prisma.Decimal | null
      test_3: Prisma.Decimal | null
      test_4: Prisma.Decimal | null
      test_5: Prisma.Decimal | null
      test_6: Prisma.Decimal | null
      tests_taken: number | null
      test_average: Prisma.Decimal | null
      current_label: string | null
      previous_label: string | null
      benchmark_label: string | null
      has_label_changed: boolean | null
      label_change_direction: string | null
      last_checkpoint: string | null
      pass_chuan_status: string | null
      pass_chuan_reasons: string | null
      pass_mem_status: string | null
      pass_mem_group: string | null
      pass_mem_label: string | null
      flag_attendance_drop: boolean | null
      flag_homework_drop: boolean | null
      flag_cheating: boolean | null
      flag_needs_review: boolean | null
      teacher_feedback_btvn: string | null
      teacher_feedback_orient: string | null
      teacher_note: string | null
      teacher_temp_label: string | null
      scraped_at: Date
    }, ExtArgs["result"]["student_daily_records"]>
    composites: {}
  }

  type student_daily_recordsGetPayload<S extends boolean | null | undefined | student_daily_recordsDefaultArgs> = $Result.GetResult<Prisma.$student_daily_recordsPayload, S>

  type student_daily_recordsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<student_daily_recordsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Student_daily_recordsCountAggregateInputType | true
    }

  export interface student_daily_recordsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['student_daily_records'], meta: { name: 'student_daily_records' } }
    /**
     * Find zero or one Student_daily_records that matches the filter.
     * @param {student_daily_recordsFindUniqueArgs} args - Arguments to find a Student_daily_records
     * @example
     * // Get one Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends student_daily_recordsFindUniqueArgs>(args: SelectSubset<T, student_daily_recordsFindUniqueArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student_daily_records that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {student_daily_recordsFindUniqueOrThrowArgs} args - Arguments to find a Student_daily_records
     * @example
     * // Get one Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends student_daily_recordsFindUniqueOrThrowArgs>(args: SelectSubset<T, student_daily_recordsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student_daily_records that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsFindFirstArgs} args - Arguments to find a Student_daily_records
     * @example
     * // Get one Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends student_daily_recordsFindFirstArgs>(args?: SelectSubset<T, student_daily_recordsFindFirstArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student_daily_records that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsFindFirstOrThrowArgs} args - Arguments to find a Student_daily_records
     * @example
     * // Get one Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends student_daily_recordsFindFirstOrThrowArgs>(args?: SelectSubset<T, student_daily_recordsFindFirstOrThrowArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Student_daily_records that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findMany()
     * 
     * // Get first 10 Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const student_daily_recordsWithIdOnly = await prisma.student_daily_records.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends student_daily_recordsFindManyArgs>(args?: SelectSubset<T, student_daily_recordsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student_daily_records.
     * @param {student_daily_recordsCreateArgs} args - Arguments to create a Student_daily_records.
     * @example
     * // Create one Student_daily_records
     * const Student_daily_records = await prisma.student_daily_records.create({
     *   data: {
     *     // ... data to create a Student_daily_records
     *   }
     * })
     * 
     */
    create<T extends student_daily_recordsCreateArgs>(args: SelectSubset<T, student_daily_recordsCreateArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Student_daily_records.
     * @param {student_daily_recordsCreateManyArgs} args - Arguments to create many Student_daily_records.
     * @example
     * // Create many Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends student_daily_recordsCreateManyArgs>(args?: SelectSubset<T, student_daily_recordsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Student_daily_records and returns the data saved in the database.
     * @param {student_daily_recordsCreateManyAndReturnArgs} args - Arguments to create many Student_daily_records.
     * @example
     * // Create many Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Student_daily_records and only return the `id`
     * const student_daily_recordsWithIdOnly = await prisma.student_daily_records.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends student_daily_recordsCreateManyAndReturnArgs>(args?: SelectSubset<T, student_daily_recordsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student_daily_records.
     * @param {student_daily_recordsDeleteArgs} args - Arguments to delete one Student_daily_records.
     * @example
     * // Delete one Student_daily_records
     * const Student_daily_records = await prisma.student_daily_records.delete({
     *   where: {
     *     // ... filter to delete one Student_daily_records
     *   }
     * })
     * 
     */
    delete<T extends student_daily_recordsDeleteArgs>(args: SelectSubset<T, student_daily_recordsDeleteArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student_daily_records.
     * @param {student_daily_recordsUpdateArgs} args - Arguments to update one Student_daily_records.
     * @example
     * // Update one Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends student_daily_recordsUpdateArgs>(args: SelectSubset<T, student_daily_recordsUpdateArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Student_daily_records.
     * @param {student_daily_recordsDeleteManyArgs} args - Arguments to filter Student_daily_records to delete.
     * @example
     * // Delete a few Student_daily_records
     * const { count } = await prisma.student_daily_records.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends student_daily_recordsDeleteManyArgs>(args?: SelectSubset<T, student_daily_recordsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Student_daily_records.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends student_daily_recordsUpdateManyArgs>(args: SelectSubset<T, student_daily_recordsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Student_daily_records and returns the data updated in the database.
     * @param {student_daily_recordsUpdateManyAndReturnArgs} args - Arguments to update many Student_daily_records.
     * @example
     * // Update many Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Student_daily_records and only return the `id`
     * const student_daily_recordsWithIdOnly = await prisma.student_daily_records.updateManyAndReturn({
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
    updateManyAndReturn<T extends student_daily_recordsUpdateManyAndReturnArgs>(args: SelectSubset<T, student_daily_recordsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student_daily_records.
     * @param {student_daily_recordsUpsertArgs} args - Arguments to update or create a Student_daily_records.
     * @example
     * // Update or create a Student_daily_records
     * const student_daily_records = await prisma.student_daily_records.upsert({
     *   create: {
     *     // ... data to create a Student_daily_records
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student_daily_records we want to update
     *   }
     * })
     */
    upsert<T extends student_daily_recordsUpsertArgs>(args: SelectSubset<T, student_daily_recordsUpsertArgs<ExtArgs>>): Prisma__student_daily_recordsClient<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Student_daily_records.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsCountArgs} args - Arguments to filter Student_daily_records to count.
     * @example
     * // Count the number of Student_daily_records
     * const count = await prisma.student_daily_records.count({
     *   where: {
     *     // ... the filter for the Student_daily_records we want to count
     *   }
     * })
    **/
    count<T extends student_daily_recordsCountArgs>(
      args?: Subset<T, student_daily_recordsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Student_daily_recordsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student_daily_records.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Student_daily_recordsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Student_daily_recordsAggregateArgs>(args: Subset<T, Student_daily_recordsAggregateArgs>): Prisma.PrismaPromise<GetStudent_daily_recordsAggregateType<T>>

    /**
     * Group by Student_daily_records.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {student_daily_recordsGroupByArgs} args - Group by arguments.
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
      T extends student_daily_recordsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: student_daily_recordsGroupByArgs['orderBy'] }
        : { orderBy?: student_daily_recordsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, student_daily_recordsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudent_daily_recordsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the student_daily_records model
   */
  readonly fields: student_daily_recordsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for student_daily_records.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__student_daily_recordsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    students<T extends studentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, studentsDefaultArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the student_daily_records model
   */
  interface student_daily_recordsFieldRefs {
    readonly id: FieldRef<"student_daily_records", 'BigInt'>
    readonly student_id: FieldRef<"student_daily_records", 'Int'>
    readonly class_id: FieldRef<"student_daily_records", 'Int'>
    readonly record_date: FieldRef<"student_daily_records", 'DateTime'>
    readonly attendance_pct: FieldRef<"student_daily_records", 'Decimal'>
    readonly attendance_present: FieldRef<"student_daily_records", 'Int'>
    readonly attendance_total: FieldRef<"student_daily_records", 'Int'>
    readonly homework_pct: FieldRef<"student_daily_records", 'Decimal'>
    readonly homework_done: FieldRef<"student_daily_records", 'Int'>
    readonly homework_total: FieldRef<"student_daily_records", 'Int'>
    readonly test_1: FieldRef<"student_daily_records", 'Decimal'>
    readonly test_2: FieldRef<"student_daily_records", 'Decimal'>
    readonly test_3: FieldRef<"student_daily_records", 'Decimal'>
    readonly test_4: FieldRef<"student_daily_records", 'Decimal'>
    readonly test_5: FieldRef<"student_daily_records", 'Decimal'>
    readonly test_6: FieldRef<"student_daily_records", 'Decimal'>
    readonly tests_taken: FieldRef<"student_daily_records", 'Int'>
    readonly test_average: FieldRef<"student_daily_records", 'Decimal'>
    readonly current_label: FieldRef<"student_daily_records", 'String'>
    readonly previous_label: FieldRef<"student_daily_records", 'String'>
    readonly benchmark_label: FieldRef<"student_daily_records", 'String'>
    readonly has_label_changed: FieldRef<"student_daily_records", 'Boolean'>
    readonly label_change_direction: FieldRef<"student_daily_records", 'String'>
    readonly last_checkpoint: FieldRef<"student_daily_records", 'String'>
    readonly pass_chuan_status: FieldRef<"student_daily_records", 'String'>
    readonly pass_chuan_reasons: FieldRef<"student_daily_records", 'String'>
    readonly pass_mem_status: FieldRef<"student_daily_records", 'String'>
    readonly pass_mem_group: FieldRef<"student_daily_records", 'String'>
    readonly pass_mem_label: FieldRef<"student_daily_records", 'String'>
    readonly flag_attendance_drop: FieldRef<"student_daily_records", 'Boolean'>
    readonly flag_homework_drop: FieldRef<"student_daily_records", 'Boolean'>
    readonly flag_cheating: FieldRef<"student_daily_records", 'Boolean'>
    readonly flag_needs_review: FieldRef<"student_daily_records", 'Boolean'>
    readonly teacher_feedback_btvn: FieldRef<"student_daily_records", 'String'>
    readonly teacher_feedback_orient: FieldRef<"student_daily_records", 'String'>
    readonly teacher_note: FieldRef<"student_daily_records", 'String'>
    readonly teacher_temp_label: FieldRef<"student_daily_records", 'String'>
    readonly scraped_at: FieldRef<"student_daily_records", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * student_daily_records findUnique
   */
  export type student_daily_recordsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter, which student_daily_records to fetch.
     */
    where: student_daily_recordsWhereUniqueInput
  }

  /**
   * student_daily_records findUniqueOrThrow
   */
  export type student_daily_recordsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter, which student_daily_records to fetch.
     */
    where: student_daily_recordsWhereUniqueInput
  }

  /**
   * student_daily_records findFirst
   */
  export type student_daily_recordsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter, which student_daily_records to fetch.
     */
    where?: student_daily_recordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_daily_records to fetch.
     */
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for student_daily_records.
     */
    cursor?: student_daily_recordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_daily_records from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_daily_records.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of student_daily_records.
     */
    distinct?: Student_daily_recordsScalarFieldEnum | Student_daily_recordsScalarFieldEnum[]
  }

  /**
   * student_daily_records findFirstOrThrow
   */
  export type student_daily_recordsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter, which student_daily_records to fetch.
     */
    where?: student_daily_recordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_daily_records to fetch.
     */
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for student_daily_records.
     */
    cursor?: student_daily_recordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_daily_records from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_daily_records.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of student_daily_records.
     */
    distinct?: Student_daily_recordsScalarFieldEnum | Student_daily_recordsScalarFieldEnum[]
  }

  /**
   * student_daily_records findMany
   */
  export type student_daily_recordsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter, which student_daily_records to fetch.
     */
    where?: student_daily_recordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of student_daily_records to fetch.
     */
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing student_daily_records.
     */
    cursor?: student_daily_recordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` student_daily_records from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` student_daily_records.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of student_daily_records.
     */
    distinct?: Student_daily_recordsScalarFieldEnum | Student_daily_recordsScalarFieldEnum[]
  }

  /**
   * student_daily_records create
   */
  export type student_daily_recordsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * The data needed to create a student_daily_records.
     */
    data: XOR<student_daily_recordsCreateInput, student_daily_recordsUncheckedCreateInput>
  }

  /**
   * student_daily_records createMany
   */
  export type student_daily_recordsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many student_daily_records.
     */
    data: student_daily_recordsCreateManyInput | student_daily_recordsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * student_daily_records createManyAndReturn
   */
  export type student_daily_recordsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * The data used to create many student_daily_records.
     */
    data: student_daily_recordsCreateManyInput | student_daily_recordsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * student_daily_records update
   */
  export type student_daily_recordsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * The data needed to update a student_daily_records.
     */
    data: XOR<student_daily_recordsUpdateInput, student_daily_recordsUncheckedUpdateInput>
    /**
     * Choose, which student_daily_records to update.
     */
    where: student_daily_recordsWhereUniqueInput
  }

  /**
   * student_daily_records updateMany
   */
  export type student_daily_recordsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update student_daily_records.
     */
    data: XOR<student_daily_recordsUpdateManyMutationInput, student_daily_recordsUncheckedUpdateManyInput>
    /**
     * Filter which student_daily_records to update
     */
    where?: student_daily_recordsWhereInput
    /**
     * Limit how many student_daily_records to update.
     */
    limit?: number
  }

  /**
   * student_daily_records updateManyAndReturn
   */
  export type student_daily_recordsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * The data used to update student_daily_records.
     */
    data: XOR<student_daily_recordsUpdateManyMutationInput, student_daily_recordsUncheckedUpdateManyInput>
    /**
     * Filter which student_daily_records to update
     */
    where?: student_daily_recordsWhereInput
    /**
     * Limit how many student_daily_records to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * student_daily_records upsert
   */
  export type student_daily_recordsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * The filter to search for the student_daily_records to update in case it exists.
     */
    where: student_daily_recordsWhereUniqueInput
    /**
     * In case the student_daily_records found by the `where` argument doesn't exist, create a new student_daily_records with this data.
     */
    create: XOR<student_daily_recordsCreateInput, student_daily_recordsUncheckedCreateInput>
    /**
     * In case the student_daily_records was found with the provided `where` argument, update it with this data.
     */
    update: XOR<student_daily_recordsUpdateInput, student_daily_recordsUncheckedUpdateInput>
  }

  /**
   * student_daily_records delete
   */
  export type student_daily_recordsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    /**
     * Filter which student_daily_records to delete.
     */
    where: student_daily_recordsWhereUniqueInput
  }

  /**
   * student_daily_records deleteMany
   */
  export type student_daily_recordsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which student_daily_records to delete
     */
    where?: student_daily_recordsWhereInput
    /**
     * Limit how many student_daily_records to delete.
     */
    limit?: number
  }

  /**
   * student_daily_records without action
   */
  export type student_daily_recordsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
  }


  /**
   * Model students
   */

  export type AggregateStudents = {
    _count: StudentsCountAggregateOutputType | null
    _avg: StudentsAvgAggregateOutputType | null
    _sum: StudentsSumAggregateOutputType | null
    _min: StudentsMinAggregateOutputType | null
    _max: StudentsMaxAggregateOutputType | null
  }

  export type StudentsAvgAggregateOutputType = {
    student_id: number | null
    class_id: number | null
  }

  export type StudentsSumAggregateOutputType = {
    student_id: number | null
    class_id: number | null
  }

  export type StudentsMinAggregateOutputType = {
    student_id: number | null
    student_code: string | null
    full_name: string | null
    phone: string | null
    email: string | null
    class_id: number | null
    registration_status: string | null
    admitted_at: Date | null
    target_output_status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type StudentsMaxAggregateOutputType = {
    student_id: number | null
    student_code: string | null
    full_name: string | null
    phone: string | null
    email: string | null
    class_id: number | null
    registration_status: string | null
    admitted_at: Date | null
    target_output_status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type StudentsCountAggregateOutputType = {
    student_id: number
    student_code: number
    full_name: number
    phone: number
    email: number
    class_id: number
    registration_status: number
    admitted_at: number
    target_output_status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type StudentsAvgAggregateInputType = {
    student_id?: true
    class_id?: true
  }

  export type StudentsSumAggregateInputType = {
    student_id?: true
    class_id?: true
  }

  export type StudentsMinAggregateInputType = {
    student_id?: true
    student_code?: true
    full_name?: true
    phone?: true
    email?: true
    class_id?: true
    registration_status?: true
    admitted_at?: true
    target_output_status?: true
    created_at?: true
    updated_at?: true
  }

  export type StudentsMaxAggregateInputType = {
    student_id?: true
    student_code?: true
    full_name?: true
    phone?: true
    email?: true
    class_id?: true
    registration_status?: true
    admitted_at?: true
    target_output_status?: true
    created_at?: true
    updated_at?: true
  }

  export type StudentsCountAggregateInputType = {
    student_id?: true
    student_code?: true
    full_name?: true
    phone?: true
    email?: true
    class_id?: true
    registration_status?: true
    admitted_at?: true
    target_output_status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type StudentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which students to aggregate.
     */
    where?: studentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of students to fetch.
     */
    orderBy?: studentsOrderByWithRelationInput | studentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: studentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned students
    **/
    _count?: true | StudentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentsMaxAggregateInputType
  }

  export type GetStudentsAggregateType<T extends StudentsAggregateArgs> = {
        [P in keyof T & keyof AggregateStudents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudents[P]>
      : GetScalarType<T[P], AggregateStudents[P]>
  }




  export type studentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: studentsWhereInput
    orderBy?: studentsOrderByWithAggregationInput | studentsOrderByWithAggregationInput[]
    by: StudentsScalarFieldEnum[] | StudentsScalarFieldEnum
    having?: studentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentsCountAggregateInputType | true
    _avg?: StudentsAvgAggregateInputType
    _sum?: StudentsSumAggregateInputType
    _min?: StudentsMinAggregateInputType
    _max?: StudentsMaxAggregateInputType
  }

  export type StudentsGroupByOutputType = {
    student_id: number
    student_code: string | null
    full_name: string
    phone: string | null
    email: string | null
    class_id: number
    registration_status: string
    admitted_at: Date | null
    target_output_status: string | null
    created_at: Date
    updated_at: Date
    _count: StudentsCountAggregateOutputType | null
    _avg: StudentsAvgAggregateOutputType | null
    _sum: StudentsSumAggregateOutputType | null
    _min: StudentsMinAggregateOutputType | null
    _max: StudentsMaxAggregateOutputType | null
  }

  type GetStudentsGroupByPayload<T extends studentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentsGroupByOutputType[P]>
            : GetScalarType<T[P], StudentsGroupByOutputType[P]>
        }
      >
    >


  export type studentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    student_id?: boolean
    student_code?: boolean
    full_name?: boolean
    phone?: boolean
    email?: boolean
    class_id?: boolean
    registration_status?: boolean
    admitted_at?: boolean
    target_output_status?: boolean
    created_at?: boolean
    updated_at?: boolean
    label_change_logs?: boolean | students$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | students$pass_reviewsArgs<ExtArgs>
    student_daily_records?: boolean | students$student_daily_recordsArgs<ExtArgs>
    classes?: boolean | classesDefaultArgs<ExtArgs>
    test_scores?: boolean | students$test_scoresArgs<ExtArgs>
    _count?: boolean | StudentsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["students"]>

  export type studentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    student_id?: boolean
    student_code?: boolean
    full_name?: boolean
    phone?: boolean
    email?: boolean
    class_id?: boolean
    registration_status?: boolean
    admitted_at?: boolean
    target_output_status?: boolean
    created_at?: boolean
    updated_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["students"]>

  export type studentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    student_id?: boolean
    student_code?: boolean
    full_name?: boolean
    phone?: boolean
    email?: boolean
    class_id?: boolean
    registration_status?: boolean
    admitted_at?: boolean
    target_output_status?: boolean
    created_at?: boolean
    updated_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["students"]>

  export type studentsSelectScalar = {
    student_id?: boolean
    student_code?: boolean
    full_name?: boolean
    phone?: boolean
    email?: boolean
    class_id?: boolean
    registration_status?: boolean
    admitted_at?: boolean
    target_output_status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type studentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"student_id" | "student_code" | "full_name" | "phone" | "email" | "class_id" | "registration_status" | "admitted_at" | "target_output_status" | "created_at" | "updated_at", ExtArgs["result"]["students"]>
  export type studentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    label_change_logs?: boolean | students$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | students$pass_reviewsArgs<ExtArgs>
    student_daily_records?: boolean | students$student_daily_recordsArgs<ExtArgs>
    classes?: boolean | classesDefaultArgs<ExtArgs>
    test_scores?: boolean | students$test_scoresArgs<ExtArgs>
    _count?: boolean | StudentsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type studentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }
  export type studentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
  }

  export type $studentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "students"
    objects: {
      label_change_logs: Prisma.$label_change_logsPayload<ExtArgs>[]
      pass_reviews: Prisma.$pass_reviewsPayload<ExtArgs>[]
      student_daily_records: Prisma.$student_daily_recordsPayload<ExtArgs>[]
      classes: Prisma.$classesPayload<ExtArgs>
      test_scores: Prisma.$test_scoresPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      student_id: number
      student_code: string | null
      full_name: string
      phone: string | null
      email: string | null
      class_id: number
      registration_status: string
      admitted_at: Date | null
      target_output_status: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["students"]>
    composites: {}
  }

  type studentsGetPayload<S extends boolean | null | undefined | studentsDefaultArgs> = $Result.GetResult<Prisma.$studentsPayload, S>

  type studentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<studentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentsCountAggregateInputType | true
    }

  export interface studentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['students'], meta: { name: 'students' } }
    /**
     * Find zero or one Students that matches the filter.
     * @param {studentsFindUniqueArgs} args - Arguments to find a Students
     * @example
     * // Get one Students
     * const students = await prisma.students.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends studentsFindUniqueArgs>(args: SelectSubset<T, studentsFindUniqueArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Students that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {studentsFindUniqueOrThrowArgs} args - Arguments to find a Students
     * @example
     * // Get one Students
     * const students = await prisma.students.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends studentsFindUniqueOrThrowArgs>(args: SelectSubset<T, studentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsFindFirstArgs} args - Arguments to find a Students
     * @example
     * // Get one Students
     * const students = await prisma.students.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends studentsFindFirstArgs>(args?: SelectSubset<T, studentsFindFirstArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Students that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsFindFirstOrThrowArgs} args - Arguments to find a Students
     * @example
     * // Get one Students
     * const students = await prisma.students.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends studentsFindFirstOrThrowArgs>(args?: SelectSubset<T, studentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.students.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.students.findMany({ take: 10 })
     * 
     * // Only select the `student_id`
     * const studentsWithStudent_idOnly = await prisma.students.findMany({ select: { student_id: true } })
     * 
     */
    findMany<T extends studentsFindManyArgs>(args?: SelectSubset<T, studentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Students.
     * @param {studentsCreateArgs} args - Arguments to create a Students.
     * @example
     * // Create one Students
     * const Students = await prisma.students.create({
     *   data: {
     *     // ... data to create a Students
     *   }
     * })
     * 
     */
    create<T extends studentsCreateArgs>(args: SelectSubset<T, studentsCreateArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {studentsCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const students = await prisma.students.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends studentsCreateManyArgs>(args?: SelectSubset<T, studentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {studentsCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const students = await prisma.students.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `student_id`
     * const studentsWithStudent_idOnly = await prisma.students.createManyAndReturn({
     *   select: { student_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends studentsCreateManyAndReturnArgs>(args?: SelectSubset<T, studentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Students.
     * @param {studentsDeleteArgs} args - Arguments to delete one Students.
     * @example
     * // Delete one Students
     * const Students = await prisma.students.delete({
     *   where: {
     *     // ... filter to delete one Students
     *   }
     * })
     * 
     */
    delete<T extends studentsDeleteArgs>(args: SelectSubset<T, studentsDeleteArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Students.
     * @param {studentsUpdateArgs} args - Arguments to update one Students.
     * @example
     * // Update one Students
     * const students = await prisma.students.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends studentsUpdateArgs>(args: SelectSubset<T, studentsUpdateArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {studentsDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.students.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends studentsDeleteManyArgs>(args?: SelectSubset<T, studentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const students = await prisma.students.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends studentsUpdateManyArgs>(args: SelectSubset<T, studentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {studentsUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const students = await prisma.students.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `student_id`
     * const studentsWithStudent_idOnly = await prisma.students.updateManyAndReturn({
     *   select: { student_id: true },
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
    updateManyAndReturn<T extends studentsUpdateManyAndReturnArgs>(args: SelectSubset<T, studentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Students.
     * @param {studentsUpsertArgs} args - Arguments to update or create a Students.
     * @example
     * // Update or create a Students
     * const students = await prisma.students.upsert({
     *   create: {
     *     // ... data to create a Students
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Students we want to update
     *   }
     * })
     */
    upsert<T extends studentsUpsertArgs>(args: SelectSubset<T, studentsUpsertArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.students.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends studentsCountArgs>(
      args?: Subset<T, studentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentsAggregateArgs>(args: Subset<T, StudentsAggregateArgs>): Prisma.PrismaPromise<GetStudentsAggregateType<T>>

    /**
     * Group by Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {studentsGroupByArgs} args - Group by arguments.
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
      T extends studentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: studentsGroupByArgs['orderBy'] }
        : { orderBy?: studentsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, studentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the students model
   */
  readonly fields: studentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for students.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__studentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    label_change_logs<T extends students$label_change_logsArgs<ExtArgs> = {}>(args?: Subset<T, students$label_change_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pass_reviews<T extends students$pass_reviewsArgs<ExtArgs> = {}>(args?: Subset<T, students$pass_reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    student_daily_records<T extends students$student_daily_recordsArgs<ExtArgs> = {}>(args?: Subset<T, students$student_daily_recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$student_daily_recordsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    test_scores<T extends students$test_scoresArgs<ExtArgs> = {}>(args?: Subset<T, students$test_scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the students model
   */
  interface studentsFieldRefs {
    readonly student_id: FieldRef<"students", 'Int'>
    readonly student_code: FieldRef<"students", 'String'>
    readonly full_name: FieldRef<"students", 'String'>
    readonly phone: FieldRef<"students", 'String'>
    readonly email: FieldRef<"students", 'String'>
    readonly class_id: FieldRef<"students", 'Int'>
    readonly registration_status: FieldRef<"students", 'String'>
    readonly admitted_at: FieldRef<"students", 'DateTime'>
    readonly target_output_status: FieldRef<"students", 'String'>
    readonly created_at: FieldRef<"students", 'DateTime'>
    readonly updated_at: FieldRef<"students", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * students findUnique
   */
  export type studentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter, which students to fetch.
     */
    where: studentsWhereUniqueInput
  }

  /**
   * students findUniqueOrThrow
   */
  export type studentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter, which students to fetch.
     */
    where: studentsWhereUniqueInput
  }

  /**
   * students findFirst
   */
  export type studentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter, which students to fetch.
     */
    where?: studentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of students to fetch.
     */
    orderBy?: studentsOrderByWithRelationInput | studentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for students.
     */
    cursor?: studentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of students.
     */
    distinct?: StudentsScalarFieldEnum | StudentsScalarFieldEnum[]
  }

  /**
   * students findFirstOrThrow
   */
  export type studentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter, which students to fetch.
     */
    where?: studentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of students to fetch.
     */
    orderBy?: studentsOrderByWithRelationInput | studentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for students.
     */
    cursor?: studentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of students.
     */
    distinct?: StudentsScalarFieldEnum | StudentsScalarFieldEnum[]
  }

  /**
   * students findMany
   */
  export type studentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter, which students to fetch.
     */
    where?: studentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of students to fetch.
     */
    orderBy?: studentsOrderByWithRelationInput | studentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing students.
     */
    cursor?: studentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of students.
     */
    distinct?: StudentsScalarFieldEnum | StudentsScalarFieldEnum[]
  }

  /**
   * students create
   */
  export type studentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * The data needed to create a students.
     */
    data: XOR<studentsCreateInput, studentsUncheckedCreateInput>
  }

  /**
   * students createMany
   */
  export type studentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many students.
     */
    data: studentsCreateManyInput | studentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * students createManyAndReturn
   */
  export type studentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * The data used to create many students.
     */
    data: studentsCreateManyInput | studentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * students update
   */
  export type studentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * The data needed to update a students.
     */
    data: XOR<studentsUpdateInput, studentsUncheckedUpdateInput>
    /**
     * Choose, which students to update.
     */
    where: studentsWhereUniqueInput
  }

  /**
   * students updateMany
   */
  export type studentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update students.
     */
    data: XOR<studentsUpdateManyMutationInput, studentsUncheckedUpdateManyInput>
    /**
     * Filter which students to update
     */
    where?: studentsWhereInput
    /**
     * Limit how many students to update.
     */
    limit?: number
  }

  /**
   * students updateManyAndReturn
   */
  export type studentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * The data used to update students.
     */
    data: XOR<studentsUpdateManyMutationInput, studentsUncheckedUpdateManyInput>
    /**
     * Filter which students to update
     */
    where?: studentsWhereInput
    /**
     * Limit how many students to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * students upsert
   */
  export type studentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * The filter to search for the students to update in case it exists.
     */
    where: studentsWhereUniqueInput
    /**
     * In case the students found by the `where` argument doesn't exist, create a new students with this data.
     */
    create: XOR<studentsCreateInput, studentsUncheckedCreateInput>
    /**
     * In case the students was found with the provided `where` argument, update it with this data.
     */
    update: XOR<studentsUpdateInput, studentsUncheckedUpdateInput>
  }

  /**
   * students delete
   */
  export type studentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
    /**
     * Filter which students to delete.
     */
    where: studentsWhereUniqueInput
  }

  /**
   * students deleteMany
   */
  export type studentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which students to delete
     */
    where?: studentsWhereInput
    /**
     * Limit how many students to delete.
     */
    limit?: number
  }

  /**
   * students.label_change_logs
   */
  export type students$label_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    where?: label_change_logsWhereInput
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    cursor?: label_change_logsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * students.pass_reviews
   */
  export type students$pass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    where?: pass_reviewsWhereInput
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    cursor?: pass_reviewsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * students.student_daily_records
   */
  export type students$student_daily_recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the student_daily_records
     */
    select?: student_daily_recordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the student_daily_records
     */
    omit?: student_daily_recordsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: student_daily_recordsInclude<ExtArgs> | null
    where?: student_daily_recordsWhereInput
    orderBy?: student_daily_recordsOrderByWithRelationInput | student_daily_recordsOrderByWithRelationInput[]
    cursor?: student_daily_recordsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Student_daily_recordsScalarFieldEnum | Student_daily_recordsScalarFieldEnum[]
  }

  /**
   * students.test_scores
   */
  export type students$test_scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    where?: test_scoresWhereInput
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    cursor?: test_scoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Test_scoresScalarFieldEnum | Test_scoresScalarFieldEnum[]
  }

  /**
   * students without action
   */
  export type studentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the students
     */
    select?: studentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the students
     */
    omit?: studentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: studentsInclude<ExtArgs> | null
  }


  /**
   * Model system_configs
   */

  export type AggregateSystem_configs = {
    _count: System_configsCountAggregateOutputType | null
    _avg: System_configsAvgAggregateOutputType | null
    _sum: System_configsSumAggregateOutputType | null
    _min: System_configsMinAggregateOutputType | null
    _max: System_configsMaxAggregateOutputType | null
  }

  export type System_configsAvgAggregateOutputType = {
    id: number | null
  }

  export type System_configsSumAggregateOutputType = {
    id: number | null
  }

  export type System_configsMinAggregateOutputType = {
    id: number | null
    config_key: string | null
    config_value: string | null
    description: string | null
    updated_at: Date | null
    updated_by: string | null
  }

  export type System_configsMaxAggregateOutputType = {
    id: number | null
    config_key: string | null
    config_value: string | null
    description: string | null
    updated_at: Date | null
    updated_by: string | null
  }

  export type System_configsCountAggregateOutputType = {
    id: number
    config_key: number
    config_value: number
    description: number
    updated_at: number
    updated_by: number
    _all: number
  }


  export type System_configsAvgAggregateInputType = {
    id?: true
  }

  export type System_configsSumAggregateInputType = {
    id?: true
  }

  export type System_configsMinAggregateInputType = {
    id?: true
    config_key?: true
    config_value?: true
    description?: true
    updated_at?: true
    updated_by?: true
  }

  export type System_configsMaxAggregateInputType = {
    id?: true
    config_key?: true
    config_value?: true
    description?: true
    updated_at?: true
    updated_by?: true
  }

  export type System_configsCountAggregateInputType = {
    id?: true
    config_key?: true
    config_value?: true
    description?: true
    updated_at?: true
    updated_by?: true
    _all?: true
  }

  export type System_configsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which system_configs to aggregate.
     */
    where?: system_configsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_configs to fetch.
     */
    orderBy?: system_configsOrderByWithRelationInput | system_configsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: system_configsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned system_configs
    **/
    _count?: true | System_configsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: System_configsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: System_configsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: System_configsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: System_configsMaxAggregateInputType
  }

  export type GetSystem_configsAggregateType<T extends System_configsAggregateArgs> = {
        [P in keyof T & keyof AggregateSystem_configs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystem_configs[P]>
      : GetScalarType<T[P], AggregateSystem_configs[P]>
  }




  export type system_configsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: system_configsWhereInput
    orderBy?: system_configsOrderByWithAggregationInput | system_configsOrderByWithAggregationInput[]
    by: System_configsScalarFieldEnum[] | System_configsScalarFieldEnum
    having?: system_configsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: System_configsCountAggregateInputType | true
    _avg?: System_configsAvgAggregateInputType
    _sum?: System_configsSumAggregateInputType
    _min?: System_configsMinAggregateInputType
    _max?: System_configsMaxAggregateInputType
  }

  export type System_configsGroupByOutputType = {
    id: number
    config_key: string
    config_value: string
    description: string | null
    updated_at: Date
    updated_by: string | null
    _count: System_configsCountAggregateOutputType | null
    _avg: System_configsAvgAggregateOutputType | null
    _sum: System_configsSumAggregateOutputType | null
    _min: System_configsMinAggregateOutputType | null
    _max: System_configsMaxAggregateOutputType | null
  }

  type GetSystem_configsGroupByPayload<T extends system_configsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<System_configsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof System_configsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], System_configsGroupByOutputType[P]>
            : GetScalarType<T[P], System_configsGroupByOutputType[P]>
        }
      >
    >


  export type system_configsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    config_key?: boolean
    config_value?: boolean
    description?: boolean
    updated_at?: boolean
    updated_by?: boolean
  }, ExtArgs["result"]["system_configs"]>

  export type system_configsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    config_key?: boolean
    config_value?: boolean
    description?: boolean
    updated_at?: boolean
    updated_by?: boolean
  }, ExtArgs["result"]["system_configs"]>

  export type system_configsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    config_key?: boolean
    config_value?: boolean
    description?: boolean
    updated_at?: boolean
    updated_by?: boolean
  }, ExtArgs["result"]["system_configs"]>

  export type system_configsSelectScalar = {
    id?: boolean
    config_key?: boolean
    config_value?: boolean
    description?: boolean
    updated_at?: boolean
    updated_by?: boolean
  }

  export type system_configsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "config_key" | "config_value" | "description" | "updated_at" | "updated_by", ExtArgs["result"]["system_configs"]>

  export type $system_configsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "system_configs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      config_key: string
      config_value: string
      description: string | null
      updated_at: Date
      updated_by: string | null
    }, ExtArgs["result"]["system_configs"]>
    composites: {}
  }

  type system_configsGetPayload<S extends boolean | null | undefined | system_configsDefaultArgs> = $Result.GetResult<Prisma.$system_configsPayload, S>

  type system_configsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<system_configsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: System_configsCountAggregateInputType | true
    }

  export interface system_configsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['system_configs'], meta: { name: 'system_configs' } }
    /**
     * Find zero or one System_configs that matches the filter.
     * @param {system_configsFindUniqueArgs} args - Arguments to find a System_configs
     * @example
     * // Get one System_configs
     * const system_configs = await prisma.system_configs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends system_configsFindUniqueArgs>(args: SelectSubset<T, system_configsFindUniqueArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one System_configs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {system_configsFindUniqueOrThrowArgs} args - Arguments to find a System_configs
     * @example
     * // Get one System_configs
     * const system_configs = await prisma.system_configs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends system_configsFindUniqueOrThrowArgs>(args: SelectSubset<T, system_configsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first System_configs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsFindFirstArgs} args - Arguments to find a System_configs
     * @example
     * // Get one System_configs
     * const system_configs = await prisma.system_configs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends system_configsFindFirstArgs>(args?: SelectSubset<T, system_configsFindFirstArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first System_configs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsFindFirstOrThrowArgs} args - Arguments to find a System_configs
     * @example
     * // Get one System_configs
     * const system_configs = await prisma.system_configs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends system_configsFindFirstOrThrowArgs>(args?: SelectSubset<T, system_configsFindFirstOrThrowArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more System_configs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all System_configs
     * const system_configs = await prisma.system_configs.findMany()
     * 
     * // Get first 10 System_configs
     * const system_configs = await prisma.system_configs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const system_configsWithIdOnly = await prisma.system_configs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends system_configsFindManyArgs>(args?: SelectSubset<T, system_configsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a System_configs.
     * @param {system_configsCreateArgs} args - Arguments to create a System_configs.
     * @example
     * // Create one System_configs
     * const System_configs = await prisma.system_configs.create({
     *   data: {
     *     // ... data to create a System_configs
     *   }
     * })
     * 
     */
    create<T extends system_configsCreateArgs>(args: SelectSubset<T, system_configsCreateArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many System_configs.
     * @param {system_configsCreateManyArgs} args - Arguments to create many System_configs.
     * @example
     * // Create many System_configs
     * const system_configs = await prisma.system_configs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends system_configsCreateManyArgs>(args?: SelectSubset<T, system_configsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many System_configs and returns the data saved in the database.
     * @param {system_configsCreateManyAndReturnArgs} args - Arguments to create many System_configs.
     * @example
     * // Create many System_configs
     * const system_configs = await prisma.system_configs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many System_configs and only return the `id`
     * const system_configsWithIdOnly = await prisma.system_configs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends system_configsCreateManyAndReturnArgs>(args?: SelectSubset<T, system_configsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a System_configs.
     * @param {system_configsDeleteArgs} args - Arguments to delete one System_configs.
     * @example
     * // Delete one System_configs
     * const System_configs = await prisma.system_configs.delete({
     *   where: {
     *     // ... filter to delete one System_configs
     *   }
     * })
     * 
     */
    delete<T extends system_configsDeleteArgs>(args: SelectSubset<T, system_configsDeleteArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one System_configs.
     * @param {system_configsUpdateArgs} args - Arguments to update one System_configs.
     * @example
     * // Update one System_configs
     * const system_configs = await prisma.system_configs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends system_configsUpdateArgs>(args: SelectSubset<T, system_configsUpdateArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more System_configs.
     * @param {system_configsDeleteManyArgs} args - Arguments to filter System_configs to delete.
     * @example
     * // Delete a few System_configs
     * const { count } = await prisma.system_configs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends system_configsDeleteManyArgs>(args?: SelectSubset<T, system_configsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more System_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many System_configs
     * const system_configs = await prisma.system_configs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends system_configsUpdateManyArgs>(args: SelectSubset<T, system_configsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more System_configs and returns the data updated in the database.
     * @param {system_configsUpdateManyAndReturnArgs} args - Arguments to update many System_configs.
     * @example
     * // Update many System_configs
     * const system_configs = await prisma.system_configs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more System_configs and only return the `id`
     * const system_configsWithIdOnly = await prisma.system_configs.updateManyAndReturn({
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
    updateManyAndReturn<T extends system_configsUpdateManyAndReturnArgs>(args: SelectSubset<T, system_configsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one System_configs.
     * @param {system_configsUpsertArgs} args - Arguments to update or create a System_configs.
     * @example
     * // Update or create a System_configs
     * const system_configs = await prisma.system_configs.upsert({
     *   create: {
     *     // ... data to create a System_configs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the System_configs we want to update
     *   }
     * })
     */
    upsert<T extends system_configsUpsertArgs>(args: SelectSubset<T, system_configsUpsertArgs<ExtArgs>>): Prisma__system_configsClient<$Result.GetResult<Prisma.$system_configsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of System_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsCountArgs} args - Arguments to filter System_configs to count.
     * @example
     * // Count the number of System_configs
     * const count = await prisma.system_configs.count({
     *   where: {
     *     // ... the filter for the System_configs we want to count
     *   }
     * })
    **/
    count<T extends system_configsCountArgs>(
      args?: Subset<T, system_configsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], System_configsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a System_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {System_configsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends System_configsAggregateArgs>(args: Subset<T, System_configsAggregateArgs>): Prisma.PrismaPromise<GetSystem_configsAggregateType<T>>

    /**
     * Group by System_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_configsGroupByArgs} args - Group by arguments.
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
      T extends system_configsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: system_configsGroupByArgs['orderBy'] }
        : { orderBy?: system_configsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, system_configsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystem_configsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the system_configs model
   */
  readonly fields: system_configsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for system_configs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__system_configsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the system_configs model
   */
  interface system_configsFieldRefs {
    readonly id: FieldRef<"system_configs", 'Int'>
    readonly config_key: FieldRef<"system_configs", 'String'>
    readonly config_value: FieldRef<"system_configs", 'String'>
    readonly description: FieldRef<"system_configs", 'String'>
    readonly updated_at: FieldRef<"system_configs", 'DateTime'>
    readonly updated_by: FieldRef<"system_configs", 'String'>
  }
    

  // Custom InputTypes
  /**
   * system_configs findUnique
   */
  export type system_configsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter, which system_configs to fetch.
     */
    where: system_configsWhereUniqueInput
  }

  /**
   * system_configs findUniqueOrThrow
   */
  export type system_configsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter, which system_configs to fetch.
     */
    where: system_configsWhereUniqueInput
  }

  /**
   * system_configs findFirst
   */
  export type system_configsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter, which system_configs to fetch.
     */
    where?: system_configsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_configs to fetch.
     */
    orderBy?: system_configsOrderByWithRelationInput | system_configsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for system_configs.
     */
    cursor?: system_configsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_configs.
     */
    distinct?: System_configsScalarFieldEnum | System_configsScalarFieldEnum[]
  }

  /**
   * system_configs findFirstOrThrow
   */
  export type system_configsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter, which system_configs to fetch.
     */
    where?: system_configsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_configs to fetch.
     */
    orderBy?: system_configsOrderByWithRelationInput | system_configsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for system_configs.
     */
    cursor?: system_configsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_configs.
     */
    distinct?: System_configsScalarFieldEnum | System_configsScalarFieldEnum[]
  }

  /**
   * system_configs findMany
   */
  export type system_configsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter, which system_configs to fetch.
     */
    where?: system_configsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_configs to fetch.
     */
    orderBy?: system_configsOrderByWithRelationInput | system_configsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing system_configs.
     */
    cursor?: system_configsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_configs.
     */
    distinct?: System_configsScalarFieldEnum | System_configsScalarFieldEnum[]
  }

  /**
   * system_configs create
   */
  export type system_configsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * The data needed to create a system_configs.
     */
    data: XOR<system_configsCreateInput, system_configsUncheckedCreateInput>
  }

  /**
   * system_configs createMany
   */
  export type system_configsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many system_configs.
     */
    data: system_configsCreateManyInput | system_configsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * system_configs createManyAndReturn
   */
  export type system_configsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * The data used to create many system_configs.
     */
    data: system_configsCreateManyInput | system_configsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * system_configs update
   */
  export type system_configsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * The data needed to update a system_configs.
     */
    data: XOR<system_configsUpdateInput, system_configsUncheckedUpdateInput>
    /**
     * Choose, which system_configs to update.
     */
    where: system_configsWhereUniqueInput
  }

  /**
   * system_configs updateMany
   */
  export type system_configsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update system_configs.
     */
    data: XOR<system_configsUpdateManyMutationInput, system_configsUncheckedUpdateManyInput>
    /**
     * Filter which system_configs to update
     */
    where?: system_configsWhereInput
    /**
     * Limit how many system_configs to update.
     */
    limit?: number
  }

  /**
   * system_configs updateManyAndReturn
   */
  export type system_configsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * The data used to update system_configs.
     */
    data: XOR<system_configsUpdateManyMutationInput, system_configsUncheckedUpdateManyInput>
    /**
     * Filter which system_configs to update
     */
    where?: system_configsWhereInput
    /**
     * Limit how many system_configs to update.
     */
    limit?: number
  }

  /**
   * system_configs upsert
   */
  export type system_configsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * The filter to search for the system_configs to update in case it exists.
     */
    where: system_configsWhereUniqueInput
    /**
     * In case the system_configs found by the `where` argument doesn't exist, create a new system_configs with this data.
     */
    create: XOR<system_configsCreateInput, system_configsUncheckedCreateInput>
    /**
     * In case the system_configs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<system_configsUpdateInput, system_configsUncheckedUpdateInput>
  }

  /**
   * system_configs delete
   */
  export type system_configsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
    /**
     * Filter which system_configs to delete.
     */
    where: system_configsWhereUniqueInput
  }

  /**
   * system_configs deleteMany
   */
  export type system_configsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which system_configs to delete
     */
    where?: system_configsWhereInput
    /**
     * Limit how many system_configs to delete.
     */
    limit?: number
  }

  /**
   * system_configs without action
   */
  export type system_configsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_configs
     */
    select?: system_configsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_configs
     */
    omit?: system_configsOmit<ExtArgs> | null
  }


  /**
   * Model system_logs
   */

  export type AggregateSystem_logs = {
    _count: System_logsCountAggregateOutputType | null
    _avg: System_logsAvgAggregateOutputType | null
    _sum: System_logsSumAggregateOutputType | null
    _min: System_logsMinAggregateOutputType | null
    _max: System_logsMaxAggregateOutputType | null
  }

  export type System_logsAvgAggregateOutputType = {
    id: number | null
    class_id: number | null
    records_affected: number | null
    duration_ms: number | null
  }

  export type System_logsSumAggregateOutputType = {
    id: bigint | null
    class_id: number | null
    records_affected: number | null
    duration_ms: number | null
  }

  export type System_logsMinAggregateOutputType = {
    id: bigint | null
    log_id: string | null
    run_id: string | null
    workflow_name: string | null
    action: string | null
    class_id: number | null
    status: string | null
    message: string | null
    records_affected: number | null
    duration_ms: number | null
    created_at: Date | null
  }

  export type System_logsMaxAggregateOutputType = {
    id: bigint | null
    log_id: string | null
    run_id: string | null
    workflow_name: string | null
    action: string | null
    class_id: number | null
    status: string | null
    message: string | null
    records_affected: number | null
    duration_ms: number | null
    created_at: Date | null
  }

  export type System_logsCountAggregateOutputType = {
    id: number
    log_id: number
    run_id: number
    workflow_name: number
    action: number
    class_id: number
    status: number
    message: number
    records_affected: number
    duration_ms: number
    created_at: number
    _all: number
  }


  export type System_logsAvgAggregateInputType = {
    id?: true
    class_id?: true
    records_affected?: true
    duration_ms?: true
  }

  export type System_logsSumAggregateInputType = {
    id?: true
    class_id?: true
    records_affected?: true
    duration_ms?: true
  }

  export type System_logsMinAggregateInputType = {
    id?: true
    log_id?: true
    run_id?: true
    workflow_name?: true
    action?: true
    class_id?: true
    status?: true
    message?: true
    records_affected?: true
    duration_ms?: true
    created_at?: true
  }

  export type System_logsMaxAggregateInputType = {
    id?: true
    log_id?: true
    run_id?: true
    workflow_name?: true
    action?: true
    class_id?: true
    status?: true
    message?: true
    records_affected?: true
    duration_ms?: true
    created_at?: true
  }

  export type System_logsCountAggregateInputType = {
    id?: true
    log_id?: true
    run_id?: true
    workflow_name?: true
    action?: true
    class_id?: true
    status?: true
    message?: true
    records_affected?: true
    duration_ms?: true
    created_at?: true
    _all?: true
  }

  export type System_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which system_logs to aggregate.
     */
    where?: system_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_logs to fetch.
     */
    orderBy?: system_logsOrderByWithRelationInput | system_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: system_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned system_logs
    **/
    _count?: true | System_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: System_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: System_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: System_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: System_logsMaxAggregateInputType
  }

  export type GetSystem_logsAggregateType<T extends System_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateSystem_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystem_logs[P]>
      : GetScalarType<T[P], AggregateSystem_logs[P]>
  }




  export type system_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: system_logsWhereInput
    orderBy?: system_logsOrderByWithAggregationInput | system_logsOrderByWithAggregationInput[]
    by: System_logsScalarFieldEnum[] | System_logsScalarFieldEnum
    having?: system_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: System_logsCountAggregateInputType | true
    _avg?: System_logsAvgAggregateInputType
    _sum?: System_logsSumAggregateInputType
    _min?: System_logsMinAggregateInputType
    _max?: System_logsMaxAggregateInputType
  }

  export type System_logsGroupByOutputType = {
    id: bigint
    log_id: string | null
    run_id: string | null
    workflow_name: string | null
    action: string | null
    class_id: number | null
    status: string
    message: string | null
    records_affected: number | null
    duration_ms: number | null
    created_at: Date
    _count: System_logsCountAggregateOutputType | null
    _avg: System_logsAvgAggregateOutputType | null
    _sum: System_logsSumAggregateOutputType | null
    _min: System_logsMinAggregateOutputType | null
    _max: System_logsMaxAggregateOutputType | null
  }

  type GetSystem_logsGroupByPayload<T extends system_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<System_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof System_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], System_logsGroupByOutputType[P]>
            : GetScalarType<T[P], System_logsGroupByOutputType[P]>
        }
      >
    >


  export type system_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    run_id?: boolean
    workflow_name?: boolean
    action?: boolean
    class_id?: boolean
    status?: boolean
    message?: boolean
    records_affected?: boolean
    duration_ms?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["system_logs"]>

  export type system_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    run_id?: boolean
    workflow_name?: boolean
    action?: boolean
    class_id?: boolean
    status?: boolean
    message?: boolean
    records_affected?: boolean
    duration_ms?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["system_logs"]>

  export type system_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    log_id?: boolean
    run_id?: boolean
    workflow_name?: boolean
    action?: boolean
    class_id?: boolean
    status?: boolean
    message?: boolean
    records_affected?: boolean
    duration_ms?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["system_logs"]>

  export type system_logsSelectScalar = {
    id?: boolean
    log_id?: boolean
    run_id?: boolean
    workflow_name?: boolean
    action?: boolean
    class_id?: boolean
    status?: boolean
    message?: boolean
    records_affected?: boolean
    duration_ms?: boolean
    created_at?: boolean
  }

  export type system_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "log_id" | "run_id" | "workflow_name" | "action" | "class_id" | "status" | "message" | "records_affected" | "duration_ms" | "created_at", ExtArgs["result"]["system_logs"]>

  export type $system_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "system_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      log_id: string | null
      run_id: string | null
      workflow_name: string | null
      action: string | null
      class_id: number | null
      status: string
      message: string | null
      records_affected: number | null
      duration_ms: number | null
      created_at: Date
    }, ExtArgs["result"]["system_logs"]>
    composites: {}
  }

  type system_logsGetPayload<S extends boolean | null | undefined | system_logsDefaultArgs> = $Result.GetResult<Prisma.$system_logsPayload, S>

  type system_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<system_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: System_logsCountAggregateInputType | true
    }

  export interface system_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['system_logs'], meta: { name: 'system_logs' } }
    /**
     * Find zero or one System_logs that matches the filter.
     * @param {system_logsFindUniqueArgs} args - Arguments to find a System_logs
     * @example
     * // Get one System_logs
     * const system_logs = await prisma.system_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends system_logsFindUniqueArgs>(args: SelectSubset<T, system_logsFindUniqueArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one System_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {system_logsFindUniqueOrThrowArgs} args - Arguments to find a System_logs
     * @example
     * // Get one System_logs
     * const system_logs = await prisma.system_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends system_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, system_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first System_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsFindFirstArgs} args - Arguments to find a System_logs
     * @example
     * // Get one System_logs
     * const system_logs = await prisma.system_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends system_logsFindFirstArgs>(args?: SelectSubset<T, system_logsFindFirstArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first System_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsFindFirstOrThrowArgs} args - Arguments to find a System_logs
     * @example
     * // Get one System_logs
     * const system_logs = await prisma.system_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends system_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, system_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more System_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all System_logs
     * const system_logs = await prisma.system_logs.findMany()
     * 
     * // Get first 10 System_logs
     * const system_logs = await prisma.system_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const system_logsWithIdOnly = await prisma.system_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends system_logsFindManyArgs>(args?: SelectSubset<T, system_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a System_logs.
     * @param {system_logsCreateArgs} args - Arguments to create a System_logs.
     * @example
     * // Create one System_logs
     * const System_logs = await prisma.system_logs.create({
     *   data: {
     *     // ... data to create a System_logs
     *   }
     * })
     * 
     */
    create<T extends system_logsCreateArgs>(args: SelectSubset<T, system_logsCreateArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many System_logs.
     * @param {system_logsCreateManyArgs} args - Arguments to create many System_logs.
     * @example
     * // Create many System_logs
     * const system_logs = await prisma.system_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends system_logsCreateManyArgs>(args?: SelectSubset<T, system_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many System_logs and returns the data saved in the database.
     * @param {system_logsCreateManyAndReturnArgs} args - Arguments to create many System_logs.
     * @example
     * // Create many System_logs
     * const system_logs = await prisma.system_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many System_logs and only return the `id`
     * const system_logsWithIdOnly = await prisma.system_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends system_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, system_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a System_logs.
     * @param {system_logsDeleteArgs} args - Arguments to delete one System_logs.
     * @example
     * // Delete one System_logs
     * const System_logs = await prisma.system_logs.delete({
     *   where: {
     *     // ... filter to delete one System_logs
     *   }
     * })
     * 
     */
    delete<T extends system_logsDeleteArgs>(args: SelectSubset<T, system_logsDeleteArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one System_logs.
     * @param {system_logsUpdateArgs} args - Arguments to update one System_logs.
     * @example
     * // Update one System_logs
     * const system_logs = await prisma.system_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends system_logsUpdateArgs>(args: SelectSubset<T, system_logsUpdateArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more System_logs.
     * @param {system_logsDeleteManyArgs} args - Arguments to filter System_logs to delete.
     * @example
     * // Delete a few System_logs
     * const { count } = await prisma.system_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends system_logsDeleteManyArgs>(args?: SelectSubset<T, system_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more System_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many System_logs
     * const system_logs = await prisma.system_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends system_logsUpdateManyArgs>(args: SelectSubset<T, system_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more System_logs and returns the data updated in the database.
     * @param {system_logsUpdateManyAndReturnArgs} args - Arguments to update many System_logs.
     * @example
     * // Update many System_logs
     * const system_logs = await prisma.system_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more System_logs and only return the `id`
     * const system_logsWithIdOnly = await prisma.system_logs.updateManyAndReturn({
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
    updateManyAndReturn<T extends system_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, system_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one System_logs.
     * @param {system_logsUpsertArgs} args - Arguments to update or create a System_logs.
     * @example
     * // Update or create a System_logs
     * const system_logs = await prisma.system_logs.upsert({
     *   create: {
     *     // ... data to create a System_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the System_logs we want to update
     *   }
     * })
     */
    upsert<T extends system_logsUpsertArgs>(args: SelectSubset<T, system_logsUpsertArgs<ExtArgs>>): Prisma__system_logsClient<$Result.GetResult<Prisma.$system_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of System_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsCountArgs} args - Arguments to filter System_logs to count.
     * @example
     * // Count the number of System_logs
     * const count = await prisma.system_logs.count({
     *   where: {
     *     // ... the filter for the System_logs we want to count
     *   }
     * })
    **/
    count<T extends system_logsCountArgs>(
      args?: Subset<T, system_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], System_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a System_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {System_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends System_logsAggregateArgs>(args: Subset<T, System_logsAggregateArgs>): Prisma.PrismaPromise<GetSystem_logsAggregateType<T>>

    /**
     * Group by System_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {system_logsGroupByArgs} args - Group by arguments.
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
      T extends system_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: system_logsGroupByArgs['orderBy'] }
        : { orderBy?: system_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, system_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystem_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the system_logs model
   */
  readonly fields: system_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for system_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__system_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the system_logs model
   */
  interface system_logsFieldRefs {
    readonly id: FieldRef<"system_logs", 'BigInt'>
    readonly log_id: FieldRef<"system_logs", 'String'>
    readonly run_id: FieldRef<"system_logs", 'String'>
    readonly workflow_name: FieldRef<"system_logs", 'String'>
    readonly action: FieldRef<"system_logs", 'String'>
    readonly class_id: FieldRef<"system_logs", 'Int'>
    readonly status: FieldRef<"system_logs", 'String'>
    readonly message: FieldRef<"system_logs", 'String'>
    readonly records_affected: FieldRef<"system_logs", 'Int'>
    readonly duration_ms: FieldRef<"system_logs", 'Int'>
    readonly created_at: FieldRef<"system_logs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * system_logs findUnique
   */
  export type system_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter, which system_logs to fetch.
     */
    where: system_logsWhereUniqueInput
  }

  /**
   * system_logs findUniqueOrThrow
   */
  export type system_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter, which system_logs to fetch.
     */
    where: system_logsWhereUniqueInput
  }

  /**
   * system_logs findFirst
   */
  export type system_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter, which system_logs to fetch.
     */
    where?: system_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_logs to fetch.
     */
    orderBy?: system_logsOrderByWithRelationInput | system_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for system_logs.
     */
    cursor?: system_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_logs.
     */
    distinct?: System_logsScalarFieldEnum | System_logsScalarFieldEnum[]
  }

  /**
   * system_logs findFirstOrThrow
   */
  export type system_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter, which system_logs to fetch.
     */
    where?: system_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_logs to fetch.
     */
    orderBy?: system_logsOrderByWithRelationInput | system_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for system_logs.
     */
    cursor?: system_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_logs.
     */
    distinct?: System_logsScalarFieldEnum | System_logsScalarFieldEnum[]
  }

  /**
   * system_logs findMany
   */
  export type system_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter, which system_logs to fetch.
     */
    where?: system_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of system_logs to fetch.
     */
    orderBy?: system_logsOrderByWithRelationInput | system_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing system_logs.
     */
    cursor?: system_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` system_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` system_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of system_logs.
     */
    distinct?: System_logsScalarFieldEnum | System_logsScalarFieldEnum[]
  }

  /**
   * system_logs create
   */
  export type system_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a system_logs.
     */
    data?: XOR<system_logsCreateInput, system_logsUncheckedCreateInput>
  }

  /**
   * system_logs createMany
   */
  export type system_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many system_logs.
     */
    data: system_logsCreateManyInput | system_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * system_logs createManyAndReturn
   */
  export type system_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * The data used to create many system_logs.
     */
    data: system_logsCreateManyInput | system_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * system_logs update
   */
  export type system_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a system_logs.
     */
    data: XOR<system_logsUpdateInput, system_logsUncheckedUpdateInput>
    /**
     * Choose, which system_logs to update.
     */
    where: system_logsWhereUniqueInput
  }

  /**
   * system_logs updateMany
   */
  export type system_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update system_logs.
     */
    data: XOR<system_logsUpdateManyMutationInput, system_logsUncheckedUpdateManyInput>
    /**
     * Filter which system_logs to update
     */
    where?: system_logsWhereInput
    /**
     * Limit how many system_logs to update.
     */
    limit?: number
  }

  /**
   * system_logs updateManyAndReturn
   */
  export type system_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * The data used to update system_logs.
     */
    data: XOR<system_logsUpdateManyMutationInput, system_logsUncheckedUpdateManyInput>
    /**
     * Filter which system_logs to update
     */
    where?: system_logsWhereInput
    /**
     * Limit how many system_logs to update.
     */
    limit?: number
  }

  /**
   * system_logs upsert
   */
  export type system_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the system_logs to update in case it exists.
     */
    where: system_logsWhereUniqueInput
    /**
     * In case the system_logs found by the `where` argument doesn't exist, create a new system_logs with this data.
     */
    create: XOR<system_logsCreateInput, system_logsUncheckedCreateInput>
    /**
     * In case the system_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<system_logsUpdateInput, system_logsUncheckedUpdateInput>
  }

  /**
   * system_logs delete
   */
  export type system_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
    /**
     * Filter which system_logs to delete.
     */
    where: system_logsWhereUniqueInput
  }

  /**
   * system_logs deleteMany
   */
  export type system_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which system_logs to delete
     */
    where?: system_logsWhereInput
    /**
     * Limit how many system_logs to delete.
     */
    limit?: number
  }

  /**
   * system_logs without action
   */
  export type system_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the system_logs
     */
    select?: system_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the system_logs
     */
    omit?: system_logsOmit<ExtArgs> | null
  }


  /**
   * Model teachers
   */

  export type AggregateTeachers = {
    _count: TeachersCountAggregateOutputType | null
    _avg: TeachersAvgAggregateOutputType | null
    _sum: TeachersSumAggregateOutputType | null
    _min: TeachersMinAggregateOutputType | null
    _max: TeachersMaxAggregateOutputType | null
  }

  export type TeachersAvgAggregateOutputType = {
    teacher_id: number | null
    khoi_id: number | null
  }

  export type TeachersSumAggregateOutputType = {
    teacher_id: number | null
    khoi_id: number | null
  }

  export type TeachersMinAggregateOutputType = {
    teacher_id: number | null
    teacher_name: string | null
    teacher_email: string | null
    teacher_phone: string | null
    khoi_id: number | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TeachersMaxAggregateOutputType = {
    teacher_id: number | null
    teacher_name: string | null
    teacher_email: string | null
    teacher_phone: string | null
    khoi_id: number | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TeachersCountAggregateOutputType = {
    teacher_id: number
    teacher_name: number
    teacher_email: number
    teacher_phone: number
    khoi_id: number
    role: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TeachersAvgAggregateInputType = {
    teacher_id?: true
    khoi_id?: true
  }

  export type TeachersSumAggregateInputType = {
    teacher_id?: true
    khoi_id?: true
  }

  export type TeachersMinAggregateInputType = {
    teacher_id?: true
    teacher_name?: true
    teacher_email?: true
    teacher_phone?: true
    khoi_id?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type TeachersMaxAggregateInputType = {
    teacher_id?: true
    teacher_name?: true
    teacher_email?: true
    teacher_phone?: true
    khoi_id?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type TeachersCountAggregateInputType = {
    teacher_id?: true
    teacher_name?: true
    teacher_email?: true
    teacher_phone?: true
    khoi_id?: true
    role?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TeachersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which teachers to aggregate.
     */
    where?: teachersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teachers to fetch.
     */
    orderBy?: teachersOrderByWithRelationInput | teachersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: teachersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned teachers
    **/
    _count?: true | TeachersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeachersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeachersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeachersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeachersMaxAggregateInputType
  }

  export type GetTeachersAggregateType<T extends TeachersAggregateArgs> = {
        [P in keyof T & keyof AggregateTeachers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeachers[P]>
      : GetScalarType<T[P], AggregateTeachers[P]>
  }




  export type teachersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: teachersWhereInput
    orderBy?: teachersOrderByWithAggregationInput | teachersOrderByWithAggregationInput[]
    by: TeachersScalarFieldEnum[] | TeachersScalarFieldEnum
    having?: teachersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeachersCountAggregateInputType | true
    _avg?: TeachersAvgAggregateInputType
    _sum?: TeachersSumAggregateInputType
    _min?: TeachersMinAggregateInputType
    _max?: TeachersMaxAggregateInputType
  }

  export type TeachersGroupByOutputType = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone: string | null
    khoi_id: number
    role: string
    created_at: Date
    updated_at: Date
    _count: TeachersCountAggregateOutputType | null
    _avg: TeachersAvgAggregateOutputType | null
    _sum: TeachersSumAggregateOutputType | null
    _min: TeachersMinAggregateOutputType | null
    _max: TeachersMaxAggregateOutputType | null
  }

  type GetTeachersGroupByPayload<T extends teachersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeachersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeachersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeachersGroupByOutputType[P]>
            : GetScalarType<T[P], TeachersGroupByOutputType[P]>
        }
      >
    >


  export type teachersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    teacher_id?: boolean
    teacher_name?: boolean
    teacher_email?: boolean
    teacher_phone?: boolean
    khoi_id?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    classes?: boolean | teachers$classesArgs<ExtArgs>
    label_change_logs?: boolean | teachers$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | teachers$pass_reviewsArgs<ExtArgs>
    _count?: boolean | TeachersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teachers"]>

  export type teachersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    teacher_id?: boolean
    teacher_name?: boolean
    teacher_email?: boolean
    teacher_phone?: boolean
    khoi_id?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["teachers"]>

  export type teachersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    teacher_id?: boolean
    teacher_name?: boolean
    teacher_email?: boolean
    teacher_phone?: boolean
    khoi_id?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["teachers"]>

  export type teachersSelectScalar = {
    teacher_id?: boolean
    teacher_name?: boolean
    teacher_email?: boolean
    teacher_phone?: boolean
    khoi_id?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type teachersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"teacher_id" | "teacher_name" | "teacher_email" | "teacher_phone" | "khoi_id" | "role" | "created_at" | "updated_at", ExtArgs["result"]["teachers"]>
  export type teachersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | teachers$classesArgs<ExtArgs>
    label_change_logs?: boolean | teachers$label_change_logsArgs<ExtArgs>
    pass_reviews?: boolean | teachers$pass_reviewsArgs<ExtArgs>
    _count?: boolean | TeachersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type teachersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type teachersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $teachersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "teachers"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>[]
      label_change_logs: Prisma.$label_change_logsPayload<ExtArgs>[]
      pass_reviews: Prisma.$pass_reviewsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      teacher_id: number
      teacher_name: string
      teacher_email: string
      teacher_phone: string | null
      khoi_id: number
      role: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["teachers"]>
    composites: {}
  }

  type teachersGetPayload<S extends boolean | null | undefined | teachersDefaultArgs> = $Result.GetResult<Prisma.$teachersPayload, S>

  type teachersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<teachersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeachersCountAggregateInputType | true
    }

  export interface teachersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['teachers'], meta: { name: 'teachers' } }
    /**
     * Find zero or one Teachers that matches the filter.
     * @param {teachersFindUniqueArgs} args - Arguments to find a Teachers
     * @example
     * // Get one Teachers
     * const teachers = await prisma.teachers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends teachersFindUniqueArgs>(args: SelectSubset<T, teachersFindUniqueArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Teachers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {teachersFindUniqueOrThrowArgs} args - Arguments to find a Teachers
     * @example
     * // Get one Teachers
     * const teachers = await prisma.teachers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends teachersFindUniqueOrThrowArgs>(args: SelectSubset<T, teachersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Teachers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersFindFirstArgs} args - Arguments to find a Teachers
     * @example
     * // Get one Teachers
     * const teachers = await prisma.teachers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends teachersFindFirstArgs>(args?: SelectSubset<T, teachersFindFirstArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Teachers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersFindFirstOrThrowArgs} args - Arguments to find a Teachers
     * @example
     * // Get one Teachers
     * const teachers = await prisma.teachers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends teachersFindFirstOrThrowArgs>(args?: SelectSubset<T, teachersFindFirstOrThrowArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teachers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teachers
     * const teachers = await prisma.teachers.findMany()
     * 
     * // Get first 10 Teachers
     * const teachers = await prisma.teachers.findMany({ take: 10 })
     * 
     * // Only select the `teacher_id`
     * const teachersWithTeacher_idOnly = await prisma.teachers.findMany({ select: { teacher_id: true } })
     * 
     */
    findMany<T extends teachersFindManyArgs>(args?: SelectSubset<T, teachersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Teachers.
     * @param {teachersCreateArgs} args - Arguments to create a Teachers.
     * @example
     * // Create one Teachers
     * const Teachers = await prisma.teachers.create({
     *   data: {
     *     // ... data to create a Teachers
     *   }
     * })
     * 
     */
    create<T extends teachersCreateArgs>(args: SelectSubset<T, teachersCreateArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teachers.
     * @param {teachersCreateManyArgs} args - Arguments to create many Teachers.
     * @example
     * // Create many Teachers
     * const teachers = await prisma.teachers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends teachersCreateManyArgs>(args?: SelectSubset<T, teachersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teachers and returns the data saved in the database.
     * @param {teachersCreateManyAndReturnArgs} args - Arguments to create many Teachers.
     * @example
     * // Create many Teachers
     * const teachers = await prisma.teachers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teachers and only return the `teacher_id`
     * const teachersWithTeacher_idOnly = await prisma.teachers.createManyAndReturn({
     *   select: { teacher_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends teachersCreateManyAndReturnArgs>(args?: SelectSubset<T, teachersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Teachers.
     * @param {teachersDeleteArgs} args - Arguments to delete one Teachers.
     * @example
     * // Delete one Teachers
     * const Teachers = await prisma.teachers.delete({
     *   where: {
     *     // ... filter to delete one Teachers
     *   }
     * })
     * 
     */
    delete<T extends teachersDeleteArgs>(args: SelectSubset<T, teachersDeleteArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Teachers.
     * @param {teachersUpdateArgs} args - Arguments to update one Teachers.
     * @example
     * // Update one Teachers
     * const teachers = await prisma.teachers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends teachersUpdateArgs>(args: SelectSubset<T, teachersUpdateArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teachers.
     * @param {teachersDeleteManyArgs} args - Arguments to filter Teachers to delete.
     * @example
     * // Delete a few Teachers
     * const { count } = await prisma.teachers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends teachersDeleteManyArgs>(args?: SelectSubset<T, teachersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teachers
     * const teachers = await prisma.teachers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends teachersUpdateManyArgs>(args: SelectSubset<T, teachersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teachers and returns the data updated in the database.
     * @param {teachersUpdateManyAndReturnArgs} args - Arguments to update many Teachers.
     * @example
     * // Update many Teachers
     * const teachers = await prisma.teachers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teachers and only return the `teacher_id`
     * const teachersWithTeacher_idOnly = await prisma.teachers.updateManyAndReturn({
     *   select: { teacher_id: true },
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
    updateManyAndReturn<T extends teachersUpdateManyAndReturnArgs>(args: SelectSubset<T, teachersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Teachers.
     * @param {teachersUpsertArgs} args - Arguments to update or create a Teachers.
     * @example
     * // Update or create a Teachers
     * const teachers = await prisma.teachers.upsert({
     *   create: {
     *     // ... data to create a Teachers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Teachers we want to update
     *   }
     * })
     */
    upsert<T extends teachersUpsertArgs>(args: SelectSubset<T, teachersUpsertArgs<ExtArgs>>): Prisma__teachersClient<$Result.GetResult<Prisma.$teachersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersCountArgs} args - Arguments to filter Teachers to count.
     * @example
     * // Count the number of Teachers
     * const count = await prisma.teachers.count({
     *   where: {
     *     // ... the filter for the Teachers we want to count
     *   }
     * })
    **/
    count<T extends teachersCountArgs>(
      args?: Subset<T, teachersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeachersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeachersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeachersAggregateArgs>(args: Subset<T, TeachersAggregateArgs>): Prisma.PrismaPromise<GetTeachersAggregateType<T>>

    /**
     * Group by Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {teachersGroupByArgs} args - Group by arguments.
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
      T extends teachersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: teachersGroupByArgs['orderBy'] }
        : { orderBy?: teachersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, teachersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeachersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the teachers model
   */
  readonly fields: teachersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for teachers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__teachersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends teachers$classesArgs<ExtArgs> = {}>(args?: Subset<T, teachers$classesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    label_change_logs<T extends teachers$label_change_logsArgs<ExtArgs> = {}>(args?: Subset<T, teachers$label_change_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$label_change_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pass_reviews<T extends teachers$pass_reviewsArgs<ExtArgs> = {}>(args?: Subset<T, teachers$pass_reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pass_reviewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the teachers model
   */
  interface teachersFieldRefs {
    readonly teacher_id: FieldRef<"teachers", 'Int'>
    readonly teacher_name: FieldRef<"teachers", 'String'>
    readonly teacher_email: FieldRef<"teachers", 'String'>
    readonly teacher_phone: FieldRef<"teachers", 'String'>
    readonly khoi_id: FieldRef<"teachers", 'Int'>
    readonly role: FieldRef<"teachers", 'String'>
    readonly created_at: FieldRef<"teachers", 'DateTime'>
    readonly updated_at: FieldRef<"teachers", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * teachers findUnique
   */
  export type teachersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter, which teachers to fetch.
     */
    where: teachersWhereUniqueInput
  }

  /**
   * teachers findUniqueOrThrow
   */
  export type teachersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter, which teachers to fetch.
     */
    where: teachersWhereUniqueInput
  }

  /**
   * teachers findFirst
   */
  export type teachersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter, which teachers to fetch.
     */
    where?: teachersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teachers to fetch.
     */
    orderBy?: teachersOrderByWithRelationInput | teachersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for teachers.
     */
    cursor?: teachersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of teachers.
     */
    distinct?: TeachersScalarFieldEnum | TeachersScalarFieldEnum[]
  }

  /**
   * teachers findFirstOrThrow
   */
  export type teachersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter, which teachers to fetch.
     */
    where?: teachersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teachers to fetch.
     */
    orderBy?: teachersOrderByWithRelationInput | teachersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for teachers.
     */
    cursor?: teachersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of teachers.
     */
    distinct?: TeachersScalarFieldEnum | TeachersScalarFieldEnum[]
  }

  /**
   * teachers findMany
   */
  export type teachersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter, which teachers to fetch.
     */
    where?: teachersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of teachers to fetch.
     */
    orderBy?: teachersOrderByWithRelationInput | teachersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing teachers.
     */
    cursor?: teachersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of teachers.
     */
    distinct?: TeachersScalarFieldEnum | TeachersScalarFieldEnum[]
  }

  /**
   * teachers create
   */
  export type teachersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * The data needed to create a teachers.
     */
    data: XOR<teachersCreateInput, teachersUncheckedCreateInput>
  }

  /**
   * teachers createMany
   */
  export type teachersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many teachers.
     */
    data: teachersCreateManyInput | teachersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * teachers createManyAndReturn
   */
  export type teachersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * The data used to create many teachers.
     */
    data: teachersCreateManyInput | teachersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * teachers update
   */
  export type teachersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * The data needed to update a teachers.
     */
    data: XOR<teachersUpdateInput, teachersUncheckedUpdateInput>
    /**
     * Choose, which teachers to update.
     */
    where: teachersWhereUniqueInput
  }

  /**
   * teachers updateMany
   */
  export type teachersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update teachers.
     */
    data: XOR<teachersUpdateManyMutationInput, teachersUncheckedUpdateManyInput>
    /**
     * Filter which teachers to update
     */
    where?: teachersWhereInput
    /**
     * Limit how many teachers to update.
     */
    limit?: number
  }

  /**
   * teachers updateManyAndReturn
   */
  export type teachersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * The data used to update teachers.
     */
    data: XOR<teachersUpdateManyMutationInput, teachersUncheckedUpdateManyInput>
    /**
     * Filter which teachers to update
     */
    where?: teachersWhereInput
    /**
     * Limit how many teachers to update.
     */
    limit?: number
  }

  /**
   * teachers upsert
   */
  export type teachersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * The filter to search for the teachers to update in case it exists.
     */
    where: teachersWhereUniqueInput
    /**
     * In case the teachers found by the `where` argument doesn't exist, create a new teachers with this data.
     */
    create: XOR<teachersCreateInput, teachersUncheckedCreateInput>
    /**
     * In case the teachers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<teachersUpdateInput, teachersUncheckedUpdateInput>
  }

  /**
   * teachers delete
   */
  export type teachersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
    /**
     * Filter which teachers to delete.
     */
    where: teachersWhereUniqueInput
  }

  /**
   * teachers deleteMany
   */
  export type teachersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which teachers to delete
     */
    where?: teachersWhereInput
    /**
     * Limit how many teachers to delete.
     */
    limit?: number
  }

  /**
   * teachers.classes
   */
  export type teachers$classesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the classes
     */
    select?: classesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the classes
     */
    omit?: classesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: classesInclude<ExtArgs> | null
    where?: classesWhereInput
    orderBy?: classesOrderByWithRelationInput | classesOrderByWithRelationInput[]
    cursor?: classesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassesScalarFieldEnum | ClassesScalarFieldEnum[]
  }

  /**
   * teachers.label_change_logs
   */
  export type teachers$label_change_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the label_change_logs
     */
    select?: label_change_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the label_change_logs
     */
    omit?: label_change_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: label_change_logsInclude<ExtArgs> | null
    where?: label_change_logsWhereInput
    orderBy?: label_change_logsOrderByWithRelationInput | label_change_logsOrderByWithRelationInput[]
    cursor?: label_change_logsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Label_change_logsScalarFieldEnum | Label_change_logsScalarFieldEnum[]
  }

  /**
   * teachers.pass_reviews
   */
  export type teachers$pass_reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pass_reviews
     */
    select?: pass_reviewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pass_reviews
     */
    omit?: pass_reviewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pass_reviewsInclude<ExtArgs> | null
    where?: pass_reviewsWhereInput
    orderBy?: pass_reviewsOrderByWithRelationInput | pass_reviewsOrderByWithRelationInput[]
    cursor?: pass_reviewsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Pass_reviewsScalarFieldEnum | Pass_reviewsScalarFieldEnum[]
  }

  /**
   * teachers without action
   */
  export type teachersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the teachers
     */
    select?: teachersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the teachers
     */
    omit?: teachersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: teachersInclude<ExtArgs> | null
  }


  /**
   * Model test_scores
   */

  export type AggregateTest_scores = {
    _count: Test_scoresCountAggregateOutputType | null
    _avg: Test_scoresAvgAggregateOutputType | null
    _sum: Test_scoresSumAggregateOutputType | null
    _min: Test_scoresMinAggregateOutputType | null
    _max: Test_scoresMaxAggregateOutputType | null
  }

  export type Test_scoresAvgAggregateOutputType = {
    id: number | null
    student_id: number | null
    class_id: number | null
    test_order: number | null
    raw_score: Decimal | null
    max_score: Decimal | null
    grade_percent: Decimal | null
    makeup_score: Decimal | null
    final_score: Decimal | null
  }

  export type Test_scoresSumAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    test_order: number | null
    raw_score: Decimal | null
    max_score: Decimal | null
    grade_percent: Decimal | null
    makeup_score: Decimal | null
    final_score: Decimal | null
  }

  export type Test_scoresMinAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    test_order: number | null
    test_name: string | null
    raw_score: Decimal | null
    max_score: Decimal | null
    grade_percent: Decimal | null
    is_makeup: boolean | null
    makeup_score: Decimal | null
    final_score: Decimal | null
    grade_status: string | null
    is_cheating: boolean | null
    grade_note: string | null
    label_at_time: string | null
    scraped_at: Date | null
    created_at: Date | null
  }

  export type Test_scoresMaxAggregateOutputType = {
    id: bigint | null
    student_id: number | null
    class_id: number | null
    test_order: number | null
    test_name: string | null
    raw_score: Decimal | null
    max_score: Decimal | null
    grade_percent: Decimal | null
    is_makeup: boolean | null
    makeup_score: Decimal | null
    final_score: Decimal | null
    grade_status: string | null
    is_cheating: boolean | null
    grade_note: string | null
    label_at_time: string | null
    scraped_at: Date | null
    created_at: Date | null
  }

  export type Test_scoresCountAggregateOutputType = {
    id: number
    student_id: number
    class_id: number
    test_order: number
    test_name: number
    raw_score: number
    max_score: number
    grade_percent: number
    is_makeup: number
    makeup_score: number
    final_score: number
    grade_status: number
    is_cheating: number
    grade_note: number
    label_at_time: number
    scraped_at: number
    created_at: number
    _all: number
  }


  export type Test_scoresAvgAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    test_order?: true
    raw_score?: true
    max_score?: true
    grade_percent?: true
    makeup_score?: true
    final_score?: true
  }

  export type Test_scoresSumAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    test_order?: true
    raw_score?: true
    max_score?: true
    grade_percent?: true
    makeup_score?: true
    final_score?: true
  }

  export type Test_scoresMinAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    test_order?: true
    test_name?: true
    raw_score?: true
    max_score?: true
    grade_percent?: true
    is_makeup?: true
    makeup_score?: true
    final_score?: true
    grade_status?: true
    is_cheating?: true
    grade_note?: true
    label_at_time?: true
    scraped_at?: true
    created_at?: true
  }

  export type Test_scoresMaxAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    test_order?: true
    test_name?: true
    raw_score?: true
    max_score?: true
    grade_percent?: true
    is_makeup?: true
    makeup_score?: true
    final_score?: true
    grade_status?: true
    is_cheating?: true
    grade_note?: true
    label_at_time?: true
    scraped_at?: true
    created_at?: true
  }

  export type Test_scoresCountAggregateInputType = {
    id?: true
    student_id?: true
    class_id?: true
    test_order?: true
    test_name?: true
    raw_score?: true
    max_score?: true
    grade_percent?: true
    is_makeup?: true
    makeup_score?: true
    final_score?: true
    grade_status?: true
    is_cheating?: true
    grade_note?: true
    label_at_time?: true
    scraped_at?: true
    created_at?: true
    _all?: true
  }

  export type Test_scoresAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which test_scores to aggregate.
     */
    where?: test_scoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of test_scores to fetch.
     */
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: test_scoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` test_scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` test_scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned test_scores
    **/
    _count?: true | Test_scoresCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Test_scoresAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Test_scoresSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Test_scoresMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Test_scoresMaxAggregateInputType
  }

  export type GetTest_scoresAggregateType<T extends Test_scoresAggregateArgs> = {
        [P in keyof T & keyof AggregateTest_scores]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTest_scores[P]>
      : GetScalarType<T[P], AggregateTest_scores[P]>
  }




  export type test_scoresGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: test_scoresWhereInput
    orderBy?: test_scoresOrderByWithAggregationInput | test_scoresOrderByWithAggregationInput[]
    by: Test_scoresScalarFieldEnum[] | Test_scoresScalarFieldEnum
    having?: test_scoresScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Test_scoresCountAggregateInputType | true
    _avg?: Test_scoresAvgAggregateInputType
    _sum?: Test_scoresSumAggregateInputType
    _min?: Test_scoresMinAggregateInputType
    _max?: Test_scoresMaxAggregateInputType
  }

  export type Test_scoresGroupByOutputType = {
    id: bigint
    student_id: number
    class_id: number
    test_order: number
    test_name: string
    raw_score: Decimal | null
    max_score: Decimal | null
    grade_percent: Decimal | null
    is_makeup: boolean
    makeup_score: Decimal | null
    final_score: Decimal | null
    grade_status: string | null
    is_cheating: boolean
    grade_note: string | null
    label_at_time: string | null
    scraped_at: Date
    created_at: Date
    _count: Test_scoresCountAggregateOutputType | null
    _avg: Test_scoresAvgAggregateOutputType | null
    _sum: Test_scoresSumAggregateOutputType | null
    _min: Test_scoresMinAggregateOutputType | null
    _max: Test_scoresMaxAggregateOutputType | null
  }

  type GetTest_scoresGroupByPayload<T extends test_scoresGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Test_scoresGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Test_scoresGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Test_scoresGroupByOutputType[P]>
            : GetScalarType<T[P], Test_scoresGroupByOutputType[P]>
        }
      >
    >


  export type test_scoresSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    test_order?: boolean
    test_name?: boolean
    raw_score?: boolean
    max_score?: boolean
    grade_percent?: boolean
    is_makeup?: boolean
    makeup_score?: boolean
    final_score?: boolean
    grade_status?: boolean
    is_cheating?: boolean
    grade_note?: boolean
    label_at_time?: boolean
    scraped_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test_scores"]>

  export type test_scoresSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    test_order?: boolean
    test_name?: boolean
    raw_score?: boolean
    max_score?: boolean
    grade_percent?: boolean
    is_makeup?: boolean
    makeup_score?: boolean
    final_score?: boolean
    grade_status?: boolean
    is_cheating?: boolean
    grade_note?: boolean
    label_at_time?: boolean
    scraped_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test_scores"]>

  export type test_scoresSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    test_order?: boolean
    test_name?: boolean
    raw_score?: boolean
    max_score?: boolean
    grade_percent?: boolean
    is_makeup?: boolean
    makeup_score?: boolean
    final_score?: boolean
    grade_status?: boolean
    is_cheating?: boolean
    grade_note?: boolean
    label_at_time?: boolean
    scraped_at?: boolean
    created_at?: boolean
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test_scores"]>

  export type test_scoresSelectScalar = {
    id?: boolean
    student_id?: boolean
    class_id?: boolean
    test_order?: boolean
    test_name?: boolean
    raw_score?: boolean
    max_score?: boolean
    grade_percent?: boolean
    is_makeup?: boolean
    makeup_score?: boolean
    final_score?: boolean
    grade_status?: boolean
    is_cheating?: boolean
    grade_note?: boolean
    label_at_time?: boolean
    scraped_at?: boolean
    created_at?: boolean
  }

  export type test_scoresOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "student_id" | "class_id" | "test_order" | "test_name" | "raw_score" | "max_score" | "grade_percent" | "is_makeup" | "makeup_score" | "final_score" | "grade_status" | "is_cheating" | "grade_note" | "label_at_time" | "scraped_at" | "created_at", ExtArgs["result"]["test_scores"]>
  export type test_scoresInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }
  export type test_scoresIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }
  export type test_scoresIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classes?: boolean | classesDefaultArgs<ExtArgs>
    students?: boolean | studentsDefaultArgs<ExtArgs>
  }

  export type $test_scoresPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "test_scores"
    objects: {
      classes: Prisma.$classesPayload<ExtArgs>
      students: Prisma.$studentsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      student_id: number
      class_id: number
      test_order: number
      test_name: string
      raw_score: Prisma.Decimal | null
      max_score: Prisma.Decimal | null
      grade_percent: Prisma.Decimal | null
      is_makeup: boolean
      makeup_score: Prisma.Decimal | null
      final_score: Prisma.Decimal | null
      grade_status: string | null
      is_cheating: boolean
      grade_note: string | null
      label_at_time: string | null
      scraped_at: Date
      created_at: Date
    }, ExtArgs["result"]["test_scores"]>
    composites: {}
  }

  type test_scoresGetPayload<S extends boolean | null | undefined | test_scoresDefaultArgs> = $Result.GetResult<Prisma.$test_scoresPayload, S>

  type test_scoresCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<test_scoresFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Test_scoresCountAggregateInputType | true
    }

  export interface test_scoresDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['test_scores'], meta: { name: 'test_scores' } }
    /**
     * Find zero or one Test_scores that matches the filter.
     * @param {test_scoresFindUniqueArgs} args - Arguments to find a Test_scores
     * @example
     * // Get one Test_scores
     * const test_scores = await prisma.test_scores.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends test_scoresFindUniqueArgs>(args: SelectSubset<T, test_scoresFindUniqueArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Test_scores that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {test_scoresFindUniqueOrThrowArgs} args - Arguments to find a Test_scores
     * @example
     * // Get one Test_scores
     * const test_scores = await prisma.test_scores.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends test_scoresFindUniqueOrThrowArgs>(args: SelectSubset<T, test_scoresFindUniqueOrThrowArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test_scores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresFindFirstArgs} args - Arguments to find a Test_scores
     * @example
     * // Get one Test_scores
     * const test_scores = await prisma.test_scores.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends test_scoresFindFirstArgs>(args?: SelectSubset<T, test_scoresFindFirstArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test_scores that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresFindFirstOrThrowArgs} args - Arguments to find a Test_scores
     * @example
     * // Get one Test_scores
     * const test_scores = await prisma.test_scores.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends test_scoresFindFirstOrThrowArgs>(args?: SelectSubset<T, test_scoresFindFirstOrThrowArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Test_scores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Test_scores
     * const test_scores = await prisma.test_scores.findMany()
     * 
     * // Get first 10 Test_scores
     * const test_scores = await prisma.test_scores.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const test_scoresWithIdOnly = await prisma.test_scores.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends test_scoresFindManyArgs>(args?: SelectSubset<T, test_scoresFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Test_scores.
     * @param {test_scoresCreateArgs} args - Arguments to create a Test_scores.
     * @example
     * // Create one Test_scores
     * const Test_scores = await prisma.test_scores.create({
     *   data: {
     *     // ... data to create a Test_scores
     *   }
     * })
     * 
     */
    create<T extends test_scoresCreateArgs>(args: SelectSubset<T, test_scoresCreateArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Test_scores.
     * @param {test_scoresCreateManyArgs} args - Arguments to create many Test_scores.
     * @example
     * // Create many Test_scores
     * const test_scores = await prisma.test_scores.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends test_scoresCreateManyArgs>(args?: SelectSubset<T, test_scoresCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Test_scores and returns the data saved in the database.
     * @param {test_scoresCreateManyAndReturnArgs} args - Arguments to create many Test_scores.
     * @example
     * // Create many Test_scores
     * const test_scores = await prisma.test_scores.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Test_scores and only return the `id`
     * const test_scoresWithIdOnly = await prisma.test_scores.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends test_scoresCreateManyAndReturnArgs>(args?: SelectSubset<T, test_scoresCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Test_scores.
     * @param {test_scoresDeleteArgs} args - Arguments to delete one Test_scores.
     * @example
     * // Delete one Test_scores
     * const Test_scores = await prisma.test_scores.delete({
     *   where: {
     *     // ... filter to delete one Test_scores
     *   }
     * })
     * 
     */
    delete<T extends test_scoresDeleteArgs>(args: SelectSubset<T, test_scoresDeleteArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Test_scores.
     * @param {test_scoresUpdateArgs} args - Arguments to update one Test_scores.
     * @example
     * // Update one Test_scores
     * const test_scores = await prisma.test_scores.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends test_scoresUpdateArgs>(args: SelectSubset<T, test_scoresUpdateArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Test_scores.
     * @param {test_scoresDeleteManyArgs} args - Arguments to filter Test_scores to delete.
     * @example
     * // Delete a few Test_scores
     * const { count } = await prisma.test_scores.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends test_scoresDeleteManyArgs>(args?: SelectSubset<T, test_scoresDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Test_scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Test_scores
     * const test_scores = await prisma.test_scores.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends test_scoresUpdateManyArgs>(args: SelectSubset<T, test_scoresUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Test_scores and returns the data updated in the database.
     * @param {test_scoresUpdateManyAndReturnArgs} args - Arguments to update many Test_scores.
     * @example
     * // Update many Test_scores
     * const test_scores = await prisma.test_scores.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Test_scores and only return the `id`
     * const test_scoresWithIdOnly = await prisma.test_scores.updateManyAndReturn({
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
    updateManyAndReturn<T extends test_scoresUpdateManyAndReturnArgs>(args: SelectSubset<T, test_scoresUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Test_scores.
     * @param {test_scoresUpsertArgs} args - Arguments to update or create a Test_scores.
     * @example
     * // Update or create a Test_scores
     * const test_scores = await prisma.test_scores.upsert({
     *   create: {
     *     // ... data to create a Test_scores
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Test_scores we want to update
     *   }
     * })
     */
    upsert<T extends test_scoresUpsertArgs>(args: SelectSubset<T, test_scoresUpsertArgs<ExtArgs>>): Prisma__test_scoresClient<$Result.GetResult<Prisma.$test_scoresPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Test_scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresCountArgs} args - Arguments to filter Test_scores to count.
     * @example
     * // Count the number of Test_scores
     * const count = await prisma.test_scores.count({
     *   where: {
     *     // ... the filter for the Test_scores we want to count
     *   }
     * })
    **/
    count<T extends test_scoresCountArgs>(
      args?: Subset<T, test_scoresCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Test_scoresCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Test_scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Test_scoresAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Test_scoresAggregateArgs>(args: Subset<T, Test_scoresAggregateArgs>): Prisma.PrismaPromise<GetTest_scoresAggregateType<T>>

    /**
     * Group by Test_scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {test_scoresGroupByArgs} args - Group by arguments.
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
      T extends test_scoresGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: test_scoresGroupByArgs['orderBy'] }
        : { orderBy?: test_scoresGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, test_scoresGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTest_scoresGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the test_scores model
   */
  readonly fields: test_scoresFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for test_scores.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__test_scoresClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classes<T extends classesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, classesDefaultArgs<ExtArgs>>): Prisma__classesClient<$Result.GetResult<Prisma.$classesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    students<T extends studentsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, studentsDefaultArgs<ExtArgs>>): Prisma__studentsClient<$Result.GetResult<Prisma.$studentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the test_scores model
   */
  interface test_scoresFieldRefs {
    readonly id: FieldRef<"test_scores", 'BigInt'>
    readonly student_id: FieldRef<"test_scores", 'Int'>
    readonly class_id: FieldRef<"test_scores", 'Int'>
    readonly test_order: FieldRef<"test_scores", 'Int'>
    readonly test_name: FieldRef<"test_scores", 'String'>
    readonly raw_score: FieldRef<"test_scores", 'Decimal'>
    readonly max_score: FieldRef<"test_scores", 'Decimal'>
    readonly grade_percent: FieldRef<"test_scores", 'Decimal'>
    readonly is_makeup: FieldRef<"test_scores", 'Boolean'>
    readonly makeup_score: FieldRef<"test_scores", 'Decimal'>
    readonly final_score: FieldRef<"test_scores", 'Decimal'>
    readonly grade_status: FieldRef<"test_scores", 'String'>
    readonly is_cheating: FieldRef<"test_scores", 'Boolean'>
    readonly grade_note: FieldRef<"test_scores", 'String'>
    readonly label_at_time: FieldRef<"test_scores", 'String'>
    readonly scraped_at: FieldRef<"test_scores", 'DateTime'>
    readonly created_at: FieldRef<"test_scores", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * test_scores findUnique
   */
  export type test_scoresFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter, which test_scores to fetch.
     */
    where: test_scoresWhereUniqueInput
  }

  /**
   * test_scores findUniqueOrThrow
   */
  export type test_scoresFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter, which test_scores to fetch.
     */
    where: test_scoresWhereUniqueInput
  }

  /**
   * test_scores findFirst
   */
  export type test_scoresFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter, which test_scores to fetch.
     */
    where?: test_scoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of test_scores to fetch.
     */
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for test_scores.
     */
    cursor?: test_scoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` test_scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` test_scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of test_scores.
     */
    distinct?: Test_scoresScalarFieldEnum | Test_scoresScalarFieldEnum[]
  }

  /**
   * test_scores findFirstOrThrow
   */
  export type test_scoresFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter, which test_scores to fetch.
     */
    where?: test_scoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of test_scores to fetch.
     */
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for test_scores.
     */
    cursor?: test_scoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` test_scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` test_scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of test_scores.
     */
    distinct?: Test_scoresScalarFieldEnum | Test_scoresScalarFieldEnum[]
  }

  /**
   * test_scores findMany
   */
  export type test_scoresFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter, which test_scores to fetch.
     */
    where?: test_scoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of test_scores to fetch.
     */
    orderBy?: test_scoresOrderByWithRelationInput | test_scoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing test_scores.
     */
    cursor?: test_scoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` test_scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` test_scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of test_scores.
     */
    distinct?: Test_scoresScalarFieldEnum | Test_scoresScalarFieldEnum[]
  }

  /**
   * test_scores create
   */
  export type test_scoresCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * The data needed to create a test_scores.
     */
    data: XOR<test_scoresCreateInput, test_scoresUncheckedCreateInput>
  }

  /**
   * test_scores createMany
   */
  export type test_scoresCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many test_scores.
     */
    data: test_scoresCreateManyInput | test_scoresCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * test_scores createManyAndReturn
   */
  export type test_scoresCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * The data used to create many test_scores.
     */
    data: test_scoresCreateManyInput | test_scoresCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * test_scores update
   */
  export type test_scoresUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * The data needed to update a test_scores.
     */
    data: XOR<test_scoresUpdateInput, test_scoresUncheckedUpdateInput>
    /**
     * Choose, which test_scores to update.
     */
    where: test_scoresWhereUniqueInput
  }

  /**
   * test_scores updateMany
   */
  export type test_scoresUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update test_scores.
     */
    data: XOR<test_scoresUpdateManyMutationInput, test_scoresUncheckedUpdateManyInput>
    /**
     * Filter which test_scores to update
     */
    where?: test_scoresWhereInput
    /**
     * Limit how many test_scores to update.
     */
    limit?: number
  }

  /**
   * test_scores updateManyAndReturn
   */
  export type test_scoresUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * The data used to update test_scores.
     */
    data: XOR<test_scoresUpdateManyMutationInput, test_scoresUncheckedUpdateManyInput>
    /**
     * Filter which test_scores to update
     */
    where?: test_scoresWhereInput
    /**
     * Limit how many test_scores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * test_scores upsert
   */
  export type test_scoresUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * The filter to search for the test_scores to update in case it exists.
     */
    where: test_scoresWhereUniqueInput
    /**
     * In case the test_scores found by the `where` argument doesn't exist, create a new test_scores with this data.
     */
    create: XOR<test_scoresCreateInput, test_scoresUncheckedCreateInput>
    /**
     * In case the test_scores was found with the provided `where` argument, update it with this data.
     */
    update: XOR<test_scoresUpdateInput, test_scoresUncheckedUpdateInput>
  }

  /**
   * test_scores delete
   */
  export type test_scoresDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
    /**
     * Filter which test_scores to delete.
     */
    where: test_scoresWhereUniqueInput
  }

  /**
   * test_scores deleteMany
   */
  export type test_scoresDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which test_scores to delete
     */
    where?: test_scoresWhereInput
    /**
     * Limit how many test_scores to delete.
     */
    limit?: number
  }

  /**
   * test_scores without action
   */
  export type test_scoresDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the test_scores
     */
    select?: test_scoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the test_scores
     */
    omit?: test_scoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: test_scoresInclude<ExtArgs> | null
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


  export const Class_daily_snapshotsScalarFieldEnum: {
    id: 'id',
    class_id: 'class_id',
    snapshot_date: 'snapshot_date',
    completed_sessions: 'completed_sessions',
    progress_pct: 'progress_pct',
    active_students: 'active_students',
    on_hold_students: 'on_hold_students',
    dropped_students: 'dropped_students',
    transferred_students: 'transferred_students',
    attendance_avg: 'attendance_avg',
    homework_avg: 'homework_avg',
    pass_chuan_rate: 'pass_chuan_rate',
    pass_mem_rate: 'pass_mem_rate',
    label_yellow: 'label_yellow',
    label_red: 'label_red',
    label_grey: 'label_grey',
    label_no_data: 'label_no_data',
    risk_pct: 'risk_pct',
    is_alarm_triggered: 'is_alarm_triggered',
    health_status: 'health_status',
    scraped_at: 'scraped_at'
  };

  export type Class_daily_snapshotsScalarFieldEnum = (typeof Class_daily_snapshotsScalarFieldEnum)[keyof typeof Class_daily_snapshotsScalarFieldEnum]


  export const ClassesScalarFieldEnum: {
    class_id: 'class_id',
    class_name: 'class_name',
    course_id: 'course_id',
    teacher_id: 'teacher_id',
    lead_email: 'lead_email',
    status: 'status',
    schedule: 'schedule',
    location: 'location',
    opening_date: 'opening_date',
    ending_date: 'ending_date',
    total_sessions: 'total_sessions',
    portal_url: 'portal_url',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ClassesScalarFieldEnum = (typeof ClassesScalarFieldEnum)[keyof typeof ClassesScalarFieldEnum]


  export const Label_change_logsScalarFieldEnum: {
    id: 'id',
    log_id: 'log_id',
    student_id: 'student_id',
    class_id: 'class_id',
    teacher_id: 'teacher_id',
    from_label: 'from_label',
    to_label: 'to_label',
    direction: 'direction',
    severity: 'severity',
    step_count: 'step_count',
    reason: 'reason',
    checkpoint: 'checkpoint',
    test_average_after: 'test_average_after',
    attendance_pct: 'attendance_pct',
    homework_pct: 'homework_pct',
    email_sent: 'email_sent',
    email_sent_at: 'email_sent_at',
    created_at: 'created_at'
  };

  export type Label_change_logsScalarFieldEnum = (typeof Label_change_logsScalarFieldEnum)[keyof typeof Label_change_logsScalarFieldEnum]


  export const Pass_reviewsScalarFieldEnum: {
    id: 'id',
    review_id: 'review_id',
    student_id: 'student_id',
    class_id: 'class_id',
    teacher_id: 'teacher_id',
    pass_mem_group: 'pass_mem_group',
    test_average: 'test_average',
    attendance_pct: 'attendance_pct',
    homework_pct: 'homework_pct',
    review_status: 'review_status',
    teacher_decision: 'teacher_decision',
    teacher_comment: 'teacher_comment',
    confirmed_at: 'confirmed_at',
    deadline: 'deadline',
    is_overdue: 'is_overdue',
    escalated_to_lead: 'escalated_to_lead',
    lead_email_sent: 'lead_email_sent',
    created_at: 'created_at'
  };

  export type Pass_reviewsScalarFieldEnum = (typeof Pass_reviewsScalarFieldEnum)[keyof typeof Pass_reviewsScalarFieldEnum]


  export const Student_daily_recordsScalarFieldEnum: {
    id: 'id',
    student_id: 'student_id',
    class_id: 'class_id',
    record_date: 'record_date',
    attendance_pct: 'attendance_pct',
    attendance_present: 'attendance_present',
    attendance_total: 'attendance_total',
    homework_pct: 'homework_pct',
    homework_done: 'homework_done',
    homework_total: 'homework_total',
    test_1: 'test_1',
    test_2: 'test_2',
    test_3: 'test_3',
    test_4: 'test_4',
    test_5: 'test_5',
    test_6: 'test_6',
    tests_taken: 'tests_taken',
    test_average: 'test_average',
    current_label: 'current_label',
    previous_label: 'previous_label',
    benchmark_label: 'benchmark_label',
    has_label_changed: 'has_label_changed',
    label_change_direction: 'label_change_direction',
    last_checkpoint: 'last_checkpoint',
    pass_chuan_status: 'pass_chuan_status',
    pass_chuan_reasons: 'pass_chuan_reasons',
    pass_mem_status: 'pass_mem_status',
    pass_mem_group: 'pass_mem_group',
    pass_mem_label: 'pass_mem_label',
    flag_attendance_drop: 'flag_attendance_drop',
    flag_homework_drop: 'flag_homework_drop',
    flag_cheating: 'flag_cheating',
    flag_needs_review: 'flag_needs_review',
    teacher_feedback_btvn: 'teacher_feedback_btvn',
    teacher_feedback_orient: 'teacher_feedback_orient',
    teacher_note: 'teacher_note',
    teacher_temp_label: 'teacher_temp_label',
    scraped_at: 'scraped_at'
  };

  export type Student_daily_recordsScalarFieldEnum = (typeof Student_daily_recordsScalarFieldEnum)[keyof typeof Student_daily_recordsScalarFieldEnum]


  export const StudentsScalarFieldEnum: {
    student_id: 'student_id',
    student_code: 'student_code',
    full_name: 'full_name',
    phone: 'phone',
    email: 'email',
    class_id: 'class_id',
    registration_status: 'registration_status',
    admitted_at: 'admitted_at',
    target_output_status: 'target_output_status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type StudentsScalarFieldEnum = (typeof StudentsScalarFieldEnum)[keyof typeof StudentsScalarFieldEnum]


  export const System_configsScalarFieldEnum: {
    id: 'id',
    config_key: 'config_key',
    config_value: 'config_value',
    description: 'description',
    updated_at: 'updated_at',
    updated_by: 'updated_by'
  };

  export type System_configsScalarFieldEnum = (typeof System_configsScalarFieldEnum)[keyof typeof System_configsScalarFieldEnum]


  export const System_logsScalarFieldEnum: {
    id: 'id',
    log_id: 'log_id',
    run_id: 'run_id',
    workflow_name: 'workflow_name',
    action: 'action',
    class_id: 'class_id',
    status: 'status',
    message: 'message',
    records_affected: 'records_affected',
    duration_ms: 'duration_ms',
    created_at: 'created_at'
  };

  export type System_logsScalarFieldEnum = (typeof System_logsScalarFieldEnum)[keyof typeof System_logsScalarFieldEnum]


  export const TeachersScalarFieldEnum: {
    teacher_id: 'teacher_id',
    teacher_name: 'teacher_name',
    teacher_email: 'teacher_email',
    teacher_phone: 'teacher_phone',
    khoi_id: 'khoi_id',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type TeachersScalarFieldEnum = (typeof TeachersScalarFieldEnum)[keyof typeof TeachersScalarFieldEnum]


  export const Test_scoresScalarFieldEnum: {
    id: 'id',
    student_id: 'student_id',
    class_id: 'class_id',
    test_order: 'test_order',
    test_name: 'test_name',
    raw_score: 'raw_score',
    max_score: 'max_score',
    grade_percent: 'grade_percent',
    is_makeup: 'is_makeup',
    makeup_score: 'makeup_score',
    final_score: 'final_score',
    grade_status: 'grade_status',
    is_cheating: 'is_cheating',
    grade_note: 'grade_note',
    label_at_time: 'label_at_time',
    scraped_at: 'scraped_at',
    created_at: 'created_at'
  };

  export type Test_scoresScalarFieldEnum = (typeof Test_scoresScalarFieldEnum)[keyof typeof Test_scoresScalarFieldEnum]


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
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


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


  export type class_daily_snapshotsWhereInput = {
    AND?: class_daily_snapshotsWhereInput | class_daily_snapshotsWhereInput[]
    OR?: class_daily_snapshotsWhereInput[]
    NOT?: class_daily_snapshotsWhereInput | class_daily_snapshotsWhereInput[]
    id?: BigIntFilter<"class_daily_snapshots"> | bigint | number
    class_id?: IntFilter<"class_daily_snapshots"> | number
    snapshot_date?: DateTimeFilter<"class_daily_snapshots"> | Date | string
    completed_sessions?: IntFilter<"class_daily_snapshots"> | number
    progress_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFilter<"class_daily_snapshots"> | number
    on_hold_students?: IntFilter<"class_daily_snapshots"> | number
    dropped_students?: IntFilter<"class_daily_snapshots"> | number
    transferred_students?: IntFilter<"class_daily_snapshots"> | number
    attendance_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    homework_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFilter<"class_daily_snapshots"> | number
    label_red?: IntFilter<"class_daily_snapshots"> | number
    label_grey?: IntFilter<"class_daily_snapshots"> | number
    label_no_data?: IntFilter<"class_daily_snapshots"> | number
    risk_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFilter<"class_daily_snapshots"> | boolean
    health_status?: StringNullableFilter<"class_daily_snapshots"> | string | null
    scraped_at?: DateTimeFilter<"class_daily_snapshots"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
  }

  export type class_daily_snapshotsOrderByWithRelationInput = {
    id?: SortOrder
    class_id?: SortOrder
    snapshot_date?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrderInput | SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrderInput | SortOrder
    homework_avg?: SortOrderInput | SortOrder
    pass_chuan_rate?: SortOrderInput | SortOrder
    pass_mem_rate?: SortOrderInput | SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrderInput | SortOrder
    is_alarm_triggered?: SortOrder
    health_status?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    classes?: classesOrderByWithRelationInput
  }

  export type class_daily_snapshotsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    class_id_snapshot_date?: class_daily_snapshotsClass_idSnapshot_dateCompoundUniqueInput
    AND?: class_daily_snapshotsWhereInput | class_daily_snapshotsWhereInput[]
    OR?: class_daily_snapshotsWhereInput[]
    NOT?: class_daily_snapshotsWhereInput | class_daily_snapshotsWhereInput[]
    class_id?: IntFilter<"class_daily_snapshots"> | number
    snapshot_date?: DateTimeFilter<"class_daily_snapshots"> | Date | string
    completed_sessions?: IntFilter<"class_daily_snapshots"> | number
    progress_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFilter<"class_daily_snapshots"> | number
    on_hold_students?: IntFilter<"class_daily_snapshots"> | number
    dropped_students?: IntFilter<"class_daily_snapshots"> | number
    transferred_students?: IntFilter<"class_daily_snapshots"> | number
    attendance_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    homework_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFilter<"class_daily_snapshots"> | number
    label_red?: IntFilter<"class_daily_snapshots"> | number
    label_grey?: IntFilter<"class_daily_snapshots"> | number
    label_no_data?: IntFilter<"class_daily_snapshots"> | number
    risk_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFilter<"class_daily_snapshots"> | boolean
    health_status?: StringNullableFilter<"class_daily_snapshots"> | string | null
    scraped_at?: DateTimeFilter<"class_daily_snapshots"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
  }, "id" | "class_id_snapshot_date">

  export type class_daily_snapshotsOrderByWithAggregationInput = {
    id?: SortOrder
    class_id?: SortOrder
    snapshot_date?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrderInput | SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrderInput | SortOrder
    homework_avg?: SortOrderInput | SortOrder
    pass_chuan_rate?: SortOrderInput | SortOrder
    pass_mem_rate?: SortOrderInput | SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrderInput | SortOrder
    is_alarm_triggered?: SortOrder
    health_status?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    _count?: class_daily_snapshotsCountOrderByAggregateInput
    _avg?: class_daily_snapshotsAvgOrderByAggregateInput
    _max?: class_daily_snapshotsMaxOrderByAggregateInput
    _min?: class_daily_snapshotsMinOrderByAggregateInput
    _sum?: class_daily_snapshotsSumOrderByAggregateInput
  }

  export type class_daily_snapshotsScalarWhereWithAggregatesInput = {
    AND?: class_daily_snapshotsScalarWhereWithAggregatesInput | class_daily_snapshotsScalarWhereWithAggregatesInput[]
    OR?: class_daily_snapshotsScalarWhereWithAggregatesInput[]
    NOT?: class_daily_snapshotsScalarWhereWithAggregatesInput | class_daily_snapshotsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"class_daily_snapshots"> | bigint | number
    class_id?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    snapshot_date?: DateTimeWithAggregatesFilter<"class_daily_snapshots"> | Date | string
    completed_sessions?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    progress_pct?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    active_students?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    on_hold_students?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    dropped_students?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    transferred_students?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    attendance_avg?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    homework_avg?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    label_red?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    label_grey?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    label_no_data?: IntWithAggregatesFilter<"class_daily_snapshots"> | number
    risk_pct?: DecimalNullableWithAggregatesFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolWithAggregatesFilter<"class_daily_snapshots"> | boolean
    health_status?: StringNullableWithAggregatesFilter<"class_daily_snapshots"> | string | null
    scraped_at?: DateTimeWithAggregatesFilter<"class_daily_snapshots"> | Date | string
  }

  export type classesWhereInput = {
    AND?: classesWhereInput | classesWhereInput[]
    OR?: classesWhereInput[]
    NOT?: classesWhereInput | classesWhereInput[]
    class_id?: IntFilter<"classes"> | number
    class_name?: StringFilter<"classes"> | string
    course_id?: IntFilter<"classes"> | number
    teacher_id?: IntFilter<"classes"> | number
    lead_email?: StringNullableFilter<"classes"> | string | null
    status?: StringFilter<"classes"> | string
    schedule?: StringNullableFilter<"classes"> | string | null
    location?: StringNullableFilter<"classes"> | string | null
    opening_date?: DateTimeFilter<"classes"> | Date | string
    ending_date?: DateTimeNullableFilter<"classes"> | Date | string | null
    total_sessions?: IntFilter<"classes"> | number
    portal_url?: StringNullableFilter<"classes"> | string | null
    created_at?: DateTimeFilter<"classes"> | Date | string
    updated_at?: DateTimeFilter<"classes"> | Date | string
    class_daily_snapshots?: Class_daily_snapshotsListRelationFilter
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
    student_daily_records?: Student_daily_recordsListRelationFilter
    students?: StudentsListRelationFilter
    test_scores?: Test_scoresListRelationFilter
  }

  export type classesOrderByWithRelationInput = {
    class_id?: SortOrder
    class_name?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    lead_email?: SortOrderInput | SortOrder
    status?: SortOrder
    schedule?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    opening_date?: SortOrder
    ending_date?: SortOrderInput | SortOrder
    total_sessions?: SortOrder
    portal_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    class_daily_snapshots?: class_daily_snapshotsOrderByRelationAggregateInput
    teachers?: teachersOrderByWithRelationInput
    label_change_logs?: label_change_logsOrderByRelationAggregateInput
    pass_reviews?: pass_reviewsOrderByRelationAggregateInput
    student_daily_records?: student_daily_recordsOrderByRelationAggregateInput
    students?: studentsOrderByRelationAggregateInput
    test_scores?: test_scoresOrderByRelationAggregateInput
  }

  export type classesWhereUniqueInput = Prisma.AtLeast<{
    class_id?: number
    class_name?: string
    AND?: classesWhereInput | classesWhereInput[]
    OR?: classesWhereInput[]
    NOT?: classesWhereInput | classesWhereInput[]
    course_id?: IntFilter<"classes"> | number
    teacher_id?: IntFilter<"classes"> | number
    lead_email?: StringNullableFilter<"classes"> | string | null
    status?: StringFilter<"classes"> | string
    schedule?: StringNullableFilter<"classes"> | string | null
    location?: StringNullableFilter<"classes"> | string | null
    opening_date?: DateTimeFilter<"classes"> | Date | string
    ending_date?: DateTimeNullableFilter<"classes"> | Date | string | null
    total_sessions?: IntFilter<"classes"> | number
    portal_url?: StringNullableFilter<"classes"> | string | null
    created_at?: DateTimeFilter<"classes"> | Date | string
    updated_at?: DateTimeFilter<"classes"> | Date | string
    class_daily_snapshots?: Class_daily_snapshotsListRelationFilter
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
    student_daily_records?: Student_daily_recordsListRelationFilter
    students?: StudentsListRelationFilter
    test_scores?: Test_scoresListRelationFilter
  }, "class_id" | "class_name">

  export type classesOrderByWithAggregationInput = {
    class_id?: SortOrder
    class_name?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    lead_email?: SortOrderInput | SortOrder
    status?: SortOrder
    schedule?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    opening_date?: SortOrder
    ending_date?: SortOrderInput | SortOrder
    total_sessions?: SortOrder
    portal_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: classesCountOrderByAggregateInput
    _avg?: classesAvgOrderByAggregateInput
    _max?: classesMaxOrderByAggregateInput
    _min?: classesMinOrderByAggregateInput
    _sum?: classesSumOrderByAggregateInput
  }

  export type classesScalarWhereWithAggregatesInput = {
    AND?: classesScalarWhereWithAggregatesInput | classesScalarWhereWithAggregatesInput[]
    OR?: classesScalarWhereWithAggregatesInput[]
    NOT?: classesScalarWhereWithAggregatesInput | classesScalarWhereWithAggregatesInput[]
    class_id?: IntWithAggregatesFilter<"classes"> | number
    class_name?: StringWithAggregatesFilter<"classes"> | string
    course_id?: IntWithAggregatesFilter<"classes"> | number
    teacher_id?: IntWithAggregatesFilter<"classes"> | number
    lead_email?: StringNullableWithAggregatesFilter<"classes"> | string | null
    status?: StringWithAggregatesFilter<"classes"> | string
    schedule?: StringNullableWithAggregatesFilter<"classes"> | string | null
    location?: StringNullableWithAggregatesFilter<"classes"> | string | null
    opening_date?: DateTimeWithAggregatesFilter<"classes"> | Date | string
    ending_date?: DateTimeNullableWithAggregatesFilter<"classes"> | Date | string | null
    total_sessions?: IntWithAggregatesFilter<"classes"> | number
    portal_url?: StringNullableWithAggregatesFilter<"classes"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"classes"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"classes"> | Date | string
  }

  export type label_change_logsWhereInput = {
    AND?: label_change_logsWhereInput | label_change_logsWhereInput[]
    OR?: label_change_logsWhereInput[]
    NOT?: label_change_logsWhereInput | label_change_logsWhereInput[]
    id?: BigIntFilter<"label_change_logs"> | bigint | number
    log_id?: StringFilter<"label_change_logs"> | string
    student_id?: IntFilter<"label_change_logs"> | number
    class_id?: IntFilter<"label_change_logs"> | number
    teacher_id?: IntFilter<"label_change_logs"> | number
    from_label?: StringFilter<"label_change_logs"> | string
    to_label?: StringFilter<"label_change_logs"> | string
    direction?: StringFilter<"label_change_logs"> | string
    severity?: StringNullableFilter<"label_change_logs"> | string | null
    step_count?: IntNullableFilter<"label_change_logs"> | number | null
    reason?: StringNullableFilter<"label_change_logs"> | string | null
    checkpoint?: StringNullableFilter<"label_change_logs"> | string | null
    test_average_after?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    email_sent?: BoolNullableFilter<"label_change_logs"> | boolean | null
    email_sent_at?: DateTimeNullableFilter<"label_change_logs"> | Date | string | null
    created_at?: DateTimeFilter<"label_change_logs"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
  }

  export type label_change_logsOrderByWithRelationInput = {
    id?: SortOrder
    log_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    from_label?: SortOrder
    to_label?: SortOrder
    direction?: SortOrder
    severity?: SortOrderInput | SortOrder
    step_count?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    checkpoint?: SortOrderInput | SortOrder
    test_average_after?: SortOrderInput | SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    email_sent?: SortOrderInput | SortOrder
    email_sent_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    classes?: classesOrderByWithRelationInput
    students?: studentsOrderByWithRelationInput
    teachers?: teachersOrderByWithRelationInput
  }

  export type label_change_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    log_id?: string
    AND?: label_change_logsWhereInput | label_change_logsWhereInput[]
    OR?: label_change_logsWhereInput[]
    NOT?: label_change_logsWhereInput | label_change_logsWhereInput[]
    student_id?: IntFilter<"label_change_logs"> | number
    class_id?: IntFilter<"label_change_logs"> | number
    teacher_id?: IntFilter<"label_change_logs"> | number
    from_label?: StringFilter<"label_change_logs"> | string
    to_label?: StringFilter<"label_change_logs"> | string
    direction?: StringFilter<"label_change_logs"> | string
    severity?: StringNullableFilter<"label_change_logs"> | string | null
    step_count?: IntNullableFilter<"label_change_logs"> | number | null
    reason?: StringNullableFilter<"label_change_logs"> | string | null
    checkpoint?: StringNullableFilter<"label_change_logs"> | string | null
    test_average_after?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    email_sent?: BoolNullableFilter<"label_change_logs"> | boolean | null
    email_sent_at?: DateTimeNullableFilter<"label_change_logs"> | Date | string | null
    created_at?: DateTimeFilter<"label_change_logs"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
  }, "id" | "log_id">

  export type label_change_logsOrderByWithAggregationInput = {
    id?: SortOrder
    log_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    from_label?: SortOrder
    to_label?: SortOrder
    direction?: SortOrder
    severity?: SortOrderInput | SortOrder
    step_count?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    checkpoint?: SortOrderInput | SortOrder
    test_average_after?: SortOrderInput | SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    email_sent?: SortOrderInput | SortOrder
    email_sent_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: label_change_logsCountOrderByAggregateInput
    _avg?: label_change_logsAvgOrderByAggregateInput
    _max?: label_change_logsMaxOrderByAggregateInput
    _min?: label_change_logsMinOrderByAggregateInput
    _sum?: label_change_logsSumOrderByAggregateInput
  }

  export type label_change_logsScalarWhereWithAggregatesInput = {
    AND?: label_change_logsScalarWhereWithAggregatesInput | label_change_logsScalarWhereWithAggregatesInput[]
    OR?: label_change_logsScalarWhereWithAggregatesInput[]
    NOT?: label_change_logsScalarWhereWithAggregatesInput | label_change_logsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"label_change_logs"> | bigint | number
    log_id?: StringWithAggregatesFilter<"label_change_logs"> | string
    student_id?: IntWithAggregatesFilter<"label_change_logs"> | number
    class_id?: IntWithAggregatesFilter<"label_change_logs"> | number
    teacher_id?: IntWithAggregatesFilter<"label_change_logs"> | number
    from_label?: StringWithAggregatesFilter<"label_change_logs"> | string
    to_label?: StringWithAggregatesFilter<"label_change_logs"> | string
    direction?: StringWithAggregatesFilter<"label_change_logs"> | string
    severity?: StringNullableWithAggregatesFilter<"label_change_logs"> | string | null
    step_count?: IntNullableWithAggregatesFilter<"label_change_logs"> | number | null
    reason?: StringNullableWithAggregatesFilter<"label_change_logs"> | string | null
    checkpoint?: StringNullableWithAggregatesFilter<"label_change_logs"> | string | null
    test_average_after?: DecimalNullableWithAggregatesFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: DecimalNullableWithAggregatesFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableWithAggregatesFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    email_sent?: BoolNullableWithAggregatesFilter<"label_change_logs"> | boolean | null
    email_sent_at?: DateTimeNullableWithAggregatesFilter<"label_change_logs"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"label_change_logs"> | Date | string
  }

  export type pass_reviewsWhereInput = {
    AND?: pass_reviewsWhereInput | pass_reviewsWhereInput[]
    OR?: pass_reviewsWhereInput[]
    NOT?: pass_reviewsWhereInput | pass_reviewsWhereInput[]
    id?: BigIntFilter<"pass_reviews"> | bigint | number
    review_id?: StringFilter<"pass_reviews"> | string
    student_id?: IntFilter<"pass_reviews"> | number
    class_id?: IntFilter<"pass_reviews"> | number
    teacher_id?: IntFilter<"pass_reviews"> | number
    pass_mem_group?: StringFilter<"pass_reviews"> | string
    test_average?: DecimalFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string
    attendance_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFilter<"pass_reviews"> | string
    teacher_decision?: StringNullableFilter<"pass_reviews"> | string | null
    teacher_comment?: StringNullableFilter<"pass_reviews"> | string | null
    confirmed_at?: DateTimeNullableFilter<"pass_reviews"> | Date | string | null
    deadline?: DateTimeFilter<"pass_reviews"> | Date | string
    is_overdue?: BoolFilter<"pass_reviews"> | boolean
    escalated_to_lead?: BoolFilter<"pass_reviews"> | boolean
    lead_email_sent?: BoolFilter<"pass_reviews"> | boolean
    created_at?: DateTimeFilter<"pass_reviews"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
  }

  export type pass_reviewsOrderByWithRelationInput = {
    id?: SortOrder
    review_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    pass_mem_group?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    review_status?: SortOrder
    teacher_decision?: SortOrderInput | SortOrder
    teacher_comment?: SortOrderInput | SortOrder
    confirmed_at?: SortOrderInput | SortOrder
    deadline?: SortOrder
    is_overdue?: SortOrder
    escalated_to_lead?: SortOrder
    lead_email_sent?: SortOrder
    created_at?: SortOrder
    classes?: classesOrderByWithRelationInput
    students?: studentsOrderByWithRelationInput
    teachers?: teachersOrderByWithRelationInput
  }

  export type pass_reviewsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    review_id?: string
    AND?: pass_reviewsWhereInput | pass_reviewsWhereInput[]
    OR?: pass_reviewsWhereInput[]
    NOT?: pass_reviewsWhereInput | pass_reviewsWhereInput[]
    student_id?: IntFilter<"pass_reviews"> | number
    class_id?: IntFilter<"pass_reviews"> | number
    teacher_id?: IntFilter<"pass_reviews"> | number
    pass_mem_group?: StringFilter<"pass_reviews"> | string
    test_average?: DecimalFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string
    attendance_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFilter<"pass_reviews"> | string
    teacher_decision?: StringNullableFilter<"pass_reviews"> | string | null
    teacher_comment?: StringNullableFilter<"pass_reviews"> | string | null
    confirmed_at?: DateTimeNullableFilter<"pass_reviews"> | Date | string | null
    deadline?: DateTimeFilter<"pass_reviews"> | Date | string
    is_overdue?: BoolFilter<"pass_reviews"> | boolean
    escalated_to_lead?: BoolFilter<"pass_reviews"> | boolean
    lead_email_sent?: BoolFilter<"pass_reviews"> | boolean
    created_at?: DateTimeFilter<"pass_reviews"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
    teachers?: XOR<TeachersScalarRelationFilter, teachersWhereInput>
  }, "id" | "review_id">

  export type pass_reviewsOrderByWithAggregationInput = {
    id?: SortOrder
    review_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    pass_mem_group?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    review_status?: SortOrder
    teacher_decision?: SortOrderInput | SortOrder
    teacher_comment?: SortOrderInput | SortOrder
    confirmed_at?: SortOrderInput | SortOrder
    deadline?: SortOrder
    is_overdue?: SortOrder
    escalated_to_lead?: SortOrder
    lead_email_sent?: SortOrder
    created_at?: SortOrder
    _count?: pass_reviewsCountOrderByAggregateInput
    _avg?: pass_reviewsAvgOrderByAggregateInput
    _max?: pass_reviewsMaxOrderByAggregateInput
    _min?: pass_reviewsMinOrderByAggregateInput
    _sum?: pass_reviewsSumOrderByAggregateInput
  }

  export type pass_reviewsScalarWhereWithAggregatesInput = {
    AND?: pass_reviewsScalarWhereWithAggregatesInput | pass_reviewsScalarWhereWithAggregatesInput[]
    OR?: pass_reviewsScalarWhereWithAggregatesInput[]
    NOT?: pass_reviewsScalarWhereWithAggregatesInput | pass_reviewsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"pass_reviews"> | bigint | number
    review_id?: StringWithAggregatesFilter<"pass_reviews"> | string
    student_id?: IntWithAggregatesFilter<"pass_reviews"> | number
    class_id?: IntWithAggregatesFilter<"pass_reviews"> | number
    teacher_id?: IntWithAggregatesFilter<"pass_reviews"> | number
    pass_mem_group?: StringWithAggregatesFilter<"pass_reviews"> | string
    test_average?: DecimalWithAggregatesFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string
    attendance_pct?: DecimalNullableWithAggregatesFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableWithAggregatesFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    review_status?: StringWithAggregatesFilter<"pass_reviews"> | string
    teacher_decision?: StringNullableWithAggregatesFilter<"pass_reviews"> | string | null
    teacher_comment?: StringNullableWithAggregatesFilter<"pass_reviews"> | string | null
    confirmed_at?: DateTimeNullableWithAggregatesFilter<"pass_reviews"> | Date | string | null
    deadline?: DateTimeWithAggregatesFilter<"pass_reviews"> | Date | string
    is_overdue?: BoolWithAggregatesFilter<"pass_reviews"> | boolean
    escalated_to_lead?: BoolWithAggregatesFilter<"pass_reviews"> | boolean
    lead_email_sent?: BoolWithAggregatesFilter<"pass_reviews"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"pass_reviews"> | Date | string
  }

  export type student_daily_recordsWhereInput = {
    AND?: student_daily_recordsWhereInput | student_daily_recordsWhereInput[]
    OR?: student_daily_recordsWhereInput[]
    NOT?: student_daily_recordsWhereInput | student_daily_recordsWhereInput[]
    id?: BigIntFilter<"student_daily_records"> | bigint | number
    student_id?: IntFilter<"student_daily_records"> | number
    class_id?: IntFilter<"student_daily_records"> | number
    record_date?: DateTimeFilter<"student_daily_records"> | Date | string
    attendance_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    attendance_present?: IntNullableFilter<"student_daily_records"> | number | null
    attendance_total?: IntNullableFilter<"student_daily_records"> | number | null
    homework_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    homework_done?: IntNullableFilter<"student_daily_records"> | number | null
    homework_total?: IntNullableFilter<"student_daily_records"> | number | null
    test_1?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_2?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_3?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_4?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_5?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_6?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    tests_taken?: IntNullableFilter<"student_daily_records"> | number | null
    test_average?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    current_label?: StringNullableFilter<"student_daily_records"> | string | null
    previous_label?: StringNullableFilter<"student_daily_records"> | string | null
    benchmark_label?: StringNullableFilter<"student_daily_records"> | string | null
    has_label_changed?: BoolNullableFilter<"student_daily_records"> | boolean | null
    label_change_direction?: StringNullableFilter<"student_daily_records"> | string | null
    last_checkpoint?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_reasons?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_group?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_label?: StringNullableFilter<"student_daily_records"> | string | null
    flag_attendance_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_homework_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_cheating?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_needs_review?: BoolNullableFilter<"student_daily_records"> | boolean | null
    teacher_feedback_btvn?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_feedback_orient?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_note?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_temp_label?: StringNullableFilter<"student_daily_records"> | string | null
    scraped_at?: DateTimeFilter<"student_daily_records"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
  }

  export type student_daily_recordsOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    record_date?: SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    attendance_present?: SortOrderInput | SortOrder
    attendance_total?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    homework_done?: SortOrderInput | SortOrder
    homework_total?: SortOrderInput | SortOrder
    test_1?: SortOrderInput | SortOrder
    test_2?: SortOrderInput | SortOrder
    test_3?: SortOrderInput | SortOrder
    test_4?: SortOrderInput | SortOrder
    test_5?: SortOrderInput | SortOrder
    test_6?: SortOrderInput | SortOrder
    tests_taken?: SortOrderInput | SortOrder
    test_average?: SortOrderInput | SortOrder
    current_label?: SortOrderInput | SortOrder
    previous_label?: SortOrderInput | SortOrder
    benchmark_label?: SortOrderInput | SortOrder
    has_label_changed?: SortOrderInput | SortOrder
    label_change_direction?: SortOrderInput | SortOrder
    last_checkpoint?: SortOrderInput | SortOrder
    pass_chuan_status?: SortOrderInput | SortOrder
    pass_chuan_reasons?: SortOrderInput | SortOrder
    pass_mem_status?: SortOrderInput | SortOrder
    pass_mem_group?: SortOrderInput | SortOrder
    pass_mem_label?: SortOrderInput | SortOrder
    flag_attendance_drop?: SortOrderInput | SortOrder
    flag_homework_drop?: SortOrderInput | SortOrder
    flag_cheating?: SortOrderInput | SortOrder
    flag_needs_review?: SortOrderInput | SortOrder
    teacher_feedback_btvn?: SortOrderInput | SortOrder
    teacher_feedback_orient?: SortOrderInput | SortOrder
    teacher_note?: SortOrderInput | SortOrder
    teacher_temp_label?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    classes?: classesOrderByWithRelationInput
    students?: studentsOrderByWithRelationInput
  }

  export type student_daily_recordsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    student_id_record_date?: student_daily_recordsStudent_idRecord_dateCompoundUniqueInput
    AND?: student_daily_recordsWhereInput | student_daily_recordsWhereInput[]
    OR?: student_daily_recordsWhereInput[]
    NOT?: student_daily_recordsWhereInput | student_daily_recordsWhereInput[]
    student_id?: IntFilter<"student_daily_records"> | number
    class_id?: IntFilter<"student_daily_records"> | number
    record_date?: DateTimeFilter<"student_daily_records"> | Date | string
    attendance_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    attendance_present?: IntNullableFilter<"student_daily_records"> | number | null
    attendance_total?: IntNullableFilter<"student_daily_records"> | number | null
    homework_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    homework_done?: IntNullableFilter<"student_daily_records"> | number | null
    homework_total?: IntNullableFilter<"student_daily_records"> | number | null
    test_1?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_2?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_3?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_4?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_5?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_6?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    tests_taken?: IntNullableFilter<"student_daily_records"> | number | null
    test_average?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    current_label?: StringNullableFilter<"student_daily_records"> | string | null
    previous_label?: StringNullableFilter<"student_daily_records"> | string | null
    benchmark_label?: StringNullableFilter<"student_daily_records"> | string | null
    has_label_changed?: BoolNullableFilter<"student_daily_records"> | boolean | null
    label_change_direction?: StringNullableFilter<"student_daily_records"> | string | null
    last_checkpoint?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_reasons?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_group?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_label?: StringNullableFilter<"student_daily_records"> | string | null
    flag_attendance_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_homework_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_cheating?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_needs_review?: BoolNullableFilter<"student_daily_records"> | boolean | null
    teacher_feedback_btvn?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_feedback_orient?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_note?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_temp_label?: StringNullableFilter<"student_daily_records"> | string | null
    scraped_at?: DateTimeFilter<"student_daily_records"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
  }, "id" | "student_id_record_date">

  export type student_daily_recordsOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    record_date?: SortOrder
    attendance_pct?: SortOrderInput | SortOrder
    attendance_present?: SortOrderInput | SortOrder
    attendance_total?: SortOrderInput | SortOrder
    homework_pct?: SortOrderInput | SortOrder
    homework_done?: SortOrderInput | SortOrder
    homework_total?: SortOrderInput | SortOrder
    test_1?: SortOrderInput | SortOrder
    test_2?: SortOrderInput | SortOrder
    test_3?: SortOrderInput | SortOrder
    test_4?: SortOrderInput | SortOrder
    test_5?: SortOrderInput | SortOrder
    test_6?: SortOrderInput | SortOrder
    tests_taken?: SortOrderInput | SortOrder
    test_average?: SortOrderInput | SortOrder
    current_label?: SortOrderInput | SortOrder
    previous_label?: SortOrderInput | SortOrder
    benchmark_label?: SortOrderInput | SortOrder
    has_label_changed?: SortOrderInput | SortOrder
    label_change_direction?: SortOrderInput | SortOrder
    last_checkpoint?: SortOrderInput | SortOrder
    pass_chuan_status?: SortOrderInput | SortOrder
    pass_chuan_reasons?: SortOrderInput | SortOrder
    pass_mem_status?: SortOrderInput | SortOrder
    pass_mem_group?: SortOrderInput | SortOrder
    pass_mem_label?: SortOrderInput | SortOrder
    flag_attendance_drop?: SortOrderInput | SortOrder
    flag_homework_drop?: SortOrderInput | SortOrder
    flag_cheating?: SortOrderInput | SortOrder
    flag_needs_review?: SortOrderInput | SortOrder
    teacher_feedback_btvn?: SortOrderInput | SortOrder
    teacher_feedback_orient?: SortOrderInput | SortOrder
    teacher_note?: SortOrderInput | SortOrder
    teacher_temp_label?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    _count?: student_daily_recordsCountOrderByAggregateInput
    _avg?: student_daily_recordsAvgOrderByAggregateInput
    _max?: student_daily_recordsMaxOrderByAggregateInput
    _min?: student_daily_recordsMinOrderByAggregateInput
    _sum?: student_daily_recordsSumOrderByAggregateInput
  }

  export type student_daily_recordsScalarWhereWithAggregatesInput = {
    AND?: student_daily_recordsScalarWhereWithAggregatesInput | student_daily_recordsScalarWhereWithAggregatesInput[]
    OR?: student_daily_recordsScalarWhereWithAggregatesInput[]
    NOT?: student_daily_recordsScalarWhereWithAggregatesInput | student_daily_recordsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"student_daily_records"> | bigint | number
    student_id?: IntWithAggregatesFilter<"student_daily_records"> | number
    class_id?: IntWithAggregatesFilter<"student_daily_records"> | number
    record_date?: DateTimeWithAggregatesFilter<"student_daily_records"> | Date | string
    attendance_pct?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    attendance_present?: IntNullableWithAggregatesFilter<"student_daily_records"> | number | null
    attendance_total?: IntNullableWithAggregatesFilter<"student_daily_records"> | number | null
    homework_pct?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    homework_done?: IntNullableWithAggregatesFilter<"student_daily_records"> | number | null
    homework_total?: IntNullableWithAggregatesFilter<"student_daily_records"> | number | null
    test_1?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_2?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_3?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_4?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_5?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_6?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    tests_taken?: IntNullableWithAggregatesFilter<"student_daily_records"> | number | null
    test_average?: DecimalNullableWithAggregatesFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    current_label?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    previous_label?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    benchmark_label?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    has_label_changed?: BoolNullableWithAggregatesFilter<"student_daily_records"> | boolean | null
    label_change_direction?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    last_checkpoint?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    pass_chuan_status?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    pass_chuan_reasons?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    pass_mem_status?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    pass_mem_group?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    pass_mem_label?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    flag_attendance_drop?: BoolNullableWithAggregatesFilter<"student_daily_records"> | boolean | null
    flag_homework_drop?: BoolNullableWithAggregatesFilter<"student_daily_records"> | boolean | null
    flag_cheating?: BoolNullableWithAggregatesFilter<"student_daily_records"> | boolean | null
    flag_needs_review?: BoolNullableWithAggregatesFilter<"student_daily_records"> | boolean | null
    teacher_feedback_btvn?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    teacher_feedback_orient?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    teacher_note?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    teacher_temp_label?: StringNullableWithAggregatesFilter<"student_daily_records"> | string | null
    scraped_at?: DateTimeWithAggregatesFilter<"student_daily_records"> | Date | string
  }

  export type studentsWhereInput = {
    AND?: studentsWhereInput | studentsWhereInput[]
    OR?: studentsWhereInput[]
    NOT?: studentsWhereInput | studentsWhereInput[]
    student_id?: IntFilter<"students"> | number
    student_code?: StringNullableFilter<"students"> | string | null
    full_name?: StringFilter<"students"> | string
    phone?: StringNullableFilter<"students"> | string | null
    email?: StringNullableFilter<"students"> | string | null
    class_id?: IntFilter<"students"> | number
    registration_status?: StringFilter<"students"> | string
    admitted_at?: DateTimeNullableFilter<"students"> | Date | string | null
    target_output_status?: StringNullableFilter<"students"> | string | null
    created_at?: DateTimeFilter<"students"> | Date | string
    updated_at?: DateTimeFilter<"students"> | Date | string
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
    student_daily_records?: Student_daily_recordsListRelationFilter
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    test_scores?: Test_scoresListRelationFilter
  }

  export type studentsOrderByWithRelationInput = {
    student_id?: SortOrder
    student_code?: SortOrderInput | SortOrder
    full_name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    class_id?: SortOrder
    registration_status?: SortOrder
    admitted_at?: SortOrderInput | SortOrder
    target_output_status?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    label_change_logs?: label_change_logsOrderByRelationAggregateInput
    pass_reviews?: pass_reviewsOrderByRelationAggregateInput
    student_daily_records?: student_daily_recordsOrderByRelationAggregateInput
    classes?: classesOrderByWithRelationInput
    test_scores?: test_scoresOrderByRelationAggregateInput
  }

  export type studentsWhereUniqueInput = Prisma.AtLeast<{
    student_id?: number
    AND?: studentsWhereInput | studentsWhereInput[]
    OR?: studentsWhereInput[]
    NOT?: studentsWhereInput | studentsWhereInput[]
    student_code?: StringNullableFilter<"students"> | string | null
    full_name?: StringFilter<"students"> | string
    phone?: StringNullableFilter<"students"> | string | null
    email?: StringNullableFilter<"students"> | string | null
    class_id?: IntFilter<"students"> | number
    registration_status?: StringFilter<"students"> | string
    admitted_at?: DateTimeNullableFilter<"students"> | Date | string | null
    target_output_status?: StringNullableFilter<"students"> | string | null
    created_at?: DateTimeFilter<"students"> | Date | string
    updated_at?: DateTimeFilter<"students"> | Date | string
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
    student_daily_records?: Student_daily_recordsListRelationFilter
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    test_scores?: Test_scoresListRelationFilter
  }, "student_id">

  export type studentsOrderByWithAggregationInput = {
    student_id?: SortOrder
    student_code?: SortOrderInput | SortOrder
    full_name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    class_id?: SortOrder
    registration_status?: SortOrder
    admitted_at?: SortOrderInput | SortOrder
    target_output_status?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: studentsCountOrderByAggregateInput
    _avg?: studentsAvgOrderByAggregateInput
    _max?: studentsMaxOrderByAggregateInput
    _min?: studentsMinOrderByAggregateInput
    _sum?: studentsSumOrderByAggregateInput
  }

  export type studentsScalarWhereWithAggregatesInput = {
    AND?: studentsScalarWhereWithAggregatesInput | studentsScalarWhereWithAggregatesInput[]
    OR?: studentsScalarWhereWithAggregatesInput[]
    NOT?: studentsScalarWhereWithAggregatesInput | studentsScalarWhereWithAggregatesInput[]
    student_id?: IntWithAggregatesFilter<"students"> | number
    student_code?: StringNullableWithAggregatesFilter<"students"> | string | null
    full_name?: StringWithAggregatesFilter<"students"> | string
    phone?: StringNullableWithAggregatesFilter<"students"> | string | null
    email?: StringNullableWithAggregatesFilter<"students"> | string | null
    class_id?: IntWithAggregatesFilter<"students"> | number
    registration_status?: StringWithAggregatesFilter<"students"> | string
    admitted_at?: DateTimeNullableWithAggregatesFilter<"students"> | Date | string | null
    target_output_status?: StringNullableWithAggregatesFilter<"students"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"students"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"students"> | Date | string
  }

  export type system_configsWhereInput = {
    AND?: system_configsWhereInput | system_configsWhereInput[]
    OR?: system_configsWhereInput[]
    NOT?: system_configsWhereInput | system_configsWhereInput[]
    id?: IntFilter<"system_configs"> | number
    config_key?: StringFilter<"system_configs"> | string
    config_value?: StringFilter<"system_configs"> | string
    description?: StringNullableFilter<"system_configs"> | string | null
    updated_at?: DateTimeFilter<"system_configs"> | Date | string
    updated_by?: StringNullableFilter<"system_configs"> | string | null
  }

  export type system_configsOrderByWithRelationInput = {
    id?: SortOrder
    config_key?: SortOrder
    config_value?: SortOrder
    description?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    updated_by?: SortOrderInput | SortOrder
  }

  export type system_configsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    config_key?: string
    AND?: system_configsWhereInput | system_configsWhereInput[]
    OR?: system_configsWhereInput[]
    NOT?: system_configsWhereInput | system_configsWhereInput[]
    config_value?: StringFilter<"system_configs"> | string
    description?: StringNullableFilter<"system_configs"> | string | null
    updated_at?: DateTimeFilter<"system_configs"> | Date | string
    updated_by?: StringNullableFilter<"system_configs"> | string | null
  }, "id" | "config_key">

  export type system_configsOrderByWithAggregationInput = {
    id?: SortOrder
    config_key?: SortOrder
    config_value?: SortOrder
    description?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    _count?: system_configsCountOrderByAggregateInput
    _avg?: system_configsAvgOrderByAggregateInput
    _max?: system_configsMaxOrderByAggregateInput
    _min?: system_configsMinOrderByAggregateInput
    _sum?: system_configsSumOrderByAggregateInput
  }

  export type system_configsScalarWhereWithAggregatesInput = {
    AND?: system_configsScalarWhereWithAggregatesInput | system_configsScalarWhereWithAggregatesInput[]
    OR?: system_configsScalarWhereWithAggregatesInput[]
    NOT?: system_configsScalarWhereWithAggregatesInput | system_configsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"system_configs"> | number
    config_key?: StringWithAggregatesFilter<"system_configs"> | string
    config_value?: StringWithAggregatesFilter<"system_configs"> | string
    description?: StringNullableWithAggregatesFilter<"system_configs"> | string | null
    updated_at?: DateTimeWithAggregatesFilter<"system_configs"> | Date | string
    updated_by?: StringNullableWithAggregatesFilter<"system_configs"> | string | null
  }

  export type system_logsWhereInput = {
    AND?: system_logsWhereInput | system_logsWhereInput[]
    OR?: system_logsWhereInput[]
    NOT?: system_logsWhereInput | system_logsWhereInput[]
    id?: BigIntFilter<"system_logs"> | bigint | number
    log_id?: StringNullableFilter<"system_logs"> | string | null
    run_id?: StringNullableFilter<"system_logs"> | string | null
    workflow_name?: StringNullableFilter<"system_logs"> | string | null
    action?: StringNullableFilter<"system_logs"> | string | null
    class_id?: IntNullableFilter<"system_logs"> | number | null
    status?: StringFilter<"system_logs"> | string
    message?: StringNullableFilter<"system_logs"> | string | null
    records_affected?: IntNullableFilter<"system_logs"> | number | null
    duration_ms?: IntNullableFilter<"system_logs"> | number | null
    created_at?: DateTimeFilter<"system_logs"> | Date | string
  }

  export type system_logsOrderByWithRelationInput = {
    id?: SortOrder
    log_id?: SortOrderInput | SortOrder
    run_id?: SortOrderInput | SortOrder
    workflow_name?: SortOrderInput | SortOrder
    action?: SortOrderInput | SortOrder
    class_id?: SortOrderInput | SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    records_affected?: SortOrderInput | SortOrder
    duration_ms?: SortOrderInput | SortOrder
    created_at?: SortOrder
  }

  export type system_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: system_logsWhereInput | system_logsWhereInput[]
    OR?: system_logsWhereInput[]
    NOT?: system_logsWhereInput | system_logsWhereInput[]
    log_id?: StringNullableFilter<"system_logs"> | string | null
    run_id?: StringNullableFilter<"system_logs"> | string | null
    workflow_name?: StringNullableFilter<"system_logs"> | string | null
    action?: StringNullableFilter<"system_logs"> | string | null
    class_id?: IntNullableFilter<"system_logs"> | number | null
    status?: StringFilter<"system_logs"> | string
    message?: StringNullableFilter<"system_logs"> | string | null
    records_affected?: IntNullableFilter<"system_logs"> | number | null
    duration_ms?: IntNullableFilter<"system_logs"> | number | null
    created_at?: DateTimeFilter<"system_logs"> | Date | string
  }, "id">

  export type system_logsOrderByWithAggregationInput = {
    id?: SortOrder
    log_id?: SortOrderInput | SortOrder
    run_id?: SortOrderInput | SortOrder
    workflow_name?: SortOrderInput | SortOrder
    action?: SortOrderInput | SortOrder
    class_id?: SortOrderInput | SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    records_affected?: SortOrderInput | SortOrder
    duration_ms?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: system_logsCountOrderByAggregateInput
    _avg?: system_logsAvgOrderByAggregateInput
    _max?: system_logsMaxOrderByAggregateInput
    _min?: system_logsMinOrderByAggregateInput
    _sum?: system_logsSumOrderByAggregateInput
  }

  export type system_logsScalarWhereWithAggregatesInput = {
    AND?: system_logsScalarWhereWithAggregatesInput | system_logsScalarWhereWithAggregatesInput[]
    OR?: system_logsScalarWhereWithAggregatesInput[]
    NOT?: system_logsScalarWhereWithAggregatesInput | system_logsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"system_logs"> | bigint | number
    log_id?: StringNullableWithAggregatesFilter<"system_logs"> | string | null
    run_id?: StringNullableWithAggregatesFilter<"system_logs"> | string | null
    workflow_name?: StringNullableWithAggregatesFilter<"system_logs"> | string | null
    action?: StringNullableWithAggregatesFilter<"system_logs"> | string | null
    class_id?: IntNullableWithAggregatesFilter<"system_logs"> | number | null
    status?: StringWithAggregatesFilter<"system_logs"> | string
    message?: StringNullableWithAggregatesFilter<"system_logs"> | string | null
    records_affected?: IntNullableWithAggregatesFilter<"system_logs"> | number | null
    duration_ms?: IntNullableWithAggregatesFilter<"system_logs"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"system_logs"> | Date | string
  }

  export type teachersWhereInput = {
    AND?: teachersWhereInput | teachersWhereInput[]
    OR?: teachersWhereInput[]
    NOT?: teachersWhereInput | teachersWhereInput[]
    teacher_id?: IntFilter<"teachers"> | number
    teacher_name?: StringFilter<"teachers"> | string
    teacher_email?: StringFilter<"teachers"> | string
    teacher_phone?: StringNullableFilter<"teachers"> | string | null
    khoi_id?: IntFilter<"teachers"> | number
    role?: StringFilter<"teachers"> | string
    created_at?: DateTimeFilter<"teachers"> | Date | string
    updated_at?: DateTimeFilter<"teachers"> | Date | string
    classes?: ClassesListRelationFilter
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
  }

  export type teachersOrderByWithRelationInput = {
    teacher_id?: SortOrder
    teacher_name?: SortOrder
    teacher_email?: SortOrder
    teacher_phone?: SortOrderInput | SortOrder
    khoi_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    classes?: classesOrderByRelationAggregateInput
    label_change_logs?: label_change_logsOrderByRelationAggregateInput
    pass_reviews?: pass_reviewsOrderByRelationAggregateInput
  }

  export type teachersWhereUniqueInput = Prisma.AtLeast<{
    teacher_id?: number
    teacher_email?: string
    AND?: teachersWhereInput | teachersWhereInput[]
    OR?: teachersWhereInput[]
    NOT?: teachersWhereInput | teachersWhereInput[]
    teacher_name?: StringFilter<"teachers"> | string
    teacher_phone?: StringNullableFilter<"teachers"> | string | null
    khoi_id?: IntFilter<"teachers"> | number
    role?: StringFilter<"teachers"> | string
    created_at?: DateTimeFilter<"teachers"> | Date | string
    updated_at?: DateTimeFilter<"teachers"> | Date | string
    classes?: ClassesListRelationFilter
    label_change_logs?: Label_change_logsListRelationFilter
    pass_reviews?: Pass_reviewsListRelationFilter
  }, "teacher_id" | "teacher_email">

  export type teachersOrderByWithAggregationInput = {
    teacher_id?: SortOrder
    teacher_name?: SortOrder
    teacher_email?: SortOrder
    teacher_phone?: SortOrderInput | SortOrder
    khoi_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: teachersCountOrderByAggregateInput
    _avg?: teachersAvgOrderByAggregateInput
    _max?: teachersMaxOrderByAggregateInput
    _min?: teachersMinOrderByAggregateInput
    _sum?: teachersSumOrderByAggregateInput
  }

  export type teachersScalarWhereWithAggregatesInput = {
    AND?: teachersScalarWhereWithAggregatesInput | teachersScalarWhereWithAggregatesInput[]
    OR?: teachersScalarWhereWithAggregatesInput[]
    NOT?: teachersScalarWhereWithAggregatesInput | teachersScalarWhereWithAggregatesInput[]
    teacher_id?: IntWithAggregatesFilter<"teachers"> | number
    teacher_name?: StringWithAggregatesFilter<"teachers"> | string
    teacher_email?: StringWithAggregatesFilter<"teachers"> | string
    teacher_phone?: StringNullableWithAggregatesFilter<"teachers"> | string | null
    khoi_id?: IntWithAggregatesFilter<"teachers"> | number
    role?: StringWithAggregatesFilter<"teachers"> | string
    created_at?: DateTimeWithAggregatesFilter<"teachers"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"teachers"> | Date | string
  }

  export type test_scoresWhereInput = {
    AND?: test_scoresWhereInput | test_scoresWhereInput[]
    OR?: test_scoresWhereInput[]
    NOT?: test_scoresWhereInput | test_scoresWhereInput[]
    id?: BigIntFilter<"test_scores"> | bigint | number
    student_id?: IntFilter<"test_scores"> | number
    class_id?: IntFilter<"test_scores"> | number
    test_order?: IntFilter<"test_scores"> | number
    test_name?: StringFilter<"test_scores"> | string
    raw_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    max_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_percent?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFilter<"test_scores"> | boolean
    makeup_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    final_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_status?: StringNullableFilter<"test_scores"> | string | null
    is_cheating?: BoolFilter<"test_scores"> | boolean
    grade_note?: StringNullableFilter<"test_scores"> | string | null
    label_at_time?: StringNullableFilter<"test_scores"> | string | null
    scraped_at?: DateTimeFilter<"test_scores"> | Date | string
    created_at?: DateTimeFilter<"test_scores"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
  }

  export type test_scoresOrderByWithRelationInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    test_name?: SortOrder
    raw_score?: SortOrderInput | SortOrder
    max_score?: SortOrderInput | SortOrder
    grade_percent?: SortOrderInput | SortOrder
    is_makeup?: SortOrder
    makeup_score?: SortOrderInput | SortOrder
    final_score?: SortOrderInput | SortOrder
    grade_status?: SortOrderInput | SortOrder
    is_cheating?: SortOrder
    grade_note?: SortOrderInput | SortOrder
    label_at_time?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    created_at?: SortOrder
    classes?: classesOrderByWithRelationInput
    students?: studentsOrderByWithRelationInput
  }

  export type test_scoresWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    student_id_class_id_test_order_is_makeup?: test_scoresStudent_idClass_idTest_orderIs_makeupCompoundUniqueInput
    AND?: test_scoresWhereInput | test_scoresWhereInput[]
    OR?: test_scoresWhereInput[]
    NOT?: test_scoresWhereInput | test_scoresWhereInput[]
    student_id?: IntFilter<"test_scores"> | number
    class_id?: IntFilter<"test_scores"> | number
    test_order?: IntFilter<"test_scores"> | number
    test_name?: StringFilter<"test_scores"> | string
    raw_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    max_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_percent?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFilter<"test_scores"> | boolean
    makeup_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    final_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_status?: StringNullableFilter<"test_scores"> | string | null
    is_cheating?: BoolFilter<"test_scores"> | boolean
    grade_note?: StringNullableFilter<"test_scores"> | string | null
    label_at_time?: StringNullableFilter<"test_scores"> | string | null
    scraped_at?: DateTimeFilter<"test_scores"> | Date | string
    created_at?: DateTimeFilter<"test_scores"> | Date | string
    classes?: XOR<ClassesScalarRelationFilter, classesWhereInput>
    students?: XOR<StudentsScalarRelationFilter, studentsWhereInput>
  }, "id" | "student_id_class_id_test_order_is_makeup">

  export type test_scoresOrderByWithAggregationInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    test_name?: SortOrder
    raw_score?: SortOrderInput | SortOrder
    max_score?: SortOrderInput | SortOrder
    grade_percent?: SortOrderInput | SortOrder
    is_makeup?: SortOrder
    makeup_score?: SortOrderInput | SortOrder
    final_score?: SortOrderInput | SortOrder
    grade_status?: SortOrderInput | SortOrder
    is_cheating?: SortOrder
    grade_note?: SortOrderInput | SortOrder
    label_at_time?: SortOrderInput | SortOrder
    scraped_at?: SortOrder
    created_at?: SortOrder
    _count?: test_scoresCountOrderByAggregateInput
    _avg?: test_scoresAvgOrderByAggregateInput
    _max?: test_scoresMaxOrderByAggregateInput
    _min?: test_scoresMinOrderByAggregateInput
    _sum?: test_scoresSumOrderByAggregateInput
  }

  export type test_scoresScalarWhereWithAggregatesInput = {
    AND?: test_scoresScalarWhereWithAggregatesInput | test_scoresScalarWhereWithAggregatesInput[]
    OR?: test_scoresScalarWhereWithAggregatesInput[]
    NOT?: test_scoresScalarWhereWithAggregatesInput | test_scoresScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"test_scores"> | bigint | number
    student_id?: IntWithAggregatesFilter<"test_scores"> | number
    class_id?: IntWithAggregatesFilter<"test_scores"> | number
    test_order?: IntWithAggregatesFilter<"test_scores"> | number
    test_name?: StringWithAggregatesFilter<"test_scores"> | string
    raw_score?: DecimalNullableWithAggregatesFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    max_score?: DecimalNullableWithAggregatesFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_percent?: DecimalNullableWithAggregatesFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolWithAggregatesFilter<"test_scores"> | boolean
    makeup_score?: DecimalNullableWithAggregatesFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    final_score?: DecimalNullableWithAggregatesFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_status?: StringNullableWithAggregatesFilter<"test_scores"> | string | null
    is_cheating?: BoolWithAggregatesFilter<"test_scores"> | boolean
    grade_note?: StringNullableWithAggregatesFilter<"test_scores"> | string | null
    label_at_time?: StringNullableWithAggregatesFilter<"test_scores"> | string | null
    scraped_at?: DateTimeWithAggregatesFilter<"test_scores"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"test_scores"> | Date | string
  }

  export type class_daily_snapshotsCreateInput = {
    id?: bigint | number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
    classes: classesCreateNestedOneWithoutClass_daily_snapshotsInput
  }

  export type class_daily_snapshotsUncheckedCreateInput = {
    id?: bigint | number
    class_id: number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
  }

  export type class_daily_snapshotsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutClass_daily_snapshotsNestedInput
  }

  export type class_daily_snapshotsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type class_daily_snapshotsCreateManyInput = {
    id?: bigint | number
    class_id: number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
  }

  export type class_daily_snapshotsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type class_daily_snapshotsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type classesCreateInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesUpdateInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type classesCreateManyInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type classesUpdateManyMutationInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type classesUncheckedUpdateManyInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsCreateInput = {
    id?: bigint | number
    log_id?: string
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutLabel_change_logsInput
    students: studentsCreateNestedOneWithoutLabel_change_logsInput
    teachers: teachersCreateNestedOneWithoutLabel_change_logsInput
  }

  export type label_change_logsUncheckedCreateInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    class_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type label_change_logsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutLabel_change_logsNestedInput
    students?: studentsUpdateOneRequiredWithoutLabel_change_logsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutLabel_change_logsNestedInput
  }

  export type label_change_logsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsCreateManyInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    class_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type label_change_logsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsCreateInput = {
    id?: bigint | number
    review_id?: string
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutPass_reviewsInput
    students: studentsCreateNestedOneWithoutPass_reviewsInput
    teachers: teachersCreateNestedOneWithoutPass_reviewsInput
  }

  export type pass_reviewsUncheckedCreateInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    class_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type pass_reviewsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutPass_reviewsNestedInput
    students?: studentsUpdateOneRequiredWithoutPass_reviewsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutPass_reviewsNestedInput
  }

  export type pass_reviewsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsCreateManyInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    class_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type pass_reviewsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsCreateInput = {
    id?: bigint | number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
    classes: classesCreateNestedOneWithoutStudent_daily_recordsInput
    students: studentsCreateNestedOneWithoutStudent_daily_recordsInput
  }

  export type student_daily_recordsUncheckedCreateInput = {
    id?: bigint | number
    student_id: number
    class_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type student_daily_recordsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutStudent_daily_recordsNestedInput
    students?: studentsUpdateOneRequiredWithoutStudent_daily_recordsNestedInput
  }

  export type student_daily_recordsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsCreateManyInput = {
    id?: bigint | number
    student_id: number
    class_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type student_daily_recordsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type studentsCreateInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutStudentsInput
    classes: classesCreateNestedOneWithoutStudentsInput
    test_scores?: test_scoresCreateNestedManyWithoutStudentsInput
  }

  export type studentsUncheckedCreateInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsUpdateInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutStudentsNestedInput
    classes?: classesUpdateOneRequiredWithoutStudentsNestedInput
    test_scores?: test_scoresUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type studentsCreateManyInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type studentsUpdateManyMutationInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type studentsUncheckedUpdateManyInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type system_configsCreateInput = {
    config_key: string
    config_value: string
    description?: string | null
    updated_at?: Date | string
    updated_by?: string | null
  }

  export type system_configsUncheckedCreateInput = {
    id?: number
    config_key: string
    config_value: string
    description?: string | null
    updated_at?: Date | string
    updated_by?: string | null
  }

  export type system_configsUpdateInput = {
    config_key?: StringFieldUpdateOperationsInput | string
    config_value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type system_configsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    config_key?: StringFieldUpdateOperationsInput | string
    config_value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type system_configsCreateManyInput = {
    id?: number
    config_key: string
    config_value: string
    description?: string | null
    updated_at?: Date | string
    updated_by?: string | null
  }

  export type system_configsUpdateManyMutationInput = {
    config_key?: StringFieldUpdateOperationsInput | string
    config_value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type system_configsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    config_key?: StringFieldUpdateOperationsInput | string
    config_value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type system_logsCreateInput = {
    id?: bigint | number
    log_id?: string | null
    run_id?: string | null
    workflow_name?: string | null
    action?: string | null
    class_id?: number | null
    status?: string
    message?: string | null
    records_affected?: number | null
    duration_ms?: number | null
    created_at?: Date | string
  }

  export type system_logsUncheckedCreateInput = {
    id?: bigint | number
    log_id?: string | null
    run_id?: string | null
    workflow_name?: string | null
    action?: string | null
    class_id?: number | null
    status?: string
    message?: string | null
    records_affected?: number | null
    duration_ms?: number | null
    created_at?: Date | string
  }

  export type system_logsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    run_id?: NullableStringFieldUpdateOperationsInput | string | null
    workflow_name?: NullableStringFieldUpdateOperationsInput | string | null
    action?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    records_affected?: NullableIntFieldUpdateOperationsInput | number | null
    duration_ms?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type system_logsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    run_id?: NullableStringFieldUpdateOperationsInput | string | null
    workflow_name?: NullableStringFieldUpdateOperationsInput | string | null
    action?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    records_affected?: NullableIntFieldUpdateOperationsInput | number | null
    duration_ms?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type system_logsCreateManyInput = {
    id?: bigint | number
    log_id?: string | null
    run_id?: string | null
    workflow_name?: string | null
    action?: string | null
    class_id?: number | null
    status?: string
    message?: string | null
    records_affected?: number | null
    duration_ms?: number | null
    created_at?: Date | string
  }

  export type system_logsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    run_id?: NullableStringFieldUpdateOperationsInput | string | null
    workflow_name?: NullableStringFieldUpdateOperationsInput | string | null
    action?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    records_affected?: NullableIntFieldUpdateOperationsInput | number | null
    duration_ms?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type system_logsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: NullableStringFieldUpdateOperationsInput | string | null
    run_id?: NullableStringFieldUpdateOperationsInput | string | null
    workflow_name?: NullableStringFieldUpdateOperationsInput | string | null
    action?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    records_affected?: NullableIntFieldUpdateOperationsInput | number | null
    duration_ms?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type teachersCreateInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesCreateNestedManyWithoutTeachersInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutTeachersInput
  }

  export type teachersUncheckedCreateInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesUncheckedCreateNestedManyWithoutTeachersInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutTeachersInput
  }

  export type teachersUpdateInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateManyWithoutTeachersNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutTeachersNestedInput
  }

  export type teachersUncheckedUpdateInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUncheckedUpdateManyWithoutTeachersNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutTeachersNestedInput
  }

  export type teachersCreateManyInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type teachersUpdateManyMutationInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type teachersUncheckedUpdateManyInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresCreateInput = {
    id?: bigint | number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutTest_scoresInput
    students: studentsCreateNestedOneWithoutTest_scoresInput
  }

  export type test_scoresUncheckedCreateInput = {
    id?: bigint | number
    student_id: number
    class_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type test_scoresUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutTest_scoresNestedInput
    students?: studentsUpdateOneRequiredWithoutTest_scoresNestedInput
  }

  export type test_scoresUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresCreateManyInput = {
    id?: bigint | number
    student_id: number
    class_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type test_scoresUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type ClassesScalarRelationFilter = {
    is?: classesWhereInput
    isNot?: classesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type class_daily_snapshotsClass_idSnapshot_dateCompoundUniqueInput = {
    class_id: number
    snapshot_date: Date | string
  }

  export type class_daily_snapshotsCountOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    snapshot_date?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrder
    homework_avg?: SortOrder
    pass_chuan_rate?: SortOrder
    pass_mem_rate?: SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrder
    is_alarm_triggered?: SortOrder
    health_status?: SortOrder
    scraped_at?: SortOrder
  }

  export type class_daily_snapshotsAvgOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrder
    homework_avg?: SortOrder
    pass_chuan_rate?: SortOrder
    pass_mem_rate?: SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrder
  }

  export type class_daily_snapshotsMaxOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    snapshot_date?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrder
    homework_avg?: SortOrder
    pass_chuan_rate?: SortOrder
    pass_mem_rate?: SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrder
    is_alarm_triggered?: SortOrder
    health_status?: SortOrder
    scraped_at?: SortOrder
  }

  export type class_daily_snapshotsMinOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    snapshot_date?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrder
    homework_avg?: SortOrder
    pass_chuan_rate?: SortOrder
    pass_mem_rate?: SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrder
    is_alarm_triggered?: SortOrder
    health_status?: SortOrder
    scraped_at?: SortOrder
  }

  export type class_daily_snapshotsSumOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    completed_sessions?: SortOrder
    progress_pct?: SortOrder
    active_students?: SortOrder
    on_hold_students?: SortOrder
    dropped_students?: SortOrder
    transferred_students?: SortOrder
    attendance_avg?: SortOrder
    homework_avg?: SortOrder
    pass_chuan_rate?: SortOrder
    pass_mem_rate?: SortOrder
    label_yellow?: SortOrder
    label_red?: SortOrder
    label_grey?: SortOrder
    label_no_data?: SortOrder
    risk_pct?: SortOrder
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

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type Class_daily_snapshotsListRelationFilter = {
    every?: class_daily_snapshotsWhereInput
    some?: class_daily_snapshotsWhereInput
    none?: class_daily_snapshotsWhereInput
  }

  export type TeachersScalarRelationFilter = {
    is?: teachersWhereInput
    isNot?: teachersWhereInput
  }

  export type Label_change_logsListRelationFilter = {
    every?: label_change_logsWhereInput
    some?: label_change_logsWhereInput
    none?: label_change_logsWhereInput
  }

  export type Pass_reviewsListRelationFilter = {
    every?: pass_reviewsWhereInput
    some?: pass_reviewsWhereInput
    none?: pass_reviewsWhereInput
  }

  export type Student_daily_recordsListRelationFilter = {
    every?: student_daily_recordsWhereInput
    some?: student_daily_recordsWhereInput
    none?: student_daily_recordsWhereInput
  }

  export type StudentsListRelationFilter = {
    every?: studentsWhereInput
    some?: studentsWhereInput
    none?: studentsWhereInput
  }

  export type Test_scoresListRelationFilter = {
    every?: test_scoresWhereInput
    some?: test_scoresWhereInput
    none?: test_scoresWhereInput
  }

  export type class_daily_snapshotsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type label_change_logsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type pass_reviewsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type student_daily_recordsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type studentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type test_scoresOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type classesCountOrderByAggregateInput = {
    class_id?: SortOrder
    class_name?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    lead_email?: SortOrder
    status?: SortOrder
    schedule?: SortOrder
    location?: SortOrder
    opening_date?: SortOrder
    ending_date?: SortOrder
    total_sessions?: SortOrder
    portal_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type classesAvgOrderByAggregateInput = {
    class_id?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    total_sessions?: SortOrder
  }

  export type classesMaxOrderByAggregateInput = {
    class_id?: SortOrder
    class_name?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    lead_email?: SortOrder
    status?: SortOrder
    schedule?: SortOrder
    location?: SortOrder
    opening_date?: SortOrder
    ending_date?: SortOrder
    total_sessions?: SortOrder
    portal_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type classesMinOrderByAggregateInput = {
    class_id?: SortOrder
    class_name?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    lead_email?: SortOrder
    status?: SortOrder
    schedule?: SortOrder
    location?: SortOrder
    opening_date?: SortOrder
    ending_date?: SortOrder
    total_sessions?: SortOrder
    portal_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type classesSumOrderByAggregateInput = {
    class_id?: SortOrder
    course_id?: SortOrder
    teacher_id?: SortOrder
    total_sessions?: SortOrder
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type StudentsScalarRelationFilter = {
    is?: studentsWhereInput
    isNot?: studentsWhereInput
  }

  export type label_change_logsCountOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    from_label?: SortOrder
    to_label?: SortOrder
    direction?: SortOrder
    severity?: SortOrder
    step_count?: SortOrder
    reason?: SortOrder
    checkpoint?: SortOrder
    test_average_after?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    email_sent?: SortOrder
    email_sent_at?: SortOrder
    created_at?: SortOrder
  }

  export type label_change_logsAvgOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    step_count?: SortOrder
    test_average_after?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
  }

  export type label_change_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    from_label?: SortOrder
    to_label?: SortOrder
    direction?: SortOrder
    severity?: SortOrder
    step_count?: SortOrder
    reason?: SortOrder
    checkpoint?: SortOrder
    test_average_after?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    email_sent?: SortOrder
    email_sent_at?: SortOrder
    created_at?: SortOrder
  }

  export type label_change_logsMinOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    from_label?: SortOrder
    to_label?: SortOrder
    direction?: SortOrder
    severity?: SortOrder
    step_count?: SortOrder
    reason?: SortOrder
    checkpoint?: SortOrder
    test_average_after?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    email_sent?: SortOrder
    email_sent_at?: SortOrder
    created_at?: SortOrder
  }

  export type label_change_logsSumOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    step_count?: SortOrder
    test_average_after?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type pass_reviewsCountOrderByAggregateInput = {
    id?: SortOrder
    review_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    pass_mem_group?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    review_status?: SortOrder
    teacher_decision?: SortOrder
    teacher_comment?: SortOrder
    confirmed_at?: SortOrder
    deadline?: SortOrder
    is_overdue?: SortOrder
    escalated_to_lead?: SortOrder
    lead_email_sent?: SortOrder
    created_at?: SortOrder
  }

  export type pass_reviewsAvgOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
  }

  export type pass_reviewsMaxOrderByAggregateInput = {
    id?: SortOrder
    review_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    pass_mem_group?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    review_status?: SortOrder
    teacher_decision?: SortOrder
    teacher_comment?: SortOrder
    confirmed_at?: SortOrder
    deadline?: SortOrder
    is_overdue?: SortOrder
    escalated_to_lead?: SortOrder
    lead_email_sent?: SortOrder
    created_at?: SortOrder
  }

  export type pass_reviewsMinOrderByAggregateInput = {
    id?: SortOrder
    review_id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    pass_mem_group?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
    review_status?: SortOrder
    teacher_decision?: SortOrder
    teacher_comment?: SortOrder
    confirmed_at?: SortOrder
    deadline?: SortOrder
    is_overdue?: SortOrder
    escalated_to_lead?: SortOrder
    lead_email_sent?: SortOrder
    created_at?: SortOrder
  }

  export type pass_reviewsSumOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    teacher_id?: SortOrder
    test_average?: SortOrder
    attendance_pct?: SortOrder
    homework_pct?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type student_daily_recordsStudent_idRecord_dateCompoundUniqueInput = {
    student_id: number
    record_date: Date | string
  }

  export type student_daily_recordsCountOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    record_date?: SortOrder
    attendance_pct?: SortOrder
    attendance_present?: SortOrder
    attendance_total?: SortOrder
    homework_pct?: SortOrder
    homework_done?: SortOrder
    homework_total?: SortOrder
    test_1?: SortOrder
    test_2?: SortOrder
    test_3?: SortOrder
    test_4?: SortOrder
    test_5?: SortOrder
    test_6?: SortOrder
    tests_taken?: SortOrder
    test_average?: SortOrder
    current_label?: SortOrder
    previous_label?: SortOrder
    benchmark_label?: SortOrder
    has_label_changed?: SortOrder
    label_change_direction?: SortOrder
    last_checkpoint?: SortOrder
    pass_chuan_status?: SortOrder
    pass_chuan_reasons?: SortOrder
    pass_mem_status?: SortOrder
    pass_mem_group?: SortOrder
    pass_mem_label?: SortOrder
    flag_attendance_drop?: SortOrder
    flag_homework_drop?: SortOrder
    flag_cheating?: SortOrder
    flag_needs_review?: SortOrder
    teacher_feedback_btvn?: SortOrder
    teacher_feedback_orient?: SortOrder
    teacher_note?: SortOrder
    teacher_temp_label?: SortOrder
    scraped_at?: SortOrder
  }

  export type student_daily_recordsAvgOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    attendance_pct?: SortOrder
    attendance_present?: SortOrder
    attendance_total?: SortOrder
    homework_pct?: SortOrder
    homework_done?: SortOrder
    homework_total?: SortOrder
    test_1?: SortOrder
    test_2?: SortOrder
    test_3?: SortOrder
    test_4?: SortOrder
    test_5?: SortOrder
    test_6?: SortOrder
    tests_taken?: SortOrder
    test_average?: SortOrder
  }

  export type student_daily_recordsMaxOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    record_date?: SortOrder
    attendance_pct?: SortOrder
    attendance_present?: SortOrder
    attendance_total?: SortOrder
    homework_pct?: SortOrder
    homework_done?: SortOrder
    homework_total?: SortOrder
    test_1?: SortOrder
    test_2?: SortOrder
    test_3?: SortOrder
    test_4?: SortOrder
    test_5?: SortOrder
    test_6?: SortOrder
    tests_taken?: SortOrder
    test_average?: SortOrder
    current_label?: SortOrder
    previous_label?: SortOrder
    benchmark_label?: SortOrder
    has_label_changed?: SortOrder
    label_change_direction?: SortOrder
    last_checkpoint?: SortOrder
    pass_chuan_status?: SortOrder
    pass_chuan_reasons?: SortOrder
    pass_mem_status?: SortOrder
    pass_mem_group?: SortOrder
    pass_mem_label?: SortOrder
    flag_attendance_drop?: SortOrder
    flag_homework_drop?: SortOrder
    flag_cheating?: SortOrder
    flag_needs_review?: SortOrder
    teacher_feedback_btvn?: SortOrder
    teacher_feedback_orient?: SortOrder
    teacher_note?: SortOrder
    teacher_temp_label?: SortOrder
    scraped_at?: SortOrder
  }

  export type student_daily_recordsMinOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    record_date?: SortOrder
    attendance_pct?: SortOrder
    attendance_present?: SortOrder
    attendance_total?: SortOrder
    homework_pct?: SortOrder
    homework_done?: SortOrder
    homework_total?: SortOrder
    test_1?: SortOrder
    test_2?: SortOrder
    test_3?: SortOrder
    test_4?: SortOrder
    test_5?: SortOrder
    test_6?: SortOrder
    tests_taken?: SortOrder
    test_average?: SortOrder
    current_label?: SortOrder
    previous_label?: SortOrder
    benchmark_label?: SortOrder
    has_label_changed?: SortOrder
    label_change_direction?: SortOrder
    last_checkpoint?: SortOrder
    pass_chuan_status?: SortOrder
    pass_chuan_reasons?: SortOrder
    pass_mem_status?: SortOrder
    pass_mem_group?: SortOrder
    pass_mem_label?: SortOrder
    flag_attendance_drop?: SortOrder
    flag_homework_drop?: SortOrder
    flag_cheating?: SortOrder
    flag_needs_review?: SortOrder
    teacher_feedback_btvn?: SortOrder
    teacher_feedback_orient?: SortOrder
    teacher_note?: SortOrder
    teacher_temp_label?: SortOrder
    scraped_at?: SortOrder
  }

  export type student_daily_recordsSumOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    attendance_pct?: SortOrder
    attendance_present?: SortOrder
    attendance_total?: SortOrder
    homework_pct?: SortOrder
    homework_done?: SortOrder
    homework_total?: SortOrder
    test_1?: SortOrder
    test_2?: SortOrder
    test_3?: SortOrder
    test_4?: SortOrder
    test_5?: SortOrder
    test_6?: SortOrder
    tests_taken?: SortOrder
    test_average?: SortOrder
  }

  export type studentsCountOrderByAggregateInput = {
    student_id?: SortOrder
    student_code?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    class_id?: SortOrder
    registration_status?: SortOrder
    admitted_at?: SortOrder
    target_output_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type studentsAvgOrderByAggregateInput = {
    student_id?: SortOrder
    class_id?: SortOrder
  }

  export type studentsMaxOrderByAggregateInput = {
    student_id?: SortOrder
    student_code?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    class_id?: SortOrder
    registration_status?: SortOrder
    admitted_at?: SortOrder
    target_output_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type studentsMinOrderByAggregateInput = {
    student_id?: SortOrder
    student_code?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    class_id?: SortOrder
    registration_status?: SortOrder
    admitted_at?: SortOrder
    target_output_status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type studentsSumOrderByAggregateInput = {
    student_id?: SortOrder
    class_id?: SortOrder
  }

  export type system_configsCountOrderByAggregateInput = {
    id?: SortOrder
    config_key?: SortOrder
    config_value?: SortOrder
    description?: SortOrder
    updated_at?: SortOrder
    updated_by?: SortOrder
  }

  export type system_configsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type system_configsMaxOrderByAggregateInput = {
    id?: SortOrder
    config_key?: SortOrder
    config_value?: SortOrder
    description?: SortOrder
    updated_at?: SortOrder
    updated_by?: SortOrder
  }

  export type system_configsMinOrderByAggregateInput = {
    id?: SortOrder
    config_key?: SortOrder
    config_value?: SortOrder
    description?: SortOrder
    updated_at?: SortOrder
    updated_by?: SortOrder
  }

  export type system_configsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type system_logsCountOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    run_id?: SortOrder
    workflow_name?: SortOrder
    action?: SortOrder
    class_id?: SortOrder
    status?: SortOrder
    message?: SortOrder
    records_affected?: SortOrder
    duration_ms?: SortOrder
    created_at?: SortOrder
  }

  export type system_logsAvgOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    records_affected?: SortOrder
    duration_ms?: SortOrder
  }

  export type system_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    run_id?: SortOrder
    workflow_name?: SortOrder
    action?: SortOrder
    class_id?: SortOrder
    status?: SortOrder
    message?: SortOrder
    records_affected?: SortOrder
    duration_ms?: SortOrder
    created_at?: SortOrder
  }

  export type system_logsMinOrderByAggregateInput = {
    id?: SortOrder
    log_id?: SortOrder
    run_id?: SortOrder
    workflow_name?: SortOrder
    action?: SortOrder
    class_id?: SortOrder
    status?: SortOrder
    message?: SortOrder
    records_affected?: SortOrder
    duration_ms?: SortOrder
    created_at?: SortOrder
  }

  export type system_logsSumOrderByAggregateInput = {
    id?: SortOrder
    class_id?: SortOrder
    records_affected?: SortOrder
    duration_ms?: SortOrder
  }

  export type ClassesListRelationFilter = {
    every?: classesWhereInput
    some?: classesWhereInput
    none?: classesWhereInput
  }

  export type classesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type teachersCountOrderByAggregateInput = {
    teacher_id?: SortOrder
    teacher_name?: SortOrder
    teacher_email?: SortOrder
    teacher_phone?: SortOrder
    khoi_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type teachersAvgOrderByAggregateInput = {
    teacher_id?: SortOrder
    khoi_id?: SortOrder
  }

  export type teachersMaxOrderByAggregateInput = {
    teacher_id?: SortOrder
    teacher_name?: SortOrder
    teacher_email?: SortOrder
    teacher_phone?: SortOrder
    khoi_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type teachersMinOrderByAggregateInput = {
    teacher_id?: SortOrder
    teacher_name?: SortOrder
    teacher_email?: SortOrder
    teacher_phone?: SortOrder
    khoi_id?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type teachersSumOrderByAggregateInput = {
    teacher_id?: SortOrder
    khoi_id?: SortOrder
  }

  export type test_scoresStudent_idClass_idTest_orderIs_makeupCompoundUniqueInput = {
    student_id: number
    class_id: number
    test_order: number
    is_makeup: boolean
  }

  export type test_scoresCountOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    test_name?: SortOrder
    raw_score?: SortOrder
    max_score?: SortOrder
    grade_percent?: SortOrder
    is_makeup?: SortOrder
    makeup_score?: SortOrder
    final_score?: SortOrder
    grade_status?: SortOrder
    is_cheating?: SortOrder
    grade_note?: SortOrder
    label_at_time?: SortOrder
    scraped_at?: SortOrder
    created_at?: SortOrder
  }

  export type test_scoresAvgOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    raw_score?: SortOrder
    max_score?: SortOrder
    grade_percent?: SortOrder
    makeup_score?: SortOrder
    final_score?: SortOrder
  }

  export type test_scoresMaxOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    test_name?: SortOrder
    raw_score?: SortOrder
    max_score?: SortOrder
    grade_percent?: SortOrder
    is_makeup?: SortOrder
    makeup_score?: SortOrder
    final_score?: SortOrder
    grade_status?: SortOrder
    is_cheating?: SortOrder
    grade_note?: SortOrder
    label_at_time?: SortOrder
    scraped_at?: SortOrder
    created_at?: SortOrder
  }

  export type test_scoresMinOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    test_name?: SortOrder
    raw_score?: SortOrder
    max_score?: SortOrder
    grade_percent?: SortOrder
    is_makeup?: SortOrder
    makeup_score?: SortOrder
    final_score?: SortOrder
    grade_status?: SortOrder
    is_cheating?: SortOrder
    grade_note?: SortOrder
    label_at_time?: SortOrder
    scraped_at?: SortOrder
    created_at?: SortOrder
  }

  export type test_scoresSumOrderByAggregateInput = {
    id?: SortOrder
    student_id?: SortOrder
    class_id?: SortOrder
    test_order?: SortOrder
    raw_score?: SortOrder
    max_score?: SortOrder
    grade_percent?: SortOrder
    makeup_score?: SortOrder
    final_score?: SortOrder
  }

  export type classesCreateNestedOneWithoutClass_daily_snapshotsInput = {
    create?: XOR<classesCreateWithoutClass_daily_snapshotsInput, classesUncheckedCreateWithoutClass_daily_snapshotsInput>
    connectOrCreate?: classesCreateOrConnectWithoutClass_daily_snapshotsInput
    connect?: classesWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type classesUpdateOneRequiredWithoutClass_daily_snapshotsNestedInput = {
    create?: XOR<classesCreateWithoutClass_daily_snapshotsInput, classesUncheckedCreateWithoutClass_daily_snapshotsInput>
    connectOrCreate?: classesCreateOrConnectWithoutClass_daily_snapshotsInput
    upsert?: classesUpsertWithoutClass_daily_snapshotsInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutClass_daily_snapshotsInput, classesUpdateWithoutClass_daily_snapshotsInput>, classesUncheckedUpdateWithoutClass_daily_snapshotsInput>
  }

  export type class_daily_snapshotsCreateNestedManyWithoutClassesInput = {
    create?: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput> | class_daily_snapshotsCreateWithoutClassesInput[] | class_daily_snapshotsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: class_daily_snapshotsCreateOrConnectWithoutClassesInput | class_daily_snapshotsCreateOrConnectWithoutClassesInput[]
    createMany?: class_daily_snapshotsCreateManyClassesInputEnvelope
    connect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
  }

  export type teachersCreateNestedOneWithoutClassesInput = {
    create?: XOR<teachersCreateWithoutClassesInput, teachersUncheckedCreateWithoutClassesInput>
    connectOrCreate?: teachersCreateOrConnectWithoutClassesInput
    connect?: teachersWhereUniqueInput
  }

  export type label_change_logsCreateNestedManyWithoutClassesInput = {
    create?: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput> | label_change_logsCreateWithoutClassesInput[] | label_change_logsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutClassesInput | label_change_logsCreateOrConnectWithoutClassesInput[]
    createMany?: label_change_logsCreateManyClassesInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsCreateNestedManyWithoutClassesInput = {
    create?: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput> | pass_reviewsCreateWithoutClassesInput[] | pass_reviewsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutClassesInput | pass_reviewsCreateOrConnectWithoutClassesInput[]
    createMany?: pass_reviewsCreateManyClassesInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type student_daily_recordsCreateNestedManyWithoutClassesInput = {
    create?: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput> | student_daily_recordsCreateWithoutClassesInput[] | student_daily_recordsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutClassesInput | student_daily_recordsCreateOrConnectWithoutClassesInput[]
    createMany?: student_daily_recordsCreateManyClassesInputEnvelope
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
  }

  export type studentsCreateNestedManyWithoutClassesInput = {
    create?: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput> | studentsCreateWithoutClassesInput[] | studentsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: studentsCreateOrConnectWithoutClassesInput | studentsCreateOrConnectWithoutClassesInput[]
    createMany?: studentsCreateManyClassesInputEnvelope
    connect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
  }

  export type test_scoresCreateNestedManyWithoutClassesInput = {
    create?: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput> | test_scoresCreateWithoutClassesInput[] | test_scoresUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutClassesInput | test_scoresCreateOrConnectWithoutClassesInput[]
    createMany?: test_scoresCreateManyClassesInputEnvelope
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
  }

  export type class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput> | class_daily_snapshotsCreateWithoutClassesInput[] | class_daily_snapshotsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: class_daily_snapshotsCreateOrConnectWithoutClassesInput | class_daily_snapshotsCreateOrConnectWithoutClassesInput[]
    createMany?: class_daily_snapshotsCreateManyClassesInputEnvelope
    connect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
  }

  export type label_change_logsUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput> | label_change_logsCreateWithoutClassesInput[] | label_change_logsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutClassesInput | label_change_logsCreateOrConnectWithoutClassesInput[]
    createMany?: label_change_logsCreateManyClassesInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput> | pass_reviewsCreateWithoutClassesInput[] | pass_reviewsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutClassesInput | pass_reviewsCreateOrConnectWithoutClassesInput[]
    createMany?: pass_reviewsCreateManyClassesInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput> | student_daily_recordsCreateWithoutClassesInput[] | student_daily_recordsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutClassesInput | student_daily_recordsCreateOrConnectWithoutClassesInput[]
    createMany?: student_daily_recordsCreateManyClassesInputEnvelope
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
  }

  export type studentsUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput> | studentsCreateWithoutClassesInput[] | studentsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: studentsCreateOrConnectWithoutClassesInput | studentsCreateOrConnectWithoutClassesInput[]
    createMany?: studentsCreateManyClassesInputEnvelope
    connect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
  }

  export type test_scoresUncheckedCreateNestedManyWithoutClassesInput = {
    create?: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput> | test_scoresCreateWithoutClassesInput[] | test_scoresUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutClassesInput | test_scoresCreateOrConnectWithoutClassesInput[]
    createMany?: test_scoresCreateManyClassesInputEnvelope
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type class_daily_snapshotsUpdateManyWithoutClassesNestedInput = {
    create?: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput> | class_daily_snapshotsCreateWithoutClassesInput[] | class_daily_snapshotsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: class_daily_snapshotsCreateOrConnectWithoutClassesInput | class_daily_snapshotsCreateOrConnectWithoutClassesInput[]
    upsert?: class_daily_snapshotsUpsertWithWhereUniqueWithoutClassesInput | class_daily_snapshotsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: class_daily_snapshotsCreateManyClassesInputEnvelope
    set?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    disconnect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    delete?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    connect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    update?: class_daily_snapshotsUpdateWithWhereUniqueWithoutClassesInput | class_daily_snapshotsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: class_daily_snapshotsUpdateManyWithWhereWithoutClassesInput | class_daily_snapshotsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: class_daily_snapshotsScalarWhereInput | class_daily_snapshotsScalarWhereInput[]
  }

  export type teachersUpdateOneRequiredWithoutClassesNestedInput = {
    create?: XOR<teachersCreateWithoutClassesInput, teachersUncheckedCreateWithoutClassesInput>
    connectOrCreate?: teachersCreateOrConnectWithoutClassesInput
    upsert?: teachersUpsertWithoutClassesInput
    connect?: teachersWhereUniqueInput
    update?: XOR<XOR<teachersUpdateToOneWithWhereWithoutClassesInput, teachersUpdateWithoutClassesInput>, teachersUncheckedUpdateWithoutClassesInput>
  }

  export type label_change_logsUpdateManyWithoutClassesNestedInput = {
    create?: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput> | label_change_logsCreateWithoutClassesInput[] | label_change_logsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutClassesInput | label_change_logsCreateOrConnectWithoutClassesInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutClassesInput | label_change_logsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: label_change_logsCreateManyClassesInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutClassesInput | label_change_logsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutClassesInput | label_change_logsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUpdateManyWithoutClassesNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput> | pass_reviewsCreateWithoutClassesInput[] | pass_reviewsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutClassesInput | pass_reviewsCreateOrConnectWithoutClassesInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutClassesInput | pass_reviewsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: pass_reviewsCreateManyClassesInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutClassesInput | pass_reviewsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutClassesInput | pass_reviewsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type student_daily_recordsUpdateManyWithoutClassesNestedInput = {
    create?: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput> | student_daily_recordsCreateWithoutClassesInput[] | student_daily_recordsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutClassesInput | student_daily_recordsCreateOrConnectWithoutClassesInput[]
    upsert?: student_daily_recordsUpsertWithWhereUniqueWithoutClassesInput | student_daily_recordsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: student_daily_recordsCreateManyClassesInputEnvelope
    set?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    disconnect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    delete?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    update?: student_daily_recordsUpdateWithWhereUniqueWithoutClassesInput | student_daily_recordsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: student_daily_recordsUpdateManyWithWhereWithoutClassesInput | student_daily_recordsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
  }

  export type studentsUpdateManyWithoutClassesNestedInput = {
    create?: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput> | studentsCreateWithoutClassesInput[] | studentsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: studentsCreateOrConnectWithoutClassesInput | studentsCreateOrConnectWithoutClassesInput[]
    upsert?: studentsUpsertWithWhereUniqueWithoutClassesInput | studentsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: studentsCreateManyClassesInputEnvelope
    set?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    disconnect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    delete?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    connect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    update?: studentsUpdateWithWhereUniqueWithoutClassesInput | studentsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: studentsUpdateManyWithWhereWithoutClassesInput | studentsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: studentsScalarWhereInput | studentsScalarWhereInput[]
  }

  export type test_scoresUpdateManyWithoutClassesNestedInput = {
    create?: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput> | test_scoresCreateWithoutClassesInput[] | test_scoresUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutClassesInput | test_scoresCreateOrConnectWithoutClassesInput[]
    upsert?: test_scoresUpsertWithWhereUniqueWithoutClassesInput | test_scoresUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: test_scoresCreateManyClassesInputEnvelope
    set?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    disconnect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    delete?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    update?: test_scoresUpdateWithWhereUniqueWithoutClassesInput | test_scoresUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: test_scoresUpdateManyWithWhereWithoutClassesInput | test_scoresUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
  }

  export type class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput> | class_daily_snapshotsCreateWithoutClassesInput[] | class_daily_snapshotsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: class_daily_snapshotsCreateOrConnectWithoutClassesInput | class_daily_snapshotsCreateOrConnectWithoutClassesInput[]
    upsert?: class_daily_snapshotsUpsertWithWhereUniqueWithoutClassesInput | class_daily_snapshotsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: class_daily_snapshotsCreateManyClassesInputEnvelope
    set?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    disconnect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    delete?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    connect?: class_daily_snapshotsWhereUniqueInput | class_daily_snapshotsWhereUniqueInput[]
    update?: class_daily_snapshotsUpdateWithWhereUniqueWithoutClassesInput | class_daily_snapshotsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: class_daily_snapshotsUpdateManyWithWhereWithoutClassesInput | class_daily_snapshotsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: class_daily_snapshotsScalarWhereInput | class_daily_snapshotsScalarWhereInput[]
  }

  export type label_change_logsUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput> | label_change_logsCreateWithoutClassesInput[] | label_change_logsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutClassesInput | label_change_logsCreateOrConnectWithoutClassesInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutClassesInput | label_change_logsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: label_change_logsCreateManyClassesInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutClassesInput | label_change_logsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutClassesInput | label_change_logsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput> | pass_reviewsCreateWithoutClassesInput[] | pass_reviewsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutClassesInput | pass_reviewsCreateOrConnectWithoutClassesInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutClassesInput | pass_reviewsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: pass_reviewsCreateManyClassesInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutClassesInput | pass_reviewsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutClassesInput | pass_reviewsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput> | student_daily_recordsCreateWithoutClassesInput[] | student_daily_recordsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutClassesInput | student_daily_recordsCreateOrConnectWithoutClassesInput[]
    upsert?: student_daily_recordsUpsertWithWhereUniqueWithoutClassesInput | student_daily_recordsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: student_daily_recordsCreateManyClassesInputEnvelope
    set?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    disconnect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    delete?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    update?: student_daily_recordsUpdateWithWhereUniqueWithoutClassesInput | student_daily_recordsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: student_daily_recordsUpdateManyWithWhereWithoutClassesInput | student_daily_recordsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
  }

  export type studentsUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput> | studentsCreateWithoutClassesInput[] | studentsUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: studentsCreateOrConnectWithoutClassesInput | studentsCreateOrConnectWithoutClassesInput[]
    upsert?: studentsUpsertWithWhereUniqueWithoutClassesInput | studentsUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: studentsCreateManyClassesInputEnvelope
    set?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    disconnect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    delete?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    connect?: studentsWhereUniqueInput | studentsWhereUniqueInput[]
    update?: studentsUpdateWithWhereUniqueWithoutClassesInput | studentsUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: studentsUpdateManyWithWhereWithoutClassesInput | studentsUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: studentsScalarWhereInput | studentsScalarWhereInput[]
  }

  export type test_scoresUncheckedUpdateManyWithoutClassesNestedInput = {
    create?: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput> | test_scoresCreateWithoutClassesInput[] | test_scoresUncheckedCreateWithoutClassesInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutClassesInput | test_scoresCreateOrConnectWithoutClassesInput[]
    upsert?: test_scoresUpsertWithWhereUniqueWithoutClassesInput | test_scoresUpsertWithWhereUniqueWithoutClassesInput[]
    createMany?: test_scoresCreateManyClassesInputEnvelope
    set?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    disconnect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    delete?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    update?: test_scoresUpdateWithWhereUniqueWithoutClassesInput | test_scoresUpdateWithWhereUniqueWithoutClassesInput[]
    updateMany?: test_scoresUpdateManyWithWhereWithoutClassesInput | test_scoresUpdateManyWithWhereWithoutClassesInput[]
    deleteMany?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
  }

  export type classesCreateNestedOneWithoutLabel_change_logsInput = {
    create?: XOR<classesCreateWithoutLabel_change_logsInput, classesUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: classesCreateOrConnectWithoutLabel_change_logsInput
    connect?: classesWhereUniqueInput
  }

  export type studentsCreateNestedOneWithoutLabel_change_logsInput = {
    create?: XOR<studentsCreateWithoutLabel_change_logsInput, studentsUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutLabel_change_logsInput
    connect?: studentsWhereUniqueInput
  }

  export type teachersCreateNestedOneWithoutLabel_change_logsInput = {
    create?: XOR<teachersCreateWithoutLabel_change_logsInput, teachersUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: teachersCreateOrConnectWithoutLabel_change_logsInput
    connect?: teachersWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type classesUpdateOneRequiredWithoutLabel_change_logsNestedInput = {
    create?: XOR<classesCreateWithoutLabel_change_logsInput, classesUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: classesCreateOrConnectWithoutLabel_change_logsInput
    upsert?: classesUpsertWithoutLabel_change_logsInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutLabel_change_logsInput, classesUpdateWithoutLabel_change_logsInput>, classesUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type studentsUpdateOneRequiredWithoutLabel_change_logsNestedInput = {
    create?: XOR<studentsCreateWithoutLabel_change_logsInput, studentsUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutLabel_change_logsInput
    upsert?: studentsUpsertWithoutLabel_change_logsInput
    connect?: studentsWhereUniqueInput
    update?: XOR<XOR<studentsUpdateToOneWithWhereWithoutLabel_change_logsInput, studentsUpdateWithoutLabel_change_logsInput>, studentsUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type teachersUpdateOneRequiredWithoutLabel_change_logsNestedInput = {
    create?: XOR<teachersCreateWithoutLabel_change_logsInput, teachersUncheckedCreateWithoutLabel_change_logsInput>
    connectOrCreate?: teachersCreateOrConnectWithoutLabel_change_logsInput
    upsert?: teachersUpsertWithoutLabel_change_logsInput
    connect?: teachersWhereUniqueInput
    update?: XOR<XOR<teachersUpdateToOneWithWhereWithoutLabel_change_logsInput, teachersUpdateWithoutLabel_change_logsInput>, teachersUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type classesCreateNestedOneWithoutPass_reviewsInput = {
    create?: XOR<classesCreateWithoutPass_reviewsInput, classesUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: classesCreateOrConnectWithoutPass_reviewsInput
    connect?: classesWhereUniqueInput
  }

  export type studentsCreateNestedOneWithoutPass_reviewsInput = {
    create?: XOR<studentsCreateWithoutPass_reviewsInput, studentsUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutPass_reviewsInput
    connect?: studentsWhereUniqueInput
  }

  export type teachersCreateNestedOneWithoutPass_reviewsInput = {
    create?: XOR<teachersCreateWithoutPass_reviewsInput, teachersUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: teachersCreateOrConnectWithoutPass_reviewsInput
    connect?: teachersWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type classesUpdateOneRequiredWithoutPass_reviewsNestedInput = {
    create?: XOR<classesCreateWithoutPass_reviewsInput, classesUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: classesCreateOrConnectWithoutPass_reviewsInput
    upsert?: classesUpsertWithoutPass_reviewsInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutPass_reviewsInput, classesUpdateWithoutPass_reviewsInput>, classesUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type studentsUpdateOneRequiredWithoutPass_reviewsNestedInput = {
    create?: XOR<studentsCreateWithoutPass_reviewsInput, studentsUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutPass_reviewsInput
    upsert?: studentsUpsertWithoutPass_reviewsInput
    connect?: studentsWhereUniqueInput
    update?: XOR<XOR<studentsUpdateToOneWithWhereWithoutPass_reviewsInput, studentsUpdateWithoutPass_reviewsInput>, studentsUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type teachersUpdateOneRequiredWithoutPass_reviewsNestedInput = {
    create?: XOR<teachersCreateWithoutPass_reviewsInput, teachersUncheckedCreateWithoutPass_reviewsInput>
    connectOrCreate?: teachersCreateOrConnectWithoutPass_reviewsInput
    upsert?: teachersUpsertWithoutPass_reviewsInput
    connect?: teachersWhereUniqueInput
    update?: XOR<XOR<teachersUpdateToOneWithWhereWithoutPass_reviewsInput, teachersUpdateWithoutPass_reviewsInput>, teachersUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type classesCreateNestedOneWithoutStudent_daily_recordsInput = {
    create?: XOR<classesCreateWithoutStudent_daily_recordsInput, classesUncheckedCreateWithoutStudent_daily_recordsInput>
    connectOrCreate?: classesCreateOrConnectWithoutStudent_daily_recordsInput
    connect?: classesWhereUniqueInput
  }

  export type studentsCreateNestedOneWithoutStudent_daily_recordsInput = {
    create?: XOR<studentsCreateWithoutStudent_daily_recordsInput, studentsUncheckedCreateWithoutStudent_daily_recordsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutStudent_daily_recordsInput
    connect?: studentsWhereUniqueInput
  }

  export type classesUpdateOneRequiredWithoutStudent_daily_recordsNestedInput = {
    create?: XOR<classesCreateWithoutStudent_daily_recordsInput, classesUncheckedCreateWithoutStudent_daily_recordsInput>
    connectOrCreate?: classesCreateOrConnectWithoutStudent_daily_recordsInput
    upsert?: classesUpsertWithoutStudent_daily_recordsInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutStudent_daily_recordsInput, classesUpdateWithoutStudent_daily_recordsInput>, classesUncheckedUpdateWithoutStudent_daily_recordsInput>
  }

  export type studentsUpdateOneRequiredWithoutStudent_daily_recordsNestedInput = {
    create?: XOR<studentsCreateWithoutStudent_daily_recordsInput, studentsUncheckedCreateWithoutStudent_daily_recordsInput>
    connectOrCreate?: studentsCreateOrConnectWithoutStudent_daily_recordsInput
    upsert?: studentsUpsertWithoutStudent_daily_recordsInput
    connect?: studentsWhereUniqueInput
    update?: XOR<XOR<studentsUpdateToOneWithWhereWithoutStudent_daily_recordsInput, studentsUpdateWithoutStudent_daily_recordsInput>, studentsUncheckedUpdateWithoutStudent_daily_recordsInput>
  }

  export type label_change_logsCreateNestedManyWithoutStudentsInput = {
    create?: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput> | label_change_logsCreateWithoutStudentsInput[] | label_change_logsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutStudentsInput | label_change_logsCreateOrConnectWithoutStudentsInput[]
    createMany?: label_change_logsCreateManyStudentsInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsCreateNestedManyWithoutStudentsInput = {
    create?: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput> | pass_reviewsCreateWithoutStudentsInput[] | pass_reviewsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutStudentsInput | pass_reviewsCreateOrConnectWithoutStudentsInput[]
    createMany?: pass_reviewsCreateManyStudentsInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type student_daily_recordsCreateNestedManyWithoutStudentsInput = {
    create?: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput> | student_daily_recordsCreateWithoutStudentsInput[] | student_daily_recordsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutStudentsInput | student_daily_recordsCreateOrConnectWithoutStudentsInput[]
    createMany?: student_daily_recordsCreateManyStudentsInputEnvelope
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
  }

  export type classesCreateNestedOneWithoutStudentsInput = {
    create?: XOR<classesCreateWithoutStudentsInput, classesUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: classesCreateOrConnectWithoutStudentsInput
    connect?: classesWhereUniqueInput
  }

  export type test_scoresCreateNestedManyWithoutStudentsInput = {
    create?: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput> | test_scoresCreateWithoutStudentsInput[] | test_scoresUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutStudentsInput | test_scoresCreateOrConnectWithoutStudentsInput[]
    createMany?: test_scoresCreateManyStudentsInputEnvelope
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
  }

  export type label_change_logsUncheckedCreateNestedManyWithoutStudentsInput = {
    create?: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput> | label_change_logsCreateWithoutStudentsInput[] | label_change_logsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutStudentsInput | label_change_logsCreateOrConnectWithoutStudentsInput[]
    createMany?: label_change_logsCreateManyStudentsInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput = {
    create?: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput> | pass_reviewsCreateWithoutStudentsInput[] | pass_reviewsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutStudentsInput | pass_reviewsCreateOrConnectWithoutStudentsInput[]
    createMany?: pass_reviewsCreateManyStudentsInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput = {
    create?: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput> | student_daily_recordsCreateWithoutStudentsInput[] | student_daily_recordsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutStudentsInput | student_daily_recordsCreateOrConnectWithoutStudentsInput[]
    createMany?: student_daily_recordsCreateManyStudentsInputEnvelope
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
  }

  export type test_scoresUncheckedCreateNestedManyWithoutStudentsInput = {
    create?: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput> | test_scoresCreateWithoutStudentsInput[] | test_scoresUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutStudentsInput | test_scoresCreateOrConnectWithoutStudentsInput[]
    createMany?: test_scoresCreateManyStudentsInputEnvelope
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
  }

  export type label_change_logsUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput> | label_change_logsCreateWithoutStudentsInput[] | label_change_logsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutStudentsInput | label_change_logsCreateOrConnectWithoutStudentsInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutStudentsInput | label_change_logsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: label_change_logsCreateManyStudentsInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutStudentsInput | label_change_logsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutStudentsInput | label_change_logsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput> | pass_reviewsCreateWithoutStudentsInput[] | pass_reviewsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutStudentsInput | pass_reviewsCreateOrConnectWithoutStudentsInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutStudentsInput | pass_reviewsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: pass_reviewsCreateManyStudentsInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutStudentsInput | pass_reviewsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutStudentsInput | pass_reviewsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type student_daily_recordsUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput> | student_daily_recordsCreateWithoutStudentsInput[] | student_daily_recordsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutStudentsInput | student_daily_recordsCreateOrConnectWithoutStudentsInput[]
    upsert?: student_daily_recordsUpsertWithWhereUniqueWithoutStudentsInput | student_daily_recordsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: student_daily_recordsCreateManyStudentsInputEnvelope
    set?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    disconnect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    delete?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    update?: student_daily_recordsUpdateWithWhereUniqueWithoutStudentsInput | student_daily_recordsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: student_daily_recordsUpdateManyWithWhereWithoutStudentsInput | student_daily_recordsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
  }

  export type classesUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<classesCreateWithoutStudentsInput, classesUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: classesCreateOrConnectWithoutStudentsInput
    upsert?: classesUpsertWithoutStudentsInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutStudentsInput, classesUpdateWithoutStudentsInput>, classesUncheckedUpdateWithoutStudentsInput>
  }

  export type test_scoresUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput> | test_scoresCreateWithoutStudentsInput[] | test_scoresUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutStudentsInput | test_scoresCreateOrConnectWithoutStudentsInput[]
    upsert?: test_scoresUpsertWithWhereUniqueWithoutStudentsInput | test_scoresUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: test_scoresCreateManyStudentsInputEnvelope
    set?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    disconnect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    delete?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    update?: test_scoresUpdateWithWhereUniqueWithoutStudentsInput | test_scoresUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: test_scoresUpdateManyWithWhereWithoutStudentsInput | test_scoresUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
  }

  export type label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput> | label_change_logsCreateWithoutStudentsInput[] | label_change_logsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutStudentsInput | label_change_logsCreateOrConnectWithoutStudentsInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutStudentsInput | label_change_logsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: label_change_logsCreateManyStudentsInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutStudentsInput | label_change_logsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutStudentsInput | label_change_logsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput> | pass_reviewsCreateWithoutStudentsInput[] | pass_reviewsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutStudentsInput | pass_reviewsCreateOrConnectWithoutStudentsInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutStudentsInput | pass_reviewsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: pass_reviewsCreateManyStudentsInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutStudentsInput | pass_reviewsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutStudentsInput | pass_reviewsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput> | student_daily_recordsCreateWithoutStudentsInput[] | student_daily_recordsUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: student_daily_recordsCreateOrConnectWithoutStudentsInput | student_daily_recordsCreateOrConnectWithoutStudentsInput[]
    upsert?: student_daily_recordsUpsertWithWhereUniqueWithoutStudentsInput | student_daily_recordsUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: student_daily_recordsCreateManyStudentsInputEnvelope
    set?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    disconnect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    delete?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    connect?: student_daily_recordsWhereUniqueInput | student_daily_recordsWhereUniqueInput[]
    update?: student_daily_recordsUpdateWithWhereUniqueWithoutStudentsInput | student_daily_recordsUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: student_daily_recordsUpdateManyWithWhereWithoutStudentsInput | student_daily_recordsUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
  }

  export type test_scoresUncheckedUpdateManyWithoutStudentsNestedInput = {
    create?: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput> | test_scoresCreateWithoutStudentsInput[] | test_scoresUncheckedCreateWithoutStudentsInput[]
    connectOrCreate?: test_scoresCreateOrConnectWithoutStudentsInput | test_scoresCreateOrConnectWithoutStudentsInput[]
    upsert?: test_scoresUpsertWithWhereUniqueWithoutStudentsInput | test_scoresUpsertWithWhereUniqueWithoutStudentsInput[]
    createMany?: test_scoresCreateManyStudentsInputEnvelope
    set?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    disconnect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    delete?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    connect?: test_scoresWhereUniqueInput | test_scoresWhereUniqueInput[]
    update?: test_scoresUpdateWithWhereUniqueWithoutStudentsInput | test_scoresUpdateWithWhereUniqueWithoutStudentsInput[]
    updateMany?: test_scoresUpdateManyWithWhereWithoutStudentsInput | test_scoresUpdateManyWithWhereWithoutStudentsInput[]
    deleteMany?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
  }

  export type classesCreateNestedManyWithoutTeachersInput = {
    create?: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput> | classesCreateWithoutTeachersInput[] | classesUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: classesCreateOrConnectWithoutTeachersInput | classesCreateOrConnectWithoutTeachersInput[]
    createMany?: classesCreateManyTeachersInputEnvelope
    connect?: classesWhereUniqueInput | classesWhereUniqueInput[]
  }

  export type label_change_logsCreateNestedManyWithoutTeachersInput = {
    create?: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput> | label_change_logsCreateWithoutTeachersInput[] | label_change_logsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutTeachersInput | label_change_logsCreateOrConnectWithoutTeachersInput[]
    createMany?: label_change_logsCreateManyTeachersInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsCreateNestedManyWithoutTeachersInput = {
    create?: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput> | pass_reviewsCreateWithoutTeachersInput[] | pass_reviewsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutTeachersInput | pass_reviewsCreateOrConnectWithoutTeachersInput[]
    createMany?: pass_reviewsCreateManyTeachersInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type classesUncheckedCreateNestedManyWithoutTeachersInput = {
    create?: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput> | classesCreateWithoutTeachersInput[] | classesUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: classesCreateOrConnectWithoutTeachersInput | classesCreateOrConnectWithoutTeachersInput[]
    createMany?: classesCreateManyTeachersInputEnvelope
    connect?: classesWhereUniqueInput | classesWhereUniqueInput[]
  }

  export type label_change_logsUncheckedCreateNestedManyWithoutTeachersInput = {
    create?: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput> | label_change_logsCreateWithoutTeachersInput[] | label_change_logsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutTeachersInput | label_change_logsCreateOrConnectWithoutTeachersInput[]
    createMany?: label_change_logsCreateManyTeachersInputEnvelope
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
  }

  export type pass_reviewsUncheckedCreateNestedManyWithoutTeachersInput = {
    create?: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput> | pass_reviewsCreateWithoutTeachersInput[] | pass_reviewsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutTeachersInput | pass_reviewsCreateOrConnectWithoutTeachersInput[]
    createMany?: pass_reviewsCreateManyTeachersInputEnvelope
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
  }

  export type classesUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput> | classesCreateWithoutTeachersInput[] | classesUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: classesCreateOrConnectWithoutTeachersInput | classesCreateOrConnectWithoutTeachersInput[]
    upsert?: classesUpsertWithWhereUniqueWithoutTeachersInput | classesUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: classesCreateManyTeachersInputEnvelope
    set?: classesWhereUniqueInput | classesWhereUniqueInput[]
    disconnect?: classesWhereUniqueInput | classesWhereUniqueInput[]
    delete?: classesWhereUniqueInput | classesWhereUniqueInput[]
    connect?: classesWhereUniqueInput | classesWhereUniqueInput[]
    update?: classesUpdateWithWhereUniqueWithoutTeachersInput | classesUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: classesUpdateManyWithWhereWithoutTeachersInput | classesUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: classesScalarWhereInput | classesScalarWhereInput[]
  }

  export type label_change_logsUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput> | label_change_logsCreateWithoutTeachersInput[] | label_change_logsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutTeachersInput | label_change_logsCreateOrConnectWithoutTeachersInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutTeachersInput | label_change_logsUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: label_change_logsCreateManyTeachersInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutTeachersInput | label_change_logsUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutTeachersInput | label_change_logsUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput> | pass_reviewsCreateWithoutTeachersInput[] | pass_reviewsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutTeachersInput | pass_reviewsCreateOrConnectWithoutTeachersInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutTeachersInput | pass_reviewsUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: pass_reviewsCreateManyTeachersInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutTeachersInput | pass_reviewsUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutTeachersInput | pass_reviewsUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type classesUncheckedUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput> | classesCreateWithoutTeachersInput[] | classesUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: classesCreateOrConnectWithoutTeachersInput | classesCreateOrConnectWithoutTeachersInput[]
    upsert?: classesUpsertWithWhereUniqueWithoutTeachersInput | classesUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: classesCreateManyTeachersInputEnvelope
    set?: classesWhereUniqueInput | classesWhereUniqueInput[]
    disconnect?: classesWhereUniqueInput | classesWhereUniqueInput[]
    delete?: classesWhereUniqueInput | classesWhereUniqueInput[]
    connect?: classesWhereUniqueInput | classesWhereUniqueInput[]
    update?: classesUpdateWithWhereUniqueWithoutTeachersInput | classesUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: classesUpdateManyWithWhereWithoutTeachersInput | classesUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: classesScalarWhereInput | classesScalarWhereInput[]
  }

  export type label_change_logsUncheckedUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput> | label_change_logsCreateWithoutTeachersInput[] | label_change_logsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: label_change_logsCreateOrConnectWithoutTeachersInput | label_change_logsCreateOrConnectWithoutTeachersInput[]
    upsert?: label_change_logsUpsertWithWhereUniqueWithoutTeachersInput | label_change_logsUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: label_change_logsCreateManyTeachersInputEnvelope
    set?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    disconnect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    delete?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    connect?: label_change_logsWhereUniqueInput | label_change_logsWhereUniqueInput[]
    update?: label_change_logsUpdateWithWhereUniqueWithoutTeachersInput | label_change_logsUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: label_change_logsUpdateManyWithWhereWithoutTeachersInput | label_change_logsUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
  }

  export type pass_reviewsUncheckedUpdateManyWithoutTeachersNestedInput = {
    create?: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput> | pass_reviewsCreateWithoutTeachersInput[] | pass_reviewsUncheckedCreateWithoutTeachersInput[]
    connectOrCreate?: pass_reviewsCreateOrConnectWithoutTeachersInput | pass_reviewsCreateOrConnectWithoutTeachersInput[]
    upsert?: pass_reviewsUpsertWithWhereUniqueWithoutTeachersInput | pass_reviewsUpsertWithWhereUniqueWithoutTeachersInput[]
    createMany?: pass_reviewsCreateManyTeachersInputEnvelope
    set?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    disconnect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    delete?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    connect?: pass_reviewsWhereUniqueInput | pass_reviewsWhereUniqueInput[]
    update?: pass_reviewsUpdateWithWhereUniqueWithoutTeachersInput | pass_reviewsUpdateWithWhereUniqueWithoutTeachersInput[]
    updateMany?: pass_reviewsUpdateManyWithWhereWithoutTeachersInput | pass_reviewsUpdateManyWithWhereWithoutTeachersInput[]
    deleteMany?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
  }

  export type classesCreateNestedOneWithoutTest_scoresInput = {
    create?: XOR<classesCreateWithoutTest_scoresInput, classesUncheckedCreateWithoutTest_scoresInput>
    connectOrCreate?: classesCreateOrConnectWithoutTest_scoresInput
    connect?: classesWhereUniqueInput
  }

  export type studentsCreateNestedOneWithoutTest_scoresInput = {
    create?: XOR<studentsCreateWithoutTest_scoresInput, studentsUncheckedCreateWithoutTest_scoresInput>
    connectOrCreate?: studentsCreateOrConnectWithoutTest_scoresInput
    connect?: studentsWhereUniqueInput
  }

  export type classesUpdateOneRequiredWithoutTest_scoresNestedInput = {
    create?: XOR<classesCreateWithoutTest_scoresInput, classesUncheckedCreateWithoutTest_scoresInput>
    connectOrCreate?: classesCreateOrConnectWithoutTest_scoresInput
    upsert?: classesUpsertWithoutTest_scoresInput
    connect?: classesWhereUniqueInput
    update?: XOR<XOR<classesUpdateToOneWithWhereWithoutTest_scoresInput, classesUpdateWithoutTest_scoresInput>, classesUncheckedUpdateWithoutTest_scoresInput>
  }

  export type studentsUpdateOneRequiredWithoutTest_scoresNestedInput = {
    create?: XOR<studentsCreateWithoutTest_scoresInput, studentsUncheckedCreateWithoutTest_scoresInput>
    connectOrCreate?: studentsCreateOrConnectWithoutTest_scoresInput
    upsert?: studentsUpsertWithoutTest_scoresInput
    connect?: studentsWhereUniqueInput
    update?: XOR<XOR<studentsUpdateToOneWithWhereWithoutTest_scoresInput, studentsUpdateWithoutTest_scoresInput>, studentsUncheckedUpdateWithoutTest_scoresInput>
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

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type classesCreateWithoutClass_daily_snapshotsInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutClass_daily_snapshotsInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutClass_daily_snapshotsInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutClass_daily_snapshotsInput, classesUncheckedCreateWithoutClass_daily_snapshotsInput>
  }

  export type classesUpsertWithoutClass_daily_snapshotsInput = {
    update: XOR<classesUpdateWithoutClass_daily_snapshotsInput, classesUncheckedUpdateWithoutClass_daily_snapshotsInput>
    create: XOR<classesCreateWithoutClass_daily_snapshotsInput, classesUncheckedCreateWithoutClass_daily_snapshotsInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutClass_daily_snapshotsInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutClass_daily_snapshotsInput, classesUncheckedUpdateWithoutClass_daily_snapshotsInput>
  }

  export type classesUpdateWithoutClass_daily_snapshotsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutClass_daily_snapshotsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type class_daily_snapshotsCreateWithoutClassesInput = {
    id?: bigint | number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
  }

  export type class_daily_snapshotsUncheckedCreateWithoutClassesInput = {
    id?: bigint | number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
  }

  export type class_daily_snapshotsCreateOrConnectWithoutClassesInput = {
    where: class_daily_snapshotsWhereUniqueInput
    create: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput>
  }

  export type class_daily_snapshotsCreateManyClassesInputEnvelope = {
    data: class_daily_snapshotsCreateManyClassesInput | class_daily_snapshotsCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type teachersCreateWithoutClassesInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutTeachersInput
  }

  export type teachersUncheckedCreateWithoutClassesInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutTeachersInput
  }

  export type teachersCreateOrConnectWithoutClassesInput = {
    where: teachersWhereUniqueInput
    create: XOR<teachersCreateWithoutClassesInput, teachersUncheckedCreateWithoutClassesInput>
  }

  export type label_change_logsCreateWithoutClassesInput = {
    id?: bigint | number
    log_id?: string
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
    students: studentsCreateNestedOneWithoutLabel_change_logsInput
    teachers: teachersCreateNestedOneWithoutLabel_change_logsInput
  }

  export type label_change_logsUncheckedCreateWithoutClassesInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type label_change_logsCreateOrConnectWithoutClassesInput = {
    where: label_change_logsWhereUniqueInput
    create: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput>
  }

  export type label_change_logsCreateManyClassesInputEnvelope = {
    data: label_change_logsCreateManyClassesInput | label_change_logsCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type pass_reviewsCreateWithoutClassesInput = {
    id?: bigint | number
    review_id?: string
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
    students: studentsCreateNestedOneWithoutPass_reviewsInput
    teachers: teachersCreateNestedOneWithoutPass_reviewsInput
  }

  export type pass_reviewsUncheckedCreateWithoutClassesInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type pass_reviewsCreateOrConnectWithoutClassesInput = {
    where: pass_reviewsWhereUniqueInput
    create: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput>
  }

  export type pass_reviewsCreateManyClassesInputEnvelope = {
    data: pass_reviewsCreateManyClassesInput | pass_reviewsCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type student_daily_recordsCreateWithoutClassesInput = {
    id?: bigint | number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
    students: studentsCreateNestedOneWithoutStudent_daily_recordsInput
  }

  export type student_daily_recordsUncheckedCreateWithoutClassesInput = {
    id?: bigint | number
    student_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type student_daily_recordsCreateOrConnectWithoutClassesInput = {
    where: student_daily_recordsWhereUniqueInput
    create: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput>
  }

  export type student_daily_recordsCreateManyClassesInputEnvelope = {
    data: student_daily_recordsCreateManyClassesInput | student_daily_recordsCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type studentsCreateWithoutClassesInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresCreateNestedManyWithoutStudentsInput
  }

  export type studentsUncheckedCreateWithoutClassesInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsCreateOrConnectWithoutClassesInput = {
    where: studentsWhereUniqueInput
    create: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput>
  }

  export type studentsCreateManyClassesInputEnvelope = {
    data: studentsCreateManyClassesInput | studentsCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type test_scoresCreateWithoutClassesInput = {
    id?: bigint | number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
    students: studentsCreateNestedOneWithoutTest_scoresInput
  }

  export type test_scoresUncheckedCreateWithoutClassesInput = {
    id?: bigint | number
    student_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type test_scoresCreateOrConnectWithoutClassesInput = {
    where: test_scoresWhereUniqueInput
    create: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput>
  }

  export type test_scoresCreateManyClassesInputEnvelope = {
    data: test_scoresCreateManyClassesInput | test_scoresCreateManyClassesInput[]
    skipDuplicates?: boolean
  }

  export type class_daily_snapshotsUpsertWithWhereUniqueWithoutClassesInput = {
    where: class_daily_snapshotsWhereUniqueInput
    update: XOR<class_daily_snapshotsUpdateWithoutClassesInput, class_daily_snapshotsUncheckedUpdateWithoutClassesInput>
    create: XOR<class_daily_snapshotsCreateWithoutClassesInput, class_daily_snapshotsUncheckedCreateWithoutClassesInput>
  }

  export type class_daily_snapshotsUpdateWithWhereUniqueWithoutClassesInput = {
    where: class_daily_snapshotsWhereUniqueInput
    data: XOR<class_daily_snapshotsUpdateWithoutClassesInput, class_daily_snapshotsUncheckedUpdateWithoutClassesInput>
  }

  export type class_daily_snapshotsUpdateManyWithWhereWithoutClassesInput = {
    where: class_daily_snapshotsScalarWhereInput
    data: XOR<class_daily_snapshotsUpdateManyMutationInput, class_daily_snapshotsUncheckedUpdateManyWithoutClassesInput>
  }

  export type class_daily_snapshotsScalarWhereInput = {
    AND?: class_daily_snapshotsScalarWhereInput | class_daily_snapshotsScalarWhereInput[]
    OR?: class_daily_snapshotsScalarWhereInput[]
    NOT?: class_daily_snapshotsScalarWhereInput | class_daily_snapshotsScalarWhereInput[]
    id?: BigIntFilter<"class_daily_snapshots"> | bigint | number
    class_id?: IntFilter<"class_daily_snapshots"> | number
    snapshot_date?: DateTimeFilter<"class_daily_snapshots"> | Date | string
    completed_sessions?: IntFilter<"class_daily_snapshots"> | number
    progress_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFilter<"class_daily_snapshots"> | number
    on_hold_students?: IntFilter<"class_daily_snapshots"> | number
    dropped_students?: IntFilter<"class_daily_snapshots"> | number
    transferred_students?: IntFilter<"class_daily_snapshots"> | number
    attendance_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    homework_avg?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFilter<"class_daily_snapshots"> | number
    label_red?: IntFilter<"class_daily_snapshots"> | number
    label_grey?: IntFilter<"class_daily_snapshots"> | number
    label_no_data?: IntFilter<"class_daily_snapshots"> | number
    risk_pct?: DecimalNullableFilter<"class_daily_snapshots"> | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFilter<"class_daily_snapshots"> | boolean
    health_status?: StringNullableFilter<"class_daily_snapshots"> | string | null
    scraped_at?: DateTimeFilter<"class_daily_snapshots"> | Date | string
  }

  export type teachersUpsertWithoutClassesInput = {
    update: XOR<teachersUpdateWithoutClassesInput, teachersUncheckedUpdateWithoutClassesInput>
    create: XOR<teachersCreateWithoutClassesInput, teachersUncheckedCreateWithoutClassesInput>
    where?: teachersWhereInput
  }

  export type teachersUpdateToOneWithWhereWithoutClassesInput = {
    where?: teachersWhereInput
    data: XOR<teachersUpdateWithoutClassesInput, teachersUncheckedUpdateWithoutClassesInput>
  }

  export type teachersUpdateWithoutClassesInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutTeachersNestedInput
  }

  export type teachersUncheckedUpdateWithoutClassesInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutTeachersNestedInput
  }

  export type label_change_logsUpsertWithWhereUniqueWithoutClassesInput = {
    where: label_change_logsWhereUniqueInput
    update: XOR<label_change_logsUpdateWithoutClassesInput, label_change_logsUncheckedUpdateWithoutClassesInput>
    create: XOR<label_change_logsCreateWithoutClassesInput, label_change_logsUncheckedCreateWithoutClassesInput>
  }

  export type label_change_logsUpdateWithWhereUniqueWithoutClassesInput = {
    where: label_change_logsWhereUniqueInput
    data: XOR<label_change_logsUpdateWithoutClassesInput, label_change_logsUncheckedUpdateWithoutClassesInput>
  }

  export type label_change_logsUpdateManyWithWhereWithoutClassesInput = {
    where: label_change_logsScalarWhereInput
    data: XOR<label_change_logsUpdateManyMutationInput, label_change_logsUncheckedUpdateManyWithoutClassesInput>
  }

  export type label_change_logsScalarWhereInput = {
    AND?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
    OR?: label_change_logsScalarWhereInput[]
    NOT?: label_change_logsScalarWhereInput | label_change_logsScalarWhereInput[]
    id?: BigIntFilter<"label_change_logs"> | bigint | number
    log_id?: StringFilter<"label_change_logs"> | string
    student_id?: IntFilter<"label_change_logs"> | number
    class_id?: IntFilter<"label_change_logs"> | number
    teacher_id?: IntFilter<"label_change_logs"> | number
    from_label?: StringFilter<"label_change_logs"> | string
    to_label?: StringFilter<"label_change_logs"> | string
    direction?: StringFilter<"label_change_logs"> | string
    severity?: StringNullableFilter<"label_change_logs"> | string | null
    step_count?: IntNullableFilter<"label_change_logs"> | number | null
    reason?: StringNullableFilter<"label_change_logs"> | string | null
    checkpoint?: StringNullableFilter<"label_change_logs"> | string | null
    test_average_after?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"label_change_logs"> | Decimal | DecimalJsLike | number | string | null
    email_sent?: BoolNullableFilter<"label_change_logs"> | boolean | null
    email_sent_at?: DateTimeNullableFilter<"label_change_logs"> | Date | string | null
    created_at?: DateTimeFilter<"label_change_logs"> | Date | string
  }

  export type pass_reviewsUpsertWithWhereUniqueWithoutClassesInput = {
    where: pass_reviewsWhereUniqueInput
    update: XOR<pass_reviewsUpdateWithoutClassesInput, pass_reviewsUncheckedUpdateWithoutClassesInput>
    create: XOR<pass_reviewsCreateWithoutClassesInput, pass_reviewsUncheckedCreateWithoutClassesInput>
  }

  export type pass_reviewsUpdateWithWhereUniqueWithoutClassesInput = {
    where: pass_reviewsWhereUniqueInput
    data: XOR<pass_reviewsUpdateWithoutClassesInput, pass_reviewsUncheckedUpdateWithoutClassesInput>
  }

  export type pass_reviewsUpdateManyWithWhereWithoutClassesInput = {
    where: pass_reviewsScalarWhereInput
    data: XOR<pass_reviewsUpdateManyMutationInput, pass_reviewsUncheckedUpdateManyWithoutClassesInput>
  }

  export type pass_reviewsScalarWhereInput = {
    AND?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
    OR?: pass_reviewsScalarWhereInput[]
    NOT?: pass_reviewsScalarWhereInput | pass_reviewsScalarWhereInput[]
    id?: BigIntFilter<"pass_reviews"> | bigint | number
    review_id?: StringFilter<"pass_reviews"> | string
    student_id?: IntFilter<"pass_reviews"> | number
    class_id?: IntFilter<"pass_reviews"> | number
    teacher_id?: IntFilter<"pass_reviews"> | number
    pass_mem_group?: StringFilter<"pass_reviews"> | string
    test_average?: DecimalFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string
    attendance_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    homework_pct?: DecimalNullableFilter<"pass_reviews"> | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFilter<"pass_reviews"> | string
    teacher_decision?: StringNullableFilter<"pass_reviews"> | string | null
    teacher_comment?: StringNullableFilter<"pass_reviews"> | string | null
    confirmed_at?: DateTimeNullableFilter<"pass_reviews"> | Date | string | null
    deadline?: DateTimeFilter<"pass_reviews"> | Date | string
    is_overdue?: BoolFilter<"pass_reviews"> | boolean
    escalated_to_lead?: BoolFilter<"pass_reviews"> | boolean
    lead_email_sent?: BoolFilter<"pass_reviews"> | boolean
    created_at?: DateTimeFilter<"pass_reviews"> | Date | string
  }

  export type student_daily_recordsUpsertWithWhereUniqueWithoutClassesInput = {
    where: student_daily_recordsWhereUniqueInput
    update: XOR<student_daily_recordsUpdateWithoutClassesInput, student_daily_recordsUncheckedUpdateWithoutClassesInput>
    create: XOR<student_daily_recordsCreateWithoutClassesInput, student_daily_recordsUncheckedCreateWithoutClassesInput>
  }

  export type student_daily_recordsUpdateWithWhereUniqueWithoutClassesInput = {
    where: student_daily_recordsWhereUniqueInput
    data: XOR<student_daily_recordsUpdateWithoutClassesInput, student_daily_recordsUncheckedUpdateWithoutClassesInput>
  }

  export type student_daily_recordsUpdateManyWithWhereWithoutClassesInput = {
    where: student_daily_recordsScalarWhereInput
    data: XOR<student_daily_recordsUpdateManyMutationInput, student_daily_recordsUncheckedUpdateManyWithoutClassesInput>
  }

  export type student_daily_recordsScalarWhereInput = {
    AND?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
    OR?: student_daily_recordsScalarWhereInput[]
    NOT?: student_daily_recordsScalarWhereInput | student_daily_recordsScalarWhereInput[]
    id?: BigIntFilter<"student_daily_records"> | bigint | number
    student_id?: IntFilter<"student_daily_records"> | number
    class_id?: IntFilter<"student_daily_records"> | number
    record_date?: DateTimeFilter<"student_daily_records"> | Date | string
    attendance_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    attendance_present?: IntNullableFilter<"student_daily_records"> | number | null
    attendance_total?: IntNullableFilter<"student_daily_records"> | number | null
    homework_pct?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    homework_done?: IntNullableFilter<"student_daily_records"> | number | null
    homework_total?: IntNullableFilter<"student_daily_records"> | number | null
    test_1?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_2?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_3?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_4?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_5?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    test_6?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    tests_taken?: IntNullableFilter<"student_daily_records"> | number | null
    test_average?: DecimalNullableFilter<"student_daily_records"> | Decimal | DecimalJsLike | number | string | null
    current_label?: StringNullableFilter<"student_daily_records"> | string | null
    previous_label?: StringNullableFilter<"student_daily_records"> | string | null
    benchmark_label?: StringNullableFilter<"student_daily_records"> | string | null
    has_label_changed?: BoolNullableFilter<"student_daily_records"> | boolean | null
    label_change_direction?: StringNullableFilter<"student_daily_records"> | string | null
    last_checkpoint?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_chuan_reasons?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_status?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_group?: StringNullableFilter<"student_daily_records"> | string | null
    pass_mem_label?: StringNullableFilter<"student_daily_records"> | string | null
    flag_attendance_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_homework_drop?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_cheating?: BoolNullableFilter<"student_daily_records"> | boolean | null
    flag_needs_review?: BoolNullableFilter<"student_daily_records"> | boolean | null
    teacher_feedback_btvn?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_feedback_orient?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_note?: StringNullableFilter<"student_daily_records"> | string | null
    teacher_temp_label?: StringNullableFilter<"student_daily_records"> | string | null
    scraped_at?: DateTimeFilter<"student_daily_records"> | Date | string
  }

  export type studentsUpsertWithWhereUniqueWithoutClassesInput = {
    where: studentsWhereUniqueInput
    update: XOR<studentsUpdateWithoutClassesInput, studentsUncheckedUpdateWithoutClassesInput>
    create: XOR<studentsCreateWithoutClassesInput, studentsUncheckedCreateWithoutClassesInput>
  }

  export type studentsUpdateWithWhereUniqueWithoutClassesInput = {
    where: studentsWhereUniqueInput
    data: XOR<studentsUpdateWithoutClassesInput, studentsUncheckedUpdateWithoutClassesInput>
  }

  export type studentsUpdateManyWithWhereWithoutClassesInput = {
    where: studentsScalarWhereInput
    data: XOR<studentsUpdateManyMutationInput, studentsUncheckedUpdateManyWithoutClassesInput>
  }

  export type studentsScalarWhereInput = {
    AND?: studentsScalarWhereInput | studentsScalarWhereInput[]
    OR?: studentsScalarWhereInput[]
    NOT?: studentsScalarWhereInput | studentsScalarWhereInput[]
    student_id?: IntFilter<"students"> | number
    student_code?: StringNullableFilter<"students"> | string | null
    full_name?: StringFilter<"students"> | string
    phone?: StringNullableFilter<"students"> | string | null
    email?: StringNullableFilter<"students"> | string | null
    class_id?: IntFilter<"students"> | number
    registration_status?: StringFilter<"students"> | string
    admitted_at?: DateTimeNullableFilter<"students"> | Date | string | null
    target_output_status?: StringNullableFilter<"students"> | string | null
    created_at?: DateTimeFilter<"students"> | Date | string
    updated_at?: DateTimeFilter<"students"> | Date | string
  }

  export type test_scoresUpsertWithWhereUniqueWithoutClassesInput = {
    where: test_scoresWhereUniqueInput
    update: XOR<test_scoresUpdateWithoutClassesInput, test_scoresUncheckedUpdateWithoutClassesInput>
    create: XOR<test_scoresCreateWithoutClassesInput, test_scoresUncheckedCreateWithoutClassesInput>
  }

  export type test_scoresUpdateWithWhereUniqueWithoutClassesInput = {
    where: test_scoresWhereUniqueInput
    data: XOR<test_scoresUpdateWithoutClassesInput, test_scoresUncheckedUpdateWithoutClassesInput>
  }

  export type test_scoresUpdateManyWithWhereWithoutClassesInput = {
    where: test_scoresScalarWhereInput
    data: XOR<test_scoresUpdateManyMutationInput, test_scoresUncheckedUpdateManyWithoutClassesInput>
  }

  export type test_scoresScalarWhereInput = {
    AND?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
    OR?: test_scoresScalarWhereInput[]
    NOT?: test_scoresScalarWhereInput | test_scoresScalarWhereInput[]
    id?: BigIntFilter<"test_scores"> | bigint | number
    student_id?: IntFilter<"test_scores"> | number
    class_id?: IntFilter<"test_scores"> | number
    test_order?: IntFilter<"test_scores"> | number
    test_name?: StringFilter<"test_scores"> | string
    raw_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    max_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_percent?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFilter<"test_scores"> | boolean
    makeup_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    final_score?: DecimalNullableFilter<"test_scores"> | Decimal | DecimalJsLike | number | string | null
    grade_status?: StringNullableFilter<"test_scores"> | string | null
    is_cheating?: BoolFilter<"test_scores"> | boolean
    grade_note?: StringNullableFilter<"test_scores"> | string | null
    label_at_time?: StringNullableFilter<"test_scores"> | string | null
    scraped_at?: DateTimeFilter<"test_scores"> | Date | string
    created_at?: DateTimeFilter<"test_scores"> | Date | string
  }

  export type classesCreateWithoutLabel_change_logsInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutLabel_change_logsInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutLabel_change_logsInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutLabel_change_logsInput, classesUncheckedCreateWithoutLabel_change_logsInput>
  }

  export type studentsCreateWithoutLabel_change_logsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pass_reviews?: pass_reviewsCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutStudentsInput
    classes: classesCreateNestedOneWithoutStudentsInput
    test_scores?: test_scoresCreateNestedManyWithoutStudentsInput
  }

  export type studentsUncheckedCreateWithoutLabel_change_logsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsCreateOrConnectWithoutLabel_change_logsInput = {
    where: studentsWhereUniqueInput
    create: XOR<studentsCreateWithoutLabel_change_logsInput, studentsUncheckedCreateWithoutLabel_change_logsInput>
  }

  export type teachersCreateWithoutLabel_change_logsInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutTeachersInput
  }

  export type teachersUncheckedCreateWithoutLabel_change_logsInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesUncheckedCreateNestedManyWithoutTeachersInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutTeachersInput
  }

  export type teachersCreateOrConnectWithoutLabel_change_logsInput = {
    where: teachersWhereUniqueInput
    create: XOR<teachersCreateWithoutLabel_change_logsInput, teachersUncheckedCreateWithoutLabel_change_logsInput>
  }

  export type classesUpsertWithoutLabel_change_logsInput = {
    update: XOR<classesUpdateWithoutLabel_change_logsInput, classesUncheckedUpdateWithoutLabel_change_logsInput>
    create: XOR<classesCreateWithoutLabel_change_logsInput, classesUncheckedCreateWithoutLabel_change_logsInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutLabel_change_logsInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutLabel_change_logsInput, classesUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type classesUpdateWithoutLabel_change_logsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutLabel_change_logsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type studentsUpsertWithoutLabel_change_logsInput = {
    update: XOR<studentsUpdateWithoutLabel_change_logsInput, studentsUncheckedUpdateWithoutLabel_change_logsInput>
    create: XOR<studentsCreateWithoutLabel_change_logsInput, studentsUncheckedCreateWithoutLabel_change_logsInput>
    where?: studentsWhereInput
  }

  export type studentsUpdateToOneWithWhereWithoutLabel_change_logsInput = {
    where?: studentsWhereInput
    data: XOR<studentsUpdateWithoutLabel_change_logsInput, studentsUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type studentsUpdateWithoutLabel_change_logsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pass_reviews?: pass_reviewsUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutStudentsNestedInput
    classes?: classesUpdateOneRequiredWithoutStudentsNestedInput
    test_scores?: test_scoresUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateWithoutLabel_change_logsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type teachersUpsertWithoutLabel_change_logsInput = {
    update: XOR<teachersUpdateWithoutLabel_change_logsInput, teachersUncheckedUpdateWithoutLabel_change_logsInput>
    create: XOR<teachersCreateWithoutLabel_change_logsInput, teachersUncheckedCreateWithoutLabel_change_logsInput>
    where?: teachersWhereInput
  }

  export type teachersUpdateToOneWithWhereWithoutLabel_change_logsInput = {
    where?: teachersWhereInput
    data: XOR<teachersUpdateWithoutLabel_change_logsInput, teachersUncheckedUpdateWithoutLabel_change_logsInput>
  }

  export type teachersUpdateWithoutLabel_change_logsInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutTeachersNestedInput
  }

  export type teachersUncheckedUpdateWithoutLabel_change_logsInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUncheckedUpdateManyWithoutTeachersNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutTeachersNestedInput
  }

  export type classesCreateWithoutPass_reviewsInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutPass_reviewsInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutPass_reviewsInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutPass_reviewsInput, classesUncheckedCreateWithoutPass_reviewsInput>
  }

  export type studentsCreateWithoutPass_reviewsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutStudentsInput
    classes: classesCreateNestedOneWithoutStudentsInput
    test_scores?: test_scoresCreateNestedManyWithoutStudentsInput
  }

  export type studentsUncheckedCreateWithoutPass_reviewsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsCreateOrConnectWithoutPass_reviewsInput = {
    where: studentsWhereUniqueInput
    create: XOR<studentsCreateWithoutPass_reviewsInput, studentsUncheckedCreateWithoutPass_reviewsInput>
  }

  export type teachersCreateWithoutPass_reviewsInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesCreateNestedManyWithoutTeachersInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutTeachersInput
  }

  export type teachersUncheckedCreateWithoutPass_reviewsInput = {
    teacher_id: number
    teacher_name: string
    teacher_email: string
    teacher_phone?: string | null
    khoi_id?: number
    role?: string
    created_at?: Date | string
    updated_at?: Date | string
    classes?: classesUncheckedCreateNestedManyWithoutTeachersInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutTeachersInput
  }

  export type teachersCreateOrConnectWithoutPass_reviewsInput = {
    where: teachersWhereUniqueInput
    create: XOR<teachersCreateWithoutPass_reviewsInput, teachersUncheckedCreateWithoutPass_reviewsInput>
  }

  export type classesUpsertWithoutPass_reviewsInput = {
    update: XOR<classesUpdateWithoutPass_reviewsInput, classesUncheckedUpdateWithoutPass_reviewsInput>
    create: XOR<classesCreateWithoutPass_reviewsInput, classesUncheckedCreateWithoutPass_reviewsInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutPass_reviewsInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutPass_reviewsInput, classesUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type classesUpdateWithoutPass_reviewsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutPass_reviewsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type studentsUpsertWithoutPass_reviewsInput = {
    update: XOR<studentsUpdateWithoutPass_reviewsInput, studentsUncheckedUpdateWithoutPass_reviewsInput>
    create: XOR<studentsCreateWithoutPass_reviewsInput, studentsUncheckedCreateWithoutPass_reviewsInput>
    where?: studentsWhereInput
  }

  export type studentsUpdateToOneWithWhereWithoutPass_reviewsInput = {
    where?: studentsWhereInput
    data: XOR<studentsUpdateWithoutPass_reviewsInput, studentsUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type studentsUpdateWithoutPass_reviewsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutStudentsNestedInput
    classes?: classesUpdateOneRequiredWithoutStudentsNestedInput
    test_scores?: test_scoresUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateWithoutPass_reviewsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type teachersUpsertWithoutPass_reviewsInput = {
    update: XOR<teachersUpdateWithoutPass_reviewsInput, teachersUncheckedUpdateWithoutPass_reviewsInput>
    create: XOR<teachersCreateWithoutPass_reviewsInput, teachersUncheckedCreateWithoutPass_reviewsInput>
    where?: teachersWhereInput
  }

  export type teachersUpdateToOneWithWhereWithoutPass_reviewsInput = {
    where?: teachersWhereInput
    data: XOR<teachersUpdateWithoutPass_reviewsInput, teachersUncheckedUpdateWithoutPass_reviewsInput>
  }

  export type teachersUpdateWithoutPass_reviewsInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateManyWithoutTeachersNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutTeachersNestedInput
  }

  export type teachersUncheckedUpdateWithoutPass_reviewsInput = {
    teacher_id?: IntFieldUpdateOperationsInput | number
    teacher_name?: StringFieldUpdateOperationsInput | string
    teacher_email?: StringFieldUpdateOperationsInput | string
    teacher_phone?: NullableStringFieldUpdateOperationsInput | string | null
    khoi_id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUncheckedUpdateManyWithoutTeachersNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutTeachersNestedInput
  }

  export type classesCreateWithoutStudent_daily_recordsInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutStudent_daily_recordsInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutStudent_daily_recordsInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutStudent_daily_recordsInput, classesUncheckedCreateWithoutStudent_daily_recordsInput>
  }

  export type studentsCreateWithoutStudent_daily_recordsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutStudentsInput
    classes: classesCreateNestedOneWithoutStudentsInput
    test_scores?: test_scoresCreateNestedManyWithoutStudentsInput
  }

  export type studentsUncheckedCreateWithoutStudent_daily_recordsInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsCreateOrConnectWithoutStudent_daily_recordsInput = {
    where: studentsWhereUniqueInput
    create: XOR<studentsCreateWithoutStudent_daily_recordsInput, studentsUncheckedCreateWithoutStudent_daily_recordsInput>
  }

  export type classesUpsertWithoutStudent_daily_recordsInput = {
    update: XOR<classesUpdateWithoutStudent_daily_recordsInput, classesUncheckedUpdateWithoutStudent_daily_recordsInput>
    create: XOR<classesCreateWithoutStudent_daily_recordsInput, classesUncheckedCreateWithoutStudent_daily_recordsInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutStudent_daily_recordsInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutStudent_daily_recordsInput, classesUncheckedUpdateWithoutStudent_daily_recordsInput>
  }

  export type classesUpdateWithoutStudent_daily_recordsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutStudent_daily_recordsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type studentsUpsertWithoutStudent_daily_recordsInput = {
    update: XOR<studentsUpdateWithoutStudent_daily_recordsInput, studentsUncheckedUpdateWithoutStudent_daily_recordsInput>
    create: XOR<studentsCreateWithoutStudent_daily_recordsInput, studentsUncheckedCreateWithoutStudent_daily_recordsInput>
    where?: studentsWhereInput
  }

  export type studentsUpdateToOneWithWhereWithoutStudent_daily_recordsInput = {
    where?: studentsWhereInput
    data: XOR<studentsUpdateWithoutStudent_daily_recordsInput, studentsUncheckedUpdateWithoutStudent_daily_recordsInput>
  }

  export type studentsUpdateWithoutStudent_daily_recordsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutStudentsNestedInput
    classes?: classesUpdateOneRequiredWithoutStudentsNestedInput
    test_scores?: test_scoresUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateWithoutStudent_daily_recordsInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type label_change_logsCreateWithoutStudentsInput = {
    id?: bigint | number
    log_id?: string
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutLabel_change_logsInput
    teachers: teachersCreateNestedOneWithoutLabel_change_logsInput
  }

  export type label_change_logsUncheckedCreateWithoutStudentsInput = {
    id?: bigint | number
    log_id?: string
    class_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type label_change_logsCreateOrConnectWithoutStudentsInput = {
    where: label_change_logsWhereUniqueInput
    create: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput>
  }

  export type label_change_logsCreateManyStudentsInputEnvelope = {
    data: label_change_logsCreateManyStudentsInput | label_change_logsCreateManyStudentsInput[]
    skipDuplicates?: boolean
  }

  export type pass_reviewsCreateWithoutStudentsInput = {
    id?: bigint | number
    review_id?: string
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutPass_reviewsInput
    teachers: teachersCreateNestedOneWithoutPass_reviewsInput
  }

  export type pass_reviewsUncheckedCreateWithoutStudentsInput = {
    id?: bigint | number
    review_id?: string
    class_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type pass_reviewsCreateOrConnectWithoutStudentsInput = {
    where: pass_reviewsWhereUniqueInput
    create: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput>
  }

  export type pass_reviewsCreateManyStudentsInputEnvelope = {
    data: pass_reviewsCreateManyStudentsInput | pass_reviewsCreateManyStudentsInput[]
    skipDuplicates?: boolean
  }

  export type student_daily_recordsCreateWithoutStudentsInput = {
    id?: bigint | number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
    classes: classesCreateNestedOneWithoutStudent_daily_recordsInput
  }

  export type student_daily_recordsUncheckedCreateWithoutStudentsInput = {
    id?: bigint | number
    class_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type student_daily_recordsCreateOrConnectWithoutStudentsInput = {
    where: student_daily_recordsWhereUniqueInput
    create: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput>
  }

  export type student_daily_recordsCreateManyStudentsInputEnvelope = {
    data: student_daily_recordsCreateManyStudentsInput | student_daily_recordsCreateManyStudentsInput[]
    skipDuplicates?: boolean
  }

  export type classesCreateWithoutStudentsInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutStudentsInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutStudentsInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutStudentsInput, classesUncheckedCreateWithoutStudentsInput>
  }

  export type test_scoresCreateWithoutStudentsInput = {
    id?: bigint | number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutTest_scoresInput
  }

  export type test_scoresUncheckedCreateWithoutStudentsInput = {
    id?: bigint | number
    class_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type test_scoresCreateOrConnectWithoutStudentsInput = {
    where: test_scoresWhereUniqueInput
    create: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput>
  }

  export type test_scoresCreateManyStudentsInputEnvelope = {
    data: test_scoresCreateManyStudentsInput | test_scoresCreateManyStudentsInput[]
    skipDuplicates?: boolean
  }

  export type label_change_logsUpsertWithWhereUniqueWithoutStudentsInput = {
    where: label_change_logsWhereUniqueInput
    update: XOR<label_change_logsUpdateWithoutStudentsInput, label_change_logsUncheckedUpdateWithoutStudentsInput>
    create: XOR<label_change_logsCreateWithoutStudentsInput, label_change_logsUncheckedCreateWithoutStudentsInput>
  }

  export type label_change_logsUpdateWithWhereUniqueWithoutStudentsInput = {
    where: label_change_logsWhereUniqueInput
    data: XOR<label_change_logsUpdateWithoutStudentsInput, label_change_logsUncheckedUpdateWithoutStudentsInput>
  }

  export type label_change_logsUpdateManyWithWhereWithoutStudentsInput = {
    where: label_change_logsScalarWhereInput
    data: XOR<label_change_logsUpdateManyMutationInput, label_change_logsUncheckedUpdateManyWithoutStudentsInput>
  }

  export type pass_reviewsUpsertWithWhereUniqueWithoutStudentsInput = {
    where: pass_reviewsWhereUniqueInput
    update: XOR<pass_reviewsUpdateWithoutStudentsInput, pass_reviewsUncheckedUpdateWithoutStudentsInput>
    create: XOR<pass_reviewsCreateWithoutStudentsInput, pass_reviewsUncheckedCreateWithoutStudentsInput>
  }

  export type pass_reviewsUpdateWithWhereUniqueWithoutStudentsInput = {
    where: pass_reviewsWhereUniqueInput
    data: XOR<pass_reviewsUpdateWithoutStudentsInput, pass_reviewsUncheckedUpdateWithoutStudentsInput>
  }

  export type pass_reviewsUpdateManyWithWhereWithoutStudentsInput = {
    where: pass_reviewsScalarWhereInput
    data: XOR<pass_reviewsUpdateManyMutationInput, pass_reviewsUncheckedUpdateManyWithoutStudentsInput>
  }

  export type student_daily_recordsUpsertWithWhereUniqueWithoutStudentsInput = {
    where: student_daily_recordsWhereUniqueInput
    update: XOR<student_daily_recordsUpdateWithoutStudentsInput, student_daily_recordsUncheckedUpdateWithoutStudentsInput>
    create: XOR<student_daily_recordsCreateWithoutStudentsInput, student_daily_recordsUncheckedCreateWithoutStudentsInput>
  }

  export type student_daily_recordsUpdateWithWhereUniqueWithoutStudentsInput = {
    where: student_daily_recordsWhereUniqueInput
    data: XOR<student_daily_recordsUpdateWithoutStudentsInput, student_daily_recordsUncheckedUpdateWithoutStudentsInput>
  }

  export type student_daily_recordsUpdateManyWithWhereWithoutStudentsInput = {
    where: student_daily_recordsScalarWhereInput
    data: XOR<student_daily_recordsUpdateManyMutationInput, student_daily_recordsUncheckedUpdateManyWithoutStudentsInput>
  }

  export type classesUpsertWithoutStudentsInput = {
    update: XOR<classesUpdateWithoutStudentsInput, classesUncheckedUpdateWithoutStudentsInput>
    create: XOR<classesCreateWithoutStudentsInput, classesUncheckedCreateWithoutStudentsInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutStudentsInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutStudentsInput, classesUncheckedUpdateWithoutStudentsInput>
  }

  export type classesUpdateWithoutStudentsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutStudentsInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type test_scoresUpsertWithWhereUniqueWithoutStudentsInput = {
    where: test_scoresWhereUniqueInput
    update: XOR<test_scoresUpdateWithoutStudentsInput, test_scoresUncheckedUpdateWithoutStudentsInput>
    create: XOR<test_scoresCreateWithoutStudentsInput, test_scoresUncheckedCreateWithoutStudentsInput>
  }

  export type test_scoresUpdateWithWhereUniqueWithoutStudentsInput = {
    where: test_scoresWhereUniqueInput
    data: XOR<test_scoresUpdateWithoutStudentsInput, test_scoresUncheckedUpdateWithoutStudentsInput>
  }

  export type test_scoresUpdateManyWithWhereWithoutStudentsInput = {
    where: test_scoresScalarWhereInput
    data: XOR<test_scoresUpdateManyMutationInput, test_scoresUncheckedUpdateManyWithoutStudentsInput>
  }

  export type classesCreateWithoutTeachersInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutTeachersInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
    test_scores?: test_scoresUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutTeachersInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput>
  }

  export type classesCreateManyTeachersInputEnvelope = {
    data: classesCreateManyTeachersInput | classesCreateManyTeachersInput[]
    skipDuplicates?: boolean
  }

  export type label_change_logsCreateWithoutTeachersInput = {
    id?: bigint | number
    log_id?: string
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutLabel_change_logsInput
    students: studentsCreateNestedOneWithoutLabel_change_logsInput
  }

  export type label_change_logsUncheckedCreateWithoutTeachersInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    class_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type label_change_logsCreateOrConnectWithoutTeachersInput = {
    where: label_change_logsWhereUniqueInput
    create: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput>
  }

  export type label_change_logsCreateManyTeachersInputEnvelope = {
    data: label_change_logsCreateManyTeachersInput | label_change_logsCreateManyTeachersInput[]
    skipDuplicates?: boolean
  }

  export type pass_reviewsCreateWithoutTeachersInput = {
    id?: bigint | number
    review_id?: string
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
    classes: classesCreateNestedOneWithoutPass_reviewsInput
    students: studentsCreateNestedOneWithoutPass_reviewsInput
  }

  export type pass_reviewsUncheckedCreateWithoutTeachersInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    class_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type pass_reviewsCreateOrConnectWithoutTeachersInput = {
    where: pass_reviewsWhereUniqueInput
    create: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput>
  }

  export type pass_reviewsCreateManyTeachersInputEnvelope = {
    data: pass_reviewsCreateManyTeachersInput | pass_reviewsCreateManyTeachersInput[]
    skipDuplicates?: boolean
  }

  export type classesUpsertWithWhereUniqueWithoutTeachersInput = {
    where: classesWhereUniqueInput
    update: XOR<classesUpdateWithoutTeachersInput, classesUncheckedUpdateWithoutTeachersInput>
    create: XOR<classesCreateWithoutTeachersInput, classesUncheckedCreateWithoutTeachersInput>
  }

  export type classesUpdateWithWhereUniqueWithoutTeachersInput = {
    where: classesWhereUniqueInput
    data: XOR<classesUpdateWithoutTeachersInput, classesUncheckedUpdateWithoutTeachersInput>
  }

  export type classesUpdateManyWithWhereWithoutTeachersInput = {
    where: classesScalarWhereInput
    data: XOR<classesUpdateManyMutationInput, classesUncheckedUpdateManyWithoutTeachersInput>
  }

  export type classesScalarWhereInput = {
    AND?: classesScalarWhereInput | classesScalarWhereInput[]
    OR?: classesScalarWhereInput[]
    NOT?: classesScalarWhereInput | classesScalarWhereInput[]
    class_id?: IntFilter<"classes"> | number
    class_name?: StringFilter<"classes"> | string
    course_id?: IntFilter<"classes"> | number
    teacher_id?: IntFilter<"classes"> | number
    lead_email?: StringNullableFilter<"classes"> | string | null
    status?: StringFilter<"classes"> | string
    schedule?: StringNullableFilter<"classes"> | string | null
    location?: StringNullableFilter<"classes"> | string | null
    opening_date?: DateTimeFilter<"classes"> | Date | string
    ending_date?: DateTimeNullableFilter<"classes"> | Date | string | null
    total_sessions?: IntFilter<"classes"> | number
    portal_url?: StringNullableFilter<"classes"> | string | null
    created_at?: DateTimeFilter<"classes"> | Date | string
    updated_at?: DateTimeFilter<"classes"> | Date | string
  }

  export type label_change_logsUpsertWithWhereUniqueWithoutTeachersInput = {
    where: label_change_logsWhereUniqueInput
    update: XOR<label_change_logsUpdateWithoutTeachersInput, label_change_logsUncheckedUpdateWithoutTeachersInput>
    create: XOR<label_change_logsCreateWithoutTeachersInput, label_change_logsUncheckedCreateWithoutTeachersInput>
  }

  export type label_change_logsUpdateWithWhereUniqueWithoutTeachersInput = {
    where: label_change_logsWhereUniqueInput
    data: XOR<label_change_logsUpdateWithoutTeachersInput, label_change_logsUncheckedUpdateWithoutTeachersInput>
  }

  export type label_change_logsUpdateManyWithWhereWithoutTeachersInput = {
    where: label_change_logsScalarWhereInput
    data: XOR<label_change_logsUpdateManyMutationInput, label_change_logsUncheckedUpdateManyWithoutTeachersInput>
  }

  export type pass_reviewsUpsertWithWhereUniqueWithoutTeachersInput = {
    where: pass_reviewsWhereUniqueInput
    update: XOR<pass_reviewsUpdateWithoutTeachersInput, pass_reviewsUncheckedUpdateWithoutTeachersInput>
    create: XOR<pass_reviewsCreateWithoutTeachersInput, pass_reviewsUncheckedCreateWithoutTeachersInput>
  }

  export type pass_reviewsUpdateWithWhereUniqueWithoutTeachersInput = {
    where: pass_reviewsWhereUniqueInput
    data: XOR<pass_reviewsUpdateWithoutTeachersInput, pass_reviewsUncheckedUpdateWithoutTeachersInput>
  }

  export type pass_reviewsUpdateManyWithWhereWithoutTeachersInput = {
    where: pass_reviewsScalarWhereInput
    data: XOR<pass_reviewsUpdateManyMutationInput, pass_reviewsUncheckedUpdateManyWithoutTeachersInput>
  }

  export type classesCreateWithoutTest_scoresInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsCreateNestedManyWithoutClassesInput
    teachers: teachersCreateNestedOneWithoutClassesInput
    label_change_logs?: label_change_logsCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutClassesInput
    students?: studentsCreateNestedManyWithoutClassesInput
  }

  export type classesUncheckedCreateWithoutTest_scoresInput = {
    class_id: number
    class_name: string
    course_id?: number
    teacher_id: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedCreateNestedManyWithoutClassesInput
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutClassesInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutClassesInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutClassesInput
    students?: studentsUncheckedCreateNestedManyWithoutClassesInput
  }

  export type classesCreateOrConnectWithoutTest_scoresInput = {
    where: classesWhereUniqueInput
    create: XOR<classesCreateWithoutTest_scoresInput, classesUncheckedCreateWithoutTest_scoresInput>
  }

  export type studentsCreateWithoutTest_scoresInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsCreateNestedManyWithoutStudentsInput
    classes: classesCreateNestedOneWithoutStudentsInput
  }

  export type studentsUncheckedCreateWithoutTest_scoresInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    class_id: number
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    label_change_logs?: label_change_logsUncheckedCreateNestedManyWithoutStudentsInput
    pass_reviews?: pass_reviewsUncheckedCreateNestedManyWithoutStudentsInput
    student_daily_records?: student_daily_recordsUncheckedCreateNestedManyWithoutStudentsInput
  }

  export type studentsCreateOrConnectWithoutTest_scoresInput = {
    where: studentsWhereUniqueInput
    create: XOR<studentsCreateWithoutTest_scoresInput, studentsUncheckedCreateWithoutTest_scoresInput>
  }

  export type classesUpsertWithoutTest_scoresInput = {
    update: XOR<classesUpdateWithoutTest_scoresInput, classesUncheckedUpdateWithoutTest_scoresInput>
    create: XOR<classesCreateWithoutTest_scoresInput, classesUncheckedCreateWithoutTest_scoresInput>
    where?: classesWhereInput
  }

  export type classesUpdateToOneWithWhereWithoutTest_scoresInput = {
    where?: classesWhereInput
    data: XOR<classesUpdateWithoutTest_scoresInput, classesUncheckedUpdateWithoutTest_scoresInput>
  }

  export type classesUpdateWithoutTest_scoresInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    teachers?: teachersUpdateOneRequiredWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutTest_scoresInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type studentsUpsertWithoutTest_scoresInput = {
    update: XOR<studentsUpdateWithoutTest_scoresInput, studentsUncheckedUpdateWithoutTest_scoresInput>
    create: XOR<studentsCreateWithoutTest_scoresInput, studentsUncheckedCreateWithoutTest_scoresInput>
    where?: studentsWhereInput
  }

  export type studentsUpdateToOneWithWhereWithoutTest_scoresInput = {
    where?: studentsWhereInput
    data: XOR<studentsUpdateWithoutTest_scoresInput, studentsUncheckedUpdateWithoutTest_scoresInput>
  }

  export type studentsUpdateWithoutTest_scoresInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutStudentsNestedInput
    classes?: classesUpdateOneRequiredWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateWithoutTest_scoresInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    class_id?: IntFieldUpdateOperationsInput | number
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type class_daily_snapshotsCreateManyClassesInput = {
    id?: bigint | number
    snapshot_date: Date | string
    completed_sessions?: number
    progress_pct?: Decimal | DecimalJsLike | number | string | null
    active_students?: number
    on_hold_students?: number
    dropped_students?: number
    transferred_students?: number
    attendance_avg?: Decimal | DecimalJsLike | number | string | null
    homework_avg?: Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: Decimal | DecimalJsLike | number | string | null
    label_yellow?: number
    label_red?: number
    label_grey?: number
    label_no_data?: number
    risk_pct?: Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: boolean
    health_status?: string | null
    scraped_at?: Date | string
  }

  export type label_change_logsCreateManyClassesInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type pass_reviewsCreateManyClassesInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type student_daily_recordsCreateManyClassesInput = {
    id?: bigint | number
    student_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type studentsCreateManyClassesInput = {
    student_id: number
    student_code?: string | null
    full_name: string
    phone?: string | null
    email?: string | null
    registration_status?: string
    admitted_at?: Date | string | null
    target_output_status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type test_scoresCreateManyClassesInput = {
    id?: bigint | number
    student_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type class_daily_snapshotsUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type class_daily_snapshotsUncheckedUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type class_daily_snapshotsUncheckedUpdateManyWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshot_date?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_sessions?: IntFieldUpdateOperationsInput | number
    progress_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    active_students?: IntFieldUpdateOperationsInput | number
    on_hold_students?: IntFieldUpdateOperationsInput | number
    dropped_students?: IntFieldUpdateOperationsInput | number
    transferred_students?: IntFieldUpdateOperationsInput | number
    attendance_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_chuan_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pass_mem_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    label_yellow?: IntFieldUpdateOperationsInput | number
    label_red?: IntFieldUpdateOperationsInput | number
    label_grey?: IntFieldUpdateOperationsInput | number
    label_no_data?: IntFieldUpdateOperationsInput | number
    risk_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_alarm_triggered?: BoolFieldUpdateOperationsInput | boolean
    health_status?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: studentsUpdateOneRequiredWithoutLabel_change_logsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutLabel_change_logsNestedInput
  }

  export type label_change_logsUncheckedUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUncheckedUpdateManyWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: studentsUpdateOneRequiredWithoutPass_reviewsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutPass_reviewsNestedInput
  }

  export type pass_reviewsUncheckedUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUncheckedUpdateManyWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: studentsUpdateOneRequiredWithoutStudent_daily_recordsNestedInput
  }

  export type student_daily_recordsUncheckedUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsUncheckedUpdateManyWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type studentsUpdateWithoutClassesInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateWithoutClassesInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutStudentsNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutStudentsNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutStudentsNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutStudentsNestedInput
  }

  export type studentsUncheckedUpdateManyWithoutClassesInput = {
    student_id?: IntFieldUpdateOperationsInput | number
    student_code?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    registration_status?: StringFieldUpdateOperationsInput | string
    admitted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    target_output_status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: studentsUpdateOneRequiredWithoutTest_scoresNestedInput
  }

  export type test_scoresUncheckedUpdateWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresUncheckedUpdateManyWithoutClassesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    student_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsCreateManyStudentsInput = {
    id?: bigint | number
    log_id?: string
    class_id: number
    teacher_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type pass_reviewsCreateManyStudentsInput = {
    id?: bigint | number
    review_id?: string
    class_id: number
    teacher_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type student_daily_recordsCreateManyStudentsInput = {
    id?: bigint | number
    class_id: number
    record_date: Date | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    attendance_present?: number | null
    attendance_total?: number | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    homework_done?: number | null
    homework_total?: number | null
    test_1?: Decimal | DecimalJsLike | number | string | null
    test_2?: Decimal | DecimalJsLike | number | string | null
    test_3?: Decimal | DecimalJsLike | number | string | null
    test_4?: Decimal | DecimalJsLike | number | string | null
    test_5?: Decimal | DecimalJsLike | number | string | null
    test_6?: Decimal | DecimalJsLike | number | string | null
    tests_taken?: number | null
    test_average?: Decimal | DecimalJsLike | number | string | null
    current_label?: string | null
    previous_label?: string | null
    benchmark_label?: string | null
    has_label_changed?: boolean | null
    label_change_direction?: string | null
    last_checkpoint?: string | null
    pass_chuan_status?: string | null
    pass_chuan_reasons?: string | null
    pass_mem_status?: string | null
    pass_mem_group?: string | null
    pass_mem_label?: string | null
    flag_attendance_drop?: boolean | null
    flag_homework_drop?: boolean | null
    flag_cheating?: boolean | null
    flag_needs_review?: boolean | null
    teacher_feedback_btvn?: string | null
    teacher_feedback_orient?: string | null
    teacher_note?: string | null
    teacher_temp_label?: string | null
    scraped_at?: Date | string
  }

  export type test_scoresCreateManyStudentsInput = {
    id?: bigint | number
    class_id: number
    test_order: number
    test_name: string
    raw_score?: Decimal | DecimalJsLike | number | string | null
    max_score?: Decimal | DecimalJsLike | number | string | null
    grade_percent?: Decimal | DecimalJsLike | number | string | null
    is_makeup?: boolean
    makeup_score?: Decimal | DecimalJsLike | number | string | null
    final_score?: Decimal | DecimalJsLike | number | string | null
    grade_status?: string | null
    is_cheating?: boolean
    grade_note?: string | null
    label_at_time?: string | null
    scraped_at?: Date | string
    created_at?: Date | string
  }

  export type label_change_logsUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutLabel_change_logsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutLabel_change_logsNestedInput
  }

  export type label_change_logsUncheckedUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUncheckedUpdateManyWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutPass_reviewsNestedInput
    teachers?: teachersUpdateOneRequiredWithoutPass_reviewsNestedInput
  }

  export type pass_reviewsUncheckedUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUncheckedUpdateManyWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    class_id?: IntFieldUpdateOperationsInput | number
    teacher_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutStudent_daily_recordsNestedInput
  }

  export type student_daily_recordsUncheckedUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type student_daily_recordsUncheckedUpdateManyWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    record_date?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_present?: NullableIntFieldUpdateOperationsInput | number | null
    attendance_total?: NullableIntFieldUpdateOperationsInput | number | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_done?: NullableIntFieldUpdateOperationsInput | number | null
    homework_total?: NullableIntFieldUpdateOperationsInput | number | null
    test_1?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_2?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_3?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_4?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_5?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    test_6?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tests_taken?: NullableIntFieldUpdateOperationsInput | number | null
    test_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    current_label?: NullableStringFieldUpdateOperationsInput | string | null
    previous_label?: NullableStringFieldUpdateOperationsInput | string | null
    benchmark_label?: NullableStringFieldUpdateOperationsInput | string | null
    has_label_changed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    label_change_direction?: NullableStringFieldUpdateOperationsInput | string | null
    last_checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_chuan_reasons?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_status?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_group?: NullableStringFieldUpdateOperationsInput | string | null
    pass_mem_label?: NullableStringFieldUpdateOperationsInput | string | null
    flag_attendance_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_homework_drop?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_cheating?: NullableBoolFieldUpdateOperationsInput | boolean | null
    flag_needs_review?: NullableBoolFieldUpdateOperationsInput | boolean | null
    teacher_feedback_btvn?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_feedback_orient?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_note?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_temp_label?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutTest_scoresNestedInput
  }

  export type test_scoresUncheckedUpdateWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type test_scoresUncheckedUpdateManyWithoutStudentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    class_id?: IntFieldUpdateOperationsInput | number
    test_order?: IntFieldUpdateOperationsInput | number
    test_name?: StringFieldUpdateOperationsInput | string
    raw_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_percent?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    is_makeup?: BoolFieldUpdateOperationsInput | boolean
    makeup_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    final_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    grade_status?: NullableStringFieldUpdateOperationsInput | string | null
    is_cheating?: BoolFieldUpdateOperationsInput | boolean
    grade_note?: NullableStringFieldUpdateOperationsInput | string | null
    label_at_time?: NullableStringFieldUpdateOperationsInput | string | null
    scraped_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type classesCreateManyTeachersInput = {
    class_id: number
    class_name: string
    course_id?: number
    lead_email?: string | null
    status?: string
    schedule?: string | null
    location?: string | null
    opening_date: Date | string
    ending_date?: Date | string | null
    total_sessions?: number
    portal_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type label_change_logsCreateManyTeachersInput = {
    id?: bigint | number
    log_id?: string
    student_id: number
    class_id: number
    from_label: string
    to_label: string
    direction: string
    severity?: string | null
    step_count?: number | null
    reason?: string | null
    checkpoint?: string | null
    test_average_after?: Decimal | DecimalJsLike | number | string | null
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    email_sent?: boolean | null
    email_sent_at?: Date | string | null
    created_at?: Date | string
  }

  export type pass_reviewsCreateManyTeachersInput = {
    id?: bigint | number
    review_id?: string
    student_id: number
    class_id: number
    pass_mem_group: string
    test_average: Decimal | DecimalJsLike | number | string
    attendance_pct?: Decimal | DecimalJsLike | number | string | null
    homework_pct?: Decimal | DecimalJsLike | number | string | null
    review_status?: string
    teacher_decision?: string | null
    teacher_comment?: string | null
    confirmed_at?: Date | string | null
    deadline: Date | string
    is_overdue?: boolean
    escalated_to_lead?: boolean
    lead_email_sent?: boolean
    created_at?: Date | string
  }

  export type classesUpdateWithoutTeachersInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUpdateManyWithoutClassesNestedInput
    students?: studentsUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateWithoutTeachersInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    class_daily_snapshots?: class_daily_snapshotsUncheckedUpdateManyWithoutClassesNestedInput
    label_change_logs?: label_change_logsUncheckedUpdateManyWithoutClassesNestedInput
    pass_reviews?: pass_reviewsUncheckedUpdateManyWithoutClassesNestedInput
    student_daily_records?: student_daily_recordsUncheckedUpdateManyWithoutClassesNestedInput
    students?: studentsUncheckedUpdateManyWithoutClassesNestedInput
    test_scores?: test_scoresUncheckedUpdateManyWithoutClassesNestedInput
  }

  export type classesUncheckedUpdateManyWithoutTeachersInput = {
    class_id?: IntFieldUpdateOperationsInput | number
    class_name?: StringFieldUpdateOperationsInput | string
    course_id?: IntFieldUpdateOperationsInput | number
    lead_email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    schedule?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    ending_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_sessions?: IntFieldUpdateOperationsInput | number
    portal_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUpdateWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutLabel_change_logsNestedInput
    students?: studentsUpdateOneRequiredWithoutLabel_change_logsNestedInput
  }

  export type label_change_logsUncheckedUpdateWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type label_change_logsUncheckedUpdateManyWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    log_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    from_label?: StringFieldUpdateOperationsInput | string
    to_label?: StringFieldUpdateOperationsInput | string
    direction?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    step_count?: NullableIntFieldUpdateOperationsInput | number | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    checkpoint?: NullableStringFieldUpdateOperationsInput | string | null
    test_average_after?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    email_sent?: NullableBoolFieldUpdateOperationsInput | boolean | null
    email_sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUpdateWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    classes?: classesUpdateOneRequiredWithoutPass_reviewsNestedInput
    students?: studentsUpdateOneRequiredWithoutPass_reviewsNestedInput
  }

  export type pass_reviewsUncheckedUpdateWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type pass_reviewsUncheckedUpdateManyWithoutTeachersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    review_id?: StringFieldUpdateOperationsInput | string
    student_id?: IntFieldUpdateOperationsInput | number
    class_id?: IntFieldUpdateOperationsInput | number
    pass_mem_group?: StringFieldUpdateOperationsInput | string
    test_average?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    attendance_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    homework_pct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    review_status?: StringFieldUpdateOperationsInput | string
    teacher_decision?: NullableStringFieldUpdateOperationsInput | string | null
    teacher_comment?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    is_overdue?: BoolFieldUpdateOperationsInput | boolean
    escalated_to_lead?: BoolFieldUpdateOperationsInput | boolean
    lead_email_sent?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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