# Eagle Reader

Eagle App URL Bridge，一个用于在浏览器和 Eagle App 之间建立 URL 桥接的本地服务，支持双向转换 `eagle://` 和 `http://localhost` 链接。

> 当前实现只适合在本地使用

## 🎯 项目目标

在使用 Eagle App 管理素材时，经常需要在不同场景下分享和访问文件链接：

- **分享给他人**：Eagle 的 `eagle://` 协议链接只能在安装了 Eagle 的设备上使用
- **跨平台协作**：需要一个通用的 HTTP 链接格式便于分享
- **快速转换**：在本地工作时需要快速在两种链接格式间切换

本项目提供了一个完整的解决方案，实现双向转换和自动打开功能。

## ✨ 功能特性

### 双向链接转换

- **Eagle → HTTP**：`eagle://item/LWOZMMV8YOFQ2` → `http://localhost:1234/item/LWOZMMV8YOFQ2`
- **HTTP → Eagle**：`http://localhost:1234/item/LWOZMMV8YOFQ2` → 自动打开 Eagle App

### 用户体验

- 🔄 一键链接格式转换（通过 Automator 快捷键）
- 🌐 浏览器访问自动跳转到 Eagle App
- ✅ 友好的成功/错误提示页面
- 🎯 访问成功后浏览器标签页自动关闭

## 🛠 技术实现

### 1. Automator 快速操作（macOS）

- 监听剪贴板内容
- 自动识别 `eagle://` 链接并转换为 `http://localhost:1234/` 格式
- 通过自定义快捷键触发

### 2. Node.js Web 服务

- 监听 `localhost:1234` 端口
- 解析 `/item/:id` 路径参数
- 使用 macOS `open` 命令启动 Eagle App
- 提供友好的 Web 界面和错误处理

## 🚀 快速开始

### 环境要求

- macOS 系统
- Node.js (推荐 14.x 或更高版本)
- Eagle App 已安装

### 1. 克隆项目

```bash
git clone https://github.com/your-username/eagle-app-url-bridge.git
cd eagle-app-url-bridge
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动服务

```bash
npm start
# 或
node server.js
```

服务启动后将监听 `http://localhost:1234`

### 4. 配置 Automator 快速操作（可选）

1. 打开 **Automator** → 创建 **快速操作**
2. 设置接收：**"没有输入"**，位于：**"任何应用程序"**
3. 添加 **"运行 Shell 脚本"** 操作，输入以下脚本：

```bash
#!/bin/bash
input=$(pbpaste)
if [[ $input == eagle://* ]]; then
    result="${input/eagle:\/\//http://localhost:1234/}"
    echo "$result" | pbcopy
fi
```

4. 保存为 "转换 Eagle 链接"
5. 在 **系统偏好设置** → **键盘** → **快捷键** → **服务** 中设置快捷键

## 📖 使用方法

### 链接转换（Eagle → HTTP）

1. 在 Eagle App 中复制文件链接（格式：`eagle://item/LWOZMMV8YOFQ2`）
2. 按配置的快捷键（如 `Cmd+Option+E`）
3. 剪贴板中的链接自动转换为 `http://localhost:1234/item/LWOZMMV8YOFQ2`

### 浏览器访问（HTTP → Eagle）

1. 在浏览器中访问 `http://localhost:1234/item/LWOZMMV8YOFQ2`
2. 服务自动调用 Eagle App 打开对应文件
3. 浏览器显示成功页面并在 2 秒后自动关闭标签页

## 🔧 开机自启动（可选）

使用 PM2 管理服务：

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name eagle-redirect

# 设置开机自启动
pm2 startup
pm2 save
```

## 📁 项目结构

```
eagle-app-url-bridge/
├── server.js          # 主服务文件
├── package.json       # 项目配置
├── README.md          # 项目说明
└── .gitignore         # Git 忽略文件
```

## 🐛 故障排除

### 服务无法启动

- 检查端口 1234 是否被占用：`lsof -i :1234`
- 尝试更换端口：修改 `server.js` 中的 `port` 变量

### Eagle App 无法打开

- 确认 Eagle App 已正确安装
- 检查 macOS 的安全设置，允许应用访问其他程序

### Automator 快捷键无响应

- 检查系统偏好设置中的快捷键是否有冲突
- 确认 Automator 服务的权限设置

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Eagle App](https://eagle.cool) - 优秀的素材管理工具
- [Express.js](https://expressjs.com) - Node.js Web 框架
- macOS Automator - 系统自动化工具

---

**注意**：本项目仅在 macOS 系统上测试，其他操作系统可能需要修改相应的命令和路径。
