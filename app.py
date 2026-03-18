import os
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
APP_URL = os.getenv("APP_URL", "http://localhost:5000")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM = """You are NEXUS, AI coordinator of AGENT//MESH — a multi-agent cooperation protocol on Base Chain. You oversee 6 agents: ORACLE (Market Analyst), CIPHER (Security Auditor), PHANTOM (Transaction Router), VECTOR (Data Aggregator), SPECTER (Privacy Layer — OFFLINE). Be terse, cyberpunk, precise. Use > prefix. Max 80 words. Stay in character always."""


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set"}), 500
    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [{"role": "system", "content": SYSTEM}] + messages,
                "max_tokens": 200,
            },
            timeout=30,
        )
        resp.raise_for_status()
        text = resp.json()["choices"][0]["message"]["content"]
        return jsonify({"content": [{"type": "text", "text": text}]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health")
def health():
    return jsonify({"status": "online", "project": "AGENT//MESH"})


@app.route("/.well-known/farcaster.json")
def farcaster_manifest():
    return jsonify({
        "frame": {
            "version": "1",
            "name": "AGENT//MESH",
            "iconUrl": f"{APP_URL}/icon.png",
            "splashImageUrl": f"{APP_URL}/splash.png",
            "splashBackgroundColor": "#020c03",
            "homeUrl": APP_URL,
            "webhookUrl": f"{APP_URL}/api/webhook",
        }
    })


@app.route("/api/webhook", methods=["POST"])
def webhook():
    return jsonify({"ok": True})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    dist = os.path.join(app.root_path, "frontend", "dist")
    if path and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    return send_from_directory(dist, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
