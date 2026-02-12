import type { float3, floatQ, long } from "./valueTypes.ts";

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

export type AnyFieldValue = Field<any> | Array<any> | Reference | List;