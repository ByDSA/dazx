export type OptionalPropertiesOf<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>

export type ExtractOptionalPropsAsRequired<T extends object> = keyof Pick<
  T,
  OptionalPropertiesOf<T>
> extends never
  ? never
  : Required<Pick<T, OptionalPropertiesOf<T>>>;