# `tsrl`

tsrl (TypeScript ResoniteLink) is a library for interacting with ResoniteLink in a JavaScript based application. It should work in any environment that exposes a WHATWG-compliant WebSocket implementation.

In browsers it should Just Work, but Node.js' built in WebSocket implementation doesnt seem to work with Resonite (at least in v24.6.0 on Windows), so you should install the `ws` package.

## Installing

```
npm i @eth0fox/tsrl
```


## Usage

Connect to Resonite by first, opening a Resonite world where you are the host, going to the Session tab in the Dashboard and clicking "Enable ResoniteLink". Use the port number provided to connect.

```ts
// Standard
import { ResoniteLink } from "@eth0fox/tsrl";

const PORT = 1337 // change this
let link = await ResoniteLink.connect("ws://127.0.0.1:" + PORT);
```

```ts
// Node.js users should use: 
import { ResoniteLink } from "@eth0fox/tsrl";
import { WebSocket } from "ws";

const PORT = 1337 // change this
let link = await ResoniteLink.connect("ws://127.0.0.1:" + PORT, WebSocket as any);
```


For further usage instructions, take a look at the `demos/`


## Contact

I'm `eth0fox` in Resonite, or `u1f98a` on Discord.