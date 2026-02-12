import type { color, float, float2, float3, float4, float4x4, int } from "./valueTypes.ts";

export type UV_Coordinate = 
    | ({ $type: '2D'; uv: float2 })
    | ({ $type: '3D'; uv: float3 })
    | ({ $type: '4D'; uv: float4 })


/**
 * Maps vertex to a specific bone with specific height
 */
export interface BoneWeight {
    /**
     * Index of the bone this maps too in the Bones list of the mesh
     */
    boneIndex: int;
    /**
     * Weight from 0...1 that influences how much is this vertex affected by the bone.
     */
    weight: float;
}

/**
 *  Defines a single vertex of a mesh. Position is mandatory field, but all other properties are optional.
 */
export interface Vertex {
    /**
     * Position of the vertex.
     */
    position: float3;
    /**
     * Normal vector of the vertex
     */
    normal?: float3;
    /**
     * Tangent vector of the vertex. The 4th component indicates direction of the binormal
     * When specifying tangent, it's strongly recommended that normals are specified too.
     */
    tangent?: float4;
    /**
     * Color of the vertex
     */
    color?: color;
    /**
     * UV channel coordinates.
     * Each vertex can have multiple UV channels.
     * Each UV channel can have 2-4 dimensions.
     * The number of channels and dimensions for each MUST be same across all vertices.
     */
    uvs?: UV_Coordinate[];
    /**
     * Weights that define how much this vertex is affected by specific bones for skinned meshes.
     * The weights should add up to 1 across all the weights.
     */
    boneWeights?: BoneWeight[];
}


interface PointSubmesh {
    $type: 'points';
    /**
     * Indexes of vertices for each point in this submesh.
     */
    vertexIndices: int[];
}


/**
 * Represents a single triangle of a mesh
 */
export interface Triangle {
    /**
     * Index of the first vertex that forms this triangle
     */
    vertex0Index: int;
    /**
     * Index of the second vertex that forms this triangle
     */
    vertex1Index: int;
    /**
     * Index of the third vertex that forms this triangle
     */
    vertex2Index: int;
}

/**
 * A submesh composed of individual triangles.
 */
interface TriangleSubmesh {
    $type: 'triangles';
    /**
     * All the triangles that form this submesh
     */
    triangles: Triangle[];
}

/**
 * A submesh composed of individual triangles.
 * This is an alternate representation and will result in same submesh as TriangleSubmesh
 * With this representation you must take care to provide the indices for each triangle properly.
 * Each triangle requires three indices. Those indices are consecutive.
 */
interface TriangleSubmeshFlat {
    $type: 'trianglesFlat';
    /**
     * Indexes of vertices representing triangles of this mesh.
     * Note that each triangle needs three consecutive indices in this list.
     */
    vertexIndices: int[];
}

export type Submesh = PointSubmesh | TriangleSubmesh | TriangleSubmeshFlat;

/**
 * Represents a bone of a mesh
 */
export interface Bone {
    /**
     *  Name of the bone.
     * This generally doesn't have much actual function for mesh data, but is useful for references and debugging.
     */
    name: string;
    /**
     * The bind pose of the bone - its default transform in model space.
     * This is essentially the pose of the bone relative to the vertices where the vertices bound to it will be in their original spot. 
     */
    bindPose: float4x4;
}

export interface BlendshapeFrame {
    /**
     * Position of the frame within the blendshape animation
     * When blendshape has only a single frame, this should be set to 1.0
     * With multiple frames per blendshape, this determines the position at which this set of deltas is fully applied.
     */
    position: float;
    /**
     * Delta values for vertex positions of this blendshape frame.
     * Number of deltas MUST match number of vertices
     */
    positionDeltas: float3[];
    /**
     * Optional. Delta values for vertex normals of this blendshape frame.
     * Number of deltas MUST match number of vertices
     */
    normalDeltas?: float3[];
    /**
     * Optional. Delta values for vertex tangents of this blendshape frame.
     * Number of deltas MUST match number of vertices
     */
    tangentDeltas?: float3[];
}

export interface BlendShape {
    name: string;
    /**
     * Frames that compose this blendshape
     * Blendshapes need at least 1 frame
     */
    frames: BlendshapeFrame[];
}

export interface Mesh {
    /**
     * Vertices of this mesh. These are shared across sub-meshes
     */
    vertices: Vertex[];

    /**
     * List of submeshes (points, triangles...) representing this mesh.
     * Meshes will typically have at least one submesh.
     * Each submesh uses indices of the vertices for its primitives.
     */
    submeshes: Submesh[];

    /**
     * Bones of the mesh when data represents a skinned mesh.
     * These will be referred to by their index from vertex data.
     */
    bones: Bone[];


    /**
     * Blendshapes of this mesh.
     * These allow modifying the vertex positions, normals & tangents for animations such as facial expressions.
     */
    blendshapes: BlendShape[];
}
