# 🤖 Tao Tun Chatbot — Smart Thai Voice & Text Assistant

> A modern, modular Thai chatbot platform powered by speech recognition, text-to-speech, and webhook-driven intelligence.

---

## 🚀 Overview

**Tao Tun Chatbot** is a versatile conversational AI system designed for seamless interaction in **Thai language**, supporting both **text-based** and **voice-based** communication.

This project combines multiple technologies into a unified architecture:

* 🎙️ Speech-to-Text (STT)
* 🔊 Text-to-Speech (TTS)
* 🌐 Webhook-based AI logic (e.g., n8n workflows)
* 🖥️ Multiple frontend interfaces

The goal is simple:

> Deliver a natural, flexible, and extensible chatbot experience tailored for real-world Thai users.

---

## 🧠 Key Capabilities

### 🗣️ Multi-Modal Interaction

* Input via **text** or **voice**
* Real-time transcription for spoken input

### 🇹🇭 Thai Language Native Support

* Optimized for Thai speech recognition
* Natural Thai voice generation via TTS

### 🔗 Webhook-Driven Intelligence

* Easily plug into backend logic (e.g., n8n, APIs, LLMs)
* Decoupled architecture for maximum flexibility

### 🖥️ Multiple Frontends

* Streamlit-based interactive UI
* Lightweight Web UI (HTML/CSS/JS)

### 🔊 Audio Pipeline

* Generate and serve audio responses dynamically
* Temporary audio storage for playback

---

## 🏗️ Project Architecture

```
Tao_tun/
│
├── src/
│   ├── app/        # 🎤 Streamlit voice chatbot interface
│   ├── server/     # 🔊 Flask TTS server (gTTS powered)
│   └── web/        # 🌐 Static web frontend (HTML/JS/CSS)
│
├── data/
│   └── audio/      # 📁 Temporary generated audio files
│
├── scripts/        # ⚙️ Utility & setup scripts
│
├── pyproject.toml  # 📦 Dependency management
└── README.md       # 📘 You are here
```

---

## ⚙️ Tech Stack

* **Frontend**

  * Streamlit
  * Vanilla HTML / CSS / JavaScript

* **Backend**

  * Flask (TTS Server)
  * Webhook Integration (e.g., n8n)

* **AI / Audio**

  * Speech Recognition (STT)
  * gTTS (Google Text-to-Speech)

---

## 🛠️ Getting Started

### 📌 Prerequisites

* Python **3.10+**
* pip or **uv** (recommended)

---

### 📥 Installation

```bash
git clone https://github.com/Eakkachad/Tao_tun.git
cd Tao_tun
```

Install dependencies:

```bash
pip install -e .
# OR
uv sync
```

---

## ▶️ Running the System

### 🎤 1. Start Streamlit App

```bash
streamlit run src/app/main.py
```

---

### 🔊 2. Start TTS Server

```bash
python src/server/main.py
```

---

### 🌐 3. Open Web Interface

Open in browser:

```
src/web/index.html
```

> ⚠️ Ensure:
>
> * TTS server is running
> * Webhook endpoint is reachable

---

## 🔧 Configuration

The chatbot logic is powered by a **Webhook URL**.

Update the `WEBHOOK_URL` in:

* Streamlit app
* Web frontend scripts

Example:

```python
WEBHOOK_URL = "https://your-n8n-or-api-endpoint/webhook/chat"
```

---

## 🔄 How It Works

```mermaid
flowchart LR
    User -->|Text / Voice| Frontend
    Frontend -->|Request| Webhook
    Webhook -->|Response| Frontend
    Frontend -->|Text| TTS Server
    TTS Server -->|Audio| User
```

---

## 💡 Use Cases

* 🏫 Educational assistants (Thai-speaking)
* 🏢 Customer support bots
* 📞 Voice-enabled service kiosks
* 🤖 AI-powered automation via n8n

---

## 🧪 Future Improvements

* 🎯 Better Thai NLP accuracy
* 🧠 LLM integration (OpenAI / local models)
* 📱 Mobile-friendly UI
* 🔐 Authentication & user sessions
* 📊 Analytics dashboard

---

## 📜 License

This project is intended for **development and demonstration purposes**.

---

## ✨ Credits

Developed with passion for Thai AI innovation 🇹🇭
Built to bridge human conversation and intelligent systems.

---

> “Talk naturally. Let Tao Tun handle the rest.” 🎙️
