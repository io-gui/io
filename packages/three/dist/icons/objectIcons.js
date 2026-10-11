import { AmbientLight, ArrayCamera, ArrowHelper, Audio, AudioListener, AxesHelper, BatchedMesh, Bone, Box3Helper, BoxHelper, Camera, CameraHelper, ClippingGroup, CubeCamera, DirectionalLight, DirectionalLightHelper, GridHelper, Group, HemisphereLight, HemisphereLightHelper, InstancedMesh, LOD, Light, LightProbe, Line, LineLoop, LineSegments, Mesh, Object3D, PlaneHelper, PointLight, PointLightHelper, Points, PolarGridHelper, PositionalAudio, ProjectorLight, RectAreaLight, Scene, SkeletonHelper, SkinnedMesh, SpotLight, SpotLightHelper, Sprite, } from 'three/webgpu';
import './threeIcons.js';
const objectIcons = new Map();
/** Shows `icon` (a `namespace:id` reference) for objects of `type` and of its subclasses that have no icon of their own. */
export function registerObjectIcon(type, icon) {
    objectIcons.set(type, icon);
}
/** The icon of the nearest class in the object's prototype chain that has one registered. */
export function getObjectIcon(object) {
    for (let prototype = Object.getPrototypeOf(object); prototype; prototype = Object.getPrototypeOf(prototype)) {
        const icon = objectIcons.get(prototype.constructor);
        if (icon)
            return icon;
    }
    // An Object3D of another three.js instance.
    return 'three:object';
}
// Every Object3D class in three.js. The rest (QuadMesh, BundleGroup, IESSpotLight, OrthographicCamera, ...) show
// their base class's icon.
registerObjectIcon(Object3D, 'three:object');
registerObjectIcon(Scene, 'three:scene');
registerObjectIcon(Group, 'three:group');
registerObjectIcon(ClippingGroup, 'three:clipping_group');
registerObjectIcon(Mesh, 'three:mesh');
registerObjectIcon(SkinnedMesh, 'three:skinned_mesh');
registerObjectIcon(InstancedMesh, 'three:instanced_mesh');
registerObjectIcon(BatchedMesh, 'three:batched_mesh');
registerObjectIcon(Bone, 'three:bone');
registerObjectIcon(LOD, 'three:lod');
registerObjectIcon(Line, 'three:line');
registerObjectIcon(LineSegments, 'three:line_segments');
registerObjectIcon(LineLoop, 'three:line_loop');
registerObjectIcon(Points, 'three:points');
registerObjectIcon(Sprite, 'three:sprite');
registerObjectIcon(Camera, 'three:camera');
registerObjectIcon(ArrayCamera, 'three:array_camera');
registerObjectIcon(CubeCamera, 'three:cube_camera');
registerObjectIcon(Light, 'three:light');
registerObjectIcon(AmbientLight, 'three:ambient_light');
registerObjectIcon(DirectionalLight, 'three:directional_light');
registerObjectIcon(HemisphereLight, 'three:hemisphere_light');
registerObjectIcon(PointLight, 'three:point_light');
registerObjectIcon(SpotLight, 'three:spot_light');
registerObjectIcon(ProjectorLight, 'three:projector_light');
registerObjectIcon(RectAreaLight, 'three:rect_area_light');
registerObjectIcon(LightProbe, 'three:light_probe');
registerObjectIcon(Audio, 'three:audio');
registerObjectIcon(PositionalAudio, 'three:positional_audio');
registerObjectIcon(AudioListener, 'three:audio_listener');
registerObjectIcon(ArrowHelper, 'three:arrow_helper');
registerObjectIcon(AxesHelper, 'three:axes_helper');
registerObjectIcon(BoxHelper, 'three:box_helper');
registerObjectIcon(Box3Helper, 'three:box_helper');
registerObjectIcon(CameraHelper, 'three:camera_helper');
registerObjectIcon(GridHelper, 'three:grid_helper');
registerObjectIcon(PolarGridHelper, 'three:polar_grid_helper');
registerObjectIcon(PlaneHelper, 'three:plane_helper');
registerObjectIcon(SkeletonHelper, 'three:skeleton_helper');
registerObjectIcon(DirectionalLightHelper, 'three:light_helper');
registerObjectIcon(HemisphereLightHelper, 'three:light_helper');
registerObjectIcon(PointLightHelper, 'three:light_helper');
registerObjectIcon(SpotLightHelper, 'three:light_helper');
