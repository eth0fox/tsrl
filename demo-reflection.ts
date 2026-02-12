
import { WebSocket } from "ws";
import { ResoniteLink } from "./src/index.js";

const host = process.argv[2];
if (!host) {
    console.error("Usage: demo.ts ws://127.0.0.1:1337");
    process.exit(1);
}


let link = await ResoniteLink.connect(host, WebSocket as any);
