
import { readFileSync } from "fs";
import { inspect } from "node:util";
import { WebSocket } from "ws";
import { ResoniteLink } from "./index.ts";

const host = process.argv[2];
if (!host) {
    console.error("Usage: demo.ts ws://127.0.0.1:1337");
    process.exit(1);
}


let link = await ResoniteLink.connect(host, WebSocket as any);

let testSlot = await link.slotAdd("Root", {
    name: { value: "Test Slot" }
})

// Create a quad with an unlit material
let quadMesh = await link.componentAdd(testSlot, "[FrooxEngine]FrooxEngine.QuadMesh", {})
let material = await link.componentAdd(testSlot, "[FrooxEngine]FrooxEngine.UnlitMaterial", {
    TintColor: { $type: 'colorX', value: { r: 1, g: 0, b: 0, a: 1, profile: "Linear" } }
});
let meshRenderer = await link.componentAdd(testSlot, "[FrooxEngine]FrooxEngine.MeshRenderer", {
    Mesh: { $type: 'reference', targetId: quadMesh  },
    Materials: { $type: 'list', elements: [
        { $type: 'reference', targetId: material }
    ]}
})


// Upload a texture & update the material to use it
const testImage = readFileSync('./sunglass.raw');
let image = await link.importTexture2DRawData(512, 471, testImage);

let texture = await link.componentAdd(testSlot, "[FrooxEngine]FrooxEngine.StaticTexture2D", {
    URL: { $type: 'Uri', value: image }
});
await link.componentUpdate(material, {
    Texture: { $type: 'reference', targetId: texture }
});
console.log("Done, check Resonite!");


process.on('SIGINT', async  () => {
    let slot = await link.slotGet(testSlot, true, 0);
    console.log(inspect(slot, {depth: null}));
    await link.slotRemove(testSlot);
    link.socket.close();
});
link.socket.addEventListener('close', () => {
    console.log('Connection closed, exiting.');
    process.exit(0);
});

