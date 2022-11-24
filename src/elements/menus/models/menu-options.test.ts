import { MenuItem } from './menu-item.js';
import { MenuOptions } from './menu-options.js';

export default class {
  run() {
    describe('MenuOptions', () => {
      it('Should initialize with correct default values', () => {
        const options = new MenuOptions();
        chai.expect(options.path).to.be.eql('');
        chai.expect(options.root).to.be.equal(undefined);
        chai.expect(options.leaf).to.be.equal(undefined);
        chai.expect(options.delimiter).to.be.equal(',');
        chai.expect(options.length).to.be.equal(0);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let options = new MenuOptions([1, '2',  null]);
        chai.expect(options.path).to.be.eql('');
        chai.expect(options.root).to.be.equal(undefined);
        chai.expect(options.leaf).to.be.equal(undefined);
        chai.expect(options.delimiter).to.be.equal(',');
        chai.expect(options.length).to.be.equal(3);
        chai.expect(options[0].value).to.be.equal(1);
        chai.expect(options[0].label).to.be.equal('1');
        chai.expect(options[1].value).to.be.equal('2');
        chai.expect(options[1].label).to.be.equal('2');
        chai.expect(options[2].value).to.be.equal(null);
        chai.expect(options[2].label).to.be.equal('null');

        options = new MenuOptions([{value: '2',  label: 'two'}]);
        chai.expect(options.length).to.be.equal(1);
        chai.expect(options[0].value).to.be.equal('2');
        chai.expect(options[0].label).to.be.equal('two');

        options = new MenuOptions([1, new MenuItem({value: '2',  label: 'two'})]);
        chai.expect(options.length).to.be.equal(2);
        chai.expect(options[0].value).to.be.equal(1);
        chai.expect(options[0].label).to.be.equal('1');
        chai.expect(options[1].value).to.be.equal('2');
        chai.expect(options[1].label).to.be.equal('two');
      });
      it('Should initialize suboptions from constructor arguments', () => {
        const options = new MenuOptions({options: [1, '2',  null]});
        chai.expect(options.length).to.be.equal(1);
        chai.expect(options[0].hasmore).to.be.equal(true);
        chai.expect(options[0].options.length).to.be.equal(3);
        chai.expect(options[0].options[0].value).to.be.equal(1);
        chai.expect(options[0].options[1].value).to.be.equal('2');
        chai.expect(options[0].options[2].value).to.be.equal(null);
      });
      it('Should return item with specified value using `.getItem([value])`', () => {
        const subItem1 = new MenuItem(1);
        const subItem2 = new MenuItem(2);
        const options = new MenuOptions([subItem1, subItem2]);
        chai.expect(options.getItem(1)).to.be.equal(subItem1);
        chai.expect(options.getItem(2)).to.be.equal(subItem2);
      });
      it('Should update `path`, `root` and `leaf` properties when items are selected', () => {
        const options = new MenuOptions([1, 2, 3]);
        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options[1].selected = true;
        chai.expect(options.path).to.be.equal('2');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal(2);

        options[2].selected = true;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.equal(3);
      });
      it('Should update `selected`, `root` and `leaf` properties when `path` property is set', () => {
        const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
        options.path = '1';
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options.path = 'two';
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal(2);

        options.path = '3';
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.equal(3);
      });
      it('Should update `selected`, `leaf` and `path` properties when `root` property is set', () => {
        const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
        options.root = 1;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options.root = 2;
        chai.expect(options.path).to.be.equal('two');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal(2);

        options.root = 3;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.equal(3);
      });
      it('Should update `path`, `root` and `leaf` string when suboptions are selected', () => {
        const options = new MenuOptions([
          {value: 1, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 2, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 3, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
        ]);
        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options[1].options[1].selected = true;
        chai.expect(options.path).to.be.equal('2,bar');
        chai.expect(options[1].options.path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal('bar');
        chai.expect(options[1].options.root).to.be.equal('bar');
        chai.expect(options[1].options.leaf).to.be.equal('bar');

        options[2].options[2].options[2].selected = true;
        chai.expect(options.path).to.be.equal('3,buzz,NaN');
        chai.expect(options[2].options.path).to.be.equal('buzz,NaN');
        chai.expect(options[2].options[2].options.path).to.be.equal('NaN');
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.NaN;
        chai.expect(options[2].options.root).to.be.equal('buzz');
        chai.expect(options[2].options.leaf).to.be.NaN;
        chai.expect(options[2].options[2].options.root).to.be.NaN;
        chai.expect(options[2].options[2].options.leaf).to.be.NaN;

        options[2].selected = false;
        chai.expect(options[2].options[2].selected).to.be.equal(false);
        chai.expect(options[2].options[2].options[2].selected).to.be.equal(false);
        chai.expect(options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('');
        chai.expect(options[2].options[2].options.path).to.be.equal('');
        chai.expect(options.root).to.be.equal(undefined);
        chai.expect(options.leaf).to.be.equal(undefined);
        chai.expect(options[2].options.root).to.be.equal(undefined);
        chai.expect(options[2].options.leaf).to.be.equal(undefined);
        chai.expect(options[2].options[2].options.root).to.be.equal(undefined);
        chai.expect(options[2].options[2].options.leaf).to.be.equal(undefined);

        options[0].selected = true;
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].options[2].selected).to.be.equal(false);
        chai.expect(options[2].options[2].options[2].selected).to.be.equal(false);
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('');
        chai.expect(options[2].options[2].options.path).to.be.equal('');
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);
      });
      it('Should update `selected`, `root` and `leaf` properties in suboptions when `path` string is set', () => {
        const options = new MenuOptions([
          {value: 1, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 2, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 3, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
        ]);
        options.path = '1';
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options.path = '2,bar';
        chai.expect(options[1].path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options[1].options[1].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal('bar');
        chai.expect(options[1].options.root).to.be.equal('bar');
        chai.expect(options[1].options.leaf).to.be.equal('bar');

        options.path = '';
        chai.expect(options[1].path).to.be.equal('');
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(undefined);
        chai.expect(options.leaf).to.be.equal(undefined);
        chai.expect(options[1].options.root).to.be.equal(undefined);
        chai.expect(options[1].options.leaf).to.be.equal(undefined);

        options.path = '3,buzz,NaN';
        chai.expect(options[1].path).to.be.equal('');
        chai.expect(options[2].path).to.be.equal('buzz,NaN');
        chai.expect(options[2].options[2].path).to.be.equal('NaN');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].options[2].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.NaN;
        chai.expect(options[1].options.root).to.be.equal(undefined);
        chai.expect(options[1].options.leaf).to.be.equal(undefined);
        chai.expect(options[2].options.root).to.be.equal('buzz');
        chai.expect(options[2].options.leaf).to.be.NaN;
        chai.expect(options[2].options[2].options.root).to.be.NaN;
        chai.expect(options[2].options[2].options.leaf).to.be.NaN;
      });
      it('Should update `selected`, `leaf` and `path` properties in suboptions when `root` property is set', () => {
        const options = new MenuOptions([
          {value: 1, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 2, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
          {value: 3, options: [
            {value: 'foo', options: [null, undefined, NaN]},
            {value: 'bar', options: [null, undefined, NaN]},
            {value: 'buzz', options: [null, undefined, NaN]},
          ]},
        ]);
        options.root = 1;
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(1);
        chai.expect(options.leaf).to.be.equal(1);

        options[1].options.root = 'bar';
        chai.expect(options[1].path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options[1].options[1].selected).to.be.equal(true);
        chai.expect(options[2].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(2);
        chai.expect(options.leaf).to.be.equal('bar');
        chai.expect(options[1].options.root).to.be.equal('bar');
        chai.expect(options[1].options.leaf).to.be.equal('bar');

        options.root = undefined;
        chai.expect(options[1].path).to.be.equal('');
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.root).to.be.equal(undefined);
        chai.expect(options.leaf).to.be.equal(undefined);
        chai.expect(options[1].options.root).to.be.equal(undefined);
        chai.expect(options[1].options.leaf).to.be.equal(undefined);

        options[2].options[2].options.root = null;
        chai.expect(options[1].path).to.be.equal('');
        chai.expect(options[2].path).to.be.equal('buzz,null');
        chai.expect(options[2].options[2].path).to.be.equal('null');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].options[0].selected).to.be.equal(true);
        chai.expect(options.root).to.be.equal(3);
        chai.expect(options.leaf).to.be.equal(null);
        chai.expect(options[1].options.root).to.be.equal(undefined);
        chai.expect(options[1].options.leaf).to.be.equal(undefined);
        chai.expect(options[2].options.root).to.be.equal('buzz');
        chai.expect(options[2].options.leaf).to.be.equal(null);
        chai.expect(options[2].options[2].options.root).to.be.equal(null);
        chai.expect(options[2].options[2].options.leaf).to.be.equal(null);
      });
    });
  }
}
