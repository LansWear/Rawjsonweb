// script/ui.ts
import { AppState, ModalManager } from './utils.js';
import { JsonConverter } from './converter.js';
import { DomEvents } from './ui/DomEvents.js';
import { ColorPalette } from './ui/ColorPalette.js';
import { ModalContent } from './ui/ModalContent.js';
import { SelectorEditor } from './ui/SelectorEditor.js';
import { HasitemEditor } from './ui/HasitemEditor.js';
import { ScoreEditor } from './ui/ScoreEditor.js';
import { ConditionalEditor } from './ui/ConditionalEditor.js';
import { Help } from './ui/Help.js';

export class UI {
    private appState: AppState;
    public modalManager: ModalManager;
    private domEvents: DomEvents;
    private colorPalette: ColorPalette;
    private modalContent: ModalContent;
    private selectorEditor: SelectorEditor;
    private hasitemEditor: HasitemEditor;
    private scoreEditor: ScoreEditor;
    private conditionalEditor: ConditionalEditor;
    private help: Help;

    constructor(appState: AppState, jsonConverter: JsonConverter, modalManager: ModalManager, updateTagContent: (tag: HTMLElement) => void, editFeature: (tag: HTMLElement) => void) {
        this.appState = appState;
        this.modalManager = modalManager;
        this.domEvents = new DomEvents(appState);
        this.colorPalette = new ColorPalette();
        this.modalContent = new ModalContent();
        this.selectorEditor = new SelectorEditor();
        this.hasitemEditor = new HasitemEditor(appState, modalManager);
        this.scoreEditor = new ScoreEditor(appState, modalManager);
        this.conditionalEditor = new ConditionalEditor();
        this.help = new Help();
    }

    public initTheme(): void {
        this.domEvents.initTheme();
    }

    public toggleTheme(): void {
        this.domEvents.toggleTheme();
    }

    public initMenu(): void {
        this.domEvents.initMenu();
    }

    public initModals(): void {
        document.getElementById('about-btn')?.addEventListener('click', (e) => { e.preventDefault(); this.modalManager.show(this.modalContent.getAboutModalContent()); });
        document.getElementById('decode-json-btn')?.addEventListener('click', (e) => { e.preventDefault(); this.modalManager.show(this.modalContent.getDecodeModalContent()); });
        document.getElementById('copy-json-btn')?.addEventListener('click', () => this.copyJson());
    }

    public renderColorButtons(): void {
        this.colorPalette.renderColorButtons();
    }

    public copyJson(): void {
        const jsonOutputElement = document.getElementById('jsonOutput');
        const jsonText = jsonOutputElement?.textContent?.trim();

        if (!jsonText) {
            console.warn('没有内容可以复制。');
            const btn = document.getElementById('copy-json-btn');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '没有内容可复制!';
                setTimeout(() => btn.textContent = originalText, 3000);
            }
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonText).then(() => {
                const btn = document.getElementById('copy-json-btn');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.textContent = '已复制!';
                    setTimeout(() => btn.textContent = originalText, 2000);
                }
            }).catch(err => console.error('复制失败:', err));
        } else {
            console.warn('浏览器不支持 Clipboard API，请手动复制。');
            const btn = document.getElementById('copy-json-btn');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '复制失败，请手动复制!';
                setTimeout(() => btn.textContent = originalText, 3000);
            }
        }
    }

    public getEditModalContent(type: string): string {
        const tag = this.appState.currentEditingTag;
        if (type === 'conditional' && tag) {
            return this.conditionalEditor.getConditionalEditorContent(tag);
        }
        return this.modalContent.getEditModalContent(type, tag);
    }
    
    public getSelectorModalContent(tag: HTMLElement): string {
        return this.selectorEditor.getSelectorModalContent(tag);
    }

    public setSelectorMode(isAdvanced: boolean): void {
        this.selectorEditor.setSelectorMode(isAdvanced);
    }

    public buildSelectorStringFromModal(): string {
        return this.selectorEditor.buildSelectorStringFromModal();
    }

    public showSelectorEditorForScoreName(inputId: string): void {
        const inputElement = document.getElementById(inputId) as HTMLInputElement;
        if (!inputElement) return;

        // Create a temporary tag to hold the selector value
        const tempTag = document.createElement('div');
        tempTag.dataset.selector = inputElement.value || '@s';

        this.appState.currentEditingTag = tempTag;
        this.appState.activeSelectorInputId = inputId; // Store the input id

        this.modalManager.show(this.getSelectorModalContent(tempTag));
    }
    
    // Wrapper methods for editor classes
    public showHasitemEditorModal(): void {
        this.hasitemEditor.showHasitemEditorModal();
    }
    
    public addHasitemCondition(): void {
        this.hasitemEditor.addHasitemCondition();
    }

    public applyHasitemChanges(): void {
        this.hasitemEditor.applyHasitemChanges();
    }

    public showScoreEditorModal(): void {
        this.scoreEditor.showScoreEditorModal();
    }

    public addScoreCondition(): void {
        this.scoreEditor.addScoreCondition();
    }

    public applyScoreChanges(): void {
        this.scoreEditor.applyScoreChanges();
    }
    
    public addConditionalRow(): void {
        this.conditionalEditor.addConditionalRow();
    }

    public removeConditionalRow(button: HTMLElement): void {
        this.conditionalEditor.removeConditionalRow(button);
    }
    
    public buildConditionsData(): string {
        return this.conditionalEditor.buildConditionsData();
    }

    // Wrapper methods for help class
    public showFamilyTypesDoc(): void {
        this.help.showFamilyTypesDoc();
    }

    public showRotationHelp(): void {
        this.help.showRotationHelp();
    }

    public showDimensionHelp(): void {
        this.help.showDimensionHelp();
    }
    
    public hideCurrentModal(): void {
        this.modalManager.hide();
    }
}
