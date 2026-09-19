import os, json, urllib.request, base64
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get('GEMINI_API_KEY', '').strip()
print("Using key starting with:", key[:10], "Length:", len(key))

img_path = r'c:\Users\utkar\OneDrive\Desktop\WasteChakra\frontend\public\images\hero-truck.jpg'
with open(img_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

payload = {
    'contents': [{
        'parts': [
            {'text': 'Identify the object in this image. Return valid JSON with keys label and confidence.'},
            {'inline_data': {'mime_type': 'image/jpeg', 'data': b64}}
        ]
    }],
    'generationConfig': {'response_mime_type': 'application/json'}
}

for model in ['gemini-flash-latest', 'gemini-3-flash-preview', 'gemini-pro-latest']:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}'
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(model, "-> SUCCESS:", resp.read().decode('utf-8')[:200])
            break
    except Exception as e:
        print(model, "-> FAILED:", e)
