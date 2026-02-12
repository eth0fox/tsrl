import type { AssetImportClientMessage, AssetResponseMap } from "./assets.ts";
import type { BaseMessage, BaseResponse } from "./base.ts";
import type { DataModelClientMessage, DataModelMessageResponsesMap } from "./datamodel.ts";
import type { ReflectionClientMessage, ReflectionMessageResponsesMap } from "./reflection.ts";

export type * from "./assets.ts";
export type * from "./base.ts";
export type * from "./datamodel.ts";
export type * from "./reflection.ts";


export interface RequestSessionDataMessage extends BaseMessage {
    $type: 'requestSessionData';
}


export type ClientMessage = 
    | DataModelClientMessage
    | ReflectionClientMessage
    | AssetImportClientMessage
    //
    | RequestSessionDataMessage


export interface SessionDataResponse extends BaseResponse {
    resoniteVersion: string;
    resoniteLinkVersion: string;
    /**
     * An ID uniquely identifying this ResoniteLink session for a given Resonite session
     * The ID is unique for as long as particular session runs on Resonite's end
     * The ID is NOT guaranteed to be unique for different Resonite worlds with ResoniteLink enabled
     * The ID is NOT guaranteed to be unique when the Resonite world restarts
     * You can use this ID to ensure that any ID's you generate do not conflict with any other
     * ResoniteLink session for a given Resonite world.
     */
    uniqueSessionId: string;
}

export type MessageResponsesMap =  
    & DataModelMessageResponsesMap 
    & ReflectionMessageResponsesMap
    & AssetResponseMap
    & {
        requestSessionData: SessionDataResponse;
    }
