/**
 * Antigravity 简体中文汉化注入脚本（zhcn.js）
 * -------------------------------------------------------------------
 * 由 preload 加载。在页面 DOM 上做「精确匹配 + 动态监听」式翻译：
 *   - 只替换与词条完全一致的文本节点（trim 后比较），不做模糊替换
 *   - 监听 MutationObserver，处理 SPA 路由切换与 React 重渲染
 *   - 同时翻译 placeholder / title / aria-label / alt 等属性
 *   - 跳过输入框、代码块、编辑器、超长文本与已含中文的内容
 * 可通过 localStorage.setItem('antigravity-zhcn','off') 临时关闭。
 */
(function () {
  'use strict';
  if (window.__AG_ZHCN_INSTALLED__) return;
  window.__AG_ZHCN_INSTALLED__ = true;

  var DICT = {
    // ---------- 侧边栏 / 首页 ----------
    'New Conversation': '新建对话',
    'Automations': '自动化',
    'Customizations': '自定义',
    'Projects': '项目',
    'Conversations': '对话',
    'Settings': '设置',
    'No Project': '无项目',
    'Not in Project': '不在项目中',
    'Give Feedback': '提供反馈',
    'Ask anything, @ to mention, / for actions': '有什么想做的？输入 @ 提及，输入 / 执行操作',
    'Request Review': '请求审查',
    'See more': '查看更多',
    'Search': '搜索',
    'Antigravity': 'Antigravity',
    'swarm/swarm_board': 'swarm/swarm_board',
    'Xin Zeng': 'Xin Zeng',

    // ---------- 设置：导航 ----------
    'General': '通用',
    'Appearance': '外观',
    'Shortcuts': '快捷键',
    'Notifications': '通知',
    'Models': '模型',
    'Browser': '浏览器',
    'Account': '账户',
    'Navigation': '导航',
    'Plan': '计划',
    'Middle Click': '中键单击',

    // ---------- 设置：通用 ----------
    'Manage your plan, credentials, and general preferences.': '管理你的方案、凭据和通用偏好。',
    'Enable Telemetry': '启用遥测',
    'When toggled on, Antigravity collects usage data to help Google enhance performance and features.':
      '开启后，Antigravity 会收集使用数据，以帮助 Google 改进性能和功能。',
    'Marketing Emails': '营销邮件',
    'Receive product updates, tips, and promotions from Google Antigravity via email.':
      '通过电子邮件接收 Google Antigravity 的产品更新、技巧和推广信息。',
    'Your Plan: Google AI Pro': '你的方案：Google AI Pro',
    'You can upgrade to a Google AI Ultra plan to receive higher rate limits.':
      '你可以升级到 Google AI Ultra 方案以获得更高的速率限制。',
    'Upgrade': '升级',
    'Email': '邮箱',
    'Sign Out': '退出登录',
    'By using this app, you agree to its Terms of Service': '使用本应用即表示你同意其服务条款',
    'Manage your notification preferences.': '管理你的通知偏好。',

    // ---------- 设置：外观 ----------
    "Configure the agent's visual theme and display preferences.": '配置智能体的视觉主题和显示偏好。',
    'Chat': '聊天',
    'Conversation Steps': '对话步骤',
    'Choose how much detail is shown during a conversation.': '选择对话中显示的详细程度。',
    'Default': '默认',
    'Verbose': '详细',
    'Theme': '主题',
    'Contrast': '对比度',
    'Strong': '强烈',
    'Font': '字体',
    'Font Size': '字体大小',
    'Light Theme': '浅色主题',
    'Dark Theme': '深色主题',
    'Preset': '预设',
    'Default Light': '默认浅色',
    'Default Dark': '默认深色',
    'Background': '背景',
    'Foreground': '前景',
    'Accent': '强调色',
    'Code Preview': '代码预览',
    'Advanced Settings': '高级设置',

    // ---------- 设置：通知 ----------
    'Sound': '声音',
    'Volume': '音量',
    'Set the volume of agent sounds.': '设置智能体提示音的音量。',
    'Play a sound when your action is needed or the agent finishes.': '需要你操作或智能体完成时播放提示音。',
    'Show system notifications when your action is needed or the agent finishes.':
      '需要你操作或智能体完成时显示系统通知。',

    // ---------- 设置：模型 ----------
    'Models & Usage': '模型与用量',
    'Manage your model quota and credits.': '管理你的模型配额和额度。',
    'Model Credits': '模型额度',
    'Weekly Limit Remaining': '每周剩余额度',
    'Five Hour Limit Remaining': '五小时剩余额度',

    // ---------- 设置：浏览器 ----------
    'Configure built-in browser, link opening, and browser subagent preferences.':
      '配置内置浏览器、链接打开方式和浏览器子智能体偏好。',
    'Browser Subagent': '浏览器子智能体',
    'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
    'Browser Actuation Rules': '浏览器操作规则',

    // ---------- 快捷键 ----------
    'Open Settings': '打开设置',
    'Open File Search': '打开文件搜索',
    'New Tab': '新建标签页',
    'Reopen Closed Tab': '重新打开已关闭的标签页',
    'Open Conversation Picker': '打开对话选择器',
    'Open Conversation in New Tab': '在新标签页打开对话',
    'Toggle Sidebar': '切换侧边栏',
    'Toggle Terminal': '切换终端',
    'Toggle Voice Recording': '切换语音录制',
    'Toggle Model Selector': '切换模型选择器',
    'Toggle Side Panel': '切换侧面板',
    'Toggle Maximize Side Panel': '最大化侧面板',
    'Toggle Overview Panel': '切换概览面板',
    'Select Previous Conversation': '选择上一个对话',
    'Select Next Conversation': '选择下一个对话',
    'Move Conversation Up': '上移对话',
    'Move Conversation Down': '下移对话',
    'Previous Side Panel Tab': '上一个侧面板标签',
    'Next Side Panel Tab': '下一个侧面板标签',
    'Mute Voice Mic': '静音麦克风',
    'Mute Voice Speaker': '静音扬声器',

    // ---------- 自定义（扩展市场）----------
    'Marketplace': '扩展市场',
    'Installed': '已安装',
    'Featured': '精选',
    'Add': '添加',
    'Details': '详情',
    'More Plugins': '更多插件',
    'Build with Google': '使用 Google 构建',
    'Science': '科学',
    'Productivity & Project Management': '效率与项目管理',
    'Google Workspace': 'Google Workspace',
    'Connect to Google Workspace, including Docs, Sheets, Slides, Drive, and Calendar.':
      '连接 Google Workspace，包括文档、表格、幻灯片、云端硬盘和日历。',
    'Google Docs': 'Google 文档',
    'Google Sheets': 'Google 表格',
    'Google Slides': 'Google 幻灯片',
    'Google Drive': 'Google 云端硬盘',
    'Google Calendar': 'Google 日历',
    'Read, draft, and edit docs.': '阅读、起草和编辑文档。',
    'Read, write, and format spreadsheets.': '读取、写入和格式化表格。',
    'Read, edit, and export presentations.': '阅读、编辑和导出演示文稿。',
    'Search, upload, download, and share files.': '搜索、上传、下载和共享文件。',
    'Check availability, schedule events, and RSVP.': '查看空闲时间、安排日程并回复邀请。',
    'Search, read, draft, and send emails in Gmail.': '在 Gmail 中搜索、阅读、起草和发送邮件。',
    "Build on Google's developer platforms, including Android, Chrome, Gemini, and Google Cloud.":
      '在 Google 的开发者平台上构建，包括 Android、Chrome、Gemini 和 Google Cloud。',
    'Gemini API': 'Gemini API',
    'Chrome DevTools': 'Chrome 开发者工具',
    'Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer':
      '使用 Chrome DevTools 和 Puppeteer 在 Chrome 中实现可靠的自动化、深度调试和性能分析',
    'Android CLI': 'Android CLI',
    'Core tools and knowledge required to develop for Android.': '开发 Android 所需的核心工具和知识。',
    'Firebase': 'Firebase',
    'Prototype, build & run modern apps that users love with Firebase\'s backend, AI, and operational infrastructure.':
      '借助 Firebase 的后端、AI 和运维基础设施，快速构建并运行用户喜爱的现代应用。',
    'Curated collection of agent skills for science tasks.': '为科学任务精心挑选的智能体技能集合。',
    'Context7': 'Context7',
    'Up-to-date documentation lookup. Pull version-specific documentation and code examples directly from source repositories into your coding agent\'s context.':
      '最新的文档查询。将特定版本的文档和代码示例从源码仓库直接拉取到你的编程智能体上下文中。',
    'Cloud Hosting & Deployment': '云托管与部署',
    'Business': '商业',
    'Not Found': '未找到',

    'By using this app, you agree to its': '使用本应用即表示你同意其',
    'Terms of Service': '服务条款',
    'Build applications with the Gemini Interactions API and Live API, including text, image, video, and speech generation, managed agents, and real-time multimodal streaming.':
      '使用 Gemini Interactions API 和 Live API 构建应用，涵盖文本、图像、视频和语音生成、托管智能体以及实时多模态流式传输。',
    'Search, upload, download, and share files.': '搜索、上传、下载和共享文件。',
    'Manage your model quota and credits.': '管理你的模型配额和额度。',

    'Workspace': '工作区',
    'View': '视图',
    'Window': '窗口',
    'Build me a web app': '帮我构建一个网页应用',
    'Add a Gemini feature to my app': '为我的应用添加 Gemini 功能',
    'Bring over my setup from other Agentic Developer Tools': '从其他智能体开发工具迁移我的配置',

    'Configure agent execution, queued message delivery, and permissions.':
      '配置智能体执行、排队消息投递和权限。',
    'Interface Layout': '界面布局',
    'Knowledge Work': '知识工作',
    'Simplified interface for research, writing, and everyday tasks.':
      '面向研究、写作和日常任务的简化界面。',
    'Software Engineering': '软件工程',
    'Full interface for coding, developer tools, and managing agents.':
      '面向编码、开发者工具和智能体管理的完整界面。',
    'Global Permissions': '全局权限',
    'Configure global allowed and denied resource permissions.': '配置全局允许和拒绝的资源权限。',
    'Permission Preset': '权限预设',
    'Controls the actions the agent can take.': '控制智能体可以执行的操作。',
    'Tool Permissions': '工具权限',
    'Modify permissions for file, terminal, and MCP tools.': '修改文件、终端和 MCP 工具的权限。',
    'Network Access Rules': '网络访问规则',
    'Configure allowed and denied URLs for reading.': '配置允许和拒绝读取的 URL。',
    'Agent Behavior': '智能体行为',
    'Plan Review Policy': '计划审查策略',
    'Whether the agent asks you to review its documents. Modified in': '智能体是否要求你审查其文档。修改于',
    'Type / and select plan to have the agent generate a plan.': '输入 / 并选择计划，让智能体生成计划。',
    'Execution': '执行',
    'Queued Messages': '排队消息',
    'Configure when follow-up messages are sent.': '配置后续消息发送的时机。',
    'Queue': '排队',
    'Send Immediately': '立即发送',
    'Keyboard shortcuts': '键盘快捷键',
    'Voice mode': '语音模式',
    'Voice': '语音',
    'The voice used in Voice mode. Powered by Gemini Live.': '语音模式使用的声音，由 Gemini Live 提供支持。',
    'Not set': '未设置',
    'Change': '更改',
    'Microphone': '麦克风',
    'Input device for voice mode and dictation.': '语音模式和听写的输入设备。',
    'System default': '系统默认',
    "How loud Antigravity's voice is.": 'Antigravity 语音的音量。',

    // ---------- 对话页 / 通用操作 ----------
    'Archive This Conversation': '归档此对话',
    'Add to Chat/Quote': '添加到对话/引用',
    'Always Proceed': '始终继续',
    'Actual behavior': '实际行为',
    'Application': '应用程序',
    'Attach Antigravity server logs': '附加 Antigravity 服务器日志',
    'Any error messages': '任何错误信息',
    'Any relevant information': '任何相关信息',
    'Cancel': '取消',
    'Save': '保存',
    'Close': '关闭',
    'Delete': '删除',
    'Edit': '编辑',
    'Done': '完成',
    'Retry': '重试',
    'Copy': '复制',
    'Open': '打开',
    'Rename': '重命名',
    'Loading': '加载中',
    'Loading…': '加载中…',
    'Thinking': '思考中',
    'Thinking…': '思考中…',
    'Send': '发送',
    'Stop': '停止',
    'New Chat': '新建聊天',
    'Model': '模型',
    'Help': '帮助',
    'Feedback': '反馈',
    'Docs': '文档',
    'Documentation': '文档',
    'Learn more': '了解更多',
    'Learn more.': '了解更多。',
    'and select': '并选择',
    'Whether the agent asks you to review its documents.': '智能体是否要求你审查其文档。',
    'Modified in': '修改于',
    'to have the agent generate a plan.': '让智能体生成计划。',
    'Continue': '继续',
    'Accept': '接受',
    'Reject': '拒绝',
    'Allow': '允许',
    'Deny': '拒绝',
    'Yes': '是',
    'No': '否',
    'OK': '确定',
    'Error': '错误',
    'Warning': '警告',
    'Success': '成功',
    'Copied': '已复制',
    'Copy code': '复制代码'
  };

  // 形如 “See 7 more” / “See 19 more” 的动态文案
  var PATTERNS = [
    [/^See (\d+) more$/, function (m) { return '再显示 ' + m[1] + ' 项'; }],
    [/^Welcome back, (.+?)\. Where should we pick up\?$/, function (m) {
      return '欢迎回来，' + m[1] + '。我们从哪里继续？';
    }],
    [/^Hey (.+?), what should we build today\?$/, function (m) {
      return '嗨 ' + m[1] + '，今天想构建点什么？';
    }],
    [/^Good to see you, (.+?)\. What's next\?$/, function (m) {
      return '很高兴见到你，' + m[1] + '。接下来做什么？';
    }],
    [/^Whether the agent asks you to review its documents\. Modified in (.+)$/, function (m) {
      return '智能体是否要求你审查其文档。修改于 ' + m[1];
    }]
  ];

  var SKIP_SELECTOR = [
    'input', 'textarea', 'pre', 'code', 'kbd', 'samp',
    '.monaco-editor', '.monaco-diff-editor',
    '[contenteditable="true"]', '[contenteditable=""]',
    '[data-zhcn-skip]'
  ].join(',');

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  var CJK = /[\u4e00-\u9fff]/;

  function lookup(raw) {
    var key = raw.trim();
    if (!key || key.length > 400) return null;
    var hit = DICT[key];
    if (hit !== undefined) return hit;
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = key.match(PATTERNS[i][0]);
      if (m) return PATTERNS[i][1](m);
    }
    return null;
  }

  function skipped(el) {
    if (!el) return true;
    if (el.closest && el.closest(SKIP_SELECTOR)) return true;
    return false;
  }

  function translateTextNode(node) {
    var parent = node.parentElement;
    if (!parent || skipped(parent)) return;
    var value = node.nodeValue;
    if (!value || CJK.test(value)) return;
    var zh = lookup(value);
    if (zh === null) return;
    var lead = value.match(/^\s*/)[0];
    var trail = value.match(/\s*$/)[0];
    node.nodeValue = lead + zh + trail;
  }

  function translateAttributes(el) {
    if (skipped(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      var attr = el.getAttribute && el.getAttribute(name);
      if (!attr || CJK.test(attr)) continue;
      var zh = lookup(attr);
      if (zh !== null) el.setAttribute(name, zh);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    if (skipped(root)) return;
    translateAttributes(root);
    var el = root.querySelectorAll ? root.querySelectorAll('[placeholder],[title],[aria-label],[alt]') : [];
    for (var i = 0; i < el.length; i++) translateAttributes(el[i]);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (CJK.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) translateTextNode(n);
  }

  var pending = new Set();
  var timer = null;

  function schedule() {
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      var roots = Array.from(pending);
      pending.clear();
      for (var i = 0; i < roots.length; i++) {
        if (roots[i].isConnected) walk(roots[i]);
      }
    }, 120);
  }

  function start() {
    if (localStorage.getItem('antigravity-zhcn') === 'off') return;
    walk(document.body);
    var mo = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.type === 'characterData') {
          if (r.target) pending.add(r.target.parentElement || document.body);
        } else if (r.type === 'childList') {
          for (var j = 0; j < r.addedNodes.length; j++) {
            var node = r.addedNodes[j];
            if (node.nodeType === 1) pending.add(node);
            else if (node.nodeType === 3 && node.parentElement) pending.add(node.parentElement);
          }
        } else if (r.type === 'attributes' && r.target) {
          pending.add(r.target);
        }
      }
      if (pending.size) schedule();
    });
    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS
    });
    document.addEventListener('DOMContentLoaded', function () { walk(document.body); }, { once: true });
    window.addEventListener('load', function () { walk(document.body); }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
