# 🤖 GenZ Owais AI

A **complete local AI platform** built using **Ollama** and powerful open-source models like **Qwen** and **DeepSeek**.
This system runs **100% locally**, supports **chat, coding, APIs, and web apps**, and is fully extensible.

> ✅ No cloud  
> ✅ No API cost  
> ✅ Full privacy  
> ✅ Works offline  

---

## 🚀 Quick Start

### Option 1: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd localai

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env  # Windows
# or: cp .env.example .env  # Linux/macOS

# Start Ollama (if using local models)
ollama serve

# Run the API
python -m src.api.main

# In another terminal, start the frontend
cd frontend
npm install
npm run dev
```

The API will be available at `http://localhost:8000`
The frontend will be available at `http://localhost:5173`

### Option 2: Docker Deployment

```bash
# Clone the repository
git clone <repository-url>
cd localai

# Copy environment template
copy .env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose up -d

# Access the application
# API: http://localhost:8000
# Frontend: http://localhost:5173
```

### Option 3: Production Deployment

```bash
# Build and run with Docker
docker build -t genzsmart-api .
docker run -d -p 8000:8000 --name genzsmart \
  -v ./data:/app/data \
  -v ./uploads:/app/uploads \
  -e GENZSMART_DEBUG=false \
  genzsmart-api

# Build frontend
cd frontend
docker build -t genzsmart-frontend .
docker run -d -p 80:80 --name frontend genzsmart-frontend
```

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

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `GENZSMART_APP_NAME` | Application name | GenZ Smart API |
| `GENZSMART_APP_VERSION` | Version string | 1.0.0 |
| `GENZSMART_DEBUG` | Debug mode | false |
| `GENZSMART_HOST` | API host | 0.0.0.0 |
| `GENZSMART_PORT` | API port | 8000 |
| `GENZSMART_DATABASE_URL` | Database connection | sqlite:///./data/genzsmart.db |
| `GENZSMART_ENCRYPTION_KEY` | API key encryption key | (auto-generated) |
| `GENZSMART_CORS_ORIGINS` | Allowed CORS origins | localhost origins |
| `OPENAI_API_KEY` | OpenAI API key | (optional) |
| `ANTHROPIC_API_KEY` | Anthropic API key | (optional) |
| `DEEPSEEK_API_KEY` | DeepSeek API key | (optional) |

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

## 🛠️ Production Deployment Checklist

- [ ] Set `GENZSMART_DEBUG=false`
- [ ] Configure `GENZSMART_CORS_ORIGINS` with your domain
- [ ] Generate a strong `GENZSMART_ENCRYPTION_KEY`
- [ ] Set up PostgreSQL for production (optional)
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging
- [ ] Set up monitoring

---

## 🔒 Security

- All API keys are encrypted at rest
- CORS is configured to restrict origins
- Security headers are added to all responses
- Rate limiting is available via middleware

---

## 🖥️ System Requirements

- Windows / Linux / macOS
- Python **3.9+**
- Minimum **8GB RAM** (16GB recommended)
- Ollama installed

---

## 📄 License

This project is open-source. Feel free to modify and distribute.

---

## 🤝 Contributing

Contributions are welcome! Please submit issues and pull requests on GitHub.
