// script/ui/ModalContent.ts

import { MODAL_INPUT_CLASSES, MODAL_LABEL_CLASSES } from '../utils.js';

export class ModalContent {
    public getAboutModalContent(): string {
        const gitLog = `
            20cd9d - 更新许可证信息，替换为Apache 2.0许可证 (5 minutes ago)
            e59e26c - 优化代码结构，重构标签创建逻辑，增加createFunctionTag函数以简化功能标签的生成 (19 minutes ago)
            9bc578e - score + 条件可视化 (3 hours ago)
            6b36a6e - 优化copyJson方法，增加内容为空时的提示和Clipboard API的兼容性处理 (13 hours ago)
            9ad4d4a - 优化score的实体选择器 (19 hours ago)
            e7b7907 - 优化hasitem编辑器 (20 hours ago)
            8cfb3cf - v2 od2rb93 (23 hours ago)
        `;
        const changelogHtml = gitLog.trim().split('\n').map(line => `<li>${line.trim()}</li>`).join('');

        return `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-800 dark:text-gray-200 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">关于</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                <p class="mb-4">这是一款用于 Minecraft 基岩版 RawJSON 文本生成的工具，由 Akanyi 创建。</p>
                <a href="https://github.com/Akanyi/AkayiRawjsonweb" target="_blank" class="text-blue-500 dark:text-blue-400 hover:underline">访问 GitHub 仓库</a>
                <div class="mt-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">更新日志</h3>
                    <ul class="list-disc list-inside text-sm space-y-1 font-mono">
                        ${changelogHtml}
                    </ul>
                </div>
            </div>
        `;
    }

    public getDecodeModalContent(): string {
        return `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">解析 JSON</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                <textarea id="json-input-area" class="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder="在此粘贴你的 RawJSON..."></textarea>
                <button onclick="window.App.JsonLogic.decodeJson()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">解析</button>
            </div>
        `;
    }

    public getEditModalContent(type: string, tag: HTMLElement | null): string {
        if (!tag) return '';

        let content = '';

        switch (type) {
            case 'score':
                content = `
                    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">编辑计分板</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="${MODAL_LABEL_CLASSES}">计分对象</label>
                            <div class="flex">
                                <input id="score-name" type="text" value="${tag.dataset.name || ''}" class="${MODAL_INPUT_CLASSES} flex-grow" placeholder="@p, 玩家名...">
                                <button type="button" onclick="window.App.UI.showSelectorEditorForScoreName('score-name')" class="ml-2 p-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded h-10 w-10 flex items-center justify-center">?</button>
                            </div>
                        </div>
                        <div>
                            <label class="${MODAL_LABEL_CLASSES}">计分项</label>
                            <input id="score-objective" type="text" value="${tag.dataset.objective || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="分数, 金钱...">
                        </div>
                    </div>
                `;
                break;
            case 'translate':
                content = `
                    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">编辑翻译</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="${MODAL_LABEL_CLASSES}">翻译键</label>
                            <input id="translate-key" type="text" value="${tag.dataset.translate || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="welcome.message.1">
                        </div>
                        <div>
                            <label class="${MODAL_LABEL_CLASSES}">参数 (JSON 数组格式)</label>
                            <textarea id="translate-with" class="w-full h-24 ${MODAL_INPUT_CLASSES}" placeholder='[{"text":"玩家"}]'>${tag.dataset.with || ''}</textarea>
                        </div>
                    </div>
                `;
                break;
            case 'conditional':
                // This case is now handled by ConditionalEditor.ts, but we can keep a fallback or placeholder if needed.
                // For this refactoring, we assume it's handled externally and this part won't be called for 'conditional'.
                break;
        }

        return `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <div class="flex justify-between items-center">
                    <div></div>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                ${content}
                <div class="mt-6 flex justify-end space-x-2">
                    <button onclick="window.App.UI.hideCurrentModal()" class="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-bold py-2 px-4 rounded">取消</button>
                    <button onclick="window.App.RichTextEditor.applyEdit()" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">保存</button>
                </div>
            </div>
        `;
    }
}
