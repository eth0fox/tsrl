/// <reference path="./primitives.d.ts" />
/// <reference path="./meshImport.d.ts" />
declare namespace TSRL.DataModel {

    export interface Member {
        $type?: string;
        //  Unique ID of this member. Can be used for anything needing to reference this member.;
        id?: string | null;
    }

    export interface Reference extends Member {
        $type: 'reference';
        /**
         * The ID of the target that this reference should be set to.
         * It's important to note that the target needs to be a valid type - it's up to the
         * caller to ensure that target of correct type is being referenced.
         * Set to Null to set the reference to null.
         */
        targetId?: string | null;

        /**
         * The type of target that this reference accepts.
         * Note: This is only for reference. It does not need to be provided when setting a value. However the target must conform to this type.
         */
        targetType?: string;
    }
    export type Worker<BaseFields, ValueFields> = ({
        // Unique ID of this worker. This can be used to reference it from other places.
        id: string;
    } & BaseFields) & (
        ({ isReferenceOnly: true } & Partial<ValueFields>)  |
        ({ isReferenceOnly: false } & ValueFields)
    )


    export type Slot = Worker<{
        parent: Reference;
        position: Field<float3>;
        rotation: Field<floatQ>;
        scale: Field<float3>;
        isActive: Field<boolean>;
        isPersistent: Field<boolean>;
        name: Field<string>;
        tag: Field<string>;
        orderOffset: Field<long>;
    }, {
        components: Component[];
        children: Slot[];  
    }>

    export type Component = Worker<{
        /**
         * Datatype of the component, specified using Resonite's notation (equivalent to the C# notation)
         * This does not need to be specified when updating existing component, as the type cannot be updated over components lifetime.
         */
        componentType: string;
    }, {
        // Members (fields, references, lists...) of this component and their data
        members: Record<string, AnyFieldValue>;
    }>;

    export type CompleteWorker<T> = T & { isReferenceOnly: false };

    export interface List<T = AnyFieldValue> extends Member {
        $type: 'list';
        elements: T[];
    }


    export interface Field<T> {
        $type?: string;
        value: T;
    }
    export interface Array<T> {
        $type?: string;
        values: T[];
    }

    type AnyFieldValue = Field<any> | Array<any> | Reference | List;
}

declare namespace TSRL {

    export interface BaseMessage {
        $type: string;
    }

    export interface GetSlotMessage extends BaseMessage {
        $type: 'getSlot';
        slotId: 'Root' | (string & {});
        /**
         * Indicates if components should be fetched fully with all their data or only as references.
         * Set to False if you plan on fetching the individual component data later.
         */
        includeComponentData: boolean;
        /**
         * How deep to fetch the hierarchy.
         * Value of 0 will fetch only the requested slot fully.
         * Value of 1 will fully fetch the immediate children.
         * Value of -1 will fetch everything fully.
         * Any immediate children of slots beyond this depth will be fetched as references only.
         */
        depth: number;
    }
    export interface AddSlotMessage {
        $type: 'addSlot';
        data: Partial<TSRL.DataModel.Slot>;
    }
    export interface UpdateSlotMessage {
        $type: 'updateSlot';
        data: Partial<TSRL.DataModel.Slot> & Pick<TSRL.DataModel.Slot, 'id'>;
    }
    export interface RemoveSlotMessage {
        $type: 'removeSlot';
        slotId: string;
    }

    export interface GetComponentMessage extends BaseMessage {
        $type: 'getComponent';
       componentId: string;
    }
    export interface AddComponentMessage {
        $type: 'addComponent';
        data: Partial<TSRL.DataModel.Component>;
        // ID of the slot to add this component to
        containerSlotId: string;
    }
    export interface UpdateComponentMessage {
        $type: 'updateComponent';
        data: Partial<TSRL.DataModel.Component> & Pick<TSRL.DataModel.Component, 'id'>;
    }
    export interface RemoveComponentMessage {
        $type: 'removeComponent';
        componentId: string;
    }
    /**
     *  Import a texture asset from a file on the local file system. Note that this must be a file format supported by Resonite, otherwise this will fail. 
        If you are unsure if the file format is supported, send raw texture data instead.
     */
    export interface ImportTexture2DFileMessage extends BaseMessage {
        $type: 'importTexture2DFile';
        filePath: string;
    }

    interface ImportTexture2DRawMessageBase extends BaseMessage {
        width: TSRL.DataModel.int;
        height: TSRL.DataModel.int;
    }
    /**
     * Imports texture from raw 8-bit (RGBA) color data. Resonite will take care of encoding the data into a file format.
     */
    export interface ImportTexture2DRawDataMessage extends ImportTexture2DRawMessageBase {
        $type: 'importTexture2DRawData';
        colorProfile: TSRL.DataModel.ColorProfile;
    }
    /**
     * Imports texture from raw floating point color data (RGBA), allowing for HDR values.
     * Resonite will take care of encoding the data into a file format.
     */
    export interface ImportTexture2DRawDataHDRMessage extends ImportTexture2DRawMessageBase {
        $type: 'importTexture2DRawDataHDR';
    }


    export type ImportMeshJSONMessage = BaseMessage & { $type: 'importMeshJSON'; } & TSRL.Mesh.Mesh;

    // TODO
    export type SubmeshRawData = any;
    export type BlendshapeRawData = any;

    export interface ImportMeshRawDataMessage extends BaseMessage {
        $type: 'importMeshRawData';

        vertexCount: TSRL.DataModel.int;
        hasNormals: boolean;
        hasTangents: boolean;
        hasColors: boolean;
        boneWeightCount: TSRL.DataModel.int;
        uvChannelDimensions: TSRL.DataModel.int[];
        submeshes: SubmeshRawData[];
        blendshapes: BlendshapeRawData[];
        bones: TSRL.Mesh.Bone[];
        
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
        sampleCount: TSRL.DataModel.int;
        sampleRate: TSRL.DataModel.int;
        /**
         * Number of audio channels. 1 mono, 2 stereo, 6 is 5.1 surround
         * It's your responsibility to make sure that Resonite supports given audio channel count
         * The actual audio sample data is interleaved in the buffer
         */
        channelCount: TSRL.DataModel.int;
    }



    
    export type ClientMessage = 
        | GetSlotMessage
        | AddSlotMessage
        | UpdateSlotMessage
        | RemoveSlotMessage
        | GetComponentMessage
        | AddComponentMessage
        | UpdateComponentMessage
        | RemoveComponentMessage
        | ImportTexture2DFileMessage
        | ImportTexture2DRawDataMessage
        | ImportTexture2DRawDataHDRMessage
        | ImportMeshJSONMessage
        | ImportMeshRawDataMessage
        | ImportAudioClipFileMessage
        | ImportAudioClipRawDataMessage
    
    
    export interface Response {
        sourceMessageId: string;
        success: boolean;
        errorInfo?: string;
    }

    export interface SlotDataResponse extends Response {
        depth: number;
        data: TSRL.DataModel.CompleteWorker<TSRL.DataModel.Slot>;
    }
    export interface ComponentDataResponse extends Response {
        data: TSRL.DataModel.CompleteWorker<TSRL.DataModel.Component>;
    }
    export interface AssetDataResponse extends Response {
        /**
            URL of the imported asset. This can be assigned to static asset providers.
            Note: Usually this URL is valid only within the session. It is NOT recommended to persist it outside of the ResoniteLink session - 
            static asset providers will automatically update the URL when the world/item is saved.
         */
        assetURL: string;
    }

    export type MessageResponsesMap = {
        getSlot: SlotDataResponse;
        addSlot: Response;
        updateSlot: Response;
        removeSlot: Response;

        getComponent: ComponentDataResponse;
        addComponent: Response;
        updateComponent: Response;
        removeComponent: Response;

        importTexture2DFile: AssetDataResponse;
        importTexture2DRawData: AssetDataResponse;
        importTexture2DRawDataHDR: AssetDataResponse;

        importMeshJSON: AssetDataResponse;
        importMeshRawData: AssetDataResponse;

        importAudioClipFile: AssetDataResponse;
        importAudioClipRawData: AssetDataResponse;


    }

}