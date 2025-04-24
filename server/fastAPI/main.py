<<<<<<< HEAD
from fastapi import FastAPI, UploadFile, File, Query
=======
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
>>>>>>> 26d127a2e3d3e905d520a50832625de403658e5b
from parser import extract_text_from_pdf, extract_text_from_docx, extract_entities
import shutil
import os
import requests
<<<<<<< HEAD

app = FastAPI()

API_KEY='h_A75Sj_WqzTTwBfIq2TUA'
=======
from dotenv import load_dotenv
from google import genai
import json
import re

load_dotenv()

app = FastAPI()

API_KEY=os.getenv("LINKEDIN_API_KEY")
>>>>>>> 26d127a2e3d3e905d520a50832625de403658e5b

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

<<<<<<< HEAD
=======
# ── Gemini setup ─────────────────────────────────────────────
GEN_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEN_API_KEY:
    raise RuntimeError("Set the GEMINI_API_KEY environment variable.")

client = genai.Client(api_key=GEN_API_KEY)   # or the model name you prefer

>>>>>>> 26d127a2e3d3e905d520a50832625de403658e5b
@app.post("/parse-resume/")
async def parse_resume(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_location)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_location)
    else:
        return {"error": "Unsupported file format. Use PDF or DOCX."}

    result = extract_entities(text)
    return result

<<<<<<< HEAD
=======
@app.get("/industry/")
async def industry(industry: str = Query(..., min_length=2,
                                         description="e.g. “software”, “pharmaceuticals”")):
    """
    Analyze the current state of the <industry> industry and return structured
    insights *strictly* in the required JSON format.
    """

    prompt = f"""
Analyze the current state of the {industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{{
  "salaryRanges": [
    {{ "role": "string", "min": number, "max": number, "median": number, "location": "string" }}
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}}

IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
Include at least 5 common roles for salary ranges.
Growth rate should be a percentage.
Include at least 5 skills and trends.
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")

    # Gemini sometimes wraps JSON in markdown fences; strip them defensively
    text = response.text.strip()
    if text.startswith("```"):
        text = text.lstrip("`").split("```")[0].strip()

    return gemini_to_json(text)

def gemini_to_json(raw: str):
    """
    Strip fences / labels / prose and return the first valid
    JSON object or array in the string.
    """
    # 1  Remove ``` fences (```json … ``` or ``` … ```)
    cleaned = re.sub(r"```(?:json)?\s*([\s\S]*?)```", r"\1", raw, flags=re.I)

    # 2  Drop a leading “json\n” label if present
    if cleaned.lstrip().lower().startswith("json"):
        cleaned = cleaned.split("\n", 1)[1]

    cleaned = cleaned.strip()

    # 3  If the whole thing is valid JSON, we’re done
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # 4  Otherwise find the first { or [ and balance braces/brackets
    open_pos = re.search(r"[\{\[]", cleaned)
    if not open_pos:
        raise ValueError("No JSON object found in Gemini reply")

    open_ch = cleaned[open_pos.start()]
    close_ch = "}" if open_ch == "{" else "]"
    depth = 0
    for i, ch in enumerate(cleaned[open_pos.start():], start=open_pos.start()):
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                candidate = cleaned[open_pos.start(): i + 1]
                return json.loads(candidate)

    raise ValueError("Could not parse JSON block from Gemini reply")


>>>>>>> 26d127a2e3d3e905d520a50832625de403658e5b
@app.get("/check-profile/")
async def check_profile(profile_url: str = Query(..., description="LinkedIn Profile URL")):
    headers = {'Authorization': 'Bearer ' + API_KEY}
    api_endpoint = 'https://nubela.co/proxycurl/api/v2/linkedin'
    params = {
        'linkedin_profile_url': profile_url,
        'skills': 'include',
        'github_profile_id': 'include',
        'use_cache': 'if-present',
        'fallback_to_cache': 'on-error',
    }

    response = requests.get(api_endpoint, params=params, headers=headers)

    if response.status_code == 200:
        profile_data = response.json()
        return {
            "profile_url": profile_url,
            "skills": profile_data.get("skills", [])
        }
    else:
        return {
            "error": "Failed to fetch profile data",
            "status_code": response.status_code
        }