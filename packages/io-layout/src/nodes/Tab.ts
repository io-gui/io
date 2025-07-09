import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';

export type TabProps = NodeProps & {
  id: string,
  label?: string,
  icon?: string,
  selected?: boolean,
};

@Register
export class Tab extends Node {

  @ReactiveProperty({type: String, value: ''})
  declare id: string;

  @ReactiveProperty({type: String, value: ''})
  declare label: string;

  @ReactiveProperty({type: String, value: ''})
  declare icon: string;

  @ReactiveProperty({type: Boolean, value: false})
  declare selected: boolean;

  constructor(args: TabProps) {
    if (!args.label) args.label = args.id;
    super(args);
  }

  toJSON(): TabProps {
    return {
      id: this.id,
      label: this.label,
      icon: this.icon,  
      selected: this.selected,
    };
  }

  fromJSON(json: TabProps) {
    this.id = json.id;
    if (json.label) {
      this.label = json.label;
    } else {
      this.label = json.id;
    }
    if (json.icon) this.icon = json.icon;
    if (json.selected) this.selected = json.selected;
    return this;
  }
}