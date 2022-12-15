import { MenuItem } from './menu-item.js';

export default class {
  run() {
    describe('MenuItem', () => {
      it('Should initialize with correct default values', () => {
        const item = new MenuItem();
        chai.expect(item.value).to.be.equal(undefined);
        chai.expect(item.label).to.be.equal('undefined');
        chai.expect(item.icon).to.be.equal('');
        chai.expect(item.hint).to.be.equal('');
        chai.expect(item.disabled).to.be.equal(false);
        chai.expect(item.action).to.be.equal(undefined);
        chai.expect(item.mode).to.be.equal('select');
        chai.expect(item.selected).to.be.equal(false);
        chai.expect(item.options).to.be.eql(undefined);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let item = new MenuItem(1);
        chai.expect(item.value).to.be.equal(1);
        chai.expect(item.label).to.be.equal('1');
        chai.expect(item.icon).to.be.equal('');
        chai.expect(item.hint).to.be.equal('');
        chai.expect(item.disabled).to.be.equal(false);
        chai.expect(item.action).to.be.equal(undefined);
        chai.expect(item.mode).to.be.equal('select');
        chai.expect(item.selected).to.be.equal(false);
        chai.expect(item.options).to.be.eql(undefined);
        item = new MenuItem('foo');
        chai.expect(item.value).to.be.equal('foo');
        chai.expect(item.label).to.be.equal('foo');
        item = new MenuItem(null);
        chai.expect(item.value).to.be.equal(null);
        chai.expect(item.label).to.be.equal('null');
        item = new MenuItem({value: null});
        chai.expect(item.value).to.be.equal(null);
        chai.expect(item.label).to.be.equal('null');
        item = new MenuItem({});
        chai.expect(item.value).to.be.equal(undefined);
        chai.expect(item.label).to.be.equal('undefined');
        item = new MenuItem({
          value: 'foo',
          label: 'bar',
          icon: 'icon:close',
          hint: 'buzz',
          disabled: true,
          action: ()=>{},
          mode: 'toggle',
          selected: true,
        });
        chai.expect(item.value).to.be.equal('foo');
        chai.expect(item.label).to.be.equal('bar');
        chai.expect(item.icon).to.be.equal('icon:close');
        chai.expect(item.hint).to.be.equal('buzz');
        chai.expect(item.disabled).to.be.equal(true);
        chai.expect(typeof item.action).to.be.equal('function');
        chai.expect(item.mode).to.be.equal('toggle');
        chai.expect(item.selected).to.be.equal(true);
        chai.expect(item.options).to.be.eql(undefined);
      });
      it('Should initialize suboptions from constructor arguments', () => {
        let item = new MenuItem({options: []});
        chai.expect(item.hasmore).to.be.equal(false);
        chai.expect(item.options).to.be.eql([]);
        chai.expect(item.options?.length).to.be.equal(0);
        item = new MenuItem({options: [1, '2', null]});
        chai.expect(item.hasmore).to.be.equal(true);
        chai.expect((item.options as any)[0].value).to.be.equal(1);
        chai.expect((item.options as any)[0].label).to.be.equal('1');
        chai.expect((item.options as any)[1].value).to.be.equal('2');
        chai.expect((item.options as any)[1].label).to.be.equal('2');
        chai.expect((item.options as any)[2].value).to.be.equal(null);
        chai.expect((item.options as any)[2].label).to.be.equal('null');
        item = new MenuItem({options: [1, {value: '2', label: 'two'}, undefined]});
        chai.expect((item.options as any)[0].value).to.be.equal(1);
        chai.expect((item.options as any)[0].label).to.be.equal('1');
        chai.expect((item.options as any)[1].value).to.be.equal('2');
        chai.expect((item.options as any)[1].label).to.be.equal('two');
        chai.expect((item.options as any)[2].value).to.be.equal(undefined);
        chai.expect((item.options as any)[2].label).to.be.equal('undefined');
        item = new MenuItem({options: [1]});
        chai.expect((item.options as any)[0].value).to.be.equal(1);
        chai.expect((item.options as any)[0].label).to.be.equal('1');
      });
      it('Should return `options.path` from path getter', () => {
        let item = new MenuItem();
        chai.expect(item.path).to.be.equal(undefined);
        item = new MenuItem({options: []});
        chai.expect(item.path).to.be.eql('');
        // TODO: test longer paths
      });
      it('Should return subitem with specified value using `.getSubitem([value])`', () => {
        const subItem1 = new MenuItem(1);
        const subItem2 = new MenuItem(2);
        const item = new MenuItem({options: [subItem1, subItem2]});
        chai.expect(item.getSubitem(1)).to.be.equal(subItem1);
        chai.expect(item.getSubitem(2)).to.be.equal(subItem2);
      });
    });
  }
}
