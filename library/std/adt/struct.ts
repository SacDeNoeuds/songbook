import { flow, pipe } from "../functions"
import type { Simplify, ToNumber, UnionToIntersection } from "../types"
import { iterable as I } from "./iterable"

type AnyStruct = Record<string, any>

export namespace struct {
  export const values: <S extends AnyStruct>(struct: S) => S[keyof S] =
    Object.values

  export const entries: <S extends AnyStruct>(
    struct: S,
  ) => [keyof S, S[keyof S]][] = Object.entries

  export const fromEntries: <S extends AnyStruct>(
    entries: Iterable<[keyof S, S[keyof S]]>,
  ) => S = Object.fromEntries

  export const keys: <S extends AnyStruct>(struct: S) => Array<keyof S> =
    Object.getOwnPropertyNames as any

  export const has =
    <P extends string>(property: P) =>
    <S extends AnyStruct>(struct: S): struct is S & { [Key in P]: unknown } =>
      Object.hasOwn(struct, property)

  export const rename =
    <S extends AnyStruct, Prev extends keyof S, Next extends string>(
      prev: Prev,
      next: Next,
    ) =>
    (struct: S) =>
      pipe(struct, omit(prev), concat({ [next]: struct[prev] })) as Omit<
        S,
        Prev
      > & { [Key in Next]: S[Prev] }

  type Mapper<Struct extends AnyStruct, Output> = <K extends keyof Struct>(
    value: Struct[K],
    key: K,
  ) => Output
  type Predicate<Struct extends AnyStruct> = Mapper<Struct, unknown>
  const toEntryPredicate =
    <S extends AnyStruct>(predicate: Predicate<S>) =>
    (entry: [key: string, value: unknown]) =>
      predicate(entry[1] as any, entry[0])

  export const concat =
    <S2 extends AnyStruct>(s2: S2) =>
    <S1 extends AnyStruct>(s1: S1): S1 & S2 => ({ ...s1, ...s2 })

  export const assignTo =
    <Key extends string, Value>(key: Key) =>
    (value: Value) =>
      ({ [key]: value } as { [K in Key]: Value })

  export const some = <S extends AnyStruct>(predicate: Predicate<S>) =>
    flow(entries, I.some(toEntryPredicate(predicate)))

  export const every = <S extends AnyStruct>(predicate: Predicate<S>) =>
    flow(entries, I.every(toEntryPredicate(predicate)))

  export const reduce = <S extends AnyStruct, O>(
    initial: O,
    reducer: <K extends keyof S>(acc: O, value: S[K], key: K) => O,
  ) =>
    flow(
      entries<S>,
      I.reduce(initial, (acc, [key, value]: any) => reducer(acc, value, key)),
    )

  export const map = <S extends AnyStruct, Output>(mapper: Mapper<S, Output>) =>
    reduce<S, Record<keyof S, Output>>({} as any, (acc, value, key) =>
      Object.assign(acc, { [key]: mapper(value, key) }),
    )

  export const filter = <S extends AnyStruct>(predicate: Predicate<S>) =>
    flow(entries, I.filter(toEntryPredicate(predicate)) as any, fromEntries<S>)

  export const omit = <S extends AnyStruct, Key extends keyof S>(
    ...keys: Key[]
  ) =>
    filter<S>((_, key) => !keys.includes(key as any)) as (
      struct: S,
    ) => Omit<S, Key>

  export const pick = <S extends AnyStruct, Key extends keyof S>(
    ...keys: Key[]
  ) =>
    filter<S>((_, key) => keys.includes(key as any)) as (
      struct: S,
    ) => Pick<S, Key>

  export const get =
    <S extends AnyStruct, K extends keyof S>(key: K) =>
    (struct: S): S[K] =>
      struct[key]

  export const findFirstMap: <S extends AnyStruct, Output>(
    mapper: Mapper<S, Output | undefined>,
  ) => (struct: S) => Output | undefined = (mapper: any) =>
    flow(
      entries,
      I.findFirstMap(([key, value]) => mapper(value as any, key as any)),
    )

  export type TupleKey<T extends any[]> = ToNumber<
    Exclude<keyof T, keyof any[]>
  >

  export type StructFromTuple<
    Names extends string[],
    Tuple extends { [Key in TupleKey<Names>]: any },
  > = Simplify<
    UnionToIntersection<
      {
        [Name in TupleKey<Names>]: { [Key in Names[Name]]: Tuple[Name] }
      }[TupleKey<Names>]
    >
  >

  export const fromTuple =
    <Names extends [string, ...string[]]>(...names: Names) =>
    <Tuple extends { [Key in TupleKey<Names>]: any }>(
      tuple: Tuple,
    ): StructFromTuple<Names, Tuple> => {
      return Object.assign(
        {},
        ...names.map((name, index) => ({
          [name]: tuple[index as keyof Tuple],
        })),
      )
    }

  export function indexBy<T, Key extends PropertyKey>(
    mapIndex: (item: T) => Key,
  ) {
    return (array: readonly T[]) =>
      Object.fromEntries(array.map((item) => [mapIndex(item), item])) as Record<
        Key,
        T
      >
  }

  /** `C` stands for `Curried` */
  export const foldBy =
    <Discriminant extends PropertyKey>(
      discriminant: Discriminant,
    ): FoldBy<Discriminant> =>
    (cases) =>
    (value) => {
      const discriminator = value[discriminant]
      return cases[discriminator](value as any)
    }

  export const matchBy =
    <Discriminant extends PropertyKey>(
      discriminant: Discriminant,
    ): MatchBy<Discriminant> =>
    (value, cases) => {
      const discriminator = value[discriminant]
      return cases[discriminator](value as any)
    }

  /** `C` stands for `Curried` */
  export const foldByOr: MatchByOrC = (discriminant) => (cases) => (value) => {
    const discriminator = value[discriminant]
    return (cases[discriminator] ?? cases._)(value as any)
  }

  export const matchByOr: MatchByOr = (discriminant) => (value, cases) => {
    const discriminator = value[discriminant]
    return (cases[discriminator] ?? cases._)(value as any)
  }

  export type FoldBy<Discriminant extends PropertyKey> = <
    I extends { [Key in Discriminant]: string | number },
    Cases extends {
      [Case in I[Discriminant]]: (
        value: Extract<I, { [Key in Discriminant]: Case }>,
      ) => any
    },
  >(
    cases: Cases,
  ) => (value: I) => ReturnType<Cases[keyof Cases]>

  export type MatchBy<Discriminant extends PropertyKey> = <
    I extends { [Key in Discriminant]: string },
    Cases extends {
      [Case in I[Discriminant]]: (
        value: Extract<I, { [Key in Discriminant]: Case }>,
      ) => any
    },
  >(
    value: I,
    cases: Cases,
  ) => { [Key in keyof Cases]: ReturnType<Cases[Key]> }[keyof Cases]

  type MatchByOrC = <Discriminant extends PropertyKey>(
    discriminant: Discriminant,
  ) => <
    I extends { [Key in Discriminant]: string | number },
    Cases extends {
      [Case in I[Discriminant]]?: (
        value: Extract<I, { [Key in Discriminant]: Case }>,
      ) => any
    } & { [Key in "_"]: (input: I) => any },
  >(
    cases: Cases,
  ) => (value: I) => {
    [Key in keyof Cases]: ReturnType<NonNullable<Cases[Key]>>
  }[keyof Cases]

  type MatchByOr = <Discriminant extends PropertyKey>(
    discriminant: Discriminant,
  ) => <
    I extends { [Key in Discriminant]: string | number },
    Cases extends {
      [Case in I[Discriminant]]?: (
        value: Extract<I, { [Key in Discriminant]: Case }>,
      ) => any
    } & { [Key in "_"]: (input: I) => any },
  >(
    value: I,
    cases: Cases,
  ) => {
    [Key in keyof Cases]: ReturnType<NonNullable<Cases[Key]>>
  }[keyof Cases]
}
