import type { CompleteWorker, Component, Slot } from "../models/dataModel.ts";
import type { BaseMessage, BaseResponse } from "./base.ts";

/**
 *  Batch of individual data model operation messages. All of these are guaranteed to be processed in sequence
 *  without any engine updates in between. This can prevent the engine updates or user actions affecting the updated objects.
 *  IMPORTANT!!! You can only include messages that derive from DataModelOperation base class.
 * Other message types cannot be batched, as they are not processed in sync with the data model.
 */
export interface DataModelOperationBatchMessage extends BaseMessage {
    $type: 'dataModelOperationBatch';
    operations: DataModelOperationClientMessage[]; 
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
export interface AddSlotMessage extends BaseMessage  {
    $type: 'addSlot';
    data: Partial<Slot>;
}
export interface UpdateSlotMessage extends BaseMessage  {
    $type: 'updateSlot';
    data: Partial<Slot> & Pick<Slot, 'id'>;
}
export interface RemoveSlotMessage extends BaseMessage  {
    $type: 'removeSlot';
    slotId: string;
}

export interface GetComponentMessage extends BaseMessage {
    $type: 'getComponent';
    componentId: string;
}
export interface AddComponentMessage extends BaseMessage  {
    $type: 'addComponent';
    data: Partial<Component>;
    // ID of the slot to add this component to
    containerSlotId: string;
}
export interface UpdateComponentMessage extends BaseMessage  {
    $type: 'updateComponent';
    data: Partial<Component> & Pick<Component, 'id'>;
}
export interface RemoveComponentMessage extends BaseMessage  {
    $type: 'removeComponent';
    componentId: string;
}


export type DataModelOperationClientMessage = 
    | GetSlotMessage
    | AddSlotMessage
    | UpdateSlotMessage
    | RemoveSlotMessage
    | GetComponentMessage
    | AddComponentMessage
    | UpdateComponentMessage
    | RemoveComponentMessage


export type DataModelClientMessage = 
    | DataModelOperationClientMessage
    | DataModelOperationBatchMessage;


/**
 * Represents a response to a batch of messages, e.g DataModelOperationBatch, containing individual responses to each.
 * IMPORTANT: Note that Success on this message itself only indicates that the batch itself was processed successfully,
 * but not necessarily that each individual message has succeeded. You need to check each individual response for this.
 */
export interface DataModelBatchResponse extends BaseResponse {
    responses: DataModelMessageResponsesMap[DataModelOperationClientMessage['$type']][];
}

export interface SlotDataResponse extends BaseResponse {
    depth: number;
    data: CompleteWorker<Slot>;
}
export interface ComponentDataResponse extends BaseResponse {
    data: CompleteWorker<Component>;
}



export type DataModelMessageResponsesMap = {
    dataModelOperationBatch: DataModelBatchResponse;

    getSlot: SlotDataResponse;
    addSlot: BaseResponse;
    updateSlot: BaseResponse;
    removeSlot: BaseResponse;

    getComponent: ComponentDataResponse;
    addComponent: BaseResponse;
    updateComponent: BaseResponse;
    removeComponent: BaseResponse;
}

