import streamlit as st
import speech_recognition as sr
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play
import tempfile
import threading
import requests
import os

# Set up page
st.set_page_config(page_title="Tao Tun Chatbot", layout="centered", page_icon="🤖")
st.title("🤖 Tao Tun: Thai Chatbot")
st.markdown("ระบบแชทบอทภาษาไทย รองรับทั้งการพิมพ์และพูด")

# Webhook URL (Change this to your n8n URL)
WEBHOOK_URL = "http://localhost:5678/webhook/test"

# Base directory for temporary audio if needed
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUDIO_CACHE = os.path.join(BASE_DIR, "data", "audio")

if not os.path.exists(AUDIO_CACHE):
    os.makedirs(AUDIO_CACHE)

def speak(text):
    """Generate and play speech from text locally using gTTS and pydub."""
    def _speak():
        try:
            filename = f"temp_speech_{uuid.uuid4()}.mp3" if 'uuid' in globals() else "temp_speech.mp3"
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
                tts = gTTS(text=text, lang='th')
                tts.save(f.name)
                sound = AudioSegment.from_mp3(f.name)
                play(sound)
                os.unlink(f.name)
        except Exception as e:
            print(f"Speak error: {e}")
            
    threading.Thread(target=_speak, daemon=True).start()

def listen():
    """Listen for audio from the microphone and convert to text."""
    recognizer = sr.Recognizer()
    try:
        mic = sr.Microphone()
    except Exception as e:
        st.error(f"❌ Microphone error: {e}")
        return ""
    
    with mic as source:
        st.info("🎙️ กำลังฟัง... (พูดได้เลย)")
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            text = recognizer.recognize_google(audio, language="th-TH")
            return text
        except sr.WaitTimeoutError:
            st.warning("⚠️ เงียบเกินไป ไม่ได้รับเสียง")
            return ""
        except sr.UnknownValueError:
            st.warning("⚠️ ไม่เข้าใจเสียงที่พูด")
            return ""
        except Exception as e:
            st.error(f"⚠️ Error: {e}")
            return ""

def call_webhook(message):
    """Send message to n8n webhook and get response."""
    try:
        res = requests.post(WEBHOOK_URL, json={"text": message}, timeout=10)
        if res.status_code == 200:
            # Handle both list and object responses common in n8n
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("text", str(data[0]))
            return data.get("text", str(data))
        return f"Error: Status code {res.status_code}"
    except Exception as e:
        return f"[Webhook error] {e}"

# Chat History Logic
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Display Chat History
st.markdown("### 📜 ประวัติการสนทนา")
chat_container = st.container()
with chat_container:
    for role, text in st.session_state.chat_history:
        with st.chat_message("user" if role == "👤" else "assistant"):
            st.write(text)

# Input Section
st.markdown("---")

# Text Input
user_input = st.chat_input("พิมพ์ข้อความที่นี่...")
if user_input:
    st.session_state.chat_history.append(("👤", user_input))
    with st.chat_message("assistant"):
        with st.spinner("กำลังคิด..."):
            bot_reply = call_webhook(user_input)
            st.write(bot_reply)
            st.session_state.chat_history.append(("🤖", bot_reply))
            speak(bot_reply)
    st.rerun()

# Voice Input
col1, col2 = st.columns([1, 4])
with col1:
    if st.button("🗣️ กดเพื่อพูด"):
        text = listen()
        if text:
            st.session_state.chat_history.append(("👤", text))
            with st.chat_message("assistant"):
                with st.spinner("กำลังคิด..."):
                    bot_reply = call_webhook(text)
                    st.write(bot_reply)
                    st.session_state.chat_history.append(("🤖", bot_reply))
                    speak(bot_reply)
            st.rerun()
