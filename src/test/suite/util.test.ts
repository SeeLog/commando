import * as assert from 'assert';
import { fmt } from '../../util';

suite('Util test', () => {
  test('Make sure format with valueObj', () => {
    assert.strictEqual(fmt('Hello ${name}', { name: 'SeeLog' }), 'Hello SeeLog');
    assert.strictEqual(fmt('Hello ${name} ${name}', { name: 'SeeLog' }), 'Hello SeeLog SeeLog');
    assert.strictEqual(fmt('Hello ${firstName} ${lastName}', { firstName: 'See', lastName: 'Log' }), 'Hello See Log');
  });
  test('Allow to use key not defined in template', () => {
    assert.strictEqual(fmt('Hello ${name}', { name: 'SeeLog', hoge: 'hoge' }), 'Hello SeeLog');
  });
  test('Make sure throw error when valueObj is not satisfied format args', () => {
    assert.throws(() => fmt('Hello ${name}', {}), Error);
    assert.throws(() => fmt('Hello ${name}', { hoge: 'hoge' }), Error);
  });
});
