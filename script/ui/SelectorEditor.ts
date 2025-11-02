// script/ui/SelectorEditor.ts

import { MODAL_INPUT_CLASSES, MODAL_LABEL_CLASSES, MODAL_GRID_CLASSES, MODAL_SECTION_TITLE_CLASSES } from '../utils.js';

export class SelectorEditor {
    public getSelectorModalContent(tag: HTMLElement): string {
        const selectorStr = tag.dataset.selector || '@p';
        const { base, params } = this.parseSelectorString(selectorStr);

        // Determine initial mode based on whether the selector string is complex
        const isAdvancedMode = !selectorStr.match(/^@[prsaen]$/) || selectorStr.includes('[');

        return `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">选择器编辑器</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>

                <div class="mb-4 flex justify-center space-x-4">
                    <button id="selector-mode-advanced" class="px-4 py-2 rounded ${isAdvancedMode ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}" onclick="window.App.UI.setSelectorMode(true)">高级模式</button>
                    <button id="selector-mode-manual" class="px-4 py-2 rounded ${!isAdvancedMode ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}" onclick="window.App.UI.setSelectorMode(false)">手动模式</button>
                </div>

                <div id="selector-advanced-form" class="${isAdvancedMode ? '' : 'hidden'} space-y-6">
                    <!-- 基本参数 -->
                    <div class="${MODAL_GRID_CLASSES}">
                        <h3 class="${MODAL_SECTION_TITLE_CLASSES}">基本</h3>
                        <div>
                            <label for="sel-base" class="${MODAL_LABEL_CLASSES}">目标</label>
                            <select id="sel-base" class="${MODAL_INPUT_CLASSES}">
                                <option value="p" ${base === 'p' ? 'selected' : ''}>@p (最近的玩家)</option>
                                <option value="r" ${base === 'r' ? 'selected' : ''}>@r (随机玩家)</option>
                                <option value="a" ${base === 'a' ? 'selected' : ''}>@a (所有玩家)</option>
                                <option value="e" ${base === 'e' ? 'selected' : ''}>@e (所有实体)</option>
                                <option value="s" ${base === 's' ? 'selected' : ''}>@s (执行者)</option>
                                <option value="n" ${base === 'n' ? 'selected' : ''}>@n (最近的实体)</option>
                            </select>
                        </div>
                        <div>
                            <label for="sel-type" class="${MODAL_LABEL_CLASSES}">实体类型 (type)</label>
                            <input id="sel-type" type="text" value="${params.type || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="minecraft:player">
                        </div>
                        <div>
                            <label for="sel-name" class="${MODAL_LABEL_CLASSES}">名称 (name)</label>
                            <input id="sel-name" type="text" value="${params.name || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="Steve">
                        </div>
                        <div>
                            <label for="sel-c" class="${MODAL_LABEL_CLASSES}">数量 (c)</label>
                            <input id="sel-c" type="number" value="${params.c || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="正数=最近, 负数=最远">
                        </div>
                         <div class="flex items-end gap-2">
                            <div class="flex-grow">
                                <label for="sel-family" class="${MODAL_LABEL_CLASSES}">族 (family)</label>
                                <input id="sel-family" type="text" value="${params.family || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="monster">
                            </div>
                            <button type="button" onclick="window.App.UI.showFamilyTypesDoc()" class="p-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded h-10 w-10 flex items-center justify-center">?</button>
                        </div>
                    </div>

                    <!-- 坐标与距离 -->
                    <div class="${MODAL_GRID_CLASSES}">
                        <h3 class="${MODAL_SECTION_TITLE_CLASSES}">坐标与距离</h3>
                        <div><label for="sel-x" class="${MODAL_LABEL_CLASSES}">X坐标 (x)</label><input id="sel-x" type="text" value="${params.x || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="~, 10, ~-5"></div>
                        <div><label for="sel-y" class="${MODAL_LABEL_CLASSES}">Y坐标 (y)</label><input id="sel-y" type="text" value="${params.y || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="~, 64, ~10"></div>
                        <div><label for="sel-z" class="${MODAL_LABEL_CLASSES}">Z坐标 (z)</label><input id="sel-z" type="text" value="${params.z || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="~, 100, ~-5"></div>
                        <div><label for="sel-r" class="${MODAL_LABEL_CLASSES}">最大半径 (r)</label><input id="sel-r" type="number" value="${params.r || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="10"></div>
                            <div><label for="sel-rm" class="${MODAL_LABEL_CLASSES}">最小半径 (rm)</label><input id="sel-rm" type="number" value="${params.rm || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="1"></div>
                        </div>

                        <!-- 旋转角度 -->
                        <div class="${MODAL_GRID_CLASSES}">
                            <h3 class="${MODAL_SECTION_TITLE_CLASSES} flex items-center">
                                旋转角度
                                <button type="button" onclick="window.App.UI.showRotationHelp()" class="ml-2 p-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded h-6 w-6 flex items-center justify-center text-xs font-bold">?</button>
                            </h3>
                            <div>
                                <label for="sel-rx" class="${MODAL_LABEL_CLASSES}">最大垂直旋转 (rx)</label>
                                <input id="sel-rx" type="number" value="${params.rx || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="90">
                            </div>
                            <div>
                                <label for="sel-rxm" class="${MODAL_LABEL_CLASSES}">最小垂直旋转 (rxm)</label>
                                <input id="sel-rxm" type="number" value="${params.rxm || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="-90">
                            </div>
                            <div>
                                <label for="sel-ry" class="${MODAL_LABEL_CLASSES}">最大水平旋转 (ry)</label>
                                <input id="sel-ry" type="number" value="${params.ry || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="180">
                            </div>
                            <div>
                                <label for="sel-rym" class="${MODAL_LABEL_CLASSES}">最小水平旋转 (rym)</label>
                                <input id="sel-rym" type="number" value="${params.rym || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="-180">
                            </div>
                        </div>

                        <!-- 维度选择 -->
                        <div class="${MODAL_GRID_CLASSES}">
                            <h3 class="${MODAL_SECTION_TITLE_CLASSES} flex items-center">
                                维度选择 (dx, dy, dz)
                                <button type="button" onclick="window.App.UI.showDimensionHelp()" class="ml-2 p-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded h-6 w-6 flex items-center justify-center text-xs font-bold">?</button>
                            </h3>
                            <div>
                                <label for="sel-dx" class="${MODAL_LABEL_CLASSES}">X维度 (dx)</label>
                                <input id="sel-dx" type="text" value="${params.dx || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="10.5">
                            </div>
                            <div>
                                <label for="sel-dy" class="${MODAL_LABEL_CLASSES}">Y维度 (dy)</label>
                                <input id="sel-dy" type="text" value="${params.dy || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="-5">
                            </div>
                            <div>
                                <label class="${MODAL_LABEL_CLASSES}">Z维度 (dz)</label>
                                <input id="sel-dz" type="text" value="${params.dz || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="20">
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 col-span-full mt-1">
                                定义一个长方体区域。可为负数和小数。
                                如果未指定 x, y, z 坐标，则以命令执行位置为原点。
                            </p>
                        </div>
                        
                        <!-- 标签 -->
                        <div class="${MODAL_GRID_CLASSES}">
                            <h3 class="${MODAL_SECTION_TITLE_CLASSES}">标签 (tag)</h3>
                            <div class="col-span-full">
                                <input id="sel-tag" type="text" value="${params.tag || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="vip, !member, ...">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">用逗号分隔多个标签. 例如: vip,!newbie</p>
                            </div>
                        </div>

                        <!-- 物品栏 (hasitem) -->
                        <div class="${MODAL_GRID_CLASSES}">
                            <h3 class="${MODAL_SECTION_TITLE_CLASSES} flex items-center justify-between">
                                <span>物品栏 (hasitem)</span>
                                <button type="button" onclick="window.App.UI.showHasitemEditorModal()" class="ml-2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded h-8 w-8 flex items-center justify-center text-xs font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                            </h3>
                            <div class="col-span-full">
                                <textarea id="sel-hasitem" class="w-full h-24 font-mono ${MODAL_INPUT_CLASSES}" placeholder='{item=apple,quantity=1..}\n或者\n[{item=diamond,quantity=3..},{item=stick,quantity=2..}]'>${params.hasitem || ''}</textarea>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    输入 \`key=value\` 格式的物品条件。单个条件用 {}，多个条件用 [] 包裹并用逗号分隔。
                                    例如: <code>{item=apple}</code> 或 <code>[{item=diamond,quantity=3..},{item=stick,quantity=2..}]</code>
                                </p>
                            </div>
                        </div>

                    <!-- 玩家数据 -->
                    <div class="${MODAL_GRID_CLASSES}">
                        <h3 class="${MODAL_SECTION_TITLE_CLASSES}">玩家数据</h3>
                        <div>
                            <label for="sel-m" class="${MODAL_LABEL_CLASSES}">游戏模式 (m)</label>
                            <select id="sel-m" class="${MODAL_INPUT_CLASSES}">
                                <option value="">任何</option>
                                <option value="s" ${params.m === 's' ? 'selected' : ''}>生存 (s)</option>
                                <option value="c" ${params.m === 'c' ? 'selected' : ''}>创造 (c)</option>
                                <option value="a" ${params.m === 'a' ? 'selected' : ''}>冒险 (a)</option>
                                <option value="d" ${params.m === 'd' ? 'selected' : ''}>默认 (d)</option>
                            </select>
                        </div>
                        <div><label for="sel-lm" class="${MODAL_LABEL_CLASSES}">最小等级 (lm)</label><input id="sel-lm" type="number" value="${params.lm || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="10"></div>
                        <div><label for="sel-l" class="${MODAL_LABEL_CLASSES}">最大等级 (l)</label><input id="sel-l" type="number" value="${params.l || ''}" class="${MODAL_INPUT_CLASSES}" placeholder="50"></div>
                    </div>

                    <!-- 计分板 (scores) -->
                    <div class="${MODAL_GRID_CLASSES}">
                        <h3 class="${MODAL_SECTION_TITLE_CLASSES} flex items-center justify-between">
                            <span>计分板 (scores)</span>
                            <button type="button" onclick="window.App.UI.showScoreEditorModal()" class="ml-2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded h-8 w-8 flex items-center justify-center text-xs font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </button>
                        </h3>
                        <div class="col-span-full">
                            <textarea id="sel-scores" class="w-full h-24 font-mono ${MODAL_INPUT_CLASSES}" placeholder='{myscore=10}\n或者\n{myscore=10..12,another_score=5..}'>${params.scores || ''}</textarea>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                输入 \`{记分项=值}\` 格式的计分板条件。支持范围和不等号。
                                例如: <code>{myscore=10}</code> 或 <code>{myscore=10..12,another_score=!5}</code>
                            </p>
                        </div>
                    </div>
                </div>

                <div id="selector-manual-form" class="${isAdvancedMode ? 'hidden' : ''} space-y-4">
                    <label for="manual-selector-input" class="${MODAL_LABEL_CLASSES}">手动输入选择器</label>
                    <textarea id="manual-selector-input" class="w-full h-32 font-mono ${MODAL_INPUT_CLASSES}" placeholder="@a[tag=vip,r=10]">${selectorStr}</textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">直接输入完整的选择器字符串。</p>
                </div>

                <div class="mt-6 flex justify-end space-x-2">
                    <button onclick="window.App.UI.hideCurrentModal()" class="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-bold py-2 px-4 rounded">取消</button>
                    <button onclick="window.App.RichTextEditor.applySelectorEdit()" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">保存</button>
                </div>
            </div>
        `;
    }

    public setSelectorMode(isAdvanced: boolean): void {
        const advancedForm = document.getElementById('selector-advanced-form');
        const manualForm = document.getElementById('selector-manual-form');
        const advancedButton = document.getElementById('selector-mode-advanced');
        const manualButton = document.getElementById('selector-mode-manual');

        if (advancedForm && manualForm && advancedButton && manualButton) {
            const manualInput = document.getElementById('manual-selector-input') as HTMLTextAreaElement;

            if (isAdvanced) {
                if (manualInput) {
                    const { base, params } = this.parseSelectorString(manualInput.value);
                    (document.getElementById('sel-base') as HTMLSelectElement).value = base;
                    (document.getElementById('sel-type') as HTMLInputElement).value = params.type || '';
                    (document.getElementById('sel-name') as HTMLInputElement).value = params.name || '';
                    (document.getElementById('sel-c') as HTMLInputElement).value = params.c || '';
                    (document.getElementById('sel-family') as HTMLInputElement).value = params.family || '';
                    (document.getElementById('sel-x') as HTMLInputElement).value = params.x || '';
                    (document.getElementById('sel-y') as HTMLInputElement).value = params.y || '';
                    (document.getElementById('sel-z') as HTMLInputElement).value = params.z || '';
                    (document.getElementById('sel-r') as HTMLInputElement).value = params.r || '';
                    (document.getElementById('sel-rm') as HTMLInputElement).value = params.rm || '';
                    (document.getElementById('sel-rx') as HTMLInputElement).value = params.rx || '';
                    (document.getElementById('sel-rxm') as HTMLInputElement).value = params.rxm || '';
                    (document.getElementById('sel-ry') as HTMLInputElement).value = params.ry || '';
                    (document.getElementById('sel-rym') as HTMLInputElement).value = params.rym || '';
                    (document.getElementById('sel-dx') as HTMLInputElement).value = params.dx || '';
                    (document.getElementById('sel-dy') as HTMLInputElement).value = params.dy || '';
                    (document.getElementById('sel-dz') as HTMLInputElement).value = params.dz || '';
                    (document.getElementById('sel-tag') as HTMLInputElement).value = params.tag || '';
                    (document.getElementById('sel-m') as HTMLSelectElement).value = params.m || '';
                    (document.getElementById('sel-lm') as HTMLInputElement).value = params.lm || '';
                    (document.getElementById('sel-l') as HTMLInputElement).value = params.l || '';
                }
                advancedForm.classList.remove('hidden');
                manualForm.classList.add('hidden');
                advancedButton.classList.add('bg-blue-500', 'text-white');
                advancedButton.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                manualButton.classList.remove('bg-blue-500', 'text-white');
                manualButton.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            } else {
                const base = (document.getElementById('sel-base') as HTMLSelectElement).value;
                const params: { [key: string]: string } = {
                    type: (document.getElementById('sel-type') as HTMLInputElement).value,
                    name: (document.getElementById('sel-name') as HTMLInputElement).value,
                    c: (document.getElementById('sel-c') as HTMLInputElement).value,
                    family: (document.getElementById('sel-family') as HTMLInputElement).value,
                    x: (document.getElementById('sel-x') as HTMLInputElement).value,
                    y: (document.getElementById('sel-y') as HTMLInputElement).value,
                    z: (document.getElementById('sel-z') as HTMLInputElement).value,
                    r: (document.getElementById('sel-r') as HTMLInputElement).value,
                    rm: (document.getElementById('sel-rm') as HTMLInputElement).value,
                    rx: (document.getElementById('sel-rx') as HTMLInputElement).value,
                    rxm: (document.getElementById('sel-rxm') as HTMLInputElement).value,
                    ry: (document.getElementById('sel-ry') as HTMLInputElement).value,
                    rym: (document.getElementById('sel-rym') as HTMLInputElement).value,
                    dx: (document.getElementById('sel-dx') as HTMLInputElement).value,
                    dy: (document.getElementById('sel-dy') as HTMLInputElement).value,
                    dz: (document.getElementById('sel-dz') as HTMLInputElement).value,
                    tag: (document.getElementById('sel-tag') as HTMLInputElement).value,
                    m: (document.getElementById('sel-m') as HTMLSelectElement).value,
                    lm: (document.getElementById('sel-lm') as HTMLInputElement).value,
                    l: (document.getElementById('sel-l') as HTMLInputElement).value,
                };
                manualInput.value = this.buildSelectorString(base, params);

                manualForm.classList.remove('hidden');
                advancedForm.classList.add('hidden');
                manualButton.classList.add('bg-blue-500', 'text-white');
                manualButton.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                advancedButton.classList.remove('bg-blue-500', 'text-white');
                advancedButton.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            }
        }
    }

    public parseSelectorString(selector: string): { base: string, params: { [key: string]: string } } {
        const baseMatch = selector.match(/^@([prsaen])/);
        const base = baseMatch ? baseMatch[1] : 'p';
        const params: { [key: string]: string } = {};

        const paramsMatch = selector.match(/\[(.*)\]/);
        if (paramsMatch) {
            const paramsStr = paramsMatch[1];
            // 更稳健的分割，处理带引号的值
            paramsStr.split(',').forEach(part => {
                const [key, ...valueParts] = part.split('=');
                if (key) {
                    // 重新组合值，并去除可能存在的引号
                    const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
                    params[key.trim()] = value.trim();
                }
            });
        }
        return { base, params };
    }

    public buildSelectorStringFromModal(): string {
        const isAdvanced = !document.getElementById('selector-advanced-form')?.classList.contains('hidden');

        if (isAdvanced) {
            const base = (document.getElementById('sel-base') as HTMLSelectElement).value;
            const params: { [key: string]: string } = {};
            const keys = ['type', 'name', 'c', 'family', 'x', 'y', 'z', 'r', 'rm', 'rx', 'rxm', 'ry', 'rym', 'dx', 'dy', 'dz', 'tag', 'scores', 'hasitem', 'm', 'lm', 'l'];
            keys.forEach(key => {
                const element = document.getElementById(`sel-${key}`) as HTMLInputElement | HTMLSelectElement;
                if (element && element.value) {
                    params[key] = element.value;
                }
            });
            return this.buildSelectorString(base, params);
        } else {
            return (document.getElementById('manual-selector-input') as HTMLTextAreaElement).value;
        }
    }

    private buildSelectorString(base: string, params: { [key: string]: string }): string {
        let selector = `@${base}`;
        const paramsArray: string[] = [];

        for (const key in params) {
            const value = params[key];
            if (value !== null && value !== undefined && value.trim() !== '') {
                // 如果值包含空格或逗号，并且不是hasitem或scores，则添加引号
                if ((value.includes(' ') || value.includes(',')) && key !== 'hasitem' && key !== 'scores' && !/^{.*}$/.test(value) && !/^\[.*\]$/.test(value)) {
                    paramsArray.push(`${key}="${value}"`);
                } else {
                    paramsArray.push(`${key}=${value}`);
                }
            }
        }

        if (paramsArray.length > 0) {
            selector += `[${paramsArray.join(',')}]`;
        }
        return selector;
    }
}
