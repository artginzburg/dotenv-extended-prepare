export const filterObject = <T extends object>(obj: T, predicate: (key: keyof T) => boolean) => !!obj && Object.keys(obj).forEach((k) => {
  if (!predicate(obj[k])) {
    delete obj[k];
  }
});
