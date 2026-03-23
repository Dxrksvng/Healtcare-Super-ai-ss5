# Tao Tun Chatbot

Tao Tun is a versatile Thai chatbot designed to support both text and voice-to-text interactions. The project integrates multiple components to provide a seamless conversational experience using speech recognition, text-to-speech (TTS), and webhook-based logic.

## Project Structure

The project is organized into several key directories for clarity and modularity:

- `src/app/`: Contains the Streamlit-based application for the voice-enabled chatbot interface.
- `src/server/`: A Flask-based server providing text-to-speech capabilities via gTTS.
- `src/web/`: A vanilla HTML/JS/CSS web interface for interacting with the chatbot.
- `data/audio/`: Temporary storage for generated audio files.
- `scripts/`: Utility scripts for project setup or maintenance.

## Key Features

- **Text and Voice Input**: Users can type messages or use the microphone for input.
- **Thai Language Support**: Built-in support for Thai speech recognition and generation.
- **Webhook Integration**: Flexible backend connectivity through a central webhook (e.g., n8n).
- **Multiple Frontends**: Choose between a Streamlit app and a lightweight web interface.

## Getting Started

### Prerequisites

- Python 3.10+
- Requirements listed in `pyproject.toml` (managed by `uv` or `pip`).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Eakkachad/Tao_tun.git
   cd Tao_tun
   ```

2. Install dependencies:
   ```bash
   pip install -e .
   # or
   uv sync
   ```

### Running the Application

- **Streamlit App**:
  ```bash
  streamlit run src/app/main.py
  ```

- **TTS Server**:
  ```bash
  python src/server/main.py
  ```

- **Web Interface**:
  Open `src/web/index.html` in a web browser. Ensure the TTS server and webhook are reachable.

## Configuration

The chatbot logic is powered by a webhook. Update the `WEBHOOK_URL` in the respective source files to point to your backend logic (e.g., n8n workflow).

## License

This project is for demonstration and development purposes.
