import { IoElement } from '../../components/io-element.js';
import { Property } from '../../core/properties.js';
declare type UniformTypes = BooleanConstructor | NumberConstructor | ArrayConstructor;
export declare class IoGl extends IoElement {
    static get Style(): string;
    static get Properties(): {
        size: number[];
        color: {
            value: number[];
            observe: boolean;
        };
        pxRatio: number;
        css: {
            type: ObjectConstructor;
            observe: boolean;
        };
    };
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: Property): string;
    initShader(): WebGLProgram;
    constructor(properties?: Record<string, any>);
    onResized(): void;
    cssMutated(): void;
    changed(): void;
    render(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: Property): void;
    updateCssUniforms(): void;
    setUniform(name: string, type: UniformTypes, value: any): void;
}
export {};
//# sourceMappingURL=gl.d.ts.map