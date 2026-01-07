//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IoLayout, Split, Panel } from '@io-gui/layout';
describe('Split Construction Consolidation', () => {
    it('Should consolidate on construction when root has only 1 child that is a Split', () => {
        // This mimics the IoThreeDemo structure where the root Split has only 1 child (a Split)
        const split = new Split({
            type: 'split',
            children: [
                {
                    type: 'split',
                    orientation: 'horizontal',
                    children: [
                        { type: 'panel', tabs: [{ id: 'panelA' }] },
                        { type: 'panel', tabs: [{ id: 'panelB' }] },
                        { type: 'panel', tabs: [{ id: 'panelC' }] }
                    ]
                }
            ]
        });
        // After construction, the root should have adopted the child's children and orientation
        expect(split.children.length).toBe(3);
        expect(split.orientation).toBe('horizontal');
        expect(split.children[0]).toBeInstanceOf(Panel);
        expect(split.children[1]).toBeInstanceOf(Panel);
        expect(split.children[2]).toBeInstanceOf(Panel);
    });
    it('Should consolidate nested single-child splits on construction', () => {
        // Multiple levels of single-child splits should all consolidate
        const split = new Split({
            type: 'split',
            children: [
                {
                    type: 'split',
                    orientation: 'vertical',
                    children: [
                        {
                            type: 'split',
                            orientation: 'horizontal',
                            children: [
                                { type: 'panel', tabs: [{ id: 'panelA' }] },
                                { type: 'panel', tabs: [{ id: 'panelB' }] }
                            ]
                        }
                    ]
                }
            ]
        });
        // Should flatten to just the innermost split's children
        expect(split.children.length).toBe(2);
        expect(split.orientation).toBe('horizontal');
        expect(split.children[0]).toBeInstanceOf(Panel);
        expect(split.children[1]).toBeInstanceOf(Panel);
    });
    it('Should NOT consolidate when root has only 1 child that is a Panel', () => {
        const split = new Split({
            type: 'split',
            children: [
                { type: 'panel', tabs: [{ id: 'panelA' }] }
            ]
        });
        // Single panel should remain as-is
        expect(split.children.length).toBe(1);
        expect(split.children[0]).toBeInstanceOf(Panel);
    });
    it('Should NOT consolidate when root has multiple children', () => {
        const split = new Split({
            type: 'split',
            children: [
                { type: 'panel', tabs: [{ id: 'panelA' }] },
                {
                    type: 'split',
                    orientation: 'vertical',
                    children: [{ type: 'panel', tabs: [{ id: 'panelB' }] }]
                }
            ]
        });
        // Multiple children should not trigger consolidation
        expect(split.children.length).toBe(2);
        expect(split.children[0]).toBeInstanceOf(Panel);
        expect(split.children[1]).toBeInstanceOf(Split);
    });
    it('Should consolidate complex IoThreeDemo-like structure', () => {
        // Exact structure from IoThreeDemo
        const split = new Split({
            type: 'split',
            children: [
                {
                    type: 'split',
                    orientation: 'horizontal',
                    children: [
                        {
                            type: 'panel',
                            flex: '1 0 380px',
                            tabs: [{ id: 'AllClasses' }],
                        },
                        {
                            type: 'split',
                            orientation: 'vertical',
                            children: [
                                {
                                    type: 'split',
                                    orientation: 'horizontal',
                                    children: [
                                        { type: 'panel', tabs: [{ id: 'Top' }] },
                                        { type: 'panel', tabs: [{ id: 'Front' }] },
                                    ]
                                },
                                {
                                    type: 'split',
                                    orientation: 'horizontal',
                                    children: [
                                        { type: 'panel', tabs: [{ id: 'Left' }] },
                                        { type: 'panel', tabs: [{ id: 'Perspective' }] },
                                    ]
                                },
                            ]
                        },
                        {
                            type: 'panel',
                            flex: '1 0 380px',
                            tabs: [{ id: 'ExampleSelector' }],
                        }
                    ]
                }
            ]
        });
        // Root should adopt the only child's children and orientation
        expect(split.children.length).toBe(3);
        expect(split.orientation).toBe('horizontal');
        expect(split.children[0]).toBeInstanceOf(Panel);
        expect(split.children[0].flex).toBe('1 0 380px');
        expect(split.children[1]).toBeInstanceOf(Split);
        expect(split.children[2]).toBeInstanceOf(Panel);
    });
});
describe('IoSplit Consolidation', () => {
    let layout;
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
    });
    afterEach(() => {
        if (layout) {
            layout.remove();
        }
        container.remove();
    });
    it('Should have consolidateChild method defined', () => {
        const split = new Split({
            type: 'split',
            children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
        });
        layout = new IoLayout({ split, elements: [] });
        container.appendChild(layout);
        const ioSplit = layout.querySelector('io-split');
        expect(typeof ioSplit.consolidateChild).toBe('function');
    });
    describe('consolidateChild with Panel child', () => {
        it('Should replace child split with its sole panel', () => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [{ type: 'panel', tabs: [{ id: 'panelB' }] }]
                    }
                ]
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const rootSplit = layout.querySelector('io-split');
            const childSplit = split.children[1];
            expect(split.children.length).toBe(2);
            expect(split.children[1]).toBeInstanceOf(Split);
            rootSplit.consolidateChild(childSplit);
            expect(split.children.length).toBe(2);
            expect(split.children[1]).toBeInstanceOf(Panel);
            expect(split.children[1].tabs[0].id).toBe('panelB');
            expect(split.children[1].flex).toBe('1 1 100%');
        });
    });
    describe('consolidateChild with Split child', () => {
        it('Should adopt child split children and orientation', () => {
            // Create a structure where childSplit has 1 child that is a Split with multiple children
            // Note: Since construction-time consolidation now happens, we need to create
            // this structure programmatically after construction
            const innerSplit = new Split({
                type: 'split',
                orientation: 'vertical',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelB' }] },
                    { type: 'panel', tabs: [{ id: 'panelC' }] }
                ]
            });
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }] },
                    { type: 'panel', tabs: [{ id: 'placeholder' }] } // Placeholder panel
                ]
            });
            // Replace the placeholder with a split that has only 1 child (a Split)
            const childSplit = new Split({
                type: 'split',
                orientation: 'vertical',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelB' }] }, // Dummy to prevent construction consolidation
                    { type: 'panel', tabs: [{ id: 'panelC' }] }
                ]
            });
            // Now manually set it to have only 1 child that is a Split
            childSplit.children.length = 0;
            childSplit.children.push(innerSplit);
            split.children[1] = childSplit;
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const rootSplit = layout.querySelector('io-split');
            expect(split.children.length).toBe(2);
            expect(childSplit.children.length).toBe(1);
            expect(childSplit.children[0]).toBeInstanceOf(Split);
            rootSplit.consolidateChild(childSplit);
            expect(split.children.length).toBe(3);
            expect(split.orientation).toBe('vertical');
            expect(split.children[0]).toBeInstanceOf(Panel);
            expect(split.children[1]).toBeInstanceOf(Panel);
            expect(split.children[2]).toBeInstanceOf(Panel);
            expect(split.children[1].tabs[0].id).toBe('panelB');
            expect(split.children[2].tabs[0].id).toBe('panelC');
        });
    });
    describe('Event-driven consolidation', () => {
        it('Should consolidate via event when dispatched from nested child IoSplit', () => {
            // Structure: root > childSplit (with only 1 child which is a panel)
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [{ type: 'panel', tabs: [{ id: 'panelB' }] }]
                    }
                ]
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const childSplit = split.children[1];
            // Find the nested io-split element (second io-split in the DOM)
            const childIoSplit = layout.querySelectorAll('io-split')[1];
            // Dispatch event from child - it should bubble to parent rootSplit
            childIoSplit.dispatchEvent(new CustomEvent('io-split-consolidate', {
                detail: { split: childSplit },
                bubbles: true
            }));
            // Parent should have consolidated the child split into a panel
            expect(split.children.length).toBe(2);
            expect(split.children[0]).toBeInstanceOf(Panel);
            expect(split.children[1]).toBeInstanceOf(Panel);
            expect(split.children[1].tabs[0].id).toBe('panelB');
        });
        it('Should handle nested split consolidation via event', () => {
            // Structure: root > childSplit (with 1 child which is a Split)
            // Since construction-time consolidation happens, we create this programmatically
            const innerSplit = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelB' }] },
                    { type: 'panel', tabs: [{ id: 'panelC' }] }
                ]
            });
            const childSplit = new Split({
                type: 'split',
                orientation: 'vertical',
                children: [
                    { type: 'panel', tabs: [{ id: 'dummy1' }] },
                    { type: 'panel', tabs: [{ id: 'dummy2' }] }
                ]
            });
            // Replace with single Split child
            childSplit.children.length = 0;
            childSplit.children.push(innerSplit);
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }] },
                    { type: 'panel', tabs: [{ id: 'placeholder' }] }
                ]
            });
            split.children[1] = childSplit;
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            // Find the nested io-split element
            const childIoSplit = layout.querySelectorAll('io-split')[1];
            // Dispatch event from child - it should bubble to parent rootSplit
            childIoSplit.dispatchEvent(new CustomEvent('io-split-consolidate', {
                detail: { split: childSplit },
                bubbles: true
            }));
            // Parent should have adopted grandchild's children and orientation
            expect(split.children.length).toBe(3);
            expect(split.orientation).toBe('horizontal');
            expect(split.children[0]).toBeInstanceOf(Panel);
            expect(split.children[1]).toBeInstanceOf(Panel);
            expect(split.children[2]).toBeInstanceOf(Panel);
            expect(split.children[1].tabs[0].id).toBe('panelB');
            expect(split.children[2].tabs[0].id).toBe('panelC');
        });
    });
    describe('Edge cases', () => {
        it('Should preserve flex values when consolidating panels', () => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }], flex: '0 0 200px' },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [{ type: 'panel', tabs: [{ id: 'panelB' }], flex: '0 0 300px' }]
                    }
                ]
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const rootSplit = layout.querySelector('io-split');
            const childSplit = split.children[1];
            rootSplit.consolidateChild(childSplit);
            expect(split.children[0].flex).toBe('0 0 200px');
            expect(split.children[1].flex).toBe('1 1 100%');
        });
        it('Should handle consolidation when removing split via io-split-remove', () => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelA' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [{ type: 'panel', tabs: [{ id: 'panelB' }] }]
                    },
                    { type: 'panel', tabs: [{ id: 'panelC' }] }
                ]
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            expect(split.children.length).toBe(3);
            const childSplit = split.children[1];
            const rootSplit = layout.querySelector('io-split');
            rootSplit.dispatchEvent(new CustomEvent('io-split-remove', {
                detail: { split: childSplit },
                bubbles: true
            }));
            expect(split.children.length).toBe(2);
            expect(split.children[0]).toBeInstanceOf(Panel);
            expect(split.children[1]).toBeInstanceOf(Panel);
        });
        it('Should trigger consolidation on split removal if only one child remains (nested)', () => {
            // For consolidation to work via events, we need a grandparent structure
            // root > middleSplit (has childA and childB) > when childA removed, middleSplit consolidates
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'panelRoot' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [
                            {
                                type: 'split',
                                orientation: 'horizontal',
                                children: [{ type: 'panel', tabs: [{ id: 'panelA' }] }]
                            },
                            {
                                type: 'split',
                                orientation: 'horizontal',
                                children: [{ type: 'panel', tabs: [{ id: 'panelB' }] }]
                            }
                        ]
                    }
                ]
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const middleSplit = split.children[1];
            expect(middleSplit.children.length).toBe(2);
            const childSplitToRemove = middleSplit.children[0];
            // Find the grandchild IoSplit element and dispatch from it
            const grandchildIoSplit = layout.querySelectorAll('io-split')[2];
            grandchildIoSplit.dispatchEvent(new CustomEvent('io-split-remove', {
                detail: { split: childSplitToRemove },
                bubbles: true
            }));
            // After removal: middleSplit has 1 child (childB which contains panelB)
            // Consolidation replaces middleSplit in root with childB's contents
            // Root now has: [panelRoot, panelB]
            expect(split.children.length).toBe(2);
            expect(split.children[0]).toBeInstanceOf(Panel);
            expect(split.children[0].tabs[0].id).toBe('panelRoot');
            expect(split.children[1]).toBeInstanceOf(Panel);
            expect(split.children[1].tabs[0].id).toBe('panelB');
        });
    });
});
//# sourceMappingURL=IoSplit.test.js.map