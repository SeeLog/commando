import * as assert from 'assert';
import { format } from '../../util';

suite('Util test', () => {
  test('Make sure format with valueObj', () => {
    assert.strictEqual(format('Hello ${name}', { name: 'SeeLog' }), 'Hello SeeLog');
    assert.strictEqual(format('Hello ${name} ${name}', { name: 'SeeLog' }), 'Hello SeeLog SeeLog');
    assert.strictEqual(format('Hello ${firstName} ${lastName}', { firstName: 'See', lastName: 'Log' }), 'Hello See Log');
  });
  test('Allow to use key not defined in template', () => {
    assert.strictEqual(format('Hello ${name}', { name: 'SeeLog', hoge: 'hoge' }), 'Hello SeeLog');
  });
  test('Make sure throw error when valueObj is not satisfied format args', () => {
    assert.throws(() => format('Hello ${name}', {}), Error);
    assert.throws(() => format('Hello ${name}', { hoge: 'hoge'}), Error);
  });
});
