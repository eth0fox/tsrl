
import { WebSocket } from "ws";
import { ResoniteLink } from "..";

const host = process.argv[2];
if (!host) {
    console.error("Usage: demo.ts ws://127.0.0.1:1337");
    process.exit(1);
}


let link = await ResoniteLink.connect(host, WebSocket as any);
console.log(await link.requestSessionData());


let componentTypes = await link.getComponentTypeList('Transform');
console.log("Components in 'Transform' category: ", componentTypes);
let transformDef = await link.getComponentDefinition('[FrooxEngine]FrooxEngine.LookAtUser', true);
console.log("Members of LookAtUser: ");
console.table(transformDef.members)

let userDef = await link.getSyncObjectDefinition('[FrooxEngine]FrooxEngine.Sync<[FrooxEngine]FrooxEngine.User>');
console.log("User definition: ", userDef);

let osDef = await link.getEnumDefinition('[FrooxEngine]FrooxEngine.Platform');
console.log("Valid values for FrooxEngine.Platform are: ", Object.keys(osDef.values));
