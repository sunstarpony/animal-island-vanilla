(function () {
  'use strict';
  var AI = AnimalIsland;

  /* ==============================
     Menu config
     ============================== */
  /* 分类与 React 版 demo/App.tsx 一致：指南 / 基础 / 表单 / 反馈 / 数据展示，图表统计置于最后 */
  var MENU = [
    {
      category: '── 指南 ──',
      items: [
        { key: 'skill', label: 'Skill 介绍' }
      ]
    },
    {
      category: '── 基础 ──',
      items: [
        { key: 'title', label: 'Title 标题' },
        { key: 'button', label: 'Button 按钮' },
        { key: 'divider', label: 'Divider 分割线' },
        { key: 'icon', label: 'Icon 图标' },
        { key: 'tag', label: 'Tag 标签' },
        { key: 'cursor', label: 'Cursor 光标' },
        { key: 'codeblock', label: 'CodeBlock 代码高亮' },
        { key: 'background', label: 'Background 背景' },
        { key: 'footer', label: 'Footer 页脚' }
      ]
    },
    {
      category: '── 表单 ──',
      items: [
        { key: 'input', label: 'Input 输入框' },
        { key: 'switch', label: 'Switch 开关' },
        { key: 'select', label: 'Select 选择器' },
        { key: 'datepicker', label: 'DatePicker 日期选择' },
        { key: 'timepicker', label: 'TimePicker 时间选择' },
        { key: 'calendar', label: 'Calendar 日历' },
        { key: 'checkbox', label: 'Checkbox 多选框' },
        { key: 'radio', label: 'Radio 单选框' },
        { key: 'rate', label: 'Rate 评分' },
        { key: 'form', label: 'Form 表单' },
        { key: 'upload', label: 'Upload 上传' }
      ]
    },
    {
      category: '── 反馈 ──',
      items: [
        { key: 'notification', label: 'Notification 通知' },
        { key: 'modal', label: 'Modal 弹窗' },
        { key: 'drawer', label: 'Drawer 抽屉' },
        { key: 'loading', label: 'Loading 加载' },
        { key: 'tooltip', label: 'Tooltip 工具提示' },
        { key: 'progress', label: 'Progress 进度条' },
        { key: 'skeleton', label: 'Skeleton 骨架屏' },
        { key: 'nodata', label: 'NoData 空状态' },
        { key: 'backtop', label: 'BackTop 返回顶部' }
      ]
    },
    {
      category: '── 数据展示 ──',
      items: [
        { key: 'card', label: 'Card 卡片' },
        { key: 'avatar', label: 'Avatar 头像' },
        { key: 'badge', label: 'Badge 徽标数' },
        { key: 'collapse', label: 'Collapse 折叠面板' },
        { key: 'tabs', label: 'Tabs 标签页' },
        { key: 'table', label: 'Table 表格' },
        { key: 'pagination', label: 'Pagination 分页' },
        { key: 'typewriter', label: 'Typewriter 打字机' },
        { key: 'image', label: 'Image 图片' },
        { key: 'carousel', label: 'Carousel 轮播图' },
        { key: 'time', label: 'Time 时间' },
        { key: 'countdown', label: 'Countdown 倒计时' },
        { key: 'countup', label: 'CountUp 数字滚动' },
        { key: 'phone', label: 'Phone 手机' },
        { key: 'wallet', label: 'Wallet 钱包' }
      ]
    }
  ];

  /* 图表类型参考 uCharts 目录，侧栏、路由与类型页共用同一份元信息。 */
  var CHART_PAGES = [
    { type: 'column', label: '柱状图', en: 'Column', desc: '分类数值对比，支持分组与正负值堆叠。' },
    { type: 'bar', label: '条状图', en: 'Bar', desc: '横向比较与排名，长分类名称更容易阅读。' },
    { type: 'line', label: '折线图', en: 'Line', desc: '连续趋势与多系列比较，支持曲线和缺测断点。' },
    { type: 'area', label: '面积图', en: 'Area', desc: '用柔和填充表达趋势与体量。' },
    { type: 'mount', label: '山峰图', en: 'Mountain', desc: '海岛山丘形状的分类数值展示。' },
    { type: 'mix', label: '混合图', en: 'Mixed', desc: '柱状、折线和面积组合，共用同一数值轴。' },
    { type: 'pie', label: '饼图', en: 'Pie', desc: '用扇区面积表达各项占比。' },
    { type: 'ring', label: '环形图', en: 'Ring', desc: '环形占比与中心合计。' },
    { type: 'rose', label: '玫瑰图', en: 'Rose', desc: '等角度扇区，通过面积表达数值。' },
    { type: 'radar', label: '雷达图', en: 'Radar', desc: '多个维度的共同量纲对比，缺测不自动补零。' },
    { type: 'scatter', label: '散点图', en: 'Scatter', desc: '观察两个数值维度的分布与关系。' },
    { type: 'bubble', label: '气泡图', en: 'Bubble', desc: '气泡面积表达第三个数值维度。' },
    { type: 'arcbar', label: '圆弧进度', en: 'ArcBar', desc: '多项指标的目标完成进度。' },
    { type: 'gauge', label: '仪表盘', en: 'Gauge', desc: '单个数值的刻度、指针与当前读数。' },
    { type: 'funnel', label: '漏斗图', en: 'Funnel', desc: '按业务顺序展示阶段转化，不自动重排数据。' },
    { type: 'word', label: '词云图', en: 'WordCloud', desc: '按权重排列词条，支持数据查看与点击。' },
    { type: 'candle', label: 'K线图', en: 'Candlestick', desc: '开盘、收盘、最高、最低四个值的区间变化。' },
    { type: 'time', label: '时序图', en: 'TimeSeries', desc: '按真实时间间隔排列的数据趋势。' },
    { type: 'map', label: '地图统计', en: 'Map', desc: '使用调用方提供的区域轮廓展示空间统计。' }
  ];

  MENU.push({
    category: '── 图表统计 ──',
    items: [{ key: 'chart', label: 'Chart 图表总览' }].concat(CHART_PAGES.map(function (page) {
      return { key: 'chart-' + page.type, label: page.label + ' ' + page.en };
    }))
  });

  var PAGE_INFO = {
    skill: { title: 'Skill 介绍', desc: 'animal-island-ui-style — 一个可安装的编码助手技能，把治愈系海岛设计语言整理成 AI 代理可执行的规则与参考文档。' },
    button: { title: 'Button 按钮', desc: '按钮组件 — 支持 primary / dashed / text / link 等类型，danger / ghost / loading / disabled 状态，icon 图标，block 块级，三种尺寸' },
    input: { title: 'Input 输入框', desc: '输入框组件 — 支持三种尺寸、clearable 清除、prefix / suffix 前后缀、error / warning 校验状态、disabled 禁用' },
    switch: { title: 'Switch 开关', desc: '开关组件 — 支持受控 / 非受控、自定义文案、small 尺寸、loading 状态' },
    card: { title: 'Card 卡片', desc: '卡片容器组件 — default / dashed 两种类型，13 种背景配色，13 种波点壁纸，hoverable 悬停位移' },
    collapse: { title: 'Collapse 折叠面板', desc: '折叠面板组件 — 支持展开/收起、默认展开、禁用状态' },
    cursor: { title: 'Cursor 光标', desc: '光标组件 — 手绘箭头光标与蓝色雨滴光标，支持 force 全覆盖与 scoped 局部，含配套文字选中色' },
    modal: { title: 'Modal 弹窗', desc: '模态弹窗组件 — SVG 有机形状裁切（game 默认）/ 圆角两种外观、支持标题、自定义 Footer、自定义遮罩、ESC / 遮罩关闭、焦点陷阱' },
    typewriter: { title: 'Typewriter 打字机', desc: '打字机组件 — 按字符逐个显示文本，支持多行与富内容，不改变原有样式' },
    divider: { title: 'Divider 分割线', desc: '分割线组件 — 六种线型（虚线/细线/发丝线/波浪/弯曲线/海浪）与图标循环铺满' },
    icon: { title: 'Icon 图标', desc: '图标组件 — 动森风格图标集，包含 10 个可爱图标，支持自定义尺寸' },
    select: { title: 'Select 选择器', desc: '下拉选择器组件 — 支持自定义选项列表、allowClear 清空、showSearch 关键字过滤、键盘导航' },
    checkbox: { title: 'Checkbox 多选框', desc: '多选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用' },
    tabs: { title: 'Tabs 标签页', desc: '标签页组件 — 支持受控/非受控模式切换' },
    footer: { title: 'Footer 页脚', desc: '页脚版权栏 — © 年份 + 文案，年份默认取当前年，支持自定义文案与样式' },
    codeblock: { title: 'CodeBlock 代码高亮', desc: '代码高亮组件 — 语法高亮显示，支持自定义样式和类名' },
    loading: { title: 'Loading 加载', desc: '加载组件 — 全屏落雪 / 圆形展开两种形态，右下角帆船海浪，支持提示文字、延迟显示与淡出时长' },
    table: { title: 'Table 表格', desc: '数据表格组件，支持斑马纹、边框、加载状态等常用功能' },
    tag: { title: 'Tag 标签', desc: '标签组件 — 4 种变体（solid/outlined/dashed/soft）、12 种配色、可关闭、可点击、禁用、三种尺寸' },
    title: { title: 'Title 标题', desc: '标题组件 — ribbon 飘带 / layer 双层纸 / tab 折角便签三种样式，14 / 20 / 28px 三种尺寸，12 种配色' },
    skeleton: { title: 'Skeleton 骨架屏', desc: '骨架屏加载占位组件 — 四种变体（text / circle / rect / paragraph），包含 Skeleton.Button / Skeleton.Input / Skeleton.Avatar 子组件，支持 loading 切换动画' },
    progress: { title: 'Progress 进度条', desc: '进度条组件 — 三种尺寸、场景图 variant、双层海浪、自定义配色、可动态更新' },
    radio: { title: 'Radio 单选框', desc: '单选组件 — 支持受控/非受控、水平/垂直排列、键盘导航（方向键/Home/End）、三种尺寸' },
    time: { title: 'Time 时间', desc: '经典 HUD 风格的时间显示组件，实时更新时间' },
    phone: { title: 'Phone 手机', desc: '动森风格手机界面，包含对话框和背包功能' },
    wallet: { title: 'Wallet 钱包', desc: '动森风格钱包组件 — 三种尺寸、千分位格式化、可动态更新金额' },
    tooltip: { title: 'Tooltip 工具提示', desc: '工具提示组件 — 12 种 placement、hover/focus/click 触发、default/island 两种风格' },
    backtop: { title: 'BackTop 返回顶部', desc: '返回顶部组件 — 滚动可见、平滑动画、可自定义滚动容器和触发高度' },
    drawer: { title: 'Drawer 抽屉', desc: '抽屉组件 — 左/右/上/下四个方向、景深背景、遮罩关闭、ESC 关闭、焦点陷阱' },
    notification: { title: 'Notification 通知', desc: '通知组件 — 命令式 API、四种类型、六个位置、自动关闭、可点击' },
    form: { title: 'Form 表单', desc: '表单组件 — 字段管理、规则校验、提交/重置、初始值、错误提示' },
    avatar: { title: 'Avatar 头像', desc: '头像组件 — 圆形/方形、图片/图标/文字三种内容、预设与自定义尺寸、加载失败自动回退、头像组叠加与折叠' },
    badge: { title: 'Badge 徽标数', desc: '徽标数组件 — 数字/封顶数字/小红点、独立与包裹两用、12 色板、1-2 位数字锁正圆' },
    nodata: { title: 'NoData 空状态', desc: '空态组件 — 空纸箱/搜索/简洁三种变体、三种尺寸、自定义图标与操作区、虚线奶油底' },
    rate: { title: 'Rate 评分', desc: '评分组件 — 带表情的金色星星、弹跳+星点扩散动效、半星评分、可清空、键盘导航' },
    pagination: { title: 'Pagination 分页', desc: '分页组件 — 幽灵正圆格子、橙色/青绿双配色、页码折叠、SizeChanger 上弹层、QuickJumper 快速跳页' },
    image: { title: 'Image 图片', desc: '图片组件 — 卡片/衬板/邮票三种形态、半色调网点与齿孔 mask、错误占位、内置大图预览' },
    carousel: { title: 'Carousel 轮播图', desc: '走马灯组件 — 淡入+位移过渡、圆形箭头、胶囊指示点、自动轮播/暂停/键盘导航' },
    countup: { title: 'CountUp 数字滚动', desc: '数字滚动组件 — default/island 两皮肤、五段缓动、万位分隔、庆祝动效（弹跳+光环+星芒+贴纸）' },
    countdown: { title: 'Countdown 倒计时', desc: '倒计时组件 — 里程表滚动数字、DD/HH/mm/ss 模板、提醒变色、抖动/回弹/归零三段动效' },
    background: { title: 'Background 背景', desc: '装饰背景组件 — 奶油/深绿波点、彩色针糖 + 12 色 Card pattern 底色壁纸，零图片资源，可作为整页或区块背景，内容渲染在图案之上' },
    upload: { title: 'Upload 上传', desc: '文件上传组件 — 点击 / 拖拽两种触发方式，text 与 picture-card 两种列表形态，beforeUpload 拦截、maxCount 上限、customRequest 接入真实上传，内置模拟进度' },
    datepicker: { title: 'DatePicker 日期选择', desc: '日期选择组件 — 日历/月/年三模式、范围选择、奶油胶囊触发器、disabledDate 与键盘导航' },
    timepicker: { title: 'TimePicker 时间选择', desc: '时间选择组件 — 时/分(/秒)滚轮面板、此刻/确定页脚、steps 步进、status 校验状态' },
    calendar: { title: 'Calendar 日历', desc: '日历组件 — 整月面板、事项条叠加层（跨天切段/折叠 +N/5 色）、拖拽跨日创建事项、等比缩放' },
    chart: { title: 'Chart 图表总览', desc: '图表组件 — 纯 SVG 渲染的 19 种统计图形，岛屿配色、悬浮对比、点击锁定、图例筛选与数据明细' }
  };

  CHART_PAGES.forEach(function (page) {
    PAGE_INFO['chart-' + page.type] = {
      title: page.label + ' ' + page.en,
      desc: page.desc + ' 纯 SVG 绘制，无第三方依赖。'
    };
  });

  /* ==============================
     Helpers
     ============================== */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function apiT(rows, title) {
    var h = '<div class="api-table-wrap"><span class="api-label">' + (title || 'API') + '</span>' +
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
      { icon: 'Property-Shopping.svg', title: '45 个组件', desc: 'Title / Button / Divider / Icon / Tag / Cursor / CodeBlock / Background / Footer / Input / Switch / Select / DatePicker / TimePicker / Calendar / Checkbox / Radio / Rate / Form / Upload / Notification / Modal / Drawer / Loading / Tooltip / Progress / Skeleton / NoData / BackTop / Card / Avatar / Badge / Collapse / Tabs / Table / Pagination / Typewriter / Image / Carousel / Time / Countdown / CountUp / Phone / Wallet / Chart' },
      { icon: 'Property-Camera.svg', title: '主题定制', desc: '40+ CSS 自定义属性，运行时换肤无需重新构建' },
      { icon: 'Property-Recipes.svg', title: '开箱即用', desc: '无需 npm / React / Node.js，直接下载引用即可使用' }
    ];
    var comps = [
      { key: 'title', name: 'Title', desc: '动森缎带标题，3D 立体效果' },
      { key: 'button', name: 'Button', desc: '5 种类型、3 种尺寸、加载/危险/幽灵模式' },
      { key: 'divider', name: 'Divider', desc: '装饰性水平分割线' },
      { key: 'icon', name: 'Icon', desc: 'SVG 图标库，10 个可爱图标' },
      { key: 'tag', name: 'Tag', desc: '标签组件，4 种变体、12 种配色' },
      { key: 'cursor', name: 'Cursor', desc: '自定义手指光标，支持多种尺寸' },
      { key: 'codeblock', name: 'CodeBlock', desc: '代码语法高亮组件' },
      { key: 'background', name: 'Background', desc: '波点与针糖壁纸，零图片资源' },
      { key: 'footer', name: 'Footer', desc: '页脚组件，树与海两种装饰' },
      { key: 'input', name: 'Input', desc: '前后缀、一键清空、校验状态' },
      { key: 'switch', name: 'Switch', desc: '受控/非受控、自定义文案、加载状态' },
      { key: 'select', name: 'Select', desc: '下拉选择器，支持搜索和禁用' },
      { key: 'datepicker', name: 'DatePicker', desc: '日/月/年三模式、范围选择' },
      { key: 'timepicker', name: 'TimePicker', desc: '时分秒滚轮面板、步进与校验' },
      { key: 'calendar', name: 'Calendar', desc: '事项条叠加、跨天切段、拖拽创建' },
      { key: 'checkbox', name: 'Checkbox', desc: '多选框组件，支持水平/垂直排列' },
      { key: 'radio', name: 'Radio', desc: '单选组件，键盘导航' },
      { key: 'rate', name: 'Rate', desc: '表情星星评分、半星、可清空' },
      { key: 'form', name: 'Form', desc: '表单，字段校验、提交与重置' },
      { key: 'upload', name: 'Upload', desc: '点击/拖拽上传、自定义请求' },
      { key: 'notification', name: 'Notification', desc: '通知，命令式 API、六种位置' },
      { key: 'modal', name: 'Modal', desc: 'SVG 有机形状弹窗、ESC 关闭' },
      { key: 'drawer', name: 'Drawer', desc: '抽屉，4 方向、景深背景' },
      { key: 'loading', name: 'Loading', desc: '动森风格小岛加载动画' },
      { key: 'tooltip', name: 'Tooltip', desc: '工具提示，12 种位置' },
      { key: 'progress', name: 'Progress', desc: '进度条，条纹动画、动态更新' },
      { key: 'skeleton', name: 'Skeleton', desc: '骨架屏，4 种变体、shimmer 动画' },
      { key: 'nodata', name: 'NoData', desc: '空纸箱/搜索/简洁三种空态' },
      { key: 'backtop', name: 'BackTop', desc: '返回顶部，平滑动画' },
      { key: 'card', name: 'Card', desc: '默认/标题两种卡片风格' },
      { key: 'avatar', name: 'Avatar', desc: '图片/图标/文字、头像组折叠' },
      { key: 'badge', name: 'Badge', desc: '数字/封顶/小红点、12 色板' },
      { key: 'collapse', name: 'Collapse', desc: 'FAQ 折叠面板、平滑展开动画' },
      { key: 'tabs', name: 'Tabs', desc: '标签页组件，支持受控/非受控模式' },
      { key: 'table', name: 'Table', desc: '数据表格组件' },
      { key: 'pagination', name: 'Pagination', desc: '页码折叠、快速跳转与每页条数' },
      { key: 'typewriter', name: 'Typewriter', desc: '逐字打字机效果，支持多行与富内容' },
      { key: 'image', name: 'Image', desc: '三种形态、网点纹理、大图预览' },
      { key: 'carousel', name: 'Carousel', desc: '淡入位移过渡、自动轮播' },
      { key: 'time', name: 'Time', desc: '可爱风格时间显示' },
      { key: 'countdown', name: 'Countdown', desc: '里程表滚动数字、提醒与抖动' },
      { key: 'countup', name: 'CountUp', desc: '五段缓动、万位分隔、庆祝动效' },
      { key: 'phone', name: 'Phone', desc: 'Phone 模拟器' },
      { key: 'wallet', name: 'Wallet', desc: '动森风格钱包' },
      { key: 'chart', name: 'Chart', desc: '19 种图表、纯 SVG、可交互' }
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
        '<span class="ai-input-wrapper ai-input-wrapper--md"><span class="ai-input__prefix"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/></svg></span><input class="ai-input" placeholder="Prefix &amp; Suffix"><span class="ai-input__suffix"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><path d="M9 8l-4 4 4 4"/></svg></span></span>' +
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
        ['size', '输入框尺寸（small / middle / large）或直接使用 .ai-input-wrapper--sm|md|lg', "'small'|'middle'|'large'", "'middle'"],
        ['prefix', '前缀', '.ai-input__prefix', '-'],
        ['suffix', '后缀', '.ai-input__suffix', '-'],
        ['allowClear', '允许清除', '.ai-input__clear', '-'],
        ['status', '校验状态', "'error'|'warning'", '-'],
        ['shadow', '是否显示阴影', '.ai-input-wrapper--shadow', '-'],
        ['onChange', '值变化回调', '(e) => void', '-'],
        ['onClear', '清除回调', '() => void', '-']
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
      '<div class="demo-section-title">Card <span class="demo-tag">2 types</span> <span class="demo-tag">13 colors</span> <span class="demo-tag">13 patterns</span></div>';

    h += '<div class="demo-label">type="default"</div><div class="demo-row">' +
      '<div class="ai-card"><p>基础卡片</p></div>' +
      '<div class="ai-card" style="max-width:560px;width:100%"><p>在Nintendo 3DS《集合啦！动物森友会》中，可以享受无人岛生活。</p></div>' +
    '</div>';

    h += '<div class="demo-label">type="dashed"</div><div class="demo-row">' +
      '<div class="ai-card ai-card--dashed"><p>虚线边框卡片</p></div>' +
      '<div class="ai-card ai-card--dashed" style="max-width:360px;width:100%"><p>拖拽文件到此处上传</p></div>' +
    '</div>';

    h += '<div class="demo-label">hoverable — 悬停上移 2px（默认关闭）</div><div class="demo-row">' +
      '<div class="ai-card ai-card--hoverable"><p>可悬停卡片</p></div>' +
      '<div class="ai-card ai-card--dashed ai-card--hoverable" style="width:220px"><p>虚线可悬停（只变色）</p></div>' +
    '</div>';

    h += '<div class="demo-label">颜色变体</div><div class="card-color-grid">';
    colors.forEach(function (c) { h += '<div class="ai-card ai-card--' + c + ' card-color-item">' + c + '</div>'; });
    h += '</div>';

    h += '<div class="demo-label">pattern — 13 种波点壁纸</div><div class="card-color-grid">';
    colors.forEach(function (c) {
      h += '<div class="ai-card ai-card--pattern-' + c + ' card-color-item">' + c + '</div>';
    });
    h += '</div>';

    h += codeL('<div class="ai-card">基础卡片</div>\n<div class="ai-card ai-card--dashed">虚线卡片</div>\n<div class="ai-card ai-card--hoverable">可悬停卡片</div>\n<div class="ai-card ai-card--app-blue">蓝色卡片</div>\n<div class="ai-card ai-card--pattern-app-teal">薄荷色波点卡片</div>');
    h += apiT([
      ['type', '卡片类型', "'default'|'dashed'", "'default'"],
      ['color', '背景颜色类型', "'app-pink'|'purple'|...", "'default'"],
      ['pattern', '13 种波点壁纸', "'app-pink'|'purple'|...", '-'],
      ['hoverable', '悬停上移 + 手型光标', 'boolean', 'false'],
      ['className', '自定义类名', 'string', '-'],
      ['style', '自定义样式', 'CSSProperties', '-']
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
      '<div class="demo-label">variant="raindrop"：蓝色雨滴光标 + 系统选区色</div>' +
      '<div class="ai-cursor ai-cursor--raindrop ai-cursor--force demo-dashed-box" style="padding:24px;text-align:center">移入此区域查看雨滴光标，选中这段文字查看系统选区色</div>' +
      codeL('<div class="ai-cursor--force">\n  <!-- 默认手绘箭头光标，选中文字为暖黄色 -->\n</div>\n\n<div class="ai-cursor ai-cursor--raindrop ai-cursor--force">\n  <!-- 雨滴光标，选中文字为系统高亮色 -->\n</div>\n\n<div class="ai-cursor ai-cursor--scoped">\n  <!-- 保留交互元素原生光标 -->\n</div>') +
      apiT([
        ['variant', '光标样式', "'default'|'raindrop'", "'default'"],
        ['forceAll', '是否对所有后代元素强制覆盖光标', 'boolean', 'true']
      ]) +
    '</div>';
  };

  // -- Modal --
  DEMOS.modal = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Modal <span class="demo-tag">弹窗</span></div>' +
      '<div class="demo-label">异形弹窗 (game)</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="modal-game">异形 Modal</button>' +
      '</div>' +
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
      '<div class="demo-label">自定义遮罩样式</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="modal-light-mask">浅色遮罩</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="modal-dark-mask">深色遮罩</button>' +
      '</div>' +
      codeL('var modal = new AnimalIsland.Modal({\n  title: "标题",\n  content: "内容",\n  width: 520,\n  variant: "game",\n  typewriter: true,\n  maskStyle: { background: "rgba(0,0,0,.08)" },\n  onOk: function() { /* ... */ },\n  onClose: function() { /* ... */ }\n});\nmodal.open();') +
      apiT([
        ['variant', "弹窗类型：default 常规圆角矩形，game 异形自然外框", "'default' | 'game'", "'game'"],
        ['title', '标题', 'string', "''"],
        ['content', '内容（支持 HTML）', 'string', "''"],
        ['width', '宽度', 'number | string', '520'],
        ['maskClosable', '点击遮罩关闭', 'boolean', 'true'],
        ['footer', '底部按钮区域，传 null 则不显示', 'undefined|null|string', '默认按钮'],
        ['typewriter', '是否启用打字机效果', 'boolean', 'true'],
        ['typeSpeed', '打字机每字间隔 (ms)', 'number', '80'],
        ['cursor', '是否在弹窗内使用自定义光标', 'boolean', 'true'],
        ['maskStyle', '遮罩层自定义样式', 'object | string', '-'],
        ['className', '自定义类名', 'string', "''"]
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
      '<div class="demo-section-title">Divider <span class="demo-tag">6 types</span> <span class="demo-tag">icon loop</span></div>' +
      '<div class="demo-label">dashed-brown（默认）</div><div class="ai-divider"></div>' +
      '<div class="demo-label">thin</div><div class="ai-divider ai-divider--thin"></div>' +
      '<div class="demo-label">hairline</div><div class="ai-divider ai-divider--hairline"></div>' +
      '<div class="demo-label">wave-yellow</div><div class="ai-divider ai-divider--wave-yellow"></div>' +
      '<div class="demo-label">squiggle</div><div class="ai-divider ai-divider--squiggle"></div>' +
      '<div class="demo-label">ocean-wave（双层海浪）</div><div id="divider-ocean"></div>' +
      '<div class="demo-label">icon（图标 + 连接线循环铺满）</div><div id="divider-icon"></div>' +
      codeL('<div class="ai-divider"></div>\n<div class="ai-divider ai-divider--thin"></div>\n<div class="ai-divider ai-divider--hairline"></div>\n<div class="ai-divider ai-divider--wave-yellow"></div>\n<div class="ai-divider ai-divider--squiggle"></div>') +
      apiT([
        ['type', '分隔线类型', "'dashed-brown'|'thin'|'hairline'|'wave-yellow'|'squiggle'|'ocean-wave'", "'dashed-brown'"],
        ['animated', '海浪动画；0% / 100% 自动静止', 'boolean', 'true'],
        ['icon', '图标节点，传入后循环铺满', 'ReactNode', '-'],
        ['iconSize', '图标尺寸', 'number', '24'],
        ['iconGap', '图标间距', 'number', '8']
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
    var arrow = '<span class="ai-select__arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    var fishOptions = [
      ['fish1', '鲈鱼'], ['fish2', '鲷鱼'], ['fish3', '草鱼'], ['fish4', '龙睛鱼'], ['fish5', '神仙鱼']
    ];
    var flowerOptions = [
      ['flower1', '樱花'], ['flower2', '玫瑰'], ['flower3', '向日葵'], ['flower4', '薰衣草'], ['flower5', '郁金香']
    ];
    var fruitOptions = [
      ['fruit1', '草莓'], ['fruit2', '蓝莓'], ['fruit3', '桃子'], ['fruit4', '樱桃'], ['fruit5', '猕猴桃']
    ];

    var select = function (id, opts) {
      var placeholder = opts.placeholder || '请选择';
      var attrs = ' id="' + id + '" data-placeholder="' + placeholder + '"';
      if (opts.group) attrs += ' data-select-group="' + opts.group + '"';
      if (opts.value) attrs += ' data-value="' + opts.value + '"';
      if (opts.variant === 'game') attrs += ' data-variant="game"';
      if (opts.allowClear) attrs += ' data-allow-clear="true"';
      if (opts.showSearch) attrs += ' data-show-search="true"';
      if (opts.clearAriaLabel) attrs += ' data-clear-aria-label="' + opts.clearAriaLabel + '"';
      return '<div class="ai-select' + (opts.disabled ? ' ai-select--disabled' : '') + '"' + attrs + '>' +
        '<div class="ai-select__trigger">' +
          '<span class="ai-select__placeholder">' + placeholder + '</span>' +
          '<span class="ai-select__value" style="display:none"></span>' +
          arrow +
        '</div>' +
        '<div class="ai-select__dropdown" style="display:none">' +
          opts.options.map(function (o) {
            return '<div class="ai-select__option" data-key="' + o[0] + '">' +
              '<span class="ai-select__option-dot"></span>' +
              '<span class="ai-select__option-label">' + o[1] + '</span>' +
              '<div class="ai-select__pill" style="display:none"></div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    };

    return '<div class="demo-section">' +
      '<div class="demo-section-title">Select <span class="demo-tag">基础用法</span></div>' +
      '<div class="demo-label">variant 弹出方式</div>' +
      '<div class="demo-box" style="display:flex;gap:48px;flex-wrap:wrap;align-items:center">' +
        '<div><span class="demo-tag">default（默认）</span><div style="margin-top:10px">' +
          select('select-fish-variant', { options: fishOptions, value: 'fish1', group: 'fish' }) +
        '</div></div>' +
        '<div><span class="demo-tag">game</span><div style="margin-top:10px">' +
          select('select-fruit-game', { options: fruitOptions, value: 'fruit2', group: 'fruitGame', variant: 'game' }) +
        '</div></div>' +
      '</div>' +
      '<div class="demo-label">默认状态</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前选中: <span style="color:#19c8b9;font-weight:600" id="select-value">鲈鱼</span></div>' +
      '<div class="demo-box">' +
        select('select-fish-default', { options: fishOptions, value: 'fish1', group: 'fish' }) +
      '</div>' +
      '<div class="demo-label">自定义占位文本</div>' +
      '<div class="demo-dashed-box">' +
        select('select-flower-placeholder', { options: flowerOptions, placeholder: '请选择花朵' }) +
        select('select-fruit-placeholder', { options: fruitOptions, placeholder: '请选择水果', variant: 'game' }) +
      '</div>' +
      '<div class="demo-label">禁用状态</div>' +
      '<div class="demo-box">' +
        select('select-flower-disabled', { options: flowerOptions, value: 'flower2', disabled: true }) +
      '</div>' +
      '<div class="demo-label">allowClear 一键清空</div>' +
      '<div class="demo-box" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">' +
        select('select-fish-clear', { options: fishOptions, value: 'fish3', allowClear: true }) +
        select('select-flower-clear', { options: flowerOptions, value: 'flower4', allowClear: true, clearAriaLabel: '清除已选花朵' }) +
      '</div>' +
      '<div class="demo-label">showSearch 输入关键字过滤</div>' +
      '<div class="demo-box" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">' +
        select('select-fish-search', { options: fishOptions, showSearch: true, placeholder: '搜索鱼类' }) +
        select('select-fruit-search', { options: fruitOptions, showSearch: true, placeholder: '搜索水果' }) +
      '</div>' +
      codeL('<div class="ai-select" data-placeholder="请选择">\n  <div class="ai-select__trigger">\n    <span class="ai-select__placeholder">请选择</span>\n    <span class="ai-select__value" style="display:none"></span>\n    <span class="ai-select__arrow">▼</span>\n  </div>\n  <div class="ai-select__dropdown" style="display:none">\n    <div class="ai-select__option" data-key="fish1">\n      <span class="ai-select__option-label">鲈鱼</span>\n    </div>\n  </div>\n</div>\n\nnew AI.Select(el, {\n  value: "fish1",\n  allowClear: true,             // 一键清空\n  clearAriaLabel: "清除已选",    // 清除按钮无障碍标签\n  showSearch: true,              // 触发区内输入过滤（默认按 label 匹配）\n  variant: "game",               // default 正下方 / game 贴侧边\n  onChange: function (key) { /* ... */ },\n  onClear: function () { /* ... */ },\n  onSearch: function (query) { /* ... */ }\n});') +
      apiT([
        ['options', '选项列表', 'SelectOption[]', '-', 1],
        ['value', '当前选中值', 'string', '-', 1],
        ['onChange', '选中变化回调', '(key: string) => void', '-', 1],
        ['placeholder', '占位文本', 'string', "'请选择'"],
        ['disabled', '禁用状态', 'boolean', 'false'],
        ['variant', '下拉弹出方式：default 常规正下方（空间不足翻到正上方）、game 贴触发区侧边', "'default' | 'game'", "'default'"],
        ['allowClear', '允许一键清空', 'boolean', 'false'],
        ['onClear', '清空回调', '() => void', '-'],
        ['clearAriaLabel', '清除按钮的无障碍标签', 'string', "'清除'"],
        ['showSearch', '允许在触发区内输入关键字过滤', 'boolean', 'false'],
        ['filterOption', '过滤规则：true 按 optionFilterProp 匹配、false 不过滤、函数则自行判定', 'boolean | ((inputValue, option) => boolean)', 'true'],
        ['optionFilterProp', '参与匹配的字段', "'key' | 'label'", "'label'"],
        ['onSearch', '搜索词变化回调', '(value: string) => void', '-'],
        ['notFoundContent', '无匹配选项时展示的内容', 'ReactNode', "'暂无数据'"]
      ]) +
    '</div>';
  };

  // -- Checkbox --
  DEMOS.checkbox = function () {
    var ck = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var item = function (label, value, o) {
      o = o || {};
      var cls = 'ai-checkbox-item ai-checkbox-item--' + (o.size || 'md') +
        (o.checked ? ' ai-checkbox-item--checked' : '') +
        (o.disabled ? ' ai-checkbox-item--disabled' : '');
      return '<label class="' + cls + '" data-value="' + value + '">' +
        '<span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:' + (o.checked ? 'flex' : 'none') + '">' + ck + '</span></span>' +
        '<span class="ai-checkbox-label">' + label + '</span>' +
      '</label>';
    };
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Checkbox <span class="demo-tag">基础用法</span></div>' +
      '<div class="demo-label">默认水平排列（受控）</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">已选中：<span id="checkbox-echo" style="color:#19c8b9;font-weight:600">海滩、花园</span></div>' +
      '<div class="demo-box">' +
        '<div id="checkbox-controlled" class="ai-checkbox-group" style="gap:20px">' +
          item('海滩', 'beach', { checked: true }) +
          item('森林', 'forest') +
          item('花园', 'garden', { checked: true }) +
          item('村庄', 'village') +
        '</div>' +
      '</div>' +
      '<div class="demo-label">垂直排列 + 含禁用选项</div>' +
      '<div class="demo-box">' +
        '<div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--vertical" style="gap:12px">' +
          item('蝴蝶', 'butterfly') +
          item('鲈鱼', 'bass') +
          item('螃蟹', 'crab', { disabled: true }) +
          item('毛毛虫', 'caterpillar') +
          item('水母', 'jellyfish') +
        '</div>' +
      '</div>' +
      '<div class="demo-label">小尺寸</div>' +
      '<div class="demo-box"><div data-ai="checkbox" class="ai-checkbox-group">' +
        item('海滩', 'beach', { size: 'sm' }) + item('森林', 'forest', { size: 'sm', checked: true }) + item('花园', 'garden', { size: 'sm' }) + item('村庄', 'village', { size: 'sm' }) +
      '</div></div>' +
      '<div class="demo-label">中尺寸（默认）</div>' +
      '<div class="demo-box"><div data-ai="checkbox" class="ai-checkbox-group">' +
        item('海滩', 'beach', { size: 'md', checked: true }) + item('森林', 'forest', { size: 'md' }) + item('花园', 'garden', { size: 'md' }) + item('村庄', 'village', { size: 'md' }) +
      '</div></div>' +
      '<div class="demo-label">大尺寸</div>' +
      '<div class="demo-box"><div data-ai="checkbox" class="ai-checkbox-group">' +
        item('海滩', 'beach', { size: 'lg', checked: true }) + item('森林', 'forest', { size: 'lg' }) + item('花园', 'garden', { size: 'lg' }) +
      '</div></div>' +
      '<div class="demo-label">全部禁用</div>' +
      '<div class="demo-box"><div data-ai="checkbox" class="ai-checkbox-group ai-checkbox-group--disabled">' +
        item('海滩', 'beach') + item('森林', 'forest') + item('花园', 'garden', { checked: true }) + item('村庄', 'village', { checked: true }) +
      '</div></div>' +
      codeL('<div class="ai-checkbox-group" data-ai="checkbox">\n  <label class="ai-checkbox-item ai-checkbox-item--md ai-checkbox-item--checked" data-value="beach">\n    <span class="ai-checkbox-box">\n      <span class="ai-checkbox-checkmark">✓</span>\n    </span>\n    <span class="ai-checkbox-label">海滩</span>\n  </label>\n  <label class="ai-checkbox-item ai-checkbox-item--md" data-value="forest">\n    ...\n  </label>\n</div>\n\n// 受控 + 垂直排列 + 单选禁用\nnew AI.Checkbox(el, {\n  value: ["beach", "garden"],\n  direction: "vertical",\n  onChange: function (values) { /* ... */ }\n});') +
      apiT([
        ['options', '选项列表', 'CheckboxOption[]', '-', 1],
        ['value', '受控选中值列表', 'Array<string | number>', '-'],
        ['defaultValue', '默认选中值列表', 'Array<string | number>', '[]'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['disabled', '禁用全部选项', 'boolean', 'false'],
        ['direction', '排列方向', "'horizontal' | 'vertical'", "'horizontal'"],
        ['onChange', '选中值变化回调', '(values: Array<string | number>) => void', '-'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'inline style', '-']
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
      '<div class="demo-section-title">Footer <span class="demo-tag">版权栏</span></div>' +
      '<div class="demo-label">基础用法 — 默认文案 + 当前年份</div>' +
      '<div class="demo-box"><div class="ai-footer">© 2026 All Rights Reserved.</div></div>' +
      '<div class="demo-label">自定义文案与年份</div>' +
      '<div class="demo-box"><div class="ai-footer">© 2024 无人岛工作室 · 岛屿设计部</div></div>' +
      '<div class="demo-label">JS API</div>' +
      '<div class="demo-box" id="footer-js-mount"></div>' +
      codeL('<div class="ai-footer">© 2026 All Rights Reserved.</div>\n// 或用 JS 工厂方法\nvar footer = AI.Footer({ year: 2024, text: "无人岛工作室" });\ndocument.body.appendChild(footer);') +
      apiT([
        ['text', '版权文案', 'string', "'All Rights Reserved.'"],
        ['year', '年份，默认取当前年份', 'number', '当前年份'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'CSSProperties', '-']
      ]) +
    '</div>';
  };

  // -- CodeBlock --
  DEMOS.codeblock = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">CodeBlock <span class="demo-tag">代码高亮</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div class="demo-box"><pre class="ai-code-block">import { Button, Card } from \'animal-island-ui\';\n\nfunction App() {\n  return (\n    &lt;div&gt;\n      &lt;Button type="primary"&gt;Hello Island&lt;/Button&gt;\n      &lt;Card color="app-blue"&gt;Welcome!&lt;/Card&gt;\n    &lt;/div&gt;\n  );\n}</pre></div>' +
      '<div class="demo-label">关闭复制功能</div>' +
      '<div class="demo-box"><pre class="ai-code-block" data-copyable="false">const copyButton = false;</pre></div>' +
      '<div class="demo-label">复制成功回调 onCopy</div>' +
      '<div class="demo-box"><div id="codeblock-copy-demo"></div><div class="demo-label" id="codeblock-copy-status" style="margin:8px 0 0">尚未复制</div></div>' +
      '<div class="demo-label">自定义样式</div>' +
      '<div class="demo-box"><pre class="ai-code-block" style="border-radius:5px;background-color:#242c46ff">const greeting = "Hello Island!";\nconsole.log(greeting);</pre></div>' +
      codeL('<pre class="ai-code-block">const msg = "Hello";\nconsole.log(msg);</pre>\n\n// 关闭复制按钮\n<pre class="ai-code-block" data-copyable="false">const x = 42;</pre>\n\n<!-- 自定义样式 -->\n<pre class="ai-code-block"\n  style="border-radius:5px;background-color:#242c46ff">\n  const x = 42;\n</pre>') +
      apiT([
        ['code', '代码字符串', 'textContent / data-code', '-', 1],
        ['style', '自定义样式', 'inline style', '-'],
        ['className', '自定义类名', 'class attribute', '-'],
        ['copyable', '是否显示复制按钮', 'boolean（data-copyable="false" 关闭）', 'true'],
        ['onCopy', '复制成功回调', '(code: string) => void', '-']
      ]) +
    '</div>';
  };

  // -- Loading --
  DEMOS.loading = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Loading <span class="demo-tag">全屏落雪</span><span class="demo-tag">圆形扩散展开</span><span class="demo-tag">渐变消失</span></div>' +
      '<div class="demo-label">形态切换 — type="snow" 是全屏落雪，type="circle" 关闭时从中心圆形扩散展开，右下角有一艘随波逐流的帆船。</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" data-load-type="snow">落雪型</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="circle">圆形展开型</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="circle" data-load-tip="正在驶向岛屿…">圆形展开型 · 带提示文字</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="circle" data-load-boat="false">圆形展开型 · 不显示帆船</button>' +
      '</div>' +
      '<div class="demo-label">基础播放 — 点击后全屏落雪覆盖 2.4s，结束时渐变消失</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow">纯落雪</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow" data-load-tip="正在连接岛屿…">带提示文字</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow" data-load-tip="等雪停…" data-load-delay="300">delay 300ms</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow" data-load-tip="慢速渐隐" data-load-fade="1.2">fadeDuration 1.2s</button>' +
      '</div>' +
      '<div class="demo-label">delay 防闪烁 — 快速结束时（600ms 模拟加载）无 delay 的落雪会闪一下，delay 300ms 的几乎不出现</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow" data-load-tip="无 delay" data-load-duration="600">模拟 600ms 加载（无 delay）</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" data-load-type="snow" data-load-tip="delay 300ms" data-load-delay="300" data-load-duration="600">模拟 600ms 加载（delay 300ms）</button>' +
      '</div>' +
      '<div id="loading-demo"></div>' +
      codeL('var loading = new AnimalIsland.Loading(\n  document.getElementById("loading-demo"),\n  { active: true, type: "snow" }\n);\n\n// 圆形扩散展开 + 提示文字\nnew AnimalIsland.Loading(el, {\n  active: true,\n  type: "circle",\n  tip: "正在驶向岛屿…"\n});\n\n// 切换状态\nloading.setActive(false);') +
      apiT([
        ['type', "加载屏形态：snow / circle", "'snow' | 'circle'", "'snow'"],
        ['showBoat', 'circle 下是否显示帆船', 'boolean', 'true'],
        ['active', '是否开启加载屏', 'boolean', 'true'],
        ['tip', '中央提示文字', 'string', '-'],
        ['delay', '延迟显示（毫秒）', 'number', '0'],
        ['fadeDuration', '渐变消失时长（秒）', 'number', '0.6'],
        ['zIndex', '全屏层级', 'number', '3000'],
        ['setActive', '切换激活状态', 'function(boolean)', '-']
      ]) +
    '</div>';
  };

  // -- Table --
  DEMOS.table = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Table <span class="demo-tag">表格</span></div>' +
      '<div class="demo-label">数据表格组件，支持斑马纹、边框、加载状态等常用功能。</div>' +
      '<div style="margin-bottom:16px;display:flex;gap:16px;flex-wrap:wrap">' +
        '<button class="ai-btn ai-btn--primary" id="table-stripe-btn">斑马纹 ✓</button>' +
        '<button class="ai-btn ai-btn--primary" id="table-loading-btn">模拟加载</button>' +
      '</div>' +
      '<div style="overflow:hidden" id="table-basic"></div>' +
      '<div class="demo-label">内置分页（pagination 属性，客户端分页）</div>' +
      '<div style="overflow:hidden" id="table-paged"></div>' +
      codeL([
        "import React, { useState } from 'react';",
        "import { Table } from 'animal-island-ui';",
        "",
        "interface Person {",
        "    key: string;",
        "    name: string;",
        "    age: number;",
        "    island: string;",
        "    fruit: string;",
        "    hobby: string;",
        "}",
        "",
        "const columns = [",
        "    {",
        "        title: '岛民',",
        "        dataIndex: 'name',",
        "        width: 120,",
        "    },",
        "    {",
        "        title: '年龄',",
        "        dataIndex: 'age',",
        "        width: 80,",
        "        align: 'center',",
        "    },",
        "    {",
        "        title: '岛屿',",
        "        dataIndex: 'island',",
        "    },",
        "    {",
        "        title: '喜欢的水果',",
        "        dataIndex: 'fruit',",
        "    },",
        "    {",
        "        title: '爱好',",
        "        dataIndex: 'hobby',",
        "        render: (value) => (",
        "            <span style={{",
        "                padding: '4px 12px',",
        "                background: '#e0f7f4',",
        "                borderRadius: 20,",
        "                color: '#129a8e',",
        "            }}>",
        "                {value}",
        "            </span>",
        "        ),",
        "    },",
        "];",
        "",
        "const data = [",
        "    { key: '1', name: 'Mochi', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },",
        "    { key: '2', name: 'Pudding', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },",
        "    { key: '3', name: 'Cream', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },",
        "];",
        "",
        "const App = () => {",
        "    const [striped, setStriped] = useState(true);",
        "",
        "    return (",
        "        <Table",
        "            columns={columns}",
        "            dataSource={data}",
        "            striped={striped}",
        "        />",
        "    );",
        "};"
      ].join('\n')) +
      apiT([
        ['columns', '表格列配置', 'TableColumn[]', '[]'],
        ['dataSource', '表格数据源', 'T[]', '[]'],
        ['rowKey', '行唯一标识字段名或函数', 'string | (record) => string', 'key'],
        ['striped', '是否显示斑马纹', 'boolean', 'true'],
        ['showHeader', '是否显示表头', 'boolean', 'true'],
        ['loading', '加载状态', 'boolean', 'false'],
        ['emptyText', '空数据显示文本', 'ReactNode', '暂无数据'],
        ['pagination', '分页配置，传入对象开启客户端分页（透传 Pagination 属性）', 'false | PaginationProps', 'false'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'CSSProperties', '-']
      ]) +
    '</div>';
  };

  // -- Time --
  DEMOS.time = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Time <span class="demo-tag">实时时钟</span></div>' +
      '<div class="demo-label">HUD 风格的实时时钟卡片，实时显示星期、月日与 HH:MM，每秒自动刷新。</div>' +
      '<div class="demo-box"><div id="time-default"></div></div>' +
      '<div class="demo-label">中文日期：locale: "zh-cn"（内置，无需额外注册）</div>' +
      '<div class="demo-box"><div id="time-zh"></div></div>' +
      '<div class="demo-label">用 dayjs token 定制星期与月日</div>' +
      '<div class="demo-box" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">' +
        '<div id="time-fmt-en"></div>' +
        '<div id="time-fmt-zh"></div>' +
      '</div>' +
      '<div class="demo-label">搭配 className 自定义：className 合并到根节点，用 CSS 变量换色并覆盖背景、描边与字体</div>' +
      '<style>' +
        '.my-time {' +
          '--ai-text: #fffdf4;' +
          '--ai-text-disabled: #e0bd75;' +
          '--ai-primary: #ffd166;' +
          '--ai-primary-bg: #3d2a17;' +
          '--ai-font-family: "Noto Sans SC", "Nunito", sans-serif;' +
          '--ai-font-size-sm: 15px;' +
          'background: linear-gradient(160deg, #0f4c46 0%, #137f74 55%, #19c8b9 100%);' +
          'border-radius: 28px;' +
          'padding: 24px 36px 18px;' +
          'box-shadow: 0 14px 30px rgba(15, 76, 70, 0.28);' +
        '}' +
      '</style>' +
      '<div class="demo-box"><div id="time-custom" class="my-time" aria-label="岛屿时间"></div></div>' +
      codeL(
        '<div id="time"></div>\n' +
        'new AI.Time(document.getElementById("time"));\n\n' +
        '// 中文日期\n' +
        'new AI.Time(el, { locale: "zh-cn" });\n\n' +
        '// dayjs token 定制\n' +
        'new AI.Time(el, { weekdayFormat: "ddd", dateFormat: "YYYY/MM/DD" });\n' +
        'new AI.Time(el, { locale: "zh-cn", weekdayFormat: "ddd", dateFormat: "YYYY年M月D日" });\n\n' +
        '// className 合并到根节点，可配合 CSS 变量换肤\n' +
        'new AI.Time(el, { className: "my-time" });'
      ) +
      '<span class="code-label">自定义样式由使用方在 CSS 中提供</span>' +
      '<pre class="ai-code-block" style="border-radius:0 20px 20px 20px;margin-top:0">' +
        AI.CodeBlock.highlight(
          '.my-time {\n' +
          '  /* 覆盖 Time 使用的设计变量：时钟/日期颜色、日期字号、字体 */\n' +
          '  --ai-text: #fffdf4;\n' +
          '  --ai-text-disabled: #e0bd75;\n' +
          '  --ai-primary: #ffd166;\n' +
          '  --ai-primary-bg: #3d2a17;\n' +
          '  --ai-font-family: "Noto Sans SC", "Nunito", sans-serif;\n' +
          '  --ai-font-size-sm: 15px;\n\n' +
          '  background: linear-gradient(160deg, #0f4c46 0%, #137f74 55%, #19c8b9 100%);\n' +
          '  border-radius: 28px;\n' +
          '  padding: 24px 36px 18px;\n' +
          '  box-shadow: 0 14px 30px rgba(15, 76, 70, 0.28);\n' +
          '}'
        ) +
      '</pre>' +
      apiT([
        ['weekdayFormat', '星期格式（dayjs 核心 token）', 'string', "'dddd'"],
        ['dateFormat', '月日格式（dayjs 核心 token）', 'string', "'MMM D'（zh-cn 下 'M月D日'）"],
        ['locale', '日期行语言', "'en' | 'zh-cn'", "'en'"],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义内联样式', 'object', '-']
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
    var colorRows = ['soft', 'solid', 'outlined', 'dashed'].map(function (v) {
      var row = '<div class="demo-label">color 颜色（' + v + '）</div><div class="demo-row" style="flex-wrap:wrap;gap:8px">';
      colors.forEach(function (c) {
        var cls = 'ai-tag ai-tag--md ai-tag--' + v + (c !== 'default' ? ' ai-tag--' + c : '');
        row += '<span class="' + cls + '" data-ai="tag"><span class="ai-tag__text">' + (c === 'default' ? 'default' : c) + '</span></span>';
      });
      row += '</div>';
      return row;
    }).join('');
    var flame = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle" aria-hidden="true">' +
      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>' +
    '</svg>';
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Tag <span class="demo-tag">4 variants</span> <span class="demo-tag">16 colors</span> <span class="demo-tag">3 sizes</span></div>' +
      '<div class="demo-label">variant 风格变体</div>' +
      '<div class="demo-row" style="flex-wrap:wrap;gap:8px;align-items:center">' +
        '<span class="ai-tag ai-tag--md ai-tag--solid" data-ai="tag"><span class="ai-tag__text">solid</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--outlined ai-tag--app-blue" data-ai="tag"><span class="ai-tag__text">outlined</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-green" data-ai="tag"><span class="ai-tag__text">soft</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--dashed ai-tag--app-orange" data-ai="tag"><span class="ai-tag__text">dashed</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-red" data-ai="tag"><span class="ai-tag__text">' + flame + ' hot</span></span>' +
      '</div>' +
      '<div class="demo-label">size 尺寸</div>' +
      '<div class="demo-row" style="gap:8px">' +
        '<span class="ai-tag ai-tag--sm ai-tag--solid ai-tag--app-blue" data-ai="tag"><span class="ai-tag__text">small</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-blue" data-ai="tag"><span class="ai-tag__text">medium</span></span>' +
        '<span class="ai-tag ai-tag--lg ai-tag--solid ai-tag--app-blue" data-ai="tag"><span class="ai-tag__text">large</span></span>' +
      '</div>' +
      colorRows +
      '<div class="demo-label">closable 可关闭</div>' +
      '<div class="demo-row" id="tag-closable-list" style="flex-wrap:wrap;gap:8px;min-height:30px"></div>' +
      '<div class="demo-label">onClick 可点击（hover + 键盘 Enter / Space 触发）</div>' +
      '<div class="demo-row" style="gap:8px;align-items:center">' +
        '<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-blue ai-tag--clickable" data-ai="tag" tabindex="0" data-on-click="alert(\'点了 Tag\')"><span class="ai-tag__text">可点击</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--outlined ai-tag--app-green ai-tag--clickable" data-ai="tag" tabindex="0" data-on-click="alert(\'点了 outlined Tag\')"><span class="ai-tag__text">outlined 可点击</span></span>' +
        '<span class="ai-tag ai-tag--md ai-tag--brown ai-tag--disabled" data-ai="tag"><span class="ai-tag__text">disabled</span></span>' +
      '</div>' +
      codeL('<!-- 基础 -->\n<span class="ai-tag ai-tag--md ai-tag--solid ai-tag--app-pink" data-ai="tag">\n  <span class="ai-tag__text">app-pink</span>\n</span>\n\n<!-- 风格变体 -->\n<span class="ai-tag ai-tag--md ai-tag--outlined ai-tag--purple" data-ai="tag">outlined</span>\n<span class="ai-tag ai-tag--md ai-tag--dashed ai-tag--app-orange" data-ai="tag">dashed</span>\n<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-teal" data-ai="tag">soft</span>\n\n<!-- 可关闭：JS API 决定是否移除 -->\n<span class="ai-tag ai-tag--md ai-tag--soft ai-tag--app-pink" id="fruit-tag">\n  <span class="ai-tag__text">Apple</span>\n  <button class="ai-tag__close" aria-label="close">×</button>\n</span>\nnew AI.Tag(el, { onClose: function () { el.remove(); } });\n\n<!-- 可点击 / 禁用 -->\n<span class="ai-tag ai-tag--md ai-tag--clickable" data-ai="tag" data-on-click="alert(1)">可点击</span>\n<span class="ai-tag ai-tag--md ai-tag--disabled" data-ai="tag">disabled</span>') +
      apiT([
        ['children', '标签内容', 'textContent', '-', 1],
        ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
        ['variant', '风格变体', "'solid' | 'outlined' | 'dashed' | 'soft'", "'solid'"],
        ['color', '颜色（与 Card 同款 13 色调色板）', "'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'", "'default'"],
        ['closable', '是否可关闭', 'boolean（含 .ai-tag__close 即视为可关闭）', 'false'],
        ['onClose', '关闭回调', '(e: MouseEvent) => void', '-'],
        ['onClick', '点击回调（开启后标签可点击）', '(e: MouseEvent) => void', '-'],
        ['disabled', '禁用', 'boolean', 'false'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'inline style', '-']
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
      '<div class="demo-section-title">Title <span class="demo-tag">ribbon</span> <span class="demo-tag">layer</span> <span class="demo-tag">tab</span></div>' +
      '<div class="demo-label">variant — 飘带 / 双层纸 / 折角便签</div>' +
      '<div class="demo-row" style="flex-wrap:wrap;gap:28px;align-items:center">' +
        '<span class="ai-title ai-title--md ai-title--app-teal"><span class="ai-title__ribbon"><span class="ai-title__back ai-title__back--left" aria-hidden="true"></span><span class="ai-title__back ai-title__back--right" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--left" aria-hidden="true"></span><span class="ai-title__fold ai-title__fold--right" aria-hidden="true"></span><span class="ai-title__front" aria-hidden="true"></span><span class="ai-title__text">Ribbon 飘带</span></span></span>' +
        '<span class="ai-title ai-title--md ai-title--app-blue"><span class="ai-title__layer"><span class="ai-title__layer-front">Layer 双层纸</span></span></span>' +
        '<span class="ai-title ai-title--md ai-title--app-orange"><span class="ai-title__tab"><span class="ai-title__tab-text">Tab 折角</span></span></span>' +
      '</div>' +
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
        ['variant', '样式：ribbon 飘带 / layer 双层纸 / tab 折角便签', "'ribbon'|'layer'|'tab'", "'ribbon'"],
        ['ai-title--sm/md/lg', '尺寸 14 / 20 / 28px', 'class', 'md'],
        ['ai-title--{color}', '配色：default/app-pink/... 12 种', 'class', 'default'],
        ['AI.Title({variant, size, color, text})', 'JS 工厂方法（返回 DOM 元素）', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Skeleton --
  function skeletonCard(label, body) {
    return '<div style="width:240px;padding:20px;border-radius:20px;background:#fafaf5;border:1.5px solid #e8dcc8">' +
      '<div style="font-size:13px;font-weight:600;color:#9f927d;margin-bottom:12px">' + label + '</div>' +
      body +
    '</div>';
  }

  function skeletonSubCards(loading) {
    var sk = function (w, h, radius) {
      return '<div class="ai-skeleton ai-skeleton--active" style="width:' + w + 'px;height:' + h + 'px;border-radius:' + radius + ';flex-shrink:0"></div>';
    };
    return skeletonCard('Button', loading
        ? sk(100, 45, '50px')
        : '<button class="ai-btn">加载完成</button>') +
      skeletonCard('Input', loading
        ? sk(200, 40, '50px')
        : '<div style="color:#725d42;font-size:14px">输入框已加载</div>') +
      skeletonCard('Avatar', loading
        ? '<div style="display:flex;gap:8px">' + sk(32, 32, '50%') + sk(44, 44, '50%') + sk(56, 56, '50%') + '</div>'
        : '<span style="color:#725d42;font-size:14px">头像已加载</span>');
  }

  DEMOS.skeleton = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Skeleton <span class="demo-tag">骨架屏</span> <span class="demo-tag">加载占位</span></div>' +
      '<div class="demo-label">loading 切换</div>' +
      '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">' +
        '<button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" id="skeleton-switch"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button>' +
        '<span style="font-size:13px;color:#725d42" id="skeleton-status">加载中</span>' +
      '</div>' +
      '<div class="demo-label">variant — 四种变体</div>' +
      '<div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap">' +
        skeletonCard('text',
          '<div data-ai="skeleton" data-variant="text" data-width="100%"></div>' +
          '<div data-ai="skeleton" data-variant="text" data-width="80%"></div>' +
          '<div data-ai="skeleton" data-variant="text" data-width="60%"></div>') +
        skeletonCard('circle', '<div data-ai="skeleton" data-variant="circle" data-width-value="56"></div>') +
        skeletonCard('rect', '<div data-ai="skeleton" data-variant="rect" data-width-value="200" data-height-value="120"></div>') +
        skeletonCard('paragraph', '<div data-ai="skeleton" data-variant="paragraph" data-rows="4"></div>') +
      '</div>' +
      '<div class="demo-label">Skeleton.Button / Skeleton.Input / Skeleton.Avatar</div>' +
      '<div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap" id="skeleton-sub">' + skeletonSubCards(true) + '</div>' +
      '<div class="demo-label">loading=false 时直接渲染 children</div>' +
      '<div style="padding:12px;background:#e6f9f6;border-radius:12px;color:#19c8b9;font-weight:600">内容已加载，骨架屏自动隐藏</div>' +
      codeL('import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from \'animal-island-ui\';\n\n// 文字骨架\n<Skeleton variant="text" width="100%" />\n\n// 圆形骨架\n<Skeleton variant="circle" widthValue={56} />\n\n// 矩形骨架\n<Skeleton variant="rect" widthValue={200} heightValue={120} />\n\n// 段落骨架\n<Skeleton variant="paragraph" rows={4} />\n\n// 子组件骨架\n<SkeletonButton size="middle" />\n<SkeletonInput size="large" />\n<SkeletonAvatar size="middle" />\n\n// loading 模式\n<Skeleton loading={loading}>\n    <div>内容已加载</div>\n</Skeleton>') +
      apiT([
        ['loading', '是否显示骨架屏', 'boolean', 'true'],
        ['variant', '变体', "'text' | 'circle' | 'rect' | 'paragraph'", "'text'"],
        ['active', '是否启用流光动画', 'boolean', 'true'],
        ['rows', '行数（paragraph 模式）', 'number', '3'],
        ['width', '宽度（text/circle/rect 模式）', 'number | string', '100%'],
        ['rowWidths', '每行宽度数组（paragraph 模式）', '(number | string)[]', '-'],
        ['widthValue', '宽（circle/rect 有效）', 'number | string', '-'],
        ['heightValue', '高（circle/rect 有效）', 'number | string', '-'],
        ['children', 'loading=false 时渲染的内容', 'ReactNode', '-']
      ]) +
    '</div>';
  };

  // -- Progress --
  DEMOS.progress = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Progress <span class="demo-tag">进度条</span><span class="demo-tag">场景图</span></div>' +
      '<div class="demo-label">经典场景 — 上传 / 经验 / 任务</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;max-width:720px;width:100%">' +
        '<div><div class="demo-label" style="font-size:12px;color:#9f927d;margin-bottom:4px;font-weight:600">岛屿截图上传</div>' +
          '<div id="progress-upload"></div>' +
          '<div style="margin-top:8px"><button class="ai-btn ai-btn--sm ai-btn--primary" id="progress-upload-btn">开始上传</button></div>' +
        '</div>' +
        '<div><div class="demo-label" style="font-size:12px;color:#9f927d;margin-bottom:4px;font-weight:600">岛屿评价经验</div>' +
          '<div id="progress-exp"></div>' +
          '<div style="margin-top:8px;display:flex;gap:8px">' +
            '<button class="ai-btn ai-btn--sm ai-btn--default" data-exp-delta="-10">−10</button>' +
            '<button class="ai-btn ai-btn--sm ai-btn--default" data-exp-delta="10">+10</button>' +
          '</div>' +
        '</div>' +
        '<div><div class="demo-label" style="font-size:12px;color:#9f927d;margin-bottom:4px;font-weight:600">今日 DIY 任务</div>' +
          '<div id="progress-task"></div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;max-width:720px;width:100%">' +
        '<div id="progress-basic-25"></div><div id="progress-basic-50"></div><div id="progress-basic-100"></div>' +
      '</div>' +
      '<div class="demo-label">size — 三档尺寸</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;max-width:720px;width:100%">' +
        '<div id="progress-size-sm"></div><div id="progress-size-md"></div><div id="progress-size-lg"></div>' +
      '</div>' +
      '<div class="demo-label">variant — fill 背景场景图（当前进度区域显示场景，从左揭开）</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;max-width:720px;width:100%">' +
        '<div id="progress-variant-sweet"></div><div id="progress-variant-forest"></div>' +
        '<div id="progress-variant-starry"></div><div id="progress-variant-coffee"></div>' +
      '</div>' +
      '<div class="demo-label">受控 — 滑块驱动 percent (0–100, 自动 clamp)</div>' +
      '<div style="display:flex;align-items:center;gap:12px;max-width:720px;width:100%;margin-bottom:8px">' +
        '<span style="min-width:56px;font-size:13px;color:#725d42;font-weight:600">percent:</span>' +
        '<input type="range" min="0" max="100" value="45" id="progress-range" style="flex:1;accent-color:#725d42">' +
        '<span id="progress-range-value" style="min-width:48px;text-align:right;font-weight:700;color:#19c8b9">45%</span>' +
      '</div>' +
      '<div id="progress-slider" style="max-width:720px;width:100%"></div>' +
      '<div class="demo-label">duration=0 — 关闭 fill 宽度动画</div>' +
      '<div id="progress-noanim" style="max-width:720px;width:100%"></div>' +
      '<div class="demo-label">showInfo=false — 只渲染条, 不带文字</div>' +
      '<div id="progress-noinfo" style="max-width:720px;width:100%"></div>' +
      '<div class="demo-label">新增示例：进度配色与海浪</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px">' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" data-appearance-percent="0">0%</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" data-appearance-percent="45">45%</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" data-appearance-percent="100">100%</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default" id="progress-wave-toggle">暂停海浪</button>' +
      '</div>' +
      '<div class="demo-label">自定义颜色，完成后保持原色</div>' +
      '<div style="display:grid;gap:14px;max-width:720px;width:100%">' +
        '<div id="progress-color-peach"></div><div id="progress-color-green"></div><div id="progress-color-purple"></div>' +
      '</div>' +
      '<div class="demo-label">海浪三档尺寸，0% / 100% 自动静止</div>' +
      '<div style="display:grid;gap:14px;max-width:720px;width:100%">' +
        '<div id="progress-wave-sm"></div><div id="progress-wave-md"></div><div id="progress-wave-lg"></div>' +
      '</div>' +
      codeL('var p = new AI.Progress(el, {\n  percent: 45,\n  variant: "forest-grove"\n});\np.setPercent(80);\n\n// 自定义颜色 + 海浪\nnew AI.Progress(el, { percent: 45, color: "#82d5bb", wave: true });') +
      apiT([
        ['percent', '当前百分比 (0-100, 自动 clamp)', 'number', '-'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['showInfo', '是否显示百分比文字（显示在进度条右侧）', 'boolean', 'true'],
        ['color', '填充颜色（支持 CSS 变量），保留高光；variant 优先', 'string', '薄荷渐变'],
        ['wave', '叠加双层海浪，可与颜色或场景图组合', 'boolean', 'false'],
        ['animated', '海浪动画；0% / 100% 自动静止', 'boolean', 'true'],
        ['variant', 'fill 背景场景图（优先于 color，从左揭开）', "'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break'", '薄荷渐变'],
        ['infoFormat', '自定义文字格式化', 'function(percent)', '"${percent}%"'],
        ['duration', 'fill 宽度动画时长(秒), 0 = 不动画', 'number', '0.6'],
        ['aria-label', '无可见标题时的无障碍标签', 'string', '-'],
        ['setPercent(n) / getPercent()', '更新 / 读取百分比', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Radio --
  DEMOS.radio = function () {
    var seasonOpts = JSON.stringify([
      { label: '春天', value: 'spring' },
      { label: '夏天', value: 'summer' },
      { label: '秋天', value: 'autumn' },
      { label: '冬天', value: 'winter' }
    ]);
    var fruitOpts = JSON.stringify([
      { label: '苹果', value: 'apple' },
      { label: '橙子', value: 'orange' },
      { label: '桃子', value: 'peach' },
      { label: '梨子', value: 'pear', disabled: true },
      { label: '樱桃', value: 'cherry' }
    ]);
    var timeOpts = JSON.stringify([
      { label: '早晨', value: 'morning' },
      { label: '中午', value: 'noon' },
      { label: '傍晚', value: 'evening' },
      { label: '深夜', value: 'night' }
    ]);
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Radio <span class="demo-tag">单选框</span></div>' +
      '<div class="demo-label">水平排列（受控）— 支持方向键 ↑↓←→ 切换</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">已选中：<span id="radio-season-echo" style="color:#19c8b9;font-weight:600">春天</span></div>' +
      '<div class="demo-box"><div id="radio-season"></div></div>' +
      '<div class="demo-label">垂直排列 + 含禁用选项</div>' +
      '<div class="demo-box"><div id="radio-fruit"></div></div>' +
      '<div class="demo-label">小尺寸</div>' +
      '<div class="demo-box"><div data-ai="radio" data-size="small" data-value="morning" data-options=\'' + timeOpts + '\'></div></div>' +
      '<div class="demo-label">中尺寸（默认）</div>' +
      '<div class="demo-box"><div data-ai="radio" data-size="middle" data-value="noon" data-options=\'' + timeOpts + '\'></div></div>' +
      '<div class="demo-label">大尺寸</div>' +
      '<div class="demo-box"><div data-ai="radio" data-size="large" data-value="night" data-options=\'' + timeOpts + '\'></div></div>' +
      '<div class="demo-label">3D 按键感 — 点击体验下压反馈</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">已选中：<span id="radio-press-echo" style="color:#19c8b9;font-weight:600">中午</span></div>' +
      '<div class="demo-box"><div id="radio-press"></div></div>' +
      '<div class="demo-label">全部禁用</div>' +
      '<div class="demo-box"><div data-ai="radio" data-size="middle" data-disabled="true" data-value="winter" data-options=\'' + seasonOpts + '\'></div></div>' +
      codeL('<div data-ai="radio" data-size="middle" data-value="spring"\n  data-options=\'[{"label":"春天","value":"spring"},{"label":"夏天","value":"summer"}]\'></div>\n\n// JS API：受控 / 垂直 / 单项禁用\nvar r = new AI.Radio(el, {\n  size: "middle",\n  direction: "vertical",\n  value: "spring",\n  options: [\n    { label: "春天", value: "spring" },\n    { label: "梨子", value: "pear", disabled: true }\n  ],\n  onChange: function (v) { console.log(v); }\n});\nr.getValue(); r.setValue("summer");') +
      apiT([
        ['options', '选项列表', 'RadioOption[]', '-', 1],
        ['value', '受控选中值', 'string | number', '-'],
        ['defaultValue', '默认选中值', 'string | number', '-'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['disabled', '禁用全部选项', 'boolean', 'false'],
        ['direction', '排列方向', "'horizontal' | 'vertical'", "'horizontal'"],
        ['onChange', '选中值变化回调', '(value: string | number) => void', '-'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'inline style', '-']
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
    var tip = function (title, placement, btnLabel, extra) {
      return '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="' + title + '" data-placement="' + placement + '"' + (extra || '') + '>' +
        '<button class="ai-btn ai-btn--sm ai-btn--default">' + btnLabel + '</button>' +
      '</span>';
    };
    var leftTitle = function (label) { return label + '<br>箭头在右侧<br>指向触发按钮'; };
    var rightTitle = function (label) { return label + '<br>箭头在左侧<br>指向触发按钮'; };
    var colStyle = 'display:flex;flex-direction:column;gap:12px;align-items:';
    var rowStyle = 'display:flex;gap:12px';
    var placementHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:12px">' +
        '<div style="' + rowStyle + '">' +
          tip('top-start', 'top-start', 'top-start') +
          tip('top', 'top', 'top') +
          tip('top-end', 'top-end', 'top-end') +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:48px">' +
          '<div style="' + colStyle + 'flex-start">' +
            tip(leftTitle('left-start'), 'left-start', 'left-start') +
            tip(leftTitle('left'), 'left', 'left') +
            tip(leftTitle('left-end'), 'left-end', 'left-end') +
          '</div>' +
          '<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#f0e8d8;color:#a0936e;font-size:12px;font-weight:600;text-align:center;line-height:1.3;flex-shrink:0">12<br>placements</div>' +
          '<div style="' + colStyle + 'flex-end">' +
            tip(rightTitle('right-start'), 'right-start', 'right-start') +
            tip(rightTitle('right'), 'right', 'right') +
            tip(rightTitle('right-end'), 'right-end', 'right-end') +
          '</div>' +
        '</div>' +
        '<div style="' + rowStyle + '">' +
          tip('bottom-start', 'bottom-start', 'bottom-start') +
          tip('bottom', 'bottom', 'bottom') +
          tip('bottom-end', 'bottom-end', 'bottom-end') +
        '</div>' +
      '</div>';
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Tooltip <span class="demo-tag">气泡提示</span></div>' +
      '<div class="demo-label">基础用法 — hover 触发</div>' +
      '<div class="demo-box"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        tip('提示文字', 'top', 'Hover 我') +
      '</div></div>' +
      '<div class="demo-label">风格 — island 不规则气泡</div>' +
      '<div class="demo-box" style="overflow:visible"><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">' +
        tip('标准矩形气泡', 'top', 'default', ' data-bordered="true"') +
        tip('无边框矩形', 'top', 'default 无边框', ' data-borderless="true"') +
        tip('钓到<span style="color:#d4834a">石头</span>了！<br>竟然连这种都能钓起来…', 'top', 'island 有边框', ' data-variant="island"') +
        tip('无边框有机气泡<br>圆点指示方向', 'top', 'island 无边框', ' data-variant="island" data-borderless="true"') +
      '</div></div>' +
      '<div class="demo-label">12 个方向</div>' +
      '<div class="demo-box" style="overflow:visible">' + placementHTML + '</div>' +
      '<div class="demo-label">触发方式 — click</div>' +
      '<div class="demo-box"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="点击触发，再点关闭" data-placement="bottom" data-trigger="click"><button class="ai-btn ai-btn--sm ai-btn--default">Click 触发</button></span>' +
      '</div></div>' +
      '<div class="demo-label">触发方式 — focus</div>' +
      '<div class="demo-box"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        '<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="聚焦时显示" data-placement="right" data-trigger="focus">' +
          '<input type="text" placeholder="点击输入框聚焦" style="padding:8px 16px;border-radius:50px;border:2px solid #c4b89e;background:rgb(247,243,223);font-family:inherit;font-size:14px;color:#725d42;outline:none">' +
        '</span>' +
      '</div></div>' +
      '<div class="demo-label">多行内容</div>' +
      '<div class="demo-box"><div style="display:flex;gap:16px;flex-wrap:wrap">' +
        tip('第一行文字<br>第二行文字<br>第三行文字', 'top', '多行 HTML') +
        tip('第一行\n第二行\n第三行', 'top', '换行符 \\n') +
        tip('这是一段比较长的提示文字，用来测试 Tooltip 的自动换行效果。当文字超过最大宽度时会自动换行。', 'top', '自动换行长文本') +
      '</div></div>' +
      codeL('<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="提示文本" data-placement="top">\n  <button class="ai-btn ai-btn--primary">Hover Me</button>\n</span>\n\n<!-- 多行 -->\n<span class="ai-tooltip-wrapper" data-ai="tooltip" data-title="第一行&lt;br&gt;第二行">\n  <button class="ai-btn">多行</button>\n</span>') +
      apiT([
        ['data-title', '提示内容，支持多行（可用 \\n 或 <br> 换行）', 'string', '-', 1],
        ['data-placement', '位置：top / top-start / top-end / bottom / bottom-start / bottom-end / left / left-start / left-end / right / right-start / right-end', 'string', "'top'"],
        ['data-trigger', '触发方式：hover / focus / click', 'string', "'hover'"],
        ['data-variant', '视觉风格：default / island', 'string', "'default'"],
        ['data-bordered', '是否显示边框（含箭头描边），data-borderless="true" 关闭', 'boolean', 'true'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'inline style', '-']
      ]) +
    '</div>';
  };

  // -- BackTop --
  DEMOS.backtop = function () {
    var PATTERNS = ['default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange', 'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'];
    var RESIDENTS = [
      ['小润', 'Xiaorun', '松鼠', '园艺', '热爱园艺的小松鼠，每天在广场上唱歌'],
      ['阿诚', 'Acheng', '猫', '钓鱼', '喜欢钓鱼的蓝色猫，经常在河边发呆'],
      ['莉莉安', 'Lilian', '兔子', '烹饪', '性格开朗的小兔子，总是带着胡萝卜'],
      ['熊大叔', 'Xiongda', '熊', '阅读', '爱读书的棕熊，知识渊博但有点害羞'],
      ['茉莉', 'Moli', '猫', '捉虫', '最喜欢的活动是捉虫和收集贝壳'],
      ['茶茶', 'Chacha', '鸭子', '唱歌', '嗓音甜美的小鸭子，岛上的明星歌手'],
      ['铁蛋', 'Tiedan', '鸡', '健身', '热爱运动的公鸡，每天早晨第一个起床'],
      ['雪花', 'Xuehua', '企鹅', '滑雪', '从南极来的小企鹅，喜欢在雪地里打滚'],
      ['小八', 'Xiaoba', '章鱼', '绘画', '多才多艺的小章鱼，触手就是画笔'],
      ['胖胖', 'Pangpang', '猪', '美食', '岛上的美食家，知道每一种水果的味道'],
      ['鹿鹿', 'Lulu', '鹿', '花卉', '优雅的小鹿，头上总是别着一朵花'],
      ['米米', 'Mimi', '老鼠', '收集', '喜欢收集各种坚果的小老鼠'],
      ['弗雷德', 'Frede', '狼', '天文', '夜晚观测星空的狼，知道每颗星星的名字'],
      ['贝蒂', 'Beidi', '绵羊', '编织', '心灵手巧的小绵羊，用羊毛织围巾'],
      ['大壮', 'Dazhuang', '牛', '农耕', '勤劳的奶牛，经营岛上最大的菜园'],
      ['跳跳', 'Tiaotiao', '青蛙', '跳跃', '蹦蹦跳跳的小青蛙，雨后最爱唱歌'],
      ['妮妮', 'Nini', '仓鼠', '园艺', '在花丛中安家的小仓鼠，笑容超治愈'],
      ['船长', 'Chuanzhang', '狗', '航海', '梦想成为航海家的狗狗，每天都在看海'],
      ['小霞', 'Xiaoxia', '火烈鸟', '跳舞', '舞姿优美的火烈鸟，岛上舞蹈老师'],
      ['墨墨', 'Momo', '乌贼', '书法', '爱好书法的乌贼，墨水从不缺'],
      ['糖糖', 'Tangtang', '猫熊', '甜品', '爱做甜品的小熊猫，竹叶蛋糕是招牌'],
      ['小武', 'Xiaowu', '猴子', '探险', '身手敏捷的小猴子，岛上探险队长'],
      ['艾琳', 'Ailin', '考拉', '睡觉', '总是在树上打盹的考拉，懒洋洋的很可爱'],
      ['尖尖', 'Jianjian', '刺猬', '缝纫', '背着小针线的刺猬，缝补一切破洞'],
      ['泡泡', 'Paopao', '河马', '游泳', '爱吹泡泡的河马，泳池里的开心果'],
      ['弯弯', 'Wanwan', '鸵鸟', '跑步', '跑得飞快的鸵鸟，岛上快递员'],
      ['胡胡', 'Huhu', '狐狸', '魔术', '会变魔术的小狐狸，口袋里总有惊喜'],
      ['雪莉', 'Xueli', '北极熊', '冰雕', '擅长冰雕的北极熊，作品栩栩如生'],
      ['雷雷', 'Leilei', '大象', '音乐', '用长鼻子吹口琴的大象，岛上的音乐家'],
      ['小花', 'Xiaohua', '长颈鹿', '摄影', '个子最高的长颈鹿，拍日出最美的角度'],
      ['冲儿', 'Chonger', '鲨鱼', '冲浪', '爱冲浪的鲨鱼，浪花上的舞者'],
      ['妮可', 'Nike', '猫', '时尚', '爱打扮的猫咪，每天换不同的蝴蝶结'],
      ['帕克', 'Pake', '企鹅', '钓鱼', '很会钓鱼的企鹅，冰钓冠军'],
      ['春春', 'Chunchun', '鸟', '园艺', '把鸟巢装饰成花园的小鸟，很有品味'],
      ['憨憨', 'Hanhan', '熊', '蜂蜜', '最喜欢蜂蜜的憨熊，笑容让人安心'],
      ['悠悠', 'Youyou', '水獭', '游泳', '在水面画圈圈的水獭，优雅又悠闲'],
      ['小桔', 'Xiaoju', '猫', '烘焙', '橙黄色的橘子猫，做的曲奇超好吃'],
      ['蹦蹦', 'Bengbeng', '袋鼠', '拳击', '跳得最高的袋鼠，拳击高手'],
      ['梦梦', 'Mengmeng', '羊驼', '绘画', '毛茸茸的羊驼，画风软萌可爱'],
      ['达达', 'Dada', '马', '赛跑', '跑起来像风的马，岛上运动健将'],
      ['贝拉', 'Beila', '蝴蝶', '采蜜', '翅膀像彩虹的蝴蝶，岛上最受欢迎的访客'],
      ['鼓鼓', 'Gugu', '河豚', '气球', '生气就鼓成球的河豚，可爱又好笑'],
      ['云云', 'Yunyun', '羊', '观云', '喜欢躺在山坡上看云的绵羊'],
      ['叮叮', 'Dingding', '蜜蜂', '酿造', '勤劳的小蜜蜂，酿的蜂蜜甜到心里'],
      ['洛奇', 'Luoqi', '狮子', '雕塑', '用爪子雕塑的狮子，作品充满力量'],
      ['点点', 'Diandian', '瓢虫', '旅行', '背着斑点壳旅行的瓢虫，见过很多岛'],
      ['圆圆', 'Yuanyuan', '海豹', '顶球', '圆滚滚的小海豹，顶球是拿手好戏'],
      ['叶子', 'Yezi', '树懒', '瑜伽', '做瑜伽都慢吞吞的树懒，治愈人心'],
      ['派派', 'Paipai', '土拨鼠', '挖洞', '喜欢挖地道的小土拨鼠，地下迷宫大师'],
      ['晴天', 'Qingtian', '天竺鼠', '种花', '头顶一朵向日葵的天竺鼠，微笑天使']
    ];
    var listHTML = RESIDENTS.map(function (r, i) {
      return '<div class="ai-card ai-card--' + PATTERNS[i % PATTERNS.length] + '" style="cursor:default;display:flex;align-items:center;gap:14px">' +
        '<div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.45);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#725d42;flex-shrink:0;backdrop-filter:blur(2px)">' +
          r[1].charAt(0).toUpperCase() +
        '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:15px;font-weight:700;color:inherit;display:flex;align-items:center;gap:8px">' +
            r[0] +
            '<span style="font-size:11px;font-weight:400;opacity:0.65;background:rgba(255,255,255,0.35);padding:1px 8px;border-radius:8px">' + r[2] + ' · ' + r[3] + '</span>' +
          '</div>' +
          '<div style="font-size:13px;opacity:0.75;margin-top:2px;color:inherit">' + r[4] + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="demo-section">' +
      '<div class="demo-section-title">BackTop <span class="demo-tag">返回顶部</span> <span class="demo-tag">上箭头</span></div>' +
      '<div class="demo-label" style="line-height:1.6">页面已自动滚动到底部，点击右下角的上箭头返回顶部。<br>' +
        '<code style="background:#f0e8d8;padding:2px 8px;border-radius:6px;font-size:12px">visibilityHeight=400</code> 意味着滚动超过 400px 后图标出现。' +
      '</div>' +
      '<div class="demo-label">动物岛民列表 — 共 50 位</div>' +
      '<div style="display:flex;flex-direction:column;gap:12px">' + listHTML + '</div>' +
      '<div id="backtop-mount"></div>' +
      codeL('import { BackTop } from \'animal-island-ui\';\n\n// 基础用法 — 右下角上箭头返回顶部\n<BackTop visibilityHeight={400} />\n\n// 自定义动画时长\n<BackTop duration={800} />\n\n// 容器内滚动\n<BackTop target={() => ref.current} visibilityHeight={200} />\n\n// 原生 JS\nnew AI.BackTop(null, { visibilityHeight: 400, duration: 300, target: function () { return document.querySelector(\'.main-content\'); } });') +
      apiT([
        ['visibilityHeight', '滚动多少 px 后显示', 'number', '400'],
        ['target', '滚动容器函数，默认 window', '() => HTMLElement | Window', '() => window'],
        ['duration', '滚动动画时长(ms)', 'number', '300'],
        ['onClick', '点击回调', '(e) => void', '-'],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'CSSProperties / inline style', '-']
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
      '<div class="demo-section-title">Notification <span class="demo-tag">命令式</span><span class="demo-tag">4 types</span><span class="demo-tag">6 positions</span></div>' +
      '<div class="demo-label">Notification 采用命令式 API — 在任意位置调用 Notification.success(...) 即可触发，组件会自动挂到 body 根容器。</div>' +
      '<div class="demo-label">4 种 type + 字符串简写</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-success-btn">success 字符串</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-info-btn">info 字符串</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-warning-btn">warning 字符串</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--danger" id="notif-error-btn">error 字符串</button>' +
      '</div>' +
      '<div class="demo-label">带 description 描述</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-desc-success">升级成功</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-desc-info">系统通知</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-desc-warning">库存警告</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--danger" id="notif-desc-error">错误详情</button>' +
      '</div>' +
      '<div class="demo-label">6 个 position</div>' +
      '<div class="demo-row" style="flex-wrap:wrap;gap:8px">' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="topLeft">topLeft</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="top">top</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="topRight">topRight</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottomLeft">bottomLeft</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottom">bottom</button>' +
        '<button class="ai-btn ai-btn--sm ai-btn--dashed" data-notif-pos="bottomRight">bottomRight</button>' +
      '</div>' +
      '<div class="demo-label">duration 控制自动关闭（秒）</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-dur-5">duration=5</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-dur-10">duration=10</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-dur-0">duration=0（不自动关闭）</button>' +
      '</div>' +
      '<div class="demo-label">onClick / onClose 回调</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-onclick">onClick 可点击</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-onclose">onClose</button>' +
      '</div>' +
      '<div class="demo-label">btn 自定义操作按钮</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-btn">带 btn 的常驻通知</button>' +
      '</div>' +
      '<div class="demo-label">custom icon / closeIcon</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-custom-icon">自定义 icon</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-custom-close">自定义 closeIcon</button>' +
      '</div>' +
      '<div class="demo-label">key 更新现有通知（用户关闭后停止后续状态）</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--primary" id="notif-key-update">模拟上传进度</button>' +
      '</div>' +
      '<div class="demo-label">destroy 全局控制</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-spawn-3">弹出 3 条</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--danger" id="notif-destroy-btn">destroy 关闭全部</button>' +
        '<button class="ai-btn ai-btn--md ai-btn--default" id="notif-destroy-key">destroy(\'upload\') 关闭指定 key</button>' +
      '</div>' +
      codeL('// 命令式 API\nAI.Notification.success("保存成功!");\nAI.Notification.info({ message: "提示", position: "topRight", duration: 5 });\nAI.Notification.error({ message: "失败", position: "bottomRight" });\nAI.Notification.destroy();              // 关闭全部\nAI.Notification.destroy("upload");      // 关闭指定 key') +
      apiT([
        ['message', '通知标题（必填）', 'string', '-'],
        ['description', '通知描述/正文', 'string', '-'],
        ['type', '通知类型（决定默认图标与配色）', "'success' | 'info' | 'warning' | 'error'", '由调用方法决定'],
        ['position', '出现位置', 'top | topLeft | topRight | bottom | bottomLeft | bottomRight', "'top'"],
        ['duration', '自动关闭延时（秒），传 0 关闭自动关闭', 'number', '4.5'],
        ['icon', '自定义图标', 'string (HTML)', '按 type 默认'],
        ['btn', '自定义操作按钮，渲染在关闭按钮左侧', 'string (HTML)', '-'],
        ['key', '唯一 key，同 key 二次调用会更新现有通知', 'string', '自动生成'],
        ['onClose', '关闭回调（动画结束触发）', 'function', '-'],
        ['onClick', '点击通知本体回调', 'function', '-'],
        ['closeIcon', '自定义关闭图标', 'string (HTML)', "'×'"],
        ['className', '自定义类名', 'string', '-'],
        ['style', '自定义样式', 'object | string', '-'],
        ['Notification.open/success/info/warning/error(cfg)', '打开通知', 'function', '-'],
        ['Notification.destroy() / destroy(key)', '关闭全部 / 关闭指定 key', 'function', '-']
      ]) +
    '</div>';
  };

  // -- Form --
  DEMOS.form = function () {
    var patterns = ['default', 'app-teal', 'app-yellow', 'app-orange', 'app-green', 'app-red',
      'warm-peach-pink', 'lime-green', 'yellow-green', 'brown'];
    var pick = function () { return patterns[Math.floor(Math.random() * patterns.length)]; };
    var cardStyle = 'margin-top:12px;cursor:default;max-width:360px';
    var input = function (placeholder, type) {
      return '<span class="ai-input-wrapper ai-input-wrapper--md"><input class="ai-input" style="width:100%"' +
        (type ? ' type="' + type + '"' : '') + ' placeholder="' + placeholder + '"></span>';
    };
    var field = function (label, name, control, opts) {
      opts = opts || {};
      return '<div class="ai-form-item" data-name="' + name + '"' +
        (opts.required ? ' data-required="true"' : '') +
        (opts.rules ? " data-rules='" + JSON.stringify(opts.rules) + "'" : '') + '>' +
        '<label class="ai-form-item__label">' + label + '</label>' +
        '<div class="ai-form-item__control"><div class="ai-form-item__control-input">' + control + '</div></div>' +
      '</div>';
    };
    var checkItem = function (label, value, checked) {
      return '<label class="ai-checkbox-item ai-checkbox-item--md' + (checked ? ' ai-checkbox-item--checked' : '') + '" data-value="' + value + '">' +
        '<span class="ai-checkbox-box"><span class="ai-checkbox-checkmark" style="display:' + (checked ? 'flex' : 'none') + '">' +
          '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span></span>' +
        '<span class="ai-checkbox-label">' + label + '</span>' +
      '</label>';
    };
    var submitRow = function (label, type, extra) {
      return '<div class="ai-form-item"><div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
        '<div style="margin-top:8px">' +
          '<button type="submit" class="ai-btn ' + (type === 'block' ? 'ai-btn--primary ai-btn--block' : 'ai-btn--sm ai-btn--primary') + '">' + label + '</button>' +
          (extra || '') +
        '</div>' +
      '</div></div></div>';
    };

    return '<div class="demo-section">' +
      '<div class="demo-section-title">Form <span class="demo-tag">表单</span> <span class="demo-tag">useForm</span> <span class="demo-tag">校验</span></div>' +
      '<div class="demo-label">Form 表单组件 — 集成表单实例、校验规则、布局网格、依赖字段等基础能力。</div>' +

      '<div class="demo-label">基础用法：登录表单（required / minLength / 自定义 validator）</div>' +
      '<div class="ai-card ai-card--pattern-' + pick() + '" style="' + cardStyle + '">' +
        '<form id="form-login" data-layout="vertical" style="max-width:300px">' +
          field('用户名', 'username', input('请输入用户名'), {
            required: true,
            rules: [
              { required: true, message: '请输入用户名' },
              { min: 3, max: 12, message: '长度需在 3 - 12 字符之间' }
            ]
          }) +
          field('密码', 'password', input('请输入密码', 'password'), { required: true }) +
          submitRow('登录', 'block') +
        '</form>' +
      '</div>' +

      '<div class="demo-label">三种布局：horizontal / vertical / inline</div>' +
      '<div class="ai-card ai-card--pattern-' + pick() + '" style="' + cardStyle + ';display:flex;flex-direction:column;gap:10px">' +
        '<div style="font-size:12px;color:#a08060;margin-bottom:4px">layout="horizontal"</div>' +
        '<form id="form-horizontal" data-layout="horizontal" style="max-width:300px">' +
          field('昵称', 'a', input('输入昵称'), { required: true }) +
          field('签名', 'a-sign', input('输入签名')) +
        '</form>' +
        '<div style="font-size:12px;color:#a08060;margin-top:12px;margin-bottom:4px">layout="vertical"</div>' +
        '<form id="form-vertical" data-layout="vertical" style="max-width:300px">' +
          field('标题', 'b', input('输入标题'), { required: true }) +
        '</form>' +
        '<div style="font-size:12px;color:#a08060;margin-top:12px;margin-bottom:4px">layout="inline"</div>' +
        '<form id="form-inline" data-layout="inline" style="max-width:300px">' +
          '<div class="ai-form-item" data-name="c"><div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
            input('搜索关键词') +
          '</div></div></div>' +
          '<div class="ai-form-item"><div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
            '<button type="submit" class="ai-btn ai-btn--sm ai-btn--primary">搜索</button>' +
          '</div></div></div>' +
        '</form>' +
      '</div>' +

      '<div class="demo-label">Form.useForm + 命令式 API（setFieldsValue / resetFields）</div>' +
      '<div class="ai-card ai-card--pattern-' + pick() + '" style="' + cardStyle + '">' +
        '<form id="form-instance" data-layout="vertical" style="max-width:300px">' +
          field('姓名', 'name', input('请输入姓名'), { required: true }) +
          field('最爱水果', 'fruit', input('apple / orange / grape')) +
          '<div class="ai-form-item" data-name="hobby">' +
            '<label class="ai-form-item__label">爱好</label>' +
            '<div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
              '<div class="ai-checkbox-group" id="form-hobby-group">' +
                checkItem('音乐', 'music') +
                checkItem('运动', 'sport') +
                checkItem('阅读', 'read') +
              '</div>' +
            '</div></div>' +
          '</div>' +
          '<div class="ai-form-item"><div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
            '<div style="margin-top:8px">' +
              '<button type="button" class="ai-btn ai-btn--dashed" id="form-fill-btn" style="margin-right:8px">一键填充</button>' +
              '<button type="button" class="ai-btn" id="form-reset-btn" style="margin-right:8px">重置</button>' +
              '<button type="submit" class="ai-btn ai-btn--primary">提交</button>' +
            '</div>' +
          '</div></div></div>' +
        '</form>' +
        '<div id="form-instance-result" style="display:none;margin-top:8px;padding:6px 10px;background:#fffbe6;border:1px solid #ffe58f;border-radius:6px;font-size:12px;color:#874d00"></div>' +
      '</div>' +

      '<div class="demo-label">onValuesChange：实时同步字段值</div>' +
      '<div class="ai-card ai-card--pattern-' + pick() + '" style="' + cardStyle + '">' +
        '<form id="form-live-form" data-layout="vertical" style="max-width:300px">' +
          '<div class="ai-form-item" data-name="radio">' +
            '<label class="ai-form-item__label">你是？</label>' +
            '<div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
              '<div class="ai-radio-group" id="form-radio-group"></div>' +
            '</div></div>' +
          '</div>' +
          '<div class="ai-form-item" data-name="check">' +
            '<label class="ai-form-item__label">你喜欢？</label>' +
            '<div class="ai-form-item__control"><div class="ai-form-item__control-input">' +
              '<div class="ai-checkbox-group" id="form-check-group">' +
                checkItem('A', 'a') +
                checkItem('B', 'b', true) +
                checkItem('C', 'c') +
              '</div>' +
            '</div></div>' +
          '</div>' +
        '</form>' +
        '<div id="form-live" style="margin-top:8px;font-size:12px;color:#5b8def;font-family:monospace">liveValues: {}</div>' +
      '</div>' +

      '<div class="demo-label">校验规则：pattern / type / max / 自定义 async</div>' +
      '<div class="ai-card ai-card--pattern-' + pick() + '" style="' + cardStyle + '">' +
        '<form id="form-validate" data-layout="vertical" style="max-width:300px">' +
          field('邮箱', 'email', input('example@animal.com'), {
            required: true,
            rules: [
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]
          }) +
          field('年龄', 'age', input('整数'), {
            required: true,
            rules: [
              { required: true, message: '请输入年龄' },
              { type: 'integer', message: '请输入整数' },
              { min: 0, max: 150, message: '年龄应在 0 - 150 之间' }
            ]
          }) +
          field('邀请码', 'code', input('请输入邀请码'), {
            rules: [{ pattern: '^[A-Z]{4}$', message: '4 位大写字母' }]
          }) +
          submitRow('提交', 'block') +
        '</form>' +
      '</div>' +

      codeL([
        "import React from 'react';",
        "import { Form, FormItem, useForm, Input, Button } from 'animal-island-ui';",
        "",
        "const App = () => {",
        "    const [form] = useForm();",
        "",
        "    return (",
        "        <Form",
        "            form={form}",
        "            layout=\"vertical\"",
        "            initialValues={{ username: '' }}",
        "            onFinish={(values) => console.log('success', values)}",
        "            onFinishFailed={(info) => console.log('failed', info)}",
        "        >",
        "            <FormItem",
        "                label=\"用户名\"",
        "                name=\"username\"",
        "                required",
        "                rules={[",
        "                    { required: true, message: '请输入用户名' },",
        "                    { min: 3, max: 12, message: '长度 3 - 12' },",
        "                ]}",
        "            >",
        "                <Input placeholder=\"请输入\" />",
        "            </FormItem>",
        "            <FormItem>",
        "                <Button type=\"primary\" htmlType=\"submit\">提交</Button>",
        "                <Button onClick={() => form.resetFields()}>重置</Button>",
        "            </FormItem>",
        "        </Form>",
        "    );",
        "};"
      ].join('\n')) +
      apiT([
        ['form', '受控 form 实例（Form.useForm() 产出）', 'FormInstance', '-'],
        ['initialValues', '表单初始值', 'Record<string, unknown>', '-'],
        ['layout', '布局方向', "'horizontal' | 'vertical' | 'inline'", "'horizontal'"],
        ['labelAlign', 'label 对齐', "'left' | 'right'", "'right'"],
        ['labelCol / wrapperCol', 'label / 控件的网格配置', '{ span?: number; offset?: number }', '{ span: 5 / 19 }'],
        ['size', '全局尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['disabled', '全局禁用', 'boolean', 'false'],
        ['colon', 'label 后是否显示冒号', 'boolean', 'true'],
        ['requiredMark', '必填星号显示策略', "boolean | 'optional'", 'true'],
        ['onFinish', '校验通过、提交时触发', '(values) => void', '-'],
        ['onFinishFailed', '校验失败时触发', '(info) => void', '-'],
        ['onValuesChange', '任意字段值变化', '(changed, all) => void', '-'],
        ['onReset', 'reset 事件', '(e) => void', '-']
      ], 'Form API') +
      apiT([
        ['name', '字段名（无 name 仅作展示）', 'NamePath', '-'],
        ['label', 'label 文本', 'ReactNode', '-'],
        ['rules', '校验规则', 'RuleObject[]', '-'],
        ['required', '显示必填星号（不参与校验）', 'boolean', 'false'],
        ['valuePropName', '子节点接收的 value prop 名', 'string', "'value'"],
        ['trigger', '子节点的 change 事件名', 'string', "'onChange'"],
        ['getValueFromEvent', '从事件对象取值（默认兼容 input/checkbox/radio）', '(event) => unknown', '-'],
        ['normalize', '写入前的标准化处理', '(value, prev, all) => unknown', '-'],
        ['hidden', '不渲染 DOM', 'boolean', 'false'],
        ['help', '帮助文本（错误时显示错误）', 'ReactNode', '-'],
        ['noStyle', '不渲染 label/wrapper，仅包 children', 'boolean', 'false'],
        ['labelCol / wrapperCol', '覆盖父级网格', 'ColProps', '-'],
        ['initialValue', '字段初始值', 'unknown', '-']
      ], 'FormItem API') +
    '</div>';
  };

  // -- Avatar --
  /* 图标头像：取自原版依赖 naive-icons 的官方 SVG（同序同义：动物 / 天气 / 食物 / 物件），
     24px 原始多色手绘风格；属性用单引号，避免截断外层 HTML 双引号属性。 */
  var AVATAR_ICON_SVGS = {
    image: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><rect x='6' y='10' width='36' height='28' rx='3' fill='#FAEDCD'/><circle cx='16' cy='20' r='3' fill='#E9C46A'/><path d='M10 36 L20 24 L28 32 L36 22 L42 36 Z' fill='#2A9D8F'/><path d='M10 36 L42 36' stroke='#2A2A2A'/></svg>",
    coffeeCup: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M13.3 11.35 L34.7 11.35 L33.73 16.21 L14.27 16.21 Z' fill='#8B5E3C'/><path d='M14.75 16.21 L17.19 39.57 C 17.67 41.52 30.33 41.52 30.81 39.57 L33.25 16.21 Z' fill='#FAEDCD'/><path d='M15.44 23.03 L32.56 23.03 L31.69 30.81 L16.31 30.81 Z' fill='#E76F51'/><path d='M24 29.45 C 21.86 27.5 21.76 25.65 23.22 24.97 C 23.9 24.68 24 25.27 24 25.65 C 24 25.27 24.1 24.68 24.78 24.97 C 26.24 25.65 26.14 27.5 24 29.45 Z' fill='#FAEDCD' stroke='none'/><path d='M20.11 8.43 C 20.11 6.48 22.05 6.48 22.05 4.05' stroke='#2A2A2A' stroke-width='2'/><path d='M26.92 8.43 C 26.92 6.48 28.87 6.48 28.87 4.05' stroke='#2A2A2A' stroke-width='2'/></svg>",
    rabbit: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='17.6' cy='13.03' rx='5.9' ry='10' fill='#2A2A2A' stroke='none'/><ellipse cx='30.4' cy='13.03' rx='5.9' ry='10' fill='#2A2A2A' stroke='none'/><ellipse cx='17.6' cy='13.03' rx='3.3' ry='7.9' fill='#FAEDCD' stroke='none'/><ellipse cx='30.4' cy='13.03' rx='3.3' ry='7.9' fill='#FAEDCD' stroke='none'/><ellipse cx='17.6' cy='13.94' rx='1.5' ry='4.7' fill='#F4A6A4' stroke='none'/><ellipse cx='30.4' cy='13.94' rx='1.5' ry='4.7' fill='#F4A6A4' stroke='none'/><circle cx='24' cy='30.4' r='11.89' fill='#FAEDCD'/><circle cx='19.43' cy='28.57' r='1.46' fill='#2A2A2A'/><circle cx='28.57' cy='28.57' r='1.46' fill='#2A2A2A'/><path d='M22.17 32.23 L25.83 32.23 L24 34.51 Z' fill='#F4A6A4' stroke='none'/><path d='M24 34.51 L24 35.89' stroke='#2A2A2A' stroke-width='1.8'/><path d='M20.34 37.71 Q 24 40 27.66 37.71' stroke='#2A2A2A' fill='none' stroke-width='1.8'/><path d='M12.11 30.4 L6.63 28.57' stroke='#2A2A2A' stroke-width='1.5'/><path d='M12.11 34.06 L6.63 34.97' stroke='#2A2A2A' stroke-width='1.5'/><path d='M35.89 30.4 L41.37 28.57' stroke='#2A2A2A' stroke-width='1.5'/><path d='M35.89 34.06 L41.37 34.97' stroke='#2A2A2A' stroke-width='1.5'/></svg>",
    owl: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12.92 14.77 L15.69 6.46 L21.23 12.92 Z' fill='#264653'/><path d='M35.08 14.77 L32.31 6.46 L26.77 12.92 Z' fill='#264653'/><ellipse cx='24' cy='26.77' rx='13.85' ry='14.77' fill='#264653'/><circle cx='18.46' cy='22.15' r='5.54' fill='#FFFFFF'/><circle cx='29.54' cy='22.15' r='5.54' fill='#FFFFFF'/><circle cx='18.46' cy='23.08' r='2.31' fill='#2A2A2A'/><circle cx='29.54' cy='23.08' r='2.31' fill='#2A2A2A'/><path d='M21.69 27.69 L26.31 27.69 L24 31.38 Z' fill='#E9C46A' stroke='none'/><path d='M17.54 36 Q 20.31 37.85 23.08 36' stroke='#2A2A2A' fill='none' stroke-width='1.8'/><path d='M24.92 36 Q 27.69 37.85 30.46 36' stroke='#2A2A2A' fill='none' stroke-width='1.8'/><ellipse cx='18.46' cy='41.54' rx='3.6' ry='2' fill='#E9C46A' stroke='none'/><ellipse cx='29.54' cy='41.54' rx='3.6' ry='2' fill='#E9C46A' stroke='none'/></svg>",
    camera: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><rect x='6' y='16' width='36' height='24' rx='3' fill='#264653'/><path d='M18 16 L20 10 L28 10 L30 16' fill='#264653'/><circle cx='24' cy='28' r='8' fill='#FAEDCD'/><circle cx='24' cy='28' r='4' fill='#E76F51'/><rect x='34' y='19' width='4' height='3' fill='#E9C46A' stroke='none'/></svg>",
    sun: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='24' cy='24' r='9.6' fill='#E9C46A'/><path d='M24 4.8 L24 10.56' stroke='#2A2A2A'/><path d='M24 37.44 L24 43.2' stroke='#2A2A2A'/><path d='M4.8 24 L10.56 24' stroke='#2A2A2A'/><path d='M37.44 24 L43.2 24' stroke='#2A2A2A'/><path d='M10.56 10.56 L14.4 14.4' stroke='#2A2A2A'/><path d='M33.6 33.6 L37.44 37.44' stroke='#2A2A2A'/><path d='M10.56 37.44 L14.4 33.6' stroke='#2A2A2A'/><path d='M33.6 14.4 L37.44 10.56' stroke='#2A2A2A'/></svg>",
    rainbow: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M8.82 32.93 A 15.18 15.18 0 0 1 39.18 32.93' stroke='#E76F51' stroke-width='4.5' fill='none'/><path d='M13.73 32.93 A 10.27 10.27 0 0 1 34.27 32.93' stroke='#E9C46A' stroke-width='4.5' fill='none'/><path d='M18.64 32.93 A 5.36 5.36 0 0 1 29.36 32.93' stroke='#2A9D8F' stroke-width='4.5' fill='none'/><circle cx='7.93' cy='35.61' r='3.13' fill='#FAEDCD'/><circle cx='12.39' cy='36.95' r='2.68' fill='#FAEDCD'/><circle cx='40.07' cy='35.61' r='3.13' fill='#FAEDCD'/><circle cx='35.61' cy='36.95' r='2.68' fill='#FAEDCD'/></svg>",
    cloud: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M14 30 C 8 30 6 22 12 20 C 12 14 20 12 24 16 C 28 10 38 14 36 22 C 42 22 42 30 36 30 Z' fill='#FAEDCD'/><circle cx='20' cy='24' r='1.5' fill='#2A2A2A'/><circle cx='28' cy='24' r='1.5' fill='#2A2A2A'/></svg>",
    star: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M24 6 L29 18 L42 19 L32 28 L35 41 L24 34 L13 41 L16 28 L6 19 L19 18 Z' fill='#E9C46A'/><circle cx='20' cy='22' r='1.3' fill='#2A2A2A'/><circle cx='28' cy='22' r='1.3' fill='#2A2A2A'/></svg>",
    leaf: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M8 40 C 8 18 24 6 40 8 C 40 24 26 40 8 40 Z' fill='#588157'/><path d='M8 40 L40 8' stroke='#2A2A2A' stroke-width='2'/></svg>",
    mushroom: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 22 C 6 9 42 9 42 22 C 42 25 39 26 35 26 L 13 26 C 9 26 6 25 6 22 Z' fill='#E76F51'/><circle cx='15' cy='18' r='2.2' fill='#FFFFFF'/><circle cx='24' cy='15' r='2.6' fill='#FFFFFF'/><circle cx='33' cy='18.5' r='2.2' fill='#FFFFFF'/><path d='M18 26 L 18 37 C 18 41 30 41 30 37 L 30 26 Z' fill='#FAEDCD'/><circle cx='22' cy='31' r='1.4' fill='#2A2A2A'/><circle cx='26' cy='31' r='1.4' fill='#2A2A2A'/><path d='M22 34 Q 24 36 26 34' stroke='#2A2A2A' fill='none' stroke-width='1.8'/><path d='M10 42 L38 42' stroke='#588157' stroke-width='3'/></svg>",
    strawberry: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M24 18 C 15.5 18 11.5 24 14.5 30 C 17 34.5 20.5 38 24 39 C 27.5 38 31 34.5 33.5 30 C 36.5 24 32.5 18 24 18 Z' fill='#E76F51'/><path d='M16 17.5 L17.5 11 L21 15.5 L24 9.5 L27 15.5 L30.5 11 L32 17.5 Z' fill='#588157'/><circle cx='19' cy='23.5' r='1.3' fill='#2A2A2A' stroke='none'/><circle cx='24' cy='25.5' r='1.3' fill='#2A2A2A' stroke='none'/><circle cx='29' cy='23.5' r='1.3' fill='#2A2A2A' stroke='none'/><circle cx='21.5' cy='30' r='1.3' fill='#2A2A2A' stroke='none'/><circle cx='26.5' cy='30' r='1.3' fill='#2A2A2A' stroke='none'/><circle cx='24' cy='34' r='1.3' fill='#2A2A2A' stroke='none'/></svg>",
    donut: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='24' cy='24' r='15' fill='#F4A6A4'/><circle cx='24' cy='24' r='6' fill='#FFFFFF'/><rect x='16.5' y='12.8' width='5.6' height='3.6' rx='1.8' transform='rotate(25 19.3 14.6)' fill='#E76F51' stroke='none'/><rect x='25.6' y='12.5' width='5.6' height='3.6' rx='1.8' transform='rotate(-20 28.4 14.3)' fill='#2A9D8F' stroke='none'/><rect x='31.2' y='18.2' width='5.6' height='3.6' rx='1.8' transform='rotate(45 34 20)' fill='#264653' stroke='none'/><rect x='10.8' y='21' width='5.6' height='3.6' rx='1.8' transform='rotate(-35 13.6 22.8)' fill='#588157' stroke='none'/><rect x='29.1' y='29.1' width='5.6' height='3.6' rx='1.8' transform='rotate(15 31.9 30.9)' fill='#2A9D8F' stroke='none'/><rect x='15.7' y='31' width='5.6' height='3.6' rx='1.8' transform='rotate(60 18.5 32.8)' fill='#264653' stroke='none'/></svg>",
    icecream: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M15.36 23.04 L 24 42.24 L 32.64 23.04 Z' fill='#E9C46A'/><path d='M18.24 27.84 L 29.76 27.84 M20.16 32.64 L 27.84 32.64' stroke='#2A2A2A' stroke-width='1.5'/><circle cx='24' cy='16.32' r='8.64' fill='#F4A6A4'/><circle cx='24' cy='7.2' r='2.4' fill='#E76F51'/><circle cx='21.12' cy='15.36' r='1.34' fill='#2A2A2A'/><circle cx='26.88' cy='15.36' r='1.34' fill='#2A2A2A'/><path d='M21.6 18.72 Q 24 20.64 26.4 18.72' stroke='#2A2A2A' fill='none' stroke-width='1.5'/></svg>",
    coffee: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M10 22 L10 36 C 10 40 14 42 18 42 L28 42 C 32 42 36 40 36 36 L36 22 Z' fill='#8B5E3C'/><path d='M36 26 C 42 26 42 34 36 34' fill='#8B5E3C'/><path d='M16 10 C 16 14 20 14 20 18' stroke='#2A2A2A' stroke-width='2'/><path d='M22 10 C 22 14 26 14 26 18' stroke='#2A2A2A' stroke-width='2'/><path d='M28 10 C 28 14 32 14 32 18' stroke='#2A2A2A' stroke-width='2'/></svg>",
    balloon: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M24 5 C 14 5 9 13 9 19 C 9 26 15 31 24 31 C 33 31 39 26 39 19 C 39 13 34 5 24 5 Z' fill='#E76F51'/><path d='M21 31 L 27 31 L 24 35 Z' fill='#E76F51' stroke='none'/><path d='M24 35 C 20 38 28 40 24 44' stroke='#2A2A2A' stroke-width='2' fill='none'/><circle cx='17' cy='14' r='2.2' fill='#FFFFFF' stroke='none'/><circle cx='20.5' cy='19' r='1.4' fill='#2A2A2A'/><circle cx='27.5' cy='19' r='1.4' fill='#2A2A2A'/><path d='M21 23 Q 24 25 27 23' stroke='#2A2A2A' fill='none' stroke-width='1.8'/></svg>",
    rocket: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M18 32 L24 42.5 L30 32 Z' fill='#E76F51'/><path d='M24 6 C 16 6 14 16 14 25 L 14 34 L 34 34 L 34 25 C 34 16 32 6 24 6 Z' fill='#FAEDCD'/><path d='M14 28 L8 34 L8 40 L14 36 Z' fill='#E76F51'/><path d='M34 28 L40 34 L40 40 L34 36 Z' fill='#E76F51'/><circle cx='24' cy='20' r='5' fill='#2A9D8F'/></svg>",
    sailboat: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M22.08 9.64 L 22.08 27.83 L 9.64 27.83 Z' fill='#E76F51'/><path d='M25.92 6.76 L 25.92 27.83 L 39.32 27.83 Z' fill='#FAEDCD'/><path d='M24 4.85 L 24 29.75' stroke='#2A2A2A' stroke-width='3'/><path d='M7.72 31.66 L 40.28 31.66 L 35.49 39.32 L 12.51 39.32 Z' fill='#8B5E3C'/><path d='M4.85 43.15 C 8.68 41.24 10.59 45.07 14.42 43.15 C 18.25 41.24 20.17 45.07 24 43.15 C 27.83 41.24 29.75 45.07 33.58 43.15 C 37.41 41.24 39.32 45.07 43.15 43.15' stroke='#2A9D8F' stroke-width='2.5' fill='none'/><circle cx='29.75' cy='17.3' r='1.53' fill='#E76F51' stroke='none'/></svg>",
    music: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='16.03' cy='31.97' rx='7.97' ry='5.98' transform='rotate(-15 16.03 31.97)' fill='#E76F51'/><ellipse cx='33.96' cy='27.98' rx='7.97' ry='5.98' transform='rotate(-15 33.96 27.98)' fill='#E76F51'/><path d='M22.01 14.04 L39.93 10.06 L39.93 27.98' stroke='#2A2A2A' stroke-width='3'/></svg>",
    heart: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M24 40 C 8 30 4 18 12 12 C 18 8 22 12 24 16 C 26 12 30 8 36 12 C 44 18 40 30 24 40 Z' fill='#E76F51'/><circle cx='18' cy='20' r='1.5' fill='#2A2A2A'/><circle cx='30' cy='20' r='1.5' fill='#2A2A2A'/></svg>",
    map: "<svg width='24' height='24' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='#2A2A2A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M8 12 L 18 8 L 30 12 L 40 8 L 40 34 L 30 38 L 18 34 L 8 38 Z' fill='#FAEDCD'/><path d='M18 8 L 18 34' stroke='#2A2A2A' stroke-width='2.5'/><path d='M30 12 L 30 38' stroke='#2A2A2A' stroke-width='2.5'/><path d='M12 30 C 15 23 21 28 24 21 C 26 17 29 18 31 16' stroke='#E76F51' stroke-width='2.5' fill='none'/><circle cx='32' cy='15' r='2.2' fill='#E76F51'/></svg>"
  };
  var AVATAR_ICON_ORDER = ['image', 'coffeeCup', 'rabbit', 'owl', 'camera', 'sun', 'rainbow', 'cloud', 'star', 'leaf',
    'mushroom', 'strawberry', 'donut', 'icecream', 'coffee', 'balloon', 'rocket', 'sailboat', 'music', 'heart'];

  function avatarIcon(name) {
    return AVATAR_ICON_SVGS[name] || '';
  }

  DEMOS.avatar = function () {
    var P = 'assets/img/demo/';

    return '<div class="demo-section">' +
      '<div class="demo-section-title">Avatar <span class="demo-tag">文字 / 图标 / 图片</span></div>' +
      '<div class="demo-label">基础用法：文字 / 图标 / 图片三种形态</div>' +
      '<div class="demo-row">' +
        '<span data-ai="avatar" data-text="岛"></span>' +
        '<span data-ai="avatar" data-icon="' + esc(avatarIcon('image')) + '"></span>' +
        '<span data-ai="avatar" data-src="' + P + 'content_bg_pc.jpg" data-alt="岛屿风景"></span>' +
      '</div>' +
      '<div class="demo-label">形状：圆形 / 方形（切换看看）</div>' +
      '<div id="avatar-shape-radio"></div>' +
      '<div class="demo-row" style="margin-top:12px" id="avatar-shape-row">' +
        '<span id="av-shape-1" data-ai="avatar" data-text="岛" data-shape="circle"></span>' +
        '<span id="av-shape-2" data-ai="avatar" data-icon="' + esc(avatarIcon('map')) + '" data-shape="circle"></span>' +
        '<span id="av-shape-3" data-ai="avatar" data-src="' + P + 'photo-02.jpg" data-alt="阳光田野" data-shape="circle"></span>' +
        '<span id="av-shape-4" data-ai="avatar" data-src="' + P + 'photo-03.jpg" data-alt="湖畔清晨" data-size="large" data-shape="circle"></span>' +
      '</div>' +
      '<div class="demo-label">头像组：叠加展示 + 超出折叠</div>' +
      '<div class="demo-row">' +
        '<span id="avatar-group-1"></span>' +
        '<span id="avatar-group-2"></span>' +
        '<span id="avatar-group-3"></span>' +
      '</div>' +
      '<div class="demo-label">尺寸：预设三档 + 任意数值</div>' +
      '<div class="demo-row" style="align-items:flex-end">' +
        '<span data-ai="avatar" data-size="small" data-text="S"></span>' +
        '<span data-ai="avatar" data-size="middle" data-text="M"></span>' +
        '<span data-ai="avatar" data-size="large" data-text="L"></span>' +
        '<span data-ai="avatar" data-size="64" data-text="64"></span>' +
        '<span data-ai="avatar" data-size="96" data-src="' + P + 'photo-12.jpg" data-alt="岛屿远眺"></span>' +
      '</div>' +
      '<div class="demo-label">加载失败：自动回退到图标 / 文字</div>' +
      '<div class="demo-row">' +
        '<span data-ai="avatar" data-src="/broken-avatar.png" data-icon="' + esc(avatarIcon('map')) + '"></span>' +
        '<span data-ai="avatar" data-src="/broken-avatar.png" data-text="岛"></span>' +
      '</div>' +
      '<div class="demo-label">图标头像：20 个图标作为内容（动物 / 天气 / 食物 / 物件）</div>' +
      '<div class="demo-row">' +
        AVATAR_ICON_ORDER.map(function (name) {
          return '<span data-ai="avatar" data-icon="' + esc(avatarIcon(name)) + '"></span>';
        }).join('') +
      '</div>' +
      codeL('<span data-ai="avatar" data-text="岛"></span>\n<span data-ai="avatar" data-src="/photo.png" data-alt="岛屿风景"></span>\n<span data-ai="avatar" data-size="64" data-text="64"></span>\n\n// JS 模式\nvar avatar = new AI.Avatar(el, {\n  shape: "circle",   // circle / square\n  size: "middle",    // small / middle / large 或像素数值\n  src: "/photo.png",\n  alt: "岛屿风景",\n  icon: "<svg>...</svg>",   // 加载失败回退\n  text: "岛",\n  onError: function () { return true; }\n});\navatar.update({ size: "large" });') +
      apiT([
        ['shape', "形状：'circle' 圆形（默认） / 'square' 圆角方形", "'circle' | 'square'", "'circle'"],
        ['size', "尺寸：'small' / 'middle' / 'large' 预设，或任意像素数值", "number | 'small' | 'middle' | 'large'", "'middle'"],
        ['src', '图片地址；加载失败自动回退到图标 / 文字', 'string', '-'],
        ['alt', '图片替代文本（无障碍）', 'string', '-'],
        ['icon', '图标占位：src 为空或加载失败时展示', 'string(html)', '用户图标'],
        ['text', '文字头像内容，过宽时按 gap 自动缩小字号', 'string', '-'],
        ['gap', '文字 / 图标与头像边界的间距（px）', 'number', '4'],
        ['onError', '图片加载失败回调；返回 false 可阻止回退', '() => boolean', '-'],
        ['avatar.update(options)', '更新头像', 'method', '-']
      ]) +
      apiT([
        ['maxCount', '最多显示的头像数量，超出部分折叠为 "+N"', 'number', '-'],
        ['maxStyle', '折叠 "+N" 头像的自定义样式', 'string(cssText)', '-'],
        ['size', '传递给子 Avatar 的尺寸（子级未显式指定时生效）', "number | 'small' | 'middle' | 'large'", '-'],
        ['shape', '传递给子 Avatar 的形状', "'circle' | 'square'", '-'],
        ['gap', '头像组内头像间距（px），头像间相互叠加', 'number', '8'],
        ['items', '头像配置数组（JS 模式）', 'Array', '-']
      ]) +
    '</div>';
  };

  // -- Badge --
  DEMOS.badge = function () {
    var colors = ['app-red', 'app-pink', 'app-orange', 'app-yellow', 'app-teal', 'app-green', 'app-blue',
      'purple', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink'];
    var sqAvatar = function (text, iconHtml) {
      return '<span data-ai="avatar" data-shape="square" data-size="large" ' +
        (iconHtml ? 'data-icon="' + esc(iconHtml) + '"' : 'data-text="' + text + '"') + '></span>';
    };
    function badge(opts, inner) {
      var attrs = [];
      if (opts.count !== undefined) attrs.push('data-count="' + opts.count + '"');
      if (opts.overflow) attrs.push('data-overflow-count="' + opts.overflow + '"');
      if (opts.showZero) attrs.push('data-show-zero="true"');
      if (opts.dot) attrs.push('data-dot="true"');
      if (opts.size) attrs.push('data-size="' + opts.size + '"');
      if (opts.color) attrs.push('data-color="' + opts.color + '"');
      return '<span data-ai="badge" ' + attrs.join(' ') + '>' + (inner || '') + '</span>';
    }
    function standalone(opts) {
      var attrs = [];
      if (opts.count !== undefined) attrs.push('data-count="' + opts.count + '"');
      if (opts.overflow) attrs.push('data-overflow-count="' + opts.overflow + '"');
      if (opts.showZero) attrs.push('data-show-zero="true"');
      if (opts.color) attrs.push('data-color="' + opts.color + '"');
      if (opts.size) attrs.push('data-size="' + opts.size + '"');
      return '<span data-ai="badge" ' + attrs.join(' ') + '></span>';
    }
    var bell24 = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>" +
      "<path d='M12 3c-3.5 0-6 2.6-6 6v4l-1.8 3h15.6L18 13V9c0-3.4-2.5-6-6-6z' fill='#f7cd67' stroke='#794f27' stroke-width='1.8' stroke-linejoin='round'/>" +
      "<path d='M9.8 19a2.3 2.3 0 0 0 4.4 0' stroke='#794f27' stroke-width='1.8' stroke-linecap='round'/></svg>";
    var bell26 = bell24.replace(/24/g, '26');
    var mail24 = "<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>" +
      "<rect x='3' y='5.5' width='18' height='13' rx='2' fill='#fff' stroke='#794f27' stroke-width='1.8'/>" +
      "<path d='M4 7l8 6 8-6' stroke='#794f27' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>";
    // gift12（礼物角标 SVG）在 initPage 中以 JS 模式注入，避免 HTML 属性转义问题

    return '<div class="demo-section">' +
      '<div class="demo-section-title">Badge <span class="demo-tag">数字角标</span> <span class="demo-tag">封顶数字</span> <span class="demo-tag">小红点</span> <span class="demo-tag">12 colors</span></div>' +
      '<div class="demo-label">基本：图标 / 头像右上角的徽标数</div>' +
      '<div class="demo-row">' +
        badge({ count: 5 }, sqAvatar('', bell24)) +
        badge({ count: 12 }, sqAvatar('狸')) +
        '<span id="badge-gift-mount">' + sqAvatar('', mail24) + '</span>' +
      '</div>' +
      '<div class="demo-label">count 为 0 时默认隐藏，showZero 可强制展示</div>' +
      '<div class="demo-row">' +
        badge({ count: 0 }, sqAvatar('零')) +
        badge({ count: 0, showZero: true }, sqAvatar('零')) +
      '</div>' +
      '<div class="demo-label">独立使用：不包裹任何元素，可单独作为计数展示</div>' +
      '<div class="demo-row">' +
        standalone({ count: 11 }) +
        standalone({ count: 25, color: 'app-teal' }) +
        standalone({ count: '新', color: 'app-orange' }) +
        standalone({ count: 0, showZero: true, color: 'brown' }) +
      '</div>' +
      '<div class="demo-label">封顶数字：超过 overflowCount（默认 99）时显示为「99+」</div>' +
      '<div class="demo-row">' +
        badge({ count: 99 }, sqAvatar('99')) +
        badge({ count: 100 }, sqAvatar('100')) +
        badge({ count: 99, overflow: 10 }, sqAvatar('10+')) +
        badge({ count: 1000, overflow: 999 }, sqAvatar('', '<span style="font-size:16px">999+</span>')) +
      '</div>' +
      '<div class="demo-label">讨嫌的小红点：没有具体数字，只有一个小圆点</div>' +
      '<div class="demo-row">' +
        badge({ dot: true }, sqAvatar('', bell24)) +
        badge({ dot: true, color: 'app-green' }, bell26) +
        badge({ dot: true, color: 'app-teal' }, '<span style="font-size:14px;color:#725d42;font-weight:600">一段文字</span>') +
      '</div>' +
      '<div class="demo-label">size 尺寸（medium / small）</div>' +
      '<div class="demo-row">' +
        badge({ count: 5, size: 'medium' }, sqAvatar('M')) +
        badge({ count: 5, size: 'small' }, sqAvatar('S')) +
        standalone({ count: 5, size: 'small', color: 'app-blue' }) +
      '</div>' +
      '<div class="demo-label">color 多彩徽标（与 Card / Tag 同一调色板）</div>' +
      '<div class="demo-row">' +
        colors.map(function (c) {
          return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">' +
            standalone({ count: 12, color: c }) +
            '<span style="font-size:11px;color:#a0936e;font-weight:500">' + c + '</span></div>';
        }).join('') +
      '</div>' +
      codeL('<span data-ai="badge" data-count="5"><span data-ai="avatar" data-shape="square" data-size="large">…</span></span>\n\n// JS 模式\nvar badge = new AI.Badge(el, {\n  count: 25,\n  color: "app-teal",   // 12 色板\n  overflowCount: 99,   // 超过显示 99+\n  showZero: false,\n  dot: false,\n  size: "medium"\n});\nbadge.update({ count: 100 });') +
      apiT([
        ['count', '展示的内容：数字 / 字符串，或任意 HTML（如图标）', 'string | number', '-'],
        ['overflowCount', '展示封顶的数字值，超过时显示为 `${overflowCount}+`', 'number', '99'],
        ['showZero', '数值为 0 时是否展示', 'boolean', 'false'],
        ['dot', '不展示数字，只展示一个小圆点', 'boolean', 'false'],
        ['size', '尺寸，仅对数字角标生效（dot 尺寸固定）', "'small' | 'medium'", "'medium'"],
        ['color', '颜色（与 Card / Tag 同款调色板）', "'app-red' | 'app-pink' | 'app-orange' | 'app-yellow' | 'app-teal' | 'app-green' | 'app-blue' | 'purple' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'", "'app-red'"],
        ['title', '原生 tooltip；不传时默认展示完整数值', 'string', '-'],
        ['children', '徽标包裹的元素（写在标签内）；不传即为独立使用', 'html', '-'],
        ['badge.update(options)', '更新徽标', 'method', '-']
      ]) +
    '</div>';
  };

  // -- NoData --
  DEMOS.nodata = function () {
    var folderSvg = "<svg width='52' height='52' viewBox='0 0 48 48' fill='none'>" +
      "<path d='M6 12a3 3 0 0 1 3-3h9l3.5 4H39a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z' fill='#f7cd67' stroke='#794f27' stroke-width='2.2' stroke-linejoin='round'/>" +
      "<path d='M6 18h36' stroke='#794f27' stroke-width='2.2'/></svg>";
    return '<div class="demo-section">' +
      '<div class="demo-section-title">NoData <span class="demo-tag">空态</span></div>' +
      '<div class="demo-label">原生图标空态：空纸箱 / 搜索</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:24px">' +
        '<div data-ai="no-data" data-bordered="true" data-title="这里还是空白的一页" data-description="记录下一件小事，让海岛的故事慢慢展开。"></div>' +
        '<div data-ai="no-data" data-variant="search" data-bordered="true" data-title="暂时没有找到" data-description="换个关键词试试，也许会有新的发现。"></div>' +
      '</div>' +
      '<div class="demo-label">基础空态</div>' +
      '<div data-ai="no-data" data-description="这里还没有记录，新的故事可以从现在开始。"></div>' +
      '<div class="demo-label">搜索无结果与恢复</div>' +
      '<div class="ai-input-wrapper" style="max-width:320px"><input class="ai-input" id="nodata-query" placeholder="搜索岛屿名称" value="星星"></div>' +
      '<div id="nodata-status" role="status" style="margin-top:12px"></div>' +
      '<div id="nodata-list" style="margin-top:8px"></div>' +
      '<div id="nodata-search-mount"></div>' +
      '<div class="demo-label">表格内的简洁空态</div>' +
      '<div id="nodata-table-wrapper"></div>' +
      '<button class="ai-btn ai-btn--sm ai-btn--default" id="nodata-reset-btn" style="margin-top:12px;display:none">重新体验空态</button>' +
      '<div class="demo-label">尺寸与自定义内容</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:20px">' +
        '<div data-ai="no-data" data-size="small" data-bordered="true" data-title="小尺寸" data-description="适合列表与卡片内部"></div>' +
        '<div data-ai="no-data" data-bordered="true" data-title="标准尺寸" data-description="适合常规内容区"></div>' +
        '<div data-ai="no-data" data-size="large" data-bordered="true" data-title="大尺寸" data-description="适合整页空态"></div>' +
      '</div>' +
      '<div data-ai="no-data" style="margin-top:24px" data-icon="' + esc(folderSvg) + '" data-title="收藏夹还是空的" data-description="遇到喜欢的内容时，记得收藏到这里。"></div>' +
      '<div data-ai="no-data" style="margin-top:24px" data-icon="null" data-title="仅文字提示" data-description="图标、标题、说明和操作区都可以单独配置。"></div>' +
      codeL('<div data-ai="no-data" data-description="这里还没有记录"></div>\n\n// JS 模式\nnew AI.NoData(el, {\n  variant: "search",     // default / search / simple\n  size: "medium",        // small / medium / large\n  title: "没有找到相关结果",\n  description: "试试其他关键词。",\n  icon: null,            // null 隐藏图标\n  extra: \'<button class="ai-btn ai-btn--md ai-btn--primary">清除搜索</button>\',\n  bordered: true\n});') +
      apiT([
        ['variant', '默认 / 搜索无结果 / 简洁', "'default' | 'search' | 'simple'", "'default'"],
        ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
        ['title', '标题，null 隐藏', 'string', '暂无数据 / 没有找到相关结果'],
        ['description', '补充说明', 'string', '-'],
        ['icon', '自定义装饰图标，null / false 隐藏', 'string(html)', '空纸箱 / 搜索图标'],
        ['extra / children', '操作区，extra 优先；推荐复用 Button', 'string(html)', '-'],
        ['bordered', '奶油背景与沙色虚线边框', 'boolean', 'false'],
        ['nodata.update(options)', '更新内容', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Rate --
  DEMOS.rate = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Rate <span class="demo-tag">评分</span></div>' +
      '<div class="demo-label">基础用法（受控）— 点击星星评分</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前评分：<span id="rate-score-text" style="color:#19c8b9;font-weight:600">还不错</span></div>' +
      '<div id="rate-score-mount"></div>' +
      '<div class="demo-label">悬停预览 + 再次点击清空（allowClear 默认开启）</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前评分：<span id="rate-clearable-text" style="color:#19c8b9;font-weight:600">4 星</span></div>' +
      '<div id="rate-clearable-mount"></div>' +
      '<div class="demo-label">allowClear=false — 再次点击同一颗星不清空</div>' +
      '<div data-ai="rate" data-default-value="3" data-size="large" data-allow-clear="false"></div>' +
      '<div class="demo-label">三种尺寸</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">' +
        '<div data-ai="rate" data-default-value="5" data-size="small"></div>' +
        '<div data-ai="rate" data-default-value="4"></div>' +
        '<div data-ai="rate" data-default-value="3" data-size="large"></div>' +
      '</div>' +
      '<div class="demo-label">自定义星星数量（count=10）</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前评分：<span id="rate-count-text" style="color:#19c8b9;font-weight:600">7 / 10</span></div>' +
      '<div id="rate-count-mount"></div>' +
      '<div class="demo-label">只读 — 用于展示已有评分，不响应点击与悬停</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">' +
        '<div data-ai="rate" data-default-value="5" data-readonly="true"></div>' +
        '<div data-ai="rate" data-default-value="3" data-size="small" data-readonly="true"></div>' +
        '<div data-ai="rate" data-default-value="2" data-size="large" data-readonly="true"></div>' +
      '</div>' +
      codeL('new AI.Rate(el, {\n  value: 3,              // 受控\n  onChange: function (v) {\n    rate.setValue(v);    // 受控时同步回写\n  }\n});\n\n// 非受控 + 尺寸\nnew AI.Rate(el, { defaultValue: 4, size: "large" });\n// 自定义星星数量\nnew AI.Rate(el, { count: 10, defaultValue: 7 });\n// 只读展示\nnew AI.Rate(el, { defaultValue: 5, readonly: true });\n\n// data 属性模式\n// <div data-ai="rate" data-default-value="4" data-size="large"></div>') +
      apiT([
        ['value', '当前评分（受控）', 'number', '-'],
        ['defaultValue', '默认评分（非受控）', 'number', '0'],
        ['count', '星星总数', 'number', '5'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['readonly', '只读，仅展示不可交互', 'boolean', 'false'],
        ['allowClear', '再次点击同一颗星时清空评分', 'boolean', 'true'],
        ['onChange', '评分变化回调，清空时为 0', '(value: number) => void', '-'],
        ['setValue(value)', '更新评分', 'method', '-']
      ]) +
    '</div>';
  };

  // -- Pagination --
  DEMOS.pagination = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Pagination <span class="demo-tag">分页</span> <span class="demo-tag">受控 / 非受控</span></div>' +
      '<div class="demo-label">基础用法</div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<span class="demo-tag">orange（默认）</span>' +
          '<div data-ai="pagination" data-total="85" data-default-page-size="10" data-default-current="4"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<span class="demo-tag">teal</span>' +
          '<div data-ai="pagination" data-total="85" data-default-page-size="10" data-default-current="4" data-variant="teal"></div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">总条数 + 每页条数切换</div>' +
      '<div data-ai="pagination" data-total="85" data-default-current="3" data-show-total="true" data-show-size-changer="true" data-page-size-options="[10,20,50]"></div>' +
      '<div class="demo-label">快速跳转（受控）</div>' +
      '<div id="pagination-jumper-mount"></div>' +
      '<div class="demo-label">禁用</div>' +
      '<div data-ai="pagination" data-total="85" data-default-current="4" data-disabled="true"></div>' +
      '<div class="demo-label">配合 Table（客户端分页切片）</div>' +
      '<div id="pagination-table-mount"></div>' +
      '<div id="pagination-table-pager" style="margin-top:12px"></div>' +
      codeL('new AI.Pagination(el, {\n  total: 500,\n  current: page,          // 受控\n  pageSize: size,\n  showTotal: true,\n  showQuickJumper: true,\n  onChange: function (p, s) {\n    pagination.update({ current: p, pageSize: s });\n  }\n});\n\n// data 属性模式\n// <div data-ai="pagination" data-total="85" data-default-current="4"></div>') +
      apiT([
        ['total', '数据总数', 'number', '-', true],
        ['current', '当前页（受控）', 'number', '-'],
        ['defaultCurrent', '默认当前页', 'number', '1'],
        ['pageSize', '每页条数（受控）', 'number', '-'],
        ['defaultPageSize', '默认每页条数', 'number', '10'],
        ['onChange', '页码或每页条数变化回调', '(page, pageSize) => void', '-'],
        ['onShowSizeChange', '每页条数变化回调', '(current, size) => void', '-'],
        ['showSizeChanger', '是否显示每页条数切换器', 'boolean', 'false'],
        ['pageSizeOptions', '可选的每页条数列表', 'number[]', '[10, 20, 50, 100]'],
        ['showQuickJumper', '是否显示快速跳转输入框', 'boolean', 'false'],
        ['showTotal', '是否显示总条数文本', 'boolean', 'false'],
        ['disabled', '是否禁用', 'boolean', 'false'],
        ['variant', '配色：orange 琥珀橘（默认）/ teal 青', "'orange' | 'teal'", "'orange'"]
      ]) +
    '</div>';
  };

  // -- Image --
  DEMOS.image = function () {
    var IMG = 'assets/img/demo/';
    var COLORS_IMAGE = [
      ['white', 'White 白色'],
      ['default', 'Default 奶油色'],
      ['app-pink', 'App Pink 应用粉'],
      ['purple', 'Purple 紫色'],
      ['app-blue', 'App Blue 应用蓝'],
      ['app-yellow', 'App Yellow 应用黄'],
      ['app-orange', 'App Orange 应用橙'],
      ['app-teal', 'App Teal 应用青'],
      ['app-green', 'App Green 应用绿'],
      ['app-red', 'App Red 应用红'],
      ['lime-green', 'Lime Green 青柠绿'],
      ['yellow-green', 'Yellow-Green 黄绿色'],
      ['brown', 'Brown 棕色'],
      ['warm-peach-pink', 'Warm Peach Pink 暖桃粉']
    ];
    var colorPhotos = ['photo-05.jpg', 'photo-06.jpg', 'photo-07.jpg', 'photo-08.jpg', 'photo-09.jpg', 'photo-10.jpg',
      'photo-11.jpg', 'photo-12.jpg', 'photo-13.jpg', 'lake-morning.jpg', 'sunny-field.jpg', 'hillside-town.jpg',
      'content_bg_pc.jpg', 'photo-01.jpg'];
    var colorHtml = COLORS_IMAGE.map(function (c, i) {
      return '<div style="text-align:center">' +
        '<div data-ai="image" data-src="' + IMG + colorPhotos[i % colorPhotos.length] + '" data-alt="' + c[1] + '" data-width="300" data-height="200" data-color="' + c[0] + '" data-variant="bordered" data-lazy="true"></div>' +
        '<div style="font-size:12px;color:#a0936e;margin-top:6px">' + c[1] + '</div>' +
        '</div>';
    }).join('');
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Image <span class="demo-tag">13 props</span></div>' +
      '<div class="demo-label">点击预览（preview 默认开启，点击图片弹出大图，ESC / 遮罩 / 关闭按钮均可关闭）</div>' +
      '<div class="demo-row">' +
        '<div data-ai="image" data-src="' + IMG + 'photo-01.jpg" data-alt="点击预览大图" data-width="330" data-height="200" data-lazy="true"></div>' +
      '</div>' +
      '<div class="demo-label">相框类型（variant）— default 卡片大阴影+大圆角（默认），bordered 柔和阴影+小圆角</div>' +
      '<div class="demo-row">' +
        '<div style="text-align:center">' +
          '<div data-ai="image" data-src="' + IMG + 'photo-02.jpg" data-alt="默认类型" data-width="330" data-height="200" data-variant="default" data-lazy="true"></div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:6px">default（默认）</div>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div data-ai="image" data-src="' + IMG + 'photo-03.jpg" data-alt="边框类型" data-width="330" data-height="200" data-variant="bordered" data-lazy="true"></div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:6px">bordered（边框）</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">邮票类型（variant=stamp）— 四周齿孔 + 暖白底纸 + 半色调网点；可选 stampYear 在右上角印发行年份</div>' +
      '<div class="demo-row">' +
        '<div style="text-align:center">' +
          '<div data-ai="image" data-src="' + IMG + 'photo-02.jpg" data-alt="邮票（带年份）" data-width="210" data-height="154" data-variant="stamp" data-stamp-year="2026" data-lazy="true"></div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:6px">带年份</div>' +
        '</div>' +
        '<div style="text-align:center">' +
          '<div data-ai="image" data-src="' + IMG + 'photo-03.jpg" data-alt="纯邮票边框" data-width="210" data-height="154" data-variant="stamp" data-lazy="true"></div>' +
          '<div style="font-size:12px;color:#a0936e;margin-top:6px">仅齿孔边框（无文字）</div>' +
        '</div>' +
      '</div>' +
      '<div class="demo-label">基础用法（自定义宽高）</div>' +
      '<div class="demo-row">' +
        '<div data-ai="image" data-src="' + IMG + 'photo-04.jpg" data-alt="林间溪流" data-width="330" data-height="200" data-lazy="true"></div>' +
        '<div data-ai="image" data-src="' + IMG + 'sunny-field.jpg" data-alt="阳光田野" data-width="480" data-height="300" data-lazy="true"></div>' +
      '</div>' +
      '<div class="demo-label">背景颜色（color，Card pattern 同款底色，无花纹）</div>' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' + colorHtml + '</div>' +
      '<div class="demo-label">懒加载（lazy，滚动到视口附近才加载）</div>' +
      '<div data-ai="image" data-src="' + IMG + 'lake-morning.jpg" data-alt="晨光湖面" data-width="360" data-height="230" data-lazy="true"></div>' +
      '<div class="demo-label">错误占位（加载失败时显示占位）</div>' +
      '<div class="demo-row">' +
        '<div data-ai="image" data-src="./no-such-image.png" data-alt="加载失败" data-width="210" data-height="210"></div>' +
      '</div>' +
      codeL('// data 属性模式\n<div data-ai="image" data-src="photo.png" data-alt="岛屿风景" data-width="330" data-height="200"></div>\n\n// JS 模式\nnew AI.Image(el, {\n  src: "photo.png",\n  alt: "岛屿风景",\n  width: 200, height: 150,\n  variant: "stamp",      // default / bordered / stamp\n  stampYear: "2026",     // 邮票右上角年份\n  color: "app-teal",     // 14 种底色\n  lazy: true,            // 懒加载\n  preview: true          // 点击大图预览\n});') +
      apiT([
        ['src', '图片地址', 'string', '-', true],
        ['alt', '图片替代文本（无障碍）；留空表示装饰性图片', 'string', "''"],
        ['width', '图片宽度', 'number | string', '-'],
        ['height', '图片高度', 'number | string', '-'],
        ['color', '背景颜色（Card pattern 同款底色，无花纹）', "white / default / app-pink / purple / app-blue / app-yellow / app-orange / app-teal / app-green / app-red / lime-green / yellow-green / brown / warm-peach-pink", "'white'"],
        ['variant', "相框类型：'default' 卡片大阴影+大圆角（默认），'bordered' 柔和阴影+小圆角，'stamp' 邮票齿孔边框", "'default' | 'bordered' | 'stamp'", "'default'"],
        ['stampYear', "邮票类型（variant='stamp'）下的发行年份，印在右上角照片上", 'string', '-'],
        ['lazy', '是否启用懒加载', 'boolean', 'false'],
        ['preview', '点击图片弹出大图预览（默认开启；支持 ESC / 点击遮罩 / 关闭按钮）', 'boolean', 'true']
      ]) +
    '</div>';
  };

  // -- Carousel --
  DEMOS.carousel = function () {
    var IMG = 'assets/img/demo/';
    var slides = [
      { src: IMG + 'hillside-town.jpg', title: '山坡小筑', desc: '沿坡而建的小镇，屋顶连成一片暖色。' },
      { src: IMG + 'sunny-field.jpg', title: '阳光田野', desc: '风掠过田野，草浪一层层推向天边。' },
      { src: IMG + 'lake-morning.jpg', title: '晨光湖面', desc: '湖面倒映天光，晨雾如薄纱浮在水上。' }
    ];
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Carousel <span class="demo-tag">轮播图</span> <span class="demo-tag">键盘可用</span></div>' +
      '<div class="demo-label">自动播放（悬停或聚焦时暂停）</div>' +
      '<div data-ai="carousel" data-autoplay="true" data-interval="3500" data-aria-label="岛屿风景" style="max-width:760px" data-items=\'' +
        JSON.stringify(slides) + '\'></div>' +
      codeL('// data 属性模式（items 为 JSON 数组）\n<div data-ai="carousel" data-autoplay="true" data-interval="3500"\n  data-items=\'[{"src":"beach.jpg","title":"海滩","desc":"..."}]\'></div>\n\n// JS 模式：已有子元素折叠为轮播页\nnew AI.Carousel(el, { autoplay: true, interval: 3500 });\n\n// 受控\nnew AI.Carousel(el, { activeIndex: current, onChange: function (i) { ... } });') +
      apiT([
        ['items', '轮播内容数组（string / { html } / { src, title, desc }）；未传则折叠已有子元素', 'array', '-', true],
        ['activeIndex', '当前索引（受控）', 'number', '-'],
        ['defaultActiveIndex', '初始索引', 'number', '0'],
        ['onChange', '切换回调', '(index: number) => void', '-'],
        ['autoplay', '自动播放', 'boolean', 'false'],
        ['interval', '自动播放间隔（ms）', 'number', '3000'],
        ['loop', '首尾循环', 'boolean', 'true'],
        ['showArrows', '显示箭头', 'boolean', 'true'],
        ['showDots', '显示圆点', 'boolean', 'true'],
        ['pauseOnHover', '悬停或聚焦时暂停', 'boolean', 'true']
      ]) +
    '</div>';
  };

  // -- Countdown --
  DEMOS.countdown = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Countdown <span class="demo-tag">倒计时</span> <span class="demo-tag">实时更新</span></div>' +
      '<div class="demo-label">活动倒计时</div>' +
      '<div id="countdown-main-mount"></div>' +
      '<div style="margin-top:16px"><button id="countdown-reset-btn" class="ai-btn ai-btn--sm ai-btn--primary">重新计时</button></div>' +
      '<div class="demo-label">default 风格</div>' +
      '<div id="countdown-default-mount"></div>' +
      '<div class="demo-label">无边框 / 带边框</div>' +
      '<div class="demo-row">' +
        '<div data-ai="countdown" data-value="now+90061000" data-format="HH:mm:ss"></div>' +
        '<div data-ai="countdown" data-value="now+90061000" data-format="HH:mm:ss" data-bordered="true"></div>' +
        '<div data-ai="countdown" data-value="now+90061000" data-format="HH:mm:ss" data-variant="island"></div>' +
        '<div data-ai="countdown" data-value="now+90061000" data-format="HH:mm:ss" data-variant="island" data-bordered="true"></div>' +
      '</div>' +
      '<div class="demo-label">onFinish 回调</div>' +
      '<div id="countdown-finish-mount"></div>' +
      '<div style="margin-top:16px"><button id="countdown-restart-btn" class="ai-btn ai-btn--sm ai-btn--primary">再来 10 秒</button></div>' +
      '<div class="demo-label">尺寸</div>' +
      '<div class="demo-row">' +
        '<div data-ai="countdown" data-value="now+90061000" data-size="small"></div>' +
        '<div data-ai="countdown" data-value="now+90061000"></div>' +
        '<div data-ai="countdown" data-value="now+90061000" data-size="large"></div>' +
      '</div>' +
      codeL('new AI.Countdown(el, {\n  value: Date.now() + 24 * 60 * 60 * 1000,\n  format: "DD 天 HH:mm:ss",\n  prefix: "活动结束还有",\n  variant: "island",\n  onFinish: function () { /* 倒计时结束 */ }\n});') +
      // -- 分阶段颜色提醒 --
      '<div class="demo-section-title" style="margin-top:36px">新增示例：分阶段颜色提醒</div>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="65">重置为 65 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="60">重置为 60 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="15">重置为 15 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="10">重置为 10 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="5">重置为 5 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-cd-seconds="0">归零</button>' +
      '</div>' +
      '<div class="demo-label">默认提醒：60 秒内橙色，10 秒内红色，归零保留红色</div>' +
      '<div id="countdown-reminder-default-mount"></div>' +
      '<div class="demo-label">自定义提醒：20 秒内暖棕色，5 秒内莓红色</div>' +
      '<div id="countdown-reminder-custom-mount"></div>' +
      '<div class="demo-label">关闭提醒：保留原有数字配色</div>' +
      '<div id="countdown-reminder-off-mount"></div>' +
      codeL('// 开启默认提醒：60 秒橙色，10 秒红色\nnew AI.Countdown(el, { value: deadline, reminder: true });\n\n// 自定义阈值（单位：秒）与颜色，数组替换全部默认规则\nnew AI.Countdown(el, {\n  value: deadline,\n  reminder: [\n    { seconds: 120, color: "#c77c34" },\n    { seconds: 30, color: "#b25770" }\n  ]\n});') +
      // -- 最后几秒的紧迫提醒 --
      '<div class="demo-section-title" style="margin-top:36px">新增示例：最后几秒的紧迫提醒</div>' +
      '<p class="demo-label" style="margin-bottom:12px">最后 5 秒轻抖，最后 3 秒节奏加快，归零后自动停下。</p>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--sm" data-shake-seconds="12">开始 12 秒倒计时</button>' +
        '<button class="ai-btn ai-btn--sm" data-shake-seconds="5">体验最后 5 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-shake-seconds="0">立即归零</button>' +
        '<button id="countdown-shake-toggle" class="ai-btn ai-btn--sm" aria-pressed="true">关闭抖动</button>' +
      '</div>' +
      '<div class="demo-label">默认阈值：最后 5 秒，叠加橙色 / 红色提醒</div>' +
      '<div id="countdown-shake-default-mount"></div>' +
      '<div class="demo-label">自定义阈值：最后 8 秒，海岛风格</div>' +
      '<div id="countdown-shake-custom-mount"></div>' +
      '<div class="demo-label">仅颜色提醒：关闭抖动</div>' +
      '<div id="countdown-shake-off-mount"></div>' +
      '<p class="demo-label" id="countdown-shake-status" role="status" style="margin-top:12px">倒计时进行中，进入对应阈值后开始抖动。系统开启“减少动态效果”时保留颜色提醒，关闭抖动。</p>' +
      codeL('// 开启颜色提醒 + 最后 5 秒抖动\nnew AI.Countdown(el, { value: deadline, reminder: true, shake: true });\n\n// 自定义为最后 8 秒，最后 3 秒自动加快\nnew AI.Countdown(el, { value: deadline, reminder: true, shake: 8 });\n\n// 只保留颜色提醒\nnew AI.Countdown(el, { value: deadline, reminder: true, shake: false });') +
      // -- 归零后的收尾动效 --
      '<div class="demo-section-title" style="margin-top:36px">新增示例：归零后的收尾动效</div>' +
      '<p class="demo-label" style="margin-bottom:12px">数字轻压回弹，两道柔和波纹向外扩散，播放一次后安静停在零。</p>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--sm" data-finish-seconds="5">体验完整 5 秒</button>' +
        '<button class="ai-btn ai-btn--sm" data-finish-seconds="1">快速体验归零</button>' +
        '<button class="ai-btn ai-btn--sm" data-finish-seconds="12">重新计时 12 秒</button>' +
        '<button id="countdown-finish-toggle" class="ai-btn ai-btn--sm" aria-pressed="true">关闭归零动效</button>' +
      '</div>' +
      '<div class="demo-label">默认风格：颜色提醒、最后几秒抖动、归零收尾</div>' +
      '<div id="countdown-fx-default-mount"></div>' +
      '<div class="demo-label">海岛风格：使用相同动效节奏</div>' +
      '<div id="countdown-fx-island-mount"></div>' +
      '<p class="demo-label" id="countdown-fx-status" role="status" style="margin-top:12px">倒计时进行中…系统开启“减少动态效果”时，用轻微淡入代替回弹和波纹。</p>' +
      codeL('// 颜色提醒 → 最后几秒抖动 → 归零收尾\nnew AI.Countdown(el, { value: deadline, reminder: true, shake: true, finishAnimation: true });\n\n// 也可以单独开启归零动效\nnew AI.Countdown(el, { value: deadline, finishAnimation: true });') +
      // -- 全配置动效 --
      '<div class="demo-section-title" style="margin-top:36px">新增示例：最后几秒持续回弹与波纹</div>' +
      '<p class="demo-label" style="margin-bottom:12px">最后几秒反复回弹、扩散波纹，归零再收尾一次。各组效果可单独开关与配置。</p>' +
      '<div class="demo-row">' +
        '<button class="ai-btn ai-btn--sm" id="countdown-motion-12s">开始 12 秒体验</button>' +
        '<button class="ai-btn ai-btn--sm" id="countdown-motion-last">直接体验最后几秒</button>' +
        '<button class="ai-btn ai-btn--sm" id="countdown-motion-20s">重置到 20 秒</button>' +
      '</div>' +
      '<div style="margin:24px 0"><div id="countdown-motion-mount"></div></div>' +
      '<div class="demo-row" style="gap:18px;margin:20px 0">' +
        '<label class="demo-check"><span>最后几秒动效</span><button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-motion-switch="ending"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>' +
        '<label class="demo-check"><span>抖动</span><button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-motion-switch="shake"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>' +
        '<label class="demo-check"><span>回弹</span><button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-motion-switch="bounce"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>' +
        '<label class="demo-check"><span>波纹</span><button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-motion-switch="ripple"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>' +
        '<label class="demo-check"><span>归零动效</span><button class="ai-switch ai-switch--checked" role="switch" aria-checked="true" data-motion-switch="finish"><span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>' +
      '</div>' +
      '<div id="countdown-motion-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px"></div>' +
      '<p class="demo-label">循环间隔不会短于完整动效；波纹数量或延迟增加时，会自动留足播放时间。系统减少动态效果时停止循环运动。</p>' +
      '<pre id="countdown-motion-json" style="background:#fffdf7;border:1.5px solid #e8dcc8;border-radius:10px;padding:14px;font-size:12px;line-height:1.6;color:#725d42;overflow:auto;margin:0 0 16px"></pre>' +
      '<div class="demo-label">动效对象参数：无前缀的字段由 endingAnimation 与 finishAnimation 共用，可分别配置</div>' +
      apiT([
        ['shake.seconds / urgentSeconds', '抖动 / 加强阈值；0 关闭对应阶段', 'number', '5 / 3'],
        ['shake.duration / urgentDuration', '普通 / 加强周期（ms）', 'number', '1000 / 650'],
        ['shake.distance / urgentDistance', '普通 / 加强位移（px）', 'number', '1.5 / 2.5'],
        ['shake.rotation / urgentRotation', '普通 / 加强旋转（度）', 'number', '0.6 / 0.9'],
        ['endingAnimation.seconds / interval', '最后几秒触发 / 循环间隔（ms），间隔不短于完整动效', 'number', '5 / 1000'],
        ['duration', '单次保留时间（ms），自动扩展以覆盖全部子动画', 'number', '900'],
        ['bounce', '数字回弹开关或配置对象', 'boolean | object', 'true'],
        ['bounce.pressScale / popScale', '轻压 / 弹起缩放比例', 'number', '0.94 / 1.05'],
        ['bounce.pressOffset / popOffset', '轻压 / 弹起纵向偏移（px），正值向下', 'number', '1 / -2'],
        ['ripple.count / duration / delay', '数量（0-10）/ 每道时长（ms）/ 相邻延迟（ms）', 'number', '2 / 600 / 150'],
        ['ripple.color / opacity', 'CSS 颜色 / 初始透明度（0-1）', 'string / number', '提醒色或主色 / 0.45'],
        ['ripple.width / offset / radius', '线宽 / 外间距 / 圆角（px）', 'number', '2 / 5 / 16'],
        ['ripple.startScale / scaleX / scaleY', '起始缩放 / 结束横向缩放 / 结束纵向缩放', 'number', '0.98 / 1.08 / 1.35'],
        ['reducedMotion', '系统减少动态效果时，归零改为淡入或完全关闭', "'fade' | 'none'", "'fade'"],
        ['fadeDuration / fadeOpacity', '归零替代淡入时长（ms）/ 初始透明度', 'number', '250 / 0.65']
      ]) +
      apiT([
        ['value', '结束时间', 'number | Date', '-', true],
        ['format', 'DD / HH / mm / ss 格式模板', 'string', "'HH:mm:ss'"],
        ['prefix', '倒计时前的说明内容', 'string', '-'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['variant', '显示风格', "'default' | 'island'", "'default'"],
        ['bordered', '数字块是否带边框', 'boolean', 'false'],
        ['reminder', 'true 开启默认提醒（60 秒橙色 / 10 秒红色），数组自定义秒数与颜色', 'boolean | array', 'false'],
        ['shake', '兼容布尔值与秒数；对象自定义阈值、加强阶段、速度、幅度与缓动', 'boolean | number | object', 'false'],
        ['endingAnimation', '最后几秒循环回弹与波纹，true 默认最后 5 秒每秒一次', 'boolean | object', 'false'],
        ['finishAnimation', '实际归零时播放一次，支持自定义回弹、波纹、时长', 'boolean | object', 'false'],
        ['onChange', '剩余毫秒变化回调', '(remaining: number) => void', '-'],
        ['onFinish', '归零回调', '() => void', '-']
      ]) +
    '</div>';
  };

  // -- CountUp --
  DEMOS.countup = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">CountUp <span class="demo-tag">数字滚动</span> <span class="demo-tag">游戏结算</span></div>' +
      '<div class="demo-label">游戏结算：从 0 滚到本局总分，结束时庆祝一下</div>' +
      '<div id="countup-score-mount"></div>' +
      '<div style="margin-top:16px"><button id="countup-settle-btn" class="ai-btn ai-btn--sm ai-btn--primary">再来一局</button></div>' +
      '<div class="demo-label">累加计数：每捡一次木头 +15，接着上一个数往上滚</div>' +
      '<div class="demo-row">' +
        '<div id="countup-wood-mount"></div>' +
        '<button id="countup-wood-add" class="ai-btn ai-btn--sm ai-btn--primary">捡到木头 +15</button>' +
        '<button id="countup-wood-reset" class="ai-btn ai-btn--sm">重置</button>' +
      '</div>' +
      '<div class="demo-label">庆祝动效：celebrate 开启，传 text 可以放任意文案</div>' +
      '<div class="demo-row" style="gap:24px">' +
        '<div id="countup-celebrate-plain-mount"></div>' +
        '<div id="countup-celebrate-perfect-mount"></div>' +
        '<div id="countup-celebrate-ding-mount"></div>' +
      '</div>' +
      '<div style="margin-top:16px"><button id="countup-celebrate-replay" class="ai-btn ai-btn--sm ai-btn--primary">重播</button></div>' +
      '<div class="demo-label">格式化：千分位 / 小数位 / 前后缀</div>' +
      '<div class="demo-row" style="gap:20px">' +
        '<div id="countup-fmt-thousand-mount"></div>' +
        '<div id="countup-fmt-decimal-mount"></div>' +
        '<div id="countup-fmt-prefix-mount"></div>' +
        '<div id="countup-fmt-separator-mount"></div>' +
      '</div>' +
      '<div style="margin-top:16px"><button id="countup-fmt-replay" class="ai-btn ai-btn--sm ai-btn--primary">重播</button></div>' +
      '<div class="demo-label">缓动曲线（同为 2 秒 7890 分）</div>' +
      '<div class="demo-row" style="gap:20px">' +
        '<div id="countup-ease-linear-mount"></div>' +
        '<div id="countup-ease-cubic-mount"></div>' +
        '<div id="countup-ease-expo-mount"></div>' +
      '</div>' +
      '<div style="margin-top:16px"><button id="countup-ease-replay" class="ai-btn ai-btn--sm ai-btn--primary">重播</button></div>' +
      '<div class="demo-label">尺寸 / 风格 / 边框</div>' +
      '<div class="demo-row">' +
        '<div data-ai="countup" data-end="960" data-duration="1.5" data-is-counting="true" data-size="small"></div>' +
        '<div data-ai="countup" data-end="960" data-duration="1.5" data-is-counting="true"></div>' +
        '<div data-ai="countup" data-end="960" data-duration="1.5" data-is-counting="true" data-size="large"></div>' +
        '<div data-ai="countup" data-end="960" data-duration="1.5" data-is-counting="true" data-variant="island"></div>' +
        '<div data-ai="countup" data-end="960" data-duration="1.5" data-is-counting="true" data-variant="island" data-bordered="true"></div>' +
      '</div>' +
      '<div class="demo-label">formatter 渲染函数：接管数字渲染，reset 可交给外部按钮重播</div>' +
      '<div class="demo-row">' +
        '<div id="countup-children-mount"></div>' +
        '<button id="countup-children-reset" class="ai-btn ai-btn--sm">重播本关计数</button>' +
      '</div>' +
      codeL('// 游戏结算页：从 0 滚到总分，结束时庆祝一下\nnew AI.CountUp(el, {\n  isCounting: true, end: score, duration: 2,\n  thousandsSeparator: ",", suffix: "分",\n  size: "large", variant: "island", celebrate: true\n});\n\n// 想要贴纸就传 text，文案随意\nnew AI.CountUp(el, { isCounting: true, end: score, celebrate: { text: "完美！" } });\n\n// 累加：捡材料时 start / end 一起往后挪，就从上一段接着涨\nwoodCountUp.update({ start: Math.max(0, wood - 15), end: wood });\n\n// formatter 完全接管数字渲染\nnew AI.CountUp(el, {\n  isCounting: true, end: 86, duration: 1.2,\n  formatter: function (v) { return "第 " + Math.round(v) + " 关"; }\n});') +
      apiT([
        ['end', '目标值（本局总分）', 'number', '-', true],
        ['start', '起始值', 'number', '0'],
        ['duration', '动画时长（秒），0 表示直接到位', 'number', '2'],
        ['isCounting', '是否正在计数；置 false 暂停并保留当前值，再置 true 从暂停处继续', 'boolean', 'false'],
        ['decimalPlaces', '小数位数，默认取 start / end 中较大的小数位数', 'number', '-'],
        ['decimalSeparator', '小数点符号', 'string', "'.'"],
        ['thousandsSeparator', '千分位符号', 'string', "''"],
        ['easing', '缓动曲线，或自定义 (progress) => number', 'linear / easeInCubic / easeOutCubic / easeInOutCubic / easeOutExpo / function', "'easeOutCubic'"],
        ['formatter', '完全自定义数字格式化，优先级最高', '(value: number) => string', '-'],
        ['updateInterval', '展示值刷新间隔（秒），0 表示每帧刷新', 'number', '0'],
        ['prefix / suffix', '数字前后缀，如 ¥ / 分', 'string', '-'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['variant', '显示风格', "'default' | 'island'", "'default'"],
        ['bordered', '数字块是否带边框', 'boolean', 'false'],
        ['celebrate', '计数结束后的庆祝动效：数字弹跳 + 光环 + 星芒；传 text 会额外弹出一张文案贴纸', 'boolean | { text }', 'false'],
        ['onUpdate', '展示值更新时触发（每帧）', '(value: number) => void', '-'],
        ['onComplete', '计数结束时触发，返回 { shouldRepeat, delay, newStartAt } 可重播', '(elapsedTime: number) => result', '-'],
        ['reset(newStartAt)', '重置到起始值并重新播放', 'method', '-']
      ]) +
    '</div>';
  };

  /* ---------- Background ---------- */
  DEMOS.background = function () {
    var BG_TYPES = [
      ['default', '奶油色波点（默认）', '#725d42'],
      ['grid', '网格', '#725d42'],
      ['dots-dark-green', '深绿波点', '#3a6b3a'],
      ['sprinkles', '彩色针糖', '#725d42'],
      ['sweet-corner', '甜点街角', '#725d42'],
      ['coffee-break', '咖啡时光', '#725d42'],
      ['dots-pink', '应用粉', '#a85565'],
      ['dots-purple', '紫色', '#6a3a9a'],
      ['dots-blue', '应用蓝', '#4a5a8a'],
      ['dots-yellow', '应用黄', '#7a6528'],
      ['dots-orange', '应用橙', '#8a4a2a'],
      ['dots-teal', '应用青', '#2a6b5a'],
      ['dots-green', '应用绿', '#3a6b3a'],
      ['dots-red', '应用红', '#9a3a3a'],
      ['dots-lime-green', '青柠绿', '#5a6b28'],
      ['dots-yellow-green', '黄绿色', '#6a5a28'],
      ['dots-brown', '棕色', '#5a4a2a'],
      ['dots-warm-peach-pink', '暖桃粉', '#8a4a2a'],
      ['dots-gray', '浅灰波点', '#5a5a5a']
    ];
    var tiles = '';
    BG_TYPES.forEach(function (t) {
      var isScene = t[0] === 'sweet-corner' || t[0] === 'coffee-break';
      var w = (t[0] === 'sprinkles' || isScene) ? 348 : 168;
      tiles += '<div class="ai-background ai-bg-' + t[0] + ' demo-bg-tile" data-bg-type="' + t[0] +
        '" style="width:' + w + 'px;height:120px;border-radius:14px;display:grid;place-items:center;' +
        'font-weight:600;color:' + t[2] + (isScene ? ';background-size:240% auto' : '') + '">' +
        '<span style="text-align:center;line-height:1.5"><span style="display:block;font-size:14px">' + t[0] +
        '</span><span style="display:block;font-size:12px;opacity:.85">' + t[1] + '</span></span></div>';
    });
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Background <span class="demo-tag">19 types</span> <span class="demo-tag">Card pattern 底色同款</span> <span class="demo-tag">无外部图片资源</span></div>' +
      '<div class="demo-label">全部类型（hover 任意色块可整站预览该壁纸，移开自动还原）</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px">' + tiles + '</div>' +
      '<div class="demo-label" style="margin-top:24px">承载内容（children 渲染在图案之上）</div>' +
      '<div class="ai-background ai-bg-sprinkles" style="height:180px;border-radius:16px;display:grid;place-items:center;padding:24px;color:#725d42;font-weight:600;font-size:15px">' +
      '<span>卡片内容、表单、图表都可以放在这里</span></div>' +
      codeL('// 奶油色波点壁纸（默认）\n<div data-ai="background" style="height:200px"></div>\n\n// 指定图案：网格 / 彩色针糖 / 场景插画 / 彩点\n<div data-ai="background" data-type="grid" style="height:200px"></div>\n<div data-ai="background" data-type="sprinkles" style="height:200px"></div>\n<div data-ai="background" data-type="sweet-corner" style="height:200px"></div>\n<div data-ai="background" data-type="dots-blue" style="height:200px"></div>\n\n// 也可以直接用类名，不经过 JS 初始化\n<div class="ai-background ai-bg-dots-teal" style="height:200px"></div>') +
      apiT([
        ['type', '背景图案类型（dots-* 底色与 Card pattern-* 系列一致）', "'default' | 'grid' | 'dots-dark-green' | 'sprinkles' | 'sweet-corner' | 'coffee-break' | 'dots-pink' | 'dots-purple' | 'dots-blue' | 'dots-yellow' | 'dots-orange' | 'dots-teal' | 'dots-green' | 'dots-red' | 'dots-lime-green' | 'dots-yellow-green' | 'dots-brown' | 'dots-warm-peach-pink' | 'dots-gray'", "'default'"],
        ['children', '子内容，渲染在图案背景之上', 'HTML', '-'],
        ['className / style', '通用属性', '-', '-']
      ]) +
      '</div>';
  };

  /* ---------- Upload ---------- */
  DEMOS.upload = function () {
    var upIcon = AI.Upload._icon('upload', 14);
    var upIconLg = AI.Upload._icon('upload', 22);
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Upload <span class="demo-tag">上传</span> <span class="demo-tag">拖拽</span> <span class="demo-tag">模拟进度</span> <span class="demo-tag">图片卡片</span></div>' +

      '<div class="demo-label">基础用法 — 点击上传，未接 customRequest 时用定时器模拟进度</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div data-ai="upload" data-tip="模拟上传：每 220ms 增加 12%~20% 的进度，方便联调 UI"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">defaultFileList — 预置已完成文件，onChange 实时收集</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:8px">' +
      '<div id="upload-default-mount"></div>' +
      '<span id="upload-default-count" style="font-size:12px;color:#9f927d">onChange 尚未触发</span>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">drag — 拖拽上传区域</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div data-ai="upload" data-drag="true" data-multiple="true" data-tip="点击虚线框或把文件拖进来均可"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">maxCount + beforeUpload — 数量上限与类型拦截</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div id="upload-guard-mount"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">listType="picture-card" — 图片卡片，最多 4 张，onExceed 提示</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div id="upload-card-mount"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">onPreview — 自定义图片预览（Modal 灯箱）</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div id="upload-preview-mount"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">customRequest — 接入真实上传（示例为慢速模拟）</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div id="upload-custom-mount"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">action — 内置 XHR 真实上传（带进度，删除即中止）</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div data-ai="upload" data-action="https://httpbin.org/post" data-method="POST" data-multiple="true" data-name="file" data-tip="设置 action 后组件用原生 XMLHttpRequest 上传并自动上报进度；失败会进入 error 态"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">children — 自定义触发区</div>' +
      '<div style="max-width:720px;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">' +
      '<div data-ai="upload" data-multiple="true">' +
      '<span class="ai-upload-custom-trigger" style="display:none"><span style="display:inline-flex;align-items:center;gap:8px">' + upIcon + '点击上传头像</span></span>' +
      '</div>' +
      '<div data-ai="upload" data-drag="true">' +
      '<span class="ai-upload-custom-trigger" style="display:none"><span style="display:flex;flex-direction:column;align-items:center;gap:8px;color:#9f927d;font-weight:700">' + upIconLg + '拖拽上传<span style="font-size:12px;font-weight:600;color:#c4b89e">把文件拖进这片空地</span></span></span>' +
      '</div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">showUploadList=false — 只留触发区</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div data-ai="upload" data-show-upload-list="false" data-multiple="true" data-accept="image/*"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">listType="picture" — 行内缩略图列表</div>' +
      '<div style="max-width:720px;display:flex;flex-direction:column;gap:12px">' +
      '<div data-ai="upload" data-list-type="picture" data-accept="image/*" data-multiple="true" data-max-count="4"></div>' +
      '</div>' +

      '<div class="demo-label" style="margin-top:24px">上传进度 — background / bar 两种样式 × 三种列表（预置固定 46% 的文件）</div>' +
      (function () {
        var row = function (mode, lt, label) {
          return '<div style="display:flex;flex-direction:column;gap:6px;min-width:300px">' +
            '<span style="font-size:12px;color:#9f927d">' + label + '</span>' +
            '<div id="upload-progress-' + mode + '-' + lt + '"></div></div>';
        };
        var grid = '';
        ['background', 'bar'].forEach(function (mode) {
          grid += row(mode, 'text', 'progress.type="' + mode + '" + listType="text"');
          grid += row(mode, 'picture', 'progress.type="' + mode + '" + listType="picture"');
          grid += row(mode, 'picture-card', 'progress.type="' + mode + '" + listType="picture-card"');
        });
        return '<div style="display:flex;flex-wrap:wrap;gap:24px">' + grid + '</div>';
      })() +

      codeL('// 基础：onChange 回传 { file, fileList, event }\nnew AI.Upload(el, {\n  multiple: true,\n  accept: "image/*,.pdf",\n  onChange: function (info) { console.log(info.file.name, info.fileList.length); }\n});\n\n// 拖拽 + 数量上限 + 类型拦截\nnew AI.Upload(el, {\n  drag: true, maxCount: 3,\n  beforeUpload: function (file) { return file.size <= 1024 * 1024; }\n});\n\n// 图片卡片 + 点击预览\nnew AI.Upload(el, {\n  listType: "picture-card", accept: "image/*", maxCount: 4,\n  onPreview: function (file) { openLightbox(file.thumbUrl || file.url); }\n});\n\n// 自定义上传（优先级高于 action）\nnew AI.Upload(el, {\n  customRequest: function (options) {\n    var timer = setInterval(function () {\n      options.onProgress({ percent: 50 });\n      options.onSuccess();\n    }, 300);\n  }\n});\n\n// 内置 XHR 真实上传：交给 action，删除文件自动中止\nnew AI.Upload(el, { action: "/api/upload", method: "POST", data: { source: "demo" }, multiple: true });') +
      apiT([
        ['accept', '接受的文件类型，逗号分隔（扩展名或 MIME）', 'string', "''"],
        ['multiple', '是否支持多选', 'boolean', 'false'],
        ['maxCount', '最多文件数；1 表示替换，多值保留最早的上传文件', 'number', '-'],
        ['disabled', '是否禁用', 'boolean', 'false'],
        ['directory', '支持上传文件夹（webkitdirectory）', 'boolean', 'false'],
        ['defaultFileList / fileList', '预置文件列表；传 fileList 为受控模式', 'FileItem[]', '[]'],
        ['listType', '列表样式', "'text' | 'picture' | 'picture-card'", "'text'"],
        ['showUploadList', '是否/如何显示文件列表', 'boolean | { showPreviewIcon, showRemoveIcon }', 'true'],
        ['progress', '上传进度样式；false 关闭', "false | { type: 'bar' | 'background', color, showInfo, duration }", "{ type: 'bar' }"],
        ['drag', '拖拽上传区域', 'boolean', 'false'],
        ['tip', '提示文案（HTML）', 'string', "''"],
        ['children', '自定义触发区 HTML', 'string', '-'],
        ['beforeUpload', '上传前拦截，返回 false 跳过', '(file, fileList) => boolean | File | Promise', '-'],
        ['customRequest', '自定义上传，优先级高于 action', '({ file, onProgress, onSuccess, onError }) => void', '-'],
        ['action / method / name / data', '内置 XHR 上传接口与字段', 'string | object', "'' / 'post' / 'file' / {}"],
        ['onChange', '文件状态变化时触发（select / progress / success / error / removed）', '({ file, fileList, event }) => void', '-'],
        ['onPreview', '点击预览；不传时内置图片灯箱', '(file) => void', '内置预览'],
        ['onRemove', '移除前确认，返回 false 阻止', '(file, fileList) => boolean | void', '-'],
        ['onExceed', '超出 maxCount 时触发', '(files, fileList) => void', '-'],
        ['uploadFiles', '以编程方式添加文件（如粘贴板）', '(files) => void', 'method']
      ]) +
      '</div>';
  };

  /* ---------- DatePicker ---------- */
  DEMOS.datepicker = function () {
    var box = function (inner) {
      return '<div style="padding:16px;border-radius:18px;font-weight:500;margin-bottom:20px">' + inner + '</div>';
    };
    var row = function (inner) {
      return '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">' + inner + '</div>';
    };
    return '<div class="demo-section">' +
      '<div class="demo-section-title">DatePicker <span class="demo-tag">日期</span> <span class="demo-tag">范围选择</span> <span class="demo-tag">月份模式</span> <span class="demo-tag">键盘导航</span></div>' +

      '<div class="demo-label">受控模式 — onChange 回传 YYYY-MM-DD，清空回传 null</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前选中: <span id="dp-ctl-text" style="color:#19c8b9;font-weight:600">2026-08-10</span></div>' +
      box('<div id="dp-ctl-mount"></div>') +

      '<div class="demo-label" style="margin-top:24px">非受控默认值 + 自定义格式</div>' +
      box('<div data-ai="datepicker" data-default-value="2026-08-10" data-format="YYYY年MM月DD日"></div>') +

      '<div class="demo-label" style="margin-top:24px">允许清空 + 禁用日期（周末）</div>' +
      box('<div id="dp-weekend-mount"></div>') +

      '<div class="demo-label" style="margin-top:24px">三种尺寸</div>' +
      row(
        '<div data-ai="datepicker" data-size="small" data-default-value="2026-08-10"></div>' +
        '<div data-ai="datepicker" data-size="middle" data-default-value="2026-08-10"></div>' +
        '<div data-ai="datepicker" data-size="large" data-default-value="2026-08-10"></div>'
      ) +

      '<div class="demo-label" style="margin-top:24px">校验状态</div>' +
      row(
        '<div data-ai="datepicker" data-status="error" data-default-value="2026-08-10"></div>' +
        '<div data-ai="datepicker" data-status="warning" data-default-value="2026-08-10"></div>'
      ) +

      '<div class="demo-label" style="margin-top:24px">禁用状态</div>' +
      box('<div data-ai="datepicker" data-disabled="true" data-default-value="2026-08-10"></div>') +

      '<div class="demo-label" style="margin-top:24px">隐藏「今天」快捷按钮</div>' +
      box('<div data-ai="datepicker" data-show-today="false"></div>') +

      '<div class="demo-label" style="margin-top:24px">月份选择模式</div>' +
      box('<div data-ai="datepicker" data-picker="month" data-default-value="2026-08"></div>') +

      '<div class="demo-label" style="margin-top:24px">范围选择（开始日期 ~ 结束日期）</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前范围: <span id="dp-range-text" style="color:#19c8b9;font-weight:600">2026-08-10 ~ 2026-08-20</span></div>' +
      box('<div id="dp-range-mount" style="width:300px"></div>') +

      '<div class="demo-label" style="margin-top:24px">范围 + 清空 + 禁用周末</div>' +
      box('<div id="dp-range-weekend-mount" style="width:300px"></div>') +

      codeL('// 基础：onChange 回传 YYYY-MM-DD，清空回传 null\nnew AI.DatePicker(el, {\n  defaultValue: "2026-08-10",\n  onChange: function (value) { console.log(value); }\n});\n\n// 范围选择：onChange 回传 [开始, 结束]\nnew AI.DatePicker(el, {\n  range: true,\n  defaultValue: ["2026-08-10", "2026-08-20"],\n  onChange: function (value) { console.log(value[0], value[1]); }\n});\n\n// 月份模式：值为 YYYY-MM，面板直接打开月份网格\nnew AI.DatePicker(el, { picker: "month", defaultValue: "2026-08" });\n\n// 禁用周末 + 允许清空\nnew AI.DatePicker(el, {\n  allowClear: true,\n  disabledDate: function (date) { var d = date.getDay(); return d === 0 || d === 6; }\n});') +
      apiT([
        ['range', '范围选择模式：联动选择开始日期与结束日期', 'boolean', 'false'],
        ['picker', '选择粒度：date 选择日期，month 选择月份（值为 YYYY-MM）', "'date' | 'month'", "'date'"],
        ['value', '当前选中值（受控）；日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]，清空为 null', 'string | [string, string] | null', '-'],
        ['defaultValue', '默认选中值（非受控）', 'string | [string, string]', '-'],
        ['onChange', '值变化回调；日期模式返回 YYYY-MM-DD，范围模式返回 [开始, 结束]，清空返回 null', '(value) => void', '-'],
        ['placeholder', '占位文本', 'string', "'请选择日期'"],
        ['disabled', '禁用状态', 'boolean', 'false'],
        ['allowClear', '允许一键清空', 'boolean', 'false'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['status', '校验状态', "'error' | 'warning'", '-'],
        ['format', '展示格式，支持 YYYY / MM / DD / M / D', 'string', "'YYYY-MM-DD'"],
        ['disabledDate', '禁用日期判断函数', '(date: Date) => boolean', '-'],
        ['open / onOpenChange', '受控展开状态与回调', 'boolean / (open) => void', '-'],
        ['showToday', '面板底部显示「今天」快捷按钮', 'boolean', 'true']
      ]) +
      '</div>';
  };

  /* ---------- TimePicker ---------- */
  DEMOS.timepicker = function () {
    var box = function (inner) {
      return '<div style="padding:16px;border-radius:18px;font-weight:500;margin-bottom:20px">' + inner + '</div>';
    };
    var row = function (inner) {
      return '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">' + inner + '</div>';
    };
    return '<div class="demo-section">' +
      '<div class="demo-section-title">TimePicker <span class="demo-tag">时间</span> <span class="demo-tag">此刻</span> <span class="demo-tag">步进</span></div>' +

      '<div class="demo-label">受控模式 — onChange 回传 HH:mm:ss，清空回传 null</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前选中: <span id="tp-ctl-text" style="color:#19c8b9;font-weight:600">09:30:00</span></div>' +
      box('<div id="tp-ctl-mount"></div>') +

      '<div class="demo-label" style="margin-top:24px">非受控默认值 + 自定义格式（不含秒）</div>' +
      box('<div data-ai="timepicker" data-default-value="14:30:00" data-format="HH:mm"></div>') +

      '<div class="demo-label" style="margin-top:24px">分钟步进（15 分钟一档）</div>' +
      box('<div data-ai="timepicker" data-minute-step="15" data-default-value="09:30:00"></div>') +

      '<div class="demo-label" style="margin-top:24px">允许清空</div>' +
      box('<div data-ai="timepicker" data-allow-clear="true" data-default-value="09:30:00"></div>') +

      '<div class="demo-label" style="margin-top:24px">三种尺寸</div>' +
      row(
        '<div data-ai="timepicker" data-size="small" data-default-value="09:30:00"></div>' +
        '<div data-ai="timepicker" data-size="middle" data-default-value="09:30:00"></div>' +
        '<div data-ai="timepicker" data-size="large" data-default-value="09:30:00"></div>'
      ) +

      '<div class="demo-label" style="margin-top:24px">校验状态</div>' +
      row(
        '<div data-ai="timepicker" data-status="error" data-default-value="09:30:00"></div>' +
        '<div data-ai="timepicker" data-status="warning" data-default-value="09:30:00"></div>'
      ) +

      '<div class="demo-label" style="margin-top:24px">禁用状态</div>' +
      box('<div data-ai="timepicker" data-disabled="true" data-default-value="09:30:00"></div>') +

      codeL('// 基础：onChange 回传 HH:mm:ss，清空回传 null\nnew AI.TimePicker(el, {\n  defaultValue: "09:30:00",\n  onChange: function (value) { console.log(value); }\n});\n\n// 不含秒：面板只显示时/分两列\nnew AI.TimePicker(el, { defaultValue: "14:30:00", format: "HH:mm" });\n\n// 步进：15 分钟一档\nnew AI.TimePicker(el, { minuteStep: 15 });\n\n// 允许清空\nnew AI.TimePicker(el, { allowClear: true });') +
      apiT([
        ['value', '当前选中时间（受控），格式 HH:mm:ss', 'string', '-'],
        ['defaultValue', '默认选中时间（非受控）', 'string', '-'],
        ['onChange', '值变化回调，清空时返回 null', '(value: string | null) => void', '-'],
        ['placeholder', '占位文本', 'string', "'请选择时间'"],
        ['disabled', '禁用状态', 'boolean', 'false'],
        ['allowClear', '允许一键清空', 'boolean', 'false'],
        ['size', '尺寸', "'small' | 'middle' | 'large'", "'middle'"],
        ['status', '校验状态', "'error' | 'warning'", '-'],
        ['format', '展示格式，支持 HH / mm / ss；含 ss 时显示秒列', 'string', "'HH:mm:ss'"],
        ['hourStep', '小时步进', 'number', '1'],
        ['minuteStep', '分钟步进', 'number', '1'],
        ['secondStep', '秒步进', 'number', '1'],
        ['open / onOpenChange', '受控展开状态与回调', 'boolean / (open) => void', '-']
      ]) +
      '</div>';
  };

  /* ---------- Calendar ---------- */
  DEMOS.calendar = function () {
    var calBox = function (inner) {
      /* 把容器收到面板的实际宽度，避免卡片右侧留一大片空地 */
      return '<div style="padding:16px;border-radius:18px;font-weight:500;margin-bottom:20px;background:#faf8f3;max-width:780px">' + inner + '</div>';
    };
    return '<div class="demo-section">' +
      '<div class="demo-section-title">Calendar <span class="demo-tag">日历</span> <span class="demo-tag">事项条</span> <span class="demo-tag">跨天切段</span> <span class="demo-tag">拖拽创建</span></div>' +

      '<div class="demo-label">基础 — 同日多条折叠 +N、跨天连续条、带时间事项</div>' +
      calBox('<div id="cal-basic-mount"></div>') +

      '<div class="demo-label" style="margin-top:24px">受控模式：点击日期选中</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">当前选中: <span id="cal-ctl-text" style="color:#19c8b9;font-weight:600">2026-08-10</span></div>' +
      calBox('<div id="cal-ctl-mount"></div>') +

      '<div class="demo-label" style="margin-top:24px">拖拽跨日期创建事项（draggableEvents）</div>' +
      '<div style="margin-bottom:8px;font-size:13px;color:#a08060">新建事项: <span id="cal-drag-text" style="color:#19c8b9;font-weight:600">在日期上按住并横向拖动</span></div>' +
      calBox('<div id="cal-drag-mount"></div>') +

      codeL('const events = [\n  { title: "每日签到", start: "2026-08-10 09:30", showTime: true },\n  { title: "海岛丰收祭", start: "2026-08-12", end: "2026-08-18", color: "amber" }\n];\n\nnew AI.Calendar(el, {\n  defaultValue: "2026-08-10",\n  events: events,\n  onChange: function (date) { console.log(date); },\n  onPanelChange: function (month) { console.log(month); }\n});\n\n// 拖拽跨日期创建事项\nnew AI.Calendar(el, {\n  draggableEvents: true,\n  onEventCreate: function (start, end) { console.log(start, end); }\n});') +
      apiT([
        ['width', '面板宽度，默认铺满父容器（数值按 px 处理）', 'number | string', '-'],
        ['value', '当前选中日期（受控），YYYY-MM-DD', 'string', '-'],
        ['defaultValue', '默认选中日期（非受控）', 'string', '今天'],
        ['panelValue', '面板展示月份（受控），YYYY-MM 或 YYYY-MM-DD', 'string', '-'],
        ['defaultPanelValue', '默认展示月份（非受控）', 'string', '选中值 / 今天'],
        ['onChange', '日期变化回调', '(date: string) => void', '-'],
        ['onPanelChange', '面板月份变化回调', '(month: string) => void', '-'],
        ['events', '事项列表，支持同日多条与跨日期连续条；变更时传新数组引用，就地改不会重排', 'CalendarEvent[]', '[]'],
        ['showEventTime', '是否展示事项起始时间（仅首段）', 'boolean', 'true'],
        ['draggableEvents', '允许鼠标拖拽跨日期创建事项', 'boolean', 'false'],
        ['onEventCreate', '拖拽创建事项回调，返回起止日期', '(start: string, end: string) => void', '-']
      ], 'Calendar API') +
      apiT([
        ['title', '事项内容', 'string', 'required'],
        ['start', '开始日期，YYYY-MM-DD 或 YYYY-MM-DD HH:mm（带时间则展示 HH:mm）', 'string | Date', 'required'],
        ['end', '结束日期，省略时等同于 start；传入时渲染成跨天连续条', 'string | Date', '-'],
        ['color', "配色；'teal' 是默认暖橙，与 'coral' 相近，同屏时优先用 green / purple 区分", "'teal' | 'amber' | 'coral' | 'green' | 'purple'", "'teal'"],
        ['showTime', '是否展示起始时间', 'boolean', 'false']
      ], 'CalendarEvent') +
      '</div>';
  };

  /* ==============================
     Skill 介绍（静态文档页）
     ============================== */
  var SKILL_SHELL_TOKENS = [
    { re: /#.*$/g, cls: 'comment' },
    { re: /[├└]──|│/g, cls: 'tree' },
    { re: /'[^']*'|"[^"]*"/g, cls: 'string' },
    { re: /\b[\w.-]+\.(md|tsx?|less|css|json|html)\b/g, cls: 'file' },
    { re: /\b(skills|add|cp|npm|npx|yarn|pnpm|install|uninstall|run|remove)\b/g, cls: 'command' },
    { re: /(?:\s|^)(--?[\w-]+)/g, cls: 'option', group: 1 },
    { re: /~\/[\w./-]*/g, cls: 'string' }
  ];

  /* Shell / 目录树高亮：CodeBlock 只识别 JSX 词法，这里按终端的 `#` 注释、目录树字符与命令名着色 */
  function skillShell(code) {
    var lines = code.replace(/^\n+|\n+$/g, '').split('\n');
    var html = lines.map(function (line) {
      var segs = [];
      SKILL_SHELL_TOKENS.forEach(function (token) {
        var re = new RegExp(token.re.source, 'g');
        var match;
        while ((match = re.exec(line)) !== null) {
          var text = token.group ? match[token.group] : match[0];
          var start = token.group ? match.index + match[0].indexOf(text) : match.index;
          segs.push({ start: start, end: start + text.length, cls: token.cls });
          if (re.lastIndex <= match.index) re.lastIndex = match.index + 1;
        }
      });
      segs.sort(function (a, b) { return a.start - b.start; });
      var kept = [];
      segs.forEach(function (seg) {
        if (!kept.length || seg.start >= kept[kept.length - 1].end) kept.push(seg);
      });
      var out = '';
      var cursor = 0;
      kept.forEach(function (seg) {
        if (seg.start > cursor) out += esc(line.slice(cursor, seg.start));
        out += '<span class="skill-shell__' + seg.cls + '">' + esc(line.slice(seg.start, seg.end)) + '</span>';
        cursor = seg.end;
      });
      if (cursor < line.length) out += esc(line.slice(cursor));
      return out;
    }).join('\n');
    return '<pre class="skill-shell">' + html + '</pre>';
  }

  var SKILL_INTRO_TAGS = ['纯原生 JavaScript', '45 个组件', '零第三方依赖', 'MIT License'];

  /* 快速开始 —— 用户视角的三步 */
  var SKILL_QUICK = [
    {
      title: '安装技能',
      desc: '用 skills CLI 一键安装；或手动把 animal-island-ui-style/ 目录复制到代理的 skills 位置。',
      code: '# 方式一：skills CLI（推荐）\nskills add guokaigdg/animal-island-ui\n\n# 方式二：手动复制到 Claude Code 的 skills 目录\n# cp -r animal-island-ui-style ~/.claude/skills/'
    },
    {
      title: '正常提需求',
      desc: '无需记住任何指令。描述里出现「治愈系海岛风格」「animal island 风格」或指定用 animal-island 搭页面时，代理会自动加载技能。',
      code: '# 对话里直接说即可\n用 animal-island-ui 做一个居民档案页：头像卡、里程进度、装备清单\n做一个治愈系海岛风格的单文件 HTML 落地页，不要构建步骤'
    },
    {
      title: '按规则验收',
      desc: '产出必须满足技能里的硬性规则：只用库组件与 var(--ai-*) 令牌、无纯黑文字、无冷蓝焦点环、图标只用手绘 SVG。不满足即视为 bug，可直接让代理按规则自查。'
    }
  ];

  /* 工作原理 —— 代理视角的五步（图标映射到库内置的 10 个手绘图标） */
  var SKILL_FLOW = [
    { icon: 'shopping', pattern: 'app-blue', title: '装载', desc: '技能是纯文本知识包，没有可执行代码，安装后躺在代理的 skills 目录里' },
    { icon: 'chat', pattern: 'app-orange', title: '触发', desc: '代理按 SKILL.md 的 description 匹配当前对话，命中才加载正文，不占用日常上下文' },
    { icon: 'map', pattern: 'app-yellow', title: '路由', desc: '整页需求读 full-page.md，单组件读 references/components/，配色读 tokens.md' },
    { icon: 'critterpedia', pattern: 'app-teal', title: '对照 API', desc: 'props、合法取值、默认值逐个查 references/components/，杜绝凭印象编造' },
    { icon: 'design', pattern: 'brown', title: '产出', desc: '按令牌与硬性规则落地：暖色羊皮纸、薄荷主色、胶囊形状与 3D 按钮质感' }
  ];

  var SKILL_SCENARIOS = [
    {
      icon: 'design',
      color: 'app-teal',
      title: '原生 JS 项目',
      agents: ['Claude Code', 'Codex', 'Cursor'],
      desc: '无构建步骤的工程：直接引入 css/animal-island.css 与 js/animal-island.js，按 data-ai 或构造器初始化，用 --ai-* 令牌做主题。',
      entry: 'references/vanilla-project.md'
    },
    {
      icon: 'critterpedia',
      color: 'app-yellow',
      title: '独立 HTML',
      agents: ['任意兼容代理'],
      desc: '无 npm、无打包器：样式与脚本内联或用相对路径引用，不引入构建工具，也不从 CDN 拉第三方组件库，产出单个 index.html。',
      entry: 'references/standalone-html.md'
    }
  ];

  var SKILL_TREE = 'animal-island-ui-style/\n' +
    '├── SKILL.md                     # 入口：风格摘要、令牌、场景路由、硬性规则\n' +
    '├── SKILL.zh-CN.md               # 中文翻译（人工审阅用，代理只读 SKILL.md）\n' +
    '└── references/\n' +
    '    ├── vanilla-project.md       # 场景一：原生 JS 项目，直接引入 css/js\n' +
    '    ├── standalone-html.md       # 场景二：单文件 HTML，无构建\n' +
    '    └── components/              # 按分类的 props 与交互参考（45 个组件）';

  /* 组件目录：分类、配色与参考文件名与技能仓库保持一致 */
  var SKILL_CATALOG = [
    { category: 'General', color: 'app-teal', components: ['Icon', 'Button', 'Typewriter', 'Cursor'], reference: 'general.md' },
    { category: 'Layout', color: 'app-yellow', components: ['Card', 'Title', 'Divider', 'Collapse', 'Tabs'], reference: 'layout.md' },
    { category: 'Form controls', color: 'app-blue', components: ['Input', 'Switch', 'Checkbox', 'Radio', 'Rate', 'Select'], reference: 'form-controls.md' },
    { category: 'Upload', color: 'warm-peach-pink', components: ['Upload'], reference: 'upload.md' },
    { category: 'Date & time pickers', color: 'yellow-green', components: ['DatePicker', 'TimePicker'], reference: 'date-time.md' },
    { category: 'Form container', color: 'app-pink', components: ['Form'], reference: 'Form.md' },
    { category: 'Overlays', color: 'purple', components: ['Modal', 'Drawer', 'Tooltip'], reference: 'overlays.md' },
    { category: 'Feedback', color: 'app-orange', components: ['Progress', 'Skeleton', 'BackTop', 'Loading', 'Countdown', 'Time'], reference: 'feedback.md' },
    { category: 'Notification', color: 'app-red', components: ['Notification'], reference: 'Notification.md' },
    { category: 'Data displays', color: 'app-green', components: ['Table', 'CodeBlock', 'Tag', 'Badge', 'Pagination'], reference: 'data-display.md' },
    { category: 'Calendar', color: 'brown', components: ['Calendar'], reference: 'calendar.md' },
    { category: 'Empty state', color: 'app-green', components: ['NoData'], reference: 'no-data.md' },
    { category: 'Charts', color: 'app-teal', components: ['Chart'], reference: 'charts.md' },
    { category: 'Count-up score', color: 'app-teal', components: ['CountUp'], reference: 'CountUp.md' },
    { category: 'Media', color: 'lime-green', components: ['Image', 'Avatar', 'Carousel'], reference: 'media.md' },
    { category: 'Decorative', color: 'brown', components: ['Footer', 'Divider', 'Cursor', 'Typewriter', 'Background', 'Phone', 'Wallet'], reference: 'decorative.md' }
  ];

  /* 有颜色的令牌 —— 渲染成色板 */
  var SKILL_COLOR_TOKENS = [
    { label: '主色 primary', tokens: ['--ai-primary', '--ai-primary-hover', '--ai-primary-active', '--ai-primary-bg'] },
    { label: '状态色 status', tokens: ['--ai-success', '--ai-warning', '--ai-error'] },
    { label: '文字色 text', tokens: ['--ai-text', '--ai-text-secondary', '--ai-text-disabled'] },
    { label: '边框与背景 border / bg', tokens: ['--ai-border', '--ai-border-light', '--ai-bg', '--ai-bg-secondary'] }
  ];

  /* 非颜色令牌 —— 只列名字 */
  var SKILL_SCALE_TOKENS = [
    { label: '圆角', tokens: ['--ai-radius-sm', '--ai-radius-base', '--ai-radius-lg'] },
    { label: '间距', tokens: ['--ai-spacing-xs', '--ai-spacing-sm', '--ai-spacing-md', '--ai-spacing-lg', '--ai-spacing-xl'] },
    { label: '阴影', tokens: ['--ai-shadow-sm', '--ai-shadow-base', '--ai-shadow-lg'] },
    { label: '字体', tokens: ['--ai-font-family', '--ai-font-size-sm', '--ai-font-size-base', '--ai-font-size-lg'] }
  ];

  var SKILL_RULES = [
    {
      title: 'API 纪律', icon: 'critterpedia', color: 'app-red',
      rules: [
        '绝不编造 props —— 每个 prop 必须出现在组件参考或源码中。',
        '受控组件（Input / Switch / Checkbox / Radio / Rate / Select）必须同时传 value 与 onChange。',
        '优先库组件而非裸 HTML：不出现可见的原生 button / input / select / checkbox / radio。'
      ]
    },
    {
      title: '引入与工程', icon: 'map', color: 'app-blue',
      rules: [
        '样式与脚本各引入一次：css/animal-island.css + js/animal-island.js，否则组件无样式。',
        '通过 AnimalIsland 命名空间调用组件，禁止复制粘贴内部实现或深路径引用。',
        '禁止用内联 style 覆盖组件的颜色、圆角、阴影；自定义元素用 var(--ai-*) 令牌上色。'
      ]
    },
    {
      title: '色彩与字体', icon: 'design', color: 'app-pink',
      rules: [
        '禁用纯黑（#000 / #111）文字与冷灰（#fafafa / #f5f5f5）背景。',
        '禁用冷蓝焦点环 —— 焦点色为黄色（输入框）或薄荷主色（按钮）。',
        '字体为 Nunito + Noto Sans SC；字重不低于 400；UI 文本不用等宽字体（CodeBlock 除外）。'
      ]
    },
    {
      title: '形状与质感', icon: 'diy', color: 'app-yellow',
      rules: [
        '可交互元素圆角不得小于 12px；按钮与输入框为 50px 胶囊。',
        '硬边偏移阴影只属于按钮与贴纸卡片；Card 无 box-shadow，Switch 无外阴影，Input 阴影需显式开启。',
        'Modal 必须保留 SVG 有机 blob 裁切；Title 是燕尾丝带，不是 blob / 胶囊 / 方块。'
      ]
    },
    {
      title: '图标与动效', icon: 'camera', color: 'app-teal',
      rules: [
        '图标一律用内置 .ai-icon（10 个手绘 SVG）—— 禁止 emoji、Unicode 符号与第三方图标库。',
        '动效使用 cubic-bezier(0.4, 0, 0.2, 1)，时长 0.15–0.35s。'
      ]
    }
  ];

  var skillIcon = function (name, size) {
    return '<span class="ai-icon ai-icon--' + name + '" style="width:' + size + 'px;height:' + size + 'px"></span>';
  };

  var skillChip = function (text, extra) {
    return '<span class="ai-tag ai-tag--sm ai-tag--outlined' + (extra ? ' ' + extra : '') + '">' + text + '</span>';
  };

  var skillSection = function (title, tags, body, dashed) {
    var tagHtml = tags.map(function (tag) { return '<span class="demo-tag">' + tag + '</span>'; }).join(' ');
    return '<div class="demo-section"' + (dashed ? ' style="border-style:dashed"' : '') + '>' +
      '<div class="demo-section-title">' + title + (tagHtml ? ' ' + tagHtml : '') + '</div>' +
      '<div class="skill-body">' + body + '</div>' +
    '</div>';
  };

  DEMOS.skill = function () {
    var quick = SKILL_QUICK.map(function (step, index) {
      return '<li class="skill-quick">' +
        '<span class="skill-index">' + (index + 1) + '</span>' +
        '<div class="skill-quick__body">' +
          '<div class="skill-quick__title">' + step.title + '</div>' +
          '<p class="skill-desc">' + step.desc + '</p>' +
          (step.code ? skillShell(step.code) : '') +
        '</div>' +
      '</li>';
    }).join('');

    var flow = SKILL_FLOW.map(function (step) {
      return '<div class="ai-card ai-card--' + step.pattern + ' skill-step">' +
        '<div class="skill-card__head">' + skillIcon(step.icon, 26) +
          '<span class="skill-card__title">' + step.title + '</span>' +
        '</div>' +
        '<p class="skill-desc">' + step.desc + '</p>' +
      '</div>';
    }).join('');

    var scenarios = SKILL_SCENARIOS.map(function (scenario) {
      var agents = scenario.agents.map(function (agent) { return skillChip(agent); }).join('');
      return '<div class="ai-card ai-card--' + scenario.color + ' skill-scenario">' +
        '<div class="skill-card__head">' + skillIcon(scenario.icon, 30) +
          '<span class="skill-scenario__title">' + scenario.title + '</span>' +
        '</div>' +
        '<p class="skill-desc">' + scenario.desc + '</p>' +
        '<div class="skill-agent-row">' + agents + '</div>' +
        '<code class="skill-path">' + scenario.entry + '</code>' +
      '</div>';
    }).join('');

    var catalog = SKILL_CATALOG.map(function (row) {
      var comps = row.components.map(function (name) { return skillChip(name); }).join('');
      return '<div class="skill-catalog">' +
        '<span class="ai-tag ai-tag--sm ai-tag--soft ai-tag--' + row.color + ' skill-catalog__category">' + row.category + '</span>' +
        '<div class="skill-catalog__components">' + comps + '</div>' +
        '<code class="skill-path skill-path--quiet">' + row.reference + '</code>' +
      '</div>';
    }).join('');

    var colorGroups = SKILL_COLOR_TOKENS.map(function (group) {
      var swatches = group.tokens.map(function (token) {
        return '<div class="skill-swatch">' +
          '<div class="skill-swatch__chip" style="background:var(' + token + ')"></div>' +
          '<div class="skill-swatch__meta">' +
            '<code class="skill-swatch__name">' + token.replace('--ai-', '') + '</code>' +
            '<code class="skill-swatch__value" data-skill-token="' + token + '">—</code>' +
          '</div>' +
        '</div>';
      }).join('');
      return '<div class="skill-token-group">' +
        '<div class="demo-label" style="margin:0 0 8px">' + group.label + '</div>' +
        '<div class="skill-swatch-row">' + swatches + '</div>' +
      '</div>';
    }).join('');

    var scaleGroups = SKILL_SCALE_TOKENS.map(function (group) {
      return '<div class="skill-token-tagrow">' +
        '<span class="skill-token-taglabel">' + group.label + '</span>' +
        group.tokens.map(function (token) {
          return '<span class="ai-tag ai-tag--sm ai-tag--soft">' + token + '</span>';
        }).join('') +
      '</div>';
    }).join('');

    var rules = SKILL_RULES.map(function (group) {
      return '<div class="ai-card ai-card--dashed skill-rule">' +
        '<div class="skill-card__head">' + skillIcon(group.icon, 22) +
          '<span class="skill-card__title">' + group.title + '</span>' +
          '<span class="ai-tag ai-tag--sm ai-tag--soft ai-tag--' + group.color + '">' + group.rules.length + ' 条</span>' +
        '</div>' +
        '<ul class="skill-rule__list">' +
          group.rules.map(function (rule) { return '<li>' + rule + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
    }).join('');

    return skillSection('animal-island-ui-style', ['AI Skill', '可安装'],
        '<p class="skill-lead">一个可安装的编码助手技能，教会 AI 代理（Claude Code、Codex、Cursor 等兼容 SKILL.md 的代理）按治愈系海岛风格搭建 UI：暖色羊皮纸背景、大地色文字、薄荷主色、胶囊形状与 3D 游戏按钮质感。它只是知识，不是代码 —— 约束代理「怎么写」，不改变你的工程结构。</p>' +
        '<div class="skill-tag-row">' + SKILL_INTRO_TAGS.map(function (tag) { return skillChip(tag); }).join('') + '</div>') +
      skillSection('快速开始', ['3 步'],
        '<ol class="skill-quick-list">' + quick + '</ol>') +
      skillSection('工作原理', ['Workflow'],
        '<p class="skill-lead skill-lead--spaced">技能是一个纯文本知识包，没有可执行代码，也不会常驻上下文 —— 代理按下面五步按需消费它：</p>' +
        '<div class="skill-step-grid">' + flow + '</div>') +
      skillSection('两种使用场景', ['Scenarios'],
        '<p class="skill-lead skill-lead--spaced">代理先判断场景，再读对应入口；两个场景共用组件目录与硬性规则。</p>' +
        '<div class="skill-scenario-grid">' + scenarios + '</div>') +
      skillSection('目录结构', ['Layout'], skillShell(SKILL_TREE)) +
      skillSection('组件目录', ['45 Components'],
        '<p class="skill-lead skill-lead--spaced">props 参考按分类放在 references/components/ 下，props、合法取值与默认值均直接取自源码。</p>' +
        '<div class="skill-catalog-list">' + catalog + '</div>') +
      skillSection('设计令牌', ['--ai-*'],
        '<p class="skill-lead skill-lead--spaced">打包样式在 :root 上声明了运行时 CSS 自定义属性（前缀 --ai-*）。下面色板取的是当前页面真实令牌值 —— 消费者覆盖变量即可运行时换肤。</p>' +
        colorGroups + scaleGroups) +
      skillSection('硬性规则', ['Hard Rules'],
        '<p class="skill-lead skill-lead--spaced">违反以下规则视为 bug，代理不得越界：</p>' +
        '<div class="skill-rule-grid">' + rules + '</div>') +
      skillSection('许可证', ['License'],
        '<p class="skill-lead">本组件库与该技能均采用 MIT License —— 可自由使用、修改与分发，包括商业用途。完整条款见仓库 LICENSE 文件。</p>', true);
  };

  /* ==============================
     Chart demos
     ============================== */
  var CHART_CATEGORIES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var CHART_TREND = [32, 46, 38, 62, 55, 79, 68];
  var CHART_COMPARE = [24, 31, 42, 48, 39, 61, 54];
  var CHART_PROPORTIONS = [
    { name: '果园', value: 38 },
    { name: '海岸', value: 27 },
    { name: '露营地', value: 21 },
    { name: '花田', value: 14 }
  ];
  var CHART_REGIONS = [
    { name: '果园', polygons: [[[0, 2], [1, 5], [4, 6], [5, 3], [3, 2]]] },
    { name: '海岸', polygons: [[[5, 3], [4, 6], [7, 5], [9, 3], [8, 1]]] },
    { name: '露营地', polygons: [[[0, 2], [3, 2], [5, 3], [5, 0], [2, -1]]] },
    { name: '花田', polygons: [[[5, 3], [8, 1], [7, -1], [5, 0]]] }
  ];
  var CHART_WORDS = ['海风', '露营', '星空', '果园', '钓鱼', '日落', '咖啡', '贝壳', '花田', '步道', '朋友', '野餐'];
  var CHART_MOUNTS = [];
  var chartMountSeq = 0;

  /* 原版 gallery-shared.ts：延续组件库的薄荷、蜜桃、草绿与花田色系。 */
  var CHART_MEADOW = ['#48a891', '#97bc76', '#e4b75c', '#ce9271', '#aa91ba'];
  var CHART_SUNSET = ['#dc886b', '#e4b75c', '#c993a5', '#ab8cba', '#8dab9b'];
  var CHART_FOREST = ['#408f7c', '#68a18b', '#8fb6a0', '#b3cbb4', '#d2dfc8'];
  var CHART_FLOWERS = ['#a88abb', '#d38ba3', '#e9b782', '#92b7a0', '#c1b979'];
  var CHART_CREAM_SURFACE = { background: '#fffaf0', borderColor: '#eadfc9' };
  var CHART_MINT_SURFACE = { background: '#f3f8ef', borderColor: '#dce6d6' };
  var CHART_BLOSSOM_SURFACE = { background: '#fcf5f1', borderColor: '#eadcd4' };

  /** 将明确给定的名称、数值与可选单点颜色组成公开数据结构。 */
  function namedPoints(names, values, colors) {
    return names.map(function (name, index) {
      var point = { name: name, value: values[index] };
      if (colors) point.color = colors[index % colors.length];
      return point;
    });
  }

  /** 创建紧凑的图表示例，保留各类型自行指定高度的能力。 */
  function galleryExample(id, title, description, props) {
    var merged = { height: 240 };
    Object.keys(props).forEach(function (key) { merged[key] = props[key]; });
    merged.title = title;
    merged.description = description;
    return { id: id, props: merged };
  }

  function formatPercent(value) {
    return Math.round(value) + '%';
  }
  formatPercent.__code = '(value) => `${Math.round(value)}%`';

  function formatTemperature(value) {
    return Math.round(value) + '°C';
  }
  formatTemperature.__code = '(value) => `${Math.round(value)}°C`';

  function formatMinutes(value) {
    return Math.round(value) + ' 分';
  }
  formatMinutes.__code = '(value) => `${Math.round(value)} 分`';

  /** 合并示例配置，避免共享的 exampleProps 被原地修改。 */
  function chartMerge(base, extra) {
    var out = {};
    Object.keys(base).forEach(function (key) { out[key] = base[key]; });
    Object.keys(extra).forEach(function (key) { out[key] = extra[key]; });
    return out;
  }

  var CHART_GALLERY = {};
  function chartRegister(group) {
    Object.keys(group).forEach(function (type) { CHART_GALLERY[type] = group[type]; });
  }

  /* 原版 gallery-cartesian.ts：分类坐标类示例。 */
  chartRegister({
    column: [
      galleryExample('harvest', '彩色单柱 · 果园收成', '每种水果独立配色，直接标注采收数量。', {
        type: 'column',
        categories: ['苹果', '香梨', '蜜桃', '樱桃'],
        legend: false,
        showLabels: true,
        max: 100,
        series: [
          { name: '采收数量', data: namedPoints(['苹果', '香梨', '蜜桃', '樱桃'], [64, 85, 52, 73], CHART_MEADOW) }
        ]
      }),
      galleryExample('grouped', '多系列分组 · 活动预约', '薄荷、蜜桃与花紫，对比三类活动的预约量。', {
        type: 'column',
        categories: ['周五', '周六', '周日'],
        colors: [CHART_MEADOW[0], CHART_SUNSET[0], CHART_FLOWERS[0]],
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '露营', data: [28, 54, 42] },
          { name: '野餐', data: [38, 45, 62] },
          { name: '观星', data: [18, 32, 48] }
        ]
      }),
      galleryExample('stacked', '暖色堆叠 · 集市营收', '同一根柱子查看总量，悬浮比较各摊位贡献。', {
        type: 'column',
        categories: ['一月', '二月', '三月', '四月'],
        colors: CHART_SUNSET,
        stacked: true,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          { name: '鲜果', data: [32, 48, 42, 58] },
          { name: '甜品', data: [24, 28, 38, 32] },
          { name: '手作', data: [16, 22, 18, 28] }
        ]
      }),
      galleryExample('diverging', '正负对比 · 物资变化', '收入与消耗分列零线两侧，保留真实正负值。', {
        type: 'column',
        categories: ['木材', '种子', '石料', '布料'],
        colors: [CHART_MEADOW[0], CHART_SUNSET[0]],
        series: [
          { name: '补充', data: [42, 28, 54, 36] },
          { name: '消耗', data: [-26, -18, -32, -20] }
        ]
      })
    ],
    bar: [
      galleryExample('ranking', '单色排名 · 步道人气', '按到访量排列，让较长的地点名称也容易阅读。', {
        type: 'bar',
        categories: ['海风步道', '森林小径', '日落栈桥', '花田环线'],
        colors: CHART_FOREST,
        legend: false,
        max: 120,
        series: [{ name: '到访人数', data: [102, 86, 65, 42] }]
      }),
      galleryExample('grouped', '双组对照 · 周末到访', '暖色背景搭配两组条形，比较不同区域的变化。', {
        type: 'bar',
        categories: ['果园', '海岸', '营地'],
        colors: [CHART_SUNSET[0], CHART_FLOWERS[0]],
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '本周', data: [72, 94, 58] },
          { name: '上周', data: [54, 68, 70] }
        ]
      }),
      galleryExample('share', '百分比堆叠 · 预约来源', '各行合计 100%，对比不同渠道的构成。', {
        type: 'bar',
        categories: ['露营', '野餐', '观星', '采果'],
        colors: CHART_MEADOW,
        stacked: true,
        max: 100,
        valueFormatter: formatPercent,
        series: [
          { name: '提前预约', data: [60, 45, 75, 50] },
          { name: '现场报名', data: [25, 40, 15, 30] },
          { name: '团体安排', data: [15, 15, 10, 20] }
        ]
      }),
      galleryExample('balance', '双向条形 · 预算结余', '用单点颜色区分结余与超支，突出零线。', {
        type: 'bar',
        categories: ['花田', '营地', '步道', '集市'],
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [
          {
            name: '预算结余',
            data: namedPoints(
              ['花田', '营地', '步道', '集市'],
              [32, -18, 48, -26],
              [CHART_MEADOW[0], CHART_SUNSET[0], CHART_MEADOW[0], CHART_SUNSET[0]]
            )
          }
        ]
      })
    ],
    line: [
      galleryExample('smooth', '柔和曲线 · 一周到访', '双系列平滑连接，适合观察整体趋势。', {
        type: 'line',
        categories: ['一', '二', '三', '四', '五', '六', '日'],
        smooth: true,
        colors: [CHART_MEADOW[0], CHART_SUNSET[0]],
        series: [
          { name: '海岸', data: [22, 38, 30, 52, 45, 78, 64] },
          { name: '森林', data: [16, 24, 36, 28, 42, 55, 48] }
        ]
      }),
      galleryExample('labels', '标记折线 · 每月新成员', '保留折点与数值，适合读取少量关键指标。', {
        type: 'line',
        categories: ['一月', '二月', '三月', '四月', '五月'],
        colors: [CHART_FLOWERS[0]],
        showLabels: true,
        legend: false,
        max: 100,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '新成员', data: [24, 42, 36, 68, 82] }]
      }),
      galleryExample('minimal', '无网格曲线 · 阅读时长', '隐藏坐标和图例，悬浮仍能读取日期与分钟数。', {
        type: 'line',
        categories: ['周一', '周二', '周三', '周四', '周五', '周六'],
        colors: CHART_FOREST,
        smooth: true,
        showAxes: false,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '阅读分钟', data: [15, 32, 24, 45, 38, 60] }]
      }),
      galleryExample('gaps', '缺测断点 · 环境观察', '缺失记录保留断口，不把未知数据补成零。', {
        type: 'line',
        categories: ['一', '二', '三', '四', '五', '六', '日'],
        colors: [CHART_SUNSET[0], CHART_FLOWERS[0]],
        series: [
          { name: '海岸', data: [62, 70, null, 78, 68, 82, 76] },
          { name: '林地', data: [48, 58, 64, 56, null, 70, 66] }
        ]
      })
    ],
    area: [
      galleryExample('smooth', '薄荷面积 · 到访走势', '单系列曲线与柔和填充，强调趋势和体量。', {
        type: 'area',
        categories: ['一', '二', '三', '四', '五', '六', '日'],
        colors: CHART_FOREST,
        smooth: true,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '到访人数', data: [24, 42, 34, 58, 48, 86, 72] }]
      }),
      galleryExample('comparison', '多色叠映 · 区域热度', '面积透明叠映，三条曲线分别读取，不做堆叠。', {
        type: 'area',
        categories: ['春', '夏', '秋', '冬'],
        colors: [CHART_FLOWERS[0], CHART_SUNSET[0], CHART_MEADOW[0]],
        smooth: true,
        series: [
          { name: '海岸', data: [35, 88, 62, 28] },
          { name: '花田', data: [78, 52, 45, 22] },
          { name: '森林', data: [42, 65, 80, 45] }
        ]
      }),
      galleryExample('minimal', '暖色留白 · 采收节奏', '隐藏网格、保留关键数值，适合概览中的趋势块。', {
        type: 'area',
        categories: ['第一批', '第二批', '第三批', '第四批'],
        colors: CHART_SUNSET,
        legend: false,
        showAxes: false,
        showLabels: true,
        max: 100,
        style: CHART_CREAM_SURFACE,
        series: [{ name: '采收篮数', data: [28, 54, 42, 76] }]
      }),
      galleryExample('signed', '跨零面积 · 库存净变化', '以零为基线，正负面积表达补充和消耗。', {
        type: 'area',
        categories: ['一', '二', '三', '四', '五', '六'],
        colors: [CHART_FLOWERS[0]],
        legend: false,
        series: [{ name: '净变化', data: [30, 12, -24, -10, 28, 46] }]
      })
    ],
    mount: [
      galleryExample('colored', '彩色山丘 · 分区人气', '不同区域用独立颜色，山丘高度代表到访量。', {
        type: 'mount',
        categories: ['果园', '海岸', '营地', '花田'],
        legend: false,
        showLabels: true,
        max: 100,
        series: [
          { name: '到访人数', data: namedPoints(['果园', '海岸', '营地', '花田'], [58, 86, 42, 68], CHART_MEADOW) }
        ]
      }),
      galleryExample('forest', '林间山丘 · 四季采收', '统一草绿色，突出季节之间的高低变化。', {
        type: 'mount',
        categories: ['春', '夏', '秋', '冬'],
        colors: CHART_FOREST,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '采收篮数', data: [36, 68, 92, 24] }]
      }),
      galleryExample('clean', '暖色山丘 · 四处日落', '隐藏坐标网格，以直接标注配合柔和填充。', {
        type: 'mount',
        categories: ['栈桥', '灯塔', '山顶', '海滩'],
        legend: false,
        showAxes: false,
        showLabels: true,
        max: 100,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '观景人数', data: namedPoints(['栈桥', '灯塔', '山顶', '海滩'], [72, 46, 84, 58], CHART_SUNSET) }
        ]
      }),
      galleryExample('signed', '双向山丘 · 花田净增', '山丘可跨零展示，使用正负配色表达增减。', {
        type: 'mount',
        categories: ['春', '夏', '秋', '冬'],
        legend: false,
        series: [
          {
            name: '花株净增',
            data: namedPoints(
              ['春', '夏', '秋', '冬'],
              [68, 42, -18, -36],
              [CHART_MEADOW[0], CHART_MEADOW[1], CHART_SUNSET[0], CHART_FLOWERS[0]]
            )
          }
        ]
      })
    ],
    mix: [
      galleryExample('target', '柱线组合 · 预约与目标', '柱体显示实际人数，折线显示同单位的目标。', {
        type: 'mix',
        categories: ['周五', '周六', '周日', '假日'],
        colors: [CHART_MEADOW[0], CHART_SUNSET[0]],
        series: [
          { name: '实际预约', type: 'column', data: [42, 68, 58, 88] },
          { name: '预约目标', type: 'line', data: [50, 60, 65, 80] }
        ]
      }),
      galleryExample('area-line', '面积与曲线 · 新旧步道', '面积衬托旧步道，曲线强调新步道的增长。', {
        type: 'mix',
        categories: ['一', '二', '三', '四', '五', '六'],
        colors: [CHART_MEADOW[1], CHART_FLOWERS[0]],
        smooth: true,
        style: CHART_MINT_SURFACE,
        series: [
          { name: '旧步道', type: 'area', data: [64, 58, 72, 66, 78, 70] },
          { name: '新步道', type: 'line', data: [18, 30, 42, 38, 58, 76] }
        ]
      }),
      galleryExample('three-series', '分组柱线 · 活动参与', '两类活动分组对照，折线补充参与人数合计。', {
        type: 'mix',
        categories: ['春', '夏', '秋', '冬'],
        colors: [CHART_SUNSET[0], CHART_FLOWERS[0], CHART_MEADOW[0]],
        smooth: true,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '采果', type: 'column', data: [28, 42, 52, 18] },
          { name: '手作', type: 'column', data: [18, 30, 26, 38] },
          { name: '合计', type: 'line', data: [46, 72, 78, 56] }
        ]
      }),
      galleryExample('balance', '收支与结余 · 海岛物资', '三条系列共用一条数值轴，单位保持一致。', {
        type: 'mix',
        categories: ['一月', '二月', '三月', '四月'],
        colors: [CHART_MEADOW[0], CHART_SUNSET[0], CHART_FLOWERS[0]],
        series: [
          { name: '收入', type: 'column', data: [52, 68, 42, 76] },
          { name: '支出', type: 'column', data: [-32, -48, -58, -42] },
          { name: '结余', type: 'line', data: [20, 20, -16, 34] }
        ]
      })
    ]
  });

  /* 原版 gallery-polar.ts：圆形与指标类示例。 */
  chartRegister({
    pie: [
      galleryExample('labels', '彩色标签 · 岛屿分区', '扇区外直接显示名称，图例用于筛选区域。', {
        type: 'pie',
        colors: CHART_MEADOW,
        showLabels: true,
        series: [{ name: '面积', data: namedPoints(['果园', '海岸', '营地', '花田'], [38, 27, 21, 14]) }]
      }),
      galleryExample('tonal', '同色层次 · 林地植被', '以深浅草绿区分四类植被，保留同一视觉基调。', {
        type: 'pie',
        colors: CHART_FOREST,
        style: CHART_MINT_SURFACE,
        series: [{ name: '覆盖面积', data: namedPoints(['乔木', '灌木', '草地', '苔藓'], [48, 26, 18, 8]) }]
      }),
      galleryExample('binary', '双色占比 · 预约方式', '两项数据清楚对照，悬浮查看各自占比。', {
        type: 'pie',
        colors: [CHART_SUNSET[0], CHART_SUNSET[1]],
        showLabels: true,
        style: CHART_CREAM_SURFACE,
        series: [{ name: '预约人数', data: namedPoints(['线上', '现场'], [68, 32]) }]
      }),
      galleryExample('compact', '无图例 · 花田构成', '外侧名称代替底部图例，适合紧凑的概览区域。', {
        type: 'pie',
        colors: CHART_FLOWERS,
        showLabels: true,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '花株数量', data: namedPoints(['雏菊', '郁金香', '绣球'], [42, 35, 23]) }]
      })
    ],
    ring: [
      galleryExample('composition', '多色圆环 · 活动参与', '中心显示当前可见合计，底部图例可独立筛选。', {
        type: 'ring',
        colors: CHART_MEADOW,
        series: [{ name: '参与人数', data: namedPoints(['采果', '露营', '手作', '观星'], [86, 64, 42, 28]) }]
      }),
      galleryExample('goal', '双色圆环 · 植树计划', '已完成与待完成组成整环，总目标为 100%。', {
        type: 'ring',
        colors: [CHART_FOREST[0], '#e4dcc9'],
        valueFormatter: formatPercent,
        style: CHART_MINT_SURFACE,
        series: [{ name: '计划占比', data: namedPoints(['已完成', '待完成'], [76, 24]) }]
      }),
      galleryExample('labels', '暖色标注 · 集市收入', '外侧标注摊位，中央汇总本次集市收入。', {
        type: 'ring',
        colors: CHART_SUNSET,
        showLabels: true,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [{ name: '营收', data: namedPoints(['鲜果', '甜品', '手作'], [380, 260, 180]) }]
      }),
      galleryExample('single', '完整圆环 · 全部归还', '单项占满整环，适合展示构成只有一项的结果。', {
        type: 'ring',
        colors: [CHART_FLOWERS[0]],
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '归还状态', data: [{ name: '已归还', value: 48 }] }]
      })
    ],
    rose: [
      galleryExample('seasons', '四季玫瑰 · 花田开放', '等角扇区，以面积表达四季的开放花株数。', {
        type: 'rose',
        colors: CHART_FLOWERS,
        showLabels: true,
        series: [{ name: '开放花株', data: namedPoints(['春', '夏', '秋', '冬'], [92, 64, 48, 24]) }]
      }),
      galleryExample('six-petals', '六瓣玫瑰 · 海岛体验', '增加分类数量，比较六种活动的人气差异。', {
        type: 'rose',
        colors: CHART_SUNSET.concat([CHART_MEADOW[0]]),
        style: CHART_CREAM_SURFACE,
        series: [
          {
            name: '参与人数',
            data: namedPoints(['露营', '采果', '观星', '手作', '野餐', '拾贝'], [84, 62, 46, 72, 54, 38])
          }
        ]
      }),
      galleryExample('forest', '同色玫瑰 · 林间观察', '深浅薄荷色搭配区域名称，弱化多色干扰。', {
        type: 'rose',
        colors: CHART_FOREST,
        showLabels: true,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '观察次数', data: namedPoints(['东林', '西林', '南林', '北林'], [42, 78, 56, 90]) }]
      }),
      galleryExample('balanced', '均衡玫瑰 · 志愿分工', '接近的数值形成较均衡的轮廓，悬浮读取细微差异。', {
        type: 'rose',
        colors: CHART_FLOWERS,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          { name: '志愿时数', data: namedPoints(['引导', '清洁', '养护', '讲解', '布置'], [42, 46, 40, 48, 44]) }
        ]
      })
    ],
    radar: [
      galleryExample('single', '单系列 · 营地体验', '五个维度采用同一百分制，轮廓展示整体表现。', {
        type: 'radar',
        categories: ['环境', '设施', '交通', '服务', '安静'],
        max: 100,
        colors: CHART_FOREST,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '营地体验', data: [92, 74, 60, 86, 94] }]
      }),
      galleryExample('comparison', '双轮廓 · 新旧营地', '薄荷与蜜桃重叠对比，悬浮维度读取双方得分。', {
        type: 'radar',
        categories: ['环境', '设施', '交通', '服务', '安静'],
        max: 100,
        colors: [CHART_MEADOW[0], CHART_SUNSET[0]],
        series: [
          { name: '新营地', data: [88, 92, 65, 80, 72] },
          { name: '旧营地', data: [72, 60, 88, 86, 92] }
        ]
      }),
      galleryExample('six-dimensions', '六维对照 · 区域评分', '三个分区共用六个维度，可通过图例单独观察。', {
        type: 'radar',
        categories: ['生态', '景观', '服务', '交通', '设施', '活力'],
        max: 100,
        colors: [CHART_FLOWERS[0], CHART_SUNSET[0], CHART_MEADOW[0]],
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '海岸', data: [72, 96, 82, 68, 60, 88] },
          { name: '花田', data: [90, 86, 64, 80, 70, 72] },
          { name: '森林', data: [96, 78, 70, 58, 82, 66] }
        ]
      }),
      galleryExample('rating', '四维星评 · 手作课程', '将量程设为 0–5，适配同单位的评分数据。', {
        type: 'radar',
        categories: ['内容', '节奏', '氛围', '收获'],
        min: 0,
        max: 5,
        colors: CHART_FLOWERS,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          { name: '陶艺', data: [4.8, 3.6, 4.6, 4.2] },
          { name: '花艺', data: [4.2, 4.8, 3.8, 4.6] }
        ]
      })
    ],
    arcbar: [
      galleryExample('single', '单项进度 · 花田养护', '单个圆弧展示当前完成率，隐藏重复图例。', {
        type: 'arcbar',
        min: 0,
        max: 100,
        colors: CHART_FOREST,
        legend: false,
        valueFormatter: formatPercent,
        style: CHART_MINT_SURFACE,
        series: [{ name: '养护进度', data: [78] }]
      }),
      galleryExample('pair', '双项对照 · 海岛建设', '两个圆弧分别读取，使用薄荷与蜜桃区分任务。', {
        type: 'arcbar',
        colors: [CHART_MEADOW[0], CHART_SUNSET[0]],
        valueFormatter: formatPercent,
        series: [
          { name: '植树', data: [82] },
          { name: '修路', data: [56] }
        ]
      }),
      galleryExample('three', '三项概览 · 今日任务', '三种颜色并列展示同量程指标，适合紧凑概览。', {
        type: 'arcbar',
        colors: [CHART_FLOWERS[0], CHART_SUNSET[0], CHART_MEADOW[0]],
        valueFormatter: formatPercent,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '清洁', data: [92] },
          { name: '浇水', data: [68] },
          { name: '布置', data: [45] }
        ]
      }),
      galleryExample('quantity', '数量目标 · 图书收集', '量程改为 200，中心显示实际本数而非百分比。', {
        type: 'arcbar',
        min: 0,
        max: 200,
        colors: [CHART_FLOWERS[0]],
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '图书本数', data: [146] }]
      })
    ],
    gauge: [
      galleryExample('comfort', '薄荷仪表 · 舒适指数', '默认百分比量程，当前读数与刻度使用同一单位。', {
        type: 'gauge',
        colors: CHART_FOREST,
        min: 0,
        max: 100,
        valueFormatter: formatPercent,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [{ name: '舒适指数', data: [86] }]
      }),
      galleryExample('capacity', '暖色仪表 · 营位使用', '暖色强调较高占用，当前读数为 92%。', {
        type: 'gauge',
        colors: [CHART_SUNSET[0]],
        min: 0,
        max: 100,
        valueFormatter: formatPercent,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [{ name: '营位使用率', data: [92] }]
      }),
      galleryExample('temperature', '温度仪表 · 林间气温', '自定义 -10 至 40°C 的量程，刻度支持负数。', {
        type: 'gauge',
        colors: [CHART_FLOWERS[0]],
        min: -10,
        max: 40,
        valueFormatter: formatTemperature,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '当前气温', data: [24] }]
      }),
      galleryExample('time-budget', '时长仪表 · 今日阅读', '量程为 0–120 分钟，使用自定义数值格式。', {
        type: 'gauge',
        colors: [CHART_MEADOW[2]],
        min: 0,
        max: 120,
        valueFormatter: formatMinutes,
        legend: false,
        series: [{ name: '阅读时长', data: [48] }]
      })
    ]
  });

  /* 原版 gallery-specialty.ts：有明确坐标的固定观测值，不使用随机数。 */
  function chartObservations(coordinates, prefix) {
    return coordinates.map(function (item, index) {
      var point = { name: prefix + (index + 1), x: item[0], y: item[1] };
      if (item.length > 2) point.size = item[2];
      return point;
    });
  }

  function chartTimePoints(records) {
    var start = Date.UTC(2026, 9, 31);
    return records.map(function (record) {
      return { x: start + record[0] * 60000, y: record[1] };
    });
  }

  var CHART_ARCHIPELAGO = [
    {
      name: '风铃岛',
      polygons: [[[0, 3], [1, 5], [3, 5.5], [4, 4], [3, 2.5], [1, 2]]]
    },
    {
      name: '月湾岛',
      polygons: [[[5, 2], [6, 4], [8, 4.5], [9, 3], [8, 1], [6, 0.5]]]
    },
    {
      name: '小麦岛',
      polygons: [[[1, -1], [2, 0.5], [4, 0], [4.5, -1.5], [3, -2.5], [1.5, -2]]]
    },
    {
      name: '星沙岛',
      polygons: [[[7, -2], [8, -1], [9.5, -2], [9, -3.5], [7.5, -3.5]]]
    }
  ];

  /* 专项图表示例：强调坐标、权重、阶段、区间与空间轮廓的真实语义。 */
  chartRegister({
    scatter: [
      galleryExample('correlation', '单组分布 · 步道体验', '横轴为路程，纵轴为体验评分，观察整体分布。', {
        type: 'scatter',
        colors: CHART_FOREST,
        legend: false,
        min: 0,
        max: 100,
        series: [
          {
            name: '步道观测',
            data: chartObservations([[1, 36], [2, 48], [2.5, 42], [3, 64], [4, 58], [5, 76], [5.5, 68], [6, 85]], '步道')
          }
        ]
      }),
      galleryExample('clusters', '分组散点 · 活动偏好', '横轴为活动分钟数，纵轴为满意度，区分活动类型。', {
        type: 'scatter',
        colors: [CHART_SUNSET[0], CHART_FLOWERS[0], CHART_MEADOW[0]],
        min: 0,
        max: 100,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '手作', data: chartObservations([[20, 68], [30, 82], [35, 74]], '手作') },
          { name: '露营', data: chartObservations([[60, 78], [75, 92], [85, 86]], '露营') },
          { name: '采果', data: chartObservations([[40, 58], [50, 72], [55, 64]], '采果') }
        ]
      }),
      galleryExample('quadrants', '正负分布 · 区域变化', '横轴为到访变化，纵轴为营收变化，保留正负坐标。', {
        type: 'scatter',
        colors: [CHART_FLOWERS[0]],
        style: CHART_BLOSSOM_SURFACE,
        series: [
          {
            name: '区域变化',
            data: chartObservations(
              [[-28, 18], [-12, -24], [8, 12], [22, 38], [36, -14], [-38, -32], [46, 48]],
              '分区'
            )
          }
        ]
      }),
      galleryExample('labels', '标注散点 · 四处观景点', '少量观测值直接标注评分，悬浮查看完整坐标。', {
        type: 'scatter',
        colors: [CHART_MEADOW[0]],
        showLabels: true,
        min: 0,
        max: 100,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [
          {
            name: '景观评分',
            data: [
              { name: '栈桥', x: 12, y: 52 },
              { name: '灯塔', x: 28, y: 76 },
              { name: '山顶', x: 46, y: 88 },
              { name: '海滩', x: 62, y: 64 }
            ]
          }
        ]
      })
    ],
    bubble: [
      galleryExample('weight', '大小气泡 · 活动规模', '横轴时长、纵轴评分、气泡面积表示参与人数。', {
        type: 'bubble',
        colors: CHART_FOREST,
        min: 0,
        max: 100,
        legend: false,
        series: [
          {
            name: '活动体验',
            data: chartObservations([[12, 36, 12], [24, 62, 32], [40, 48, 18], [56, 78, 56], [72, 68, 40]], '活动')
          }
        ]
      }),
      galleryExample('grouped', '双色气泡 · 海岸与林间', '同一套坐标与权重尺度，比较两类活动的分布。', {
        type: 'bubble',
        colors: [CHART_SUNSET[0], CHART_FLOWERS[0]],
        min: 0,
        max: 100,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '海岸', data: chartObservations([[15, 32, 15], [35, 68, 48], [65, 56, 30]], '海岸') },
          { name: '林间', data: chartObservations([[25, 58, 28], [48, 42, 18], [75, 82, 56]], '林间') }
        ]
      }),
      galleryExample('colored', '单点配色 · 营地设施', '设施使用不同颜色，气泡面积表达使用次数。', {
        type: 'bubble',
        legend: false,
        min: 0,
        max: 100,
        style: CHART_MINT_SURFACE,
        series: [
          {
            name: '设施使用',
            data: chartObservations([[15, 42, 18], [32, 78, 48], [48, 56, 32], [70, 84, 64]], '设施').map(function (point, index) {
              point.color = CHART_MEADOW[index];
              return point;
            })
          }
        ]
      }),
      galleryExample('minimal', '无网格气泡 · 游玩偏好', '隐藏坐标，悬浮读取时长、评分与参与规模。', {
        type: 'bubble',
        colors: CHART_FLOWERS,
        showAxes: false,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          {
            name: '游玩偏好',
            data: chartObservations([[12, 34, 16], [26, 58, 42], [44, 42, 24], [58, 76, 64], [76, 60, 36]], '项目')
          }
        ]
      })
    ],
    funnel: [
      galleryExample('conversion', '四阶段 · 活动报名', '完整保留报名顺序，提示展示阶段转化率。', {
        type: 'funnel',
        colors: CHART_MEADOW,
        showLabels: true,
        legend: false,
        series: [{ name: '报名人数', data: namedPoints(['浏览', '咨询', '预约', '到场'], [360, 240, 160, 128]) }]
      }),
      galleryExample('tonal', '同色漏斗 · 手作课程', '以深浅草绿表达五个连续阶段的数量。', {
        type: 'funnel',
        colors: CHART_FOREST,
        showLabels: true,
        legend: false,
        height: 260,
        style: CHART_MINT_SURFACE,
        series: [
          { name: '参与人数', data: namedPoints(['查看', '收藏', '报名', '签到', '完成'], [480, 340, 240, 180, 150]) }
        ]
      }),
      galleryExample('simple', '简洁漏斗 · 集市到访', '仅显示阶段名称，具体数值在悬浮提示中查看。', {
        type: 'funnel',
        colors: CHART_SUNSET,
        showLabels: false,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [{ name: '到访人数', data: namedPoints(['看到活动', '到达集市', '参与体验'], [280, 196, 108]) }]
      }),
      galleryExample('retention', '暖色漏斗 · 志愿留存', '接近的阶段数值呈现较平缓的轮廓，便于比较留存。', {
        type: 'funnel',
        colors: CHART_FLOWERS,
        showLabels: true,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '志愿人数', data: namedPoints(['报名', '培训', '上岗', '持续参与'], [100, 92, 86, 78]) }]
      })
    ],
    word: [
      galleryExample('colorful', '多彩词云 · 海岛印象', '关闭底部图例，让词条大小与颜色成为阅读重点。', {
        type: 'word',
        colors: CHART_MEADOW,
        legend: false,
        series: [
          {
            name: '提及次数',
            data: namedPoints(
              ['海风', '露营', '星空', '日落', '果园', '咖啡', '朋友', '贝壳', '花田', '野餐'],
              [96, 84, 72, 64, 56, 48, 40, 32, 24, 16]
            )
          }
        ]
      }),
      galleryExample('monochrome', '单色词云 · 森林日记', '统一草绿色，只通过字体大小表达词条权重。', {
        type: 'word',
        colors: [CHART_FOREST[0]],
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [
          {
            name: '提及次数',
            data: namedPoints(['森林', '清晨', '松果', '晨露', '小径', '鸟鸣', '苔藓', '树荫'], [100, 78, 64, 52, 46, 38, 30, 22])
          }
        ]
      }),
      galleryExample('warm', '暖色词云 · 集市记忆', '蜜桃与暖黄色系，搭配简洁的奶油底色。', {
        type: 'word',
        colors: CHART_SUNSET,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [
          {
            name: '提及次数',
            data: namedPoints(
              ['手作', '鲜花', '面包', '陶艺', '咖啡', '果酱', '甜品', '编织', '香草'],
              [92, 78, 68, 60, 52, 42, 34, 28, 20]
            )
          }
        ]
      }),
      galleryExample('focus', '重点词条 · 周末计划', '用单点颜色强调主词，保留图例用于交互筛选。', {
        type: 'word',
        colors: [CHART_FLOWERS[0]],
        style: CHART_BLOSSOM_SURFACE,
        series: [
          {
            name: '计划人数',
            data: [{ name: '慢生活', value: 120, color: CHART_SUNSET[0] }].concat(
              namedPoints(['阅读', '散步', '喝茶', '写信', '听风'], [68, 56, 44, 32, 24])
            )
          }
        ]
      })
    ],
    candle: [
      galleryExample('week', '每日区间 · 集市果价', '展示开、收、高、低，保留涨珊瑚、跌薄荷的语义。', {
        type: 'candle',
        categories: ['周一', '周二', '周三', '周四', '周五'],
        min: 20,
        max: 80,
        legend: false,
        series: [
          {
            name: '果价（虚构）',
            data: [
              { open: 36, close: 48, low: 30, high: 54 },
              { open: 48, close: 42, low: 36, high: 58 },
              { open: 42, close: 62, low: 38, high: 68 },
              { open: 62, close: 56, low: 48, high: 72 },
              { open: 56, close: 68, low: 50, high: 76 }
            ]
          }
        ]
      }),
      galleryExample('narrow-range', '局部量程 · 平稳交易', '缩小显示量程，观察幅度较小的区间变化。', {
        type: 'candle',
        categories: ['一', '二', '三', '四', '五'],
        min: 90,
        max: 110,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [
          {
            name: '成交价（虚构）',
            data: [
              { open: 96, close: 100, low: 94, high: 103 },
              { open: 100, close: 98, low: 95, high: 104 },
              { open: 98, close: 104, low: 96, high: 107 },
              { open: 104, close: 101, low: 98, high: 108 },
              { open: 101, close: 105, low: 99, high: 109 }
            ]
          }
        ]
      }),
      galleryExample('labels', '收盘标注 · 四季价格', '少量区间直接标注收盘值，便于快速对照。', {
        type: 'candle',
        categories: ['春', '夏', '秋', '冬'],
        min: 0,
        max: 100,
        showLabels: true,
        legend: false,
        style: CHART_CREAM_SURFACE,
        series: [
          {
            name: '季末价格（虚构）',
            data: [
              { open: 36, close: 58, low: 22, high: 74 },
              { open: 58, close: 42, low: 28, high: 70 },
              { open: 42, close: 68, low: 32, high: 86 },
              { open: 68, close: 54, low: 40, high: 80 }
            ]
          }
        ]
      }),
      galleryExample('flat', '平盘与波动 · 市集观察', '开收相同仍显示实体，悬浮查看完整区间。', {
        type: 'candle',
        categories: ['一', '二', '三', '四', '五'],
        min: 20,
        max: 80,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          {
            name: '观察价（虚构）',
            data: [
              { open: 40, close: 40, low: 32, high: 48 },
              { open: 40, close: 58, low: 36, high: 66 },
              { open: 58, close: 58, low: 50, high: 72 },
              { open: 58, close: 42, low: 34, high: 64 },
              { open: 42, close: 50, low: 38, high: 58 }
            ]
          }
        ]
      })
    ],
    time: [
      galleryExample('regular', '等时采样 · 步道到访', '每隔 15 分钟采样，曲线表达连续变化。', {
        type: 'time',
        smooth: true,
        colors: CHART_FOREST,
        legend: false,
        style: CHART_MINT_SURFACE,
        series: [
          { name: '到访人数', data: chartTimePoints([[0, 18], [15, 32], [30, 26], [45, 48], [60, 42], [75, 62]]) }
        ]
      }),
      galleryExample('irregular', '不等间隔 · 活动签到', '短间隔与长间隔按真实时间比例排列。', {
        type: 'time',
        colors: [CHART_SUNSET[0]],
        legend: false,
        showLabels: true,
        max: 100,
        style: CHART_CREAM_SURFACE,
        series: [
          { name: '累计签到', data: chartTimePoints([[0, 12], [5, 28], [12, 42], [45, 64], [90, 82]]) }
        ]
      }),
      galleryExample('comparison', '双线时序 · 南北入口', '同一时刻对比两个入口，悬浮提示合并读数。', {
        type: 'time',
        colors: [CHART_MEADOW[0], CHART_FLOWERS[0]],
        series: [
          { name: '南入口', data: chartTimePoints([[0, 22], [20, 42], [40, 36], [60, 62], [80, 48]]) },
          { name: '北入口', data: chartTimePoints([[0, 18], [20, 28], [40, 48], [60, 38], [80, 56]]) }
        ]
      }),
      galleryExample('minimal', '无网格时序 · 午后热度', '简化装饰，保留真实时间间隔与单点读取。', {
        type: 'time',
        colors: [CHART_FLOWERS[0]],
        showAxes: false,
        smooth: true,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [
          { name: '热度指数', data: chartTimePoints([[0, 24], [10, 38], [25, 62], [50, 46], [70, 72], [100, 58]]) }
        ]
      })
    ],
    map: [
      galleryExample('tonal', '单色深浅 · 分区到访', '同色填充深浅表达数量，区域名称直接标注。', {
        type: 'map',
        series: [{ name: '到访人数', data: CHART_PROPORTIONS }],
        regions: CHART_REGIONS,
        showLabels: true,
        colors: [CHART_FOREST[0]],
        legend: false,
        style: CHART_MINT_SURFACE
      }),
      galleryExample('category', '分类配色 · 区域采收', '不同区域采用暖色区分，悬浮查看各自采收量。', {
        type: 'map',
        regions: CHART_REGIONS,
        series: [{ name: '采收量', data: namedPoints(['果园', '海岸', '露营地', '花田'], [82, 26, 48, 62]) }],
        showLabels: false,
        colors: CHART_SUNSET,
        style: CHART_CREAM_SURFACE
      }),
      galleryExample('islands', '独立群岛 · 周末到访', '换一组平面轮廓，展示互不相连的四座虚构岛屿。', {
        type: 'map',
        regions: CHART_ARCHIPELAGO,
        colors: CHART_MEADOW,
        showLabels: true,
        legend: false,
        series: [
          { name: '到访人数', data: namedPoints(['风铃岛', '月湾岛', '小麦岛', '星沙岛'], [88, 62, 46, 30]) }
        ]
      }),
      galleryExample('missing', '缺测区域 · 观察记录', '星沙岛未提供记录，保留沙色轮廓而不填成零值。', {
        type: 'map',
        regions: CHART_ARCHIPELAGO,
        colors: [CHART_FLOWERS[0]],
        showLabels: true,
        legend: false,
        style: CHART_BLOSSOM_SURFACE,
        series: [{ name: '观察次数', data: namedPoints(['风铃岛', '月湾岛', '小麦岛'], [68, 92, 42]) }]
      })
    ]
  });

  var CHART_API_ROWS = [
    ['type', '19 种类型，见左侧图表统计分类', 'ChartType', "'column'"],
    ['series', '系列名称、data、颜色，mix 可配置系列 type', 'ChartSeries[]', '-', true],
    ['categories', '分类轴或雷达维度标签', 'string[]', '-'],
    ['title / description', '图表标题与说明', 'ReactNode', '-'],
    ['height', '绘图区高度，最小 180px', 'number', '300'],
    ['colors', '自定义配色，系列色和单点色优先', 'string[]', '岛屿配色'],
    ['legend', '可筛选和悬浮联动的图例', 'boolean', 'true'],
    ['tooltip', '提示开关或配置对象，见下方参数', 'boolean | ChartTooltipOptions', 'true'],
    ['tooltip.trigger', '同分类对比 / 单点提示，不支持分类的类型自动回退单点', "'axis' | 'item'", "'axis'"],
    ['tooltip.crosshair / showPercentage', '坐标辅助线 / 占比及漏斗转化率', 'boolean', 'true'],
    ['tooltip.render', '自定义提示，收到 type、name、items、locked；null 隐藏', '(context: ChartTooltipContext) => ReactNode', '-'],
    ['highlight / selectable', '悬浮高亮 / 点击锁定，方向键浏览数据，Esc 解除', 'boolean', 'true'],
    ['stacked', '柱状、条状图正负值分别堆叠', 'boolean', 'false'],
    ['smooth', '折线、面积、混合、时序图平滑连接；山峰图圆润峰顶', 'boolean', 'false'],
    ['showAxes / showLabels', '坐标网格 / 数据标签', 'boolean', 'true / false'],
    ['min / max', '值域；圆弧与仪表盘默认 0–100', 'number', '自动'],
    ['valueFormatter / xFormatter', '数值 / 数值横轴格式化', '(value: number) => string', '-'],
    ['regions', 'map 的平面轮廓，按 name 与数据关联', 'ChartMapRegion[]', '-'],
    ['loading / emptyText', '加载状态 / 空态文案', 'boolean / ReactNode', 'false / 暂无数据'],
    ['animated', '入场淡入，遵循减少动态效果设置', 'boolean', 'true'],
    ['onDataClick', '点击、Enter 或 Space 触发，携带原数据与下标', '(event: ChartDataEvent) => void', '-']
  ];

  function chartMeta(type) {
    for (var i = 0; i < CHART_PAGES.length; i++) {
      if (CHART_PAGES[i].type === type) return CHART_PAGES[i];
    }
    return { type: type, label: type, en: type, desc: '' };
  }

  /* ---------- 图表基础示例数据（对齐原版 data.ts 的 exampleProps） ---------- */
  var CHART_ALTERNATE_TREND = [51, 35, 72, 49, 86, 60, 93];

  /** 按类型生成基础示例，数据结构与公开 ChartProps 完全一致。 */
  function chartExample(type, alternate) {
    var values = alternate ? CHART_ALTERNATE_TREND : CHART_TREND;
    if (['pie', 'ring', 'rose', 'funnel', 'map'].indexOf(type) !== -1) {
      var props = {
        type: type,
        series: [
          {
            name: '到访人数',
            data: CHART_PROPORTIONS.map(function (item, index) {
              return { name: item.name, value: alternate ? item.value + index * 7 + 5 : item.value };
            })
          }
        ],
        showLabels: type === 'map'
      };
      if (type === 'map') props.regions = CHART_REGIONS;
      return props;
    }
    if (type === 'radar') {
      return {
        type: type,
        categories: ['生态', '服务', '交通', '设施', '景观'],
        max: 100,
        series: [
          { name: '本月', data: alternate ? [86, 70, 90, 60, 85] : [72, 90, 65, 82, 94] },
          { name: '上月', data: [60, 74, 78, 65, 81] }
        ]
      };
    }
    if (type === 'scatter' || type === 'bubble') {
      return {
        type: type,
        series: [
          {
            name: '海岸活动',
            data: [
              { name: '拾贝', x: 12, y: alternate ? 42 : 28, size: 12 },
              { name: '钓鱼', x: 30, y: 55, size: 25 },
              { name: '潜水', x: 46, y: 38, size: 18 },
              { name: '观景', x: 65, y: 72, size: 38 }
            ]
          },
          {
            name: '林间活动',
            data: [
              { name: '采果', x: 20, y: 42, size: 20 },
              { name: '野餐', x: 42, y: 64, size: 32 },
              { name: '露营', x: 58, y: 48, size: 16 }
            ]
          }
        ]
      };
    }
    if (type === 'gauge' || type === 'arcbar') {
      return {
        type: type,
        min: 0,
        max: 100,
        valueFormatter: formatPercent,
        series: type === 'gauge'
          ? [{ name: '岛屿舒适度', data: [alternate ? 91 : 72] }]
          : [
            { name: '植树目标', data: [alternate ? 88 : 72] },
            { name: '步道维护', data: [alternate ? 76 : 58] }
          ]
      };
    }
    if (type === 'word') {
      return {
        type: type,
        series: [
          {
            name: '提及次数',
            data: CHART_WORDS.map(function (name, index) {
              return { name: name, value: (alternate ? 15 - index : 12 - index) * 8 };
            })
          }
        ]
      };
    }
    if (type === 'candle') {
      return {
        type: type,
        categories: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06'],
        min: 20,
        series: [
          {
            name: '集市价格（示例）',
            data: [
              { open: 40, close: 55, low: 32, high: 62 },
              { open: 55, close: 48, low: 44, high: 66 },
              { open: 48, close: alternate ? 70 : 62, low: 42, high: 74 },
              { open: 62, close: 68, low: 54, high: 78 },
              { open: 68, close: 51, low: 47, high: 72 },
              { open: 51, close: 64, low: 45, high: 70 }
            ]
          }
        ]
      };
    }
    if (type === 'time') {
      return {
        type: type,
        series: [
          {
            name: '实时到访',
            data: [0, 5, 15, 20, 45, 60].map(function (minutes, index) {
              return {
                name: minutes + ' 分钟',
                x: Date.UTC(2026, 9, 31, 2, minutes),
                y: values[index]
              };
            })
          }
        ]
      };
    }
    return {
      type: type,
      categories: CHART_CATEGORIES,
      series: [
        { name: '本周', data: values, type: 'column' },
        { name: '上周', data: CHART_COMPARE, type: type === 'mix' ? 'line' : undefined }
      ]
    };
  }

  /** 去掉函数后的可复制配置，保持公开字段顺序。 */
  function chartExampleConfig(props) {
    var data = {};
    Object.keys(props).forEach(function (key) {
      if (typeof props[key] === 'function') return;
      data[key] = props[key];
    });
    return JSON.stringify(data, null, 4);
  }

  function chartExampleCode(props) {
    return "import { Chart, type ChartProps } from 'animal-island-ui';\n\n" +
      'const chartProps: ChartProps = ' + chartExampleConfig(props) + ';\n\n' +
      '<Chart {...chartProps} />';
  }

  /** 样式图集代码保留 valueFormatter / xFormatter 的函数源码。 */
  function chartGalleryCode(example) {
    var props = example.props;
    var data = {};
    Object.keys(props).forEach(function (key) {
      if (key === 'valueFormatter' || key === 'xFormatter') return;
      data[key] = props[key];
    });
    var json = JSON.stringify(data, null, 4);
    var functions = ['valueFormatter', 'xFormatter'].map(function (name) {
      var format = props[name];
      if (typeof format !== 'function') return '';
      var source = format.__code || String(format);
      return '    ' + name + ': ' + source.replace(/\n/g, '\n    ');
    }).filter(function (item) { return item; });
    var config = functions.length ? json.slice(0, -2) + ',\n' + functions.join(',\n') + '\n}' : json;
    return "import { Chart, type ChartProps } from 'animal-island-ui';\n\n" +
      'const chartProps: ChartProps = ' + config + ';\n\n' +
      '<Chart {...chartProps} />';
  }

  function chartNextId(prefix) {
    chartMountSeq += 1;
    return prefix + '-' + chartMountSeq;
  }

  /** 登记一个内联图表挂载点，供 initPage 统一实例化。 */
  function chartMountInline(config, extra) {
    var entry = { id: chartNextId('chart-mount'), config: config };
    if (extra) Object.keys(extra).forEach(function (key) { entry[key] = extra[key]; });
    CHART_MOUNTS.push(entry);
    return '<div id="' + entry.id + '"></div>';
  }

  function chartGalleryItem(example, linked) {
    var entry = { id: chartNextId('chart-mount'), config: example.props };
    CHART_MOUNTS.push(entry);
    var html = '<article class="chart-gallery__item" aria-label="' + esc(example.props.title) + '示例">' +
      '<div id="' + entry.id + '"></div>' +
      '<div class="chart-gallery__actions">' +
      '<details class="chart-gallery__code"><summary>查看配置</summary>' +
      '<pre class="ai-code-block chart-gallery__pre">' + AI.CodeBlock.highlight(chartGalleryCode(example)) + '</pre>' +
      '</details>';
    if (linked) {
      var meta = chartMeta(example.props.type);
      html += '<a href="#/chart-' + meta.type + '">更多' + meta.label + '示例</a>';
    }
    return html + '</div></article>';
  }

  function chartGallery(type) {
    var examples = CHART_GALLERY[type] || [];
    return '<section class="chart-gallery" aria-label="图表样式与场景示例">' +
      '<header class="chart-gallery__header">' +
      '<h2>样式与场景</h2>' +
      '<p>' + examples.length + ' 种独立示例，比较配色、布局和数据表达；悬浮读数，点击图例筛选，展开配置即可复用。</p>' +
      '</header>' +
      '<div class="chart-gallery__grid">' +
      examples.map(function (example) { return chartGalleryItem(example, false); }).join('') +
      '</div></section>';
  }

  function chartShowcaseGallery() {
    var picks = [
      CHART_GALLERY.column[0],
      CHART_GALLERY.line[0],
      CHART_GALLERY.ring[0],
      CHART_GALLERY.bar[2],
      CHART_GALLERY.radar[2],
      CHART_GALLERY.bubble[1],
      CHART_GALLERY.funnel[0],
      CHART_GALLERY.map[2]
    ];
    return '<section class="chart-gallery" aria-label="图表样式精选">' +
      '<header class="chart-gallery__header">' +
      '<h2>图表样式精选</h2>' +
      '<p>从趋势、构成到分布与转化。每种图表另有 4 组样式示例，所有数据与地图均为虚构演示。</p>' +
      '</header>' +
      '<div class="chart-gallery__grid">' +
      picks.map(function (example) { return chartGalleryItem(example, true); }).join('') +
      '</div></section>';
  }

  /** 山峰图的圆润峰顶对照示例。 */
  function chartMountCurve() {
    var config = {
      type: 'mount',
      categories: ['果园', '海岸', '营地', '花田'],
      series: [
        {
          name: '到访人数',
          data: namedPoints(['果园', '海岸', '营地', '花田'], [58, 86, 42, 68], CHART_MEADOW)
        }
      ],
      min: 0,
      max: 100,
      legend: false,
      showLabels: true,
      height: 240
    };
    var code = "import { Chart, type ChartProps } from 'animal-island-ui';\n\n" +
      'const chartProps: ChartProps = ' + JSON.stringify(config, null, 4) + ';\n\n' +
      '<Chart {...chartProps} smooth title="圆润山峰" />';
    return '<section class="chart-gallery" aria-label="山峰弧度对照示例">' +
      '<header class="chart-gallery__header">' +
      '<h2>新增示例：圆润山峰</h2>' +
      '<p>同一组数据，对照尖顶与圆弧峰顶。圆润轮廓从山脚平滑过渡至峰顶，数值高度保持一致。</p>' +
      '</header>' +
      '<div class="chart-gallery__grid chart-gallery__grid--comparison">' +
      chartMountInline(chartMerge(config, { title: '默认尖顶', description: '保留原有山峰轮廓。' })) +
      chartMountInline(chartMerge(config, { smooth: true, title: '圆弧峰顶', description: '平滑的坡面与圆润峰顶，适合柔和的海岛统计。' })) +
      '</div>' +
      '<div class="chart-gallery__actions">' +
      '<details class="chart-gallery__code"><summary>查看圆润山峰配置</summary>' +
      '<pre class="ai-code-block chart-gallery__pre">' + AI.CodeBlock.highlight(code) + '</pre>' +
      '</details></div></section>';
  }

  /** 交互示例按统计口径补充提示说明。 */
  var CHART_INTERACTION_DETAILS = {
    pie: '提示包含当前可见数据的占比；隐藏图例后占比随可见合计更新。',
    ring: '圆心展示可见合计，提示展示单项占比；锁定后可稳定对照数值。',
    rose: '扇区面积表示数值，提示同时列出数值与可见数据占比。',
    funnel: '保持业务阶段顺序，提示展示相对首阶段比例与相对上一可见阶段的转化率。',
    candle: '提示保留开、收、低、高四个值，辅助线便于按日期对照。',
    time: '同时间戳的数据才参与对比，不同采样时间不会按数组下标混合。',
    scatter: '提示展示横纵坐标，双向辅助线帮助定位散点。',
    bubble: '提示保留横纵坐标和权重，气泡面积仍与权重成正比。',
    radar: '同一维度可同时比较各系列；悬浮图例可单独突出对应多边形。',
    map: '悬浮区域或对应图例可突出分区，点击可锁定统计值。轮廓为虚构岛屿。',
    word: '悬浮词条或图例突出权重，未放入图面的词条仍保留在数据明细中。',
    gauge: '指针限定在量程内，提示保留原始读数；点击锁定后可继续查看明细。',
    arcbar: '每个可见系列的首个有效值作为指标，提示保留原始数值。'
  };

  function chartSwitch(label, option, checked) {
    return '<label class="chart-demo-toggle"><span>' + label + '</span>' +
      '<button type="button" class="ai-switch ai-switch--sm' + (checked ? ' ai-switch--checked' : '') + '"' +
      ' role="switch" aria-checked="' + (checked ? 'true' : 'false') + '" aria-label="' + label + '"' +
      ' data-chart-option="' + option + '">' +
      '<span class="ai-switch__handle"></span><span class="ai-switch__inner"></span></button></label>';
  }

  function chartInteractionCode(view) {
    var tooltip = JSON.stringify({
      trigger: view.shared ? 'axis' : 'item',
      crosshair: view.crosshair,
      showPercentage: view.percentage
    }, null, 4);
    return '<Chart {...chartProps}\n' +
      '    highlight={' + view.highlight + '}\n' +
      '    selectable={' + view.selectable + '}\n' +
      '    tooltip={' + tooltip + '}\n' +
      '/>\n\n' +
      '// 自定义提示（context.items 包含原数据、格式化值、颜色及适用的比例）\n' +
      '<Chart {...chartProps} tooltip={{\n' +
      '    render: ({ name, items }) => <div>\n' +
      '        <strong>{name}</strong>\n' +
      '        {items.map(item => <p key={item.seriesIndex + \'-\' + item.dataIndex}>\n' +
      '            {item.seriesName}：{item.formattedValue}\n' +
      '        </p>)}\n' +
      '    </div>\n' +
      '}} />';
  }

  /** 每个类型共用的交互示例：开关只影响本页图表。 */
  function chartInteraction(type) {
    var axis = ['column', 'bar', 'line', 'area', 'mount', 'mix', 'candle', 'time', 'radar'].indexOf(type) !== -1;
    var proportion = ['pie', 'ring', 'rose', 'funnel'].indexOf(type) !== -1;
    var codeId = chartNextId('chart-interaction-code');
    var mountId = chartNextId('chart-mount');
    CHART_MOUNTS.push({ id: mountId, config: chartMerge(chartExample(type), {
      title: '交互细节体验',
      description: '悬浮图例突出数据；点击图例筛选。聚焦图形后可用方向键逐项浏览。',
      height: 320
    }), interaction: true, codeId: codeId });
    var controls = '';
    if (axis) controls += chartSwitch('同分类对比', 'shared', true);
    controls += chartSwitch('悬浮高亮', 'highlight', true);
    controls += chartSwitch('点击锁定', 'selectable', true);
    if (axis || type === 'scatter' || type === 'bubble') controls += chartSwitch('坐标辅助线', 'crosshair', true);
    if (proportion) controls += chartSwitch('比例明细', 'percentage', true);
    var detail = CHART_INTERACTION_DETAILS[type] || '移入绘图区即可读取同分类的多个系列，无需精确碰到柱体或折线点。';
    return '<section class="chart-demo-interaction-demo" aria-label="新增图表交互示例">' +
      '<div class="chart-demo-subtitle">新增示例：悬浮对比与锁定读数</div>' +
      '<p class="chart-demo-note">' + detail + '</p>' +
      '<div class="chart-demo-controls">' + controls + '</div>' +
      '<div id="' + mountId + '"></div>' +
      '<p class="chart-demo-note" role="status" data-chart-status>最近点击：尚未点击数据。Enter / 空格锁定，Esc 解除。</p>' +
      '<pre class="ai-code-block chart-demo-code" id="' + codeId + '">' +
      AI.CodeBlock.highlight(chartInteractionCode({ shared: true, highlight: true, selectable: true, crosshair: true, percentage: true })) +
      '</pre></section>';
  }

  /** 基础示例与状态切换：数据、空态、加载态与堆叠/曲线。 */
  function chartStateDemo(type) {
    var meta = chartMeta(type);
    var stack = type === 'column' || type === 'bar';
    var smooth = ['line', 'area', 'mix', 'time'].indexOf(type) !== -1;
    var controls = '<button type="button" class="ai-btn ai-btn--sm ai-btn--default" data-state-action="alternate">切换数据</button>' +
      '<button type="button" class="ai-btn ai-btn--sm ai-btn--default" data-state-action="empty">查看空态</button>' +
      '<button type="button" class="ai-btn ai-btn--sm ai-btn--default" data-state-action="loading">查看加载态</button>';
    if (stack || smooth) {
      controls += '<button type="button" class="ai-btn ai-btn--sm ai-btn--default" data-state-action="enhanced">' +
        (stack ? '切换堆叠' : '切换曲线') + '</button>';
    }
    return '<div class="demo-label">基础示例与状态切换</div>' +
      '<div class="chart-demo-controls" data-chart-state-controls>' + controls + '</div>' +
      chartMountInline(chartMerge(chartExample(type), {
        title: '岛屿' + meta.label,
        description: meta.desc,
        height: 320
      }), { state: true, type: type }) +
      '<p class="chart-demo-note" role="status" data-chart-status>点击图形查看数据；点击图例隐藏或恢复系列。</p>';
  }

  function chartCatalog() {
    var links = CHART_PAGES.map(function (page) {
      return '<a href="#/chart-' + page.type + '"><strong>' + page.label + '</strong><span>' + page.desc + '</span></a>';
    }).join('');
    return '<section class="chart-catalog-section" aria-labelledby="chart-catalog-title">' +
      '<h2 id="chart-catalog-title" class="chart-catalog__title">选择图表类型</h2>' +
      '<nav class="chart-catalog" aria-label="图表类型">' + links + '</nav></section>';
  }

  /* 总览保留精选图集、基础概览与类型目录。 */
  DEMOS.chart = function () {
    return '<div class="demo-section">' +
      '<div class="demo-section-title">岛屿统计手账</div>' +
      '<p class="chart-demo-note">19 种统计图形，共用岛屿配色、数据提示、图例筛选和键盘操作。以下均为演示数据。</p>' +
      chartShowcaseGallery() +
      '<div class="demo-label">基础概览</div>' +
      '<div class="chart-demo-overview">' +
      chartMountInline(chartMerge(chartExample('area'), { title: '一周到访趋势', smooth: true, height: 280 })) +
      chartMountInline(chartMerge(chartExample('ring'), { title: '岛屿分区占比', height: 280 })) +
      '</div>' +
      chartMountInline(chartMerge(chartExample('column'), {
        title: '每日活动参与',
        description: '点击图例可单独查看一组数据',
        height: 280
      })) +
      chartCatalog() +
      '</div>';
  };

  /* 每个类型页：样式图集 → 状态切换 → 边界示例 → 代码 → 交互示例 → API。 */
  CHART_PAGES.forEach(function (page) {
    DEMOS['chart-' + page.type] = function () {
      var note = '以下为虚构演示数据。' +
        (page.type === 'map' ? '地图为自绘岛屿分区，不代表真实行政区。' : page.desc);
      var html = '<div class="demo-section">' +
        '<div class="demo-section-title">' + page.label + ' · 海岛统计</div>' +
        '<p class="chart-demo-note">' + esc(note) + '</p>' +
        (page.type === 'mount' ? chartMountCurve() : '') +
        chartGallery(page.type) +
        chartStateDemo(page.type);
      if (['column', 'bar', 'line', 'area'].indexOf(page.type) !== -1) {
        html += '<div class="demo-label">边界示例：负值、零值与缺测</div>' +
          chartMountInline({
            type: page.type,
            title: '盈余与支出',
            categories: ['周一', '周二', '周三', '周四', '周五'],
            series: [{ name: '净变化', data: [18, -12, null, 0, 26] }],
            height: 240
          });
      }
      html += codeL(chartExampleCode(chartExample(page.type))) +
        chartInteraction(page.type) +
        apiT(CHART_API_ROWS, 'Chart') +
        '</div>';
      return html;
    };
  });

  /* ==============================
     Component page
     ============================== */
  function renderCompPage(key) {
    CHART_MOUNTS.length = 0;
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

    // Divider demos：海浪与图标循环需要 JS 挂载
    if (key === 'divider') {
      var oceanMount = document.getElementById('divider-ocean');
      if (oceanMount) oceanMount.appendChild(AI.Divider({ type: 'ocean-wave' }));
      var iconMount = document.getElementById('divider-icon');
      if (iconMount) {
        var iconDivider = AI.Divider({
          icon: '<span class="ai-icon ai-icon--miles" style="width:24px;height:24px"></span>',
          iconSize: 24,
          iconGap: 8
        });
        iconMount.appendChild(iconDivider);
        cleanups.push(function () {
          if (iconDivider.__aiDividerRO) iconDivider.__aiDividerRO.disconnect();
        });
      }
    }

    // Radio：受控回显 + 垂直单项禁用 + 3D 按键感
    if (key === 'radio') {
      var seasonLabels = { spring: '春天', summer: '夏天', autumn: '秋天', winter: '冬天' };
      var timeLabels = { morning: '早晨', noon: '中午', evening: '傍晚', night: '深夜' };
      var seasonEcho = document.getElementById('radio-season-echo');
      var pressEcho = document.getElementById('radio-press-echo');
      var radioSeason = document.getElementById('radio-season');
      var radioFruit = document.getElementById('radio-fruit');
      var radioPress = document.getElementById('radio-press');
      if (radioSeason) {
        var seasonInst = new AI.Radio(radioSeason, {
          value: 'spring',
          options: [
            { label: '春天', value: 'spring' },
            { label: '夏天', value: 'summer' },
            { label: '秋天', value: 'autumn' },
            { label: '冬天', value: 'winter' }
          ],
          onChange: function (v) {
            if (seasonEcho) seasonEcho.textContent = seasonLabels[v] || '无';
          }
        });
        radioSeason.style.gap = '20px';
        seasonInst._render();
      }
      if (radioFruit) {
        var fruitInst = new AI.Radio(radioFruit, {
          value: '',
          direction: 'vertical',
          options: [
            { label: '苹果', value: 'apple' },
            { label: '橙子', value: 'orange' },
            { label: '桃子', value: 'peach' },
            { label: '梨子', value: 'pear', disabled: true },
            { label: '樱桃', value: 'cherry' }
          ]
        });
        radioFruit.style.gap = '12px';
        fruitInst._render();
      }
      if (radioPress) {
        var pressInst = new AI.Radio(radioPress, {
          size: 'large',
          value: 'noon',
          options: [
            { label: '早晨', value: 'morning' },
            { label: '中午', value: 'noon' },
            { label: '傍晚', value: 'evening' },
            { label: '深夜', value: 'night' }
          ],
          onChange: function (v) {
            if (pressEcho) pressEcho.textContent = timeLabels[v] || '无';
          }
        });
        pressInst._render();
      }
    }

    // Checkbox：受控组回显
    if (key === 'checkbox') {
      var cbEl = document.getElementById('checkbox-controlled');
      var cbEcho = document.getElementById('checkbox-echo');
      if (cbEl) {
        var cbLabels = { beach: '海滩', forest: '森林', garden: '花园', village: '村庄' };
        var cbValues = ['beach', 'garden'];
        var cbInst = new AI.Checkbox(cbEl, {
          value: cbValues,
          onChange: function (next) {
            cbValues = next;
            cbInst._applyValues(next);
            if (cbEcho) cbEcho.textContent = next.length ? next.map(function (v) { return cbLabels[v]; }).join('、') : '无';
          }
        });
      }
    }

    // Skeleton：loading 切换（子组件卡片 + 状态文案）
    if (key === 'skeleton') {
      var skSwitch = document.getElementById('skeleton-switch');
      var skStatus = document.getElementById('skeleton-status');
      var skSub = document.getElementById('skeleton-sub');
      if (skSwitch) {
        var skLoading = true;
        var onSkClick = function () {
          skLoading = !skLoading;
          skSwitch.classList.toggle('ai-switch--checked', skLoading);
          skSwitch.setAttribute('aria-checked', skLoading ? 'true' : 'false');
          if (skStatus) skStatus.textContent = skLoading ? '加载中' : '已加载';
          if (skSub) skSub.innerHTML = skeletonSubCards(skLoading);
        };
        skSwitch.addEventListener('click', onSkClick);
        cleanups.push(function () {
          skSwitch.removeEventListener('click', onSkClick);
        });
      }
    }

    // Tag：可关闭列表（关闭即从数据中移除，全部关闭后显示空态）
    if (key === 'tag') {
      var tagList = document.getElementById('tag-closable-list');
      var tagItems = [
        { name: 'Apple', color: 'app-pink' },
        { name: 'Banana', color: 'app-yellow' },
        { name: 'Grape', color: 'purple' },
        { name: 'Blueberry', color: 'app-blue' },
        { name: 'Mint', color: 'app-teal' },
        { name: 'Lime', color: 'lime-green' },
        { name: 'Orange', color: 'app-orange' }
      ];
      var renderTagList = function () {
        tagList.innerHTML = '';
        if (!tagItems.length) {
          tagList.innerHTML = '<span style="font-size:12px;color:#a0936e">所有标签都已关闭</span>';
          return;
        }
        tagItems.forEach(function (item) {
          var span = document.createElement('span');
          span.className = 'ai-tag ai-tag--md ai-tag--solid ai-tag--' + item.color;
          span.innerHTML = '<span class="ai-tag__text">' + item.name + '</span>' +
            '<button class="ai-tag__close" aria-label="close">×</button>';
          tagList.appendChild(span);
          new AI.Tag(span, {
            onClose: function () {
              tagItems = tagItems.filter(function (x) { return x.name !== item.name; });
              renderTagList();
            }
          });
        });
      };
      if (tagList) renderTagList();
    }

    // BackTop：demo 的滚动容器是 .main-content，并像原版一样自动滚到底部
    if (key === 'backtop') {
      var backtopMount = document.getElementById('backtop-mount');
      var scroller = document.querySelector('.main-content');
      if (backtopMount) {
        var backtop = new AI.BackTop(backtopMount, {
          visibilityHeight: 400,
          target: function () { return scroller || window; }
        });
        cleanups.push(function () { backtop.destroy(); });
      }
      var scrollTimer = setTimeout(function () {
        if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
      }, 500);
      cleanups.push(function () { clearTimeout(scrollTimer); });
    }

    // CodeBlock onCopy 演示
    if (key === 'codeblock') {
      var copyMount = document.getElementById('codeblock-copy-demo');
      var copyStatus = document.getElementById('codeblock-copy-status');
      if (copyMount) {
        var copyPre = document.createElement('pre');
        copyPre.className = 'ai-code-block';
        copyPre.textContent = 'const copied = await navigator.clipboard.writeText(code);';
        copyMount.appendChild(copyPre);
        new AI.CodeBlock(copyPre, {
          onCopy: function (code) {
            if (copyStatus) copyStatus.textContent = '已复制：' + code;
          }
        });
      }
    }

    // Time demos：多个语言 / 格式 / 换肤实例
    if (key === 'time') {
      var timeVariants = [
        ['time-default', {}],
        ['time-zh', { locale: 'zh-cn' }],
        ['time-fmt-en', { weekdayFormat: 'ddd', dateFormat: 'YYYY/MM/DD' }],
        ['time-fmt-zh', { locale: 'zh-cn', weekdayFormat: 'ddd', dateFormat: 'YYYY年M月D日' }],
        ['time-custom', { className: 'my-time' }]
      ];
      timeVariants.forEach(function (item) {
        var mount = document.getElementById(item[0]);
        if (!mount) return;
        var inst = new AI.Time(mount, item[1]);
        cleanups.push(function () { inst.destroy(); });
      });
    }

    // Footer demo
    if (key === 'footer') {
      var footerMount = document.getElementById('footer-js-mount');
      if (footerMount) footerMount.appendChild(AI.Footer({ year: 2026, text: '动物岛 UI · Powered by AI' }));
    }

    // Tag 演示：组件本身只触发 onClose（与原版一致），由演示页负责移除
    if (key === 'tag') {
      document.querySelectorAll('.main-content .ai-tag__close').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var tag = btn.closest('.ai-tag');
          if (!tag || tag.classList.contains('ai-tag--disabled')) return;
          tag.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.8)';
          setTimeout(function () { if (tag.parentNode) tag.parentNode.removeChild(tag); }, 200);
        });
      });
    }

    // Modal demos
    if (key === 'modal') {
      var b0 = document.getElementById('modal-game');
      var b1 = document.getElementById('modal-basic');
      var b2 = document.getElementById('modal-title');
      var b3 = document.getElementById('modal-custom-footer');
      var b4 = document.getElementById('modal-no-typewriter');
      var b5 = document.getElementById('modal-light-mask');
      var b6 = document.getElementById('modal-dark-mask');
      var stoneContent = '<div style="text-align:center;width:100%;display:flex;flex-direction:column;align-items:center;gap:8px"><span>钓到<span style="color:#FD9303">石头</span>了!</span><span>竟然连这种都能钓起来...</span></div>';
      if (b0) b0.addEventListener('click', function () {
        new AI.Modal({ variant: 'game', content: stoneContent, width: 480, typewriter: true, typeSpeed: 60 }).open();
      });
      if (b1) b1.addEventListener('click', function () {
        new AI.Modal({ content: stoneContent, width: 480, typewriter: true, typeSpeed: 60 }).open();
      });
      if (b2) b2.addEventListener('click', function () {
        new AI.Modal({ title: '博物馆捐赠', content: '是否愿意将这条鱼捐赠给博物馆呢？海獭馆长会好好照顾它的！这可是博物馆的新展品哦~', width: 480, typewriter: true, typeSpeed: 60 }).open();
      });
      if (b3) b3.addEventListener('click', function () {
        new AI.Modal({ title: '确认操作', content: '确定要让这位居民搬走吗？这个操作不可撤销。', width: 420, footer: '<button class="ai-modal__footer-btn" onclick="this.closest(\'.ai-modal-mask\').remove();document.body.style.overflow=\'\'">再想想</button><button class="ai-modal__footer-btn ai-modal__footer-btn--primary" style="background:#e05a5a;border-color:#e05a5a" onclick="this.closest(\'.ai-modal-mask\').remove();document.body.style.overflow=\'\'">确认搬家</button>' }).open();
      });
      if (b4) b4.addEventListener('click', function () {
        new AI.Modal({ title: '天气预报', content: '明天天气晴朗，气温 20-28°C，适合外出活动！', width: 420, typewriter: false }).open();
      });
      if (b5) b5.addEventListener('click', function () {
        new AI.Modal({ title: '浅色遮罩', content: '这是一个浅色遮罩的弹窗，遮罩几乎透明。', width: 480, maskStyle: { background: 'rgba(0, 0, 0, 0.08)' } }).open();
      });
      if (b6) b6.addEventListener('click', function () {
        new AI.Modal({ title: '深色遮罩', content: '这是一个深色遮罩的弹窗，背景更暗、聚焦感更强。', width: 480, maskStyle: { background: 'rgba(0, 0, 0, 0.75)' } }).open();
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
      var loadingTimer = null;
      var playLoading = function (opts) {
        if (!loadingEl) return;
        if (loadingInstance) loadingInstance.destroy();
        loadingInstance = new AI.Loading(loadingEl, {
          active: true,
          type: opts.type || 'snow',
          showBoat: opts.showBoat !== false,
          tip: opts.tip,
          delay: opts.delay || 0,
          fadeDuration: opts.fade != null ? opts.fade : 0.6,
          zIndex: 3000
        });
        clearTimeout(loadingTimer);
        loadingTimer = setTimeout(function () {
          if (loadingInstance) loadingInstance.setActive(false);
        }, opts.duration || 2400);
      };
      document.querySelectorAll('.main-content [data-load-type]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          playLoading({
            type: btn.getAttribute('data-load-type'),
            tip: btn.getAttribute('data-load-tip') || undefined,
            showBoat: btn.getAttribute('data-load-boat') !== 'false',
            delay: parseInt(btn.getAttribute('data-load-delay') || '0', 10),
            fade: btn.getAttribute('data-load-fade') ? parseFloat(btn.getAttribute('data-load-fade')) : undefined,
            duration: btn.getAttribute('data-load-duration') ? parseInt(btn.getAttribute('data-load-duration'), 10) : undefined
          });
        });
      });
      cleanups.push(function () {
        clearTimeout(loadingTimer);
        if (loadingInstance) loadingInstance.destroy();
      });
    }

    // Table demo
    if (key === 'table') {
      var hobbyStyles = {
        '音乐': { bg: '#ece7f8', color: '#7b5cd6' },
        '运动': { bg: '#fff0dc', color: '#d97a00' },
        '唱歌': { bg: '#ffe8e4', color: '#dd5040' },
        '钓鱼': { bg: '#e2effd', color: '#1d7fd6' },
        '画画': { bg: '#ffe8f1', color: '#dd5096' }
      };
      var tableColumns = [
        { title: '岛民', dataIndex: 'name', width: 120 },
        { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
        { title: '岛屿', dataIndex: 'island' },
        { title: '喜欢的水果', dataIndex: 'fruit' },
        { title: '爱好', dataIndex: 'hobby', render: function (val) {
          var s = hobbyStyles[val] || { bg: '#e0f7f4', color: '#129a8e' };
          return '<span style="padding:4px 12px;background:' + s.bg + ';border-radius:20px;color:' + s.color + ';font-weight:600;font-size:12px">' + val + '</span>';
        }}
      ];
      var tableData = [
        { key: '1', name: '豆狸', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },
        { key: '2', name: '粒狸', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },
        { key: '3', name: '西施惠', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },
        { key: '4', name: '喻哥', age: 30, island: '无人岛', fruit: '梨', hobby: '钓鱼' },
        { key: '5', name: '小润', age: 22, island: '摸鱼岛', fruit: '桃子', hobby: '画画' }
      ];
      var bigIslands = ['彩虹岛', '好评岛', '无人岛', '摸鱼岛'];
      var bigFruits = ['苹果', '橘子', '樱桃', '梨', '桃子'];
      var bigHobbies = ['音乐', '运动', '唱歌', '钓鱼', '画画'];
      var bigDataSource = [];
      for (var bi = 0; bi < 12; bi++) {
        bigDataSource.push({
          key: String(bi + 1),
          name: '岛民 ' + (bi + 1),
          age: 20 + bi,
          island: bigIslands[bi % 4],
          fruit: bigFruits[bi % 5],
          hobby: bigHobbies[bi % 5]
        });
      }

      var basicWrapper = document.getElementById('table-basic');
      var pagedWrapper = document.getElementById('table-paged');
      var basicTable = null;
      var mountBasic = function (striped) {
        if (!basicWrapper) return;
        basicTable = new AI.Table(basicWrapper, { columns: tableColumns, dataSource: tableData, striped: striped });
      };
      mountBasic(true);
      if (pagedWrapper) {
        new AI.Table(pagedWrapper, {
          columns: tableColumns,
          dataSource: bigDataSource,
          striped: true,
          pagination: {
            defaultPageSize: 3,
            showTotal: true,
            showSizeChanger: true,
            pageSizeOptions: [3, 5, 8]
          }
        });
      }

      var stripeBtn = document.getElementById('table-stripe-btn');
      var isStriped = true;
      if (stripeBtn) stripeBtn.addEventListener('click', function () {
        isStriped = !isStriped;
        stripeBtn.textContent = '斑马纹 ' + (isStriped ? '✓' : '✗');
        stripeBtn.className = 'ai-btn' + (isStriped ? ' ai-btn--primary' : '');
        mountBasic(isStriped);
      });

      var loadBtn = document.getElementById('table-loading-btn');
      var loadTimer = null;
      if (loadBtn) loadBtn.addEventListener('click', function () {
        if (!basicTable) return;
        basicTable.setLoading(true);
        loadBtn.disabled = true;
        loadBtn.textContent = '加载中...';
        loadTimer = setTimeout(function () {
          basicTable.setLoading(false);
          loadBtn.disabled = false;
          loadBtn.textContent = '模拟加载';
        }, 2000);
      });
      cleanups.push(function () {
        if (loadTimer) clearTimeout(loadTimer);
      });
    }

    // Select：受控回显 + 同组分组的实例同步 + allowClear / showSearch
    if (key === 'select') {
      var selectEcho = document.getElementById('select-value');
      var selectGroups = {};
      document.querySelectorAll('.demo-section .ai-select').forEach(function (el) {
        var group = el.getAttribute('data-select-group');
        var inst = new AI.Select(el, {
          variant: el.getAttribute('data-variant') || 'default',
          allowClear: el.getAttribute('data-allow-clear') === 'true',
          showSearch: el.getAttribute('data-show-search') === 'true',
          clearAriaLabel: el.getAttribute('data-clear-aria-label') || '清除',
          placeholder: el.getAttribute('data-placeholder') || '请选择',
          disabled: el.classList.contains('ai-select--disabled'),
          value: el.getAttribute('data-value') || '',
          onChange: function (nextKey) {
            if (!group) return;
            (selectGroups[group] || []).forEach(function (other) {
              if (other !== inst) other.update({ value: nextKey });
            });
            if (group === 'fish' && selectEcho) {
              var active = el.querySelector('.ai-select__option--active .ai-select__option-label');
              selectEcho.textContent = active ? active.textContent : '未选择';
            }
          }
        });
        if (group) (selectGroups[group] = selectGroups[group] || []).push(inst);
      });
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

    // Progress
    if (key === 'progress') {
      var pct = 45;
      var expPct = 72;
      var uploading = false;
      var uploadPct = 0;
      var uploadTimer = null;
      var waveAnimated = true;
      var progressEl = function (id) { return document.getElementById(id); };

      var upload = null;
      var uploadMount = progressEl('progress-upload');
      if (uploadMount) {
        upload = new AI.Progress(uploadMount, {
          percent: 0,
          infoFormat: function (p) { return p >= 100 ? '上传完成 ✓' : Math.round(p) + '%'; }
        });
      }
      var uploadBtn = progressEl('progress-upload-btn');
      if (uploadBtn) uploadBtn.addEventListener('click', function () {
        if (uploading) return;
        uploading = true;
        uploadPct = 0;
        uploadBtn.textContent = '上传中…';
        uploadBtn.disabled = true;
        if (upload) upload.setPercent(0);
        clearInterval(uploadTimer);
        uploadTimer = setInterval(function () {
          uploadPct = Math.min(100, uploadPct + 5);
          if (upload) upload.setPercent(uploadPct);
          if (uploadPct >= 100) {
            clearInterval(uploadTimer);
            setTimeout(function () {
              uploading = false;
              uploadBtn.textContent = '开始上传';
              uploadBtn.disabled = false;
            }, 600);
          }
        }, 220);
      });
      cleanups.push(function () { clearInterval(uploadTimer); });

      var exp = null;
      var expMount = progressEl('progress-exp');
      if (expMount) {
        exp = new AI.Progress(expMount, {
          percent: expPct,
          infoFormat: function (p) { return Math.round((p / 100) * 5000) + ' / 5000 星'; }
        });
      }
      document.querySelectorAll('[data-exp-delta]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          expPct = Math.max(0, Math.min(100, expPct + parseInt(btn.getAttribute('data-exp-delta'), 10)));
          if (exp) exp.setPercent(expPct);
        });
      });

      var taskMount = progressEl('progress-task');
      if (taskMount) {
        new AI.Progress(taskMount, {
          percent: 60,
          infoFormat: function (p) { return Math.round((p / 100) * 10) + ' / 10'; }
        });
      }

      new AI.Progress(progressEl('progress-basic-25'), { percent: 25 });
      new AI.Progress(progressEl('progress-basic-50'), { percent: 50 });
      new AI.Progress(progressEl('progress-basic-100'), { percent: 100 });
      new AI.Progress(progressEl('progress-size-sm'), { percent: 50, size: 'small' });
      new AI.Progress(progressEl('progress-size-md'), { percent: 50, size: 'middle' });
      new AI.Progress(progressEl('progress-size-lg'), { percent: 50, size: 'large' });
      new AI.Progress(progressEl('progress-variant-sweet'), { percent: 70, variant: 'sweet-corner' });
      new AI.Progress(progressEl('progress-variant-forest'), { percent: 70, variant: 'forest-grove' });
      new AI.Progress(progressEl('progress-variant-starry'), { percent: 70, variant: 'starry-camp' });
      new AI.Progress(progressEl('progress-variant-coffee'), { percent: 70, variant: 'coffee-break' });

      var slider = null;
      var sliderMount = progressEl('progress-slider');
      if (sliderMount) slider = new AI.Progress(sliderMount, { percent: pct });
      var noanim = null;
      var noanimMount = progressEl('progress-noanim');
      if (noanimMount) noanim = new AI.Progress(noanimMount, { percent: pct, duration: 0 });
      var range = progressEl('progress-range');
      var rangeValue = progressEl('progress-range-value');
      if (range) range.addEventListener('input', function () {
        pct = parseInt(range.value, 10);
        if (rangeValue) rangeValue.textContent = pct + '%';
        if (slider) slider.setPercent(pct);
        if (noanim) noanim.setPercent(pct);
        appearance.forEach(function (item) { item.instance.setPercent(pct); });
      });
      new AI.Progress(progressEl('progress-noinfo'), { percent: 66, showInfo: false });

      var appearance = [];
      var addAppearance = function (id, opts) {
        var mount = progressEl(id);
        if (!mount) return null;
        var inst = new AI.Progress(mount, Object.assign({ percent: pct }, opts));
        appearance.push({ instance: inst, opts: opts });
        return inst;
      };
      addAppearance('progress-color-peach', { color: '#e59266', 'aria-label': '蜜桃色进度' });
      addAppearance('progress-color-green', { color: '#8ac68a', 'aria-label': '草绿色进度' });
      addAppearance('progress-color-purple', { color: '#b77dee', 'aria-label': '紫色进度' });
      addAppearance('progress-wave-sm', { wave: true, animated: true, size: 'small', 'aria-label': '小号海浪进度' });
      addAppearance('progress-wave-md', { wave: true, animated: true, 'aria-label': '海浪进度' });
      addAppearance('progress-wave-lg', { wave: true, animated: true, size: 'large', color: '#82d5bb', 'aria-label': '大号海浪进度' });

      document.querySelectorAll('[data-appearance-percent]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          pct = parseInt(btn.getAttribute('data-appearance-percent'), 10);
          if (range) range.value = pct;
          if (rangeValue) rangeValue.textContent = pct + '%';
          if (slider) slider.setPercent(pct);
          if (noanim) noanim.setPercent(pct);
          appearance.forEach(function (item) { item.instance.setPercent(pct); });
        });
      });
      var waveToggle = progressEl('progress-wave-toggle');
      if (waveToggle) waveToggle.addEventListener('click', function () {
        waveAnimated = !waveAnimated;
        waveToggle.textContent = waveAnimated ? '暂停海浪' : '播放海浪';
        appearance.forEach(function (item) {
          if (!item.opts.wave) return;
          item.instance.animated = waveAnimated;
          item.instance.setPercent(pct);
        });
      });
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
        AI.Notification.success('保存成功!');
      });
      var ni = document.getElementById('notif-info-btn');
      if (ni) ni.addEventListener('click', function () {
        AI.Notification.info('这是一条普通提示');
      });
      var nw = document.getElementById('notif-warning-btn');
      if (nw) nw.addEventListener('click', function () {
        AI.Notification.warning('库存不足，请补充');
      });
      var ne = document.getElementById('notif-error-btn');
      if (ne) ne.addEventListener('click', function () {
        AI.Notification.error('网络请求失败');
      });

      var descSuccess = document.getElementById('notif-desc-success');
      if (descSuccess) descSuccess.addEventListener('click', function () {
        AI.Notification.success({ message: '岛屿升级成功', description: '岛屿评价 +1，新访客即将到来。' });
      });
      var descInfo = document.getElementById('notif-desc-info');
      if (descInfo) descInfo.addEventListener('click', function () {
        AI.Notification.info({ message: '系统通知', description: '今天有流星雨，记得晚上 8 点去海滩许愿。' });
      });
      var descWarning = document.getElementById('notif-desc-warning');
      if (descWarning) descWarning.addEventListener('click', function () {
        AI.Notification.warning({ message: '果实快过期', description: '桃子和梨还有 1 天就过期，记得吃掉。' });
      });
      var descError = document.getElementById('notif-desc-error');
      if (descError) descError.addEventListener('click', function () {
        AI.Notification.error({ message: '连接失败', description: '与服务器断开连接，请检查网络后重试。' });
      });

      document.querySelectorAll('[data-notif-pos]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var pos = btn.getAttribute('data-notif-pos');
          AI.Notification.info({ message: '位置：' + pos, description: '这条通知出现在 ' + pos + ' 位置', position: pos, duration: 3 });
        });
      });

      var dur5 = document.getElementById('notif-dur-5');
      if (dur5) dur5.addEventListener('click', function () {
        AI.Notification.info({ message: '5 秒后关闭', duration: 5 });
      });
      var dur10 = document.getElementById('notif-dur-10');
      if (dur10) dur10.addEventListener('click', function () {
        AI.Notification.info({ message: '停留 10 秒', duration: 10 });
      });
      var dur0 = document.getElementById('notif-dur-0');
      if (dur0) dur0.addEventListener('click', function () {
        AI.Notification.info({ message: '永不自动关闭（手动 × 关闭）', duration: 0 });
      });

      var onClickBtn = document.getElementById('notif-onclick');
      if (onClickBtn) onClickBtn.addEventListener('click', function () {
        AI.Notification.success({
          message: '点击我',
          description: '点击通知本体可触发 onClick',
          onClick: function () { window.alert('通知被点击了!'); }
        });
      });
      var onCloseBtn = document.getElementById('notif-onclose');
      if (onCloseBtn) onCloseBtn.addEventListener('click', function () {
        AI.Notification.info({
          message: '观察 console',
          description: '关闭时会调用 onClose',
          duration: 2,
          onClose: function () { console.log('Notification closed'); }
        });
      });

      var btnNotif = document.getElementById('notif-btn');
      if (btnNotif) btnNotif.addEventListener('click', function () {
        AI.Notification.open({
          message: '收到邻居的礼物',
          description: '是否接受?',
          btn: '<button class="ai-btn ai-btn--sm ai-btn--primary notif-accept">接受</button>',
          duration: 0
        });
        var accept = document.querySelector('.notif-accept');
        if (accept) accept.addEventListener('click', function (e) {
          e.stopPropagation();
          AI.Notification.success('已接受礼物');
        });
      });

      var customIcon = document.getElementById('notif-custom-icon');
      if (customIcon) customIcon.addEventListener('click', function () {
        AI.Notification.info({
          message: '自定义 icon',
          description: '替换默认 type 图标',
          icon: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="12" cy="12" r="4" fill="#f5a3b7"/><path d="M12 3c2.5 0 4 2 4 3.5S14.5 10 12 10 8 8.5 8 6.5 9.5 3 12 3zM12 21c-2.5 0-4-2-4-3.5s1.5-3.5 4-3.5 4 2 4 3.5S14.5 21 12 21zM3 12c0-2.5 2-4 3.5-4S10 9.5 10 12s-1.5 4-3.5 4S3 14.5 3 12zM21 12c0 2.5-2 4-3.5 4S14 14.5 14 12s1.5-4 3.5-4S21 9.5 21 12z" fill="#f5a3b7"/></svg>'
        });
      });
      var customClose = document.getElementById('notif-custom-close');
      if (customClose) customClose.addEventListener('click', function () {
        AI.Notification.info({
          message: '自定义关闭按钮',
          description: '× 替换为文字',
          closeIcon: '<span style="font-size:11px;font-weight:700">CLOSE</span>'
        });
      });

      var keyUpdate = document.getElementById('notif-key-update');
      if (keyUpdate) keyUpdate.addEventListener('click', function () {
        var uploadKey = 'upload';
        window.__notifUploadDismissed = false;
        var open = function (percent, type, duration) {
          if (window.__notifUploadDismissed) return;
          AI.Notification.open({
            message: percent === 100 ? '上传完成 ' + percent + '%' : '上传中... ' + percent + '%',
            key: uploadKey,
            type: type || 'info',
            duration: duration || 0,
            closeIcon: '<span onclick="window.__notifUploadDismissed=true" style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%">×</span>',
            onClose: function () { window.__notifUploadDismissed = true; }
          });
        };
        open(0);
        setTimeout(function () { open(50); }, 300);
        setTimeout(function () { open(100, 'success', 3); }, 600);
      });

      var spawn3 = document.getElementById('notif-spawn-3');
      if (spawn3) spawn3.addEventListener('click', function () {
        AI.Notification.info('通知 1');
        AI.Notification.success('通知 2');
        AI.Notification.warning('通知 3');
      });
      var nd = document.getElementById('notif-destroy-btn');
      if (nd) nd.addEventListener('click', function () {
        AI.Notification.destroy();
      });
      var ndk = document.getElementById('notif-destroy-key');
      if (ndk) ndk.addEventListener('click', function () {
        AI.Notification.destroy('upload');
      });
    }

    // Form submission
    if (key === 'form') {
      var fv = function (id) { return document.getElementById(id); };

      // 登录表单：required / min / 自定义 async validator
      var loginForm = fv('form-login');
      if (loginForm) {
        new AI.Form(loginForm, {
          rules: {
            password: [
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 位' },
              { validator: function (rule, value) {
                return new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    if (value && String(value).indexOf('123456') > -1) reject(new Error('密码不能包含 123456'));
                    else resolve();
                  }, 300);
                });
              } }
            ]
          },
          onFinish: function (values) { alert('登录成功：' + JSON.stringify(values)); }
        });
      }

      // 三种布局
      var horizontalForm = fv('form-horizontal');
      if (horizontalForm) new AI.Form(horizontalForm, { layout: 'horizontal', labelCol: 6, wrapperCol: 18, labelAlign: 'left' });
      var verticalForm = fv('form-vertical');
      if (verticalForm) new AI.Form(verticalForm, { layout: 'vertical' });
      var inlineForm = fv('form-inline');
      if (inlineForm) new AI.Form(inlineForm, { layout: 'inline' });

      // Form 实例：setFieldsValue / resetFields
      var hobbyGroup = fv('form-hobby-group');
      if (hobbyGroup) new AI.Checkbox(hobbyGroup, { defaultValue: [] });
      var instanceForm = fv('form-instance');
      if (instanceForm) {
        var inst = new AI.Form(instanceForm, {
          initialValues: { name: 'Mochi', fruit: 'apple', hobby: [] },
          onFinish: function (values) {
            var box = fv('form-instance-result');
            if (box) {
              box.style.display = 'block';
              box.textContent = 'submit: ' + JSON.stringify(values);
            }
          }
        });
        var fillBtn = fv('form-fill-btn');
        if (fillBtn) fillBtn.addEventListener('click', function () {
          inst.setFieldsValue({ name: 'Pudding', fruit: 'orange', hobby: ['music', 'read'] });
        });
        var resetBtn = fv('form-reset-btn');
        if (resetBtn) resetBtn.addEventListener('click', function () { inst.resetFields(); });
      }

      // onValuesChange：Radio + Checkbox 实时回显
      var radioGroup = fv('form-radio-group');
      if (radioGroup) new AI.Radio(radioGroup, {
        options: [
          { label: '猫派', value: 'cat' },
          { label: '狗派', value: 'dog' }
        ]
      });
      var checkGroup = fv('form-check-group');
      if (checkGroup) new AI.Checkbox(checkGroup, { defaultValue: ['b'] });
      var liveForm = fv('form-live-form');
      if (liveForm) {
        new AI.Form(liveForm, {
          initialValues: { radio: 'cat', check: ['b'] },
          onValuesChange: function (changed, all) {
            var live = fv('form-live');
            if (live) live.textContent = 'liveValues: ' + JSON.stringify(all);
          }
        });
      }

      // 校验规则
      var validateForm = fv('form-validate');
      if (validateForm) {
        new AI.Form(validateForm, {
          onFinish: function (values) { alert('校验通过：' + JSON.stringify(values)); }
        });
      }
    }

    // Avatar demos：形状切换 + 头像组
    if (key === 'avatar') {
      var shapeRadioMount = document.getElementById('avatar-shape-radio');
      if (shapeRadioMount) {
        new AI.Radio(shapeRadioMount, {
          value: 'circle',
          options: [
            { label: '圆形', value: 'circle' },
            { label: '方形', value: 'square' }
          ],
          onChange: function (v) {
            ['av-shape-1', 'av-shape-2', 'av-shape-3', 'av-shape-4'].forEach(function (id) {
              var el = document.getElementById(id);
              if (el && el._aiAvatar) el._aiAvatar.update({ shape: v });
            });
          }
        });
      }
      var P = 'assets/img/demo/';
      var g1 = document.getElementById('avatar-group-1');
      if (g1) new AI.AvatarGroup(g1, { items: [
        { src: P + 'content_bg_pc.jpg', alt: '岛民 A' },
        { src: P + 'hillside-town.jpg', alt: '岛民 B' },
        { src: P + 'lake-morning.jpg', alt: '岛民 C' },
        { src: P + 'photo-01.jpg', alt: '岛民 D' }
      ]});
      var g2 = document.getElementById('avatar-group-2');
      if (g2) new AI.AvatarGroup(g2, { maxCount: 3, items: [
        { src: P + 'photo-02.jpg', alt: '岛民 E' },
        { src: P + 'photo-03.jpg', alt: '岛民 F' },
        { src: P + 'content_bg_pc.jpg', alt: '岛民 J' },
        { src: P + 'hillside-town.jpg', alt: '岛民 K' }
      ]});
      var g3 = document.getElementById('avatar-group-3');
      if (g3) new AI.AvatarGroup(g3, { size: 'small', shape: 'square', gap: 12, items: [
        { src: P + 'photo-04.jpg', alt: '岛民 G' },
        { src: P + 'photo-05.jpg', alt: '岛民 H' },
        { src: P + 'photo-06.jpg', alt: '岛民 I' }
      ]});
    }

    // Badge demo：礼物角标（HTML 计数，走 JS 模式避免转义问题）
    if (key === 'badge') {
      var badgeGiftMount = document.getElementById('badge-gift-mount');
      if (badgeGiftMount) {
        new AI.Badge(badgeGiftMount, {
          count: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none">' +
            '<rect x="4" y="9" width="16" height="4.5" rx="1.2" fill="#f8a6b2"/>' +
            '<rect x="5.5" y="13.5" width="13" height="7" rx="1.2" fill="#fc736d"/>' +
            '<path d="M12 9v11.5" stroke="#fff" stroke-width="2"/>' +
            '<path d="M12 9C9.5 9 8 8 8 6.4 8 5 9 4 10.3 4 11.8 4 12 6 12 9zm0 0c2.5 0 4-1 4-2.6C16 5 15 4 13.7 4 12.2 4 12 6 12 9z" fill="#f7cd67"/></svg>',
          color: 'purple'
        });
      }
    }

    // NoData demos：搜索过滤 + 表格空态
    if (key === 'nodata') {
      var islands = ['薄荷岛', '蜜桃岛', '珊瑚岛'];
      var nodataQuery = document.getElementById('nodata-query');
      var nodataStatus = document.getElementById('nodata-status');
      var nodataList = document.getElementById('nodata-list');
      var nodataSearchMount = document.getElementById('nodata-search-mount');
      function renderNoDataSearch() {
        if (!nodataQuery) return;
        var q = nodataQuery.value.trim();
        var found = islands.filter(function (n) { return n.indexOf(q) !== -1; });
        if (found.length) {
          if (nodataStatus) nodataStatus.textContent = '找到 ' + found.length + ' 个岛屿';
          if (nodataList) nodataList.innerHTML = '<ul style="margin:0;padding-left:20px;color:#794f27;font-weight:600">' +
            found.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
          nodataSearchMount.innerHTML = '';
        } else {
          if (nodataStatus) nodataStatus.textContent = '没有找到「' + q + '」相关的岛屿';
          if (nodataList) nodataList.innerHTML = '';
          nodataSearchMount.innerHTML = '<div></div>';
          new AI.NoData(nodataSearchMount.firstChild, {
            variant: 'search',
            title: '没有找到「' + q + '」',
            description: '试试其他名称，或清除条件查看全部岛屿。',
            extra: '<button class="ai-btn ai-btn--md ai-btn--primary" id="nodata-clear-btn">清除搜索</button>'
          });
          var clearBtn = document.getElementById('nodata-clear-btn');
          if (clearBtn) clearBtn.addEventListener('click', function () {
            nodataQuery.value = '';
            renderNoDataSearch();
          });
        }
      }
      if (nodataQuery) {
        nodataQuery.addEventListener('input', renderNoDataSearch);
        renderNoDataSearch();
      }

      var nodataTableWrapper = document.getElementById('nodata-table-wrapper');
      var nodataTable = null;
      var nodataResetBtn = document.getElementById('nodata-reset-btn');
      function renderNodataTableEmpty() {
        var mount = document.getElementById('nodata-table-empty');
        if (!mount) return;
        new AI.NoData(mount, {
          variant: 'simple', size: 'small', icon: null,
          description: '写下今天的第一件小事。',
          extra: '<button class="ai-btn ai-btn--sm ai-btn--primary" id="nodata-create-btn">新建手账</button>'
        });
        var createBtn = document.getElementById('nodata-create-btn');
        if (createBtn) createBtn.addEventListener('click', function () {
          nodataTable.setData([{ name: '第一篇海岛手账' }]);
          if (nodataResetBtn) nodataResetBtn.style.display = '';
        });
      }
      if (nodataTableWrapper) {
        nodataTable = new AI.Table(nodataTableWrapper, {
          columns: [{ title: '岛屿手账', dataIndex: 'name' }],
          dataSource: [],
          emptyText: '<div id="nodata-table-empty"></div>'
        });
        renderNodataTableEmpty();
      }
      if (nodataResetBtn) nodataResetBtn.addEventListener('click', function () {
        nodataTable.setData([]);
        nodataResetBtn.style.display = 'none';
        renderNodataTableEmpty();
      });
    }

    // Rate demos：受控实例 + 分数文本
    if (key === 'rate') {
      var RATE_SCORE_TEXT = { 0: '还没有评分', 1: '不太满意', 2: '一般般', 3: '还不错', 4: '很满意', 5: '超级喜欢！' };
      var rateScoreMount = document.getElementById('rate-score-mount');
      if (rateScoreMount) {
        var rateScore = new AI.Rate(rateScoreMount, {
          value: 3, size: 'large',
          onChange: function (v) {
            rateScore.setValue(v);
            var t = document.getElementById('rate-score-text');
            if (t) t.textContent = RATE_SCORE_TEXT[v] || (v + ' 星');
          }
        });
      }
      var rateClearMount = document.getElementById('rate-clearable-mount');
      if (rateClearMount) {
        var rateClear = new AI.Rate(rateClearMount, {
          value: 4, size: 'large',
          onChange: function (v) {
            rateClear.setValue(v);
            var t = document.getElementById('rate-clearable-text');
            if (t) t.textContent = v + ' 星';
          }
        });
      }
      var rateCountMount = document.getElementById('rate-count-mount');
      if (rateCountMount) {
        var rateCount = new AI.Rate(rateCountMount, {
          value: 7, count: 10,
          onChange: function (v) {
            rateCount.setValue(v);
            var t = document.getElementById('rate-count-text');
            if (t) t.textContent = v + ' / 10';
          }
        });
      }
    }

    // Pagination demos：快速跳转受控 + Table 客户端切片
    if (key === 'pagination') {
      var pgJumperMount = document.getElementById('pagination-jumper-mount');
      if (pgJumperMount) {
        var pgJumper = new AI.Pagination(pgJumperMount, {
          total: 500, current: 1, pageSize: 5, showTotal: true, showQuickJumper: true,
          onChange: function (p, s) {
            pgJumper.update({ current: p, pageSize: s });
          }
        });
      }

      var pgTableMount = document.getElementById('pagination-table-mount');
      var pgPagerMount = document.getElementById('pagination-table-pager');
      if (pgTableMount && pgPagerMount) {
        var PG_ISLANDERS = [
          'Mochi|26|彩虹岛', 'Pudding|24|彩虹岛', 'Cream|28|好评岛', 'Yuki|30|小岛', 'Haru|22|摸鱼岛',
          'Kaori|45|小岛', 'Momo|38|博物馆岛', 'Rin|35|艺术品岛', 'Sora|29|拍照岛', 'Hana|60|萝卜岛',
          'Hoshi|18|夜光岛', 'Koko|33|鞋岛', 'Ito|27|裁缝岛', 'Ishi|41|石头岛', 'Kari|36|猎人之岛',
          'Nae|31|园艺岛', 'Oto|34|音乐岛', 'Seki|37|化石岛', 'Ken|25|旅行岛', 'Ame|23|云朵岛',
          'Penguin|20|冰岛', 'Boku|21|呆萌岛', 'Shinbun|39|新闻岛', 'Tento|26|体操岛', 'Onsen|44|温泉岛',
          'Kenko|28|健身岛', 'Tsubomi|27|花岛', 'Omocha|24|玩具岛', 'Shiori|29|书本岛', 'Ribon|32|派对岛'
        ].map(function (row, i) {
          var parts = row.split('|');
          return { key: String(i + 1), name: parts[0], age: Number(parts[1]), island: parts[2] };
        });
        var pgTable = new AI.Table(pgTableMount, {
          columns: [
            { title: '岛民', dataIndex: 'name', width: 120 },
            { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
            { title: '岛屿', dataIndex: 'island' }
          ],
          dataSource: PG_ISLANDERS.slice(0, 5)
        });
        var pgSlice = { page: 1, pageSize: 5 };
        function renderPgSlice() {
          var start = (pgSlice.page - 1) * pgSlice.pageSize;
          pgTable.setData(PG_ISLANDERS.slice(start, start + pgSlice.pageSize));
        }
        new AI.Pagination(pgPagerMount, {
          total: PG_ISLANDERS.length, defaultPageSize: 5,
          showTotal: true, showSizeChanger: true, pageSizeOptions: [5, 10, 20],
          onChange: function (p, s) {
            pgSlice.page = p; pgSlice.pageSize = s;
            renderPgSlice();
          }
        });
      }
    }

    // Countdown demos：共享 deadline 的多组实例
    if (key === 'countdown') {
      var CD_DAY = 90061000;
      // 主示例 + default 风格共享 deadline
      var cdMainMount = document.getElementById('countdown-main-mount');
      if (cdMainMount) {
        var cdDeadline = Date.now() + CD_DAY;
        var cdMain = new AI.Countdown(cdMainMount, { value: cdDeadline, format: 'DD 天 HH:mm:ss', prefix: '烟火大会开始还有', variant: 'island' });
        var cdDefaultMount = document.getElementById('countdown-default-mount');
        if (cdDefaultMount) new AI.Countdown(cdDefaultMount, { value: cdDeadline, format: 'DD 天 HH:mm:ss', prefix: '活动结束还有' });
        var cdResetBtn = document.getElementById('countdown-reset-btn');
        if (cdResetBtn) cdResetBtn.addEventListener('click', function () {
          cdDeadline = Date.now() + CD_DAY;
          cdMain.update({ value: cdDeadline });
        });
      }

      // onFinish 回调
      var cdFinishMount = document.getElementById('countdown-finish-mount');
      if (cdFinishMount) {
        var cdShort = new AI.Countdown(cdFinishMount, {
          value: Date.now() + 5000, prefix: '商店关门还有',
          onFinish: function () { cdShort.update({ prefix: '已结束' }); }
        });
        var cdRestartBtn = document.getElementById('countdown-restart-btn');
        if (cdRestartBtn) cdRestartBtn.addEventListener('click', function () {
          cdShort.update({ prefix: '商店关门还有', value: Date.now() + 10000 });
        });
      }

      // 分阶段颜色提醒：共享截止时间
      var cdRemMounts = [
        ['countdown-reminder-default-mount', { format: 'mm:ss', reminder: true, bordered: true }],
        ['countdown-reminder-custom-mount', { format: 'mm:ss', reminder: [{ seconds: 5, color: '#b25770' }, { seconds: 20, color: '#9a6a38' }], variant: 'island', bordered: true }],
        ['countdown-reminder-off-mount', { format: 'mm:ss', reminder: false }]
      ];
      var cdRemDeadline = Date.now() + 15000;
      var cdRemInsts = [];
      cdRemMounts.forEach(function (item) {
        var mount = document.getElementById(item[0]);
        if (mount) cdRemInsts.push(new AI.Countdown(mount, Object.assign({ value: cdRemDeadline }, item[1])));
      });
      document.querySelectorAll('[data-cd-seconds]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var seconds = Number(btn.getAttribute('data-cd-seconds'));
          cdRemDeadline = Date.now() + seconds * 1000;
          cdRemInsts.forEach(function (inst) { inst.update({ value: cdRemDeadline }); });
        });
      });

      // 最后几秒的紧迫提醒：共享截止时间 + 抖动开关
      var cdShakeEnabled = true;
      var cdShakeFinished = true;
      var cdShakeStatus = document.getElementById('countdown-shake-status');
      var updateShakeStatus = function () {
        if (cdShakeStatus) cdShakeStatus.textContent = (cdShakeFinished ? '倒计时已结束，可点击按钮重新体验。' : '倒计时进行中，进入对应阈值后开始抖动。') +
          '系统开启“减少动态效果”时保留颜色提醒，关闭抖动。';
      };
      var cdShakeDeadline = Date.now();
      var cdShakeDefault = new AI.Countdown(document.getElementById('countdown-shake-default-mount'), {
        value: cdShakeDeadline, format: 'mm:ss', reminder: true, shake: true, bordered: true,
        onFinish: function () { cdShakeFinished = true; updateShakeStatus(); }
      });
      var cdShakeCustom = new AI.Countdown(document.getElementById('countdown-shake-custom-mount'), {
        value: cdShakeDeadline, format: 'mm:ss', reminder: true, shake: 8, variant: 'island', bordered: true
      });
      var cdShakeOff = new AI.Countdown(document.getElementById('countdown-shake-off-mount'), {
        value: cdShakeDeadline, format: 'mm:ss', reminder: true, shake: false
      });
      document.querySelectorAll('[data-shake-seconds]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var seconds = Number(btn.getAttribute('data-shake-seconds'));
          cdShakeFinished = seconds === 0;
          cdShakeDeadline = Date.now() + seconds * 1000;
          cdShakeDefault.update({ value: cdShakeDeadline, shake: cdShakeEnabled });
          cdShakeCustom.update({ value: cdShakeDeadline, shake: cdShakeEnabled ? 8 : false });
          cdShakeOff.update({ value: cdShakeDeadline, shake: false });
          updateShakeStatus();
        });
      });
      var cdShakeToggle = document.getElementById('countdown-shake-toggle');
      if (cdShakeToggle) cdShakeToggle.addEventListener('click', function () {
        cdShakeEnabled = !cdShakeEnabled;
        cdShakeToggle.textContent = cdShakeEnabled ? '关闭抖动' : '开启抖动';
        cdShakeToggle.setAttribute('aria-pressed', String(cdShakeEnabled));
        cdShakeDefault.update({ shake: cdShakeEnabled });
        cdShakeCustom.update({ shake: cdShakeEnabled ? 8 : false });
      });
      updateShakeStatus();

      // 归零后的收尾动效：共享截止时间 + 归零动效开关
      var cdFfxEnabled = true;
      var cdFfxFinished = true;
      var cdFfxStatus = document.getElementById('countdown-fx-status');
      var updateFfxStatus = function () {
        if (cdFfxStatus) cdFfxStatus.textContent = (cdFfxFinished ? '时间到，可重新开始体验归零动效。' : '倒计时进行中…') +
          '系统开启“减少动态效果”时，用轻微淡入代替回弹和波纹。';
      };
      var cdFfxDeadline = Date.now();
      var cdFfxDefault = new AI.Countdown(document.getElementById('countdown-fx-default-mount'), {
        value: cdFfxDeadline, format: 'mm:ss', reminder: true, shake: true, finishAnimation: true, bordered: true,
        onFinish: function () { cdFfxFinished = true; updateFfxStatus(); }
      });
      var cdFfxIsland = new AI.Countdown(document.getElementById('countdown-fx-island-mount'), {
        value: cdFfxDeadline, format: 'mm:ss', variant: 'island', reminder: true, shake: true, finishAnimation: true, bordered: true
      });
      document.querySelectorAll('[data-finish-seconds]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var seconds = Number(btn.getAttribute('data-finish-seconds'));
          cdFfxFinished = false;
          cdFfxDeadline = Date.now() + seconds * 1000;
          cdFfxDefault.update({ value: cdFfxDeadline, finishAnimation: cdFfxEnabled });
          cdFfxIsland.update({ value: cdFfxDeadline, finishAnimation: cdFfxEnabled });
          updateFfxStatus();
        });
      });
      var cdFfxToggle = document.getElementById('countdown-finish-toggle');
      if (cdFfxToggle) cdFfxToggle.addEventListener('click', function () {
        cdFfxEnabled = !cdFfxEnabled;
        cdFfxToggle.textContent = cdFfxEnabled ? '关闭归零动效' : '开启归零动效';
        cdFfxToggle.setAttribute('aria-pressed', String(cdFfxEnabled));
        cdFfxDefault.update({ finishAnimation: cdFfxEnabled });
        cdFfxIsland.update({ finishAnimation: cdFfxEnabled });
      });
      updateFfxStatus();

      // 全配置动效：开关 + 数值输入实时生成 options
      var motionState = { seconds: 5, intervalMs: 1000, duration: 900, count: 2, delay: 150, distance: 1.5, popScale: 1.05, color: '#e05a5a', ending: true, shake: true, bounce: true, ripple: true, finish: true };
      var motionDeadline = Date.now();
      var buildMotionEffect = function () {
        return {
          duration: motionState.duration,
          bounce: motionState.bounce ? { duration: 350, pressScale: 0.94, popScale: motionState.popScale, pressOffset: 1, popOffset: -2 } : false,
          ripple: motionState.ripple ? {
            count: motionState.count, duration: 600, delay: motionState.delay, color: motionState.color,
            opacity: 0.45, width: 2, offset: 5, radius: 16, startScale: 0.98, scaleX: 1.08, scaleY: 1.35
          } : false,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          reducedMotion: 'fade',
          fadeDuration: 250,
          fadeOpacity: 0.65
        };
      };
      var buildMotionOptions = function () {
        var effect = buildMotionEffect();
        return {
          format: 'mm:ss',
          reminder: [{ seconds: 60, color: '#c77c34' }, { seconds: 10, color: motionState.color }],
          shake: motionState.shake ? {
            seconds: motionState.seconds, urgentSeconds: 3, duration: 1000, urgentDuration: 650,
            distance: motionState.distance, urgentDistance: motionState.distance + 1, rotation: 0.6, urgentRotation: 0.9, easing: effect.easing
          } : false,
          endingAnimation: motionState.ending ? Object.assign({}, effect, { seconds: motionState.seconds, interval: motionState.intervalMs }) : false,
          finishAnimation: motionState.finish ? effect : false
        };
      };
      var motionJson = function () {
        var pre = document.getElementById('countdown-motion-json');
        if (pre) pre.textContent = '// 当前完整配置（时间单位 ms；阈值单位秒；距离单位 px）\nconst options = ' + JSON.stringify(buildMotionOptions(), null, 4) + ';\nnew AI.Countdown(el, Object.assign({ value: deadline }, options));';
      };
      var motionMount = document.getElementById('countdown-motion-mount');
      if (motionMount) {
        var motionCd = new AI.Countdown(motionMount, Object.assign(
          { value: motionDeadline, bordered: true, variant: 'island', size: 'large' }, buildMotionOptions()));
        var motionFields = [
          { id: 'countdown-motion-seconds', label: '触发秒数', key: 'seconds', min: 0, step: 1 },
          { id: 'countdown-motion-interval', label: '循环间隔（ms）', key: 'intervalMs', min: 16, step: 100 },
          { id: 'countdown-motion-duration', label: '单次保留（ms）', key: 'duration', min: 0, step: 100 },
          { id: 'countdown-motion-count', label: '波纹数量', key: 'count', min: 0, max: 10, step: 1 },
          { id: 'countdown-motion-delay', label: '波纹延迟（ms）', key: 'delay', min: 0, step: 50 },
          { id: 'countdown-motion-distance', label: '抖动位移（px）', key: 'distance', min: 0, step: 0.5 },
          { id: 'countdown-motion-pop', label: '回弹放大比例', key: 'popScale', min: 0, step: 0.01 },
          { id: 'countdown-motion-color', label: '提醒与波纹颜色', key: 'color', type: 'text' }
        ];
        var fieldsEl = document.getElementById('countdown-motion-fields');
        if (fieldsEl) {
          fieldsEl.innerHTML = motionFields.map(function (f) {
            return '<label style="display:grid;gap:6px">' + f.label +
              '<span class="ai-input-wrapper ai-input-wrapper--sm"><input class="ai-input" type="' + (f.type || 'number') +
              '" id="' + f.id + '" aria-label="' + f.label + '"' +
              (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') +
              (f.step != null ? ' step="' + f.step + '"' : '') + '></span></label>';
          }).join('');
        }
        motionFields.forEach(function (f) {
          var input = document.getElementById(f.id);
          if (!input) return;
          if (f.key === 'color') input.value = motionState.color;
          else input.value = motionState[f.key];
          input.addEventListener('input', function () {
            var v = f.key === 'color' ? input.value.trim() : Number(input.value);
            if (f.key === 'color' ? v : Number.isFinite(v)) motionState[f.key] = v;
            motionCd.update(Object.assign({ value: motionDeadline }, buildMotionOptions()));
            motionJson();
          });
        });
        var motionJump = function (seconds) {
          motionDeadline = Date.now() + seconds * 1000;
          motionCd.update(Object.assign({ value: motionDeadline }, buildMotionOptions()));
        };
        var m12 = document.getElementById('countdown-motion-12s');
        if (m12) m12.addEventListener('click', function () { motionJump(12); });
        var mLast = document.getElementById('countdown-motion-last');
        if (mLast) mLast.addEventListener('click', function () { motionJump(Math.max(1, motionState.seconds)); });
        var m20 = document.getElementById('countdown-motion-20s');
        if (m20) m20.addEventListener('click', function () { motionJump(20); });
        document.querySelectorAll('[data-motion-switch]').forEach(function (sw) {
          sw.addEventListener('click', function () {
            var name = sw.getAttribute('data-motion-switch');
            motionState[name] = !motionState[name];
            sw.classList.toggle('ai-switch--checked', motionState[name]);
            sw.setAttribute('aria-checked', String(motionState[name]));
            motionCd.update(Object.assign({ value: motionDeadline }, buildMotionOptions()));
            motionJson();
          });
        });
        motionJson();
      }
    }

    // CountUp demos
    if (key === 'countup') {
      var CU_SCORES = [1320, 2480, 960, 3060];
      var cuPick = function (current) {
        var next = CU_SCORES[Math.floor(Math.random() * CU_SCORES.length)];
        return next === current ? CU_SCORES[(CU_SCORES.indexOf(next) + 1) % CU_SCORES.length] : next;
      };
      // 游戏结算：再来一局换 key 重播的等价实现
      var cuScoreMount = document.getElementById('countup-score-mount');
      if (cuScoreMount) {
        var cuScore = CU_SCORES[0];
        var cuScoreInst = new AI.CountUp(cuScoreMount, {
          isCounting: true, end: cuScore, duration: 2, thousandsSeparator: ',',
          suffix: '分', size: 'large', variant: 'island', celebrate: true
        });
        var cuSettleBtn = document.getElementById('countup-settle-btn');
        if (cuSettleBtn) cuSettleBtn.addEventListener('click', function () {
          cuScore = cuPick(cuScore);
          cuScoreInst.update({ start: 0, end: cuScore, isCounting: true });
        });
      }
      // 累加计数：start / end 一起往后挪
      var cuWoodMount = document.getElementById('countup-wood-mount');
      if (cuWoodMount) {
        var cuWood = 0;
        var cuWoodInst = new AI.CountUp(cuWoodMount, { isCounting: true, start: 0, end: 0, duration: 0.6, suffix: ' 木头' });
        var cuWoodAdd = document.getElementById('countup-wood-add');
        if (cuWoodAdd) cuWoodAdd.addEventListener('click', function () {
          cuWood += 15;
          cuWoodInst.update({ start: Math.max(0, cuWood - 15), end: cuWood, isCounting: true });
        });
        var cuWoodReset = document.getElementById('countup-wood-reset');
        if (cuWoodReset) cuWoodReset.addEventListener('click', function () {
          cuWood = 0;
          cuWoodInst.update({ start: 0, end: 0, isCounting: true });
        });
      }
      // 庆祝动效：无文案 / 完美！ / 当当！
      var cuCelebScore = 2480;
      var cuCelebInsts = [];
      ['plain', 'perfect', 'ding'].forEach(function (name) {
        var mount = document.getElementById('countup-celebrate-' + name + '-mount');
        if (!mount) return;
        var opts = { isCounting: true, end: cuCelebScore, duration: 1.6, suffix: '分', celebrate: true };
        if (name === 'perfect') opts.celebrate = { text: '完美！' };
        if (name === 'ding') opts.celebrate = { text: '当当！' };
        cuCelebInsts.push(new AI.CountUp(mount, opts));
      });
      var cuCelebReplay = document.getElementById('countup-celebrate-replay');
      if (cuCelebReplay) cuCelebReplay.addEventListener('click', function () {
        cuCelebScore = cuPick(cuCelebScore);
        cuCelebInsts.forEach(function (inst) { inst.update({ start: 0, end: cuCelebScore, isCounting: true }); });
      });
      // 格式化
      var cuFmtInsts = [];
      [
        ['thousand', { end: 1320, duration: 1.5, thousandsSeparator: ',' }],
        ['decimal', { end: 1320.5, duration: 1.5, decimalPlaces: 1, thousandsSeparator: ',' }],
        ['prefix', { end: 88, duration: 1.5, prefix: '¥' }],
        ['separator', { end: 99.9, duration: 1.5, decimalPlaces: 1, decimalSeparator: ',', suffix: '分' }]
      ].forEach(function (item) {
        var mount = document.getElementById('countup-fmt-' + item[0] + '-mount');
        if (mount) cuFmtInsts.push(new AI.CountUp(mount, Object.assign({ isCounting: true }, item[1])));
      });
      var cuFmtReplay = document.getElementById('countup-fmt-replay');
      if (cuFmtReplay) cuFmtReplay.addEventListener('click', function () {
        cuFmtInsts.forEach(function (inst) { inst.reset(); });
      });
      // 缓动曲线
      var cuEaseInsts = [];
      [
        ['linear', 'linear'],
        ['cubic', 'easeOutCubic'],
        ['expo', 'easeOutExpo']
      ].forEach(function (item) {
        var mount = document.getElementById('countup-ease-' + item[0] + '-mount');
        if (mount) cuEaseInsts.push(new AI.CountUp(mount, {
          isCounting: true, end: 7890, duration: 2, easing: item[1], thousandsSeparator: ','
        }));
      });
      var cuEaseReplay = document.getElementById('countup-ease-replay');
      if (cuEaseReplay) cuEaseReplay.addEventListener('click', function () {
        cuEaseInsts.forEach(function (inst) { inst.reset(); });
      });
      // formatter 渲染函数
      var cuChildrenMount = document.getElementById('countup-children-mount');
      if (cuChildrenMount) {
        var cuChildrenInst = new AI.CountUp(cuChildrenMount, {
          isCounting: true, end: 86, duration: 1.2,
          formatter: function (v) { return '第 ' + Math.round(v) + ' 关'; }
        });
        var cuChildrenReset = document.getElementById('countup-children-reset');
        if (cuChildrenReset) cuChildrenReset.addEventListener('click', function () { cuChildrenInst.reset(0); });
      }
    }

    if (key === 'upload') {
      // defaultFileList + onChange 收集
      var upDefaultMount = document.getElementById('upload-default-mount');
      var upDefaultCount = document.getElementById('upload-default-count');
      if (upDefaultMount) {
        new AI.Upload(upDefaultMount, {
          multiple: true,
          accept: 'image/*,.pdf',
          defaultFileList: [
            { uid: 'island-1', name: '海岛全景.png', size: 2400000, type: 'image/png', status: 'done', percent: 100 },
            { uid: 'island-2', name: '露营清单.pdf', size: 512000, type: 'application/pdf', status: 'done', percent: 100 }
          ],
          tip: '支持多选，accept 限定图片与 PDF',
          onChange: function (info) {
            if (upDefaultCount) {
              upDefaultCount.textContent = 'onChange：列表现有 ' + info.fileList.length +
                ' 个文件，最近事件 = ' + info.event + '（' + info.file.name + '）';
            }
          }
        });
      }
      // maxCount + beforeUpload 拦截
      var upGuardMount = document.getElementById('upload-guard-mount');
      if (upGuardMount) {
        var upLimit = 3;
        var upExisting = 0;
        var upAllowed = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;
        new AI.Upload(upGuardMount, {
          drag: true,
          multiple: true,
          maxCount: upLimit,
          beforeUpload: function (file) {
            if (!upAllowed.test(file.name)) {
              AI.Notification.open({ type: 'warning', message: file.name + ' 不是支持的图片类型，已拦截' });
              return false;
            }
            if (upExisting >= upLimit) {
              AI.Notification.open({ type: 'warning', message: file.name + ' 已达数量上限（' + upLimit + ' 个），已拦截' });
              return false;
            }
            if (file.size > 1024 * 1024) {
              AI.Notification.open({ type: 'warning', message: file.name + ' 超过 1 MB，已拦截' });
              return false;
            }
            return true;
          },
          tip: '最多 ' + upLimit + ' 个图片文件且单个不超过 1 MB；类型 / 数量 / 大小拦截都会以 warning 提示（可拖一张非图片试试）',
          onChange: function (info) { upExisting = info.fileList.length; }
        });
      }
      // picture-card + onExceed
      var upCardMount = document.getElementById('upload-card-mount');
      if (upCardMount) {
        new AI.Upload(upCardMount, {
          listType: 'picture-card',
          accept: 'image/*',
          multiple: true,
          maxCount: 4,
          onExceed: function (files) {
            AI.Notification.open({ type: 'warning', message: files.length + ' 个文件超出上限（最多 4 张），已忽略' });
          },
          tip: '最多 4 张；满员后新选择的文件会被丢弃，并用 onExceed 给出提示'
        });
      }
      // onPreview + Modal 灯箱
      var upPreviewMount = document.getElementById('upload-preview-mount');
      if (upPreviewMount) {
        new AI.Upload(upPreviewMount, {
          listType: 'picture-card',
          accept: 'image/*',
          multiple: true,
          maxCount: 4,
          onPreview: function (file) {
            var url = file.thumbUrl || file.url;
            var body = url
              ? '<img src="' + url + '" alt="' + file.name + '" style="display:block;max-width:100%;max-height:60vh;margin:0 auto;border-radius:12px">'
              : '<p style="text-align:center;color:#9f927d;margin:0">该文件暂无可预览的图片</p>';
            new AI.Modal({ title: file.name, content: body, width: 560, footer: null, typewriter: false }).open();
          },
          tip: '悬停图片出现眼睛图标，点击打开自定义 Modal 灯箱预览'
        });
      }
      // customRequest 慢速模拟
      var upCustomMount = document.getElementById('upload-custom-mount');
      if (upCustomMount) {
        new AI.Upload(upCustomMount, {
          customRequest: function (options) {
            var pct = 0;
            var timer = setInterval(function () {
              pct += 8;
              options.onProgress({ percent: Math.min(100, pct) });
              if (pct >= 100) {
                clearInterval(timer);
                options.onSuccess();
                AI.Notification.open({ type: 'success', message: options.file.name + ' 上传完成' });
              }
            }, 300);
          },
          tip: '真实项目中也可直接把接口地址交给 action，由组件内置 XHR 处理进度'
        });
      }
      // 上传进度：background / bar × text / picture / picture-card
      ['background', 'bar'].forEach(function (mode) {
        ['text', 'picture', 'picture-card'].forEach(function (lt) {
          var mount = document.getElementById('upload-progress-' + mode + '-' + lt);
          if (mount) {
            new AI.Upload(mount, {
              listType: lt,
              progress: { type: mode, color: '#19c8b9' },
              defaultFileList: [
                { uid: mode + '-' + lt, name: '海岛游记.png', status: 'uploading', percent: 46 }
              ]
            });
          }
        });
      });
    }

    if (key === 'background') {
      // 彩蛋：hover 色块把整站壁纸换成对应图案，移开还原
      var layoutEl = document.querySelector('.app-layout');
      if (layoutEl) {
        var eggOrigClass = layoutEl.className;
        var eggOrigBg = layoutEl.style.background;
        var eggApply = function (type) {
          if (type === 'reset') {
            layoutEl.className = eggOrigClass;
            layoutEl.style.background = eggOrigBg;
            return;
          }
          layoutEl.className = (eggOrigClass + ' ai-background ai-bg-' + type).replace(/\s+/g, ' ').trim();
        };
        document.querySelectorAll('.demo-bg-tile').forEach(function (tile) {
          var type = tile.getAttribute('data-bg-type');
          tile.addEventListener('mouseenter', function () { eggApply(type); });
          tile.addEventListener('mouseleave', function () { eggApply('reset'); });
        });
        cleanups.push(function () { eggApply('reset'); });
      }
    }

    if (key === 'datepicker') {
      // 受控模式
      var dpCtlMount = document.getElementById('dp-ctl-mount');
      if (dpCtlMount) {
        var dpCtl = new AI.DatePicker(dpCtlMount, {
          value: '2026-08-10',
          onChange: function (v) {
            dpCtl.update({ value: v });
            var text = document.getElementById('dp-ctl-text');
            if (text) text.textContent = v == null ? '未选择' : v;
          }
        });
        cleanups.push(function () { dpCtl.destroy(); });
      }
      // 允许清空 + 禁用周末（disabledDate 需要传函数，走手动实例化）
      var dpWeekendMount = document.getElementById('dp-weekend-mount');
      if (dpWeekendMount) {
        var dpIsWeekend = function (date) { var d = date.getDay(); return d === 0 || d === 6; };
        var dpWeekend = new AI.DatePicker(dpWeekendMount, {
          defaultValue: '2026-08-01',
          allowClear: true,
          disabledDate: dpIsWeekend
        });
        cleanups.push(function () { dpWeekend.destroy(); });
      }
      // 受控范围选择
      var dpRangeMount = document.getElementById('dp-range-mount');
      if (dpRangeMount) {
        var dpRangeValue = ['2026-08-10', '2026-08-20'];
        var dpRange = new AI.DatePicker(dpRangeMount, {
          range: true,
          value: dpRangeValue,
          onChange: function (v) {
            dpRangeValue = Array.isArray(v) ? v : null;
            dpRange.update({ value: dpRangeValue });
            var text = document.getElementById('dp-range-text');
            if (text) text.textContent = dpRangeValue ? dpRangeValue.join(' ~ ') : '未选择';
          }
        });
        cleanups.push(function () { dpRange.destroy(); });
      }
      // 范围 + 清空 + 禁用周末
      var dpRangeWeekendMount = document.getElementById('dp-range-weekend-mount');
      if (dpRangeWeekendMount) {
        var dpIsWeekend2 = function (date) { var d = date.getDay(); return d === 0 || d === 6; };
        var dpRangeWeekend = new AI.DatePicker(dpRangeWeekendMount, {
          range: true,
          defaultValue: ['2026-08-01', '2026-08-15'],
          allowClear: true,
          disabledDate: dpIsWeekend2
        });
        cleanups.push(function () { dpRangeWeekend.destroy(); });
      }
    }

    if (key === 'timepicker') {
      var tpCtlMount = document.getElementById('tp-ctl-mount');
      if (tpCtlMount) {
        var tpCtl = new AI.TimePicker(tpCtlMount, {
          value: '09:30:00',
          onChange: function (v) {
            tpCtl.update({ value: v });
            var text = document.getElementById('tp-ctl-text');
            if (text) text.textContent = v == null ? '未选择' : v;
          }
        });
        cleanups.push(function () { tpCtl.destroy(); });
      }
    }

    if (key === 'calendar') {
      // 基础：同日多条 + 跨天连续条 + 带时间事项
      var calBasicMount = document.getElementById('cal-basic-mount');
      if (calBasicMount) {
        var islandEvents = [
          { title: '每日签到', start: '2026-08-10 09:30', showTime: true },
          { title: '开荒新岛', start: '2026-08-10 14:00', showTime: true, color: 'green' },
          { title: '海岛丰收祭', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
          { title: '钓鱼大赛', start: '2026-08-20', color: 'coral' },
          { title: '篝火晚会', start: '2026-08-24 20:00', showTime: true, color: 'purple' },
          { title: '摘果子', start: '2026-08-24' },
          { title: '浇花', start: '2026-08-24' }
        ];
        new AI.Calendar(calBasicMount, {
          defaultValue: '2026-08-10',
          events: islandEvents
        });
      }
      // 受控模式
      var calCtlMount = document.getElementById('cal-ctl-mount');
      if (calCtlMount) {
        var calDate = '2026-08-10';
        var calPanel = '2026-08';
        var calCtl = new AI.Calendar(calCtlMount, {
          value: calDate,
          panelValue: calPanel,
          onChange: function (d) {
            calDate = d;
            calCtl.update({ value: d, panelValue: calPanel });
            var text = document.getElementById('cal-ctl-text');
            if (text) text.textContent = d;
          },
          onPanelChange: function (m) {
            calPanel = m;
            calCtl.update({ value: calDate, panelValue: m });
          }
        });
        cleanups.push(function () { calCtl.destroy(); });
      }
      // 拖拽跨日期创建事项
      var calDragMount = document.getElementById('cal-drag-mount');
      if (calDragMount) {
        var created = [];
        var CREATED_NAMES = ['事件一', '事件二', '事件三', '事件四', '事件五'];
        var CREATED_COLORS = ['teal', 'amber', 'coral', 'green', 'purple'];
        var calDrag = new AI.Calendar(calDragMount, {
          defaultValue: '2026-08-10',
          events: created,
          draggableEvents: true,
          onEventCreate: function (start, end) {
            created.push({
              title: CREATED_NAMES[created.length % CREATED_NAMES.length],
              start: start,
              end: end,
              color: CREATED_COLORS[created.length % CREATED_COLORS.length]
            });
            calDrag.update({ events: created.slice() });
            var text = document.getElementById('cal-drag-text');
            if (text) {
              text.textContent = created.map(function (item) {
                return item.title + '（' + item.start + ' ~ ' + item.end + '）';
              }).join('，');
            }
          }
        });
        cleanups.push(function () { calDrag.destroy(); });
      }
    }

    // Skill 页 — 色板里的值读取 :root 实际令牌，避免文档与样式脱节
    if (key === 'skill') {
      var rootStyle = window.getComputedStyle(document.documentElement);
      document.querySelectorAll('[data-skill-token]').forEach(function (node) {
        var tokenValue = rootStyle.getPropertyValue(node.getAttribute('data-skill-token')).trim();
        if (tokenValue) node.textContent = tokenValue;
      });
    }

    // Chart demos — 统一实例化 CHART_MOUNTS 中登记的图表
    if (key === 'chart' || key.indexOf('chart-') === 0) {
      CHART_MOUNTS.forEach(function (entry) {
        var mountEl = document.getElementById(entry.id);
        if (!mountEl) return;
        var card = mountEl.parentNode;
        var statusEl = card ? card.querySelector('[data-chart-status]') : null;
        var instance = null;

        // 状态切换页：按钮只重建本页示例，页内其它图表保持独立。
        if (entry.state) {
          var meta = chartMeta(entry.type);
          var stack = entry.type === 'column' || entry.type === 'bar';
          var smooth = ['line', 'area', 'mix', 'time'].indexOf(entry.type) !== -1;
          var flags = { alternate: false, empty: false, loading: false, enhanced: false };
          var build = function () {
            var config = chartExample(entry.type, flags.alternate);
            config.title = '岛屿' + meta.label;
            config.description = meta.desc;
            config.height = 320;
            if (flags.empty) config.series = [];
            config.stacked = stack && flags.enhanced;
            config.smooth = smooth && flags.enhanced;
            config.loading = flags.loading;
            config.onDataClick = function (point) {
              if (statusEl) statusEl.textContent = point.seriesName + ' / ' + point.name + '：' + point.value;
            };
            return config;
          };
          var rebuild = function () {
            if (instance) instance.destroy();
            instance = new AI.Chart(mountEl, build());
          };
          rebuild();
          cleanups.push(function () { if (instance) instance.destroy(); });
          var controlsEl = card.querySelector('[data-chart-state-controls]');
          if (!controlsEl) return;
          controlsEl.addEventListener('click', function (event) {
            var button = event.target.closest('[data-state-action]');
            if (!button) return;
            var action = button.getAttribute('data-state-action');
            flags[action] = !flags[action];
            if (action === 'empty') button.textContent = flags.empty ? '恢复数据' : '查看空态';
            if (action === 'loading') button.textContent = flags.loading ? '结束加载' : '查看加载态';
            if (action === 'enhanced') {
              button.textContent = stack
                ? (flags.enhanced ? '切换分组' : '切换堆叠')
                : (flags.enhanced ? '切换直线' : '切换曲线');
            }
            rebuild();
          });
          return;
        }

        // 交互示例：开关默认全部开启，代码块随开关实时更新。
        if (entry.interaction) {
          var view = { shared: true, highlight: true, selectable: true, crosshair: true, percentage: true };
          entry.config.onDataClick = function (point) {
            if (!statusEl) return;
            statusEl.textContent = '最近点击：' + point.seriesName + ' / ' + point.name + '：' + point.value +
              '。Enter / 空格锁定，Esc 解除。';
          };
          instance = new AI.Chart(mountEl, entry.config);
          cleanups.push(function () { instance.destroy(); });
          var apply = function () {
            instance.setProps({
              highlight: view.highlight,
              selectable: view.selectable,
              tooltip: {
                trigger: view.shared ? 'axis' : 'item',
                crosshair: view.crosshair,
                showPercentage: view.percentage
              }
            });
            var codeEl = document.getElementById(entry.codeId);
            if (codeEl) {
              var source = chartInteractionCode(view);
              codeEl.innerHTML = AI.CodeBlock.highlight(source);
              if (codeEl.__aiCodeBlock) codeEl.__aiCodeBlock.code = source;
            }
          };
          card.querySelectorAll('[data-chart-option]').forEach(function (sw) {
            // AI.autoInit 已为所有 .ai-switch 绑定翻转逻辑，这里只读取翻转后的状态
            sw.addEventListener('click', function () {
              view[sw.getAttribute('data-chart-option')] = sw.classList.contains('ai-switch--checked');
              apply();
            });
          });
          return;
        }

        instance = new AI.Chart(mountEl, entry.config);
        cleanups.push(function () { instance.destroy(); });
      });
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