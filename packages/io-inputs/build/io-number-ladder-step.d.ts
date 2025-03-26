import { IoField } from 'io-gui';
export declare class IoNumberLadderStep extends IoField {
    static get Style(): string;
    value: number;
    type: string;
    role: string;
    _onKeydown(event: KeyboardEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    init(): void;
    changed(): void;
}
//# sourceMappingURL=io-number-ladder-step.d.ts.map