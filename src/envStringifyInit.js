function envStringifyInit(envObj, preserveValues = false) {
  let string = '';

  for (const key in envObj) {
    if (key) {
      if (envObj[key] && !preserveValues) {
        string += '# ';
      }

      string += `${key}${key[0] === '#' ? '' : '='}${preserveValues ? envObj[key] : ''}\n`;
    }
  }

  return string.trim();
}

module.exports = {
  envStringifyInit,
};
