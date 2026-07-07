# AI 对话助手 前端设计规范 (Tailwind CSS 版)

---

## 1. 设计令牌 (Design Tokens) - Tailwind 配置映射

### 1.1 颜色 (Colors)

| Tailwind Key | 色值 | 用途 |
|-------|------|------|
| `accent` | `#4d7cfe` | 主强调色（按钮、链接、聚焦态、头像） |+
| `accent-hover` | `#3b6ae8` | 强调色悬停 |
| `accent-ring` | `rgba(77,124,254,0.12)` | 聚焦发光环 |
| `bg-primary` | `#ffffff` | 主背景（聊天区） |
| `bg-sidebar` | `#f9fafb` | 侧边栏背景 |
| `bg-hover` | `#f3f4f6` | 列表项/按钮悬停 |
| `bg-active` | `#e5e7eb` | 选中态背景 |
| `bg-input` | `#f9fafb` | 输入框背景 |
| `border-default` | `#e5e7eb` | 默认边框 |
| `border-hover` | `#d1d5db` | 悬停边框 |
| `text-primary` | `#111827` | 主文字（标题） |
| `text-body` | `#374151` | 正文文字 |
| `text-secondary` | `#6b7280` | 次要文字 |
| `text-muted` | `#9ca3af` | 弱化文字/占位符 |
| `code-bg` | `#1a1a2e` | 代码块背景 |
| `code-text` | `#e2e8f0` | 代码块文字 |
| `inline-code` | `#f3f4f6` | 行内代码背景 |

---

## 2. 布局规范 (Layout)

- **侧边栏**: `w-[260px]` 固定宽度，不可缩放。
- **消息容器**: `max-width: 768px` (`max-w-3xl`), `mx-auto`。
- **响应式**: `hidden md:flex` 控制侧边栏在移动端隐藏。
- **高度**: 使用 `h-dvh`。

---

## 3. 组件规范 (Components)

### 3.1 消息行 (MessageRow)
- `py-5`, `border-b border-bg-sidebar` (最后一行除外)。
- `hover:opacity-100` 控制操作栏可见性。

### 3.2 输入框 (InputBox)
- `rounded-2xl`, `border border-border-hover`, `focus-within:ring-3 focus-within:ring-accent-ring`。

---

## 4. 开发要求
- 优先使用 Tailwind 原子类，禁止编写冗余的自定义 CSS。
- 复杂动画使用 Tailwind 插件或自定义类在 `index.css` 中定义。
