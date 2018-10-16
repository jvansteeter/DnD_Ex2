export class BitArray {
    private numBits: number;
    private array: Uint8Array;

    constructor(numBits: number) {
        this.numBits = numBits;
        const numBytes = Math.ceil(numBits / 8);
        this.array = new Uint8Array(numBytes);
    }

    public get(bitIndex: number): number {
        const bytePos = bitIndex / 8;
        const bitPos = bitIndex % 8;
        const byte = this.array[bytePos];

        switch (bitPos) {
            case 0: return byte & 1;
            case 1: return byte & 2;
            case 2: return byte & 4;
            case 3: return byte & 8;
            case 4: return byte & 16;
            case 5: return byte & 32;
            case 6: return byte & 64;
            case 7: return byte & 128;
        }
        console.log(this.array);
    }

    public set(bitIndex: number, setOne: boolean) {
        const bytePos = bitIndex / 8;
        const bitPos = bitIndex % 8;
        const byte = this.array[bytePos];

        if (setOne) {
            switch (bitPos) {
                case 0: this.array[bytePos] = byte | 1; return;
                case 1: this.array[bytePos] = byte | 2; return;
                case 2: this.array[bytePos] = byte | 4; return;
                case 3: this.array[bytePos] = byte | 8; return;
                case 4: this.array[bytePos] = byte | 16; return;
                case 5: this.array[bytePos] = byte | 32; return;
                case 6: this.array[bytePos] = byte | 64; return;
                case 7: this.array[bytePos] = byte | 128; return;
            }
        } else {
            switch (bitPos) {
                case 0: this.array[bytePos] = byte & ~1; return;
                case 1: this.array[bytePos] = byte & ~2; return;
                case 2: this.array[bytePos] = byte & ~4; return;
                case 3: this.array[bytePos] = byte & ~8; return;
                case 4: this.array[bytePos] = byte & ~16; return;
                case 5: this.array[bytePos] = byte & ~32; return;
                case 6: this.array[bytePos] = byte & ~64; return;
                case 7: this.array[bytePos] = byte & ~128; return;
            }
        }
        console.log(this.array);
    }
}