import * as assert from 'assert';
import { getOutputChannel } from '../../logger';

suite('Logger test', function () {
  test('getOutputChannel', () => {
    assert.strictEqual(getOutputChannel('test'), getOutputChannel('test'));
    assert.notStrictEqual(getOutputChannel('test'), getOutputChannel('test2'));
  });
});
