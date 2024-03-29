import { MenuItem, MenuItemArgsLoose } from './menu-item.js';
import { MenuOptions } from './menu-options.js';

const testOptions = [
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
  {value: 'scrolls', options: [
    {value: 'scroll1', mode: 'scroll'},
    {value: 'scroll2', mode: 'scroll'},
    {value: 'scroll3', mode: 'scroll'},
  ]},
] as MenuItemArgsLoose[];

const eventStack: string[] = [];

export default class {
  run() {
    describe('MenuOptions', () => {
      it('Should initialize with correct default values', () => {
        const options = new MenuOptions();
        chai.expect(options.path).to.be.eql('');
        chai.expect(options.first).to.be.equal(undefined);
        chai.expect(options.last).to.be.equal(undefined);
        chai.expect(options.delimiter).to.be.equal(',');
        chai.expect(options.length).to.be.equal(0);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let options = new MenuOptions([1,'2',null]);
        chai.expect(options.path).to.be.eql('');
        chai.expect(options.first).to.be.equal(undefined);
        chai.expect(options.last).to.be.equal(undefined);
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

        options = new MenuOptions([1, {value: '2',  label: 'two'}]);
        chai.expect(options.length).to.be.equal(2);
        chai.expect(options[0].value).to.be.equal(1);
        chai.expect(options[0].label).to.be.equal('1');
        chai.expect(options[1].value).to.be.equal('2');
        chai.expect(options[1].label).to.be.equal('two');
      });
      it('Should initialize correctly from constructor arguments including first, or path propetty', () => {
        let options = new MenuOptions([1, '2', null], {first: '2'} as any);
        chai.expect(options.path).to.be.equal('2');
        chai.expect(options.last).to.be.equal('2');
        chai.expect(options[1].selected).to.be.eql(true);

        options = new MenuOptions([1, '2', null], {path: '1'} as any);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);
        chai.expect(options[0].selected).to.be.eql(true);
      });
      it('Should initialize suboptions from constructor arguments', () => {
        const options = new MenuOptions([{options: [1, '2', null]}]);
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
      it('Should update `path`, `first` and `last` properties when items are selected', () => {
        const options = new MenuOptions([1, 2, 3]);
        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[1].selected = true;
        chai.expect(options.path).to.be.equal('2');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal(2);

        options[2].selected = true;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(3);
      });
      it('Should update `first`, `last` and items\' `selected` properties when `path` property is set', () => {
        const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
        options.path = '1';
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options.path = 'two';
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal(2);

        options.path = '3';
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(3);
      });
      it('Should update `last`, `path` and items\' `selected` properties when `first` property is set', () => {
        const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
        options.first = 1;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options.first = 2;
        chai.expect(options.path).to.be.equal('two');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal(2);

        options.first = 3;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(3);
      });
      it('Should update `first`, `last`, `path` properties only when items with `mode="pick"` are selected', () => {
        const options = new MenuOptions([1, {value: 2, mode: 'toggle'}, 3]);
        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[1].selected = true;
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[2].selected = true;
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.path).to.be.equal('3');

        options[1].selected = false;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(3);

        options.first = 2;
        chai.expect(options.path).to.be.equal('3');
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal(3);

        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options.path = '2';
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);
      });
      it('Should update deep `first`, `last`, `scroll` and `path` string when items are selected', () => {
        const options = new MenuOptions(testOptions);
        options[0].selected = true;
        chai.expect(options.path).to.be.equal('1');
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[1].options[1].selected = true;
        chai.expect(options.path).to.be.equal('2,bar');
        chai.expect(options[1].options.path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal('bar');
        chai.expect(options[1].options.first).to.be.equal('bar');
        chai.expect(options[1].options.last).to.be.equal('bar');

        options[1].options[0].selected = true;
        chai.expect(options.path).to.be.equal('2,foo');
        chai.expect(options[1].options.path).to.be.equal('foo');
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal('foo');
        chai.expect(options[1].options.first).to.be.equal('foo');
        chai.expect(options[1].options.last).to.be.equal('foo');

        options[2].options[2].options[2].selected = true;
        chai.expect(options.path).to.be.equal('3,buzz,NaN');
        chai.expect(options[2].options.path).to.be.equal('buzz,NaN');
        chai.expect(options[2].options[2].options.path).to.be.equal('NaN');
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.NaN;
        chai.expect(options[2].options.first).to.be.equal('buzz');
        chai.expect(options[2].options.last).to.be.NaN;
        chai.expect(options[2].options[2].options.first).to.be.NaN;
        chai.expect(options[2].options[2].options.last).to.be.NaN;

        options[2].selected = false;
        chai.expect(options[2].options[2].selected).to.be.equal(false);
        chai.expect(options[2].options[2].options[2].selected).to.be.equal(false);
        chai.expect(options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('');
        chai.expect(options[2].options[2].options.path).to.be.equal('');
        chai.expect(options.first).to.be.equal(undefined);
        chai.expect(options.last).to.be.equal(undefined);
        chai.expect(options[2].options.first).to.be.equal(undefined);
        chai.expect(options[2].options.last).to.be.equal(undefined);
        chai.expect(options[2].options[2].options.first).to.be.equal(undefined);
        chai.expect(options[2].options[2].options.last).to.be.equal(undefined);

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
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[3].options[1].selected = true;
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[3].selected).to.be.equal(true);
        chai.expect(options.path).to.be.equal('scrolls,scroll2');
        chai.expect(options.first).to.be.equal('scrolls');
        chai.expect(options.last).to.be.equal('scrolls');
        chai.expect(options.scroll).to.be.equal('scroll2');
        chai.expect(options[3].options.path).to.be.equal('scroll2');
        chai.expect(options[3].options.first).to.be.equal(undefined);
        chai.expect(options[3].options.last).to.be.equal(undefined);
        chai.expect(options[3].options.scroll).to.be.equal('scroll2');
      });
      it('Should update deep `first`, `last`, `scroll` and items\' `selected` properties when `path` property is set', () => {
        const options = new MenuOptions(testOptions);
        options.path = '1';
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options.path = '2,bar';
        chai.expect(options[1].options.path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options[1].options[1].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal('bar');
        chai.expect(options[1].options.first).to.be.equal('bar');
        chai.expect(options[1].options.last).to.be.equal('bar');

        options.path = '1,foo';
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[0].options.path).to.be.equal('foo');
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[0].options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal('foo');
        chai.expect(options[1].options.first).to.be.equal(undefined);
        chai.expect(options[1].options.last).to.be.equal(undefined);
        chai.expect(options[0].options.first).to.be.equal('foo');
        chai.expect(options[0].options.last).to.be.equal('foo');

        options.path = '1,buzz';
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[0].options.path).to.be.equal('buzz');
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options[2].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[0].options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal('buzz');
        chai.expect(options[0].options.first).to.be.equal('buzz');
        chai.expect(options[0].options.last).to.be.equal('buzz');

        options.path = '';
        chai.expect(options[0].options.path).to.be.equal('');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[0].options[0].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(undefined);
        chai.expect(options.last).to.be.equal(undefined);
        chai.expect(options[0].options.first).to.be.equal(undefined);
        chai.expect(options[0].options.last).to.be.equal(undefined);

        options.path = '3,buzz,NaN';
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('buzz,NaN');
        chai.expect(options[2].options[2].options.path).to.be.equal('NaN');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].options[2].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.NaN;
        chai.expect(options[1].options.first).to.be.equal(undefined);
        chai.expect(options[1].options.last).to.be.equal(undefined);
        chai.expect(options[2].options.first).to.be.equal('buzz');
        chai.expect(options[2].options.last).to.be.NaN;
        chai.expect(options[2].options[2].options.first).to.be.NaN;
        chai.expect(options[2].options[2].options.last).to.be.NaN;

        options.path = '3,buzz,null';
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('buzz,null');
        chai.expect(options[2].options[2].options.path).to.be.equal('null');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(null);
        chai.expect(options[1].options.first).to.be.equal(undefined);
        chai.expect(options[1].options.last).to.be.equal(undefined);
        chai.expect(options[2].options.first).to.be.equal('buzz');
        chai.expect(options[2].options.last).to.be.equal(null);
        chai.expect(options[2].options[2].options.first).to.be.equal(null);
        chai.expect(options[2].options[2].options.last).to.be.equal(null);

        options.path = 'scrolls,scroll1';
        chai.expect(options[2].options.path).to.be.equal('');
        chai.expect(options[2].selected).to.be.equal(false);
        chai.expect(options[3].options.path).to.be.equal('scroll1');
        chai.expect(options[3].options.first).to.be.equal(undefined);
        chai.expect(options[3].options.last).to.be.equal(undefined);
        chai.expect(options[3].options.scroll).to.be.equal('scroll1');
        chai.expect(options[3].options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal('scrolls');
        chai.expect(options.last).to.be.equal('scrolls');
        chai.expect(options.scroll).to.be.equal('scroll1');

        options.path = 'scrolls';
        chai.expect(options.first).to.be.equal('scrolls');
        chai.expect(options.last).to.be.equal('scrolls');
        chai.expect(options.scroll).to.be.equal(undefined);
      });
      it('Should update deep `last`, `path` and items\' `selected` properties when `first` property is set', () => {
        const options = new MenuOptions(testOptions);
        options.first = 1;
        chai.expect(options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(1);
        chai.expect(options.last).to.be.equal(1);

        options[1].options.first = 'bar';
        chai.expect(options[1].options.path).to.be.equal('bar');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options[1].options[1].selected).to.be.equal(true);
        chai.expect(options[2].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal('bar');
        chai.expect(options[1].options.first).to.be.equal('bar');
        chai.expect(options[1].options.last).to.be.equal('bar');

        options.first = undefined;
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options.first).to.be.equal(undefined);
        chai.expect(options.last).to.be.equal(undefined);
        chai.expect(options[1].options.first).to.be.equal(undefined);
        chai.expect(options[1].options.last).to.be.equal(undefined);

        options[2].options[2].options.first = null;
        chai.expect(options[1].options.path).to.be.equal('');
        chai.expect(options[2].options.path).to.be.equal('buzz,null');
        chai.expect(options[2].options[2].options.path).to.be.equal('null');
        chai.expect(options[0].selected).to.be.equal(false);
        chai.expect(options[1].selected).to.be.equal(false);
        chai.expect(options[1].options[1].selected).to.be.equal(false);
        chai.expect(options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].selected).to.be.equal(true);
        chai.expect(options[2].options[2].options[0].selected).to.be.equal(true);
        chai.expect(options.first).to.be.equal(3);
        chai.expect(options.last).to.be.equal(null);
        chai.expect(options[1].options.first).to.be.equal(undefined);
        chai.expect(options[1].options.last).to.be.equal(undefined);
        chai.expect(options[2].options.first).to.be.equal('buzz');
        chai.expect(options[2].options.last).to.be.equal(null);
        chai.expect(options[2].options[2].options.first).to.be.equal(null);
        chai.expect(options[2].options[2].options.last).to.be.equal(null);
      });
      it('Should update `path`, `first` and `last` on initialization when selected items are provided.', () => {
        const testOptionsSelected = JSON.parse(JSON.stringify(testOptions));
        testOptionsSelected[1].options[2].options[0] = {value: null, selected: true};

        const options = new MenuOptions(testOptionsSelected);

        chai.expect(options[1].selected).to.be.equal(true);
        chai.expect(options.path).to.be.equal('2,buzz,null');
        chai.expect(options.first).to.be.equal(2);
        chai.expect(options.last).to.be.equal(null);

        chai.expect(options[1].options[2].selected).to.be.equal(true);
        chai.expect(options[1].options.path).to.be.equal('buzz,null');
        chai.expect(options[1].options.first).to.be.equal('buzz');
        chai.expect(options[1].options.last).to.be.equal(null);

        chai.expect(options[1].options[2].options[0].selected).to.be.equal(true);
        chai.expect(options[1].options[2].options.path).to.be.equal('null');
        chai.expect(options[1].options[2].options.first).to.be.equal(null);
        chai.expect(options[1].options[2].options.last).to.be.equal(null);
      });
      it('Should update `path`, `first` and `last` properties in correct order and only when necessary.', () => {
        const options = new MenuOptions(testOptions);
        options.addEventListener('changed', () => { eventStack.push('change'); });
        options.addEventListener('path-changed', () => { eventStack.push('path changed: ' + options.path); });
        options.addEventListener('first-changed', () => { eventStack.push('firstChanged: ' + options.first); });
        options.addEventListener('last-changed', () => { eventStack.push('lastChanged: ' + options.last); });

        eventStack.length = 0;
        options[0].selected = true;
        chai.expect(eventStack).to.be.eql(['path changed: 1', 'firstChanged: 1', 'lastChanged: 1', 'change']);

        eventStack.length = 0;
        options[1].options[1].selected = true;
        chai.expect(eventStack).to.be.eql(['path changed: 2,bar', 'firstChanged: 2', 'lastChanged: bar', 'change']);

        eventStack.length = 0;
        options[2].options[2].options[2].selected = true;
        chai.expect(eventStack).to.be.eql(['path changed: 3,buzz,NaN', 'firstChanged: 3', 'lastChanged: NaN', 'change']);

        eventStack.length = 0;
        options[2].selected = false;
        chai.expect(eventStack).to.be.eql(['path changed: ', 'firstChanged: undefined', 'lastChanged: undefined', 'change']);

        eventStack.length = 0;
        options[2].selected = true;
        chai.expect(eventStack).to.be.eql(['path changed: 3', 'firstChanged: 3', 'lastChanged: 3', 'change']);
      });
    });
  }
}
