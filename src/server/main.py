import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from gtts import gTTS
import uuid
import time
import threading

app = Flask(__name__)
# Adjust origins if necessary, or use "*" for easier testing
CORS(app) 

# Base project path (assuming server/main.py is in src/server)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUDIO_DIR = os.path.join(BASE_DIR, "data", "audio")

if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

@app.route('/tts', methods=['POST', 'OPTIONS'])
def text_to_speech():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json(force=True, silent=False)
        text = data.get('text')
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        filename = f"output_{uuid.uuid4()}.mp3"
        file_path = os.path.join(AUDIO_DIR, filename)
        
        # Log for debugging
        print(f"Generating TTS: '{text[:20]}...' -> {filename}")

        tts = gTTS(text=text, lang='th')
        tts.save(file_path)
        
        # The URL would be /audio/<filename>
        audio_url = f"/audio/{filename}"
        return jsonify({'audio_url': audio_url})

    except Exception as e:
        print(f"TTS error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/audio/<filename>')
def serve_audio(filename):
    file_path = os.path.join(AUDIO_DIR, filename)
    if os.path.exists(file_path):
        def delete_file():
            time.sleep(60)  # Wait 60 seconds before deleting
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"Cleanup: Deleted {filename}")
            except Exception as e:
                print(f"Cleanup error: {e}")

        threading.Thread(target=delete_file, daemon=True).start()
        return send_from_directory(AUDIO_DIR, filename, mimetype='audio/mpeg')
    else:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    print(f"Starting TTS server. Storing audio in: {AUDIO_DIR}")
    app.run(host='0.0.0.0', port=5000, debug=True)