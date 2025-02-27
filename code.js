figma.showUI(__html__, { width: 300, height: 600 });

// Define our base colors
const baseColors = {
    red: '#ff0000',
    redOrange: '#ff5300',
    orange: '#ffa500',
    orangeYellow: '#ffd200',
    yellow: '#ffff00',
    yellowGreen: '#80ff00',
    green: '#00ff00',
    greenBlue: '#008080',
    blue: '#0000ff',
    bluePurple: '#4000c0',
    purple: '#800080',
    purpleRed: '#c00040'
};

figma.ui.onmessage = async(msg) => {
    if (msg.type === 'create-color-scheme') {
        const { baseColor, scheme } = msg;
        const schemeColors = generateColorScheme(baseColor, scheme);
        const colorMatrix = generateColorMatrix(schemeColors);
        await createColorGrid(colorMatrix);
    }
};

function generateColorScheme(baseColor, scheme) {
    const colorArray = Object.values(baseColors);
    const baseIndex = colorArray.indexOf(baseColor);

    switch (scheme) {
        case 'complementary':
            return [
                baseColor,
                colorArray[(baseIndex + 6) % 12]
            ];

        case 'triadic':
            return [
                baseColor,
                colorArray[(baseIndex + 4) % 12],
                colorArray[(baseIndex + 8) % 12]
            ];

        case 'split-complementary':
            return [
                baseColor,
                colorArray[(baseIndex + 5) % 12],
                colorArray[(baseIndex + 7) % 12]
            ];

        case 'analogous':
            return [
                colorArray[(baseIndex - 1 + 12) % 12],
                baseColor,
                colorArray[(baseIndex + 1) % 12]
            ];
    }
}

function generateColorMatrix(colors) {
    return colors.map(color => {
        const variations = [];
        const { h, s, l } = hexToHSL(color);

        // Generate 9x9 grid of variations, light to dark and desaturated to saturated
        for (let i = 0; i <= 8; i++) { // Light to dark (top to bottom)
            for (let j = 1; j <= 9; j++) { // Changed: desaturated to saturated (left to right)
                const newSat = j / 10;
                const newLight = 0.9 - (i / 10);
                variations.push(hslToHex(h, newSat, newLight));
            }
        }

        return variations;
    });
}

async function createColorGrid(colorMatrix) {
    const swatchSize = 20;
    const gap = 0;
    const nodes = [];

    colorMatrix.forEach((variations, schemeIndex) => {
        const matrixNodes = variations.map((color, index) => {
            const rect = figma.createRectangle();
            const row = Math.floor(index / 9); // Changed from 10 to 9
            const col = index % 9; // Changed from 10 to 9

            rect.x = col * (swatchSize + gap);
            rect.y = row * (swatchSize + gap) + (schemeIndex * (swatchSize * 9 + gap * 2)); // Changed from 10 to 9
            rect.resize(swatchSize, swatchSize);
            rect.fills = [{ type: 'SOLID', color: hexToRGB(color) }];

            return rect;
        });

        const group = figma.group(matrixNodes, figma.currentPage);
        nodes.push(group);
    });

    const finalGroup = figma.group(nodes, figma.currentPage);
    const center = figma.viewport.center;
    finalGroup.x = center.x - (finalGroup.width / 2);
    finalGroup.y = center.y - (finalGroup.height / 2);
}

// Color conversion utilities
function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
}

function hexToHSL(hex) {
    const rgb = hexToRGB(hex);
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case rgb.r:
                h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
                break;
            case rgb.g:
                h = (rgb.b - rgb.r) / d + 2;
                break;
            case rgb.b:
                h = (rgb.r - rgb.g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h, s, l };
}

function hslToHex(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}