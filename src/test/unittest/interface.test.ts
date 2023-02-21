import * as assert from 'assert';
import { defaultConfig } from '../../interface';

describe('Interface Test', () => {
  it('should satisfy IConfig structure', () => {
    assert.strictEqual(typeof defaultConfig.autoClear, 'boolean');
    assert.strictEqual(typeof defaultConfig.runOnTerminal, 'boolean');
    assert.strictEqual(Array.isArray(defaultConfig.commands), true);
  });
});
