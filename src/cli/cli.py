#!/usr/bin/env python3
"""
CLI tool for the Local AI System
"""

import click
import requests
from src.models.config import SUPPORTED_MODELS, DEFAULT_MODEL, API_PORT


@click.group()
def cli():
    """Local AI System CLI"""
    pass


@cli.command()
@click.argument('message')
@click.option('--model', default=DEFAULT_MODEL, help='Model to use for the conversation')
def chat(message, model):
    """Send a message to the AI and get a response"""
    if model not in SUPPORTED_MODELS:
        click.echo(f"Error: Model '{model}' not supported. Available models: {', '.join(SUPPORTED_MODELS)}", err=True)
        return

    try:
        response = requests.post(
            f'http://localhost:{API_PORT}/v1/chat/completions',
            json={
                'model': model,
                'messages': [{'role': 'user', 'content': message}]
            },
            timeout=300
        )
        response.raise_for_status()
        data = response.json()
        click.echo(data['choices'][0]['message']['content'])
    except requests.RequestException as e:
        click.echo(f"Error: Unable to connect to Local AI System. Please ensure it's running: {e}", err=True)
    except (KeyError, IndexError):
        click.echo("Error: Unexpected response format from AI system", err=True)


@cli.command()
def models():
    """List available AI models"""
    click.echo("Available models:")
    for model in SUPPORTED_MODELS:
        click.echo(f"  - {model}")


@cli.command()
@click.argument('model')
def set_model(model):
    """Set the default model for future CLI interactions"""
    if model not in SUPPORTED_MODELS:
        click.echo(f"Error: Model '{model}' not supported. Available models: {', '.join(SUPPORTED_MODELS)}", err=True)
        return

    click.echo(f"Default model set to: {model}")
    click.echo("Note: This setting is not persisted yet. Use --model flag for now.")


@cli.command()
def health():
    """Check if the Local AI System is running"""
    try:
        response = requests.get(f'http://localhost:{API_PORT}/health', timeout=5)
        response.raise_for_status()
        data = response.json()
        click.echo(f"✅ {data['status']} - {data['service']}")
    except requests.RequestException:
        click.echo("❌ Local AI System is not running or not accessible", err=True)


if __name__ == '__main__':
    cli()