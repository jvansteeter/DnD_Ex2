export class ColorStatics {
    static rgbToHsl(r: number, g: number, b: number): number[] {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let h;
        let s;
        let l = (max + min) / 2;

        if (max === min) {
            h = 0;
            s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g: h = (b - r) / d + 2;
                    break;
                case b: h = (r - g) / d + 4;
                    break;
            }
            h = h / 6;
        }

        return [h, s, l];
    }

    static hslToRgb(h: number, s: number, l:number): number[] {
        let r;
        let g;
        let b;

        if (s === 0) {
            r = l;
            g = l;
            b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this.hueToRgb(p, q, h + 1/3);
            g = this.hueToRgb(p, q, h);
            b = this.hueToRgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    static hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) {
            t = t + 1;
        }
        if (t > 1) {
            t = t - 1;
        }
        if (t < 1/6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1/2) {
            return q;
        }
        if (t < 2/3) {
            return p + (q - p) * (2/3 - t) * 6;
        }
        return p;
    }

    static parseRgbaString(rgbaString: string): number[] {
        const returnMe = [];
        const butcherString = rgbaString.slice(rgbaString.indexOf('(') + 1, rgbaString.length - 1);
        const colorSplit = butcherString.split(',');
        returnMe.push(parseFloat(colorSplit[0]));
        returnMe.push(parseFloat(colorSplit[1]));
        returnMe.push(parseFloat(colorSplit[2]));
        returnMe.push(parseFloat(colorSplit[3]));
        return returnMe;
    }

    static parseRgbString(rgbString: string): number[] {
        const returnMe = [];
        const butcherString = rgbString.slice(rgbString.indexOf('(') + 1, rgbString.length - 1);
        const colorSplit = butcherString.split(',');
        returnMe.push(parseFloat(colorSplit[0]));
        returnMe.push(parseFloat(colorSplit[1]));
        returnMe.push(parseFloat(colorSplit[2]));
        return returnMe;
    }

    static resetRgbaStringAlpha(rgbaString: string, newAlpha: number): string {
        const members = ColorStatics.parseRgbaString(rgbaString);
        return 'rgba(' + members[0] + ',' + members[1] + ',' + members[2] + ',' + newAlpha + ')';
    }
}