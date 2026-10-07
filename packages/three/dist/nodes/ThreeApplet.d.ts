import { Scene, ToneMapping } from 'three/webgpu';
import { ThreeEditor, ThreeEditorProps } from '../editor/ThreeEditor.js';
export type ThreeAppletProps = ThreeEditorProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
};
/**
 * Compatibility shim (ADR-0002): a ThreeEditor with one document whose `scene`, `toneMapping` and
 * `toneMappingExposure` are two-way bound to the applet's own properties. New apps use ThreeEditor
 * and ThreeDocument directly. After replacing `applet.document`, the applet properties no longer follow it.
 */
export declare class ThreeApplet extends ThreeEditor {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
    constructor(args?: ThreeAppletProps);
}
