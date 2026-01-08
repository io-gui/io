import { describe, it, expect } from 'vitest';
import { getEditorGroups, getAllPropertyNames, registerEditorGroups, SKIPPED_PROPERTIES } from '@io-gui/editors';
describe('EditorGroups', () => {
    describe('getAllPropertyNames', () => {
        it('should return own property names of an object', () => {
            const obj = { foo: 1, bar: 'hello', baz: true };
            const props = getAllPropertyNames(obj);
            expect(props).toContain('foo');
            expect(props).toContain('bar');
            expect(props).toContain('baz');
        });
        it('should return inherited property names from prototype chain', () => {
            class Parent {
                parentProp = 'parent';
                parentMethod() { return 'parent'; }
            }
            class Child extends Parent {
                childProp = 'child';
                childMethod() { return 'child'; }
            }
            const obj = new Child();
            const props = getAllPropertyNames(obj);
            expect(props).toContain('parentProp');
            expect(props).toContain('childProp');
            expect(props).toContain('parentMethod');
            expect(props).toContain('childMethod');
        });
        it('should not include skipped properties', () => {
            const obj = { foo: 1 };
            const props = getAllPropertyNames(obj);
            for (const skipped of SKIPPED_PROPERTIES) {
                expect(props).not.toContain(skipped);
            }
        });
        it('should not include duplicate properties', () => {
            class Parent {
                sharedProp = 'parent';
            }
            class Child extends Parent {
                sharedProp = 'child';
            }
            const obj = new Child();
            const props = getAllPropertyNames(obj);
            const sharedPropCount = props.filter(p => p === 'sharedProp').length;
            expect(sharedPropCount).toBe(1);
        });
    });
    describe('getEditorGroups', () => {
        it('should return groups record with Main group', () => {
            const obj = { foo: 1 };
            const groups = getEditorGroups(obj, {});
            expect(groups).toBeDefined();
            expect(groups.Main).toBeDefined();
            expect(Array.isArray(groups.Main)).toBe(true);
        });
        it('should place ungrouped properties in Main group', () => {
            const obj = { foo: 1, bar: 'hello' };
            const groups = getEditorGroups(obj, {});
            expect(groups.Main).toContain('foo');
            expect(groups.Main).toContain('bar');
        });
        it('should preserve explicit property order as defined in groups', () => {
            const obj = { alpha: 1, beta: 2, gamma: 3, delta: 4 };
            const propertyGroups = {
                Main: ['delta', 'beta', 'alpha', 'gamma']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Main[0]).toBe('delta');
            expect(groups.Main[1]).toBe('beta');
            expect(groups.Main[2]).toBe('alpha');
            expect(groups.Main[3]).toBe('gamma');
        });
        it('should preserve order when properties are defined in different order than object', () => {
            const obj = { z: 1, a: 2, m: 3 };
            const propertyGroups = {
                Main: ['a', 'm', 'z']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Main.indexOf('a')).toBeLessThan(groups.Main.indexOf('m'));
            expect(groups.Main.indexOf('m')).toBeLessThan(groups.Main.indexOf('z'));
        });
        it('should support multiple custom groups', () => {
            const obj = { foo: 1, bar: 2, baz: 3, qux: 4 };
            const propertyGroups = {
                GroupA: ['foo', 'bar'],
                GroupB: ['baz', 'qux']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.GroupA).toContain('foo');
            expect(groups.GroupA).toContain('bar');
            expect(groups.GroupB).toContain('baz');
            expect(groups.GroupB).toContain('qux');
        });
        it('should match properties using regex patterns', () => {
            const obj = {
                _privateFoo: 1,
                _privateBar: 2,
                publicBaz: 3
            };
            const propertyGroups = {
                Private: [/^_private/]
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Private).toContain('_privateFoo');
            expect(groups.Private).toContain('_privateBar');
            expect(groups.Private).not.toContain('publicBaz');
        });
        it('should place regex-matched properties after explicit properties', () => {
            const obj = {
                _item1: 1,
                _item2: 2,
                explicitFirst: 3,
                _item3: 4
            };
            const propertyGroups = {
                Items: ['explicitFirst', /^_item/]
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Items[0]).toBe('explicitFirst');
            expect(groups.Items).toContain('_item1');
            expect(groups.Items).toContain('_item2');
            expect(groups.Items).toContain('_item3');
        });
        it('should move properties to Hidden group', () => {
            const obj = { visible: 1, hidden: 2 };
            const propertyGroups = {
                Hidden: ['hidden']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Hidden).toContain('hidden');
            expect(groups.Main).not.toContain('hidden');
            expect(groups.Main).toContain('visible');
        });
        it('should not include functions in groups unless explicitly added', () => {
            const obj = {
                value: 42,
                method: function () { return 'hello'; }
            };
            const groups = getEditorGroups(obj, {});
            expect(groups.Main).toContain('value');
            expect(groups.Main).not.toContain('method');
        });
        it('should include explicitly added functions', () => {
            const obj = {
                value: 42,
                action: function () { return 'action'; }
            };
            const propertyGroups = {
                Main: ['value', 'action']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Main).toContain('value');
            expect(groups.Main).toContain('action');
        });
        it('should not include same property in multiple groups', () => {
            const obj = { shared: 1, other: 2 };
            const propertyGroups = {
                GroupA: ['shared'],
                GroupB: ['shared']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            const allGroups = Object.values(groups).flat();
            const sharedCount = allGroups.filter(p => p === 'shared').length;
            expect(sharedCount).toBe(1);
        });
        it('should remove duplicates within the same group', () => {
            const obj = { foo: 1 };
            const propertyGroups = {
                Main: ['foo', 'foo', 'foo']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            const fooCount = groups.Main.filter(p => p === 'foo').length;
            expect(fooCount).toBe(1);
        });
        it('should only include properties that exist on the object', () => {
            const obj = { exists: 1 };
            const propertyGroups = {
                Main: ['exists', 'doesNotExist']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Main).toContain('exists');
            expect(groups.Main).not.toContain('doesNotExist');
        });
        it('should keep Advanced group at the end', () => {
            const obj = { _advanced: 1, main: 2, other: 3 };
            const propertyGroups = {
                Other: ['other']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            const groupKeys = Object.keys(groups);
            expect(groupKeys[groupKeys.length - 1]).toBe('Advanced');
        });
        it('should match double underscore properties to Hidden via regex', () => {
            const obj = { __hidden: 1, visible: 2 };
            const groups = getEditorGroups(obj, {});
            expect(groups.Hidden).toContain('__hidden');
            expect(groups.Main).not.toContain('__hidden');
        });
        it('should match single underscore properties to Advanced via regex', () => {
            const obj = { _advanced: 1, visible: 2 };
            const groups = getEditorGroups(obj, {});
            expect(groups.Advanced).toContain('_advanced');
            expect(groups.Main).not.toContain('_advanced');
        });
        it('should not match single underscore regex if property is explicitly grouped', () => {
            const obj = { _customProp: 1, visible: 2 };
            const propertyGroups = {
                Custom: ['_customProp']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Custom).toContain('_customProp');
            expect(groups.Advanced).not.toContain('_customProp');
        });
        it('should work with arrays', () => {
            const arr = [1, 2, 3];
            const groups = getEditorGroups(arr, {});
            expect(groups.Main).toContain('0');
            expect(groups.Main).toContain('1');
            expect(groups.Main).toContain('2');
            expect(groups.Hidden).toContain('length');
        });
        it('should work with empty object', () => {
            const obj = {};
            const groups = getEditorGroups(obj, {});
            expect(groups).toBeDefined();
            expect(groups.Main).toBeDefined();
        });
        it('should handle complex inheritance chains', () => {
            class GrandParent {
                grandParentProp = 1;
            }
            class Parent extends GrandParent {
                parentProp = 2;
            }
            class Child extends Parent {
                childProp = 3;
            }
            const obj = new Child();
            const propertyGroups = {
                Main: ['childProp', 'parentProp', 'grandParentProp']
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Main[0]).toBe('childProp');
            expect(groups.Main[1]).toBe('parentProp');
            expect(groups.Main[2]).toBe('grandParentProp');
        });
        it('should handle mixed explicit and regex identifiers preserving order', () => {
            const obj = {
                first: 1,
                _regex1: 2,
                second: 3,
                _regex2: 4,
                third: 5
            };
            const propertyGroups = {
                Ordered: ['first', 'second', 'third', /^_regex/]
            };
            const groups = getEditorGroups(obj, propertyGroups);
            expect(groups.Ordered[0]).toBe('first');
            expect(groups.Ordered[1]).toBe('second');
            expect(groups.Ordered[2]).toBe('third');
            expect(groups.Ordered).toContain('_regex1');
            expect(groups.Ordered).toContain('_regex2');
        });
    });
    describe('registerEditorGroups', () => {
        it('should be defined', () => {
            expect(registerEditorGroups).toBeDefined();
        });
        it('should register groups for a custom class', () => {
            class CustomClass {
                customProp = 1;
                otherProp = 2;
            }
            registerEditorGroups(CustomClass, {
                Custom: ['customProp']
            });
            const obj = new CustomClass();
            const groups = getEditorGroups(obj, {});
            expect(groups.Custom).toContain('customProp');
        });
        it('should extend existing groups for a class', () => {
            class ExtendableClass {
                prop1 = 1;
                prop2 = 2;
                prop3 = 3;
            }
            registerEditorGroups(ExtendableClass, {
                GroupA: ['prop1']
            });
            registerEditorGroups(ExtendableClass, {
                GroupA: ['prop2']
            });
            const obj = new ExtendableClass();
            const groups = getEditorGroups(obj, {});
            expect(groups.GroupA).toContain('prop1');
            expect(groups.GroupA).toContain('prop2');
        });
        it('should register multiple groups at once', () => {
            class MultiGroupClass {
                a = 1;
                b = 2;
                c = 3;
            }
            registerEditorGroups(MultiGroupClass, {
                GroupX: ['a'],
                GroupY: ['b'],
                GroupZ: ['c']
            });
            const obj = new MultiGroupClass();
            const groups = getEditorGroups(obj, {});
            expect(groups.GroupX).toContain('a');
            expect(groups.GroupY).toContain('b');
            expect(groups.GroupZ).toContain('c');
        });
        it('should support regex in registered groups', () => {
            class RegexGroupClass {
                _internal1 = 1;
                _internal2 = 2;
                external = 3;
            }
            registerEditorGroups(RegexGroupClass, {
                Internal: [/^_internal/]
            });
            const obj = new RegexGroupClass();
            const groups = getEditorGroups(obj, {});
            expect(groups.Internal).toContain('_internal1');
            expect(groups.Internal).toContain('_internal2');
            expect(groups.Internal).not.toContain('external');
        });
    });
    describe('SKIPPED_PROPERTIES', () => {
        it('should be defined', () => {
            expect(SKIPPED_PROPERTIES).toBeDefined();
            expect(Array.isArray(SKIPPED_PROPERTIES)).toBe(true);
        });
        it('should include common DOM/Node constants', () => {
            expect(SKIPPED_PROPERTIES).toContain('ELEMENT_NODE');
            expect(SKIPPED_PROPERTIES).toContain('DOCUMENT_NODE');
        });
        it('should include event handlers', () => {
            expect(SKIPPED_PROPERTIES).toContain('onclick');
            expect(SKIPPED_PROPERTIES).toContain('onchange');
            expect(SKIPPED_PROPERTIES).toContain('onfocus');
        });
    });
});
//# sourceMappingURL=EditorGroups.test.js.map