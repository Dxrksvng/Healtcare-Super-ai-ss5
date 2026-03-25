# 🤖 Tao Tun Chatbot — Super AI SS5 Project

> A smart Thai voice & text chatbot developed as part of **Super AI Engineer Season 5**

---

## 🏆 Project Background

**Tao Tun Chatbot** is a project developed under the **Super AI Engineer Season 5 (SS5)** program — a national-level AI talent development initiative focused on building real-world AI solutions.

This project is inspired by the concept of:

> 🧓 *AI-powered Elderly Care & Palliative Preparation System*

The goal is to create an intelligent assistant that helps support communication, accessibility, and digital interaction—especially for Thai users, including the elderly.

---

## 🚀 Overview

**Tao Tun Chatbot** is a modular conversational AI system that enables users to interact via:

* 💬 Text
* 🎙️ Voice (Speech-to-Text)
* 🔊 Audio responses (Text-to-Speech)

It integrates multiple components into a seamless pipeline using webhook-based logic (e.g., n8n), making it flexible and extensible for various applications.

---

## 🧠 Key Capabilities

### 🗣️ Multi-Modal Interaction

* Supports both **text input** and **voice input**
* Real-time transcription of speech

### 🇹🇭 Thai-Native AI Experience

* Optimized for **Thai language**
* Natural Thai voice responses

### 🔗 Webhook-Based Intelligence

* Connect to backend workflows (e.g., n8n, APIs, LLMs)
* Easily customizable logic without changing frontend

### 🖥️ Multiple User Interfaces

* Streamlit app for rapid prototyping
* Lightweight web interface (HTML/JS/CSS)

---

## 🏗️ Project Structure

```bash
Tao_tun/
│
├── src/
│   ├── app/        # 🎤 Streamlit voice chatbot interface
│   ├── server/     # 🔊 Flask TTS server (gTTS)
│   └── web/        # 🌐 Web UI (HTML/JS/CSS)
│
├── data/audio/     # 📁 Temporary audio storage
├── scripts/        # ⚙️ Utility scripts
└── pyproject.toml  # 📦 Dependencies
```

---

## ⚙️ Tech Stack

* **Frontend**

  * Streamlit
  * HTML / CSS / JavaScript

* **Backend**

  * Flask (TTS server)
  * Webhook (n8n / API)

* **AI Components**

  * Speech Recognition (STT)
  * gTTS (Text-to-Speech)

---

## 🛠️ Getting Started

### 📌 Prerequisites

* Python 3.10+
* pip or uv

### 📥 Installation

```bash
git clone https://github.com/Eakkachad/Tao_tun.git
cd Tao_tun
pip install -e .
# or
uv sync
```

---

## ▶️ Run the System

### 🎤 Streamlit App

```bash
streamlit run src/app/main.py
```

### 🔊 TTS Server

```bash
python src/server/main.py
```

### 🌐 Web Interface

Open:

```
src/web/index.html
```

---

## 🔧 Configuration

Update webhook URL in source code:

```python
WEBHOOK_URL = "https://your-backend/webhook"
```

---

## 🔄 System Workflow

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

* 👵 Elderly assistance chatbot
* 🏥 Healthcare communication support
* 🏢 Customer service automation
* 📚 Educational AI assistant

---

## 🔮 Future Development

* LLM integration (OpenAI / Local models)
* Improved Thai NLP accuracy
* Mobile-friendly UI
* User authentication & analytics

---

## 📜 License

For educational and development purposes.

---

## 🙌 Acknowledgement

This project is part of the **Super AI Engineer Season 5 (SS5)** program, aiming to develop practical AI solutions for real-world impact in Thailand 🇹🇭

---

> “Empowering conversations with AI — for everyone.” 🤖✨
