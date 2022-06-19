export function envStringifyInit<T>(envObj: Record<string, T>, preserveValues = false) {
  let string = '';

  for (const key in envObj) {
    if (key) {
      if (envObj[key] && !preserveValues) {
        string += '# ';
      }

      string += `${key}${key.startsWith('#') ? '' : '='}${preserveValues ? envObj[key] : ''}\n`;
    }
  }

  return string.trim();
}
