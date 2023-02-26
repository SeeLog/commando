import * as assert from 'assert';
import { format } from '../../util';

suite('Utilities test', () => {
  test('Make sure format with valueObj', () => {
    assert.strictEqual(format('Hello ${name}', { name: 'SeeLog' }), 'Hello SeeLog');
  });
});
