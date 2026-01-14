type VectorType<BaseType, Length extends 1 | 2 | 3 | 4> = 
    Length extends 1 ? { x: BaseType } :
    Length extends 2 ? { x: BaseType; y: BaseType } :
    Length extends 3 ? { x: BaseType; y: BaseType; z: BaseType } :
    Length extends 4 ? { x: BaseType; y: BaseType; z: BaseType; w: BaseType } :
    never;


namespace ResoniteLink.DataModel {
    export type float = number;
    export type double = number;
    export type byte = number;
    export type ushort = number;
    export type uint = number;
    export type ulong = number;
    export type sbyte = number;
    export type short = number;
    export type int = number;
    export type long = number;



    export type float2 = VectorType<float, 2>;
    export type float3 = VectorType<float, 3>;
    export type float4 = VectorType<float, 4>;
    export type double2 = VectorType<double, 2>;
    export type double3 = VectorType<double, 3>;
    export type double4 = VectorType<double, 4>;
    export type byte2 = VectorType<byte, 2>;
    export type byte3 = VectorType<byte, 3>;
    export type byte4 = VectorType<byte, 4>;
    export type ushort2 = VectorType<ushort, 2>;
    export type ushort3 = VectorType<ushort, 3>;
    export type ushort4 = VectorType<ushort, 4>;
    export type uint2 = VectorType<uint, 2>;
    export type uint3 = VectorType<uint, 3>;
    export type uint4 = VectorType<uint, 4>;
    export type ulong2 = VectorType<ulong, 2>;
    export type ulong3 = VectorType<ulong, 3>;
    export type ulong4 = VectorType<ulong, 4>;
    export type sbyte2 = VectorType<sbyte, 2>;
    export type sbyte3 = VectorType<sbyte, 3>;
    export type sbyte4 = VectorType<sbyte, 4>;
    export type short2 = VectorType<short, 2>;
    export type short3 = VectorType<short, 3>;
    export type short4 = VectorType<short, 4>;
    export type int2 = VectorType<int, 2>;
    export type int3 = VectorType<int, 3>;
    export type int4 = VectorType<int, 4>;
    export type long2 = VectorType<long, 2>;
    export type long3 = VectorType<long, 3>;
    export type long4 = VectorType<long, 4>;

    export type floatQ = VectorType<float, 4>;
    export type doubleQ = VectorType<double, 4>;

    export type bool2 = VectorType<boolean, 2>;
    export type bool3 = VectorType<boolean, 3>;
    export type bool4 = VectorType<boolean, 4>;


}
