export {};
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T | undefined;
  }
}
