import { IoStorageNode, IoStorage, Binding } from '../iogui.js';
import { afterHashChange } from '../iogui.test.js';

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
          chai.expect(node.key).to.be.equal('test');
          chai.expect(node.value).to.be.equal('foo');
          chai.expect(node.default).to.be.equal('foo');
          chai.expect(node.storage).to.be.equal('none');

          chai.expect(node._properties.get('key')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: false,
            init: false,
            type: String,
            value: 'test',
          });

          chai.expect(node._properties.get('value')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: false,
            init: false,
            type: undefined,
            value: 'foo',
          });

          chai.expect(node._properties.get('default')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: false,
            init: false,
            type: undefined,
            value: 'foo',
          });

          chai.expect(node._properties.get('storage')).to.eql({
            binding: undefined,
            reactive: true,
            observe: false,
            reflect: false,
            init: false,
            type: String,
            value: 'none',
          });
          node.dispose();
        });
        it('Should initialize property value from localStorage store if exists', () => {
          localStorage.setItem('IoStorage:test2', '"asd"');
          const node = new IoStorageNode({key: 'test2', value: 'buzz', storage: 'local'});
          chai.expect(node.key).to.be.equal('test2');
          chai.expect(node.value).to.be.equal('asd');
          chai.expect(node.default).to.be.equal('buzz');
          chai.expect(node.storage).to.be.equal('local');
          node.dispose();
        });
        it('Should initialize property value from location.hash store if exists', async () => {
          self.location.hash = self.location.hash + '&testhash=foo';
          const node = new IoStorageNode({key: 'testhash', value: 'buzz', storage: 'hash'});
          chai.expect(node.key).to.be.equal('testhash');
          chai.expect(node.value).to.be.equal('foo');
          chai.expect(node.default).to.be.equal('buzz');
          chai.expect(node.storage).to.be.equal('hash');
          node.dispose();
        });
        it('Should return a new instance only if key and store are unique', () => {
          const node1 = new IoStorageNode({key: 'test3', storage: 'local'});
          const node2 = new IoStorageNode({key: 'test3', storage: 'local'});
          const node3 = new IoStorageNode({key: 'test3', storage: 'hash'});
          const node4 = new IoStorageNode({key: 'test4', storage: 'local'});
          chai.expect(node1).to.be.equal(node2);
          chai.expect(node1).to.not.be.equal(node3);
          chai.expect(node1).to.not.be.equal(node4);
          node1.dispose();
          node3.dispose();
          node4.dispose();
        });
      });
      describe('Reactivity', () => {
        it('Should update localStorage store when value changes', () => {
          const node = new IoStorageNode({key: 'test5', value: 'one', storage: 'local'});
          chai.expect(localStorage.getItem('IoStorage:test5')).to.be.equal(null);
          node.value = 'two';
          chai.expect(localStorage.getItem('IoStorage:test5')).to.be.equal('"two"');
          node.value = '2';
          chai.expect(localStorage.getItem('IoStorage:test5')).to.be.equal('"2"');
          node.value = 2;
          chai.expect(localStorage.getItem('IoStorage:test5')).to.be.equal('2');
          node.value = 'one';
          chai.expect(localStorage.getItem('IoStorage:test5')).to.be.equal(null);
          node.dispose();
        });
        it('Should update location.hash store when value changes to non-default', async () => {
          const node = new IoStorageNode({key: 'test6', value: 'one', storage: 'hash'});
          node.value = 'two';
          chai.expect(self.location.hash).to.include('test6=two');
          node.value = '2';
          chai.expect(self.location.hash).to.include('test6=%222%22');
          node.value = true;
          chai.expect(self.location.hash).to.include('test6=true');
          node.value = 2;
          chai.expect(self.location.hash).to.include('test6=2');
          self.location.hash = self.location.hash.replace('test6=2', 'test6=3');

          await afterHashChange();

          chai.expect(node.value).to.be.equal(3);

          self.location.hash = self.location.hash.replace('test6=3', 'test6="3"');

          await afterHashChange();

          chai.expect(node.value).to.be.equal('3');

          self.location.hash = self.location.hash.replace('test6=%223%22', 'test6=false');

          await afterHashChange();

          chai.expect(node.value).to.be.equal(false);

          node.value = [0,1,2];
          chai.expect(self.location.hash).to.include('test6=[0,1,2]');
          node.value = [0,1,'2'];
          chai.expect(self.location.hash).to.include('test6=[0,1,%222%22]');
          node.value = '2';
          chai.expect(self.location.hash).to.include('test6=%222%22');

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
          chai.expect(storage).to.be.instanceOf(Binding);
          storage.dispose();
          chai.expect(self.location.hash).to.not.include('test=foo');
        });
      });
    });
  }
}
