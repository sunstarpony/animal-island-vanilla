# Animal Island UI — 使用教程

---

## 目录

1. [快速开始](#1-快速开始)
2. [文件结构](#2-文件结构)
3. [设计令牌（CSS 变量）](#3-设计令牌css-变量)
4. [组件一览](#4-组件一览)
5. [各组件详细用法](#5-各组件详细用法)
   - [Button 按钮](#51-button-按钮)
   - [Card 卡片](#52-card-卡片)
   - [Checkbox 复选框](#53-checkbox-复选框)
   - [CodeBlock 代码块](#54-codeblock-代码块)
   - [Collapse 折叠面板](#55-collapse-折叠面板)
   - [Cursor 自定义光标](#56-cursor-自定义光标)
   - [Divider 分割线](#57-divider-分割线)
   - [Footer 页脚](#58-footer-页脚)
   - [Icon 图标](#59-icon-图标)
   - [Input 输入框](#510-input-输入框)
   - [Loading 加载动画](#511-loading-加载动画)
   - [Modal 弹窗](#512-modal-弹窗)
   - [Phone 手机](#513-phone-手机)
   - [Select 下拉选择](#514-select-下拉选择)
   - [Switch 开关](#515-switch-开关)
   - [Table 表格](#516-table-表格)
   - [Tabs 选项卡](#517-tabs-选项卡)
   - [Time 实时时钟](#518-time-实时时钟)
   - [Typewriter 打字机](#519-typewriter-打字机)
6. [自动初始化](#6-自动初始化)
7. [JavaScript API 总览](#7-javascript-api-总览)
8. [自定义主题](#8-自定义主题)
9. [浏览器兼容性](#9-浏览器兼容性)

---

## 1. 快速开始

### 第一步：下载文件

将以下文件和文件夹下载到你的项目中，保持目录结构不变：

```
your-project/
├── index.html
├── css/
│   └── animal-island.css
├── js/
│   └── animal-island.js
└── assets/
    └── img/
        ├── cursor/
        ├── dividers/
        ├── footer/
        └── icons/
```

### 第二步：引入文件

在你的 HTML 文件中引入 CSS 和 JS：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>

  <!-- Google Fonts（推荐） -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- 核心样式 -->
  <link rel="stylesheet" href="css/animal-island.css">
</head>
<body>

  <!-- 你的内容写在这里 -->

  <!-- 核心脚本（放在 body 末尾） -->
  <script src="js/animal-island.js"></script>
</body>
</html>
```

### 第三步：开始使用

直接在 HTML 中写组件的 class 即可，JS 会自动初始化带有 `data-ai` 属性的组件：

```html
<button class="ai-btn ai-btn--md ai-btn--primary">点击我</button>
```

---

## 2. 文件结构

| 文件 | 说明 | 是否必须 |
|------|------|----------|
| `css/animal-island.css` | 核心样式文件，包含所有组件和设计令牌 | **必须** |
| `js/animal-island.js` | 核心脚本，包含所有交互逻辑和自动初始化 | **必须** |
| `assets/` | 图片资源（图标、光标、分割线、页脚等） | 使用对应组件时需要 |

> **提示**：所有组件均为零外部依赖，无需额外加载任何第三方库。

---

## 3. 设计令牌（CSS 变量）

所有设计令牌以 `--ai-` 为前缀定义在 `:root` 上，你可以通过覆盖这些变量来自定义主题：

```css
:root {
  /* 主色 */
  --ai-primary: #19c8b9;
  --ai-primary-hover: #3dd4c6;
  --ai-primary-active: #50B9AB;
  --ai-primary-bg: #e6f9f6;

  /* 语义色 */
  --ai-success: #6fba2c;
  --ai-success-hover: #85cc45;
  --ai-success-active: #5a9e1e;
  --ai-warning: #f5c31c;
  --ai-warning-hover: #f7d04a;
  --ai-warning-active: #dba90e;
  --ai-error: #e05a5a;
  --ai-error-hover: #e87878;
  --ai-error-active: #c94444;

  /* 文字色 */
  --ai-text: #794f27;
  --ai-text-secondary: #9f927d;
  --ai-text-disabled: #c4b89e;

  /* 边框色 */
  --ai-border: #aaa69d;
  --ai-border-hover: #827157;
  --ai-border-light: #e8e2d6;

  /* 背景色 */
  --ai-bg: #f8f8f0;
  --ai-bg-secondary: #f0e8d8;
  --ai-bg-disabled: #f0ece2;

  /* 字体 */
  --ai-font-family: Nunito, 'Noto Sans SC', 'Zen Maru Gothic',
    'HarmonyOS Sans SC', 'MiSans',
    -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    sans-serif;
  --ai-font-size-sm: 12px;
  --ai-font-size-base: 14px;
  --ai-font-size-lg: 16px;
  --ai-line-height: 1.5715;

  /* 间距 */
  --ai-spacing-xs: 4px;
  --ai-spacing-sm: 8px;
  --ai-spacing-md: 12px;
  --ai-spacing-lg: 16px;
  --ai-spacing-xl: 24px;

  /* 圆角 */
  --ai-radius-sm: 16px;
  --ai-radius-base: 18px;
  --ai-radius-lg: 24px;
  --ai-border-width: 2px;

  /* 阴影 */
  --ai-shadow-sm: 0 2px 4px 0 rgba(61, 52, 40, 0.06);
  --ai-shadow-base: 0 3px 10px 0 rgba(61, 52, 40, 0.1);
  --ai-shadow-lg: 0 8px 24px 0 rgba(61, 52, 40, 0.14);

  /* 动画 */
  --ai-duration-fast: 0.15s;
  --ai-duration-base: 0.25s;
  --ai-duration-slow: 0.35s;
  --ai-ease: cubic-bezier(0.4, 0, 0.2, 1);

  /* 尺寸 */
  --ai-height-sm: 32px;
  --ai-height-base: 40px;
  --ai-height-lg: 48px;
}
```

---

## 4. 组件一览

| 组件 | 纯 CSS | 需要 JS | 自动初始化 |
|------|--------|---------|------------|
| Button | ✓ | | |
| Card | ✓ | | |
| Checkbox | | ✓ | `data-ai="checkbox"` |
| CodeBlock | | ✓ | `.ai-code-block` |
| Collapse | | ✓ | `.ai-collapse` |
| Cursor | ✓ | | |
| Divider | ✓ | | |
| Footer | ✓ | | |
| Icon | ✓ | | |
| Input | | ✓ | `.ai-input-wrapper .ai-input` |
| Loading | | ✓ | `data-ai="loading"` |
| Modal | | ✓ | 手动调用 |
| Phone | | ✓ | `data-ai="phone"` |
| Select | | ✓ | `data-ai="select"` |
| Switch | | ✓ | `.ai-switch` |
| Table | | ✓ | `data-ai="table"` |
| Tabs | | ✓ | `data-ai="tabs"` |
| Time | | ✓ | `data-ai="time"` |
| Typewriter | | ✓ | 手动调用 |

---

## 5. 各组件详细用法

### 5.1 Button 按钮

纯 CSS 组件，无需 JS。

#### 按钮类型

```html
<!-- 主要按钮 -->
<button class="ai-btn ai-btn--md ai-btn--primary">Primary</button>

<!-- 默认按钮 -->
<button class="ai-btn ai-btn--md ai-btn--default">Default</button>

<!-- 虚线按钮 -->
<button class="ai-btn ai-btn--md ai-btn--dashed">Dashed</button>

<!-- 文本按钮 -->
<button class="ai-btn ai-btn--md ai-btn--text">Text</button>

<!-- 链接按钮 -->
<button class="ai-btn ai-btn--md ai-btn--link">Link</button>
```

#### 按钮尺寸

```html
<button class="ai-btn ai-btn--sm ai-btn--primary">Small</button>
<button class="ai-btn ai-btn--md ai-btn--primary">Middle</button>
<button class="ai-btn ai-btn--lg ai-btn--primary">Large</button>
```

#### 危险按钮

危险样式可与 `primary`、`default`、`dashed`、`text`、`link` 组合使用：

```html
<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--danger">Danger Primary</button>
<button class="ai-btn ai-btn--md ai-btn--default ai-btn--danger">Danger Default</button>
<button class="ai-btn ai-btn--md ai-btn--dashed ai-btn--danger">Danger Dashed</button>
<button class="ai-btn ai-btn--md ai-btn--text ai-btn--danger">Danger Text</button>
<button class="ai-btn ai-btn--md ai-btn--link ai-btn--danger">Danger Link</button>
```

#### 幽灵按钮

幽灵样式可与 `primary`、`default`、`danger` 组合使用：

```html
<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--ghost">Ghost Primary</button>
<button class="ai-btn ai-btn--md ai-btn--default ai-btn--ghost">Ghost Default</button>
<button class="ai-btn ai-btn--md ai-btn--danger ai-btn--ghost">Ghost Danger</button>
```

#### 禁用 & 加载

```html
<button class="ai-btn ai-btn--md ai-btn--primary" disabled>Disabled</button>
<button class="ai-btn ai-btn--md ai-btn--loading">Loading...</button>
```

#### 块级按钮

```html
<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--block">Block Button</button>
```

#### 带图标

```html
<button class="ai-btn ai-btn--md ai-btn--primary">
  <span class="ai-btn__icon">⭐</span> Star
</button>
```

---

### 5.2 Card 卡片

纯 CSS 组件。

#### 卡片类型

```html
<!-- 默认卡片 -->
<div class="ai-card">卡片内容</div>

<!-- 带标题卡片 -->
<div class="ai-card ai-card--title">标题卡片</div>

<!-- 虚线卡片 -->
<div class="ai-card ai-card--dashed">虚线卡片</div>
```

#### 颜色变体

```html
<div class="ai-card ai-card--app-pink">粉色卡片</div>
<div class="ai-card ai-card--purple">紫色卡片</div>
<div class="ai-card ai-card--app-blue">蓝色卡片</div>
<div class="ai-card ai-card--app-yellow">黄色卡片</div>
<div class="ai-card ai-card--app-orange">橙色卡片</div>
<div class="ai-card ai-card--app-teal">青色卡片</div>
<div class="ai-card ai-card--app-green">绿色卡片</div>
<div class="ai-card ai-card--app-red">红色卡片</div>
<div class="ai-card ai-card--lime-green">青柠卡片</div>
<div class="ai-card ai-card--yellow-green">黄绿卡片</div>
<div class="ai-card ai-card--brown">棕色卡片</div>
<div class="ai-card ai-card--warm-peach-pink">暖桃卡片</div>
```

#### 颜色 + 标题组合

```html
<div class="ai-card ai-card--title ai-card--app-blue">
  <div style="font-weight:700;font-size:15px;margin-bottom:6px">蓝色标题卡片</div>
  <div style="font-size:12px;opacity:.85">type="title" + color="app-blue"</div>
</div>
```

---

### 5.3 Checkbox 复选框

需要 JS 初始化，支持自动初始化。

#### 基本用法

```html
<div data-ai="checkbox" class="ai-checkbox-group">
  <label class="ai-checkbox-item ai-checkbox-item--md" data-value="apple">
    <span class="ai-checkbox-box">
      <span class="ai-checkbox-checkmark" style="display:none">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </span>
    <span class="ai-checkbox-label">Apple</span>
  </label>
  <label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="orange">
    <span class="ai-checkbox-box">
      <span class="ai-checkbox-checkmark" style="display:flex">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </span>
    <span class="ai-checkbox-label">Orange</span>
  </label>
</div>
```

> **注意**：选中项添加 `ai-checkbox-item--checked` 类，并将 `.ai-checkbox-checkmark` 的 `display` 设为 `flex`。

#### 尺寸

```html
<label class="ai-checkbox-item ai-checkbox-item--sm" data-value="small">...</label>
<label class="ai-checkbox-item ai-checkbox-item--md" data-value="middle">...</label>
<label class="ai-checkbox-item ai-checkbox-item--lg" data-value="large">...</label>
```

#### 垂直布局

```html
<div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--vertical">
  ...
</div>
```

#### 禁用

```html
<!-- 单项禁用 -->
<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--disabled" data-value="cherry">
  ...
</label>

<!-- 整组禁用（CSS 方式） -->
<div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--disabled">
  ...
</div>
```

#### JS API

```javascript
var checkbox = new AnimalIsland.Checkbox(document.querySelector('.ai-checkbox-group'), {
  defaultValue: ['apple', 'orange'],   // 默认选中值数组
  disabled: true,                       // 整组禁用
  direction: 'vertical',                // 垂直布局
  onChange: function (values) {
    console.log('选中值:', values);
  }
});

// 获取当前选中值
var values = checkbox.getValues();
```

#### 事件监听

```javascript
document.querySelector('.ai-checkbox-group').addEventListener('ai-checkbox-change', function (e) {
  console.log('选中值:', e.detail.values);
});
```

---

### 5.4 CodeBlock 代码块

需要 JS 初始化，支持自动初始化。

#### 基本用法

```html
<pre class="ai-code-block">const greeting = "Hello, Animal Island!";
console.log(greeting);</pre>
```

自动初始化：所有 `.ai-code-block` 元素会在页面加载时自动初始化，实现语法高亮。

#### 自定义样式

```html
<pre class="ai-code-block" style="border-radius:5px;background-color:#242c46ff">
  const x = 42;
</pre>
```

#### JS API

```javascript
// 初始化（自动高亮元素内的代码）
var codeBlock = new AnimalIsland.CodeBlock(document.querySelector('.ai-code-block'));

// 静态方法：高亮代码字符串，返回 HTML
var highlightedHtml = AnimalIsland.CodeBlock.highlight('const msg = "Hello";');
// 可用于动态渲染代码示例
document.getElementById('my-code-container').innerHTML =
  '<pre class="ai-code-block">' + highlightedHtml + '</pre>';
```

---

### 5.5 Collapse 折叠面板

需要 JS 初始化，支持自动初始化。点击 header 即可展开/收起。

#### 展开状态

```html
<div class="ai-collapse ai-collapse--expanded">
  <button class="ai-collapse__header" aria-expanded="true">
    <span class="ai-collapse__icon">−</span>
    <span class="ai-collapse__question">如何捕捉稀有鱼类？</span>
    <span class="ai-collapse__leaf">
      <img src="assets/img/icons/icon-leaf.png" alt="">
    </span>
  </button>
  <div class="ai-collapse__answer-wrapper">
    <div class="ai-collapse__answer">
      在雨天或夜晚前往岛屿的河流和池塘，使用鱼饵可以提高稀有鱼出现的概率。
    </div>
  </div>
</div>
```

#### 收起状态

```html
<div class="ai-collapse">
  <button class="ai-collapse__header" aria-expanded="false">
    <span class="ai-collapse__icon">+</span>
    <span class="ai-collapse__question">如何获取更多里数？</span>
    <span class="ai-collapse__leaf">
      <img src="assets/img/icons/icon-leaf.png" alt="">
    </span>
  </button>
  <div class="ai-collapse__answer-wrapper">
    <div class="ai-collapse__answer">
      完成每日任务和成就即可获得里数奖励。
    </div>
  </div>
</div>
```

#### 禁用

```html
<div class="ai-collapse ai-collapse--disabled">
  <!-- 不可点击 -->
</div>
```

> **提示**：展开/收起动画使用 CSS `grid-template-rows` 过渡实现，无需额外 JS。

---

### 5.6 Cursor 自定义光标

纯 CSS 组件，无需 JS。提供两种模式。

#### force 模式 — 强制所有元素使用自定义光标

```html
<div class="ai-cursor--force">
  <p>在这个区域内，所有元素的光标都会变成动物岛风格。</p>
  <button>连按钮也是</button>
</div>
```

#### scoped 模式 — 保留交互语义

scoped 模式下，交互元素（按钮、链接、输入框等）会保留原生光标语义：

```html
<div class="ai-cursor ai-cursor--scoped">
  <p>普通区域使用自定义光标</p>
  <a href="#">链接自动恢复 pointer</a>
  <button>按钮自动恢复 pointer</button>
  <input type="text" placeholder="输入框自动恢复 text">
  <button disabled>禁用按钮自动恢复 not-allowed</button>
</div>
```

scoped 模式自动保留的光标语义：

| 元素 | 光标 |
|------|------|
| `a[href]`、`button`、`[role="button"]`、`select`、`label[for]` | `pointer` |
| `input[type="text"]`、`textarea` 等文本输入 | `text` |
| `[disabled]`、`[aria-disabled="true"]` | `not-allowed` |
| `[data-cursor="pointer"]` | `pointer`（自定义标记） |

> **提示**：如果某个元素需要 pointer 光标但不在默认列表中，可以添加 `data-cursor="pointer"` 属性。

---

### 5.7 Divider 分割线

纯 CSS 组件。

```html
<!-- 棕色直线（默认） -->
<div class="ai-divider"></div>

<!-- 青色直线 -->
<div class="ai-divider ai-divider--teal"></div>

<!-- 白色直线 -->
<div class="ai-divider ai-divider--white"></div>

<!-- 黄色直线 -->
<div class="ai-divider ai-divider--yellow"></div>

<!-- 黄色波浪 -->
<div class="ai-divider ai-divider--wave-yellow"></div>
```

---

### 5.8 Footer 页脚

纯 CSS 组件。

```html
<!-- 默认 tree 类型 -->
<div class="ai-footer"></div>

<!-- sea 类型 -->
<div class="ai-footer ai-footer--sea"></div>
```

> **提示**：Footer 组件依赖 `assets/img/footer/` 目录下的图片资源。

---

### 5.9 Icon 图标

纯 CSS 组件，使用背景图方式显示。

```html
<span class="ai-icon ai-icon--miles"></span>
<span class="ai-icon ai-icon--camera"></span>
<span class="ai-icon ai-icon--chat"></span>
<span class="ai-icon ai-icon--critterpedia"></span>
<span class="ai-icon ai-icon--design"></span>
<span class="ai-icon ai-icon--diy"></span>
<span class="ai-icon ai-icon--helicopter"></span>
<span class="ai-icon ai-icon--map"></span>
<span class="ai-icon ai-icon--shopping"></span>
<span class="ai-icon ai-icon--variant"></span>
```

#### 尺寸

```html
<span class="ai-icon ai-icon--miles" style="width:16px;height:16px"></span>
<span class="ai-icon ai-icon--miles" style="width:24px;height:24px"></span>
<span class="ai-icon ai-icon--miles" style="width:32px;height:32px"></span>
<span class="ai-icon ai-icon--miles" style="width:48px;height:48px"></span>
```

#### 弹跳动画

```html
<span class="ai-icon ai-icon--miles ai-icon--bounce" style="width:32px;height:32px"></span>
```

---

### 5.10 Input 输入框

需要 JS 初始化（清除按钮、密码可见切换、聚焦状态），支持自动初始化。

#### 基本用法

```html
<span class="ai-input-wrapper ai-input-wrapper--md">
  <input class="ai-input" placeholder="请输入内容">
</span>
```

#### 尺寸

```html
<span class="ai-input-wrapper ai-input-wrapper--sm">
  <input class="ai-input" placeholder="小号">
</span>

<span class="ai-input-wrapper ai-input-wrapper--md">
  <input class="ai-input" placeholder="中号">
</span>

<span class="ai-input-wrapper ai-input-wrapper--lg">
  <input class="ai-input" placeholder="大号">
</span>
```

#### 带前缀/后缀

```html
<span class="ai-input-wrapper ai-input-wrapper--md">
  <span class="ai-input__prefix">🍎</span>
  <input class="ai-input" placeholder="带前缀">
</span>

<span class="ai-input-wrapper ai-input-wrapper--md">
  <input class="ai-input" placeholder="带后缀">
  <span class="ai-input__suffix">.com</span>
</span>
```

#### 带清除按钮

```html
<span class="ai-input-wrapper ai-input-wrapper--md">
  <input class="ai-input" placeholder="输入后可清除" value="Hello">
  <button class="ai-input__clear">&times;</button>
</span>
```

#### 密码输入框

```html
<span class="ai-input-wrapper ai-input-wrapper--md">
  <input class="ai-input" type="password" placeholder="请输入密码">
  <button class="ai-input__visibility">👁</button>
</span>
```

#### 状态

```html
<!-- 错误 -->
<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--error">
  <input class="ai-input" placeholder="错误状态">
</span>

<!-- 警告 -->
<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--warning">
  <input class="ai-input" placeholder="警告状态">
</span>

<!-- 禁用 -->
<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--disabled">
  <input class="ai-input" placeholder="禁用" disabled>
</span>
```

#### 聚焦状态

输入框聚焦时会自动添加 `ai-input-wrapper--focused` 类，显示主题色边框和阴影效果。此行为由 JS 自动处理，无需手动添加。

#### JS API

```javascript
var input = new AnimalIsland.Input(document.querySelector('.ai-input'), {
  prefix: '🍎',           // 前缀内容（HTML 字符串）
  suffix: '.com',          // 后缀内容（HTML 字符串）
  allowClear: true,        // 是否显示清除按钮
  onClear: function () {
    console.log('内容已清除');
  }
});
```

---

### 5.11 Loading 加载动画

需要 JS 初始化，支持自动初始化。使用原生 `requestAnimationFrame` 实现，无需任何外部依赖。

#### 基本用法（自动初始化）

```html
<div data-ai="loading" style="width:200px; height:200px;"></div>
```

#### 手动初始化

```html
<div id="my-loading" style="width:100%; height:400px;"></div>

<script>
  var loading = new AnimalIsland.Loading(document.getElementById('my-loading'), {
    active: true
  });

  // 隐藏
  loading.setActive(false);

  // 显示
  loading.setActive(true);
</script>
```

#### 关闭动画

关闭时使用 radial mask 动画（圆形遮罩从中心向外扩散），需要浏览器支持 `@property` CSS 规则。

---

### 5.12 Modal 弹窗

需要 JS 手动调用，不支持自动初始化。

#### 基本用法

```javascript
var modal = new AnimalIsland.Modal({
  title: '欢迎',
  content: '欢迎来到动物岛！这里有你想要的一切。',
  width: 520,
  onOk: function () {
    console.log('点击了确定');
  },
  onClose: function () {
    console.log('弹窗已关闭');
  }
});

modal.open();
```

#### 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | string | `''` | 弹窗标题 |
| `content` | string | `''` | 弹窗内容（支持 HTML） |
| `width` | number | `520` | 弹窗宽度（px） |
| `maskClosable` | boolean | `true` | 点击遮罩是否关闭 |
| `footer` | undefined/null/string | `undefined` | `undefined`=默认按钮，`null`=隐藏，字符串=自定义 HTML |
| `typewriter` | boolean | `true` | 是否使用打字机效果显示内容 |
| `typeSpeed` | number | `80` | 打字机速度（毫秒/字） |
| `cursor` | boolean | `true` | 是否在弹窗内使用自定义光标 |
| `onOk` | function | `null` | 点击确定回调 |
| `onClose` | function | `null` | 关闭回调 |

#### 无底部按钮

```javascript
var modal = new AnimalIsland.Modal({
  title: '提示',
  content: '这是一条提示信息。',
  footer: null
});
modal.open();
```

#### 自定义底部

```javascript
var modal = new AnimalIsland.Modal({
  title: '确认',
  content: '确定要删除吗？',
  footer: '<button class="ai-btn ai-btn--md ai-btn--danger" onclick="this.closest(\'.ai-modal-mask\').remove()">删除</button>'
});
modal.open();
```

#### 关闭弹窗

```javascript
modal.close();
```

> **提示**：Modal 使用 `clip-path` 实现异形裁切效果，按 ESC 键也可关闭弹窗。

---

### 5.13 Phone 手机

需要 JS 初始化，支持自动初始化。

```html
<div data-ai="phone"></div>
```

#### 手动初始化

```javascript
var phone = new AnimalIsland.Phone(document.getElementById('my-phone'));

// 销毁（清除定时器）
phone.destroy();
```

> **提示**：Phone 组件会自动渲染手机界面，包含实时时钟和 9 个应用图标。无需额外配置。

---

### 5.14 Select 下拉选择

需要 JS 初始化，支持自动初始化。

#### 基本用法

```html
<div class="ai-select" data-ai="select" data-placeholder="请选择水果">
  <button class="ai-select__trigger">
    <span class="ai-select__placeholder">请选择水果</span>
    <span class="ai-select__value" style="display:none"></span>
    <span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </button>
  <div class="ai-select__dropdown">
    <div class="ai-select__option" data-key="apple">
      <span class="ai-select__option-dot"></span>
      <span class="ai-select__option-label">苹果</span>
      <span class="ai-select__pill" style="display:none"></span>
    </div>
    <div class="ai-select__option" data-key="banana">
      <span class="ai-select__option-dot"></span>
      <span class="ai-select__option-label">香蕉</span>
      <span class="ai-select__pill" style="display:none"></span>
    </div>
    <div class="ai-select__option" data-key="orange">
      <span class="ai-select__option-dot"></span>
      <span class="ai-select__option-label">橙子</span>
      <span class="ai-select__pill" style="display:none"></span>
    </div>
  </div>
</div>
```

#### 预设选中值

通过 `data-value` 属性设置默认选中项：

```html
<div class="ai-select" data-ai="select" data-placeholder="请选择" data-value="apple">
  ...
</div>
```

#### 禁用状态

```html
<div class="ai-select ai-select--disabled">
  <button class="ai-select__trigger">
    <span class="ai-select__placeholder" style="display:none">请选择</span>
    <span class="ai-select__value">玫瑰</span>
    <span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </button>
</div>
```

#### JS API — 监听选择

```javascript
var select = new AnimalIsland.Select(document.querySelector('.ai-select'), {
  onChange: function (key) {
    console.log('选中了:', key);
  }
});
```

#### 事件监听

```javascript
document.querySelector('.ai-select').addEventListener('ai-select-change', function (e) {
  console.log('选中:', e.detail.key, '标签:', e.detail.label);
});
```

> **提示**：Select 的下拉菜单会自动检测视口空间，在空间不足时向上或向左弹出。

---

### 5.15 Switch 开关

需要 JS 初始化，支持自动初始化。

#### 基本用法

```html
<button class="ai-switch" role="switch" aria-checked="false">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner"></span>
</button>
```

#### 带文字

通过 `data-checked-text` 和 `data-unchecked-text` 属性设置：

```html
<button class="ai-switch" role="switch" aria-checked="false"
  data-checked-text="开" data-unchecked-text="关">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner">关</span>
</button>
```

#### 尺寸

```html
<!-- 小号 -->
<button class="ai-switch ai-switch--sm" role="switch" aria-checked="false">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner"></span>
</button>

<!-- 默认 -->
<button class="ai-switch" role="switch" aria-checked="false">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner"></span>
</button>
```

#### 默认选中

```html
<button class="ai-switch ai-switch--checked" role="switch" aria-checked="true">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner"></span>
</button>
```

#### 加载中

```html
<button class="ai-switch ai-switch--loading ai-switch--checked" role="switch" aria-checked="true">
  <span class="ai-switch__handle">
    <span class="ai-switch__spinner"></span>
  </span>
  <span class="ai-switch__inner"></span>
</button>
```

#### 禁用

```html
<button class="ai-switch ai-switch--disabled" role="switch" aria-checked="false">
  <span class="ai-switch__handle"></span>
  <span class="ai-switch__inner"></span>
</button>
```

#### JS API

```javascript
var switchEl = new AnimalIsland.Switch(document.querySelector('.ai-switch'), {
  loading: true,                        // 加载状态（自动添加 spinner）
  checkedChildren: '开',                // 选中时文字（也可用 data-checked-text）
  unCheckedChildren: '关',              // 未选中时文字（也可用 data-unchecked-text）
  onChange: function (checked) {
    console.log('开关状态:', checked);
  }
});
```

#### 事件监听

```javascript
document.querySelector('.ai-switch').addEventListener('ai-switch-change', function (e) {
  console.log('开关状态:', e.detail.checked);
});
```

---

### 5.16 Table 表格

需要 JS 初始化，支持自动初始化和动态渲染。

#### 静态 HTML 表格

```html
<table class="ai-table">
  <thead class="ai-table__thead">
    <tr class="ai-table__header-row">
      <th class="ai-table__header-cell">姓名</th>
      <th class="ai-table__header-cell">年龄</th>
      <th class="ai-table__header-cell">职业</th>
    </tr>
  </thead>
  <tbody class="ai-table__tbody">
    <tr class="ai-table__row">
      <td class="ai-table__cell">Tom</td>
      <td class="ai-table__cell">28</td>
      <td class="ai-table__cell">渔夫</td>
    </tr>
    <tr class="ai-table__row ai-table__row--striped">
      <td class="ai-table__cell">Alice</td>
      <td class="ai-table__cell">25</td>
      <td class="ai-table__cell">花匠</td>
    </tr>
  </tbody>
</table>
```

#### 动态渲染（通过 data 属性）

```html
<div data-ai="table"
     data-columns='[{"title":"姓名","dataIndex":"name"},{"title":"年龄","dataIndex":"age"}]'
     data-source='[{"name":"Tom","age":28},{"name":"Alice","age":25}]'>
</div>
```

#### 动态渲染（通过 JS API）

```javascript
var table = new AnimalIsland.Table(document.getElementById('my-table'), {
  columns: [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age', align: 'center', width: 80 },
    {
      title: '操作',
      dataIndex: 'action',
      render: function (val, record, index) {
        return '<button class="ai-btn ai-btn--sm ai-btn--primary">编辑</button>';
      }
    }
  ],
  dataSource: [
    { name: 'Tom', age: 28 },
    { name: 'Alice', age: 25 }
  ],
  striped: true,
  showHeader: true,
  emptyText: '暂无数据',
  rowKey: 'name',
  rowClassName: function (record, index) {
    return index === 0 ? 'highlight-row' : '';
  },
  onRow: function (record, index) {
    return {
      onClick: function () { console.log('点击行:', record); },
      style: { cursor: 'pointer' }
    };
  },
  scroll: { y: 300, x: 800 }
});
```

#### 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | array | `[]` | 列定义 |
| `dataSource` | array | `[]` | 数据源 |
| `striped` | boolean | `true` | 斑马纹 |
| `showHeader` | boolean | `true` | 是否显示表头 |
| `emptyText` | string | `'暂无数据'` | 空数据提示文字 |
| `loading` | boolean | `false` | 加载状态 |
| `rowKey` | string/function | `'key'` | 行唯一标识字段名或函数 |
| `rowClassName` | string/function | `null` | 自定义行类名 |
| `onRow` | function | `null` | 行事件配置 `(record, index) => { onClick, style, className }` |
| `scroll` | object | `null` | 滚动配置 `{ x: number, y: number }` |

#### Column 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | string | 列标题 |
| `dataIndex` | string | 数据字段名 |
| `align` | string | 对齐方式：`'left'`/`'center'`/`'right'` |
| `width` | number | 列宽度 |
| `render` | function | 自定义渲染 `(value, record, index) => string` |
| `style` | object | 自定义单元格样式 `{ fontWeight: '700' }` |

#### 实例方法

```javascript
// 更新数据
table.setData([
  { name: 'Bob', age: 30 },
  { name: 'Carol', age: 22 }
]);

// 显示/隐藏加载状态
table.setLoading(true);
table.setLoading(false);
```

---

### 5.17 Tabs 选项卡

需要 JS 初始化，支持自动初始化。

```html
<div data-ai="tabs" class="ai-tabs">
  <div class="ai-tabs__list">
    <button class="ai-tabs__item ai-tabs__item--active" data-key="tab1">
      <span class="ai-tabs__icon">●</span>
      <span class="ai-tabs__label">Island</span>
    </button>
    <button class="ai-tabs__item" data-key="tab2">
      <span class="ai-tabs__icon">○</span>
      <span class="ai-tabs__label">Museum</span>
    </button>
    <button class="ai-tabs__item" data-key="tab3">
      <span class="ai-tabs__icon">○</span>
      <span class="ai-tabs__label">Shop</span>
    </button>
  </div>
  <div class="ai-tabs__content">
    <div class="ai-tabs__panel" data-key="tab1" style="display:block">
      岛屿内容
    </div>
    <div class="ai-tabs__panel" data-key="tab2" style="display:none">
      博物馆内容
    </div>
    <div class="ai-tabs__panel" data-key="tab3" style="display:none">
      商店内容
    </div>
  </div>
</div>
```

#### JS API

```javascript
var tabs = new AnimalIsland.Tabs(document.querySelector('.ai-tabs'), {
  shadow: true,           // 激活项底部阴影
  leafAnimation: true,    // 叶子装饰动画
  onChange: function (key) {
    console.log('切换到:', key);
  }
});
```

#### 事件监听

```javascript
document.querySelector('.ai-tabs').addEventListener('ai-tabs-change', function (e) {
  console.log('切换到:', e.detail.key);
});
```

> **提示**：激活的 tab 显示 `●`，非激活显示 `○`，切换时 JS 会自动更新。

---

### 5.18 Time 实时时钟

需要 JS 初始化，支持自动初始化。

```html
<div data-ai="time" class="ai-time"></div>
```

#### JS API

```javascript
var time = new AnimalIsland.Time(document.getElementById('my-time'));

// 销毁（清除定时器）
time.destroy();
```

---

### 5.19 Typewriter 打字机

需要 JS 手动调用，不支持自动初始化。

#### 基本用法

```html
<span id="my-typewriter"></span>

<script>
  // 第三个参数可以是速度（毫秒/字）或配置对象
  var tw = new AnimalIsland.Typewriter(
    document.getElementById('my-typewriter'),
    '欢迎来到动物岛！',
    80  // 速度：毫秒/字
  );
</script>
```

#### 支持 HTML

```javascript
var tw = new AnimalIsland.Typewriter(
  document.getElementById('my-typewriter'),
  '<div>第一行：钓到石头了！</div><div style="color:#FD9303;font-weight:700">第二行：继续加油！</div>',
  { speed: 80, autoPlay: true, onDone: function () { console.log('打字完成'); } }
);
```

#### 配置项

第三个参数支持两种形式：

**数字形式**（简写速度）：
```javascript
new AnimalIsland.Typewriter(el, '文本', 80);
```

**对象形式**（完整配置）：
```javascript
new AnimalIsland.Typewriter(el, '文本', {
  speed: 80,        // 打字速度（毫秒/字），默认 80
  autoPlay: true,   // 是否自动开始，默认 true
  onDone: null      // 打字完成回调
});
```

#### 实例方法

```javascript
// 重新开始打字
tw.restart();

// 销毁（清除定时器）
tw.destroy();
```

---

## 6. 自动初始化

页面加载后，`animal-island.js` 会自动扫描并初始化以下元素：

| 选择器 | 初始化为 | 说明 |
|--------|----------|------|
| `[data-ai="time"]` | `AI.Time` | 实时时钟 |
| `.ai-input-wrapper .ai-input` | `AI.Input` | 输入框 |
| `[data-ai="checkbox"]` | `AI.Checkbox` | 复选框组 |
| `.ai-switch` | `AI.Switch` | 开关 |
| `[data-ai="select"]` | `AI.Select` | 下拉选择 |
| `[data-ai="tabs"]` | `AI.Tabs` | 选项卡 |
| `.ai-collapse` | `AI.Collapse` | 折叠面板 |
| `[data-ai="phone"]` | `AI.Phone` | 手机 |
| `.ai-code-block` | `AI.CodeBlock` | 代码块高亮 |
| `[data-ai="loading"]` | `AI.Loading` | 加载动画 |
| `[data-ai="table"]` | `AI.Table` | 表格（需配合 `data-columns` 和 `data-source`） |

> **注意**：Modal、Typewriter 和 Cursor 不支持自动初始化。Modal 和 Typewriter 必须手动调用 JS API，Cursor 是纯 CSS 组件。

### 手动触发初始化

如果你在页面加载后动态插入了 HTML，可以手动调用：

```javascript
AnimalIsland.autoInit();
```

这会重新扫描所有需要初始化的元素。注意：已初始化的元素可能会被重复初始化，请自行处理。

---

## 7. JavaScript API 总览

所有组件通过 `AnimalIsland` 全局对象访问：

### 构造函数

```javascript
new AnimalIsland.Time(el)
new AnimalIsland.Input(el, options)
new AnimalIsland.Checkbox(el, options)
new AnimalIsland.Switch(el, options)
new AnimalIsland.Select(el, options)
new AnimalIsland.Tabs(el, options)
new AnimalIsland.Collapse(el, options)
new AnimalIsland.Table(el, options)
new AnimalIsland.Modal(options)           // 注意：不传 el
new AnimalIsland.Typewriter(el, text, speedOrOptions)
new AnimalIsland.Loading(el, options)
new AnimalIsland.Phone(el)
new AnimalIsland.CodeBlock(el)
```

### 实例方法

```javascript
// Modal
modal.open()                            // 打开弹窗
modal.close()                           // 关闭弹窗

// Loading
loading.setActive(true/false)           // 显示/隐藏加载动画

// Table
table.setData(newDataSource)            // 更新表格数据
table.setLoading(true/false)            // 显示/隐藏表格加载状态

// Typewriter
typewriter.restart()                    // 重新开始打字
typewriter.destroy()                    // 销毁打字机

// Time
time.destroy()                          // 销毁时钟（清除定时器）

// Phone
phone.destroy()                         // 销毁手机（清除定时器）

// Checkbox
checkbox.getValues()                    // 获取当前选中值数组
```

### 静态方法

```javascript
AnimalIsland.CodeBlock.highlight(code)  // 高亮代码字符串，返回 HTML
AnimalIsland.autoInit()                 // 手动触发自动初始化
```

### 参数说明

- `el`：可以是 DOM 元素或 CSS 选择器字符串
- `options`：配置对象，各组件配置项详见上方各组件章节
- `speedOrOptions`：Typewriter 的第三个参数，可以是数字（速度）或配置对象

---

## 8. 自定义主题

### 方式一：覆盖 CSS 变量（推荐）

在你的样式表中重新定义变量：

```css
:root {
  --ai-primary: #ff6b6b;        /* 改为主色为红色 */
  --ai-bg: #1a1a2e;             /* 改为深色背景 */
  --ai-text: #eaeaea;           /* 改为浅色文字 */
  --ai-radius-base: 12px;       /* 改为更小的圆角 */
}
```

### 方式二：局部覆盖

只修改某个组件的样式：

```css
/* 让所有按钮更圆 */
.ai-btn {
  border-radius: 50px;
}

/* 让卡片有更大的内边距 */
.ai-card {
  padding: 32px;
}
```

### 方式三：修改源文件

直接编辑 `animal-island.css` 顶部的 `:root` 变量定义。

---

## 9. 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 85+ |
| Edge | 85+ |
| Firefox | 128+ |
| Safari | 15.4+ |

主要依赖的现代特性：
- CSS Custom Properties（CSS 变量）
- CSS `@property` 规则（Loading 关闭动画）
- CSS Grid（Collapse 高度过渡、Table 布局）
- `clip-path`（Modal 异形裁切）
- ES5+ JavaScript

> **提示**：如果你不需要 Loading 的关闭动画（radial mask），可以忽略 `@property` 的兼容性要求，其余组件在更旧的浏览器中也能正常工作。

---

## 常见问题

### Q: 需要安装 Node.js 吗？
**不需要**。直接下载文件，用 `<link>` 和 `<script>` 引入即可。

### Q: 可以只使用部分组件吗？
CSS 文件包含所有组件样式，不支持按需加载。但 JS 组件是独立的，你只初始化需要的组件即可。如果你非常在意文件大小，可以手动从 CSS 文件中删除不需要的组件样式。

### Q: Loading 动画不显示？
Loading 组件使用 `requestAnimationFrame` 实现，无需外部依赖。请确保 `assets/img/` 目录完整，且 CSS 中引用的图片路径正确。

### Q: 图片资源加载失败？
确保 `assets/` 目录与 `css/` 目录的相对路径正确。CSS 中引用图片使用的是相对路径 `../assets/img/...`，如果你的目录结构不同，需要修改 CSS 中的路径。

### Q: 如何在 Vue/React 项目中使用？
直接引入 CSS 和 JS 文件即可。但请注意，这些框架的虚拟 DOM 可能与直接 DOM 操作冲突。对于需要 JS 交互的组件（如 Modal、Table），建议在组件挂载后手动初始化，在卸载时调用 `destroy()` 方法。

### Q: 支持暗色模式吗？
目前没有内置暗色模式。你可以通过覆盖 CSS 变量自行实现：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ai-bg: #1a1a2e;
    --ai-text: #eaeaea;
    /* ... 更多变量 */
  }
}
```
