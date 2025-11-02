// script/ui/ColorPalette.ts

import { COLORS } from '../utils.js';

export class ColorPalette {
    public renderColorButtons(): void {
        const container = document.getElementById('colorButtons');
        if (!container) return;

        container.innerHTML = COLORS.map(color => `
            <button
                style="background-color:${color.bg}; color:${color.text}; ${color.border ? 'border: 1px solid #ccc;' : ''} ${color.bold ? 'font-weight:bold;' : ''} ${color.italic ? 'font-style:italic;' : ''}"
                class="p-2 rounded shadow transition-transform transform hover:scale-110"
                onclick="window.App.RichTextEditor.insertCode('${color.code}')">
                ${color.name}
            </button>
        `).join('');
    }
}
