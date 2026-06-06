(function () {
  'use strict';
  var AI = AnimalIsland;

  /* ==============================
     Menu config
     ============================== */
  var MENU = [
    {
      category: '── 基础组件 ──',
      items: [
        { key: 'button', label: 'Button 按钮' },
        { key: 'input', label: 'Input 输入框' },
        { key: 'switch', label: 'Switch 开关' },
        { key: 'card', label: 'Card 卡片' },
        { key: 'collapse', label: 'Collapse 折叠面板' },
        { key: 'cursor', label: 'Cursor 光标' },
        { key: 'modal', label: 'Modal 弹窗' },
        { key: 'typewriter', label: 'Typewriter 打字机' },
        { key: 'divider', label: 'Divider 分割线' },
        { key: 'icon', label: 'Icon 图标' },
        { key: 'select', label: 'Select 选择器' },
        { key: 'checkbox', label: 'Checkbox 多选框' },
        { key: 'tabs', label: 'Tabs 标签页' },
        { key: 'footer', label: 'Footer 页脚' },
        { key: 'codeblock', label: 'CodeBlock 代码高亮' },
        { key: 'loading', label: 'Loading 加载' },
        { key: 'table', label: 'Table 表格' }
      ]
    },
    {
      category: '── 复杂组件 ──',
      items: [
        { key: 'time', label: 'Time 时间' },
        { key: 'phone', label: 'Phone 手机' }
      ]
    }
  ];

  var PAGE_INFO = {
    button: { title: 'Button 按钮', desc: '按钮组件 — 支持 primary / dashed / text / link 等类型，danger / ghost / loading / disabled 状态，icon 图标，block 块级，三种尺寸' },
    input: { title: 'Input 输入框', desc: '输入框组件 — 支持三种尺寸、clearable 清除、prefix / suffix 前后缀、error / warning 校验状态、disabled 禁用' },
    switch: { title: 'Switch 开关', desc: '开关组件 — 支持受控 / 非受控、自定义文案、small 尺寸、loading 状态' },
    card: { title: 'Card 卡片', desc: '卡片容器组件 — 支持 default / title 两种类型，12 种背景颜色' },
    collapse: { title: 'Collapse 折叠面板', desc: '折叠面板组件 — 支持展开/收起、默认展开、禁用状态' },
    cursor: { title: 'Cursor 光标', desc: '光标组件 — 自定义手指光标，支持自定义尺寸、点击动画' },
    modal: { title: 'Modal 弹窗', desc: '模态弹窗组件 — SVG 有机形状裁切、支持标题、关闭按钮、自定义 Footer、ESC / 遮罩关闭' },
    typewriter: { title: 'Typewriter 打字机', desc: '打字机组件 — 按字符逐个显示文本，支持多行与富内容，不改变原有样式' },
    divider: { title: 'Divider 分割线', desc: '分割线组件 — 装饰性分割线' },
    icon: { title: 'Icon 图标', desc: '图标组件 — 动森风格图标集，包含 10 个可爱图标，支持自定义尺寸' },
    select: { title: 'Select 选择器', desc: '下拉选择器组件 — 支持自定义选项列表，高亮当前选中项' },
    checkbox: { title: 'Checkbox 多选框', desc: '多选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用' },
    tabs: { title: 'Tabs 标签页', desc: '标签页组件 — 支持受控/非受控模式切换' },
    footer: { title: 'Footer 页脚', desc: '页面底部装饰图片，支持树和海两种类型' },
    codeblock: { title: 'CodeBlock 代码高亮', desc: '代码高亮组件 — 语法高亮显示，支持自定义样式和类名' },
    loading: { title: 'Loading 加载', desc: '动森风格小岛 Loading 动画组件，支持自定义样式和类名' },
    table: { title: 'Table 表格', desc: '数据表格组件，支持斑马纹、边框、加载状态等常用功能' },
    time: { title: 'Time 时间', desc: '经典 HUD 风格的时间显示组件，实时更新时间' },
    phone: { title: 'Phone 手机', desc: '动森风格手机界面，包含对话框和背包功能' }
  };

  /* ==============================
     Helpers
     ============================== */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function apiT(rows) {
    var h = '<div class="api-table-wrap"><span class="api-label">API</span>' +
      '<table class="api-table"><thead><tr>' +
      '<th>属性</th><th>说明</th><th>类型</th><th>默认值</th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr>' +
        '<td><span class="prop-name">' + r[0] + '</span>' + (r[4] ? '<span class="prop-required">*</span>' : '') + '</td>' +
        '<td>' + r[1] + '</td>' +
        '<td class="prop-type">' + r[2] + '</td>' +
        '<td class="prop-default">' + (r[3] || '-') + '</td>' +
        '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  function codeL(c) {
    var highlighted = AI.CodeBlock.highlight(c);
    return '<span class="code-label">使用示例</span>' +
      '<pre class="ai-code-block" style="border-radius:0 20px 20px 20px;margin-top:0">' + highlighted + '</pre>';
  }

  /* ==============================
     Sidebar HTML (shared between desktop & mobile drawer)
     ============================== */
  function sidebarHTML(active) {
    var h = '<div class="sidebar-header" onclick="location.hash=\'/\'">' +
      '<img src="assets/img/demo/nook-phone/nook1.svg" alt=""> 集合啦！Animal</div>' +
      '<nav class="sidebar-menu">';
    MENU.forEach(function (g) {
      h += '<div class="sidebar-category">' + g.category + '</div>';
      g.items.forEach(function (i) {
        h += '<button class="sidebar-item' + (i.key === active ? ' sidebar-item--active' : '') +
          '" onclick="location.hash=\'/' + i.key + '\'">' + i.label + '</button>';
      });
    });
    return h + '</nav>';
  }

  /* ==============================
     Mobile topbar HTML
     ============================== */
  function mobileTopbarHTML(title) {
    return '<div class="mobile-topbar">' +
      '<button class="mobile-topbar-btn" onclick="location.hash=\'/\'">←</button>' +
      '<span class="mobile-topbar-title">' + (title || '组件文档') + '</span>' +
      '<button class="mobile-topbar-btn" id="mobile-drawer-btn">☰</button>' +
    '</div>';
  }

  /* ==============================
     Home page
     ============================== */
  function renderHomePageInner() {
    var feats = [
      { icon: 'nook1.svg', title: 'Animal风格', desc: 'SVG 有机形状裁切，3D 按压按钮，温暖质朴的自然 UI 质感' },
      { icon: 'Property-Shopping.svg', title: '19 个组件', desc: 'Button / Input / Switch / Modal / Typewriter / Card / Collapse / Cursor / Divider / Time / Phone / Footer / Icon / Checkbox / Select / Tabs / CodeBlock / Loading / Table' },
      { icon: 'Property-Camera.svg', title: '主题定制', desc: '40+ CSS 自定义属性，运行时换肤无需重新构建' },
      { icon: 'Property-Recipes.svg', title: '开箱即用', desc: '无需 npm / React / Node.js，直接下载引用即可使用' }
    ];
    var comps = [
      { key: 'button', name: 'Button', desc: '5 种类型、3 种尺寸、加载/危险/幽灵模式' },
      { key: 'input', name: 'Input', desc: '前后缀、一键清空、校验状态' },
      { key: 'switch', name: 'Switch', desc: '受控/非受控、自定义文案、加载状态' },
      { key: 'checkbox', name: 'Checkbox', desc: '多选框组件，支持水平/垂直排列' },
      { key: 'select', name: 'Select', desc: '下拉选择器，支持搜索和禁用' },
      { key: 'tabs', name: 'Tabs', desc: '标签页组件，支持受控/非受控模式' },
      { key: 'modal', name: 'Modal', desc: 'SVG 有机形状弹窗、ESC 关闭' },
      { key: 'typewriter', name: 'Typewriter', desc: '逐字打字机效果，支持多行与富内容' },
      { key: 'card', name: 'Card', desc: '默认/标题两种卡片风格' },
      { key: 'collapse', name: 'Collapse', desc: 'FAQ 折叠面板、平滑展开动画' },
      { key: 'cursor', name: 'Cursor', desc: '自定义手指光标，支持多种尺寸' },
      { key: 'divider', name: 'Divider', desc: '装饰性水平分割线' },
      { key: 'icon', name: 'Icon', desc: 'SVG 图标库' },
      { key: 'footer', name: 'Footer', desc: '页脚组件' },
      { key: 'time', name: 'Time', desc: '可爱风格时间显示' },
      { key: 'phone', name: 'Phone', desc: 'Phone 模拟器' },
      { key: 'codeblock', name: 'CodeBlock', desc: '代码语法高亮组件' },
      { key: 'loading', name: 'Loading', desc: '动森风格小岛加载动画' },
      { key: 'table', name: 'Table', desc: '数据表格组件' }
    ];

    var h = '';

    // Hero
    h += '<div class="home-hero">' +
      '<div class="home-hero-content">' +
        '<div class="home-hero-text">' +
          '<h1 class="home-hero-title">Animal <br>Island UI <span class="home-hero-version">vanilla</span></h1>' +
          '<p class="home-hero-subtitle" id="home-typewriter"></p>' +
          '<div style="display:flex;gap:16px;align-items:center">' +
            '<button class="ai-btn ai-btn--lg ai-btn--primary" onclick="location.hash=\'/button\'">开始使用 →</button>' +
          '</div>' +
        '</div>' +
        '<div class="home-hero-logo"><img src="assets/img/demo/animal_icon.png" alt="" decoding="async"></div>' +
      '</div>' +
      '<div class="home-scroll-hint">' +
        '<span>向下滑动</span>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#FFF9E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div>' +
    '</div>';

    // Features
    h += '<div class="home-section"><div class="home-section-title">特性</div><div class="home-section-desc">为什么选择 animal-island-ui</div><div class="features-grid">';
    feats.forEach(function (f) {
      h += '<div class="ai-card feature-card"><img src="assets/img/demo/nook-phone/' + f.icon + '" alt=""><div class="feature-card-title">' + f.title + '</div><div class="feature-card-desc">' + f.desc + '</div></div>';
    });
    h += '</div></div>';

    h += '<div class="ai-divider" style="max-width:800px;margin:0 auto"></div>';

    // Components
    h += '<div class="home-section"><div class="home-section-title">组件一览</div><div class="home-section-desc">点击卡片查看详细文档和在线演示</div><div class="comp-grid">';
    comps.forEach(function (c) {
      h += '<div class="ai-card comp-card" onclick="location.hash=\'/' + c.key + '\'"><div class="comp-name">' + c.name + '</div><div class="comp-desc">' + c.desc + '</div></div>';
    });
    h += '</div></div>';

    h += '<div class="ai-divider" style="max-width:800px;margin:0 auto"></div>';

    // Install
    h += '<div class="home-section"><div class="home-section-title">安装</div><div class="home-section-desc">下载即用，无需任何构建工具</div>' +
      '<div class="home-code-box">// 1. 下载 vanilla 文件夹\n// 2. 在 HTML 中引入\n&lt;link rel="stylesheet" href="vanilla/css/animal-island.css"&gt;\n&lt;script src="vanilla/js/animal-island.js"&gt;&lt;/script&gt;\n// 3. 开始使用\n&lt;button class="ai-btn ai-btn--primary"&gt;Hello Island&lt;/button&gt;</div></div>';

    h += '<div class="ai-divider" style="max-width:800px;margin:0 auto"></div>';

    // Quick start
    h += '<div class="home-section"><div class="home-section-title">快速上手</div><div class="home-section-desc">引入文件即可使用，样式自动生效</div>' +
      '<div class="home-code-box">&lt;!-- 引入样式 --&gt;\n&lt;link rel="stylesheet" href="vanilla/css/animal-island.css"&gt;\n\n&lt;!-- 使用组件（纯 CSS） --&gt;\n&lt;button class="ai-btn ai-btn--primary"&gt;按钮&lt;/button&gt;\n&lt;div class="ai-card"&gt;卡片&lt;/div&gt;\n\n&lt;!-- 引入脚本（放在 body 末尾） --&gt;\n&lt;script src="vanilla/js/animal-island.js"&gt;&lt;/script&gt;\n\n&lt;!-- 需要 JS 的组件用 data 初始化 --&gt;\n&lt;div data-ai="time"&gt;&lt;/div&gt;\n&lt;div data-ai="phone"&gt;&lt;/div&gt;</div></div>';

    h += '<div class="ai-divider" style="max-width:800px;margin:0 auto"></div>';

    // Theme
    h += '<div class="home-section"><div class="home-section-title">主题定制</div><div class="home-section-desc">通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建</div>' +
      '<div class="home-code-box">/* 覆盖主题变量 */\n:root {\n    --ai-primary: #19c8b9;\n    --ai-text-primary: #3d2e1e;\n    --ai-font-family: "Nunito", sans-serif;\n    --ai-radius-base: 18px;\n    /* ... 40+ 设计令牌 */\n}</div></div>';

    // Footer
    h += '<div class="home-footer"><div class="home-footer-links">' +
      '<span class="home-footer-link" onclick="location.hash=\'/button\'">组件文档</span>' +
      '<span class="home-footer-link" onclick="window.open(\'https://github.com/guokaigdg/animal-island-ui\',\'_blank\')">GitHub</span>' +
      '</div><div>MIT License · Vanilla CSS + JS</div></div>';

    return h;
  }

  /* ==============================
     Component demo renderers
     ============================== */
  var DEMOS = {};

  // -- Button --
  DEMOS.button = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Button <span class="demo-tag">6 types</span></div>' +
      '<div class="demo-label">type 按钮类型</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary">Primary</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default">Default</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed">Dashed</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--text">Text</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--link">Link</button>' +
      '</div>' +
      '<div class="demo-label">danger / ghost / loading / disabled 状态</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--danger">Danger</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--ghost">Ghost</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--loading">Loading</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" disabled>Disabled</button>' +
      '</div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--sm ai-btn--primary">Small</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary">Middle</button>' +
        '<button class="ai-btn ai-btn--lg ai-btn--primary">Large</button>' +
      '</div>' +
      '<div class="demo-label">icon 图标按钮</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary"><span class="ai-btn__icon">🔍</span> 搜索</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default"><span class="ai-btn__icon">⭐</span> 收藏</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed"><span class="ai-btn__icon">＋</span> 新增</button>' +
      '</div>' +
      '<div class="demo-label">block 块级按钮</div>' +
      '<div style="max-width:360px"><button class="ai-btn ai-btn--md ai-btn--primary ai-btn--block">块级按钮</button></div>' +
      '<div class="demo-label">danger 组合</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary ai-btn--danger">Primary Danger</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default ai-btn--danger">Default Danger</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed ai-btn--danger">Dashed Danger</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--text ai-btn--danger">Text Danger</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--link ai-btn--danger">Link Danger</button>' +
      '</div>' +
      codeL('<button class="ai-btn ai-btn--primary">Primary</button>\n<button class="ai-btn ai-btn--dashed">Dashed</button>\n<button class="ai-btn ai-btn--primary ai-btn--danger">Danger</button>\n<button class="ai-btn ai-btn--lg ai-btn--primary">Large</button>') +
      apiT([
        ['type', '按钮类型', "'primary'|'default'|'dashed'|'text'|'link'", "'default'"],
        ['size', '按钮尺寸', "'sm'|'md'|'lg'", "'md'"],
        ['danger', '危险按钮', 'ai-btn--danger', '-'],
        ['ghost', '幽灵按钮', 'ai-btn--ghost', '-'],
        ['block', '块级按钮', 'ai-btn--block', '-'],
        ['loading', '加载状态', 'ai-btn--loading', '-'],
        ['disabled', '禁用状态', 'disabled attribute', '-']
      ]) +
    '</div>';
  };

  // -- Input --
  DEMOS.input = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Input <span class="demo-tag">3 sizes</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div class="demo-col" style="max-width:360px;gap:12px">' +
        '<span class="ai-input-wrapper ai-input-wrapper--md"><input class="ai-input" placeholder="Basic input"></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--md"><input class="ai-input" placeholder="With clear" value="可清除"><button class="ai-input__clear">&times;</button></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--md"><span class="ai-input__prefix">🔍</span><input class="ai-input" placeholder="Prefix & Suffix"><span class="ai-input__suffix">⏎</span></span>' +
      '</div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-col" style="max-width:360px;gap:12px">' +
        '<span class="ai-input-wrapper ai-input-wrapper--sm"><input class="ai-input" placeholder="Small"></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--md"><input class="ai-input" placeholder="Middle (default)"></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--lg"><input class="ai-input" placeholder="Large"></span>' +
      '</div>' +
      '<div class="demo-label">status 校验状态</div>' +
      '<div class="demo-col" style="max-width:360px;gap:12px">' +
        '<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--error"><input class="ai-input" placeholder="Error status"></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--warning"><input class="ai-input" placeholder="Warning status"></span>' +
      '</div>' +
      '<div class="demo-label">shadow 阴影</div>' +
      '<div class="demo-col" style="max-width:360px;gap:12px">' +
        '<span class="ai-input-wrapper ai-input-wrapper--md"><input class="ai-input" placeholder="No shadow (default)"></span>' +
        '<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--shadow"><input class="ai-input" placeholder="With shadow"></span>' +
      '</div>' +
      '<div class="demo-label">disabled 禁用</div>' +
      '<div class="demo-col" style="max-width:360px;gap:12px">' +
        '<span class="ai-input-wrapper ai-input-wrapper--md ai-input-wrapper--disabled"><input class="ai-input" placeholder="Disabled" disabled></span>' +
      '</div>' +
      codeL('<span class="ai-input-wrapper ai-input-wrapper--md">\n  <input class="ai-input" placeholder="Basic">\n</span>\n\n<!-- With clear -->\n<span class="ai-input-wrapper ai-input-wrapper--md">\n  <input class="ai-input" value="可清除">\n  <button class="ai-input__clear">&times;</button>\n</span>') +
      apiT([
        ['size', '输入框尺寸', "'sm'|'md'|'lg'", "'md'"],
        ['prefix', '前缀', '.ai-input__prefix', '-'],
        ['suffix', '后缀', '.ai-input__suffix', '-'],
        ['allowClear', '允许清除', '.ai-input__clear', '-'],
        ['status', '校验状态', "'error'|'warning'", '-'],
        ['shadow', '是否显示阴影', '.ai-input-wrapper--shadow', '-']
      ]) +
    '</div>';
  };

  // -- Switch --
  DEMOS.switch = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Switch <span class="demo-tag">2 sizes</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div class="demo-row">' +
        '<button class="ai-switch" role="switch" aria-checked="false"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button>' +
        '<span style="font-size:13px" id="switch-status">OFF</span>' +
      '</div>' +
      '<div class="demo-label">checkedChildren / unCheckedChildren 自定义文案</div>' +
      '<div class="demo-row">' +
        '<button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-checked-text="开" data-unchecked-text="关"><span class="ai-switch__handle"></span><span class="ai-switch__inner">开</span></button>' +
      '</div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row">' +
        '<button class="ai-switch ai-switch--checked" role="switch" aria-checked="true"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button>' +
        '<button class="ai-switch ai-switch--sm ai-switch--checked" role="switch" aria-checked="true"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button>' +
      '</div>' +
      '<div class="demo-label">disabled / loading 状态</div>' +
      '<div class="demo-row">' +
        '<button class="ai-switch ai-switch--disabled" role="switch" aria-checked="false"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button>' +
        '<button class="ai-switch ai-switch--loading ai-switch--checked" role="switch" aria-checked="true"><span class="ai-switch__handle"><span class="ai-switch__spinner"></span></span><span class="ai-switch__inner"></span></button>' +
      '</div>' +
      codeL('<button class="ai-switch" role="switch" aria-checked="false">\n  <span class="ai-switch__handle"></span>\n  <span class="ai-switch__inner"></span>\n</button>') +
      apiT([
        ['size', '尺寸', "'sm'|default", 'default'],
        ['checked', '是否选中', 'ai-switch--checked', '-'],
        ['disabled', '禁用', 'ai-switch--disabled', '-'],
        ['loading', '加载状态', 'ai-switch--loading', '-'],
        ['checkedChildren', '选中时文案', 'data-checked-text', '-'],
        ['unCheckedChildren', '未选中时文案', 'data-unchecked-text', '-']
      ]) +
    '</div>';
  };

  // -- Card --
  DEMOS.card = function () {
    var colors = ['default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal', 'app-green', 'app-red', 'lime-green', 'brown', 'warm-peach-pink', 'yellow-green'];
    var h = '<div class="demo-section">' +
      '<div class="demo-section-title">Card <span class="demo-tag">3 types</span> <span class="demo-tag">13 colors</span></div>';

    h += '<div class="demo-label">type="default"</div><div class="demo-row">' +
      '<div class="ai-card"><p>基础卡片</p></div>' +
      '<div class="ai-card" style="max-width:560px;width:100%"><p>在Nintendo 3DS《集合啦！动物森友会》中，可以享受无人岛生活。</p></div>' +
    '</div>';

    h += '<div class="demo-label">type="title"</div><div class="demo-row">' +
      '<div class="ai-card ai-card--title"><p>Title标题卡片</p></div>' +
      '<div class="ai-card ai-card--title" style="max-width:360px;width:100%"><p>欢迎来到无人岛！</p></div>' +
    '</div>';

    h += '<div class="demo-label">type="dashed"</div><div class="demo-row">' +
      '<div class="ai-card ai-card--dashed"><p>虚线边框卡片</p></div>' +
      '<div class="ai-card ai-card--dashed" style="max-width:360px;width:100%"><p>拖拽文件到此处上传</p></div>' +
    '</div>';

    h += '<div class="demo-label">颜色变体</div><div class="card-color-grid">';
    colors.forEach(function (c) { h += '<div class="ai-card ai-card--' + c + ' card-color-item">' + c + '</div>'; });
    h += '</div>';

    h += '<div class="demo-label">颜色 + 标题 组合</div><div class="demo-row">' +
      '<div class="ai-card ai-card--title ai-card--app-blue" style="width:240px"><div style="font-weight:700;font-size:15px;margin-bottom:6px">蓝色标题卡片</div><div style="font-size:12px;opacity:.85">type="title" + color="app-blue"</div></div>' +
      '<div class="ai-card ai-card--title ai-card--app-green" style="width:250px"><div style="font-weight:700;font-size:15px;margin-bottom:6px">绿色标题卡片</div><div style="font-size:12px;opacity:.85">type="title" + color="app-green"</div></div>' +
      '<div class="ai-card ai-card--title ai-card--purple" style="width:240px"><div style="font-weight:700;font-size:15px;margin-bottom:6px">紫色标题卡片</div><div style="font-size:12px;opacity:.85">type="title" + color="purple"</div></div>' +
    '</div>';

    h += codeL('<div class="ai-card">基础卡片</div>\n<div class="ai-card ai-card--title">标题卡片</div>\n<div class="ai-card ai-card--dashed">虚线卡片</div>\n<div class="ai-card ai-card--app-blue">蓝色卡片</div>');
    h += apiT([
      ['type', '卡片类型', "'default'|'title'|'dashed'", "'default'"],
      ['color', '背景颜色类型', "'app-pink'|'purple'|...", "'default'"]
    ]);
    return h + '</div>';
  };

  // -- Collapse --
  var leafSvg = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>';

  DEMOS.collapse = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Collapse <span class="demo-tag">FAQ</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div style="max-width:720px">' +
        '<div class="ai-collapse"><button class="ai-collapse__header" aria-expanded="false"><span class="ai-collapse__icon">+</span><span class="ai-collapse__question">1個島嶼可以登錄多少名用戶?</span><span class="ai-collapse__leaf">' + leafSvg + '</span></button><div class="ai-collapse__answer-wrapper"><div class="ai-collapse__answer"><p>1座島嶼最多可以容納8位居民（用戶）。</p></div></div></div>' +
        '<div class="ai-collapse"><button class="ai-collapse__header" aria-expanded="false"><span class="ai-collapse__icon">+</span><span class="ai-collapse__question">可以多少人一起玩?</span><span class="ai-collapse__leaf">' + leafSvg + '</span></button><div class="ai-collapse__answer-wrapper"><div class="ai-collapse__answer"><p>同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。</p></div></div></div>' +
      '</div>' +
      '<div class="demo-label">defaultExpanded 默认展开</div>' +
      '<div style="max-width:720px">' +
        '<div class="ai-collapse ai-collapse--expanded"><button class="ai-collapse__header" aria-expanded="true"><span class="ai-collapse__icon">−</span><span class="ai-collapse__question">这个问题默认展开</span><span class="ai-collapse__leaf">' + leafSvg + '</span></button><div class="ai-collapse__answer-wrapper"><div class="ai-collapse__answer"><p>答案已经展示出来了！可以点击收起。</p></div></div></div>' +
      '</div>' +
      '<div class="demo-label">disabled 禁用状态</div>' +
      '<div style="max-width:720px">' +
        '<div class="ai-collapse ai-collapse--disabled"><button class="ai-collapse__header" aria-expanded="false"><span class="ai-collapse__icon">+</span><span class="ai-collapse__question">这个问题已被禁用（无法展开）</span><span class="ai-collapse__leaf">' + leafSvg + '</span></button><div class="ai-collapse__answer-wrapper"><div class="ai-collapse__answer"><p>这段文字不应该被看到。</p></div></div></div>' +
      '</div>' +
      codeL('<div class="ai-collapse">\n  <button class="ai-collapse__header">\n    <span class="ai-collapse__icon">+</span>\n    <span class="ai-collapse__question">问题</span>\n  </button>\n  <div class="ai-collapse__answer-wrapper">\n    <div class="ai-collapse__answer">答案</div>\n  </div>\n</div>') +
      apiT([
        ['defaultExpanded', '是否默认展开', 'ai-collapse--expanded', '-'],
        ['disabled', '是否禁用', 'ai-collapse--disabled', '-']
      ]) +
    '</div>';
  };

  // -- Cursor --
  DEMOS.cursor = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Cursor <span class="demo-tag">光标</span></div>' +
      '<div class="demo-label">forceAll=true（默认）：全覆盖</div>' +
      '<div class="ai-cursor--force demo-dashed-box" style="padding:24px;text-align:center">鼠标移入此区域将显示自定义光标</div>' +
      '<div class="demo-label">forceAll=false：保留原生光标语义</div>' +
      '<div class="ai-cursor ai-cursor--scoped demo-dashed-box" style="padding:24px;flex-direction:column;align-items:center;gap:12px">' +
        '<div>鼠标移入此区域，交互元素恢复语义光标</div>' +
        '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:center">' +
          '<a href="#" onclick="event.preventDefault()">链接 (pointer)</a>' +
          '<button class="ai-btn ai-btn--sm ai-btn--primary">按钮 (pointer)</button>' +
          '<button class="ai-btn ai-btn--sm ai-btn--default" disabled>禁用 (not-allowed)</button>' +
          '<input type="text" placeholder="输入框 (text)" style="padding:4px 8px;border:1px solid #d4c9b4;border-radius:8px;font-size:13px">' +
          '<span style="user-select:text">可选中文本</span>' +
        '</div>' +
      '</div>' +
      codeL('<div class="ai-cursor--force">\n  <!-- 全覆盖自定义光标 -->\n</div>\n\n<div class="ai-cursor ai-cursor--scoped">\n  <!-- 保留交互元素原生光标 -->\n</div>') +
      apiT([
        ['forceAll', '是否对所有后代元素强制覆盖光标', 'boolean', 'true']
      ]) +
    '</div>';
  };

  // -- Modal --
  DEMOS.modal = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Modal <span class="demo-tag">弹窗</span></div>' +
      '<div class="demo-label">基础弹窗</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="modal-basic">基础 Modal</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="modal-title">带标题 Modal</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed" id="modal-custom-footer">自定义 Footer</button>' +
      '</div>' +
      '<div class="demo-label">关闭打字机效果</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="modal-no-typewriter">关闭打字机效果</button>' +
      '</div>' +
      codeL('var modal = new AnimalIsland.Modal({\n  title: "标题",\n  content: "内容",\n  width: 520,\n  typewriter: true,\n  onOk: function() { /* ... */ },\n  onClose: function() { /* ... */ }\n});\nmodal.open();') +
      apiT([
        ['title', '标题', 'string', "''"],
        ['content', '内容（支持 HTML）', 'string', "''"],
        ['width', '宽度', 'number', '520'],
        ['maskClosable', '点击遮罩关闭', 'boolean', 'true'],
        ['footer', '底部按钮区域，传 null 则不显示', 'undefined|null|string', '默认按钮'],
        ['typewriter', '是否启用打字机效果', 'boolean', 'true'],
        ['typeSpeed', '打字机每字间隔 (ms)', 'number', '80'],
        ['cursor', '是否在弹窗内使用自定义光标', 'boolean', 'true']
      ]) +
    '</div>';
  };

  // -- Typewriter --
  DEMOS.typewriter = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Typewriter <span class="demo-tag">打字机</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div class="demo-dashed-box" style="margin-bottom:20px"><span id="tw-basic"></span></div>' +
      '<div class="demo-label">保留多行与富内容 (速度 40ms)</div>' +
      '<div class="demo-dashed-box" style="flex-direction:column;align-items:flex-start;margin-bottom:20px;gap:8px"><span id="tw-html"></span></div>' +
      '<div class="demo-row"><button class="ai-btn ai-btn--md ai-btn--primary" id="tw-replay">重新播放</button></div>' +
      codeL('new AnimalIsland.Typewriter(\n  document.getElementById("target"),\n  "你好，欢迎来到动物岛！",\n  80  // 速度：毫秒/字\n);') +
      apiT([
        ['text', '需要逐字显示的内容，支持 HTML', 'string', '-', 1],
        ['speed', '每字间隔 (ms)', 'number', '80'],
        ['autoPlay', '是否自动从头开始播放', 'boolean', 'true'],
        ['onDone', '播放完成回调', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Divider --
  DEMOS.divider = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Divider <span class="demo-tag">5 types</span></div>' +
      '<div class="demo-label">line-brown</div><div class="ai-divider"></div>' +
      '<div class="demo-label">line-teal</div><div class="ai-divider ai-divider--teal"></div>' +
      '<div class="demo-label">line-white</div><div style="background:#333;padding:10px"><div class="ai-divider ai-divider--white"></div></div>' +
      '<div class="demo-label">line-yellow</div><div class="ai-divider ai-divider--yellow"></div>' +
      '<div class="demo-label">wave-yellow</div><div class="ai-divider ai-divider--wave-yellow"></div>' +
      codeL('<div class="ai-divider"></div>\n<div class="ai-divider ai-divider--teal"></div>\n<div class="ai-divider ai-divider--wave-yellow"></div>') +
      apiT([
        ['type', '分隔线类型', "'brown'|'teal'|'white'|'yellow'|'wave-yellow'", "'brown'"]
      ]) +
    '</div>';
  };

  // -- Icon --
  DEMOS.icon = function () {
    var icons = [
      ['miles', 'Miles'], ['camera', 'Camera'], ['chat', 'Chat'],
      ['critterpedia', 'Critterpedia'], ['design', 'Design'], ['diy', 'DIY'],
      ['helicopter', 'Helicopter'], ['map', 'Map'], ['shopping', 'Shopping'],
      ['variant', 'Variant']
    ];
    var h = '<div class="demo-section">' +
      '<div class="demo-section-title">Icon <span class="demo-tag">10 icons</span></div>';

    h += '<div class="demo-label">基础用法</div><div class="demo-row">';
    icons.slice(0, 5).forEach(function (ic) { h += '<span class="ai-icon ai-icon--' + ic[0] + '" style="width:32px;height:32px"></span>'; });
    h += '</div>';

    h += '<div class="demo-label">size 尺寸</div><div class="demo-row">' +
      '<span class="ai-icon ai-icon--miles" style="width:16px;height:16px"></span>' +
      '<span class="ai-icon ai-icon--miles" style="width:24px;height:24px"></span>' +
      '<span class="ai-icon ai-icon--miles" style="width:32px;height:32px"></span>' +
      '<span class="ai-icon ai-icon--miles" style="width:48px;height:48px"></span>' +
    '</div>';

    h += '<div class="demo-label">bounce 弹跳动画（鼠标悬停查看效果）</div><div class="demo-row">' +
      '<span class="ai-icon ai-icon--miles ai-icon--bounce" style="width:32px;height:32px"></span>' +
      '<span class="ai-icon ai-icon--camera ai-icon--bounce" style="width:32px;height:32px"></span>' +
      '<span class="ai-icon ai-icon--chat ai-icon--bounce" style="width:32px;height:32px"></span>' +
    '</div>';

    h += '<div class="demo-label">图标列表</div><div class="icon-list">';
    icons.forEach(function (ic) {
      h += '<div class="icon-list-item">' +
        '<span class="ai-icon ai-icon--' + ic[0] + '" style="width:32px;height:32px"></span>' +
        '<span class="icon-list-name">' + ic[1] + '</span>' +
        '<span class="icon-list-key">' + ic[0] + '</span>' +
      '</div>';
    });
    h += '</div>';

    h += codeL('<span class="ai-icon ai-icon--miles" style="width:32px;height:32px"></span>\n<span class="ai-icon ai-icon--camera ai-icon--bounce" style="width:48px;height:48px"></span>');
    h += apiT([
      ['name', '图标名称', 'IconName', '-', 1],
      ['size', '图标尺寸', 'width/height style', '24'],
      ['bounce', '弹跳动画', 'ai-icon--bounce', '-']
    ]);
    return h + '</div>';
  };

  // -- Select --
  DEMOS.select = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Select <span class="demo-tag">基础用法</span></div>' +
      '<div class="demo-label">默认状态</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前选中: <span style="color:#19c8b9;font-weight:600" id="select-value">鲈鱼</span></div>' +
      '<div class="demo-box">' +
        '<div data-ai="select" class="ai-select" data-placeholder="请选择" id="select-fish">' +
          '<div class="ai-select__trigger"><span class="ai-select__placeholder" style="display:none">请选择</span><span class="ai-select__value">鲈鱼</span><span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
          '<div class="ai-select__dropdown" style="display:none">' +
            '<div class="ai-select__option ai-select__option--active" data-key="fish1"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">鲈鱼</span><div class="ai-select__pill" style="display:block"></div></div>' +
            '<div class="ai-select__option" data-key="fish2"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">鲷鱼</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fish3"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">草鱼</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fish4"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">龙睛鱼</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fish5"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">神仙鱼</span><div class="ai-select__pill" style="display:none"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">自定义占位文本</div>' +
      '<div class="demo-dashed-box">' +
        '<div data-ai="select" class="ai-select" data-placeholder="请选择花朵">' +
          '<div class="ai-select__trigger"><span class="ai-select__placeholder">请选择花朵</span><span class="ai-select__value" style="display:none"></span><span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
          '<div class="ai-select__dropdown" style="display:none">' +
            '<div class="ai-select__option" data-key="flower1"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">樱花</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="flower2"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">玫瑰</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="flower3"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">向日葵</span><div class="ai-select__pill" style="display:none"></div></div>' +
          '</div>' +
        '</div>' +
        '<div data-ai="select" class="ai-select" data-placeholder="请选择水果">' +
          '<div class="ai-select__trigger"><span class="ai-select__placeholder">请选择水果</span><span class="ai-select__value" style="display:none"></span><span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
          '<div class="ai-select__dropdown" style="display:none">' +
            '<div class="ai-select__option" data-key="fruit1"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">草莓</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fruit2"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">蓝莓</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fruit3"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">桃子</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fruit4"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">樱桃</span><div class="ai-select__pill" style="display:none"></div></div>' +
            '<div class="ai-select__option" data-key="fruit5"><span class="ai-select__option-dot"></span><span class="ai-select__option-label">猕猴桃</span><div class="ai-select__pill" style="display:none"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">禁用状态</div>' +
      '<div class="demo-box">' +
        '<div class="ai-select ai-select--disabled">' +
          '<div class="ai-select__trigger"><span class="ai-select__placeholder" style="display:none">请选择</span><span class="ai-select__value">玫瑰</span><span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
        '</div>' +
      '</div>' +
      codeL('<div data-ai="select" class="ai-select" data-placeholder="请选择">\n  <div class="ai-select__trigger">\n    <span class="ai-select__placeholder">请选择</span>\n    <span class="ai-select__value" style="display:none"></span>\n    <span class="ai-select__arrow">▼</span>\n  </div>\n  <div class="ai-select__dropdown" style="display:none">\n    <div class="ai-select__option" data-key="opt1">\n      <span class="ai-select__option-label">选项1</span>\n    </div>\n  </div>\n</div>') +
      apiT([
        ['placeholder', '占位文本', 'data-placeholder', '请选择'],
        ['disabled', '禁用状态', 'ai-select--disabled', 'false'],
        ['onChange', '选中回调', 'event: ai-select-change', '-']
      ]) +
    '</div>';
  };

  // -- Checkbox --
  DEMOS.checkbox = function () {
    var ck = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Checkbox <span class="demo-tag">3 sizes</span></div>' +
      '<div class="demo-label">水平排列</div>' +
      '<div data-ai="checkbox" class="ai-checkbox-group">' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="apple"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">Apple</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="orange"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Orange</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="peach"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Peach</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--disabled" data-value="cherry"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Cherry (Disabled)</span></label>' +
      '</div>' +
      '<div class="demo-label">垂直排列</div>' +
      '<div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--vertical">' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="spring"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">Spring</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="summer"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Summer</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="autumn"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Autumn</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="winter"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">Winter</span></label>' +
      '</div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div data-ai="checkbox" class="ai-checkbox-group">' +
        '<label class="ai-checkbox-item ai-checkbox-item--sm ai-checkbox-item--checked" data-value="small"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">Small</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="middle"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">Middle</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--lg ai-checkbox-item--checked" data-value="large"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">Large</span></label>' +
      '</div>' +
      '<div class="demo-label">全部禁用</div>' +
      '<div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--disabled">' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="beach"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">🌊 海滩</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md" data-value="forest"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:none">' + ck + '</span></span><span class="ai-checkbox-label">🌳 森林</span></label>' +
        '<label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="garden"><span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:flex">' + ck + '</span></span><span class="ai-checkbox-label">🌸 花园</span></label>' +
      '</div>' +
      codeL('<div data-ai="checkbox" class="ai-checkbox-group">\n  <label class="ai-checkbox-item ai-checkbox-item--md" data-value="apple">\n    <span class="ai-checkbox-box">\n      <span class="ai-checkbox-checkmark">...</span>\n    </span>\n    <span class="ai-checkbox-label">Apple</span>\n  </label>\n</div>') +
      apiT([
        ['size', '尺寸', "'sm'|'md'|'lg'", "'md'"],
        ['direction', '排列方向', "'horizontal'|'vertical'", "'horizontal'"],
        ['disabled', '禁用', 'ai-checkbox-item--disabled', '-'],
        ['checked', '选中', 'ai-checkbox-item--checked', '-']
      ]) +
    '</div>';
  };

  // -- Tabs --
  DEMOS.tabs = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Tabs <span class="demo-tag">标签页</span></div>' +
      '<div class="demo-label">shadow 阴影控制</div>' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap">' +
        '<div class="demo-box">' +
          '<div data-ai="tabs" class="ai-tabs">' +
            '<div class="ai-tabs__list">' +
              '<button class="ai-tabs__item ai-tabs__item--active ai-tabs__item--active-shadow" data-key="a"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">鱼类</span></button>' +
              '<button class="ai-tabs__item" data-key="b"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">昆虫</span></button>' +
            '</div>' +
            '<div class="ai-tabs__content"><div class="ai-tabs__panel" data-key="a" style="display:block">鲈鱼、鲷鱼...</div><div class="ai-tabs__panel" data-key="b" style="display:none">蝴蝶、瓢虫...</div></div>' +
          '</div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:8px">shadow=true (默认)</div>' +
        '</div>' +
        '<div class="demo-box">' +
          '<div data-ai="tabs" class="ai-tabs">' +
            '<div class="ai-tabs__list">' +
              '<button class="ai-tabs__item ai-tabs__item--active" data-key="a"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">鱼类</span></button>' +
              '<button class="ai-tabs__item" data-key="b"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">昆虫</span></button>' +
            '</div>' +
            '<div class="ai-tabs__content"><div class="ai-tabs__panel" data-key="a" style="display:block">鲈鱼、鲷鱼...</div><div class="ai-tabs__panel" data-key="b" style="display:none">蝴蝶、瓢虫...</div></div>' +
          '</div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:8px">shadow=false</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">非受控模式</div>' +
      '<div class="demo-box">' +
        '<div data-ai="tabs" class="ai-tabs">' +
          '<div class="ai-tabs__list">' +
            '<button class="ai-tabs__item ai-tabs__item--active ai-tabs__item--active-shadow" data-key="a"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">鱼类</span></button>' +
            '<button class="ai-tabs__item" data-key="b"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">昆虫</span></button>' +
            '<button class="ai-tabs__item" data-key="c"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">海洋生物</span></button>' +
          '</div>' +
          '<div class="ai-tabs__content">' +
            '<div class="ai-tabs__panel" data-key="a" style="display:block">鲈鱼、鲷鱼、河童...</div>' +
            '<div class="ai-tabs__panel" data-key="b" style="display:none">蝴蝶、瓢虫、蜻蜓...</div>' +
            '<div class="ai-tabs__panel" data-key="c" style="display:none">海星、珊瑚、小丑鱼...</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">受控模式</div>' +
      '<div class="demo-box">' +
        '<div data-ai="tabs" class="ai-tabs" id="tabs-controlled">' +
          '<div class="ai-tabs__list">' +
            '<button class="ai-tabs__item ai-tabs__item--active ai-tabs__item--active-shadow" data-key="tab1"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">岛屿概况</span></button>' +
            '<button class="ai-tabs__item" data-key="tab2"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">商店</span></button>' +
            '<button class="ai-tabs__item" data-key="tab3"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">服务台</span></button>' +
          '</div>' +
          '<div class="ai-tabs__content">' +
            '<div class="ai-tabs__panel" data-key="tab1" style="display:block"><p style="margin-bottom:12px">这里是一座无人岛，环境优美，气候宜人。</p><p>可以钓鱼、捉虫、种植各种植物。</p></div>' +
            '<div class="ai-tabs__panel" data-key="tab2" style="display:none"><p style="margin-bottom:12px">狸然超市营业中！</p><p>各种商品应有尽有，价格实惠。</p></div>' +
            '<div class="ai-tabs__panel" data-key="tab3" style="display:none"><p style="margin-bottom:12px">欢迎来到服务台！</p><p>可以办理各种服务业务。</p></div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:16px;font-size:13px;color:#a08060">当前选中: <span id="tabs-controlled-label" style="color:#19c8b9;font-weight:600">岛屿概况</span></div>' +
      '</div>' +
      '<div class="demo-label">leafAnimation 叶子动画控制</div>' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap">' +
        '<div class="demo-box">' +
          '<div data-ai="tabs" class="ai-tabs">' +
            '<div class="ai-tabs__list">' +
              '<button class="ai-tabs__item ai-tabs__item--active ai-tabs__item--active-leaf ai-tabs__item--active-shadow" data-key="a"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">鱼类</span></button>' +
              '<button class="ai-tabs__item" data-key="b"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">昆虫</span></button>' +
            '</div>' +
            '<div class="ai-tabs__content"><div class="ai-tabs__panel" data-key="a" style="display:block">鲈鱼、鲷鱼...</div><div class="ai-tabs__panel" data-key="b" style="display:none">蝴蝶、瓢虫...</div></div>' +
          '</div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:8px">leafAnimation=true (默认)</div>' +
        '</div>' +
        '<div class="demo-box">' +
          '<div data-ai="tabs" class="ai-tabs">' +
            '<div class="ai-tabs__list">' +
              '<button class="ai-tabs__item ai-tabs__item--active ai-tabs__item--active-shadow" data-key="a"><span class="ai-tabs__icon">●</span><span class="ai-tabs__label">鱼类</span></button>' +
              '<button class="ai-tabs__item" data-key="b"><span class="ai-tabs__icon">○</span><span class="ai-tabs__label">昆虫</span></button>' +
            '</div>' +
            '<div class="ai-tabs__content"><div class="ai-tabs__panel" data-key="a" style="display:block">鲈鱼、鲷鱼...</div><div class="ai-tabs__panel" data-key="b" style="display:none">蝴蝶、瓢虫...</div></div>' +
          '</div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:8px">leafAnimation=false</div>' +
        '</div>' +
      '</div>' +
      codeL('<div data-ai="tabs" class="ai-tabs">\n  <div class="ai-tabs__list">\n    <button class="ai-tabs__item ai-tabs__item--active"\n      data-key="tab1">\n      <span class="ai-tabs__icon">●</span>\n      <span class="ai-tabs__label">Tab 1</span>\n    </button>\n  </div>\n  <div class="ai-tabs__content">\n    <div class="ai-tabs__panel" data-key="tab1">\n      Content 1\n    </div>\n  </div>\n</div>') +
      apiT([
        ['activeKey', '当前激活的标签', 'data-key on active item', '-'],
        ['shadow', '选中项阴影效果', 'ai-tabs__item--active-shadow', 'true'],
        ['leafAnimation', '叶子装饰动画', 'ai-tabs__item--active-leaf', 'true'],
        ['onChange', '切换回调', 'event: ai-tabs-change', '-']
      ]) +
    '</div>';
  };

  // -- Footer --
  DEMOS.footer = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Footer <span class="demo-tag">底部装饰</span></div>' +
      '<div class="demo-label">tree 类型（默认）</div>' +
      '<div class="demo-box" style="padding:40px 0"><div class="ai-footer"></div></div>' +
      '<div class="demo-label">sea 类型</div>' +
      '<div class="demo-box" style="padding:40px 0"><div class="ai-footer ai-footer--sea"></div></div>' +
      codeL('<div class="ai-footer"></div>\n<div class="ai-footer ai-footer--sea"></div>') +
      apiT([
        ['type', 'Footer类型', "'sea'|'tree'", "'tree'"]
      ]) +
    '</div>';
  };

  // -- CodeBlock --
  DEMOS.codeblock = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">CodeBlock <span class="demo-tag">代码高亮</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div class="demo-box"><pre class="ai-code-block">import { Button, Card } from \'animal-island-ui\';\n\nfunction App() {\n  return (\n    &lt;div&gt;\n      &lt;Button type="primary"&gt;Hello Island&lt;/Button&gt;\n      &lt;Card color="app-blue"&gt;Welcome!&lt;/Card&gt;\n    &lt;/div&gt;\n  );\n}</pre></div>' +
      '<div class="demo-label">自定义样式</div>' +
      '<div class="demo-box"><pre class="ai-code-block" style="border-radius:5px;background-color:#242c46ff">const greeting = "Hello Island!";\nconsole.log(greeting);</pre></div>' +
      codeL('<pre class="ai-code-block">const msg = "Hello";\nconsole.log(msg);</pre>\n\n<!-- 自定义样式 -->\n<pre class="ai-code-block"\n  style="border-radius:5px;background-color:#242c46ff">\n  const x = 42;\n</pre>') +
      apiT([
        ['code', '代码字符串', 'textContent', '-', 1],
        ['style', '自定义样式', 'inline style', '-'],
        ['className', '自定义类名', 'class attribute', '-']
      ]) +
    '</div>';
  };

  // -- Loading --
  DEMOS.loading = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Loading <span class="demo-tag">加载动画</span></div>' +
      '<div class="demo-label">动森风格小岛 Loading 动画组件，带有漂浮的小岛、摇曳的树叶和游动的鱼。关闭时会从中间圆形透明扩散，露出底层内容。</div>' +
      '<div style="margin-bottom:16px"><button class="ai-btn ai-btn--primary" id="loading-toggle">关闭 Loading</button></div>' +
      '<div class="loading-demo-container" id="loading-demo">' +
        '<div class="loading-demo-bg">底层内容 · Underlying Content</div>' +
      '</div>' +
      codeL('var loading = new AnimalIsland.Loading(\n  document.getElementById("container"),\n  { active: true }\n);\n\n// 切换状态\nloading.setActive(false);') +
      apiT([
        ['active', '是否显示加载动画', 'boolean', 'true'],
        ['setActive', '设置激活状态', 'function(boolean)', '-']
      ]) +
    '</div>';
  };

  // -- Table --
  DEMOS.table = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Table <span class="demo-tag">表格</span></div>' +
      '<div class="demo-label">数据表格组件，支持斑马纹、边框、加载状态等常用功能。</div>' +
      '<div style="margin-bottom:16px;display:flex;gap:16px;flex-wrap:wrap">' +
        '<button class="ai-btn ai-btn--sm ai-btn--primary" id="table-stripe-btn">斑马纹 ✓</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" id="table-loading-btn">模拟加载</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" id="table-empty-btn">Show Empty</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" id="table-reset-btn">Reset Data</button>' +
      '</div>' +
      '<div id="dynamic-table-wrapper" class="ai-table-wrapper"></div>' +
      codeL('var table = new AnimalIsland.Table(\n  document.getElementById("container"),\n  {\n    columns: [\n      { title: "岛民", dataIndex: "name" },\n      { title: "年龄", dataIndex: "age" }\n    ],\n    dataSource: [\n      { name: "豆狸", age: 26 },\n      { name: "西施惠", age: 28 }\n    ],\n    striped: true\n  }\n);\n\n// 切换加载\ntable.setLoading(true);\n\n// 更新数据\ntable.setData(newData);') +
      apiT([
        ['columns', '表格列配置', 'TableColumn[]', '[]'],
        ['dataSource', '表格数据源', 'T[]', '[]'],
        ['striped', '是否显示斑马纹', 'boolean', 'true'],
        ['showHeader', '是否显示表头', 'boolean', 'true'],
        ['loading', '加载状态', 'boolean', 'false'],
        ['emptyText', '空数据显示文本', 'string', '暂无数据'],
        ['setLoading', '设置加载状态', 'function(boolean)', '-'],
        ['setData', '更新数据源', 'function(T[])', '-']
      ]) +
    '</div>';
  };

  // -- Time --
  DEMOS.time = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Time <span class="demo-tag">时间</span></div>' +
      '<div class="demo-label">Time 组件 — 动森经典 HUD 风格的时间显示组件，实时更新时间，支持星期、日期和时间显示。</div>' +
      '<div class="demo-box"><div data-ai="time"></div></div>' +
      codeL('<div data-ai="time"></div>') +
      apiT([
        ['className', '自定义类名', 'string', '-']
      ]) +
    '</div>';
  };

  // -- Phone --
  DEMOS.phone = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Phone <span class="demo-tag">手机</span></div>' +
      '<div class="demo-label">Phone 组件 — 手机界面组件。</div>' +
      '<div class="phone-demo-wrap"><div data-ai="phone"></div></div>' +
      codeL('<div data-ai="phone"></div>') +
      apiT([
        ['className', '自定义类名', 'string', '-']
      ]) +
    '</div>';
  };

  /* ==============================
     Component page
     ============================== */
  function renderCompPage(key) {
    var info = PAGE_INFO[key] || { title: key, desc: '' };
    var h = '<div class="comp-page-title">' + info.title + '</div>' +
      '<div class="comp-page-desc" id="comp-typewriter"></div>';
    if (DEMOS[key]) h += DEMOS[key]();
    return h;
  }

  /* ==============================
     Router
     ============================== */
  var currentCleanup = null;
  var drawerOpen = false;

  function getHash() {
    return window.location.hash.slice(1) || '/';
  }

  function isMobile() {
    return window.innerWidth < 769;
  }

  function route() {
    var hash = getHash();
    var app = document.getElementById('app');
    drawerOpen = false;

    // Cleanup previous
    if (currentCleanup) { currentCleanup(); currentCleanup = null; }

    if (hash === '/') {
      // Home page — full screen, no sidebar, centered content
      app.innerHTML = '<div class="home-layout"><div class="home-page">' +
        renderHomePageInner() +
      '</div></div>';
      // Init typewriter for home subtitle
      var homeTw = document.getElementById('home-typewriter');
      if (homeTw) {
        new AI.Typewriter(homeTw, 'Animal风格的纯 CSS/JS 组件库，像 Bootstrap 一样使用，无需 React / Node.js，直接下载引用即可', 60);
      }
      // Scroll hint auto-hide
      var homePage = app.querySelector('.home-page');
      var scrollHint = app.querySelector('.home-scroll-hint');
      if (homePage && scrollHint) {
        homePage.addEventListener('scroll', function () {
          if (homePage.scrollTop > 70) {
            scrollHint.style.opacity = '0';
            scrollHint.style.pointerEvents = 'none';
          } else {
            scrollHint.style.opacity = '1';
            scrollHint.style.pointerEvents = 'auto';
          }
        });
      }
    } else {
      var key = hash.slice(1);
      var info = PAGE_INFO[key] || { title: key, desc: '' };

      // Component page — sidebar + content
      var html = '<div class="app-layout">';

      // Desktop sidebar
      html += '<aside class="sidebar">' + sidebarHTML(key) + '</aside>';

      // Mobile topbar
      html += mobileTopbarHTML(info.title);

      // Mobile drawer (hidden by default)
      html += '<div class="mobile-drawer-overlay" id="mobile-drawer-overlay" style="display:none"></div>';
      html += '<div class="mobile-drawer" id="mobile-drawer" style="display:none">' + sidebarHTML(key) + '</div>';

      // Main content
      html += '<main class="main-content">' + renderCompPage(key) + '</main>';

      // Guide line
      html += '<img class="guide-line" src="assets/img/demo/guide-bg-line.webp" alt="">';

      html += '</div>';

      app.innerHTML = html;

      // Init typewriter for comp page desc
      var compTw = document.getElementById('comp-typewriter');
      if (compTw && info.desc) {
        new AI.Typewriter(compTw, info.desc, 30);
      }

      // Init JS components for this page
      currentCleanup = initPage(key);

      // Mobile drawer toggle
      var drawerBtn = document.getElementById('mobile-drawer-btn');
      var drawerOverlay = document.getElementById('mobile-drawer-overlay');
      var drawer = document.getElementById('mobile-drawer');
      if (drawerBtn) {
        drawerBtn.addEventListener('click', function () {
          drawerOpen = true;
          if (drawerOverlay) drawerOverlay.style.display = '';
          if (drawer) drawer.style.display = '';
        });
      }
      if (drawerOverlay) {
        drawerOverlay.addEventListener('click', function () {
          drawerOpen = false;
          if (drawerOverlay) drawerOverlay.style.display = 'none';
          if (drawer) drawer.style.display = 'none';
        });
      }
    }

    // Scroll to top
    var mc = app.querySelector('.main-content') || app.querySelector('.home-page');
    if (mc) mc.scrollTop = 0;
  }

  /* ==============================
     Init JS for component pages
     ============================== */
  function initPage(key) {
    var cleanups = [];

    // Auto-init data-ai components
    AI.autoInit();

    // Modal demos
    if (key === 'modal') {
      var b1 = document.getElementById('modal-basic');
      var b2 = document.getElementById('modal-title');
      var b3 = document.getElementById('modal-custom-footer');
      var b4 = document.getElementById('modal-no-typewriter');
      if (b1) b1.addEventListener('click', function () {
        new AI.Modal({ content: '<div style="text-align:center;width:100%;display:flex;flex-direction:column;align-items:center;gap:8px"><span>钓到<span style="color:#FD9303">石头</span>了!</span><span>竟然连这种都能钓起来...</span></div>', width: 480, typewriter: true, typeSpeed: 60 }).open();
      });
      if (b2) b2.addEventListener('click', function () {
        new AI.Modal({ title: '博物馆捐赠', content: '是否愿意将这条鱼捐赠给博物馆呢？傅达会好好照顾它的！这可是博物馆的新展品哦~', width: 480, typewriter: true, typeSpeed: 60 }).open();
      });
      if (b3) b3.addEventListener('click', function () {
        new AI.Modal({ title: '确认操作', content: '确定要让这位居民搬走吗？这个操作不可撤销。', width: 420, footer: '<button class="ai-modal__footer-btn" onclick="this.closest(\'.ai-modal-mask\').remove();document.body.style.overflow=\'\'">再想想</button><button class="ai-modal__footer-btn ai-modal__footer-btn--primary" style="background:#e05a5a;border-color:#e05a5a" onclick="this.closest(\'.ai-modal-mask\').remove();document.body.style.overflow=\'\'">确认搬家</button>' }).open();
      });
      if (b4) b4.addEventListener('click', function () {
        new AI.Modal({ title: '天气预报', content: '明天天气晴朗，气温 20-28°C，适合外出活动！', width: 420, typewriter: false }).open();
      });
    }

    // Typewriter demos
    if (key === 'typewriter') {
      var tw1, tw2;
      function startTypewriters() {
        var el1 = document.getElementById('tw-basic');
        var el2 = document.getElementById('tw-html');
        if (el1) tw1 = new AI.Typewriter(el1, '你好，欢迎来到动物岛！今天的天气真不错呢～', 80);
        if (el2) tw2 = new AI.Typewriter(el2, '<div>第一行：钓到石头了！</div><div>第二行：竟然连这种都能钓起来...</div><div style="color:#FD9303;font-weight:700">第三行：继续加油吧！</div>', 40);
      }
      startTypewriters();
      var replayBtn = document.getElementById('tw-replay');
      if (replayBtn) replayBtn.addEventListener('click', function () {
        var el1 = document.getElementById('tw-basic');
        var el2 = document.getElementById('tw-html');
        if (el1) el1.textContent = '';
        if (el2) el2.textContent = '';
        startTypewriters();
      });
    }

    // Loading demo
    if (key === 'loading') {
      var loadingEl = document.getElementById('loading-demo');
      var loadingInstance = null;
      if (loadingEl) {
        loadingInstance = new AI.Loading(loadingEl, { active: true });
      }
      var toggleBtn = document.getElementById('loading-toggle');
      if (toggleBtn) toggleBtn.addEventListener('click', function () {
        if (!loadingInstance) return;
        loadingInstance.setActive(!loadingInstance.active);
        toggleBtn.textContent = loadingInstance.active ? '关闭 Loading' : '开启 Loading';
      });
      cleanups.push(function () { if (loadingInstance) loadingInstance.setActive(false); });
    }

    // Table demo
    if (key === 'table') {
      var hobbyStyles = {
        '音乐': { bg: 'rgba(147, 112, 219, 0.15)', color: '#9370db' },
        '运动': { bg: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' },
        '唱歌': { bg: 'rgba(255, 99, 71, 0.15)', color: '#ff6347' },
        '钓鱼': { bg: 'rgba(30, 144, 255, 0.15)', color: '#1e90ff' },
        '画画': { bg: 'rgba(255, 105, 180, 0.15)', color: '#ff69b4' }
      };
      var tableColumns = [
        { title: '岛民', dataIndex: 'name', width: 120 },
        { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
        { title: '岛屿', dataIndex: 'island' },
        { title: '喜欢的水果', dataIndex: 'fruit' },
        { title: '爱好', dataIndex: 'hobby', render: function (val) {
          var s = hobbyStyles[val] || { bg: 'rgba(25, 200, 185, 0.15)', color: '#19c8b9' };
          return '<span style="padding:4px 12px;background:' + s.bg + ';border-radius:20px;color:' + s.color + ';font-weight:600;font-size:12px">' + val + '</span>';
        }}
      ];
      var tableData = [
        { name: '豆狸', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },
        { name: '粒狸', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },
        { name: '西施惠', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },
        { name: '喻哥', age: 30, island: '无人岛', fruit: '梨', hobby: '钓鱼' },
        { name: '小润', age: 22, island: '摸鱼岛', fruit: '桃子', hobby: '画画' }
      ];
      var tableWrapper = document.getElementById('dynamic-table-wrapper');
      var dynamicTable = null;
      if (tableWrapper) {
        dynamicTable = new AI.Table(tableWrapper, { columns: tableColumns, dataSource: tableData, striped: true });
      }
      var stripeBtn = document.getElementById('table-stripe-btn');
      var isStriped = true;
      if (stripeBtn) stripeBtn.addEventListener('click', function () {
        isStriped = !isStriped;
        if (dynamicTable) {
          dynamicTable.setData(tableData);
          // Re-render with new striped setting
          var wrapper = document.getElementById('dynamic-table-wrapper');
          if (wrapper) {
            dynamicTable = new AI.Table(wrapper, { columns: tableColumns, dataSource: tableData, striped: isStriped });
          }
        }
        stripeBtn.textContent = '斑马纹 ' + (isStriped ? '✓' : '✗');
      });
      var loadBtn = document.getElementById('table-loading-btn');
      if (loadBtn) loadBtn.addEventListener('click', function () {
        if (dynamicTable) {
          dynamicTable.setLoading(true);
          setTimeout(function () { dynamicTable.setLoading(false); }, 2000);
        }
      });
      var emptyBtn = document.getElementById('table-empty-btn');
      if (emptyBtn) emptyBtn.addEventListener('click', function () {
        if (dynamicTable) dynamicTable.setData([]);
      });
      var resetBtn = document.getElementById('table-reset-btn');
      if (resetBtn) resetBtn.addEventListener('click', function () {
        if (dynamicTable) dynamicTable.setData(tableData);
      });
    }

    // Select value display
    if (key === 'select') {
      var fishSelect = document.getElementById('select-fish');
      if (fishSelect) {
        fishSelect.addEventListener('ai-select-change', function (e) {
          var valEl = document.getElementById('select-value');
          if (valEl && e.detail) valEl.textContent = e.detail.label || e.detail.key;
        });
      }
    }

    // Switch status display
    if (key === 'switch') {
      var switches = document.querySelectorAll('.demo-section .ai-switch');
      switches.forEach(function (sw) {
        if (sw.classList.contains('ai-switch--disabled') || sw.classList.contains('ai-switch--loading')) return;
        sw.addEventListener('click', function () {
          var statusEl = document.getElementById('switch-status');
          if (statusEl) statusEl.textContent = sw.classList.contains('ai-switch--checked') ? 'OFF' : 'ON';
        });
      });
    }

    // Tabs controlled mode
    if (key === 'tabs') {
      var controlledTabs = document.getElementById('tabs-controlled');
      if (controlledTabs) {
        var labelMap = { tab1: '岛屿概况', tab2: '商店', tab3: '服务台' };
        controlledTabs.addEventListener('ai-tabs-change', function (e) {
          var labelEl = document.getElementById('tabs-controlled-label');
          if (labelEl && e.detail && e.detail.key) {
            labelEl.textContent = labelMap[e.detail.key] || e.detail.key;
          }
        });
      }
    }

    return function () {
      cleanups.forEach(function (fn) { fn(); });
    };
  }

  /* ==============================
     Boot
     ============================== */
  window.addEventListener('hashchange', route);
  route();

})();