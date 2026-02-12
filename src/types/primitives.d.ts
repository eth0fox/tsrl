type VectorType<BaseType, Length extends 1 | 2 | 3 | 4> = 
    Length extends 1 ? { x: BaseType } :
    Length extends 2 ? { x: BaseType; y: BaseType } :
    Length extends 3 ? { x: BaseType; y: BaseType; z: BaseType } :
    Length extends 4 ? { x: BaseType; y: BaseType; z: BaseType; w: BaseType } :
    never;


declare namespace TSRL.DataModel {
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


    export interface float2x2 {
        m00: float; m01: float;
        m10: float; m11: float;
    }
    export interface float3x3 {
        m00: float; m01: float; m02: float;
        m10: float; m11: float; m12: float;
        m20: float; m21: float; m22: float;
    }
    export interface float4x4 {
        m00: float; m01: float; m02: float; m03: float;
        m10: float; m11: float; m12: float; m13: float;
        m20: float; m21: float; m22: float; m23: float;
        m30: float; m31: float; m32: float; m33: float;
    }

    export interface double2x2 {
        m00: double; m01: double;
        m10: double; m11: double;
    }
    export interface double3x3 {
        m00: double; m01: double; m02: double;
        m10: double; m11: double; m12: double;
        m20: double; m21: double; m22: double;
    }
    export interface double4x4 {
        m00: double; m01: double; m02: double; m03: double;
        m10: double; m11: double; m12: double; m13: double;
        m20: double; m21: double; m22: double; m23: double;
        m30: double; m31: double; m32: double; m33: double;
    }



    export type ColorProfile = 
        | "Linear" // Represents an sRGB-like color space (primaries and white point) with a linear transfer function, and a linear alpha channel. 
        | "sRGB" // Represents the sRGB color space, with a linear alpha channel. 
        | "sRGBAlpha" //Represents the sRGB color space, with gamma applied to the alpha channel. Note that this profile is deprecated and may be removed in the future

    export interface color {
        r: float;
        g: float;
        b: float;
        a: float;
    }
    export interface colorX {
        r: float;
        g: float;
        b: float;
        a: float;
        profile: ColorProfile;
    }
    export interface color32 {
        r: byte;
        g: byte;
        b: byte;
        a: byte;
    }
}
