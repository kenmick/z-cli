# z-cli

z-cli is an interactive ChatGPT-powered command line tool that generates commands using natural language.

## 🚀 Features

- **Natural language query**: Generates commands based on the user's natural language input.
- **Runtime detection**: Detects the user's shell (e.g. PowerShell, zsh, bash, etc.) and OS (e.g. Windows, Linux, and Mac) to ensure more accurate command generation.
- **Context awareness**: Allows the user to input follow-up queries to specify additional requirements.
- **Command editing**: Allows the user to manually refine the generated command before executing it.

## 🕹️ Example

![find](https://user-images.githubusercontent.com/10039224/230117592-d363a1cf-d335-49d6-9d47-cf6ddf86b1f9.gif)
![curl](https://user-images.githubusercontent.com/10039224/230116461-cf902508-df74-4612-a71b-d4b33995f55f.gif)

## 📦 Installation

You can install z-cli by running the following command:

```bash
npm install -g @kenmick/z-cli
```

## 🛠️ Configuration

Before using z-cli, you need to set up the environment variable `OPENAI_API_KEY`.

```bash
# Linux and Mac
export OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```powershell
# Windows
$env:OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

You can get your own API KEY from [OpenAI](https://platform.openai.com/account/api-keys/)

## 📖 Usage

To use z-cli, simply run the command followed by your desired input. For example:

```bash
z-cli 'list js files'
```

You will then receive the following output:

```bash
ls *.js
```

You can discover more usage by running `z-cli --help`.

```
z-cli v0.2.0

Usage:
  z-cli [flags...] <query>

Flags:
      --debug                 Enable debug mode
  -h, --help                  Show help
  -p, --proxy <string>        Proxy url. e.g. http://localhost:1080
      --version               Show version
```

## 📌 Why the name z-cli?

I named it `z-cli` to in memory of someone named `ZCL` who was a REALLY IMPORTANT person to me. 🌷

## 🤝 Contributing

Contributions are always welcome! If you have any suggestions or run into any issues, please create a new issue or pull request.

## 📜 License

z-cli is [GPL-3.0 licensed](https://github.com/kenmick/z-cli/blob/main/LICENSE).
