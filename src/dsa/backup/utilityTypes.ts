export type OptionalPropertyOf<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>;

export type PickOptional<T extends object> = Pick<T, OptionalPropertyOf<T>>;

export type ExtractOptionalPropsAsRequired<T extends object> = Required<PickOptional<T>>;