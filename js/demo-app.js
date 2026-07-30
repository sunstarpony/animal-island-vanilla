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
        { key: 'table', label: 'Table 表格' },
        { key: 'tag', label: 'Tag 标签' },
        { key: 'title', label: 'Title 标题' },
        { key: 'skeleton', label: 'Skeleton 骨架屏' },
        { key: 'progress', label: 'Progress 进度条' },
        { key: 'radio', label: 'Radio 单选框' }
      ]
    },
    {
      category: '── 复杂组件 ──',
      items: [
        { key: 'time', label: 'Time 时间' },
        { key: 'phone', label: 'Phone 手机' },
        { key: 'wallet', label: 'Wallet 钱包' },
        { key: 'tooltip', label: 'Tooltip 工具提示' },
        { key: 'backtop', label: 'BackTop 返回顶部' },
        { key: 'drawer', label: 'Drawer 抽屉' },
        { key: 'notification', label: 'Notification 通知' },
        { key: 'form', label: 'Form 表单' }
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
    tag: { title: 'Tag 标签', desc: '标签组件 — 4 种变体（solid/outlined/dashed/soft）、12 种配色、可关闭、可点击、禁用、三种尺寸' },
    title: { title: 'Title 标题', desc: '动森风格缎带标题组件 — 三种尺寸、12 种配色、3D 立体缎带效果' },
    skeleton: { title: 'Skeleton 骨架屏', desc: '骨架屏组件 — 支持 text/circle/rect/paragraph 四种变体，shimmer 动画' },
    progress: { title: 'Progress 进度条', desc: '进度条组件 — 三种尺寸、三种信息位置（inside/right/top）、条纹动画、可动态更新' },
    radio: { title: 'Radio 单选框', desc: '单选组件 — 支持受控/非受控、水平/垂直排列、键盘导航（方向键/Home/End）、三种尺寸' },
    time: { title: 'Time 时间', desc: '经典 HUD 风格的时间显示组件，实时更新时间' },
    phone: { title: 'Phone 手机', desc: '动森风格手机界面，包含对话框和背包功能' },
    wallet: { title: 'Wallet 钱包', desc: '动森风格钱包组件 — 三种尺寸、千分位格式化、可动态更新金额' },
    tooltip: { title: 'Tooltip 工具提示', desc: '工具提示组件 — 12 种 placement、hover/focus/click 触发、default/island 两种风格' },
    backtop: { title: 'BackTop 返回顶部', desc: '返回顶部组件 — 滚动可见、平滑动画、可自定义滚动容器和触发高度' },
    drawer: { title: 'Drawer 抽屉', desc: '抽屉组件 — 左/右/上/下四个方向、景深背景、遮罩关闭、ESC 关闭、焦点陷阱' },
    notification: { title: 'Notification 通知', desc: '通知组件 — 命令式 API、四种类型、六个位置、自动关闭、可点击' },
    form: { title: 'Form 表单', desc: '表单组件 — 字段管理、规则校验、提交/重置、初始值、错误提示' }
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
      { icon: 'Property-Shopping.svg', title: '30 个组件', desc: 'Button / Input / Switch / Modal / Typewriter / Card / Collapse / Cursor / Divider / Time / Phone / Footer / Icon / Checkbox / Select / Tabs / CodeBlock / Loading / Table / Tag / Title / Skeleton / Progress / Radio / Wallet / Tooltip / BackTop / Drawer / Notification / Form' },
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
      { key: 'table', name: 'Table', desc: '数据表格组件' },
      { key: 'tag', name: 'Tag', desc: '标签组件，4 种变体、12 种配色' },
      { key: 'title', name: 'Title', desc: '动森缎带标题，3D 立体效果' },
      { key: 'skeleton', name: 'Skeleton', desc: '骨架屏，4 种变体、shimmer 动画' },
      { key: 'progress', name: 'Progress', desc: '进度条，条纹动画、动态更新' },
      { key: 'radio', name: 'Radio', desc: '单选组件，键盘导航' },
      { key: 'wallet', name: 'Wallet', desc: '动森风格钱包' },
      { key: 'tooltip', name: 'Tooltip', desc: '工具提示，12 种位置' },
      { key: 'backtop', name: 'BackTop', desc: '返回顶部，平滑动画' },
      { key: 'drawer', name: 'Drawer', desc: '抽屉，4 方向、景深背景' },
      { key: 'notification', name: 'Notification', desc: '通知，命令式 API' },
      { key: 'form', name: 'Form', desc: '表单，校验、提交' }
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

  // -- Tag --
  DEMOS.tag = function () {
    var colors = ['default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'];
    var variantHTML = '';
    ['solid', 'outlined', 'dashed', 'soft'].forEach(function (v) {
      variantHTML += '<div class="demo-label">variant: ' + v + '</div><div class="demo-row" style="flex-wrap:wrap;gap:8px">';
      colors.forEach(function (c) {
        var cls = 'ai-tag ai-tag--md ai-tag--' + v + (c !== 'default' ? ' ai-tag--' + c : '');
        variantHTML += '<span class="' + cls + '" data-ai="tag"><span class="ai-tag__text">' + (c === 'default' ? 'Default' : c) + '</span></span>';
      });
      variantHTML += '</div>';
    });
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Tag <span class="demo-tag">4 variants × 12 colors</span></div>' +
      variantHTML +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row">' +
        '<span class="ai-tag ai-tag--sm ai-tag--solid ai-tag--app-teal" data-ai="tag"><span class="ai-tag__text">Small</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-teal" data-ai="tag"><span class="ai-tag__text">Medium</span></span>' +
        '<span class="ai-tag ai-tag--lg ai-tag--solid ai-tag--app-teal" data-ai="tag"><span class="ai-tag__text">Large</span></span>' +
      '</div>' +
      '<div class="demo-label">closable 可关闭</div>' +
      '<div class="demo-row">' +
        '<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-pink" data-ai="tag"><span class="ai-tag__text">可关闭</span><button class="ai-tag__close" aria-label="close">×</button></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-blue" data-ai="tag"><span class="ai-tag__text">可关闭</span><button class="ai-tag__close" aria-label="close">×</button></span>' +
      '</div>' +
      '<div class="demo-label">clickable 可点击 + disabled 禁用</div>' +
      '<div class="demo-row">' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-green ai-tag--clickable" data-ai="tag" tabindex="0"><span class="ai-tag__text">点我</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--brown ai-tag--disabled" data-ai="tag"><span class="ai-tag__text">禁用</span></span>' +
      '</div>' +
      codeL('<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-pink" data-ai="tag">\n  <span class="ai-tag__text">标签</span>\n  <button class="ai-tag__close" aria-label="close">×</button>\n</span>') +
      apiT([
        ['ai-tag--{variant}', '变体：solid/outlined/dashed/soft', 'class', 'soft'],
        ['ai-tag--{color}', '配色：default/app-pink/purple/... 12 种', 'class', 'default'],
        ['ai-tag--sm/md/lg', '尺寸', 'class', 'md'],
        ['ai-tag--clickable', '可点击（含键盘支持）', 'class', '-'],
        ['ai-tag--disabled', '禁用', 'class', '-'],
        ['data-ai="tag"', '自动初始化（含关闭按钮）', 'attribute', '-'],
        ['AI.Tag(el, {onClose, onClick})', 'JS API', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Title --
  DEMOS.title = function () {
    var colors = ['default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'];
    var colorHTML = '<div class="demo-row" style="flex-wrap:wrap;gap:16px;align-items:center">';
    colors.forEach(function (c) {
      var cls = 'ai-title ai-title--md' + (c !== 'default' ? ' ai-title--' + c : '');
      colorHTML += '<span class="' + cls + '"><span class="ai-title__ribbon">' +
        '<span class="ai-title__back ai-title__back--left" aria-hidden="true"></span>' +
        '<span class="ai-title__back ai-title__back--right" aria-hidden="true"></span>' +
        '<span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span>' +
        '<span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span>' +
        '<span class="ai-title__front" aria-hidden="true"></span>' +
        '<span class="ai-title__text">' + c + '</span>' +
      '</span></span>';
    });
    colorHTML += '</div>';
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Title <span class="demo-tag">3D Ribbon</span></div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row" style="flex-wrap:wrap;gap:24px;align-items:center">' +
        '<span class="ai-title ai-title--sm"><span class="ai-title__ribbon"><span class="ai-title__back ai-title__back--left" aria-hidden="true"></span><span class="ai-title__back ai-title__back--right" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span><span class="ai-title__front" aria-hidden="true"></span><span class="ai-title__text">Small</span></span></span>' +
        '<span class="ai-title ai-title--md"><span class="ai-title__ribbon"><span class="ai-title__back ai-title__back--left" aria-hidden="true"></span><span class="ai-title__back ai-title__back--right" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span><span class="ai-title__front" aria-hidden="true"></span><span class="ai-title__text">Middle</span></span></span>' +
        '<span class="ai-title ai-title--lg"><span class="ai-title__ribbon"><span class="ai-title__back ai-title__back--left" aria-hidden="true"></span><span class="ai-title__back ai-title__back--right" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span><span class="ai-title__front" aria-hidden="true"></span><span class="ai-title__text">Large</span></span></span>' +
      '</div>' +
      '<div class="demo-label">color 配色 — 12 种</div>' + colorHTML +
      '<div class="demo-label">JS API：动态创建</div>' +
      '<div id="title-js-mount" style="padding:12px 0"></div>' +
      codeL('<span class="ai-title ai-title--lg ai-title--app-teal">\n  <span class="ai-title__ribbon">\n    <span class="ai-title__back ai-title__back--left" aria-hidden="true"></span>\n    <span class="ai-title__back ai-title__back--right" aria-hidden="true"></span>\n    <span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span>\n    <span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span>\n    <span class="ai-title__front" aria-hidden="true"></span>\n    <span class="ai-title__text">动森标题</span>\n  </span>\n</span>\n// 或用 JS 工厂方法\nvar title = new AI.Title({ size: "large", color: "app-teal", text: "动森标题" });\ndocument.body.appendChild(title);') +
      apiT([
        ['ai-title--sm/md/lg', '尺寸', 'class', 'md'],
        ['ai-title--{color}', '配色：default/app-pink/... 12 种', 'class', 'default'],
        ['AI.Title({size, color, text})', 'JS 工厂方法（返回 DOM 元素）', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Skeleton --
  DEMOS.skeleton = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Skeleton <span class="demo-tag">4 variants</span></div>' +
      '<div class="demo-label">text 文本骨架</div>' +
      '<div style="max-width:300px;display:flex;flex-direction:column;gap:8px">' +
        '<div data-ai="skeleton" data-variant="text" data-width="100%"></div>' +
        '<div data-ai="skeleton" data-variant="text" data-width="70%"></div>' +
      '</div>' +
      '<div class="demo-label">circle 圆形骨架</div>' +
      '<div class="demo-row" style="gap:16px;align-items:center">' +
        '<div data-ai="skeleton" data-variant="circle" data-width-value="44" data-height-value="44"></div>' +
        '<div data-ai="skeleton" data-variant="circle" data-width-value="64" data-height-value="64"></div>' +
      '</div>' +
      '<div class="demo-label">rect 矩形骨架</div>' +
      '<div data-ai="skeleton" data-variant="rect" data-width-value="100%" data-height-value="120" style="max-width:360px"></div>' +
      '<div class="demo-label">paragraph 段落骨架</div>' +
      '<div data-ai="skeleton" data-variant="paragraph" data-rows="4" style="max-width:360px"></div>' +
      '<div class="demo-label">active=false 关闭动画</div>' +
      '<div data-ai="skeleton" data-variant="text" data-active="false" data-width="60%" style="max-width:240px"></div>' +
      codeL('<div data-ai="skeleton" data-variant="paragraph" data-rows="4"></div>\n<div data-ai="skeleton" data-variant="circle" data-width-value="44" data-height-value="44"></div>\n<div data-ai="skeleton" data-variant="rect" data-width-value="100%" data-height-value="120"></div>') +
      apiT([
        ['data-variant', '变体：text/circle/rect/paragraph', 'attribute', 'text'],
        ['data-active', '是否启用 shimmer 动画', "'true'|'false'", "'true'"],
        ['data-rows', '行数（paragraph 模式）', 'number', '3'],
        ['data-width', '宽度（text 模式）', 'string', "'100%'"],
        ['data-width-value', '宽度值（circle/rect）', 'string|number', '-'],
        ['data-height-value', '高度值', 'string|number', '-'],
        ['AI.Skeleton(el, {variant, active, rows, width, ...})', 'JS API', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Progress --
  DEMOS.progress = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Progress <span class="demo-tag">动态更新</span></div>' +
      '<div class="demo-label">size 尺寸 + infoPosition="inside"</div>' +
      '<div style="max-width:480px;display:flex;flex-direction:column;gap:16px">' +
        '<div data-ai="progress" data-percent="25" data-size="small"></div>' +
        '<div data-ai="progress" data-percent="55" data-size="middle"></div>' +
        '<div data-ai="progress" data-percent="80" data-size="large"></div>' +
      '</div>' +
      '<div class="demo-label">infoPosition="right" / "top"</div>' +
      '<div style="max-width:480px;display:flex;flex-direction:column;gap:16px">' +
        '<div data-ai="progress" data-percent="42" data-info-position="right"></div>' +
        '<div data-ai="progress" data-percent="68" data-info-position="top"></div>' +
      '</div>' +
      '<div class="demo-label">动态更新（点击按钮 +5%）</div>' +
      '<div style="display:flex;align-items:center;gap:12px;max-width:480px">' +
        '<div id="progress-dynamic" data-ai="progress" data-percent="30" data-size="middle" style="flex:1"></div>' +
        '<button class="ai-btn ai-btn--sm ai-btn--primary" id="progress-add-btn">+5%</button>' +
      '</div>' +
      codeL('<div data-ai="progress" data-percent="60" data-size="middle"></div>\n// JS API\nvar p = new AI.Progress(el, { percent: 60, size: "middle" });\np.setPercent(80);') +
      apiT([
        ['data-percent', '百分比（0-100）', 'number', '0'],
        ['data-size', '尺寸：small/middle/large', 'string', "'middle'"],
        ['data-info-position', '信息位置：inside/right/top', 'string', "'inside'"],
        ['data-show-info', '是否显示信息', "'true'|'false'", "'true'"],
        ['AI.Progress(el, {percent, size, infoPosition, duration, infoFormat})', 'JS API', 'function', '-'],
        ['progress.setPercent(n)', '更新百分比', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Radio --
  DEMOS.radio = function () {
    var fruitOpts = JSON.stringify([
      { label: '苹果', value: 'apple' },
      { label: '橘子', value: 'orange' },
      { label: '樱桃', value: 'cherry' },
      { label: '香蕉', value: 'banana' }
    ]);
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Radio <span class="demo-tag">键盘导航</span></div>' +
      '<div class="demo-label">基础用法 — 水平</div>' +
      '<div data-ai="radio" data-size="middle" data-value="apple" data-options=\'' + fruitOpts + '\'></div>' +
      '<div class="demo-label">垂直布局</div>' +
      '<div data-ai="radio" data-size="middle" data-direction="vertical" data-value="orange" data-options=\'' + fruitOpts + '\'></div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div style="display:flex;flex-direction:column;gap:16px">' +
        '<div data-ai="radio" data-size="small" data-value="apple" data-options=\'' + fruitOpts + '\'></div>' +
        '<div data-ai="radio" data-size="large" data-value="cherry" data-options=\'' + fruitOpts + '\'></div>' +
      '</div>' +
      '<div class="demo-label">disabled 禁用</div>' +
      '<div data-ai="radio" data-size="middle" data-disabled="true" data-value="banana" data-options=\'' + fruitOpts + '\'></div>' +
      '<div class="demo-label">JS API：受控模式</div>' +
      '<div id="radio-js-mount"></div>' +
      '<div style="margin-top:8px">当前值：<span id="radio-js-value" style="color:#19c8b9;font-weight:700">apple</span></div>' +
      codeL('<div data-ai="radio" data-size="middle" data-value="apple"\n  data-options=\'[{"label":"苹果","value":"apple"},{"label":"橘子","value":"orange"}]\'></div>\n// JS API\nvar r = new AI.Radio(el, {\n  size: "middle",\n  options: [{label:"苹果", value:"apple"}, {label:"橘子", value:"orange"}],\n  onChange: function (v) { console.log(v); }\n});\nr.getValue(); r.setValue("orange");') +
      apiT([
        ['data-size', '尺寸：small/middle/large', 'string', "'middle'"],
        ['data-direction', '方向：horizontal/vertical', 'string', "'horizontal'"],
        ['data-value', '受控当前值', 'string', '-'],
        ['data-options', '选项数组（JSON）', 'string(JSON)', '-'],
        ['data-disabled', '禁用全部', "'true'|'false'", "'false'"],
        ['options', '选项数组（JS 模式）', 'Array', '-'],
        ['AI.Radio(el, {size, options, value, onChange, ...})', 'JS API', 'function', '-'],
        ['radio.getValue() / setValue(v)', '取/设值', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Wallet --
  DEMOS.wallet = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Wallet <span class="demo-tag">钱包</span></div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row" style="gap:32px;align-items:flex-end">' +
        '<div data-ai="wallet" data-size="small" data-value="1234"></div>' +
        '<div data-ai="wallet" data-size="medium" data-value="98765"></div>' +
        '<div data-ai="wallet" data-size="large" data-value="1000000"></div>' +
      '</div>' +
      '<div class="demo-label">默认值 / 字符串值</div>' +
      '<div class="demo-row" style="gap:32px;align-items:flex-end">' +
        '<div data-ai="wallet"></div>' +
        '<div data-ai="wallet" data-value="LOTS"></div>' +
      '</div>' +
      '<div class="demo-label">动态更新</div>' +
      '<div style="display:flex;align-items:center;gap:16px">' +
        '<div id="wallet-dynamic" data-ai="wallet" data-size="medium" data-value="500"></div>' +
        '<button class="ai-btn ai-btn--sm ai-btn--primary" id="wallet-add-btn">+1000</button>' +
      '</div>' +
      codeL('<div data-ai="wallet" data-size="medium" data-value="98765"></div>\n// JS API\nvar w = new AI.Wallet(el, { size: "medium", value: 98765 });\nw.setValue(100000);') +
      apiT([
        ['data-size', '尺寸：small/medium/large', 'string', "'medium'"],
        ['data-value', '金额数值（number 自动千分位）', 'number|string', "'00,000'"],
        ['thousandSeparator', '千分位分隔符，传 "" 关闭', 'string', "','" ],
        ['AI.Wallet(el, {size, value, thousandSeparator, iconHTML})', 'JS API', 'function', '-'],
        ['wallet.setValue(v) / getValue()', '更新/取值', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Tooltip --
  DEMOS.tooltip = function () {
    var placements = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
    var placementHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:600px;padding:32px 0">';
    placements.forEach(function (p) {
      placementHTML += '<div style="display:flex;justify-content:center;padding:24px 0">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="位置：' + p + '" data-placement="' + p + '">' +
          '<button class="ai-btn ai-btn--sm ai-btn--default">' + p + '</button>' +
        '</span>' +
      '</div>';
    });
    placementHTML += '</div>';
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Tooltip <span class="demo-tag">12 placements</span></div>' +
      '<div class="demo-label">trigger="hover"（默认）</div>' +
      '<div class="demo-row" style="gap:24px">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="上方提示" data-placement="top"><button class="ai-btn ai-btn--md ai-btn--primary">Hover Top</button></span>' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="下方提示" data-placement="bottom"><button class="ai-btn ai-btn--md ai-btn--primary">Hover Bottom</button></span>' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="左侧提示" data-placement="left"><button class="ai-btn ai-btn--md ai-btn--primary">Hover Left</button></span>' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="右侧提示" data-placement="right"><button class="ai-btn ai-btn--md ai-btn--primary">Hover Right</button></span>' +
      '</div>' +
      '<div class="demo-label">trigger="focus" / "click"</div>' +
      '<div class="demo-row" style="gap:24px">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="聚焦时显示" data-placement="top" data-trigger="focus"><button class="ai-btn ai-btn--md ai-btn--dashed">Focus Me</button></span>' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="点击切换显示" data-placement="top" data-trigger="click"><button class="ai-btn ai-btn--md ai-btn--dashed">Click Me</button></span>' +
      '</div>' +
      '<div class="demo-label">variant="island" 动森气泡</div>' +
      '<div class="demo-row" style="gap:24px">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="动森风格有机气泡" data-placement="top" data-variant="island"><button class="ai-btn ai-btn--md ai-btn--primary">Island Top</button></span>' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="动森风格，无边框" data-placement="bottom" data-variant="island" data-borderless="true"><button class="ai-btn ai-btn--md ai-btn--primary">Island Bottom</button></span>' +
      '</div>' +
      '<div class="demo-label">12 种 placement</div>' + placementHTML +
      codeL('<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="提示文本" data-placement="top">\n  <button class="ai-btn ai-btn--primary">Hover Me</button>\n</span>') +
      apiT([
        ['data-title', '提示内容（支持 HTML）', 'string', '-'],
        ['data-placement', '位置：top/top-start/top-end/bottom/... 12 种', 'string', "'top'"],
        ['data-trigger', '触发：hover/focus/click', 'string', "'hover'"],
        ['data-variant', '风格：default/island', 'string', "'default'"],
        ['data-borderless', '无边框（"true" 启用）', 'string', '-'],
        ['AI.Tooltip(el, {title, placement, trigger, variant, bordered})', 'JS API', 'function', '-']
      ]) +
    '</div>';
  };

  // -- BackTop --
  DEMOS.backtop = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">BackTop <span class="demo-tag">返回顶部</span></div>' +
      '<div class="demo-label">基础用法 — 滚动页面到 400px 后右下角会出现按钮（已激活）</div>' +
      '<div data-ai="backtop"></div>' +
      '<div class="demo-label">自定义 visibilityHeight 和 duration（JS API）</div>' +
      '<div style="display:flex;gap:12px;align-items:center">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="backtop-create-btn">创建一个 BackTop（200px 触发）</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed" id="backtop-destroy-btn">销毁</button>' +
      '</div>' +
      '<div class="demo-label">提示：向下滚动当前页面即可看到右下角的返回顶部按钮</div>' +
      '<div style="height:240px;background:linear-gradient(180deg,#f8f8f0,#e8dcc8);border-radius:14px;padding:16px;color:#725d42;margin-top:8px">向下滚动演示…</div>' +
      codeL('<div data-ai="backtop"></div>\n// JS API\nvar bt = new AI.BackTop(null, {\n  visibilityHeight: 400,\n  duration: 300,\n  onClick: function () { console.log("clicked"); }\n});\nbt.destroy();') +
      apiT([
        ['data-ai="backtop"', '自动初始化', 'attribute', '-'],
        ['visibilityHeight', '滚动多少 px 后显示', 'number', '400'],
        ['duration', '滚动动画时长（ms）', 'number', '300'],
        ['target', '滚动容器（返回 HTMLElement/Window 的函数）', 'function', 'window'],
        ['imgSrc', '自定义图标 URL（默认 SVG 数据 URL）', 'string', '内置 SVG'],
        ['AI.BackTop(el, {visibilityHeight, duration, target, onClick})', 'JS API', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Drawer --
  DEMOS.drawer = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Drawer <span class="demo-tag">4 directions</span></div>' +
      '<div class="demo-label">4 个方向 + 景深背景</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="drawer-right-btn">Right 右侧</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="drawer-left-btn">Left 左侧</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="drawer-top-btn">Top 顶部</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="drawer-bottom-btn">Bottom 底部</button>' +
      '</div>' +
      '<div class="demo-label">不带景深（pushBackground=false）</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed" id="drawer-no-push-btn">无景深</button>' +
      '</div>' +
      '<div class="demo-label">inline 模式 — 在 HTML 中预声明抽屉</div>' +
      '<button class="ai-btn ai-btn--md ai-btn--dashed" id="drawer-inline-trigger">打开 inline 抽屉</button>' +
      '<div data-ai="drawer" data-placement="right" data-title="Inline 抽屉" data-trigger="#drawer-inline-trigger" style="display:none">这是 inline 模式的抽屉内容，可以从 HTML 中预声明。</div>' +
      codeL('// JS API\nvar d = new AI.Drawer(null, {\n  placement: "right",\n  title: "标题",\n  body: "<p>内容</p>",\n  width: 378,\n  pushBackground: true,\n  onClose: function () { console.log("closed"); }\n});\nd.open();\nd.close();\n// inline 模式\n<div data-ai="drawer" data-placement="right" data-title="..." data-trigger="#trigger-btn">...</div>') +
      apiT([
        ['placement', '位置：left/right/top/bottom', 'string', "'right'"],
        ['title', '标题', 'string', '-'],
        ['width', '宽度（left/right）', 'number|string', '378'],
        ['height', '高度（top/bottom）', 'number|string', '300'],
        ['maskClosable', '点击遮罩关闭', 'boolean', 'true'],
        ['pushBackground', '景深背景效果', 'boolean', 'true'],
        ['footer', '底部区域', 'string', '-'],
        ['AI.Drawer(el, {placement, title, body, footer, ...})', 'JS API', 'function', '-'],
        ['drawer.open() / close()', '打开/关闭', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Notification --
  DEMOS.notification = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Notification <span class="demo-tag">命令式 API</span></div>' +
      '<div class="demo-label">4 种类型</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-success-btn">Success</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-info-btn">Info</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-warning-btn">Warning</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--danger" id="notif-error-btn">Error</button>' +
      '</div>' +
      '<div class="demo-label">6 个位置</div>' +
      '<div class="demo-row" style="flex-wrap:wrap;gap:8px">' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="topLeft">topLeft</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="top">top</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="topRight">topRight</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottomLeft">bottomLeft</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottom">bottom</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottomRight">bottomRight</button>' +
      '</div>' +
      '<div class="demo-label">duration=0 不自动关闭 + 带描述</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--dashed" id="notif-persistent-btn">常驻通知</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--text" id="notif-destroy-btn">关闭全部</button>' +
      '</div>' +
      codeL('// 命令式 API\nAI.Notification.success({ message: "成功", description: "操作已完成" });\nAI.Notification.info({ message: "提示", position: "topRight", duration: 5 });\nAI.Notification.error({ message: "失败", position: "bottomRight" });\nAI.Notification.destroy(); // 关闭全部') +
      apiT([
        ['message', '标题（必填）', 'string', '-'],
        ['description', '描述正文', 'string', '-'],
        ['type', '类型：success/info/warning/error', 'string', "'info'"],
        ['position', '位置：top/topLeft/topRight/bottom/bottomLeft/bottomRight', 'string', "'top'"],
        ['duration', '自动关闭延时（秒），0 不关闭', 'number', '4.5'],
        ['key', '唯一 key（用于更新）', 'string', '自动生成'],
        ['onClick', '点击回调', 'function', '-'],
        ['onClose', '关闭回调', 'function', '-'],
        ['AI.Notification.success/info/warning/error(cfg)', '静态方法', 'function', '-'],
        ['AI.Notification.close(key) / destroy()', '关闭单条/全部', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Form --
  DEMOS.form = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Form <span class="demo-tag">校验 + 提交</span></div>' +
      '<div class="demo-label">基础表单 — 校验 + 提交</div>' +
      '<form id="form-demo" data-layout="horizontal" style="max-width:520px">' +
        '<div class="ai-form-item" data-name="username" data-rules=\'[{"required":true,"message":"用户名必填"},{"min":3,"message":"用户名至少 3 个字符"}]\'>' +
          '<label class="ai-form-item__label ai-form-item__label--required">用户名</label>' +
          '<div class="ai-form-item__control"><div class="ai-form-item__control-input"><input class="ai-input" style="width:100%" placeholder="请输入用户名"></div></div>' +
        '</div>' +
        '<div class="ai-form-item" data-name="email" data-rules=\'[{"required":true,"message":"邮箱必填"},{"type":"email","message":"邮箱格式不正确"}]\'>' +
          '<label class="ai-form-item__label ai-form-item__label--required">邮箱</label>' +
          '<div class="ai-form-item__control"><div class="ai-form-item__control-input"><input class="ai-input" style="width:100%" placeholder="example@island.com"></div></div>' +
        '</div>' +
        '<div class="ai-form-item" data-name="age" data-rules=\'[{"type":"integer","message":"必须是整数"},{"type":"integer","min":18,"message":"必须年满 18 岁"}]\'>' +
          '<label class="ai-form-item__label">年龄</label>' +
          '<div class="ai-form-item__control"><div class="ai-form-item__control-input"><input class="ai-input" style="width:100%" placeholder="可选"></div></div>' +
        '</div>' +
        '<div class="ai-form-item">' +
          '<div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
            '<button type="submit" class="ai-btn ai-btn--md ai-btn--primary">提交</button>' +
            '<button type="reset" class="ai-btn ai-btn--md ai-btn--default" style="margin-left:8px">重置</button>' +
          '</div></div>' +
        '</div>' +
      '</form>' +
      '<div class="demo-label">提交结果（看控制台）：</div>' +
      '<div id="form-result" style="background:#2b2118;color:#e8d5bc;padding:12px 16px;border-radius:8px;font-family:monospace;font-size:13px;min-height:42px">提交后这里会显示结果</div>' +
      codeL('<form data-ai="form" data-layout="horizontal">\n  <div class="ai-form-item" data-name="username" data-rules=\'[{"required":true,"message":"必填"}]\'>\n    <label class="ai-form-item__label">用户名</label>\n    <div class="ai-form-item__control"><div class="ai-form-item__control-input">\n      <input class="ai-input">\n    </div></div>\n  </div>\n</form>\nvar form = new AI.Form(el, {\n  onFinish: function (vals) { console.log(vals); },\n  onFinishFailed: function (info) { console.log(info.errorFields); }\n});\nform.submit(); form.validateFields(); form.resetFields();') +
      apiT([
        ['data-layout', '布局：horizontal/vertical/inline', 'string', "'horizontal'"],
        ['data-name', '字段名（在 .ai-form-item 上）', 'string', '-'],
        ['data-rules', '校验规则（JSON）', 'string', '-'],
        ['rules', '校验规则数组（JS 模式）', 'Array', '-'],
        ['initialValues', '初始值（JS 模式）', 'object', '-'],
        ['onFinish(values)', '校验通过回调', 'function', '-'],
        ['onFinishFailed(info)', '校验失败回调', 'function', '-'],
        ['onValuesChange(changed, all)', '值变化回调', 'function', '-'],
        ['AI.Form(el, {layout, onFinish, ...})', 'JS API', 'function', '-'],
        ['form.validateFields() / submit() / resetFields()', '校验/提交/重置', 'method', '-'],
        ['form.getFieldValue / setFieldValue / getFieldsValue', '取/设值', 'method', '-']
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

    // Progress dynamic update
    if (key === 'progress') {
      var progressDynamic = document.getElementById('progress-dynamic');
      var progressInstance = null;
      // Re-init to get instance reference
      if (progressDynamic) {
        progressInstance = new AI.Progress(progressDynamic, {
          percent: parseInt(progressDynamic.getAttribute('data-percent') || '30', 10),
          size: progressDynamic.getAttribute('data-size') || 'middle'
        });
      }
      var progressAddBtn = document.getElementById('progress-add-btn');
      if (progressAddBtn && progressInstance) {
        progressAddBtn.addEventListener('click', function () {
          var next = (progressInstance.getPercent() + 5) % 105;
          progressInstance.setPercent(next);
        });
      }
    }

    // Title JS API
    if (key === 'title') {
      var titleMount = document.getElementById('title-js-mount');
      if (titleMount) {
        var titleEl = new AI.Title({ size: 'large', color: 'app-teal', text: '动森标题' });
        titleMount.appendChild(titleEl);
      }
    }

    // Radio JS API (controlled)
    if (key === 'radio') {
      var radioMount = document.getElementById('radio-js-mount');
      if (radioMount) {
        var radioInst = new AI.Radio(radioMount, {
          size: 'middle',
          value: 'apple',
          options: [
            { label: '苹果', value: 'apple' },
            { label: '橘子', value: 'orange' },
            { label: '樱桃', value: 'cherry' }
          ],
          onChange: function (v) {
            var valEl = document.getElementById('radio-js-value');
            if (valEl) valEl.textContent = v;
          }
        });
      }
    }

    // Wallet dynamic update
    if (key === 'wallet') {
      var walletDynamic = document.getElementById('wallet-dynamic');
      var walletInstance = null;
      if (walletDynamic) {
        walletInstance = new AI.Wallet(walletDynamic, {
          size: walletDynamic.getAttribute('data-size') || 'medium',
          value: parseInt(walletDynamic.getAttribute('data-value') || '500', 10)
        });
      }
      var walletAddBtn = document.getElementById('wallet-add-btn');
      if (walletAddBtn && walletInstance) {
        walletAddBtn.addEventListener('click', function () {
          var cur = typeof walletInstance.getValue() === 'number'
            ? walletInstance.getValue()
            : parseInt(walletInstance.getValue(), 10) || 0;
          walletInstance.setValue(cur + 1000);
        });
      }
    }

    // BackTop create/destroy
    if (key === 'backtop') {
      var backtopCreateBtn = document.getElementById('backtop-create-btn');
      var backtopDestroyBtn = document.getElementById('backtop-destroy-btn');
      var backtopInstance = null;
      if (backtopCreateBtn) backtopCreateBtn.addEventListener('click', function () {
        if (backtopInstance) return;
        backtopInstance = new AI.BackTop(null, {
          visibilityHeight: 200,
          duration: 300,
          onClick: function () { /* default scroll-to-top */ }
        });
        backtopCreateBtn.textContent = '已创建（200px 触发）';
      });
      if (backtopDestroyBtn) backtopDestroyBtn.addEventListener('click', function () {
        if (backtopInstance) {
          backtopInstance.destroy();
          backtopInstance = null;
          backtopCreateBtn.textContent = '创建一个 BackTop（200px 触发）';
        }
      });
      cleanups.push(function () {
        if (backtopInstance) { backtopInstance.destroy(); backtopInstance = null; }
      });
    }

    // Drawer open/close
    if (key === 'drawer') {
      var openDrawer = function (cfg) {
        new AI.Drawer(null, cfg).open();
      };
      var dr = document.getElementById('drawer-right-btn');
      if (dr) dr.addEventListener('click', function () {
        openDrawer({ placement: 'right', title: '右侧抽屉', body: '<p style="padding:8px 0">这是从右侧滑出的抽屉，带有景深背景效果。</p>', width: 378 });
      });
      var dl = document.getElementById('drawer-left-btn');
      if (dl) dl.addEventListener('click', function () {
        openDrawer({ placement: 'left', title: '左侧抽屉', body: '<p style="padding:8px 0">这是从左侧滑出的抽屉。</p>', width: 378 });
      });
      var dt = document.getElementById('drawer-top-btn');
      if (dt) dt.addEventListener('click', function () {
        openDrawer({ placement: 'top', title: '顶部抽屉', body: '<p style="padding:8px 0">这是从顶部滑出的抽屉。</p>', height: 260 });
      });
      var db = document.getElementById('drawer-bottom-btn');
      if (db) db.addEventListener('click', function () {
        openDrawer({ placement: 'bottom', title: '底部抽屉', body: '<p style="padding:8px 0">这是从底部滑出的抽屉。</p>', height: 260 });
      });
      var dnp = document.getElementById('drawer-no-push-btn');
      if (dnp) dnp.addEventListener('click', function () {
        openDrawer({ placement: 'right', title: '无景深抽屉', body: '<p style="padding:8px 0">这个抽屉关闭了 pushBackground，背景不产生景深效果。</p>', width: 378, pushBackground: false });
      });
    }

    // Notification buttons
    if (key === 'notification') {
      var ns = document.getElementById('notif-success-btn');
      if (ns) ns.addEventListener('click', function () {
        AI.Notification.success({ message: '操作成功', description: '数据已保存到岛屿档案馆', position: 'top' });
      });
      var ni = document.getElementById('notif-info-btn');
      if (ni) ni.addEventListener('click', function () {
        AI.Notification.info({ message: '提示信息', description: '今天有新的访客到来', position: 'top' });
      });
      var nw = document.getElementById('notif-warning-btn');
      if (nw) nw.addEventListener('click', function () {
        AI.Notification.warning({ message: '注意', description: '背包快满了，请整理一下', position: 'top' });
      });
      var ne = document.getElementById('notif-error-btn');
      if (ne) ne.addEventListener('click', function () {
        AI.Notification.error({ message: '操作失败', description: '网络连接异常，请重试', position: 'top' });
      });
      document.querySelectorAll('[data-notif-pos]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var pos = btn.getAttribute('data-notif-pos');
          AI.Notification.info({ message: '位置：' + pos, description: '这条通知出现在 ' + pos + ' 位置', position: pos, duration: 3 });
        });
      });
      var np = document.getElementById('notif-persistent-btn');
      if (np) np.addEventListener('click', function () {
        AI.Notification.open({
          type: 'info',
          message: '常驻通知',
          description: 'duration=0，不会自动关闭。请点击右上角 × 关闭。',
          position: 'topRight',
          duration: 0
        });
      });
      var nd = document.getElementById('notif-destroy-btn');
      if (nd) nd.addEventListener('click', function () {
        AI.Notification.destroy();
      });
    }

    // Form submission
    if (key === 'form') {
      var formEl = document.getElementById('form-demo');
      var formResult = document.getElementById('form-result');
      if (formEl && formResult) {
        var formInst = new AI.Form(formEl, {
          onFinish: function (vals) {
            formResult.textContent = '✓ 校验通过，提交值：' + JSON.stringify(vals, null, 2);
          },
          onFinishFailed: function (info) {
            formResult.textContent = '✗ 校验失败，错误字段：' + info.errorFields.map(function (f) {
              return f.name + ' (' + f.errors.join('; ') + ')';
            }).join(' | ');
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