import { MenuItem } from './menu-item.js';

export default class {
  run() {
    describe('MenuItem', () => {
      it('Should initialize with correct default values', () => {
        const item = new MenuItem();
        expect(item.value).to.be.equal(undefined);
        expect(item.label).to.be.equal('undefined');
        expect(item.icon).to.be.equal('');
        expect(item.hint).to.be.equal('');
        expect(item.disabled).to.be.equal(false);
        expect(item.action).to.be.equal(undefined);
        expect(item.mode).to.be.equal('select');
        expect(item.selected).to.be.equal(false);
        expect(item.options).to.be.eql(undefined);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let item = new MenuItem(1);
        expect(item.value).to.be.equal(1);
        expect(item.label).to.be.equal('1');
        expect(item.icon).to.be.equal('');
        expect(item.hint).to.be.equal('');
        expect(item.disabled).to.be.equal(false);
        expect(item.action).to.be.equal(undefined);
        expect(item.mode).to.be.equal('select');
        expect(item.selected).to.be.equal(false);
        expect(item.options).to.be.eql(undefined);
        item = new MenuItem('foo');
        expect(item.value).to.be.equal('foo');
        expect(item.label).to.be.equal('foo');
        item = new MenuItem(null);
        expect(item.value).to.be.equal(null);
        expect(item.label).to.be.equal('null');
        item = new MenuItem({value: null});
        expect(item.value).to.be.equal(null);
        expect(item.label).to.be.equal('null');
        item = new MenuItem({});
        expect(item.value).to.be.equal(undefined);
        expect(item.label).to.be.equal('undefined');
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
        expect(item.value).to.be.equal('foo');
        expect(item.label).to.be.equal('bar');
        expect(item.icon).to.be.equal('icon:close');
        expect(item.hint).to.be.equal('buzz');
        expect(item.disabled).to.be.equal(true);
        expect(typeof item.action).to.be.equal('function');
        expect(item.mode).to.be.equal('toggle');
        expect(item.selected).to.be.equal(true);
        expect(item.options).to.be.eql(undefined);
      });
      it('Should initialize suboptions from constructor arguments', () => {
        let item = new MenuItem({options: []});
        expect(item.hasmore).to.be.equal(false);
        expect(item.options).to.be.eql([]);
        expect(item.options?.length).to.be.equal(0);
        item = new MenuItem({options: [1, '2', null]});
        expect(item.hasmore).to.be.equal(true);
        expect((item.options as any)[0].value).to.be.equal(1);
        expect((item.options as any)[0].label).to.be.equal('1');
        expect((item.options as any)[1].value).to.be.equal('2');
        expect((item.options as any)[1].label).to.be.equal('2');
        expect((item.options as any)[2].value).to.be.equal(null);
        expect((item.options as any)[2].label).to.be.equal('null');
        item = new MenuItem({options: [1, {value: '2', label: 'two'}, undefined]});
        expect((item.options as any)[0].value).to.be.equal(1);
        expect((item.options as any)[0].label).to.be.equal('1');
        expect((item.options as any)[1].value).to.be.equal('2');
        expect((item.options as any)[1].label).to.be.equal('two');
        expect((item.options as any)[2].value).to.be.equal(undefined);
        expect((item.options as any)[2].label).to.be.equal('undefined');
        item = new MenuItem({options: [1]});
        expect((item.options as any)[0].value).to.be.equal(1);
        expect((item.options as any)[0].label).to.be.equal('1');
      });
      it('Should return `options.path` from path getter', () => {
        let item = new MenuItem();
        expect(item.options).to.be.equal(undefined);
        item = new MenuItem({options: []});
        expect(item.options?.path).to.be.eql('');
        // TODO: test longer paths
      });
      it('Should return subitem with specified value using `.getSubitem([value])`', () => {
        const subItem1 = new MenuItem(1);
        const subItem2 = new MenuItem(2);
        const item = new MenuItem({options: [subItem1, subItem2]});
        expect(item.getSubitem(1)).to.be.equal(subItem1);
        expect(item.getSubitem(2)).to.be.equal(subItem2);
      });
    });
  }
}
