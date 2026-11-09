
import os
import json
from google import genai
from google.genai import types


def analyze_crop_image(image_bytes, mime_type):

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing from .env")

    client = genai.Client(api_key=api_key)

    prompt = """
    You are an agricultural crop disease advisory assistant.

    Examine the uploaded crop leaf image.

    Return ONLY valid JSON with these fields:

    {
        "crop": "crop name",
        "disease": "suspected disease name",
        "confidence": 85,
        "severity": "Low, Medium, High or Unknown",
        "symptoms": "visible symptoms",
        "treatment": "recommended treatment",
        "prevention": "preventive measures"
    }

    Rules:
    - Do not invent a disease if the image is unclear.
    - If the image is not a plant leaf, say so.
    - Confidence must be a number from 0 to 100.
    - If uncertain, use Unknown for severity.
    - Give practical and safe agricultural advice.
    - Do not claim laboratory-confirmed diagnosis.
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2
        )
    )

    result = json.loads(response.text)

    return result
