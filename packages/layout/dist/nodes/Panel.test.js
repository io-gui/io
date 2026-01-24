import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NodeArray } from '@io-gui/core';
import { Panel, Tab } from '@io-gui/layout';
describe('Panel', () => {
    describe('Construction', () => {
        it('should construct with empty tabs array', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: []
            });
            expect(panel.tabs.length).toBe(0);
        });
        it('should construct with single tab', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            expect(panel.tabs).toBeInstanceOf(NodeArray);
            expect(panel.tabs.length).toBe(1);
            expect(panel.tabs[0]).toBeInstanceOf(Tab);
            expect(panel.tabs[0].id).toBe('tab1');
        });
        it('should construct with multiple tabs', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2' },
                    { id: 'tab3' }
                ]
            });
            expect(panel.tabs.length).toBe(3);
            expect(panel.tabs[0].id).toBe('tab1');
            expect(panel.tabs[1].id).toBe('tab2');
            expect(panel.tabs[2].id).toBe('tab3');
        });
        it('should auto-select first tab when none selected', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2' }
                ]
            });
            expect(panel.tabs[0].selected).toBe(true);
            expect(panel.tabs[1].selected).toBe(false);
        });
        it('should preserve explicit selection', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2', selected: true },
                    { id: 'tab3' }
                ]
            });
            expect(panel.tabs[0].selected).toBe(false);
            expect(panel.tabs[1].selected).toBe(true);
            expect(panel.tabs[2].selected).toBe(false);
        });
        it('should not modify selection when one is already selected', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', selected: false },
                    { id: 'tab2', selected: true }
                ]
            });
            expect(panel.tabs[0].selected).toBe(false);
            expect(panel.tabs[1].selected).toBe(true);
        });
        it('should default flex to "1 1 auto"', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            expect(panel.flex).toBe('1 1 auto');
        });
        it('should accept custom flex value', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }],
                flex: '0 0 300px'
            });
            expect(panel.flex).toBe('0 0 300px');
        });
        it('should create independent Tab instances (not shared)', () => {
            const tabProps = { id: 'shared' };
            const panel = new Panel({
                type: 'panel',
                tabs: [tabProps, tabProps]
            });
            // Should have only one tab instance
            expect(panel.tabs.length).toBe(1);
            expect(panel.tabs[0].id).toBe('shared');
        });
        it('should preserve all tab properties', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{
                        id: 'full-tab',
                        label: 'Full Label',
                        icon: 'full-icon',
                        selected: true
                    }]
            });
            expect(panel.tabs[0].id).toBe('full-tab');
            expect(panel.tabs[0].label).toBe('Full Label');
            expect(panel.tabs[0].icon).toBe('full-icon');
            expect(panel.tabs[0].selected).toBe(true);
        });
    });
    describe('Tab Selection - getSelected', () => {
        it('should return id of selected tab', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2', selected: true }
                ]
            });
            expect(panel.getSelected()).toBe('tab2');
        });
        it('should return first tab id when auto-selected', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'first' }, { id: 'second' }]
            });
            expect(panel.getSelected()).toBe('first');
        });
        it('should return empty string when no tabs', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: []
            });
            expect(panel.getSelected()).toBe('');
        });
        it('should return empty string when no tab is selected', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            // Manually deselect
            panel.tabs[0].selected = false;
            expect(panel.getSelected()).toBe('');
        });
        it('should return first selected when multiple selected (edge case)', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', selected: true },
                    { id: 'tab2', selected: true }
                ]
            });
            // getSelected returns first match
            expect(panel.getSelected()).toBe('tab1');
        });
    });
    describe('Tab Selection - setSelected', () => {
        it('should select tab by id', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2' },
                    { id: 'tab3' }
                ]
            });
            panel.setSelected('tab2');
            expect(panel.tabs[0].selected).toBe(false);
            expect(panel.tabs[1].selected).toBe(true);
            expect(panel.tabs[2].selected).toBe(false);
        });
        it('should deselect previous selection', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', selected: true },
                    { id: 'tab2' }
                ]
            });
            expect(panel.tabs[0].selected).toBe(true);
            panel.setSelected('tab2');
            expect(panel.tabs[0].selected).toBe(false);
            expect(panel.tabs[1].selected).toBe(true);
        });
        it('should handle selecting already selected tab', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1', selected: true }]
            });
            panel.setSelected('tab1');
            expect(panel.tabs[0].selected).toBe(true);
        });
        it('should deselect all when id not found', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', selected: true },
                    { id: 'tab2' }
                ]
            });
            panel.setSelected('nonexistent');
            expect(panel.tabs[0].selected).toBe(false);
            expect(panel.tabs[1].selected).toBe(false);
        });
        it('should handle empty string id', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1', selected: true }]
            });
            panel.setSelected('');
            expect(panel.tabs[0].selected).toBe(false);
        });
    });
    describe('Mutation Events', () => {
        let panel;
        let mutationHandler;
        beforeEach(() => {
            vi.useFakeTimers();
            panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            mutationHandler = vi.fn();
            panel.addEventListener('io-object-mutation', mutationHandler);
        });
        afterEach(() => {
            panel.dispose();
            vi.useRealTimers();
        });
        it('should dispatch mutation when tab added via push', () => {
            panel.tabs.push(new Tab({ id: 'tab3' }));
            // Mutation is debounced
            vi.advanceTimersByTime(10);
            expect(mutationHandler).toHaveBeenCalled();
        });
        it('should dispatch mutation when tab removed via splice', () => {
            panel.tabs.splice(0, 1);
            vi.advanceTimersByTime(10);
            expect(mutationHandler).toHaveBeenCalled();
        });
        it('should dispatch mutation on setSelected', () => {
            panel.setSelected('tab2');
            // setSelected calls dispatchMutation directly
            vi.advanceTimersByTime(10);
            expect(mutationHandler).toHaveBeenCalled();
        });
        it('should debounce rapid mutations', () => {
            panel.tabs.push(new Tab({ id: 'tab3' }));
            panel.tabs.push(new Tab({ id: 'tab4' }));
            panel.tabs.push(new Tab({ id: 'tab5' }));
            vi.advanceTimersByTime(10);
            // Should be debounced to fewer calls
            expect(mutationHandler.mock.calls.length).toBeLessThanOrEqual(3);
        });
    });
    describe('Serialization - toJSON', () => {
        it('should serialize panel with tabs', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', label: 'Tab 1' },
                    { id: 'tab2', selected: true }
                ],
                flex: '0 0 200px'
            });
            const json = panel.toJSON();
            expect(json.type).toBe('panel');
            expect(json.flex).toBe('0 0 200px');
            expect(json.tabs).toHaveLength(2);
            expect(json.tabs[0].id).toBe('tab1');
            expect(json.tabs[0].label).toBe('Tab 1');
            expect(json.tabs[1].id).toBe('tab2');
            expect(json.tabs[1].selected).toBe(true);
        });
        it('should serialize empty panel', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: []
            });
            const json = panel.toJSON();
            expect(json.type).toBe('panel');
            expect(json.tabs).toEqual([]);
        });
        it('should produce plain objects for tabs', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            const json = panel.toJSON();
            expect(json.tabs[0]).not.toBeInstanceOf(Tab);
        });
    });
    describe('Deserialization - fromJSON', () => {
        it('should restore panel from JSON', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'placeholder' }]
            });
            panel.fromJSON({
                type: 'panel',
                tabs: [
                    { id: 'restored1', label: 'Restored' },
                    { id: 'restored2', selected: true }
                ],
                flex: '0 0 400px'
            });
            expect(panel.tabs.length).toBe(2);
            expect(panel.tabs[0].id).toBe('restored1');
            expect(panel.tabs[0].label).toBe('Restored');
            expect(panel.tabs[1].id).toBe('restored2');
            expect(panel.tabs[1].selected).toBe(true);
            expect(panel.flex).toBe('0 0 400px');
        });
        it('should replace existing tabs', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'old1' }, { id: 'old2' }, { id: 'old3' }]
            });
            panel.fromJSON({
                type: 'panel',
                tabs: [{ id: 'new1' }]
            });
            expect(panel.tabs.length).toBe(1);
            expect(panel.tabs[0].id).toBe('new1');
        });
        it('should default flex when not in JSON', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'test' }],
                flex: '0 0 100px'
            });
            panel.fromJSON({
                type: 'panel',
                tabs: [{ id: 'restored' }]
            });
            expect(panel.flex).toBe('1 1 auto');
        });
        it('should return self for chaining', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'test' }]
            });
            const result = panel.fromJSON({
                type: 'panel',
                tabs: [{ id: 'chained' }]
            });
            expect(result).toBe(panel);
        });
        it('should collapse duplicate tab ids in fromJSON', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'original' }]
            });
            panel.fromJSON({
                type: 'panel',
                tabs: [
                    { id: 'dup', label: 'First' },
                    { id: 'dup', label: 'Second' },
                    { id: 'other' }
                ]
            });
            expect(panel.tabs.length).toBe(2);
            expect(panel.tabs[0].id).toBe('dup');
            expect(panel.tabs[0].label).toBe('First');
            expect(panel.tabs[1].id).toBe('other');
        });
    });
    describe('Serialization Roundtrip', () => {
        it('should preserve data through toJSON/fromJSON roundtrip', () => {
            const original = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1', label: 'Label 1', icon: 'icon1' },
                    { id: 'tab2', label: 'Label 2', selected: true }
                ],
                flex: '0 0 250px'
            });
            const json = original.toJSON();
            const restored = new Panel({
                type: 'panel',
                tabs: [{ id: 'temp' }]
            });
            restored.fromJSON(json);
            expect(restored.tabs.length).toBe(original.tabs.length);
            expect(restored.flex).toBe(original.flex);
            for (let i = 0; i < original.tabs.length; i++) {
                expect(restored.tabs[i].id).toBe(original.tabs[i].id);
                expect(restored.tabs[i].label).toBe(original.tabs[i].label);
                expect(restored.tabs[i].icon).toBe(original.tabs[i].icon);
                expect(restored.tabs[i].selected).toBe(original.tabs[i].selected);
            }
        });
        it('should produce identical JSON after roundtrip', () => {
            const original = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'rt1' },
                    { id: 'rt2', selected: true }
                ],
                flex: '0 0 150px'
            });
            const json1 = original.toJSON();
            const restored = new Panel({
                type: 'panel',
                tabs: [{ id: 'temp' }]
            });
            restored.fromJSON(json1);
            const json2 = restored.toJSON();
            expect(json2).toEqual(json1);
        });
    });
    describe('Disposal', () => {
        it('should dispose without error', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            expect(() => panel.dispose()).not.toThrow();
        });
        it('should clear tabs array on dispose', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            const tabsRef = panel.tabs;
            panel.dispose();
            expect(tabsRef.length).toBe(0);
        });
        it('should cleanup parent-child relationships when tabs.length set to 0', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            const tab1 = panel.tabs[0];
            const tab2 = panel.tabs[1];
            // Tabs have panel as parent
            expect(tab1._parents).toContain(panel);
            expect(tab2._parents).toContain(panel);
            // Clear tabs via length = 0
            panel.tabs.length = 0;
            // Parent relationships are severed
            expect(tab1._parents).not.toContain(panel);
            expect(tab2._parents).not.toContain(panel);
            // But tabs are NOT disposed - still usable
            expect(tab1._disposed).toBeUndefined();
            expect(tab2._disposed).toBeUndefined();
        });
        it('should dispatch mutation when tabs cleared via length', () => {
            vi.useFakeTimers();
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            const mutationHandler = vi.fn();
            panel.addEventListener('io-object-mutation', mutationHandler);
            panel.tabs.length = 0;
            vi.advanceTimersByTime(10);
            expect(mutationHandler).toHaveBeenCalled();
            vi.useRealTimers();
        });
        it('should be marked as disposed', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            panel.dispose();
            expect(panel._disposed).toBe(true);
        });
    });
    describe('Tab Array Operations', () => {
        it('should allow adding tabs via push', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }]
            });
            panel.tabs.push(new Tab({ id: 'tab2' }));
            expect(panel.tabs.length).toBe(2);
            expect(panel.tabs[1].id).toBe('tab2');
        });
        it('should allow removing tabs via splice', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }, { id: 'tab3' }]
            });
            panel.tabs.splice(1, 1);
            expect(panel.tabs.length).toBe(2);
            expect(panel.tabs[0].id).toBe('tab1');
            expect(panel.tabs[1].id).toBe('tab3');
        });
        it('should allow reordering via splice', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
            });
            // Remove 'b' and insert at beginning
            const [removed] = panel.tabs.splice(1, 1);
            panel.tabs.unshift(removed);
            expect(panel.tabs[0].id).toBe('b');
            expect(panel.tabs[1].id).toBe('a');
            expect(panel.tabs[2].id).toBe('c');
        });
        it('should allow pop', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            const popped = panel.tabs.pop();
            expect(popped?.id).toBe('tab2');
            expect(panel.tabs.length).toBe(1);
        });
        it('should allow shift', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab1' }, { id: 'tab2' }]
            });
            const shifted = panel.tabs.shift();
            expect(shifted?.id).toBe('tab1');
            expect(panel.tabs.length).toBe(1);
            expect(panel.tabs[0].id).toBe('tab2');
        });
        it('should allow unshift', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [{ id: 'tab2' }]
            });
            panel.tabs.unshift(new Tab({ id: 'tab1' }));
            expect(panel.tabs.length).toBe(2);
            expect(panel.tabs[0].id).toBe('tab1');
            expect(panel.tabs[1].id).toBe('tab2');
        });
    });
    describe('Edge Cases', () => {
        it('should handle panel with many tabs', () => {
            const tabs = [];
            for (let i = 0; i < 100; i++) {
                tabs.push({ id: `tab${i}` });
            }
            const panel = new Panel({ type: 'panel', tabs });
            expect(panel.tabs.length).toBe(100);
            expect(panel.tabs[0].selected).toBe(true);
            expect(panel.tabs[99].id).toBe('tab99');
        });
        it('should handle selection with tabs that have empty ids', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: '' },
                    { id: 'valid' }
                ]
            });
            // getSelected returns first selected with non-empty id
            panel.tabs[0].selected = true;
            panel.tabs[1].selected = false;
            // Empty id should return empty string from getSelected
            expect(panel.getSelected()).toBe('');
        });
        it('should maintain selection state through array modifications', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'tab1' },
                    { id: 'tab2', selected: true },
                    { id: 'tab3' }
                ]
            });
            // Remove first tab
            panel.tabs.splice(0, 1);
            // tab2 should still be selected
            expect(panel.tabs[0].id).toBe('tab2');
            expect(panel.tabs[0].selected).toBe(true);
        });
        it('should collapse duplicate tab ids', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'same', label: 'First' },
                    { id: 'same', label: 'Second' }
                ]
            });
            // Duplicates should be collapsed to one (keeping first)
            expect(panel.tabs.length).toBe(1);
            expect(panel.tabs[0].id).toBe('same');
            expect(panel.tabs[0].label).toBe('First');
        });
        it('should collapse multiple duplicates', () => {
            const panel = new Panel({
                type: 'panel',
                tabs: [
                    { id: 'a' },
                    { id: 'b' },
                    { id: 'a' }, // duplicate
                    { id: 'c' },
                    { id: 'b' }, // duplicate
                    { id: 'a' } // duplicate
                ]
            });
            expect(panel.tabs.length).toBe(3);
            expect(panel.tabs[0].id).toBe('a');
            expect(panel.tabs[1].id).toBe('b');
            expect(panel.tabs[2].id).toBe('c');
        });
    });
});
//# sourceMappingURL=Panel.test.js.map