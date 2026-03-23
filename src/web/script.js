const textModeBtn = document.getElementById('textModeBtn');
const voiceModeBtn = document.getElementById('voiceModeBtn');
const inputArea = document.querySelector('.input-area');
const voiceControls = document.querySelector('.voice-controls');
const textInput = document.getElementById('textInput');
const sendTextBtn = document.getElementById('sendTextBtn');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const messagesDiv = document.getElementById('messages');
const statusMessageDiv = document.getElementById('statusMessage');
const ttsAudio = document.getElementById('ttsAudio');

// --- Your n8n Webhook URL ---
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/test';

// --- Python TTS Server URL ---
const TTS_SERVER_URL = 'http://localhost:5000/tts';

let currentMode = 'text'; // 'text' or 'voice'
let isSpeaking = false; // Track if audio is playing
let isRecognizing = false; // Track if speech recognition is active

// --- Web Speech API: Speech Recognition (STT) ---
let recognition;
let isRecognitionSupported = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'th-TH';
    isRecognitionSupported = true;

    recognition.onstart = () => {
        console.log('Voice recognition started...');
        isRecognizing = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        textInput.disabled = true;
        sendTextBtn.disabled = true;
        updateStatus('กำลังฟังเสียงของคุณ...');
    };

    recognition.onresult = (event) => {
        isRecognizing = false;
        const transcript = event.results[0][0].transcript;
        console.log('You said:', transcript);
        appendMessage('user', transcript);
        updateStatus('ได้รับข้อความแล้ว กำลังส่งไปหา n8n...');
        sendToN8nWebhook(transcript);
    };

    recognition.onerror = (event) => {
        isRecognizing = false;
        console.error('Speech recognition error:', event.error);
        let errorMessage = '';
        if (event.error === 'network') {
            errorMessage = 'ข้อผิดพลาดเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองอีกครั้ง';
        } else if (event.error === 'no-speech') {
            errorMessage = 'ไม่พบเสียงพูด กรุณาลองพูดใกล้ไมโครโฟน';
        } else if (event.error === 'not-allowed') {
            errorMessage = 'ไม่อนุญาตให้เข้าถึงไมโครโฟน โปรดอนุญาตในเบราว์เซอร์';
        } else {
            errorMessage = `เกิดข้อผิดพลาดในการรับเสียง: ${event.error}`;
        }
        updateStatus(errorMessage);
        startButton.disabled = false;
        stopButton.disabled = true;
        textInput.disabled = false;
        sendTextBtn.disabled = false;
    };

    recognition.onend = () => {
        if (isRecognizing) {
            console.log('Recognition ended unexpectedly.');
            updateStatus('หยุดฟัง กรุณาลองเริ่มใหม่');
        }
        isRecognizing = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        textInput.disabled = false;
        sendTextBtn.disabled = false;
    };

    // Test microphone access on initialization
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log('Microphone access granted');
            stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        })
        .catch(err => {
            console.error('Microphone access denied:', err);
            updateStatus('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตในเบราว์เซอร์');
            voiceModeBtn.disabled = true;
            voiceModeBtn.title = 'ไม่สามารถเข้าถึงไมโครโฟนได้';
        });
} else {
    voiceModeBtn.disabled = true;
    voiceModeBtn.title = 'โหมดเสียงไม่รองรับในเบราว์เซอร์นี้ กรุณาใช้ Chrome';
    console.warn('Web Speech API not supported. Voice mode disabled.');
    updateStatus('โหมดเสียงไม่รองรับในเบราว์เซอร์นี้ กรุณาใช้ Chrome');
}

// --- TTS using Python server ---
async function speakText(text) {
    if (currentMode !== 'voice' || !text || isSpeaking) { // Prevent multiple concurrent calls
        console.log('Not in voice mode, no text, or already speaking:', { mode: currentMode, text, isSpeaking });
        return;
    }

    try {
        updateStatus('กำลังสร้างเสียง...');
        console.log('Sending TTS request to:', TTS_SERVER_URL, 'with text:', text);

        // Reset audio element before new request
        ttsAudio.pause();
        ttsAudio.src = '';
        ttsAudio.removeAttribute('src'); // Ensure no lingering source
        ttsAudio.load(); // Reset the audio element

        const response = await fetch(TTS_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        console.log('TTS response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('TTS response data:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        // Set audio source and play
        ttsAudio.src = `http://localhost:5000${data.audio_url}`;
        console.log('Playing audio from:', ttsAudio.src);

        isSpeaking = true;
        updateStatus('บอทกำลังพูด...');

        ttsAudio.onended = () => {
            isSpeaking = false;
            updateStatus('พร้อมสำหรับคำสั่งต่อไป');
            ttsAudio.src = '';
            ttsAudio.removeAttribute('src');
            ttsAudio.load(); // Reset after playback
            console.log('Audio playback finished');
        };

        ttsAudio.onerror = (event) => {
            isSpeaking = false;
            console.error('Audio playback error:', event);
            updateStatus('ข้อผิดพลาดในการเล่นเสียง: ตรวจสอบคอนโซล');
            ttsAudio.src = '';
            ttsAudio.removeAttribute('src');
            ttsAudio.load(); // Reset to stop error loop
        };

        ttsAudio.play().catch(error => {
            console.error('Audio play error:', error);
            updateStatus('ไม่สามารถเล่นเสียงได้: ' + error.message);
            isSpeaking = false;
        });

    } catch (error) {
        console.error('TTS error:', error);
        isSpeaking = false;
        updateStatus(`ข้อผิดพลาดในการสร้างเสียง: ${error.message}`);
    }
}

// --- Helper function to add messages to chat window ---
function appendMessage(sender, text) {
    const p = document.createElement('p');
    p.classList.add(`${sender}-message`);
    p.textContent = text;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- Update status message ---
function updateStatus(message) {
    statusMessageDiv.textContent = message;
}

// --- Send message to n8n Webhook ---
async function sendToN8nWebhook(message) {
    if (!message.trim()) {
        updateStatus('กรุณากรอกข้อความ');
        return;
    }

    updateStatus('กำลังส่งข้อความ...');

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
            }),
        });

        const data = await response.json();
        console.log('Response from n8n:', data);

        // Adjust to handle n8n response structure
        let botResponse = '';
        if (typeof data === 'object') {
            const keys = Object.keys(data);
            if (keys.length > 0) {
                const firstKey = keys[0];
                botResponse = Array.isArray(data[firstKey]) && data[firstKey].length > 0 ? data[firstKey][0].output || data[firstKey][0][Object.keys(data[firstKey][0])[0]] : firstKey;
            } else {
                botResponse = JSON.stringify(data, null, 2);
            }
        } else {
            botResponse = data.toString();
        }
        appendMessage('bot', botResponse);

        if (currentMode === 'voice' && !isSpeaking) {
            await speakText(botResponse);
        }
        updateStatus('ได้รับคำตอบแล้ว');

    } catch (error) {
        console.error('Error sending to n8n webhook:', error);
        appendMessage('bot', `ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`);
        updateStatus(`ข้อผิดพลาด: ${error.message}`);
    }
}

// --- Mode Switching Logic ---
function setMode(mode) {
    currentMode = mode;
    ttsAudio.src = ''; // Stop any playing audio
    isSpeaking = false;

    if (mode === 'text') {
        textModeBtn.classList.add('active');
        voiceModeBtn.classList.remove('active');
        inputArea.style.display = 'flex';
        voiceControls.style.display = 'none';

        if (recognition && isRecognizing) {
            recognition.stop();
        }
        startButton.disabled = false;
        stopButton.disabled = true;
        textInput.disabled = false;
        sendTextBtn.disabled = false;
        updateStatus('อยู่ในโหมดพิมพ์');

    } else if (mode === 'voice') {
        if (!isRecognitionSupported) {
            alert('โหมดเสียงไม่รองรับในเบราว์เซอร์นี้ กรุณาใช้ Chrome');
            setMode('text');
            return;
        }
        textModeBtn.classList.remove('active');
        voiceModeBtn.classList.add('active');
        inputArea.style.display = 'none';
        voiceControls.style.display = 'flex';
        updateStatus('อยู่ในโหมดเสียง กด "เริ่มพูด" เพื่อเริ่ม');
    }
    console.log(`Switched to ${currentMode} mode.`);
}

// --- Event Listeners ---

// Text Mode
sendTextBtn.addEventListener('click', () => {
    const userMessage = textInput.value;
    if (userMessage) {
        appendMessage('user', userMessage);
        sendToN8nWebhook(userMessage);
        textInput.value = '';
    }
});

textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendTextBtn.click();
    }
});

// Voice Mode
startButton.addEventListener('click', () => {
    if (recognition && !isRecognizing) {
        console.log('Starting speech recognition...');
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            updateStatus('ไม่สามารถเริ่มการรู้จำเสียงได้: ' + error.message);
        }
    }
});

stopButton.addEventListener('click', () => {
    if (recognition && isRecognizing) {
        console.log('Stopping speech recognition...');
        recognition.stop();
        isRecognizing = false;
        updateStatus('หยุดฟัง');
    }
});

// Mode Switcher
textModeBtn.addEventListener('click', () => setMode('text'));
voiceModeBtn.addEventListener('click', () => setMode('voice'));
document.getElementById('testTTS').addEventListener('click', () => {
    speakText('ทดสอบ TTS ครับ');
});

// Initial setup
window.addEventListener('load', () => {
    if (N8N_WEBHOOK_URL === 'http://localhost:5678/webhook/test' && window.location.href.includes('localhost')) {
        updateStatus('โปรดตรวจสอบ N8N_WEBHOOK_URL ใน script.js หากไม่ใช่ค่าเริ่มต้น');
    } else {
        updateStatus('พร้อมใช้งาน');
    }

    setMode(currentMode);

    setTimeout(() => {
        if (currentMode === 'voice' && isRecognitionSupported) {
            speakText('สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?');
        } else {
            appendMessage('bot', 'สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?');
        }
    }, 500);
});

// Stop audio and recognition on page unload
window.addEventListener('beforeunload', () => {
    ttsAudio.src = '';
    if (recognition && isRecognizing) {
        recognition.stop();
    }
});