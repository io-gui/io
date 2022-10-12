import { IoElement } from '../../core/element.js';
export declare class IoProperties extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Config(): {
        'type:string': {}[];
        'type:number': (string | {
            step: number;
        })[];
        'type:boolean': {}[];
        'type:object': {}[];
        'type:null': {}[];
        'type:undefined': {}[];
    };
    _onValueSet(event: CustomEvent): void;
    _getConfig(): any;
    valueMutated(): void;
    changed(): void;
    _changedThrottled(): void;
    _onChange(): void;
    static RegisterConfig: (config: any) => void;
}
//# sourceMappingURL=properties.d.ts.map