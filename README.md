# AccessAgent: Full-Stack AI Accessibility Suite

A next-generation accessibility platform designed to break down barriers to digital information. Powered by React, Node.js, Python (FastAPI), and cutting-edge LLMs (Gemini & Hugging Face).

## Core Features

* **Accessible Voice:** A hands-free voice command interface.
* **Vision Scanner:** AI-powered image analysis and prescription decoding (via Google Gemini).
* **Health Hub:** An intelligent medical assistant and symptom checker.
* **Audio-Bookify:** Instantly converts documents, text, and PDFs into playable audio podcasts.
* **Bionic Reading Converter:** Transforms standard text into a dyslexia-friendly format using artificial fixation points.

---

## System Architecture

This project is structured as a Monorepo containing three isolated microservices:

1.  **/frontend**: The User Interface. Built with React, Vite, and Tailwind CSS.
2.  **/node-server**: The real-time backend. Built with Node.js, Express, and Socket.io.
3.  **/python-server**: The AI inference engine. Built with Python, FastAPI, LangChain, and Hugging Face.

---

## Getting Started (Local Development)

### Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v18 or higher)
* Python (3.9 or higher)
* Git

### 1. Clone the Repository
```bash
git clone [https://github.com/Vineet2309/accessibility-agent.git](https://github.com/Vineet2309/accessibility-agent.git)
cd accessibility-agent
```
2. Setup the Python AI Backend
The Python server handles heavy AI processing, Vision parsing, and LLM orchestration.

```Bash
cd python-server
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```
Environment Variables (python-server/.env):
Create a .env file in the python-server folder:

GEMINI_API_KEY=your_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here
PORT=8000

Run the server:
```
Bash
uvicorn main:app --reload --port 8000
```

3. Setup the Node.js Backend
The Node server handles real-time socket connections and secondary API routing.

```Bash
cd ../node-server
npm install
```
Environment Variables (node-server/.env):
Create a .env file in the node-server folder:

PORT=5000
Run the server:

```Bash
npm start
```

4. Setup the React Frontend
The frontend features a fully responsive, dual-tone UI design.
```
Bash
cd ../frontend
npm install
```

Run the app:

```Bash
npm run dev
```
