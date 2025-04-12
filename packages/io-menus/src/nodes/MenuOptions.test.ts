import { MenuItem, MenuOptions } from '../index';

// const testOptions = {items: [
//   new MenuItem({value: 1, options: new MenuOptions({items: [
//     new MenuItem({value: 'foo', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN}),
//     ]})}),
//     new MenuItem({value: 'bar', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN}),
//     ]})}),
//     new MenuItem({value: 'buzz', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN}),
//     ]})}),
//   ]})}),
//   new MenuItem({value: 2, options: new MenuOptions({items: [
//     new MenuItem({value: 'foo', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//     new MenuItem({value: 'bar', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//     new MenuItem({value: 'buzz', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//   ]})}),
//   new MenuItem({value: 3, options: new MenuOptions({items: [
//     new MenuItem({value: 'foo', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//     new MenuItem({value: 'bar', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//     new MenuItem({value: 'buzz', options: new MenuOptions({items: [
//       new MenuItem({value: null}),
//       new MenuItem({value: undefined}),
//       new MenuItem({value: NaN})
//     ]})}),
//   ]})}),
//   new MenuItem({value: 'scrolls', options: new MenuOptions({items: [
//     new MenuItem({value: 'scroll1', mode: 'scroll'}),
//     new MenuItem({value: 'scroll2', mode: 'scroll'}),
//     new MenuItem({value: 'scroll3', mode: 'scroll'}),
//   ]})}),
// ]} as MenuOptionsArgs;

// const eventStack: string[] = [];

export default class {
  run() {
    describe('MenuOptions', () => {
      it('Should initialize with correct default values', () => {
        const options = new MenuOptions();
        expect(options.path).to.be.eql('');
        expect(options.first).to.be.equal(undefined);
        expect(options.last).to.be.equal(undefined);
        expect(options.delimiter).to.be.equal(',');
        expect(options.length).to.be.equal(0);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let options = new MenuOptions({items: [
          new MenuItem({value: 1}),
          new MenuItem({value: '2'}),
          new MenuItem({value: null}),
        ]});
        expect(options.path).to.be.eql('');
        expect(options.first).to.be.equal(undefined);
        expect(options.last).to.be.equal(undefined);
        expect(options.delimiter).to.be.equal(',');
        expect(options.length).to.be.equal(3);
        expect(options[0].value).to.be.equal(1);
        expect(options[0].label).to.be.equal('1');
        expect(options[1].value).to.be.equal('2');
        expect(options[1].label).to.be.equal('2');
        expect(options[2].value).to.be.equal(null);
        expect(options[2].label).to.be.equal('null');

        // options = new MenuOptions([{value: '2',  label: 'two'}]);
        // expect(options.length).to.be.equal(1);
        // expect(options[0].value).to.be.equal('2');
        // expect(options[0].label).to.be.equal('two');

        // options = new MenuOptions([1, {value: '2',  label: 'two'}]);
        // expect(options.length).to.be.equal(2);
        // expect(options[0].value).to.be.equal(1);
        // expect(options[0].label).to.be.equal('1');
        // expect(options[1].value).to.be.equal('2');
        // expect(options[1].label).to.be.equal('two');
      });
      // it('Should initialize correctly from constructor arguments including first, or path propetty', () => {
      //   let options = new MenuOptions([1, '2', null], {first: '2'} as any);
      //   expect(options.path).to.be.equal('2');
      //   expect(options.last).to.be.equal('2');
      //   expect(options[1].selected).to.be.eql(true);

      //   options = new MenuOptions([1, '2', null], {path: '1'} as any);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);
      //   expect(options[0].selected).to.be.eql(true);
      // });
      // it('Should initialize suboptions from constructor arguments', () => {
      //   const options = new MenuOptions([{value: undefined, options: new MenuOptions([1, '2', null])}]);
      //   expect(options.length).to.be.equal(1);
      //   expect(options[0].hasmore).to.be.equal(true);
      //   expect(options[0].options.length).to.be.equal(3);
      //   expect(options[0].options[0].value).to.be.equal(1);
      //   expect(options[0].options[1].value).to.be.equal('2');
      //   expect(options[0].options[2].value).to.be.equal(null);
      // });
      // it('Should return item with specified value using `.getItem([value])`', () => {
      //   const subItem1 = new MenuItem({value: 1});
      //   const subItem2 = new MenuItem({value: 2});
      //   const options = new MenuOptions([subItem1, subItem2]);
      //   expect(options.getItem(1)).to.be.equal(subItem1);
      //   expect(options.getItem(2)).to.be.equal(subItem2);
      // });
      // it('Should update `path`, `first` and `last` properties when items are selected', () => {
      //   const options = new MenuOptions([1, 2, 3]);
      //   options[0].selected = true;
      //   expect(options.path).to.be.equal('1');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[1].selected = true;
      //   expect(options.path).to.be.equal('2');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal(2);

      //   options[2].selected = true;
      //   expect(options.path).to.be.equal('3');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(3);
      // });
      // it('Should update `first`, `last` and items\' `selected` properties when `path` property is set', () => {
      //   const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
      //   options.path = '1';
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options.path = 'two';
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal(2);

      //   options.path = '3';
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(3);
      // });
      // it('Should update `last`, `path` and items\' `selected` properties when `first` property is set', () => {
      //   const options = new MenuOptions([1, {value: 2, label: 'two'}, 3]);
      //   options.first = 1;
      //   expect(options.path).to.be.equal('1');
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options.first = 2;
      //   expect(options.path).to.be.equal('two');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal(2);

      //   options.first = 3;
      //   expect(options.path).to.be.equal('3');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(3);
      // });
      // it('Should update `first`, `last`, `path` properties only when items with `mode="pick"` are selected', () => {
      //   const options = new MenuOptions([1, {value: 2, mode: 'toggle'}, 3]);
      //   options[0].selected = true;
      //   expect(options.path).to.be.equal('1');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[1].selected = true;
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options.path).to.be.equal('1');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[2].selected = true;
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options.path).to.be.equal('3');

      //   options[1].selected = false;
      //   expect(options.path).to.be.equal('3');
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(3);

      //   options.first = 2;
      //   expect(options.path).to.be.equal('3');
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal(3);

      //   options[0].selected = true;
      //   expect(options.path).to.be.equal('1');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options.path = '2';
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);
      // });
      // it('Should update deep `first`, `last`, `scroll` and `path` string when items are selected', () => {
      //   const options = new MenuOptions(testOptions);
      //   options[0].selected = true;
      //   expect(options.path).to.be.equal('1');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[1].options[1].selected = true;
      //   expect(options.path).to.be.equal('2,bar');
      //   expect(options[1].options.path).to.be.equal('bar');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal('bar');
      //   expect(options[1].options.first).to.be.equal('bar');
      //   expect(options[1].options.last).to.be.equal('bar');

      //   options[1].options[0].selected = true;
      //   expect(options.path).to.be.equal('2,foo');
      //   expect(options[1].options.path).to.be.equal('foo');
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal('foo');
      //   expect(options[1].options.first).to.be.equal('foo');
      //   expect(options[1].options.last).to.be.equal('foo');

      //   options[2].options[2].options[2].selected = true;
      //   expect(options.path).to.be.equal('3,buzz,NaN');
      //   expect(options[2].options.path).to.be.equal('buzz,NaN');
      //   expect(options[2].options[2].options.path).to.be.equal('NaN');
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].selected).to.be.equal(true);
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.NaN;
      //   expect(options[2].options.first).to.be.equal('buzz');
      //   expect(options[2].options.last).to.be.NaN;
      //   expect(options[2].options[2].options.first).to.be.NaN;
      //   expect(options[2].options[2].options.last).to.be.NaN;

      //   options[2].selected = false;
      //   expect(options[2].options[2].selected).to.be.equal(false);
      //   expect(options[2].options[2].options[2].selected).to.be.equal(false);
      //   expect(options.path).to.be.equal('');
      //   expect(options[2].options.path).to.be.equal('');
      //   expect(options[2].options[2].options.path).to.be.equal('');
      //   expect(options.first).to.be.equal(undefined);
      //   expect(options.last).to.be.equal(undefined);
      //   expect(options[2].options.first).to.be.equal(undefined);
      //   expect(options[2].options.last).to.be.equal(undefined);
      //   expect(options[2].options[2].options.first).to.be.equal(undefined);
      //   expect(options[2].options[2].options.last).to.be.equal(undefined);

      //   options[0].selected = true;
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[2].options[2].selected).to.be.equal(false);
      //   expect(options[2].options[2].options[2].selected).to.be.equal(false);
      //   expect(options.path).to.be.equal('1');
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[2].options.path).to.be.equal('');
      //   expect(options[2].options[2].options.path).to.be.equal('');
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[3].options[1].selected = true;
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[3].selected).to.be.equal(true);
      //   expect(options.path).to.be.equal('scrolls,scroll2');
      //   expect(options.first).to.be.equal('scrolls');
      //   expect(options.last).to.be.equal('scrolls');
      //   expect(options.scroll).to.be.equal('scroll2');
      //   expect(options[3].options.path).to.be.equal('scroll2');
      //   expect(options[3].options.first).to.be.equal(undefined);
      //   expect(options[3].options.last).to.be.equal(undefined);
      //   expect(options[3].options.scroll).to.be.equal('scroll2');
      // });
      // it('Should update deep `first`, `last`, `scroll` and items\' `selected` properties when `path` property is set', () => {
      //   const options = new MenuOptions(testOptions);
      //   options.path = '1';
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options.path = '2,bar';
      //   expect(options[1].options.path).to.be.equal('bar');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options[1].options[1].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal('bar');
      //   expect(options[1].options.first).to.be.equal('bar');
      //   expect(options[1].options.last).to.be.equal('bar');

      //   options.path = '1,foo';
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[0].options.path).to.be.equal('foo');
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[0].options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal('foo');
      //   expect(options[1].options.first).to.be.equal(undefined);
      //   expect(options[1].options.last).to.be.equal(undefined);
      //   expect(options[0].options.first).to.be.equal('foo');
      //   expect(options[0].options.last).to.be.equal('foo');

      //   options.path = '1,buzz';
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[0].options.path).to.be.equal('buzz');
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options[2].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[0].options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal('buzz');
      //   expect(options[0].options.first).to.be.equal('buzz');
      //   expect(options[0].options.last).to.be.equal('buzz');

      //   options.path = '';
      //   expect(options[0].options.path).to.be.equal('');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[0].options[0].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(undefined);
      //   expect(options.last).to.be.equal(undefined);
      //   expect(options[0].options.first).to.be.equal(undefined);
      //   expect(options[0].options.last).to.be.equal(undefined);

      //   options.path = '3,buzz,NaN';
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[2].options.path).to.be.equal('buzz,NaN');
      //   expect(options[2].options[2].options.path).to.be.equal('NaN');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].options[2].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.NaN;
      //   expect(options[1].options.first).to.be.equal(undefined);
      //   expect(options[1].options.last).to.be.equal(undefined);
      //   expect(options[2].options.first).to.be.equal('buzz');
      //   expect(options[2].options.last).to.be.NaN;
      //   expect(options[2].options[2].options.first).to.be.NaN;
      //   expect(options[2].options[2].options.last).to.be.NaN;

      //   options.path = '3,buzz,null';
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[2].options.path).to.be.equal('buzz,null');
      //   expect(options[2].options[2].options.path).to.be.equal('null');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(null);
      //   expect(options[1].options.first).to.be.equal(undefined);
      //   expect(options[1].options.last).to.be.equal(undefined);
      //   expect(options[2].options.first).to.be.equal('buzz');
      //   expect(options[2].options.last).to.be.equal(null);
      //   expect(options[2].options[2].options.first).to.be.equal(null);
      //   expect(options[2].options[2].options.last).to.be.equal(null);

      //   options.path = 'scrolls,scroll1';
      //   expect(options[2].options.path).to.be.equal('');
      //   expect(options[2].selected).to.be.equal(false);
      //   expect(options[3].options.path).to.be.equal('scroll1');
      //   expect(options[3].options.first).to.be.equal(undefined);
      //   expect(options[3].options.last).to.be.equal(undefined);
      //   expect(options[3].options.scroll).to.be.equal('scroll1');
      //   expect(options[3].options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal('scrolls');
      //   expect(options.last).to.be.equal('scrolls');
      //   expect(options.scroll).to.be.equal('scroll1');

      //   options.path = 'scrolls';
      //   expect(options.first).to.be.equal('scrolls');
      //   expect(options.last).to.be.equal('scrolls');
      //   expect(options.scroll).to.be.equal(undefined);
      // });
      // it('Should update deep `last`, `path` and items\' `selected` properties when `first` property is set', () => {
      //   const options = new MenuOptions(testOptions);
      //   options.first = 1;
      //   expect(options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(1);
      //   expect(options.last).to.be.equal(1);

      //   options[1].options.first = 'bar';
      //   expect(options[1].options.path).to.be.equal('bar');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options[1].options[1].selected).to.be.equal(true);
      //   expect(options[2].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal('bar');
      //   expect(options[1].options.first).to.be.equal('bar');
      //   expect(options[1].options.last).to.be.equal('bar');

      //   options.first = undefined;
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options.first).to.be.equal(undefined);
      //   expect(options.last).to.be.equal(undefined);
      //   expect(options[1].options.first).to.be.equal(undefined);
      //   expect(options[1].options.last).to.be.equal(undefined);

      //   options[2].options[2].options.first = null;
      //   expect(options[1].options.path).to.be.equal('');
      //   expect(options[2].options.path).to.be.equal('buzz,null');
      //   expect(options[2].options[2].options.path).to.be.equal('null');
      //   expect(options[0].selected).to.be.equal(false);
      //   expect(options[1].selected).to.be.equal(false);
      //   expect(options[1].options[1].selected).to.be.equal(false);
      //   expect(options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].selected).to.be.equal(true);
      //   expect(options[2].options[2].options[0].selected).to.be.equal(true);
      //   expect(options.first).to.be.equal(3);
      //   expect(options.last).to.be.equal(null);
      //   expect(options[1].options.first).to.be.equal(undefined);
      //   expect(options[1].options.last).to.be.equal(undefined);
      //   expect(options[2].options.first).to.be.equal('buzz');
      //   expect(options[2].options.last).to.be.equal(null);
      //   expect(options[2].options[2].options.first).to.be.equal(null);
      //   expect(options[2].options[2].options.last).to.be.equal(null);
      // });
      // it('Should update `path`, `first` and `last` on initialization when selected items are provided.', () => {
      //   const testOptionsSelected = JSON.parse(JSON.stringify(testOptions));
      //   testOptionsSelected[1].options[2].options[0] = {value: null, selected: true};

      //   const options = new MenuOptions(testOptionsSelected);

      //   expect(options[1].selected).to.be.equal(true);
      //   expect(options.path).to.be.equal('2,buzz,null');
      //   expect(options.first).to.be.equal(2);
      //   expect(options.last).to.be.equal(null);

      //   expect(options[1].options[2].selected).to.be.equal(true);
      //   expect(options[1].options.path).to.be.equal('buzz,null');
      //   expect(options[1].options.first).to.be.equal('buzz');
      //   expect(options[1].options.last).to.be.equal(null);

      //   expect(options[1].options[2].options[0].selected).to.be.equal(true);
      //   expect(options[1].options[2].options.path).to.be.equal('null');
      //   expect(options[1].options[2].options.first).to.be.equal(null);
      //   expect(options[1].options[2].options.last).to.be.equal(null);
      // });
      // it('Should update `path`, `first` and `last` properties in correct order and only when necessary.', () => {
      //   const options = new MenuOptions(testOptions);
      //   options.addEventListener('object-mutated', () => { eventStack.push('object-mutated'); });
      //   options.addEventListener('path-changed', () => { eventStack.push('path changed: ' + options.path); });
      //   options.addEventListener('first-changed', () => { eventStack.push('firstChanged: ' + options.first); });
      //   options.addEventListener('last-changed', () => { eventStack.push('lastChanged: ' + options.last); });

      //   eventStack.length = 0;
      //   options[0].selected = true;
      //   expect(eventStack).to.be.eql(['path changed: 1', 'firstChanged: 1', 'lastChanged: 1', 'object-mutated']);

      //   eventStack.length = 0;
      //   options[1].options[1].selected = true;
      //   expect(eventStack).to.be.eql(['path changed: 2,bar', 'firstChanged: 2', 'lastChanged: bar', 'object-mutated']);

      //   eventStack.length = 0;
      //   options[2].options[2].options[2].selected = true;
      //   expect(eventStack).to.be.eql(['path changed: 3,buzz,NaN', 'firstChanged: 3', 'lastChanged: NaN', 'object-mutated']);

      //   eventStack.length = 0;
      //   options[2].selected = false;
      //   expect(eventStack).to.be.eql(['path changed: ', 'firstChanged: undefined', 'lastChanged: undefined', 'object-mutated']);

      //   eventStack.length = 0;
      //   options[2].selected = true;
      //   expect(eventStack).to.be.eql(['path changed: 3', 'firstChanged: 3', 'lastChanged: 3', 'object-mutated']);
      // });
    });
  }
}
