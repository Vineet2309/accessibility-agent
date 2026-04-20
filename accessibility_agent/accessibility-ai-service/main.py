from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os
from dotenv import load_dotenv
import traceback
import requests
# --- LangChain Imports (For Health Chat) ---
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import SystemMessage, HumanMessage

# --- Raw Hugging Face Import (For Vision Scanner) ---
from huggingface_hub import InferenceClient

# Load environment variables
load_dotenv()

# Initialize FastAPI App
app = FastAPI(title="Accessibility AI Brain - Full Stack Edition")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. LANGCHAIN CHAT SETUP (Health Hub)
# ==========================================
# Connect to Zephyr for fast conversational AI
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    huggingfacehub_api_token=os.environ.get("HF_TOKEN"),
    max_new_tokens=500
)
# Wrap it so it understands SystemMessage and HumanMessage
chat_model = ChatHuggingFace(llm=llm)


# ==========================================
# 2. HUGGING FACE VISION SETUP (Scanner)
# ==========================================
# Use the raw client for simple, fast image processing
hf_client = InferenceClient(token=os.environ.get("HF_TOKEN"))


# ==========================================
# DATA MODELS
# ==========================================
class HealthQuery(BaseModel):
    message: str

class VisionQuery(BaseModel): 
    image_base64: str
    prompt: str = "Describe this image." # Default prompt

class SummaryQuery(BaseModel):
    text: str

# ==========================================
# FASTAPI ROUTES
# ==========================================

# 1. Health Chat Route (Using LangChain)
@app.post("/api/ai/health")
async def process_health_query(query: HealthQuery):
    """Handles health questions using LangChain and Hugging Face."""
    try:
        messages = [
            SystemMessage(content="You are an empathetic, concise, and highly accurate health assistant designed for visually impaired users. Provide clear, step-by-step answers. Always remind users to consult a real doctor for serious conditions."),
            HumanMessage(content=query.message)
        ]
        
        response = chat_model.invoke(messages)
        
        # Extract content from LangChain's AIMessage object
        return {"reply": response.content}
        
    except Exception as e:
        print(f"Error in LangChain AI: {e}")
        raise HTTPException(status_code=500, detail="Failed to process AI chat request")
    
@app.post("/api/ai/voiceCommand")
async def process_query(query: HealthQuery):
    """Handles voice based questions using LangChain and Hugging Face."""
    try:
        messages = [
            SystemMessage(content="You are an empathetic, concise, and highly accurate conversational assistant designed for visually impaired users. Provide clear, step-by-step answers. If user ask any health related query,then always remind users to consult a real doctor for serious conditions."),
            HumanMessage(content=query.message)
        ]
        
        response = chat_model.invoke(messages)
        
        # Extract content from LangChain's AIMessage object
        return {"reply": response.content}
        
    except Exception as e:
        print(f"Error in LangChain AI: {e}")
        raise HTTPException(status_code=500, detail="Failed to process AI chat request")


# 2. Vision Scanner Route (Using Direct API Request)
@app.post("/api/ai/vision")
async def process_vision_query(query: VisionQuery):
    """Uses Qwen 3.6 via the Hugging Face Chat Completions API."""
    try:
        # 1. Clean the Base64 string from React
        base64_string = query.image_base64
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
            
        # 2. Format it into a Data URI (Required for Chat Models)
        data_uri = f"data:image/jpeg;base64,{base64_string}"
        
        # 3. Build the Multimodal Chat Message payload
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": "You are assisting a visually impaired user. "
                        "Please describe the scene in this image clearly and concisely,provide the summary for it."
                        "If there is any readable text, read it out.If there is any question then, provide the answer."
                        "If there is any medicinal product, then tell about its features and when to use and always remind the users to consult a real doctor before any medicin usage."
                    },
                    {
                        "type": "image_url", 
                        "image_url": {"url": data_uri}
                    }
                ]
            }
        ]
        
        # 4. Hit the Model
        # WARNING: This requires a paid HF Endpoint or a very lucky free tier day!
        response = hf_client.chat_completion(
            model="google/gemma-4-26B-A4B-it",
            messages=messages,
        )
        
        # Extract the AI's spoken answer
        caption = response.choices[0].message.content
        
        return {"analysis": caption}
        
    except Exception as e:
        print("\n========== VISION ERROR ==========")
        import traceback
        traceback.print_exc()
        print("=======================================\n")
        
        error_msg = str(e)
        if "too large" in error_msg.lower() or "requires a pro subscription" in error_msg.lower():
            raise HTTPException(status_code=402, detail="model is too massive for the free Hugging Face API.")
            
        raise HTTPException(status_code=500, detail=f"AI Error: {error_msg}")
@app.post("/api/ai/summarize")
async def process_summary_query(query: SummaryQuery):
    """Summarizes long text into a podcast-style script."""
    try:
        messages = [
            SystemMessage(content="You are an expert audio-book narrator and editor. Your job is to take the user's text and summarize it into a clear, engaging, and easy-to-listen-to script. Remove filler, highlight key points, and use a conversational tone. Do not use complex markdown formatting, as this will be read aloud by a text-to-speech engine."),
            HumanMessage(content=f"Please summarize this text for an audio format: {query.text}")
        ]
        
        response = chat_model.invoke(messages)
        return {"summary": response.content}
        
    except Exception as e:
        print(f"Error in Summarization AI: {e}")
        raise HTTPException(status_code=500, detail="Failed to summarize text")
# Health Check Route
@app.get("/")
def read_root():
    return {"status": "AI Brain is online (LangChain Chat & HF Vision active)!"}