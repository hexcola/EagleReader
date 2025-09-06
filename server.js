const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 4159;

// 处理根路径
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Eagle 链接转换服务</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>Eagle 链接转换服务</h1>
        <p>服务运行中... 端口: ${port}</p>
        <p>用法: 访问 <code>http://localhost:${port}/item/YOUR_ITEM_ID</code></p>
        <p>将自动重定向到 Eagle App</p>
      </body>
    </html>
  `);
});

// 处理 /item/:id 路径
app.get("/item/:id", (req, res) => {
  const itemId = req.params.id;
  const eagleUrl = `eagle://item/${itemId}`;

  console.log(`收到请求: ${req.url}`);
  console.log(`转换为: ${eagleUrl}`);

  // 在 macOS 上使用 open 命令打开 eagle:// 链接
  exec(`open "${eagleUrl}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error}`);
      res.status(500).send(`
        <html>
          <head>
            <title>错误</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1>打开 Eagle 失败</h1>
            <p>错误信息: ${error.message}</p>
            <p>请确保 Eagle App 已安装</p>
            <a href="/">返回首页</a>
          </body>
        </html>
      `);
      return;
    }

    // 成功打开后，显示成功页面
    res.send(`
      <html>
        <head>
          <title>成功</title>
          <meta charset="utf-8">
          <script>
            // 2秒后自动关闭标签页
            setTimeout(() => {
              window.close();
            }, 2000);
          </script>
        </head>
        <body>
          <h1>✅ 成功</h1>
          <p>正在打开 Eagle App...</p>
          <p>目标: <code>${eagleUrl}</code></p>
          <p>此页面将在 2 秒后自动关闭</p>
          <a href="/">返回首页</a>
        </body>
      </html>
    `);
  });
});

// 处理其他所有路径（放在最后作为 fallback）
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 - 页面未找到</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>404 - 页面未找到</h1>
        <p>请访问: <code>http://localhost:${port}/item/YOUR_ITEM_ID</code></p>
        <a href="/">返回首页</a>
      </body>
    </html>
  `);
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 Eagle 链接转换服务已启动`);
  console.log(`📍 访问地址: http://localhost:${port}`);
  console.log(`📱 用法: http://localhost:${port}/item/YOUR_ITEM_ID`);
  console.log(`⏹  停止服务: Ctrl + C`);
});

// 优雅关闭
process.on("SIGINT", () => {
  console.log("\n👋 正在关闭服务器...");
  process.exit(0);
});
