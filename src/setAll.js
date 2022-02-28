const setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));

module.exports = {
  setAll,
};
