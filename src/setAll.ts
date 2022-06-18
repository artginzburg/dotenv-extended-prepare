export const setAll = <T>(obj: Record<string, T>, val) => !!obj && Object.keys(obj).forEach((k) => { obj[k] = val; });
