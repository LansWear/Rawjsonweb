# Minecraft 基岩版文本转 JSON 工具

这是一个用于将文本转换为 JSON 的工具，适用于 Minecraft 基岩版。

## 功能

- 支持插入颜色代码
- 支持插入计分板、选择器和翻译功能
- 实时预览文本效果
- 生成 JSON 格式的文本
- 解析 JSON 并显示在编辑器中

## 使用方法

1. 在编辑器中输入文本。
2. 使用下方按钮插入格式代码或功能。
3. 点击“生成 JSON”按钮生成 JSON。
4. 在“Raw JSON”区域查看生成的 JSON。
5. 使用“复制”按钮复制 JSON。
6. 使用“解析 JSON”解析你的 JSON。

## 开发

### 更新 TailwindCSS

本工具使用 TailwindCSS 来构建用户界面，并通过 CDN 的方式引入。为了确保安全性，我们为 TailwindCSS 的 `<script>` 标签添加了子资源完整性（Subresource Integrity, SRI）校验。

如果你需要更新 TailwindCSS 的版本，请遵循以下步骤：

1.  访问 [TailwindCSS CDN](https://tailwindcss.com/docs/installation/play-cdn) 获取最新版本的 CDN 链接。
2.  使用 SRI Hash 生成器（例如 [srihash.org](https://www.srihash.org/)）为新的 CDN 链接生成一个新的 `integrity` 哈希值。
3.  更新 `index.html` 文件中的 `<script>` 标签，替换 `src` 和 `integrity` 属性。

```html
<script src="https://cdn.tailwindcss.com" integrity="sha384-你的新哈希值" crossorigin="anonymous"></script>
```

**注意**：在更新后，请务必清除浏览器缓存并进行测试，以确保页面样式正常加载。


### 贡献

欢迎提交问题和贡献代码！

## 许可证

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)

版权所有 (c) 2025 Akanyi
