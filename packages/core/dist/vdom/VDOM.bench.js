import { bench, describe } from 'vitest';
import { constructElement } from './VDOM.js';
describe('VDOM', () => {
    bench('constructElement 500 nodes', () => {
        for (let i = 0; i < 500; i++) {
            constructElement({ tag: 'div', props: { class: `n${i}` } });
        }
    });
});
//# sourceMappingURL=VDOM.bench.js.map