declare namespace TSRL.Reflection {
    /**
     * Represents a reference to another type - typically base type or an interface
     */
    export interface TypeReference {
        /**
         * The typename of the referenced type. For generic types, this will always be generic type definition.
         * For generic types the arguments are specified separately.
         */
        type: string;

        /**
         * Indicates that the type represents a generic parameter. This is not a type of its own, but a placeholder that should
         * be replaced with another type when a generic instance is made.
         */
        isGenericParameter: boolean;

        /**
         * For generic referenced types, this is list of generic arguments used.
         * These can be either actual types - or they can be the generic parameters of the derived class.
         * Make sure to check if the name of the generic parameter matches the generic parameters first before trying to get the type definition!
         */
        genericArguments?: TypeReference[];
    }

    export interface GenericParameter {
        /**
         * Name of the generic parameter. This is used to match up
         */
        name: string;

        /**
         * List of types that this generic parameter must match. These are typically classes/interfaces.
         * Special constraints like struct/unmanaged/class are represented through other properties.
         * They can be combined with types constraints.
         */
        types?: TypeReference[];

        /**
         * Requires that this parameter is an unmanaged type
         * See C# documentation for the unmanaged keyword
         */
        unmanaged: boolean;

        /**
         * Requires that this parameter is a struct type
         * See C# documentation for the struct keyword
         */
        struct: boolean;

        /**
         * Requires this parameter to be an enum type
         */
        enum: boolean;

        /**
         * Requires that this parameter is a class type
         * See C# documentation for the struct keyword
         */
        class: boolean;
    }

    export interface TypeDefinition {
        /**
         * Contains definition of base type of this type if requested and if the base type is relevant to ResoniteLink.
         */
        baseType?: TypeReference;

        /**
         * The full type encoded using Resonite's type encoding (which is similar to C# type definitions)
         * Useful for matching the exact types and when providing the type to Resonite when instantiating
         */
        fullTypeName: string;

        /**
         * Name of the assembly that this type is contained in. This is only filled for Resonite data model types.
         */
        assemblyName?: string;

        /**
         * Full namespace path where this type is defined
         */
        namespace?: string;

        /**
         * Name of the type itself, without namespace or generic arguments
         */
        name: string;

        /**
         * Abstract types cannot ever be instantiated - they are just used as base types for other types
         */
        isAbstract: boolean;

        /**
         * Indicates if this type is an interface
         */
        isInterface: boolean;

        /**
         * Indicates if this is a generic type. Generic types have generic parameters, which allow to substitute different
         * types within the type.
         */
        isGenericType: boolean;

        /**
         * Indicates if this is a definition of a generic type - it represents the "core" type without any generic arguments.
         */
        isGenericTypeDefinition: boolean;

        /**
         * Number of direct generic parameters on this type. This matters primarily for nested types, where the generic parameters/arguments
         * can be spread throughout the base classes.
         */
        directGenericParameterCount: number;

        /**
         * Indicates if this datatype is an engine primitive - one that can be used as value in fields
         */
        isEnginePrimitive: boolean;

        /**
         * Indicates if this represents a value type (e.g. struct)
         */
        isValueType: boolean;

        /**
         * Indicates if this datatype is an enum. You can request details about the enum, including its values separately.
         */
        isEnum: boolean;

        /**
         * Indicates if this type represents a component
         */
        isComponent: boolean;

        /**
         * Indicates if this type represents a sync object
         */
        isSyncObject: boolean;

        /**
         * Indicates if this type represents a world element - a type that can be referenced by the data model
         */
        isWorldElement: boolean;

        /**
         * Indicates if this type is nested within another type definition
         */
        isNested: boolean;

        /**
         * When the type is nested, this contains the name of the type that is declaring this particular type.
         */
        declaringType?: string;

        /**
         * For generic types, this lists all the generic arguments for this type when they're provided.
         * If the type represents a generic type definition, it will not include those.
         * This is only populated when the type is a generic type and is NOT a generic type definition.
         */
        genericArguments?: TypeReference[];

        /**
         * List of generic parameters and their constraints for generic types.
         * This is only populated for generic types.
         */
        genericParameters?: GenericParameter[];

        /**
         * List of interfaces that this type implements. This includes interfaces only specified on the type itself.
         * You will need to check the base type for inherited interfaces.
         */
        interfaces?: TypeReference[];
    }

    export interface EnumDefinition {
        /**
         * Structured type information of the enum
         */
        type: TypeDefinition;

        /**
         * The backing datatype of this enum. Typically int, but some enums can use byte, short, long and so on.
         */
        backingType: string;

        /**
         * Names of values of this enum and their associated values.
         * Note that there can be multiple names for the same value.
         */
        values: Record<string, number>;

        /**
         * Does this enum represent flags?
         */
        isFlags: boolean;
    }


    export interface MemberDefinitionBase {
        /**
         * The full type of the member itself.
         * It's recommended to use the subtypes as they provide more structured information for various subtypes when possible.
         * The full type is however useful when matching up members for references.
         */
        type: string;
    }

    export interface FieldDefinition extends MemberDefinitionBase {
        $type: 'field';
        /**
         * The datatype of the value this field holds. This will typically be primitive types like float, int, bool, float3 and so on
         * However it can also be a generic parameter for generic container types
         */
        valueType: TypeReference;
    }

    export interface ReferenceDefinition extends MemberDefinitionBase {
        $type: 'reference';
        /**
         * Datatype of the target of this reference. This is a full type reference, so it can contain other generic arguments/parameters.
         */
        targetType: TypeReference;
    }
    export interface ListDefinition extends MemberDefinitionBase {
        $type: 'list';
        /**
         * Definition of the elements in this list. Lists contain other members as their elements, all of the same type.
         */
        elementDefinition: MemberDefinition;
    }
    export interface ArrayDefinition extends MemberDefinitionBase {
        $type: 'array';
        /**
         * The datatype of each element in the array that it holds. Typically primitives like float, int bool, float3 and so on
         * However it can also be a generic parameter for generic container types
         */
        valueType: TypeReference;
    }
    /**
     * SyncObjects are entities that are members of a container (like a component), which contain their own members.
     * This indicates that a sync member is embedded as a member
     */
    export interface SyncObjectMemberDefinition {
        $type: 'syncObject';
        type: TypeReference;
    }
    /**
     *  Empty members don't contain any data model data, but they can be referenced by other pieces of code.
     * This is often used for linking things, e.g. ProtoFlux nodes.
     */
    export interface EmptyMemberDefinition extends MemberDefinitionBase {
        $type: 'empty';
        /**
         * The full type of this empty member.
         * This can be used to differentiate the different types from each other.
         */
        memberType: TypeReference;
    }





    export type MemberDefinition = 
        | FieldDefinition
        | ReferenceDefinition
        | ListDefinition
        | ArrayDefinition
        | SyncObjectMemberDefinition
        | EmptyMemberDefinition;



    export interface WorkerDefinition {
        /**
         * Structured type definition of this component. This is particularly important for generic components, as it will
         * contain information about the generic parameters and constraints. These generic parameters need to be substituted
         * for the desired type in the members.
         */
        type: TypeDefinition;

        /**
         * List of all members and their definitions that this container has.
         */
        members: Record<string, MemberDefinition>;
    }

    /**
     * Definition of a component type
     */
    export interface ComponentDefinition extends WorkerDefinition {
        /**
         * Indicates of the base type of this component is also a component and should have its bindings generated.
         * When false, the base type should not be treated like a component anymore.
         */
        baseTypeIsComponent: boolean;

        /**
         * The path where this component is categorized to
         */
        categoryPath: string;
    }


    /**
     * Definition of a sync object type
     */
    export interface SyncObjectDefinition extends WorkerDefinition {
        /**
         * Indicates of the base type of this sync object is also a sync object and should have its bindings generated.
         * When false, the base type should not be treated like a sync object anymore.
         */
        baseTypeIsSyncObject: boolean;
    }

    
}


declare namespace TSRL {

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




    export interface TypeDefinitionResponse extends Response {
        definition: Reflection.TypeDefinition;
    }
    export interface EnumDefinitionResponse extends Response {
        definition: Reflection.EnumDefinition;
    }
    export interface ComponentDefinitionResponse extends Response {
        definition: Reflection.ComponentDefinition;
    }
    export interface SyncObjectDefinitionResponse extends Response {
        definition: Reflection.SyncObjectDefinition;
    }
    export interface ComponentTypeListResponse extends Response {
        componentTypes: string[];
        subcategories: string[];
        // Number of components in the requested category and all subcategories as well
        totalComponentCount: number;
    }



}