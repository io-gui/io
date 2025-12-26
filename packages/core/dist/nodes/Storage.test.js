import { StorageNode, Storage, Binding } from 'io-core';
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
export default class {
    run() {
        describe('Storage.test.ts', () => {
            it('Should register property definitions correctly', () => {
                const node = new StorageNode({ key: 'test', value: 'foo' });
                expect(node.key).to.be.equal('test');
                expect(node.value).to.be.equal('foo');
                expect(node.storage).to.be.equal('local');
                expect(node._reactiveProperties.get('key')).to.eql({
                    binding: undefined,
                    reflect: false,
                    init: undefined,
                    type: String,
                    value: 'test',
                });
                expect(node._reactiveProperties.get('value')).to.eql({
                    binding: undefined,
                    reflect: false,
                    init: undefined,
                    type: undefined,
                    value: 'foo',
                });
                expect(node._reactiveProperties.get('storage')).to.eql({
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
                expect(node.key).to.be.equal('test2');
                expect(node.value).to.be.equal('asd');
                expect(node.default).to.be.equal('buzz');
                expect(node.storage).to.be.equal('local');
                node.dispose();
            });
            it('Should initialize property value from location.hash store if exists', async () => {
                self.location.hash = self.location.hash + '&testhash=foo';
                const node = new StorageNode({ key: 'testhash', value: 'buzz', storage: 'hash' });
                expect(node.key).to.be.equal('testhash');
                expect(node.value).to.be.equal('foo');
                expect(node.default).to.be.equal('buzz');
                expect(node.storage).to.be.equal('hash');
                node.dispose();
            });
            it('Should return a new instance only if key and store are unique', () => {
                const node1 = new StorageNode({ key: 'test3', value: '' });
                const node2 = new StorageNode({ key: 'test3', value: '' });
                expect(node1).to.be.equal(node2);
                node1.dispose();
            });
            it('Should update localStorage store when value changes', () => {
                const node = new StorageNode({ key: 'test5', value: 'one', storage: 'local' });
                expect(localStorage.getItem('Storage:test5')).to.be.equal('"one"');
                node.value = 'two';
                expect(localStorage.getItem('Storage:test5')).to.be.equal('"two"');
                node.value = '2';
                expect(localStorage.getItem('Storage:test5')).to.be.equal('"2"');
                node.value = 2;
                expect(localStorage.getItem('Storage:test5')).to.be.equal('2');
                node.value = 'one';
                expect(localStorage.getItem('Storage:test5')).to.be.equal(null);
                node.dispose();
            });
            it('Should update location.hash store when value changes to non-default', async () => {
                const node = new StorageNode({ key: 'test6', value: 'one', storage: 'hash' });
                node.value = 'two';
                expect(self.location.hash).to.include('test6=two');
                node.value = '2';
                expect(self.location.hash).to.include('test6=%222%22');
                node.value = true;
                expect(self.location.hash).to.include('test6=true');
                node.value = 2;
                expect(self.location.hash).to.include('test6=2');
                self.location.hash = self.location.hash.replace('test6=2', 'test6=3');
                await afterHashChange();
                expect(node.value).to.be.equal(3);
                self.location.hash = self.location.hash.replace('test6=3', 'test6="3"');
                await afterHashChange();
                expect(node.value).to.be.equal('3');
                self.location.hash = self.location.hash.replace('test6=%223%22', 'test6=false');
                await afterHashChange();
                expect(node.value).to.be.equal(false);
                node.value = [0, 1, 2];
                expect(self.location.hash).to.include('test6=[0,1,2]');
                node.value = [0, 1, '2'];
                expect(self.location.hash).to.include('test6=[0,1,%222%22]');
                node.value = '2';
                expect(self.location.hash).to.include('test6=%222%22');
                node.dispose();
                if (!permited || permited === 'false')
                    localStorage.setItem('Storage:user-permitted', 'false');
            });
            it('Storage should return binding to StorageNode Node', () => {
                const storage = Storage({ key: 'test', value: '' });
                storage.value = 'foo';
                expect(storage).to.be.instanceOf(Binding);
                storage.dispose();
                expect(self.location.hash).to.not.include('test=foo');
            });
        });
    }
}
//# sourceMappingURL=Storage.test.js.map