function envStringifyInit(envObj) {
  let string = '';

  for (const key in envObj) {
    if (key) {
      if (envObj[key]) {
        string += '# ';
      }

      string += `${key}${key[0] === '#' ? '' : '='}\n`;
    }
  }

  return string.trim();
}

module.exports = {
  envStringifyInit,
};
