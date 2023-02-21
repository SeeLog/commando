import * as assert from 'assert';
import { defaultConfig } from '../../interface';

suite('Interface Test Suite', () => {
  test('Make sure defaultConfig is IConfig', () => {
    assert.strictEqual(typeof defaultConfig.autoClear, 'boolean');
    assert.strictEqual(typeof defaultConfig.runOnTerminal, 'boolean');
    assert.strictEqual(Array.isArray(defaultConfig.commands), true);
  });
});
