import test from 'ava';

import { setAll } from './setAll';

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
  // @ts-expect-error TS should check this, but it's valid in JS, hence the test.
  setAll(objectToMutate, valueToSet);

  t.is(objectToMutate, undefined);
});
