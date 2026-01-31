# 🤖 GenZ Owais AI

A **complete local AI platform** built using **Ollama** and powerful open-source models like **Qwen** and **DeepSeek**.
This system runs **100% locally**, supports **chat, coding, APIs, and web apps**, and is fully extensible.

> ✅ No cloud  
> ✅ No API cost  
> ✅ Full privacy  
> ✅ Works offline  

---

## 🚀 What This Project Does
- Run large language models locally using Ollama
- Provide an OpenAI-compatible API
- Build your own AI assistant
- Support coding, reasoning, and automation
- Ready for ZIP upload & GitHub hosting

---

## 🧠 Available AI Models
This system supports the following models (pre-downloaded via Ollama):

| Model Name | Purpose |
|----------|--------|
| `qwen2.5-coder:1.5b-base` | Lightweight & fast coding |
| `qwen2.5-coder:3b` | Balanced coding performance |
| `qwen2.5-coder:latest` | Advanced coding AI |
| `deepseek-coder:6.7b-instruct-q4_0` | Coding + reasoning |
| `deepseek-v3.1:671b-cloud` | Cloud reference |

---

## 🖥️ System Requirements
- Windows / Linux / macOS
- Python **3.9+**
- Minimum **8GB RAM** (16GB recommended)
- Ollama installed

---

## 📦 Installation Guide

### 1️⃣ Install Ollama
Download and install Ollama from the official website:
- **Windows**: [Download Ollama for Windows](https://ollama.com/download/windows)
- **macOS**: [Download Ollama for macOS](https://ollama.com/download/mac)
- **Linux**: [Download Ollama for Linux](https://ollama.com/download/linux)

After installation, verify Ollama is running:
```bash
ollama --version
```

### 2️⃣ Download AI Models
Pull the required models:
```bash
ollama pull qwen2.5-coder:1.5b-base
ollama pull qwen2.5-coder:3b
ollama pull qwen2.5-coder:latest
ollama pull deepseek-coder:6.7b-instruct-q4_0
```

Note: `deepseek-v3.1:671b-cloud` is for reference only and not locally runnable.

### 3️⃣ Install Python Dependencies
Clone or download this repository, then install dependencies:
```bash
pip install -r requirements.txt
```

### 4️⃣ Run the System
Start the local AI system:
```bash
python -m src.api.main
```

The API server will start on `http://localhost:8000`

For the web interface, open `http://localhost:8000/chat` in your browser.

For CLI usage:
```bash
python -m src.cli.cli --help
```

---

## 📖 Usage

### API Usage
The system provides OpenAI-compatible endpoints:

- **Chat Completions**: `POST /v1/chat/completions`
- **Models List**: `GET /v1/models`

Example API call:
```python
import requests

response = requests.post("http://localhost:8000/v1/chat/completions", json={
    "model": "qwen2.5-coder:3b",
    "messages": [{"role": "user", "content": "Hello, write a Python function to calculate factorial."}]
})
print(response.json())
```

### Web Interface
Access the chat interface at `http://localhost:8000/chat` to interact with the AI through a web browser.

### CLI Tool
Use the command-line interface for direct interaction:
```bash
# Chat with the AI
python -m src.cli.cli chat "Explain how recursion works"

# List available models
python -m src.cli.cli models

# Switch model
python -m src.cli.cli set-model qwen2.5-coder:latest
```

---

## 🔧 Configuration
Model configurations and settings can be found in `src/models/config.py`. You can modify default models, API settings, and add custom models there.

---

## 🛠️ Development
To contribute or extend the system:

1. The system is modular with extensions in `src/extensions/`
2. Add new API routes in `src/api/routes/`
3. Customize the web interface in `src/web/`
4. Add CLI commands in `src/cli/cli.py`

---

## 📄 License
This project is open-source. Feel free to modify and distribute.

---

## 🤝 Contributing
Contributions are welcome! Please submit issues and pull requests on GitHub.