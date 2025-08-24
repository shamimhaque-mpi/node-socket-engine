const buffer = class {

    buffer = false;
    constructor(buffer){
        this.buffer = buffer;
    }

    data(){
        return this.butterToText(this.buffer);
    }

    textToBuffer(message) {
        const data = Buffer.from(message);
        const lengthByteCount = data.length < 126 ? 0 : 2;
        const payloadLength = lengthByteCount === 0 ? data.length : 126;
        const buffer = Buffer.alloc(2 + lengthByteCount + data.length);
    
        buffer.writeUInt8(0b10000001, 0);
        buffer.writeUInt8(payloadLength, 1);
    
        if (lengthByteCount > 0) {
            buffer.writeUInt16BE(data.length, 2);
        }
    
        buffer.set(data, 2 + lengthByteCount);
    
        return buffer;
    }

    butterToText(buffer) {
        const firstByte = buffer.readUInt8(0);
        const opCode = firstByte & 0xf;
    
        if (opCode === 0x8) return null; // Close frame
    
        const secondByte = buffer.readUInt8(1);
        const isMasked = Boolean((secondByte >>> 7) & 0x1);
        let payloadLength = secondByte & 0x7f;
    
        let currentOffset = 2;
        if (payloadLength === 126) {
            payloadLength = buffer.readUInt16BE(currentOffset);
            currentOffset += 2;
        }
    
        let maskingKey;
        if (isMasked) {
            maskingKey = buffer.slice(currentOffset, currentOffset + 4);
            currentOffset += 4;
        }
    
        const data = buffer.slice(currentOffset, currentOffset + payloadLength);
        if (isMasked) {
            for (let i = 0; i < payloadLength; i++) {
                data[i] ^= maskingKey[i % 4];
            }
        }
    
        return data.toString('utf8');
    }
}


module.exports = buffer;