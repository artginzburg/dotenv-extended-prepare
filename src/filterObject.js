function filterObject(obj, predicate) {
  !!obj && Object.keys(obj).forEach((k) => {
    if (!predicate(obj[k])) {
      delete obj[k];
    }
  });
}

module.exports = {
  filterObject,
};
