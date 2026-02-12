
import type { Bone, Mesh } from "../models/mesh.ts";
import type { ColorProfile, int } from "../models/valueTypes.ts";
import type { BaseMessage, BaseResponse } from "./base.ts";


/**
 * Import a texture asset from a file on the local file system. Note that this must be a file format supported by Resonite, otherwise this will fail. 
 * If you are unsure if the file format is supported, send raw texture data instead.
 */
export interface ImportTexture2DFileMessage extends BaseMessage {
    $type: 'importTexture2DFile';
    filePath: string;
}

interface ImportTexture2DRawMessageBase extends BaseMessage {
    width: int;
    height: int;
}
/**
 * Imports texture from raw 8-bit (RGBA) color data. Resonite will take care of encoding the data into a file format.
 */
export interface ImportTexture2DRawDataMessage extends ImportTexture2DRawMessageBase {
    $type: 'importTexture2DRawData';
    colorProfile: ColorProfile;
}
/**
 * Imports texture from raw floating point color data (RGBA), allowing for HDR values.
 * Resonite will take care of encoding the data into a file format.
 */
export interface ImportTexture2DRawDataHDRMessage extends ImportTexture2DRawMessageBase {
    $type: 'importTexture2DRawDataHDR';
}


export type ImportMeshJSONMessage = BaseMessage & { $type: 'importMeshJSON'; } & Mesh;

// TODO
export type SubmeshRawData = any;
export type BlendshapeRawData = any;

export interface ImportMeshRawDataMessage extends BaseMessage {
    $type: 'importMeshRawData';

    vertexCount: int;
    hasNormals: boolean;
    hasTangents: boolean;
    hasColors: boolean;
    boneWeightCount: int;
    uvChannelDimensions: int[];
    submeshes: SubmeshRawData[];
    blendshapes: BlendshapeRawData[];
    bones: Bone[];
    
}



/**
 * Import a audio clip asset from a file on the local file system. Note that this must be a file
 * format supported by Resonite, otherwise this will fail. 
 * If you are unsure if the file format is supported, send raw audio data instead.
 * Generally WAV, OGG & FLAC files are supported as audio clips.
 */
export interface ImportAudioClipFileMessage extends BaseMessage {
    $type: 'importAudioClipFile';
    filePath: string;
}
export interface ImportAudioClipRawDataMessage extends BaseMessage {
    $type: 'importAudioClipRawData';
    /**
     * Number of audio samples in this audio clip. This does NOT account for channel count and will be the same regardless of mono/stereo/5.1 etc.
     */
    sampleCount: int;
    sampleRate: int;
    /**
     * Number of audio channels. 1 mono, 2 stereo, 6 is 5.1 surround
     * It's your responsibility to make sure that Resonite supports given audio channel count
     * The actual audio sample data is interleaved in the buffer
     */
    channelCount: int;
}


export type AssetImportClientMessage =
    | ImportTexture2DFileMessage
    | ImportTexture2DRawDataMessage
    | ImportTexture2DRawDataHDRMessage
    | ImportMeshJSONMessage
    | ImportMeshRawDataMessage
    | ImportAudioClipFileMessage
    | ImportAudioClipRawDataMessage;



export interface AssetDataResponse extends BaseResponse {
    /**
        URL of the imported asset. This can be assigned to static asset providers.
        Note: Usually this URL is valid only within the session. It is NOT recommended to persist it outside of the ResoniteLink session - 
        static asset providers will automatically update the URL when the world/item is saved.
        */
    assetURL: string;
}

export type AssetResponseMap = Record<AssetImportClientMessage['$type'], AssetDataResponse>;
