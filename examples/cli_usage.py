#!/usr/bin/env python3
"""
Example script demonstrating CLI usage of the Local AI System
Note: This script shows how to use the CLI programmatically, but for interactive use,
run the CLI directly: python -m src.cli.cli
"""

import subprocess
import sys

def run_cli_command(command: list) -> str:
    """Run a CLI command and return output"""
    try:
        result = subprocess.run(
            [sys.executable, "-m", "src.cli.cli"] + command,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.stdout.strip() if result.returncode == 0 else f"Error: {result.stderr.strip()}"
    except subprocess.TimeoutExpired:
        return "Error: Command timed out"
    except Exception as e:
        return f"Error: {e}"

def main():
    print("🧠 Local AI System - CLI Usage Examples")
    print("=" * 50)

    # Check health
    print("1. Checking system health:")
    health = run_cli_command(["health"])
    print(f"   {health}")
    print()

    # List models
    print("2. Listing available models:")
    models_output = run_cli_command(["models"])
    print(models_output)
    print()

    # Example chat commands
    examples = [
        "Write a simple Hello World program in Python",
        "What is the capital of France?",
        "Explain recursion in programming"
    ]

    for i, example in enumerate(examples, 1):
        print(f"3.{i} Chat example: '{example}'")
        print("-" * 40)
        response = run_cli_command(["chat", example])
        print(response)
        print()

    print("For interactive CLI usage:")
    print("  python -m src.cli.cli --help")
    print("  python -m src.cli.cli chat 'Your message here'")
    print("  python -m src.cli.cli chat 'Hello AI' --model qwen2.5-coder:latest")

if __name__ == "__main__":
    main()