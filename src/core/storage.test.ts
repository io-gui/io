import { IoStorageNode, IoStorage, Binding } from '../io-gui';
import { expect } from 'chai';

async function afterHashChange(): Promise<void> {
  return new Promise((resolve) => {
    self.addEventListener('hashchange', () => {
      resolve();
    }, { once: true });
  });
}

localStorage.removeItem('IoStorage:test2');
localStorage.removeItem('IoStorage:test3');
localStorage.removeItem('IoStorage:test4');
localStorage.removeItem('IoStorage:test5');

const permited = localStorage.getItem('IoStorage:user-permitted');

localStorage.setItem('IoStorage:user-permitted', 'true');

export default class {
  run() {
    describe('IoStorageNode', () => {
      describe('Initialization', () => {
        it('Should register property definitions correctly', () => {
          const node = new IoStorageNode({key: 'test', value: 'foo'});
          expect(node.key).to.be.equal('test');
          expect(node.value).to.be.equal('foo');
          expect(node.default).to.be.equal('foo');
          expect(node.storage).to.be.equal('none');

          expect(node._properties.get('key')).to.eql({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: String,
            value: 'test',
          });

          expect(node._properties.get('value')).to.eql({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: undefined,
            value: 'foo',
          });

          expect(node._properties.get('default')).to.eql({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: undefined,
            value: 'foo',
          });

          expect(node._properties.get('storage')).to.eql({
            binding: undefined,
            reflect: false,
            init: undefined,
            type: String,
            value: 'none',
          });
          node.dispose();
        });
        it('Should initialize property value from localStorage store if exists', () => {
          localStorage.setItem('IoStorage:test2', '"asd"');
          const node = new IoStorageNode({key: 'test2', value: 'buzz', storage: 'local'});
          expect(node.key).to.be.equal('test2');
          expect(node.value).to.be.equal('asd');
          expect(node.default).to.be.equal('buzz');
          expect(node.storage).to.be.equal('local');
          node.dispose();
        });
        it('Should initialize property value from location.hash store if exists', async () => {
          self.location.hash = self.location.hash + '&testhash=foo';
          const node = new IoStorageNode({key: 'testhash', value: 'buzz', storage: 'hash'});
          expect(node.key).to.be.equal('testhash');
          expect(node.value).to.be.equal('foo');
          expect(node.default).to.be.equal('buzz');
          expect(node.storage).to.be.equal('hash');
          node.dispose();
        });
        it('Should return a new instance only if key and store are unique', () => {
          const node1 = new IoStorageNode({key: 'test3', storage: 'local'});
          const node2 = new IoStorageNode({key: 'test3', storage: 'local'});
          const node3 = new IoStorageNode({key: 'test3', storage: 'hash'});
          const node4 = new IoStorageNode({key: 'test4', storage: 'local'});
          expect(node1).to.be.equal(node2);
          expect(node1).to.not.be.equal(node3);
          expect(node1).to.not.be.equal(node4);
          node1.dispose();
          node3.dispose();
          node4.dispose();
        });
      });
      describe('Reactivity', () => {
        it('Should update localStorage store when value changes', () => {
          const node = new IoStorageNode({key: 'test5', value: 'one', storage: 'local'});
          expect(localStorage.getItem('IoStorage:test5')).to.be.equal(null);
          node.value = 'two';
          expect(localStorage.getItem('IoStorage:test5')).to.be.equal('"two"');
          node.value = '2';
          expect(localStorage.getItem('IoStorage:test5')).to.be.equal('"2"');
          node.value = 2;
          expect(localStorage.getItem('IoStorage:test5')).to.be.equal('2');
          node.value = 'one';
          expect(localStorage.getItem('IoStorage:test5')).to.be.equal(null);
          node.dispose();
        });
        it('Should update location.hash store when value changes to non-default', async () => {
          const node = new IoStorageNode({key: 'test6', value: 'one', storage: 'hash'});
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

          node.value = [0,1,2];
          expect(self.location.hash).to.include('test6=[0,1,2]');
          node.value = [0,1,'2'];
          expect(self.location.hash).to.include('test6=[0,1,%222%22]');
          node.value = '2';
          expect(self.location.hash).to.include('test6=%222%22');

          node.dispose();

          if (!permited || permited === 'false') localStorage.setItem('IoStorage:user-permitted', 'false');
        });
      });
    });
    describe('IoStorage', () => {
      describe('Initialization', () => {
        it('Should return binding to IoStorageNode Node', () => {
          const storage = IoStorage({key: 'test', storage: 'hash'});
          storage.value = 'foo';
          expect(storage).to.be.instanceOf(Binding);
          storage.dispose();
          expect(self.location.hash).to.not.include('test=foo');
        });
      });
    });
  }
}
