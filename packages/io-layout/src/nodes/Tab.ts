import { Node, ReactiveProperty, Register } from 'io-gui';

export type TabProps = {
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
    args.label = args.label ?? args.id;
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
    this.setProperties({
      id: json.id,
      label: json.label ?? json.id,
      icon: json.icon ?? '',
      selected: json.selected ?? false,
    });
    return this;
  }
}