# Mind Sheet

一个基于 Nuxt 3 的多功能在线工具集，包含 Excel 表格、节点画布和思维导图功能。

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

## ✨ 功能特性

### 📊 Excel 表格
- 基于 Handsontable 的在线电子表格
- 支持添加/删除行列
- 数据导出功能
- 类似 Excel 的操作体验

### 🔗 节点画布
- 基于 Vue Flow 的可视化画布
- 创建节点并建立连接关系
- 支持拖拽、缩放
- 流程图可视化
- 画布导出功能

### 🧠 思维导图
- 基于 Mind Elixir 的思维导图编辑器
- **XMind 文件导入** - 支持 `.xmind` 格式文件
- **JSON 导入/导出** - 数据持久化
- **多主题切换** - 默认、暗色、深夜、彩色、绿色、紫色、粉色
- **节点操作** - 添加子节点、同级节点、删除、编辑
- **展开/收起** - 支持单节点及全局展开收起
- **变量插入** - 快捷插入日期时间、用户信息等变量
- **文件管理** - 云端保存和加载思维导图
- **路径预览** - 可视化查看节点路径数据

## 🛠️ 技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| [Nuxt](https://nuxt.com/) | ^3.14.0 | Vue.js 全栈框架，支持 SSR/SSG |
| [Vue](https://vuejs.org/) | ^3.5.13 | 渐进式 JavaScript 框架 |
| [Vue Router](https://router.vuejs.org/) | ^4.5.0 | Vue.js 官方路由 |
| [TypeScript](https://www.typescriptlang.org/) | ^5.6.3 | JavaScript 的类型超集 |

### UI 组件库

| 技术 | 版本 | 说明 |
|------|------|------|
| [Tailwind CSS](https://tailwindcss.com/) | ^6.14.0 | 原子化 CSS 框架 |
| [Shadcn Vue](https://www.shadcn-vue.com/) | ^2.4.3 | 基于 Radix 的 Vue 组件库 |
| [Radix Vue](https://www.radix-vue.com/) | ^1.9.17 | 无样式、可访问的 UI 组件 |
| [Reka UI](https://reka-ui.com/) | ^2.7.0 | Vue 无障碍组件库 |
| [Lucide Vue Next](https://lucide.dev/) | ^0.562.0 | 精美的开源图标库 |
| [Radix Icons Vue](https://icons.radix-ui.com/) | ^1.0.0 | Radix 图标集 |

### 样式工具

| 技术 | 版本 | 说明 |
|------|------|------|
| [class-variance-authority](https://cva.style/) | ^0.7.1 | 组件变体样式管理 |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.1 | 条件 className 工具 |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.4.0 | Tailwind 类名合并 |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | ^1.0.7 | Tailwind 动画插件 |

### 功能库

| 技术 | 版本 | 说明 |
|------|------|------|
| [Handsontable](https://handsontable.com/) | ^16.2.0 | 高性能数据表格组件，类 Excel 体验 |
| [Vue Flow](https://vueflow.dev/) | ^1.48.1 | 可视化节点图编辑器 |
| [@vue-flow/background](https://vueflow.dev/) | ^1.3.2 | Vue Flow 背景插件 |
| [@vue-flow/controls](https://vueflow.dev/) | ^1.1.3 | Vue Flow 控制器插件 |
| [@vue-flow/minimap](https://vueflow.dev/) | ^1.5.4 | Vue Flow 小地图插件 |
| [Mind Elixir](https://mind-elixir.com/) | ^5.3.8 | 开源思维导图核心库 |
| [JSZip](https://stuk.github.io/jszip/) | ^3.10.1 | ZIP 文件创建/解析（XMind 导入） |
| [VueUse](https://vueuse.org/) | ^14.1.0 | Vue 组合式 API 工具集 |

### 环境要求

- **Node.js** >= 20.x
- **npm** >= 10.x

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>
cd mind_sheet

# 安装依赖
npm install
```

## 🚀 开发

```bash
# 启动开发服务器 (http://localhost:3000)
npm run dev
```

## 📦 构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 生成静态站点
npm run generate
```

## 📁 项目结构

```
mind_sheet/
├── assets/
│   └── css/
│       └── tailwind.css      # Tailwind 配置
├── components/
│   └── ui/                   # Shadcn UI 组件
├── layouts/
│   └── default.vue           # 默认布局
├── pages/
│   ├── index.vue             # 首页
│   ├── excel.vue             # Excel 表格页面
│   ├── canvas.vue            # 节点画布页面
│   └── mindmap.vue           # 思维导图页面
├── server/
│   └── api/
│       └── mindmaps/         # 思维导图文件 API
│           ├── list.get.ts   # 获取文件列表
│           ├── upload.post.ts # 上传文件
│           ├── [filename].get.ts    # 获取文件
│           └── [filename].delete.ts # 删除文件
├── storage/
│   └── mindmaps/             # 思维导图文件存储
├── nuxt.config.ts            # Nuxt 配置
├── tailwind.config.js        # Tailwind 配置
└── package.json
```

## 🎯 使用说明

### 思维导图

1. **创建节点**: 选中节点后点击"子节点"或"同级"按钮
2. **编辑节点**: 双击节点或点击"编辑"按钮
3. **删除节点**: 选中节点后点击"删除"按钮
4. **导入 XMind**: 点击"XMind"按钮选择 `.xmind` 文件
5. **保存/加载**: 使用"保存"和"文件"按钮管理云端文件
6. **插入变量**: 点击"变量"按钮或按 `空格+@` 快捷键

### 节点画布

1. **添加节点**: 点击"添加节点"按钮
2. **连接节点**: 从节点连接点拖拽到另一节点
3. **编辑节点**: 直接在节点输入框中修改文字
4. **删除节点**: 点击节点上的 × 按钮

### Excel 表格

1. **编辑单元格**: 直接点击单元格输入内容
2. **添加行/列**: 使用工具栏按钮
3. **导出数据**: 点击"导出"按钮

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 项目结构

```
.
├── app.vue           # 应用入口组件
├── nuxt.config.ts    # Nuxt 配置文件
├── tsconfig.json     # TypeScript 配置
├── public/           # 静态资源目录
└── server/           # 服务端 API 目录
```

## 了解更多

查看 [Nuxt 3 官方文档](https://nuxt.com/docs/getting-started/introduction) 了解更多信息。
