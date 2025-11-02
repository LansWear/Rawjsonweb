// script/ui/ConditionalEditor.ts

import { MODAL_LABEL_CLASSES, MODAL_INPUT_CLASSES } from '../utils.js';

export class ConditionalEditor {
    public getConditionalEditorContent(tag: HTMLElement): string {
        const conditionsStr = tag.dataset.conditions || '[]';
        let conditions = [];
        try {
            conditions = JSON.parse(conditionsStr);
        } catch (e) {
            console.error('Error parsing conditional data:', e);
        }

        return `
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">编辑条件</h2>
            <div id="conditional-container" class="space-y-4">
                ${conditions.map((cond: any, index: number) => this.createConditionalRow(cond, index)).join('')}
            </div>
            <div class="mt-4">
                <button onclick="window.App.UI.addConditionalRow()" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">添加条件</button>
            </div>
        `;
    }

    public createConditionalRow(condition: any = {}, index: number): string {
        const target = condition.target || '';
        const objective = condition.objective || '';
        const operator = condition.operator || '==';
        const value = condition.value || '0';

        return `
            <div class="conditional-row flex items-center space-x-2 p-2 border rounded dark:border-gray-600" data-index="${index}">
                <input type="text" value="${target}" class="${MODAL_INPUT_CLASSES} w-1/4" placeholder="目标 (@s)">
                <input type="text" value="${objective}" class="${MODAL_INPUT_CLASSES} w-1/4" placeholder="计分项">
                <select class="${MODAL_INPUT_CLASSES} w-1/6">
                    <option value="==" ${operator === '==' ? 'selected' : ''}>==</option>
                    <option value="!=" ${operator === '!=' ? 'selected' : ''}>!=</option>
                    <option value=">" ${operator === '>' ? 'selected' : ''}>&gt;</option>
                    <option value=">=" ${operator === '>=' ? 'selected' : ''}>&gt;=</option>
                    <option value="<" ${operator === '<' ? 'selected' : ''}>&lt;</option>
                    <option value="<=" ${operator === '<=' ? 'selected' : ''}>&lt;=</option>
                </select>
                <input type="text" value="${value}" class="${MODAL_INPUT_CLASSES} w-1/4" placeholder="值 (e.g., 0)">
                <button onclick="window.App.UI.removeConditionalRow(this)" class="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
    }

    public addConditionalRow(): void {
        const container = document.getElementById('conditional-container');
        if (container) {
            const index = container.children.length;
            const newRow = this.createConditionalRow({}, index);
            container.insertAdjacentHTML('beforeend', newRow);
        }
    }

    public removeConditionalRow(button: HTMLElement): void {
        button.closest('.conditional-row')?.remove();
    }
    
    public buildConditionsData(): string {
        const conditions: any[] = [];
        document.querySelectorAll('#conditional-container .conditional-row').forEach(row => {
            const inputs = row.querySelectorAll('input, select');
            const target = (inputs[0] as HTMLInputElement).value;
            const objective = (inputs[1] as HTMLInputElement).value;
            const operator = (inputs[2] as HTMLSelectElement).value;
            const value = (inputs[3] as HTMLInputElement).value;
            if (target && objective && value) {
                conditions.push({ target, objective, operator, value });
            }
        });
        return JSON.stringify(conditions);
    }
}
