//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { nextQueue } from '@io-gui/core';
import { IoCollapsible, ioCollapsible } from '@io-gui/navigation';
describe('IoCollapsible', () => {
    let container;
    let collapsible;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
    });
    afterEach(() => {
        if (collapsible)
            collapsible.remove();
        container.remove();
    });
    describe('Construction', () => {
        it('should be defined', () => {
            expect(IoCollapsible).toBeDefined();
        });
        it('should have default property values', () => {
            collapsible = new IoCollapsible();
            container.appendChild(collapsible);
            expect(collapsible.elements).toEqual([]);
            expect(collapsible.label).toBe('');
            expect(collapsible.direction).toBe('column');
            expect(collapsible.icon).toBe('');
            expect(collapsible.expanded).toBe(false);
            expect(collapsible.role).toBe('region');
        });
        it('should accept constructor arguments', () => {
            const elements = [{ tag: 'div', props: { id: 'content' } }];
            collapsible = new IoCollapsible({
                elements,
                label: 'Test Label',
                direction: 'row',
                icon: 'test-icon',
                expanded: true
            });
            container.appendChild(collapsible);
            expect(collapsible.elements).toBe(elements);
            expect(collapsible.label).toBe('Test Label');
            expect(collapsible.direction).toBe('row');
            expect(collapsible.icon).toBe('test-icon');
            expect(collapsible.expanded).toBe(true);
        });
        it('should have Style getter', () => {
            expect(IoCollapsible.Style).toBeDefined();
            expect(typeof IoCollapsible.Style).toBe('string');
            expect(IoCollapsible.Style).toContain(':host');
            expect(IoCollapsible.Style).toContain('io-collapsible-content');
        });
    });
    describe('Rendering', () => {
        it('should render io-boolean toggle', async () => {
            collapsible = new IoCollapsible({ label: 'Toggle' });
            container.appendChild(collapsible);
            await nextQueue();
            const toggle = collapsible.querySelector('io-boolean');
            expect(toggle).toBeTruthy();
        });
        it('should render content container', async () => {
            collapsible = new IoCollapsible({ expanded: true, elements: [{ tag: 'span' }] });
            container.appendChild(collapsible);
            await nextQueue();
            const contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv).toBeTruthy();
        });
        it('should pass label to io-boolean', async () => {
            collapsible = new IoCollapsible({ label: 'Section Title' });
            container.appendChild(collapsible);
            await nextQueue();
            const toggle = collapsible.querySelector('io-boolean');
            expect(toggle?.true).toBe('Section Title');
            expect(toggle?.false).toBe('Section Title');
        });
        it('should pass icon to io-boolean', async () => {
            collapsible = new IoCollapsible({ icon: 'custom-icon' });
            container.appendChild(collapsible);
            await nextQueue();
            const toggle = collapsible.querySelector('io-boolean');
            expect(toggle?.icon).toBe('custom-icon');
        });
    });
    describe('Expanded state', () => {
        it('should render elements when expanded', async () => {
            collapsible = new IoCollapsible({
                expanded: true,
                elements: [
                    { tag: 'span', props: { id: 'child1' } },
                    { tag: 'div', props: { id: 'child2' } }
                ]
            });
            container.appendChild(collapsible);
            await nextQueue();
            const contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv?.querySelector('#child1')).toBeTruthy();
            expect(contentDiv?.querySelector('#child2')).toBeTruthy();
        });
        it('should not render elements when collapsed', async () => {
            collapsible = new IoCollapsible({
                expanded: false,
                elements: [
                    { tag: 'span', props: { id: 'child1' } }
                ]
            });
            container.appendChild(collapsible);
            await nextQueue();
            const contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv?.children.length).toBe(0);
        });
        it('should toggle elements visibility when expanded changes', async () => {
            collapsible = new IoCollapsible({
                expanded: false,
                elements: [{ tag: 'span', props: { id: 'child' } }]
            });
            container.appendChild(collapsible);
            await nextQueue();
            let contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv?.children.length).toBe(0);
            collapsible.expanded = true;
            await nextQueue();
            contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv?.querySelector('#child')).toBeTruthy();
            collapsible.expanded = false;
            await nextQueue();
            contentDiv = collapsible.querySelector('.io-collapsible-content');
            expect(contentDiv?.children.length).toBe(0);
        });
        it('should reflect expanded attribute', () => {
            collapsible = new IoCollapsible({ expanded: false });
            container.appendChild(collapsible);
            expect(collapsible.getAttribute('expanded')).toBeNull();
            collapsible.expanded = true;
            expect(collapsible.getAttribute('expanded')).toBe('');
            collapsible.expanded = false;
            expect(collapsible.getAttribute('expanded')).toBeNull();
        });
    });
    describe('Direction', () => {
        it('should default to column direction', async () => {
            collapsible = new IoCollapsible();
            container.appendChild(collapsible);
            expect(collapsible.direction).toBe('column');
            expect(collapsible.getAttribute('direction')).toBe('column');
        });
        it('should support row direction', async () => {
            collapsible = new IoCollapsible({ direction: 'row' });
            container.appendChild(collapsible);
            expect(collapsible.direction).toBe('row');
            expect(collapsible.getAttribute('direction')).toBe('row');
        });
        it('should reflect direction attribute', () => {
            collapsible = new IoCollapsible({ direction: 'column' });
            container.appendChild(collapsible);
            expect(collapsible.getAttribute('direction')).toBe('column');
            collapsible.direction = 'row';
            expect(collapsible.getAttribute('direction')).toBe('row');
        });
    });
    describe('Toggle binding', () => {
        it('should bind expanded to io-boolean value', async () => {
            collapsible = new IoCollapsible({ expanded: false, label: 'Test' });
            container.appendChild(collapsible);
            await nextQueue();
            const toggle = collapsible.querySelector('io-boolean');
            expect(toggle).toBeTruthy();
            expect(toggle.value).toBe(false);
            collapsible.expanded = true;
            await nextQueue();
            expect(toggle.value).toBe(true);
        });
        it('should update expanded when io-boolean value changes', async () => {
            collapsible = new IoCollapsible({ expanded: false, label: 'Test' });
            container.appendChild(collapsible);
            await nextQueue();
            const toggle = collapsible.querySelector('io-boolean');
            expect(toggle).toBeTruthy();
            toggle.value = true;
            expect(collapsible.expanded).toBe(true);
        });
    });
    describe('Accessibility', () => {
        it('should have role="region"', () => {
            collapsible = new IoCollapsible();
            container.appendChild(collapsible);
            expect(collapsible.role).toBe('region');
        });
    });
    describe('Factory function', () => {
        it('should export ioCollapsible factory function', () => {
            expect(typeof ioCollapsible).toBe('function');
        });
        it('should create virtual constructor from factory', () => {
            const vdom = ioCollapsible({ label: 'Test', expanded: true });
            expect(vdom).toBeDefined();
            expect(vdom.tag).toBe('io-collapsible');
            expect(vdom.props?.label).toBe('Test');
            expect(vdom.props?.expanded).toBe(true);
        });
    });
});
//# sourceMappingURL=IoCollapsible.test.js.map