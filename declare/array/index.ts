/* eslint-disable no-extend-native */
export {};

if (!(Array.prototype as any).findLast) {
  (Array.prototype as any).findLast = function(callback: (value: any, index: number, array: any[]) => unknown) {
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    const arr = Object(this);
    const len = arr.length >>> 0;
    for (let i = len - 1; i >= 0; i--) {
      if (callback(arr[i], i, arr)) {
        return arr[i];
      }
    }
    return undefined;
  };
}
