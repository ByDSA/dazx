export type OptionalPropertyOf<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>

export type ExtractOptionalPropsAsRequired<T extends object> = keyof Pick<
  T,
  OptionalPropertyOf<T>
> extends never
  ? never
  : Required<Pick<T, OptionalPropertyOf<T>>>;