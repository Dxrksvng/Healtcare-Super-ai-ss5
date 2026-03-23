import requests
import json

# URL ของ webhook
webhook_url = "http://localhost:5678/webhook/9f59609c-6bbd-4677-8774-7d4708b8f6a6"

# ข้อมูลที่ต้องการส่ง
payload = {
    "message": "ควยบอท"
}

# ส่ง POST request ไปยัง webhook
try:
    response = requests.post(webhook_url, json=payload)
    if response.status_code == 200:
        print("ข้อความส่งสำเร็จ!")
    else:
        print(f"เกิดข้อผิดพลาด: {response.status_code} - {response.text}")
except Exception as e:
    print(f"เกิดข้อผิดพลาด: {str(e)}")