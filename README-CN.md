# z-cli

z-cli 是一个基于 ChatGPT 的交互式命令行工具，支持用户输入自然语言来生成可执行的命令。

## 🚀 特点

- **自然语言查询**：根据用户输入的自然语言生成可执行的命令。
- **运行时检测**：检测用户的 shell（例如 PowerShell、zsh、bash 等）和操作系统（例如 Windows、Linux 和 Mac），以确保更准确的命令生成。
- **上下文感知**：允许用户分步骤多次输入，以细化生成命令的需求。
- **命令编辑**：允许用户在执行命令之前手动编辑生成的命令。
- **命令复制**：允许用户将生成的命令复制到剪贴板。

## 🕹️ 示例

- zsh: 查找指定条件下的文件，并显示每个文件的行数。

![find](https://user-images.githubusercontent.com/10039224/230420856-51ab0ddc-63ac-40a3-8470-96cb1f9f4af7.gif)

- PowerShell: 请求 API 并以指定格式返回响应。

![request_api](https://user-images.githubusercontent.com/10039224/230420901-eb9d188c-8ae0-4618-b98b-dd6c926a08fc.gif)

## 📦 安装

您可以通过运行以下命令来安装 z-cli：

```bash
npm install -g @kenmick/z-cli
```

## 🛠️ 配置

在使用 z-cli 之前，您需要配置环境变量 `OPENAI_API_KEY`。

```bash
# Linux and Mac
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```powershell
# Windows
$env:OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

您可以从 [OpenAI](https://platform.openai.com/account/api-keys/) 获取自己的 API KEY。

## 📖 使用

要使用 z-cli，只需运行命令，后面输入您想要查询的内容。例如：

```bash
z-cli 'list js files'
```

然后您将收到以下输出：

```bash
ls *.js
```

您可以运行 `z-cli --help` 来查看更多用法。

```bash
z-cli v0.2.0

Usage:
  z-cli [flags...] <query>

Flags:
      --debug                 Enable debug mode
  -h, --help                  Show help
  -p, --proxy <string>        Proxy url. e.g. http://localhost:1080
      --version               Show version
```

## 📌 为什么取名为 "z-cli"

命名为 `z-cli` 是为了纪念一位叫 `ZCL` 的对我而言**非常重要**的人。🌷

## 🤝 贡献

欢迎贡献！如果您有任何建议或遇到任何问题，请创建新的 issue 或 PR。

## 📜 License

z-cli 的 License 是 GPL-3.0。
