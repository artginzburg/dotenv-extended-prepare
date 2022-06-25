// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const setAll = <T, Val>(obj: Record<string, T | Val>, val: Val) => !!obj && Object.keys(obj).forEach((k) => { obj[k] = val; });
