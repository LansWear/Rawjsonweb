// script/ui/ScoreEditor.ts

import { AppState, ModalManager, MODAL_INPUT_CLASSES, MODAL_LABEL_CLASSES } from '../utils.js';

export class ScoreEditor {
    private appState: AppState;
    private modalManager: ModalManager;

    constructor(appState: AppState, modalManager: ModalManager) {
        this.appState = appState;
        this.modalManager = modalManager;
    }

    public showScoreEditorModal(): void {
        const initialValue = (document.getElementById('sel-scores') as HTMLTextAreaElement)?.value || '';
        this.modalManager.show(this.getScoreEditorContent(initialValue));
        this.updateScorePreview();
        this.setupScoreEventListeners();
    }

    private getScoreEditorContent(initialValue: string): string {
        return `
            <div id="score-editor-modal" class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl text-gray-800 dark:text-gray-200 max-h-[80vh] flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Scores 编辑器</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                
                <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-hidden">
                    <!-- Left: Form -->
                    <div class="space-y-4 overflow-y-auto pr-2">
                         <div class="p-4 border rounded-lg dark:border-gray-600">
                             <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">添加计分板条件</h3>
                             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="col-span-full">
                                    <label class="${MODAL_LABEL_CLASSES}">计分项 (Objective)</label>
                                    <input type="text" id="score-objective-input" class="${MODAL_INPUT_CLASSES}" placeholder="例如: kills">
                                </div>
                                <div class="col-span-full">
                                    <label class="${MODAL_LABEL_CLASSES}">值 (Value)</label>
                                    <input type="text" id="score-value-input" class="${MODAL_INPUT_CLASSES}" placeholder="例如: 10 or 5.. or ..10 or !5">
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">支持范围 (10..12), 大于 (5..), 小于 (..10), 不等于 (!5)。</p>
                                </div>
                                <div class="col-span-full">
                                    <button onclick="window.App.UI.addScoreCondition()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">添加条件</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Preview -->
                    <div class="flex flex-col h-full">
                        <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">预览</h3>
                        <div id="score-conditions-preview" class="flex-grow p-2 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 space-y-2 overflow-y-auto">
                            <!-- Conditions will be added here -->
                        </div>
                        <textarea id="score-output" class="w-full h-24 mt-4 font-mono text-sm ${MODAL_INPUT_CLASSES}" readonly>${initialValue}</textarea>
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-2">
                    <button class="sub-modal-cancel bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-bold py-2 px-4 rounded">取消</button>
                    <button onclick="window.App.UI.applyScoreChanges()" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">应用</button>
                </div>
            </div>
        `;
    }

    public setupScoreEventListeners(): void {
        const previewContainer = document.getElementById('score-conditions-preview');
        previewContainer?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target && target.closest('.remove-score-btn')) {
                const key = target.closest<HTMLElement>('[data-key]')?.dataset.key;
                if (key) {
                    this.removeScoreCondition(key);
                }
            }
        });
    }

    public addScoreCondition(): void {
        const objectiveInput = document.getElementById('score-objective-input') as HTMLInputElement;
        const valueInput = document.getElementById('score-value-input') as HTMLInputElement;
        const objective = objectiveInput.value.trim();
        const value = valueInput.value.trim();

        if (!objective || !value) return;

        const outputTextArea = document.getElementById('score-output') as HTMLTextAreaElement;
        const currentScores = this.parseScoresString(outputTextArea.value);
        currentScores[objective] = value;
        
        outputTextArea.value = this.buildScoresString(currentScores);
        this.updateScorePreview();

        // Clear inputs
        objectiveInput.value = '';
        valueInput.value = '';
    }
    
    public removeScoreCondition(key: string): void {
        const outputTextArea = document.getElementById('score-output') as HTMLTextAreaElement;
        const currentScores = this.parseScoresString(outputTextArea.value);
        delete currentScores[key];
        outputTextArea.value = this.buildScoresString(currentScores);
        this.updateScorePreview();
    }

    public updateScorePreview(): void {
        const outputTextArea = document.getElementById('score-output') as HTMLTextAreaElement;
        const previewContainer = document.getElementById('score-conditions-preview');
        if (!previewContainer || !outputTextArea) return;
        
        const scores = this.parseScoresString(outputTextArea.value);
        const keys = Object.keys(scores);
        
        if (keys.length === 0) {
            previewContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">尚未添加任何计分板条件。</p>';
            return;
        }

        previewContainer.innerHTML = keys.map(key => {
            return `
                <div class="p-2 border rounded-md dark:border-gray-600 bg-white dark:bg-gray-800 flex justify-between items-center" data-key="${key}">
                    <span class="text-sm font-mono">
                        <strong class="font-semibold text-gray-700 dark:text-gray-300">${key}</strong> = ${scores[key]}
                    </span>
                    <button class="remove-score-btn p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    public applyScoreChanges(): void {
        const output = (document.getElementById('score-output') as HTMLTextAreaElement).value;
        (document.getElementById('sel-scores') as HTMLTextAreaElement).value = output;
        this.modalManager.hide(); // Hide sub-modal
    }

    private parseScoresString(str: string): { [key: string]: string } {
        const scores: { [key: string]: string } = {};
        str = str.trim();
        if (str.startsWith('{') && str.endsWith('}')) {
            str = str.substring(1, str.length - 1);
            str.split(',').forEach(part => {
                const [key, ...valueParts] = part.split('=');
                if (key && valueParts.length > 0) {
                    scores[key.trim()] = valueParts.join('=').trim();
                }
            });
        }
        return scores;
    }
    
    private buildScoresString(scores: { [key: string]: string }): string {
        const keys = Object.keys(scores);
        if (keys.length === 0) return '';
        const content = keys.map(key => `${key}=${scores[key]}`).join(',');
        return `{${content}}`;
    }
}
