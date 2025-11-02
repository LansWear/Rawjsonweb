// script/ui/Help.ts

import { FAMILY_TYPES } from '../utils.js';

export class Help {
    public showFamilyTypesDoc(): void {
        const content = `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto text-gray-800 dark:text-gray-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">可用族类型</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                <ul class="list-disc list-inside space-y-1 text-sm font-mono">
                    ${FAMILY_TYPES.map(type => `<li>${type}</li>`).join('')}
                </ul>
            </div>
        `;
        window.App.UI.modalManager.show(content);
    }

    public showRotationHelp(): void {
        const content = `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto text-gray-800 dark:text-gray-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">旋转参数说明</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                <div class="space-y-4 text-sm">
                    <p>旋转参数用于选择面向特定方向的实体。</p>
                    <p><strong class="font-semibold">垂直旋转 (rx, rxm):</strong></p>
                    <ul class="list-disc list-inside ml-4">
                        <li>范围从 -90 (直视上方) 到 90 (直视下方)。</li>
                        <li><code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">rx</code> 是最大值, <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">rxm</code> 是最小值。</li>
                        <li>示例: <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">rx=90, rxm=45</code> 会选择向下看的实体。</li>
                    </ul>
                    <p><strong class="font-semibold">水平旋转 (ry, rym):</strong></p>
                    <ul class="list-disc list-inside ml-4">
                        <li>范围从 -180 到 180。</li>
                        <li>0 度是正南, -90 是正东, 90 是正西, 180/-180 是正北。</li>
                        <li><code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">ry</code> 是最大值, <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">rym</code> 是最小值。</li>
                        <li>示例: <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">ry=-45, rym=-135</code> 会选择朝东方向的实体。</li>
                    </ul>
                    <img src="/static/images/rotation_guide.webp" alt="Rotation Guide" class="mt-4 rounded-lg">
                </div>
            </div>
        `;
        window.App.UI.modalManager.show(content);
    }

    public showDimensionHelp(): void {
        const content = `
            <div class="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto text-gray-800 dark:text-gray-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">维度参数 (dx, dy, dz) 说明</h2>
                    <button class="close-modal-btn text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
                </div>
                <div class="space-y-4 text-sm">
                    <p>
                        <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">dx</code>, 
                        <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">dy</code>, 和 
                        <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">dz</code> 
                        用于定义一个三维长方体选择区域。它们代表从原点（由 <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">x, y, z</code> 参数指定，如果未指定则为命令执行位置）沿各轴延伸的距离。
                    </p>
                    <ul class="list-disc list-inside ml-4">
                        <li>这些值可以是正数、负数或小数。</li>
                        <li>它们定义的是一个体积，而不是一个点。</li>
                        <li>例如: <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">x=10, y=64, z=20, dx=5, dy=3, dz=5</code> 会选择从 (10, 64, 20) 到 (15, 67, 25) 这个 5x3x5 的长方体内的所有实体。</li>
                        <li>如果只提供 <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">dx, dy, dz</code> 而没有 <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded">x, y, z</code>，则会以命令执行者的位置为起点创建一个长方体。</li>
                    </ul>
                    <img src="/static/images/dimension_guide.webp" alt="Dimension Guide" class="mt-4 rounded-lg">
                </div>
            </div>
        `;
        window.App.UI.modalManager.show(content);
    }
}
