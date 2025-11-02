// script/editor.ts
import { AppState, createFunctionTag } from './utils.js';
import { JsonConverter } from './converter.js';
import { UI } from './ui.js';

export class RichTextEditor {
    private appState: AppState;
    private jsonConverter: JsonConverter;
    private ui: UI;
    private editor: HTMLElement;

    constructor(appState: AppState, jsonConverter: JsonConverter, ui: UI) {
        this.appState = appState;
        this.jsonConverter = jsonConverter;
        this.ui = ui;
        this.editor = document.getElementById('richTextEditor') as HTMLElement;
    }

    public init(): void {
        this.editor.addEventListener('input', () => this.handleInput());
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));
        // Add event listeners for feature buttons
        document.querySelector('button[onclick="App.RichTextEditor.insertFeature(\'score\')"]')?.addEventListener('click', () => this.insertFeature('score'));
        document.querySelector('button[onclick="App.RichTextEditor.insertFeature(\'selector\')"]')?.addEventListener('click', () => this.insertFeature('selector'));
        document.querySelector('button[onclick="App.RichTextEditor.insertFeature(\'translate\')"]')?.addEventListener('click', () => this.insertFeature('translate'));
        document.querySelector('button[onclick="App.RichTextEditor.insertFeature(\'conditional\')"]')?.addEventListener('click', () => this.insertFeature('conditional'));
    }

    private handleInput(): void {
        this.jsonConverter.generateJson();
    }

    private handlePaste(e: ClipboardEvent): void {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain');
        if (text) {
            document.execCommand('insertText', false, text);
        }
    }

    public insertCode(code: string): void {
        document.execCommand('insertText', false, code);
        this.jsonConverter.generateJson();
    }

    public insertFeature(type: string): void {
        this.editor.focus();

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        const range = selection.getRangeAt(0);

        let initialDataset: { [key: string]: string } = {};
        switch (type) {
            case 'score':
                initialDataset = { name: '@p', objective: 'score' };
                break;
            case 'selector':
                initialDataset = { selector: '@p' };
                break;
            case 'translate':
                initialDataset = { translate: 'key.example', with: '[{"text":"example"}]' };
                break;
            case 'conditional':
                initialDataset = { condition: '{"selector":"@p"}', then: '[{"text":"Success!"}]' };
                break;
        }

        const tag = createFunctionTag(type, initialDataset, (tag) => this.updateTagContent(tag), (tag) => this.editFeature(tag));

        range.deleteContents();
        range.insertNode(tag);

        const space = document.createTextNode('\u00A0');
        range.setStartAfter(tag);
        range.insertNode(space);
        range.setStartAfter(space);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        this.jsonConverter.generateJson();
    }

    // 新增一个辅助函数来格式化hasitem条件对象
    private formatHasitemCondition(condition: any): string {
        const parts: string[] = [];
        for (const key in condition) {
            if (Object.prototype.hasOwnProperty.call(condition, key)) {
                parts.push(`${key}=${condition[key]}`);
            }
        }
        return `{${parts.join(',')}}`;
    }

    public updateTagContent(tag: HTMLElement): void {
        let text = `[${tag.dataset.type}]`;
        switch (tag.dataset.type) {
            case 'score':
                text = `[${tag.dataset.name}:${tag.dataset.objective}]`;
                break;
            case 'selector':
                let selectorText = tag.dataset.selector || '@p';
                // 检查并解析hasitem参数，以便在显示时进行美化
                const hasitemMatch = selectorText.match(/hasitem=({[^}]*}|\[.*?\])/); // 匹配 hasitem={...} 或 hasitem=[...]
                if (hasitemMatch) {
                    try {
                        const hasitemString = hasitemMatch[1];
                        let displayValue = '';

                        const parseKeyValueString = (str: string) => {
                            const obj: { [key: string]: string } = {};
                            str.split(',').forEach(part => {
                                const [key, value] = part.split('=');
                                if (key && value) {
                                    obj[key.trim()] = value.trim();
                                }
                            });
                            return obj;
                        };

                        if (hasitemString.startsWith('[') && hasitemString.endsWith(']')) {
                            // 处理数组形式：[{k=v,...},{k=v,...}]
                            const innerContent = hasitemString.substring(1, hasitemString.length - 1);
                            const parsedArray = innerContent.split('},{').map(itemStr => {
                                const cleanedItemStr = itemStr.replace(/^{|}$/g, ''); // 移除可能存在的花括号
                                return parseKeyValueString(cleanedItemStr);
                            });
                            displayValue = `[${parsedArray.map(item => this.formatHasitemCondition(item)).join(',')}]`;
                        } else if (hasitemString.startsWith('{') && hasitemString.endsWith('}')) {
                            // 处理单个对象形式：{k=v,...}
                            const innerContent = hasitemString.substring(1, hasitemString.length - 1);
                            const parsedObject = parseKeyValueString(innerContent);
                            displayValue = this.formatHasitemCondition(parsedObject);
                        } else {
                            // 如果格式不符合预期，直接使用原始字符串
                            displayValue = hasitemString;
                        }
                        selectorText = selectorText.replace(hasitemMatch[0], `hasitem=${displayValue}`);
                    } catch (e) {
                        console.error("hasitem 显示解析失败", e);
                    }
                }
                text = `[${selectorText}]`;
                break;
            case 'translate':
                text = `[t:${tag.dataset.translate}]`;
                break;
            case 'conditional':
                try {
                    const cond = JSON.parse(tag.dataset.condition || '{}');
                    const condType = Object.keys(cond)[0] || '...';
                    text = `[IF ${condType} THEN ...]`;
                } catch (e) {
                    text = '[IF ... THEN ...]';
                }
                break;
        }
        tag.textContent = text;
    }

    public editFeature(tag: HTMLElement): void {
        this.appState.currentEditingTag = tag;
        if (tag.dataset.type === 'selector') {
            window.App.UI.modalManager.show(window.App.UI.getSelectorModalContent(tag));
        } else {
            window.App.UI.modalManager.show(window.App.UI.getEditModalContent(tag.dataset.type || ''));
        }
    }

    public applyEdit(): void {
        const tag = this.appState.currentEditingTag;
        if (!tag) return;

        switch (tag.dataset.type) {
            case 'score':
                tag.dataset.name = (document.getElementById('score-name') as HTMLInputElement)?.value || '';
                tag.dataset.objective = (document.getElementById('score-objective') as HTMLInputElement)?.value || '';
                break;
            case 'translate':
                tag.dataset.translate = (document.getElementById('translate-key') as HTMLInputElement)?.value || '';
                tag.dataset.with = (document.getElementById('translate-with') as HTMLTextAreaElement)?.value || '';
                break;
            case 'conditional':
                tag.dataset.conditions = this.ui.buildConditionsData();
                break;
        }

        this.updateTagContent(tag);
        this.jsonConverter.generateJson();
        window.App.UI.hideCurrentModal(); // 使用新的隐藏方法
    }

    public applySelectorEdit(): void {
        const selector = this.ui.buildSelectorStringFromModal();

        if (this.appState.activeSelectorInputId) {
            const inputElement = document.getElementById(this.appState.activeSelectorInputId) as HTMLInputElement;
            if (inputElement) {
                inputElement.value = selector;
            }
            this.appState.activeSelectorInputId = null; // Reset after use
        } else {
            const tag = this.appState.currentEditingTag;
            if (!tag) return;
            tag.dataset.selector = selector;
            this.updateTagContent(tag);
        }

        this.jsonConverter.generateJson();
        window.App.UI.hideCurrentModal();
    }
}
