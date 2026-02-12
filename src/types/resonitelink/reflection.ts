import type { ComponentDefinition, EnumDefinition, SyncObjectDefinition, TypeDefinition } from "../models/reflection.ts";
import type { BaseMessage, BaseResponse } from "./base.ts";

export interface GetTypeDefinitionMessage extends BaseMessage {
    $type: 'getTypeDefinition';
    /**
     * Full name of the type we are requesting definition for
     * This can be both a generic type definition or a specific constructed generic type.
     */
    type: string;
}

/**
 * Requests the generic type definition for a particular generic instance type.
 * E.g. if you have generic type such as MyComponent<int>, this will respond with
 * a type definition that is the generic definition MyComponent<T>
 */
export interface GetGenericTypeDefinitionMessage extends BaseMessage {
    $type: 'getGenericTypeDefinition';
    /**
     * The type of the generic instance for which the generic definition is requested
     */
    genericInstanceType: string;
}

/**
 * Requests the generic type definition for a particular generic instance type.
 * E.g. if you have generic type such as MyComponent<int>, this will respond with
 * a type definition that is the generic definition MyComponent<T>
 */
export interface GetEnumDefinitionMessage extends BaseMessage {
    $type: 'getEnumDefinition';
    type: string;
}

export interface GetComponentDefinitionMessage extends BaseMessage {
    $type: 'getComponentDefinition';
    /**
     * The type of the component we're fetching definition for.
     * This MUST be generic type definition for generic components.
     */
    componentType: string;        
    /**
     * Flattening component definition will include all base class members in the definition as well.
     * When false, only members declared on the specific type will be returned - you will need to fetch
     * the base types to construct the whole component.
     */
    flattened: boolean;
}

export interface GetSyncObjectDefinitionMessage extends BaseMessage {
    $type: 'getSyncObjectDefinition';
    /**
     * The type of the sync object we're fetching definition for.
     * This MUST be generic type definition for generic sync objects.
     */
    syncObjectType: string;        
    /**
     * Flattening sync object definition will include all base class members in the definition as well.
     * When false, only members declared on the specific type will be returned - you will need to fetch
     * the base types to construct the whole sync object.
     */
    flattened: boolean;
}

export interface GetComponentTypeListMessage extends BaseMessage {
    $type: 'getComponentTypeList';
    /**
     * The path in the category list that will be returned.
     * Null or empty string will return the root categories.
     * Providing "*" as argument will list ALL components available. Use with caution as this will return a lot of data.
     * Use forward / slashes for separating categories
     */
    categoryPath: null | ('*' | ({} & string));
}


export type ReflectionClientMessage = 
    | GetTypeDefinitionMessage
    | GetGenericTypeDefinitionMessage
    | GetEnumDefinitionMessage
    | GetComponentDefinitionMessage
    | GetSyncObjectDefinitionMessage
    | GetComponentTypeListMessage




export interface TypeDefinitionResponse extends BaseResponse {
    definition: TypeDefinition;
}
export interface EnumDefinitionResponse extends BaseResponse {
    definition: EnumDefinition;
}
export interface ComponentDefinitionResponse extends BaseResponse {
    definition: ComponentDefinition;
}
export interface SyncObjectDefinitionResponse extends BaseResponse {
    definition: SyncObjectDefinition;
}
export interface ComponentTypeListResponse extends BaseResponse {
    componentTypes: string[];
    subcategories: string[];
    // Number of components in the requested category and all subcategories as well
    totalComponentCount: number;
}


export type ReflectionMessageResponsesMap = {
    getTypeDefinition: TypeDefinitionResponse;
    getGenericTypeDefinition: TypeDefinitionResponse;
    getEnumDefinition: EnumDefinitionResponse;
    getComponentDefinition: ComponentDefinitionResponse;
    getSyncObjectDefinition: SyncObjectDefinitionResponse;
    getComponentTypeList: ComponentTypeListResponse;

}