import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';


// Initialize environment variables
dotenv.config();

// Setup Express and HTTP Server
const app = express();
const server = http.createServer(app);

// Increase JSON limit because Base64 image strings from the frontend are very large
app.use(express.json({ limit: '50mb' })); 
app.use(cors({
    origin: 'http://localhost:5173', // Your React frontend URL
    methods: ['GET', 'POST']
}));

// Initialize Socket.io for Real-Time Voice Streaming
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Initialize Gemini Client
//const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ==========================================
// REST API ROUTES (Forwarding to Python)
// ==========================================

// 1. Health Hub Route
app.post('/api/health-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Forward the request to Python FastAPI
        const pythonResponse = await fetch('http://localhost:8000/api/ai/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await pythonResponse.json();
        res.json({ reply: data.reply });
        
    } catch (error) {
        console.error("Error communicating with Python:", error);
        res.status(500).json({ error: "Failed to reach AI Brain" });
    }
});

// 2. Vision Scanner Route
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        
        // Forward the Base64 string to Python FastAPI
        const pythonResponse = await fetch('http://localhost:8000/api/ai/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: imageBase64 })
        });
        
        const data = await pythonResponse.json();
        res.json({ analysis: data.analysis });
        
    } catch (error) {
        console.error("Error communicating with Python:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

// ==========================================
// WEBSOCKETS (For Real-Time Voice Agent)
// ==========================================

io.on('connection', (socket) => {
    console.log(`New client connected for voice streaming: ${socket.id}`);

    // Listen for speech transcripts from the React VoiceAgent component
    socket.on('speech_input', (data) => {
        console.log("Real-time speech received:", data.text);
        
        // TODO: Process intent or route to AI
        
        // Send a response back to the frontend instantly
        socket.emit('agent_response', { reply: `I heard you say: ${data.text}` });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Accessibility Backend running on http://localhost:${PORT}`);
});