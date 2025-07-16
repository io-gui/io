import { NodeArray } from 'io-gui';
import { MenuOption } from '../index.js';

const testItemArgs = {
  id: 'root',
  options: [
    {id: '1', label: 'one', options: [
      {id: '1.1', label: 'one.1'},
      {id: '1.2', label: 'one.2'},
    ]},
    {id: '2', label: 'two', options: [
      {id: '2.1', label: 'two.1'},
      {id: '2.2', label: 'two.2'},
    ]},
  ]
}

export default class {
  run() {
    describe('MenuOption', () => {
      it('Should initialize with correct default values', () => {
        const option = new MenuOption({id: 'test'});
        expect(option.value).to.be.equal(undefined);
        expect(option.id).to.be.equal('test');
        expect(option.label).to.be.equal('test');
        expect(option.icon).to.be.equal('');
        expect(option.hint).to.be.equal('');
        expect(option.disabled).to.be.equal(false);
        expect(option.action).to.be.equal(undefined);
        expect(option.mode).to.be.equal('select');
        expect(option.selected).to.be.equal(false);
        expect(option.path).to.be.equal('');
        expect(option.options).to.be.instanceof(NodeArray);
        expect(option.options.length).to.be.equal(0);
      });
      it('Should initialize correctly from constructor arguments', () => {
        let option = new MenuOption({
          value: 1,
          id: 'one',
          label: 'onelabel',
          icon: 'icon:close',
          hint: 'onehint',
          disabled: true,
          action: ()=>{},
          mode: 'select',
          options: [
            {id: 'two', value: 2, label: 'twolabel', selected: true},
            {id: 'three', value: 3, label: 'threelabel', mode: 'toggle', selected: true},
            {id: 'four', value: 4, label: 'fourlabel', selected: true},
          ]
        });
        expect(option.value).to.be.equal(1);
        expect(option.id).to.be.equal('one');
        expect(option.label).to.be.equal('onelabel');
        expect(option.icon).to.be.equal('icon:close');
        expect(option.hint).to.be.equal('onehint');
        expect(option.disabled).to.be.equal(true);
        expect(typeof option.action).to.be.equal('function');
        expect(option.mode).to.be.equal('select');
        expect(option.selected).to.be.equal(true);
        expect(option.selectedIDImmediate).to.be.equal('two');
        expect(option.path).to.be.equal('two');
        expect(option.options).to.be.instanceof(NodeArray);
        expect(option.options.length).to.be.equal(3);
        expect(option.options.selected).to.be.equal('two');
        expect(option.options[0].id).to.be.equal('two');
        expect(option.options[0].value).to.be.equal(2);
        expect(option.options[0].label).to.be.equal('twolabel');
        expect(option.options[0].selected).to.be.equal(true);
        expect(option.options[1].id).to.be.equal('three');
        expect(option.options[1].value).to.be.equal(3);
        expect(option.options[1].label).to.be.equal('threelabel');
        expect(option.options[1].selected).to.be.equal(true);
        expect(option.options[1].mode).to.be.equal('toggle');
        expect(option.options[2].id).to.be.equal('four');
        expect(option.options[2].value).to.be.equal(4);
        expect(option.options[2].label).to.be.equal('fourlabel');
        expect(option.options[2].selected).to.be.equal(false);
        expect(option.options[2].mode).to.be.equal('select');
      });
      it('Should initialize suboptions from constructor arguments', () => {
        let option = new MenuOption(testItemArgs);
        expect(option.options).to.be.instanceof(NodeArray);
        expect(option.options.length).to.be.equal(2);
        expect(option.options[0].options).to.be.instanceof(NodeArray);
        expect(option.options[0].options.length).to.be.equal(2);
        expect(option.options[1].options).to.be.instanceof(NodeArray);
        expect(option.options[1].options.length).to.be.equal(2);
      });
      it('Should select default branch when `selectDefault` is called', () => {
        let option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.selected).to.be.equal(true);
        expect(option.options[0].selected).to.be.equal(true);
        expect(option.options[1].selected).to.be.equal(false);
        expect(option.options[0].options[0].selected).to.be.equal(true);
        expect(option.options[0].options[1].selected).to.be.equal(false);
        expect(option.options[1].options[0].selected).to.be.equal(false);
        expect(option.options[1].options[1].selected).to.be.equal(false);
      });
      it('Should update path when selected', async () => {
        let option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.path).to.be.equal('1,1.1');
        expect(option.options[0].path).to.be.equal('1.1');
        expect(option.options[1].path).to.be.equal('');
        expect(option.options[0].options[0].path).to.be.equal('');
        expect(option.options[0].options[1].path).to.be.equal('');
        expect(option.options[1].options[0].path).to.be.equal('');
        expect(option.options[1].options[1].path).to.be.equal('');

        option.options[1].options[1].selected = true;

        expect(option.path).to.be.equal('2,2.2');
        expect(option.options[0].path).to.be.equal('');
        expect(option.options[1].path).to.be.equal('2.2');
        expect(option.options[0].options[0].path).to.be.equal('');
        expect(option.options[0].options[1].path).to.be.equal('');
        expect(option.options[1].options[0].path).to.be.equal('');
      });
      it('Should update selectedID andselectedIDImmediate when selected', async () => {
        let option = new MenuOption(testItemArgs);
        option.selectDefault();
        expect(option.selectedIDImmediate).to.be.equal('1');
        expect(option.options[0].selectedIDImmediate).to.be.equal('1.1');
        expect(option.options[1].selectedIDImmediate).to.be.equal('');
        expect(option.selectedID).to.be.equal('1.1');

        option.options[1].options[1].selected = true;
        expect(option.selectedIDImmediate).to.be.equal('2');
        expect(option.selectedID).to.be.equal('2.2');
        expect(option.options[0].selectedIDImmediate).to.be.equal('');
        expect(option.options[1].selectedIDImmediate).to.be.equal('2.2');
      });
      it('Should update selected when selectedID and selectedIDImmediate changes', async () => {
        let option = new MenuOption(testItemArgs);
        option.selectedIDImmediate = '1';
        expect(option.selected).to.be.equal(true);
        expect(option.options[0].selected).to.be.equal(true);
        option.selectedID = '2.1';
        expect(option.options[0].selected).to.be.equal(false);
        expect(option.options[0].selectedID).to.be.equal('');
        expect(option.options[0].selectedIDImmediate).to.be.equal('');
        expect(option.options[1].selected).to.be.equal(true);
        expect(option.options[1].selectedID).to.be.equal('2.1');
        expect(option.options[1].selectedIDImmediate).to.be.equal('2.1');
      });
    });
  }
}
