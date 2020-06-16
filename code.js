// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 600, height: 300 });
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
figma.ui.onmessage = msg => {
    if (msg.type === 'create-swatches') {
        // alert(fillColor)
        const swatches = [];
        for (let i = 0; i < msg.count; i++) {
            const swatch = figma.createRectangle();
            // const fillColor = msg.fillColor
            swatch.resizeWithoutConstraints(20, 20);
            swatches.push(swatch);
            const fills = clone(swatch.fills);
            swatch.x = i * 20;
            // swatch.fills = fills;
            swatch.fills = [{ type: 'SOLID', color: { r: .4, g: 0.5, b: .3 } }];
            figma.currentPage.appendChild(swatch);
            swatches.push(swatch);
        }
        // figma.currentPage.selection = swatches;
        // figma.viewport.scrollAndZoomIntoView(swatches);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
