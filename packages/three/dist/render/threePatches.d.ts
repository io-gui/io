/**
 * A runtime fix for a three.js defect, kept until three fixes it. Patches apply when this module loads.
 * `threePatches.test.ts` fails once unpatched three no longer has a patch's defect: then delete the patch.
 */
export interface ThreePatch {
    readonly id: string;
    /** Whether unpatched three still has the defect. */
    hasDefect(): boolean;
}
/** The patches in effect. */
export declare const threePatches: readonly ThreePatch[];
