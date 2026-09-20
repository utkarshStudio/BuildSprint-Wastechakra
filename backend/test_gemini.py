import os, json, urllib.request, base64
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get('GEMINI_API_KEY', '').strip()
print("Using key starting with:", key[:10], "Length:", len(key))

img_path = r'media/waste_images/2026/09/06/food_waste1_getty.jpg'
with open(img_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

prompt = """Analyze all waste objects in this image. For each distinct item return JSON with:
1. "label": name of waste
2. "confidence": score between 0.70 and 0.99
3. "stream": exactly one of "RECYCLABLE", "RDF", "ORGANIC", "LANDFILL"
4. "rationale": 1 sentence explaining the stream
5. "box_2d": [ymin, xmin, ymax, xmax] in 0-1000 scale

Return strictly valid JSON:
{
  "objects": [{"label": "Food Scraps", "confidence": 0.95, "stream": "ORGANIC", "rationale": "Biodegradable organic matter.", "box_2d": [100, 100, 500, 500]}],
  "summary_points": ["Identified food waste."]
}
"""

payload = {
    'contents': [{
        'parts': [
            {'text': prompt},
            {'inline_data': {'mime_type': 'image/jpeg', 'data': b64}}
        ]
    }],
    'generationConfig': {'response_mime_type': 'application/json', 'temperature': 0.1}
}

for model in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3-flash-preview', 'gemini-flash-latest']:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}'
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read().decode('utf-8')
            print(model, "-> SUCCESS:", data[:300])
            break
    except Exception as e:
        print(model, "-> FAILED:", e)
