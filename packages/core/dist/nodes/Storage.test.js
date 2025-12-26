import { describe, it, expect } from 'vitest';
import { StorageNode, Storage, Binding } from '@io-gui/core';
async function afterHashChange() {
    return new Promise((resolve) => {
        self.addEventListener('hashchange', () => {
            resolve();
        }, { once: true });
    });
}
localStorage.removeItem('Storage:test2');
localStorage.removeItem('Storage:test3');
localStorage.removeItem('Storage:test4');
localStorage.removeItem('Storage:test5');
const permited = localStorage.getItem('Storage:user-permitted');
localStorage.setItem('Storage:user-permitted', 'true');
describe('Storage.test.ts', () => {
    it('Should register property definitions correctly', () => {
        const node = new StorageNode({ key: 'test', value: 'foo' });
        expect(node.key).toBe('test');
        expect(node.value).toBe('foo');
        expect(node.storage).toBe('local');
        expect(node._reactiveProperties.get('key')).toEqual({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: String,
            value: 'test',
        });
        expect(node._reactiveProperties.get('value')).toEqual({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: undefined,
            value: 'foo',
        });
        expect(node._reactiveProperties.get('storage')).toEqual({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: String,
            value: 'local',
        });
        node.dispose();
    });
    it('Should initialize property value from localStorage store if exists', () => {
        localStorage.setItem('Storage:test2', '"asd"');
        const node = new StorageNode({ key: 'test2', value: 'buzz', storage: 'local' });
        expect(node.key).toBe('test2');
        expect(node.value).toBe('asd');
        expect(node.default).toBe('buzz');
        expect(node.storage).toBe('local');
        node.dispose();
    });
    it('Should initialize property value from location.hash store if exists', async () => {
        self.location.hash = self.location.hash + '&testhash=foo';
        const node = new StorageNode({ key: 'testhash', value: 'buzz', storage: 'hash' });
        expect(node.key).toBe('testhash');
        expect(node.value).toBe('foo');
        expect(node.default).toBe('buzz');
        expect(node.storage).toBe('hash');
        node.dispose();
    });
    it('Should return a new instance only if key and store are unique', () => {
        const node1 = new StorageNode({ key: 'test3', value: '' });
        const node2 = new StorageNode({ key: 'test3', value: '' });
        expect(node1).toBe(node2);
        node1.dispose();
    });
    it('Should update localStorage store when value changes', () => {
        const node = new StorageNode({ key: 'test5', value: 'one', storage: 'local' });
        expect(localStorage.getItem('Storage:test5')).toBe('"one"');
        node.value = 'two';
        expect(localStorage.getItem('Storage:test5')).toBe('"two"');
        node.value = '2';
        expect(localStorage.getItem('Storage:test5')).toBe('"2"');
        node.value = 2;
        expect(localStorage.getItem('Storage:test5')).toBe('2');
        node.value = 'one';
        expect(localStorage.getItem('Storage:test5')).toBe(null);
        node.dispose();
    });
    it('Should update location.hash store when value changes to non-default', async () => {
        const node = new StorageNode({ key: 'test6', value: 'one', storage: 'hash' });
        node.value = 'two';
        expect(self.location.hash).toContain('test6=two');
        node.value = '2';
        expect(self.location.hash).toContain('test6=%222%22');
        node.value = true;
        expect(self.location.hash).toContain('test6=true');
        node.value = 2;
        expect(self.location.hash).toContain('test6=2');
        self.location.hash = self.location.hash.replace('test6=2', 'test6=3');
        await afterHashChange();
        expect(node.value).toBe(3);
        self.location.hash = self.location.hash.replace('test6=3', 'test6="3"');
        await afterHashChange();
        expect(node.value).toBe('3');
        self.location.hash = self.location.hash.replace('test6=%223%22', 'test6=false');
        await afterHashChange();
        expect(node.value).toBe(false);
        node.value = [0, 1, 2];
        expect(self.location.hash).toContain('test6=[0,1,2]');
        node.value = [0, 1, '2'];
        expect(self.location.hash).toContain('test6=[0,1,%222%22]');
        node.value = '2';
        expect(self.location.hash).toContain('test6=%222%22');
        node.dispose();
        if (!permited || permited === 'false')
            localStorage.setItem('Storage:user-permitted', 'false');
    });
    it('Storage should return binding to StorageNode Node', () => {
        const storage = Storage({ key: 'test', value: '' });
        storage.value = 'foo';
        expect(storage).toBeInstanceOf(Binding);
        storage.dispose();
        expect(self.location.hash).not.toContain('test=foo');
    });
});
//# sourceMappingURL=Storage.test.js.map