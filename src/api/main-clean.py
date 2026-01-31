"""
LocalAI - Premium AI Chat Interface with Ollama Backend
Fast, beautiful, and responsive local AI assistant
"""

from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import httpx
from typing import List, Optional
from src.models.config import SUPPORTED_MODELS, DEFAULT_MODEL, OLLAMA_BASE_URL, API_HOST, API_PORT
import logging

# ========== LOGGING ==========
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ========== MODELS ==========
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str = DEFAULT_MODEL
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None

# ========== APP ==========
app = FastAPI(
    title="LocalAI",
    description="Premium local AI chat with Ollama",
    version="2.0.0"
)

# Mount static files
app.mount("/static", StaticFiles(directory="src/web/static"), name="static")
templates = Jinja2Templates(directory="src/web/templates")

# ========== ROUTES - UI ==========
@app.get("/")
async def root(request: Request):
    """Root page - serves premium chat interface"""
    try:
        return templates.TemplateResponse("app.html", {
            "request": request,
            "models": SUPPORTED_MODELS,
            "default_model": DEFAULT_MODEL
        })
    except Exception as e:
        logger.error(f"Error loading root page: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load interface")

@app.get("/chat")
async def chat_page(request: Request):
    """Chat page - redirects to root"""
    return root(request)

# ========== ROUTES - API ==========
@app.get("/v1/models")
async def list_models():
    """Get available models"""
    try:
        return {
            "object": "list",
            "data": [
                {
                    "id": model,
                    "object": "model",
                    "created": 0,
                    "owned_by": "local"
                }
                for model in SUPPORTED_MODELS
            ]
        }
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list models")

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    """Chat completions - OpenAI compatible endpoint"""
    
    # Validate model
    if request.model not in SUPPORTED_MODELS:
        logger.warning(f"Invalid model requested: {request.model}")
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model}' not available. Use: {', '.join(SUPPORTED_MODELS)}"
        )

    # Prepare Ollama request
    ollama_payload = {
        "model": request.model,
        "messages": [{"role": msg.role, "content": msg.content} for msg in request.messages],
        "temperature": request.temperature or 0.7,
        "stream": False
    }

    if request.max_tokens:
        ollama_payload["num_predict"] = request.max_tokens

    try:
        # Call Ollama
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/v1/chat/completions",
                json=ollama_payload
            )
            
            if response.status_code != 200:
                logger.error(f"Ollama error: {response.text}")
                raise HTTPException(
                    status_code=503,
                    detail="Ollama service error. Ensure Ollama is running."
                )

            return response.json()

    except httpx.RequestError as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Cannot reach Ollama. Ensure it's running on " + OLLAMA_BASE_URL
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chat processing failed")

# ========== ROUTES - HEALTH ==========
@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            ollama_ok = response.status_code == 200
    except:
        ollama_ok = False

    return {
        "status": "healthy",
        "app": "LocalAI",
        "version": "2.0.0",
        "ollama": "connected" if ollama_ok else "disconnected",
        "models": SUPPORTED_MODELS
    }

# ========== ROUTES - STATIC ==========
@app.get("/api/config")
async def get_config():
    """Get client configuration"""
    return {
        "models": SUPPORTED_MODELS,
        "default_model": DEFAULT_MODEL,
        "version": "2.0.0"
    }

# ========== STARTUP ==========
@app.on_event("startup")
async def startup():
    """Startup tasks"""
    logger.info(f"LocalAI starting on {API_HOST}:{API_PORT}")
    logger.info(f"Ollama URL: {OLLAMA_BASE_URL}")
    logger.info(f"Models: {', '.join(SUPPORTED_MODELS)}")

# ========== RUN ==========
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=API_HOST,
        port=API_PORT,
        log_level="info",
        reload=False
    )
