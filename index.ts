

export type BinaryPayload = Exclude<Parameters<WebSocket['send']>[0], string>;


export class ResoniteLink {
    socket: WebSocket;
    idPrefix = 'tsrl_' + Math.random().toString(36).slice(2) + '_';
    private idCounter = 0;

    debugSend = (data: string) => {};
    debugReceive = (data: string) => {};

    allocateId(): string {
        return this.idPrefix + (this.idCounter++).toString(36);
    }
        
    constructor(socket: WebSocket) {
        this.socket = socket;
        socket.onmessage = this.onMessage.bind(this);
        socket.addEventListener('close', this.onClose.bind(this)); 
    }

    static connect(url: string, websocketConstructor = WebSocket): Promise<ResoniteLink> {
        return new Promise((resolve, reject) => {
            const socket = new websocketConstructor(url);
            socket.onopen = () => resolve(new ResoniteLink(socket));
            socket.onerror = (err) => reject(err);
        });
    }

    private inflightMessages: Map<string, {resolve: (value: any) => void, reject: (reason?: any) => void}> = new Map();
    private messageIdCounter: number = 0;

    private onClose() {
        this.inflightMessages.forEach(({reject}, messageId) => {
            reject(new Error('Connection closed before response received for message ID: ' + messageId));
        });
        this.inflightMessages.clear();
    }

    private onMessage(event: { data: any }) {
        this.debugReceive?.(event.data);
        if (event.data == "") return;
        try {
            let data = JSON.parse(event.data);
            if (data.sourceMessageId) {
                const handlers = this.inflightMessages.get(data.sourceMessageId);
                if (handlers) {
                    this.inflightMessages.delete(data.sourceMessageId);
                    if (data.success) handlers.resolve(data);
                    else handlers.reject(data.errorInfo);
                } else {
                    console.warn('No handlers found for message ID:', data.sourceMessageId);
                }
            } else {
                console.log('Received unsolicited message:', data);
            }
        } catch(e) {
            console.error('Error handling message:', e, JSON.stringify(event.data));
        }
    }

    async call<T extends ResoniteLink.ClientMessage>(message: T, binaryPayload?: BinaryPayload): Promise<ResoniteLink.MessageResponsesMap[T['$type']]> {
        if (this.socket.readyState !== WebSocket.OPEN) throw new Error('WebSocket is not open');
        return new Promise((resolve, reject) => {
            const messageId = this.idPrefix + (this.messageIdCounter++).toString(36);
            this.inflightMessages.set(messageId, {resolve, reject});
            const data = JSON.stringify({...message, messageId});
            this.debugSend?.(data);
            this.socket.send(data);
            if (binaryPayload) this.socket.send(binaryPayload);
        });
    }


    async slotGet(
        slotId: ResoniteLink.GetSlotMessage['slotId'] = "Root",
        includeComponentData: boolean = false,
        depth: number = 0
    ) { return (await this.call({ $type: 'getSlot', slotId, includeComponentData, depth })).data; }
    async slotUpdate(slotId: string, data: Omit<ResoniteLink.UpdateSlotMessage['data'], "id">) { return (await this.call({ $type: 'updateSlot', data: { id: slotId, ...data } })); }
    async slotRemove(slotId: string) { return (await this.call({ $type: 'removeSlot', slotId })); }
    async slotAdd(parentSlotId: string, data: ResoniteLink.AddSlotMessage['data']){
        let id = this.allocateId();
        await this.call({ $type: 'addSlot', data: { id, parent: { $type: 'reference', targetId: parentSlotId },  ...data } });
        return id;
    }
    
    async componentGet(componentId: string) { return (await this.call({ $type: 'getComponent', componentId })).data; }
    async componentUpdate(componentId: string, members: ResoniteLink.DataModel.Component['members']) { return (await this.call({ $type: 'updateComponent', data: { id: componentId, members } })); }
    async componentRemove(componentId: string) { return (await this.call({ $type: 'removeComponent', componentId })); }
    async componentAdd(containerSlotId: string, componentType: string, members: ResoniteLink.DataModel.Component['members']) { 
        let id = this.allocateId();
        await this.call({ $type: 'addComponent', data: { id, componentType, members }, containerSlotId });
        return id;
    }
    
    async importTexture2DFile(filePath: string) { return ((await this.call({ $type: 'importTexture2DFile', filePath })).assetURL); }
    async importTexture2DRawData(
        width: number, height: number, 
        dataRGBA8: BinaryPayload, 
        colorProfile: ResoniteLink.DataModel.ColorProfile = 'sRGB'
    ) { return (await this.call({ $type: 'importTexture2DRawData', width, height, colorProfile }, dataRGBA8)).assetURL; }
    async importTexture2DRawDataHDR(
        width: number, height: number, 
        dataRGBAFloat32: BinaryPayload
    ) { return (await this.call({ $type: 'importTexture2DRawDataHDR', width, height }, dataRGBAFloat32)).assetURL; }
    

}
