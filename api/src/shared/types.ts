/**
 * Given an array or partial interface, exclude an empty set from the acceptable values.
 */
export type NonEmpty<T> = T extends Array<infer U>
  ? [U, ...U[]]
  : T &
      {
        [K in keyof T]: { [_ in K]-?: T[K] };
      }[keyof T];
