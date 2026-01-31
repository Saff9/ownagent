#!/usr/bin/env python3
"""
Example script demonstrating API usage of the Local AI System
"""

import requests
import json

# Configuration
API_BASE = "http://localhost:8000"
MODEL = "qwen2.5-coder:3b"

def chat_completion(message: str, model: str = MODEL) -> str:
    """Send a chat completion request"""
    url = f"{API_BASE}/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": message}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except requests.RequestException as e:
        return f"Error: {e}"

def list_models():
    """List available models"""
    url = f"{API_BASE}/v1/models"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return [model["id"] for model in data["data"]]
    except requests.RequestException as e:
        return f"Error: {e}"

def main():
    print("🧠 Local AI System - API Usage Example")
    print("=" * 50)

    # List available models
    print("Available models:")
    models = list_models()
    for model in models:
        print(f"  - {model}")
    print()

    # Example conversations
    examples = [
        "Write a Python function to calculate the factorial of a number.",
        "Explain how machine learning works in simple terms.",
        "Create a simple HTML page with a heading and a paragraph."
    ]

    for i, example in enumerate(examples, 1):
        print(f"Example {i}: {example}")
        print("-" * 40)
        response = chat_completion(example)
        print(response)
        print("\n" + "=" * 50 + "\n")

if __name__ == "__main__":
    main()