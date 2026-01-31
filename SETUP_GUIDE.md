# 🚀 LocalAI - Premium Local AI Chat Interface

Beautiful, fast, and responsive chat interface for local AI models using Ollama.

## ✨ Features

✅ **Beautiful UI** - Modern, eye-friendly dark interface with smooth animations  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Fast & Local** - All processing happens on your machine  
✅ **Multiple Models** - Support for any Ollama model (Qwen, DeepSeek, Llama, etc.)  
✅ **Conversation History** - Auto-saved conversations with persistent storage  
✅ **Temperature Control** - Adjust AI creativity on the fly  
✅ **OpenAI Compatible** - Standard API endpoints  

## 📋 Requirements

- Python 3.9+
- Ollama installed and running locally
- FastAPI, httpx, pydantic

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start Ollama
```bash
# In a separate terminal
ollama serve

# Pull a model (if not already done)
ollama pull qwen:3b
```

### 3. Run LocalAI
```bash
python -m src.api.main
```

### 4. Open in Browser
```
http://localhost:8000
```

## 🎨 UI Features

- **Sidebar**: Conversation history, quick actions
- **Chat Area**: Beautiful message bubbles, real-time typing
- **Settings**: Temperature adjustment, model selection
- **Export**: Download conversations as text
- **Responsive**: Adapts to any screen size

## 🔧 Configuration

Edit `src/models/config.py`:

```python
SUPPORTED_MODELS = ["qwen:3b", "deepseek-r1:1.5b", "llama2"]
DEFAULT_MODEL = "qwen:3b"
OLLAMA_BASE_URL = "http://localhost:11434"
API_HOST = "0.0.0.0"
API_PORT = 8000
```

## 📱 API Endpoints

### Chat Completions (OpenAI Compatible)
```bash
POST /v1/chat/completions

{
  "model": "qwen:3b",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "temperature": 0.7
}
```

### List Models
```bash
GET /v1/models
```

### Health Check
```bash
GET /health
```

### Configuration
```bash
GET /api/config
```

## 🎯 Keyboard Shortcuts

- **Enter** - Send message
- **Shift+Enter** - New line
- **Tab** - In settings, cycle through fields

## 🐛 Troubleshooting

### "Ollama service unavailable"
- Make sure Ollama is running: `ollama serve`
- Check Ollama URL in config
- Try: `curl http://localhost:11434/api/tags`

### UI not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check if server is running on port 8000
- Check browser console for errors (F12)

### Slow responses
- Your GPU might be loading the model
- Try a smaller model: `ollama pull qwen:0.5b`
- Reduce `max_tokens` setting

## 📝 Available Models

Popular models for Ollama:
```bash
ollama pull qwen:3b          # Fast, good quality
ollama pull deepseek-r1:1.5b # Strong reasoning
ollama pull llama2           # General purpose
ollama pull mistral          # Fast and efficient
ollama pull neural-chat      # Optimized for chat
```

Check [Ollama Models](https://ollama.ai/library) for more options.

## 🌐 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💡 Tips

1. **Auto-naming**: Conversations auto-name from your first message
2. **Temperature**: Lower = more focused, Higher = more creative
3. **Export**: Download conversations for backup or sharing
4. **GPU**: GPU acceleration works if Ollama is configured with GPU

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

- Check troubleshooting section
- Review error messages in browser console (F12)
- Check server logs in terminal

---

**Built with ❤️ for local AI**
