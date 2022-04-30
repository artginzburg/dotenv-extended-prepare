const setAll = (obj, val) => !!obj && Object.keys(obj).forEach((k) => { obj[k] = val; });

module.exports = {
  setAll,
};
