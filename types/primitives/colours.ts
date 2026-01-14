
namespace ResoniteLink.DataModel {
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