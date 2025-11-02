// script/ui/HasitemEditor.ts

import { AppState, ModalManager, MODAL_INPUT_CLASSES, MODAL_LABEL_CLASSES } from '../utils.js';
import { loadItems, loadSlots } from '../utils.js';

export class HasitemEditor {
    private appState: AppState;
    private modalManager: ModalManager;

    constructor(appState: AppState, modalManager: ModalManager) {
        this.appState = appState;
        this.modalManager = modalManager;
    }

    public async showHasitemEditorModal(): Promise<void> {
        if (!this.appState.items) {
            this.appState.items = await loadItems();
        }
        if (!this.appState.slots) {
            this.appState.slots = await loadSlots();
        }

        const initialValue = (document.getElementById('sel-hasitem') as HTMLTextAreaElement)?.value || '';
        this.modalManager.show(this.getHasitemEditorContent(initialValue));
        this.updateHasitemPreview();
        this.setupHasitemEventListeners();
    }

    private getHasitemEditorContent(initialValue: string): string {
        return `
            <div id="hasitem-editor-modal" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl text-gray-800 dark:text-gray-200 max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Hasitem 编辑器</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                
                <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-hidden">
                    <!-- Left: Form -->
                    <div id="hasitem-form-container" class="space-y-4 overflow-y-auto pr-2">
                         <div class="p-4 border rounded-lg dark:border-gray-600">
                             <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">添加物品条件</h3>
                             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="${MODAL_LABEL_CLASSES}">物品 (item)</label>
                                    <input type="text" id="hasitem-item-input" list="item-datalist" class="${MODAL_INPUT_CLASSES}" placeholder="例如: diamond">
                                    <datalist id="item-datalist">${this.appState.items ? Object.keys(this.appState.items).map((item: string) => `<option value="${item}"></option>`).join('') : ''}</datalist>
                                    </div>
                                <div>
                                    <label class="${MODAL_LABEL_CLASSES}">数据值 (data)</label>
                                    <input type="number" id="hasitem-data-input" class="${MODAL_INPUT_CLASSES}" placeholder="例如: 0">
                                </div>
                                <div>
                                    <label class="${MODAL_LABEL_CLASSES}">数量 (quantity)</label>
                                    <input type="text" id="hasitem-quantity-input" class="${MODAL_INPUT_CLASSES}" placeholder="例如: 1 or 1..5">
                                </div>
                                <div>
                                    <label class="${MODAL_LABEL_CLASSES}">位置 (location)</label>
                                    <select id="hasitem-location-input" class="${MODAL_INPUT_CLASSES}"></select>
                                </div>
                                <div>
                                    <label class="${MODAL_LABEL_CLASSES}">栏位 (slot)</label>
                                    <select id="hasitem-slot-input" class="${MODAL_INPUT_CLASSES}" multiple size="3"></select>
                                </div>
                                <div class="col-span-full">
                                    <button onclick="window.App.UI.addHasitemCondition()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">添加条件</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Preview -->
                    <div class="flex flex-col h-full">
                        <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">预览</h3>
                        <div id="hasitem-conditions-preview" class="flex-grow p-2 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 space-y-2 overflow-y-auto">
                            <!-- Conditions will be added here -->
                        </div>
                        <textarea id="hasitem-output" class="w-full h-24 mt-4 font-mono text-sm ${MODAL_INPUT_CLASSES}" readonly>${initialValue}</textarea>
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-2">
                    <button class="sub-modal-cancel bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-bold py-2 px-4 rounded">取消</button>
                    <button onclick="window.App.UI.applyHasitemChanges()" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">应用</button>
                </div>
            </div>
        `;
    }

    public setupHasitemEventListeners(): void {
        const locationSelect = document.getElementById('hasitem-location-input') as HTMLSelectElement;
        const slotSelect = document.getElementById('hasitem-slot-input') as HTMLSelectElement;

        if (locationSelect && this.appState.slots) {
            locationSelect.innerHTML = Object.keys(this.appState.slots).map(loc => `<option value="${loc}">${loc}</option>`).join('');
            locationSelect.addEventListener('change', () => this.updateSlotOptions());
            this.updateSlotOptions(); // Initial population
        }
        
        // Use event delegation for dynamically added remove buttons
        const previewContainer = document.getElementById('hasitem-conditions-preview');
        previewContainer?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target && target.closest('.remove-hasitem-btn')) {
                const index = parseInt(target.closest<HTMLElement>('[data-index]')?.dataset.index || '-1');
                if (index !== -1) {
                    this.removeHasitemCondition(index);
                }
            }
        });
    }

    private updateSlotOptions(): void {
        const locationSelect = document.getElementById('hasitem-location-input') as HTMLSelectElement;
        const slotSelect = document.getElementById('hasitem-slot-input') as HTMLSelectElement;
        if (locationSelect && slotSelect && this.appState.slots) {
            const selectedLocation = locationSelect.value;
            const slotsForLocation = this.appState.slots[selectedLocation] || [];
            if (Array.isArray(slotsForLocation)) {
                slotSelect.innerHTML = slotsForLocation.map((slot: { id: number; name: string }) => `<option value="${slot.id}">${slot.name} (${slot.id})</option>`).join('');
            }
        }
    }

    public addHasitemCondition(): void {
        const item = (document.getElementById('hasitem-item-input') as HTMLInputElement).value.trim();
        if (!item) return; // Item is required

        const data = (document.getElementById('hasitem-data-input') as HTMLInputElement).value.trim();
        const quantity = (document.getElementById('hasitem-quantity-input') as HTMLInputElement).value.trim();
        const location = (document.getElementById('hasitem-location-input') as HTMLSelectElement).value;
        const slotOptions = (document.getElementById('hasitem-slot-input') as HTMLSelectElement).selectedOptions;
        const slots = Array.from(slotOptions).map(opt => opt.value);

        const newCondition: { [key: string]: any } = { item };
        if (data) newCondition.data = parseInt(data);
        if (quantity) newCondition.quantity = quantity; // Keep as string to preserve ranges
        if (location) newCondition.location = location;
        if (slots.length > 0) newCondition.slot = slots.length === 1 ? parseInt(slots[0]) : slots.map(s => parseInt(s));
        
        const outputTextArea = document.getElementById('hasitem-output') as HTMLTextAreaElement;
        const currentConditions = this.parseHasitemString(outputTextArea.value);
        currentConditions.push(newCondition);
        
        outputTextArea.value = this.buildHasitemString(currentConditions);
        this.updateHasitemPreview();
    }
    
    public removeHasitemCondition(index: number): void {
        const outputTextArea = document.getElementById('hasitem-output') as HTMLTextAreaElement;
        const currentConditions = this.parseHasitemString(outputTextArea.value);
        currentConditions.splice(index, 1);
        outputTextArea.value = this.buildHasitemString(currentConditions);
        this.updateHasitemPreview();
    }

    public updateHasitemPreview(): void {
        const outputTextArea = document.getElementById('hasitem-output') as HTMLTextAreaElement;
        const previewContainer = document.getElementById('hasitem-conditions-preview');
        if (!previewContainer || !outputTextArea) return;
        
        const conditions = this.parseHasitemString(outputTextArea.value);
        
        if (conditions.length === 0) {
            previewContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">尚未添加任何条件。</p>';
            return;
        }

        previewContainer.innerHTML = conditions.map((cond, index) => {
            const properties = Object.entries(cond)
                .map(([key, value]) => `<li><strong class="font-semibold text-gray-700 dark:text-gray-300">${key}:</strong> ${JSON.stringify(value)}</li>`)
                .join('');
            return `
                <div class="p-2 border rounded-md dark:border-gray-600 bg-white dark:bg-gray-800 flex justify-between items-center" data-index="${index}">
                    <ul class="text-sm list-disc list-inside">${properties}</ul>
                    <button class="remove-hasitem-btn p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    public applyHasitemChanges(): void {
        const output = (document.getElementById('hasitem-output') as HTMLTextAreaElement).value;
        (document.getElementById('sel-hasitem') as HTMLTextAreaElement).value = output;
        this.modalManager.hide(); // Hide sub-modal
    }

    private parseHasitemString(str: string): any[] {
        str = str.trim();
        if (!str) return [];
        
        try {
            // If it's not a valid JSON array, try to wrap it to make it one
            if (!str.startsWith('[')) {
                // If it's a single object, wrap it in an array
                if (str.startsWith('{')) {
                    str = `[${str}]`;
                } else {
                    // This is likely malformed, but let's try to handle simple key=value pairs
                    str = `[{${str}}]`;
                }
            }
            // A more robust JSON parser could be used here. For now, we'll replace single quotes and ensure keys are quoted.
            let parsableString = str
                .replace(/'/g, '"')
                .replace(/([{,]\s*)(\w+)\s*=/g, '$1"$2"=');

            return JSON.parse(parsableString);
        } catch (e) {
            console.error("Failed to parse hasitem string:", str, e);
            // Fallback for simple `{item=apple,quantity=1}` format
            if (str.startsWith('{') && str.endsWith('}')) {
                const inner = str.substring(1, str.length - 1);
                const obj: { [key: string]: any } = {};
                inner.split(',').forEach(part => {
                    const [key, val] = part.split('=');
                    if (key && val) {
                        obj[key.trim()] = isNaN(Number(val)) ? val.trim() : Number(val);
                    }
                });
                return [obj];
            }
            return [];
        }
    }
    
    private buildHasitemString(conditions: any[]): string {
        if (conditions.length === 0) return '';
        if (conditions.length === 1) {
            return `{${Object.entries(conditions[0]).map(([key, value]) => `${key}=${value}`).join(',')}}`;
        }
        return `[${conditions.map(cond => `{${Object.entries(cond).map(([key, value]) => `${key}=${value}`).join(',')}}`).join(',')}]`;
    }
}
