import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';

export type TabProps = NodeProps & {
  id: string,
  label?: string,
  icon?: string,
};

@Register
export class Tab extends Node {

  @ReactiveProperty({type: String, value: ''})
  declare id: string;

  @ReactiveProperty({type: String, value: ''})
  declare label: string;

  @ReactiveProperty({type: String, value: ''})
  declare icon: string;

  constructor(args: TabProps) {
    if (!args.label) args.label = args.id;
    super(args);
  }

  toJSON(): TabProps {
    return {
      id: this.id,
      label: this.label,
      icon: this.icon,
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
    return this;
  }
}