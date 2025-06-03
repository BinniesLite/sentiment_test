from fastapi import FastAPI
from transformers import pipeline
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


pipe = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment-latest")

class TextInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/analyze")
def analyze_text(input_data: TextInput):
    result = pipe(input_data.text)
    
    return result[0]['label']
