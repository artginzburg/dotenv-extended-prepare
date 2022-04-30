const test = require('ava').default;

const { setAll } = require('./setAll');

test('sets all keys of an object to the same value', (t) => {
  const objectToMutate = {
    first: 'anything',
    second: 'different',
    third: 3,
    fourth: undefined,
  };
  const valueToSet = 'same';
  setAll(objectToMutate, valueToSet);

  t.deepEqual(objectToMutate, {
    first: valueToSet,
    second: valueToSet,
    third: valueToSet,
    fourth: valueToSet,
  });
});

test("ignores (doesn't throw on) undefined", (t) => {
  const objectToMutate = undefined;
  const valueToSet = 'same';
  setAll(objectToMutate, valueToSet);

  t.is(objectToMutate, undefined);
});
