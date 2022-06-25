// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const filterObject = <T extends Record<PropertyKey, PropertyKey>>(obj: T, predicate: (key: keyof T) => boolean) => !!obj && Object.keys(obj).forEach((k) => {
  if (!predicate(obj[k])) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete obj[k];
  }
});
