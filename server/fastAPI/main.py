from fastapi import FastAPI, UploadFile, File, Query
from parser import extract_text_from_pdf, extract_text_from_docx, extract_entities
import shutil
import os
import requests

app = FastAPI()

API_KEY='h_A75Sj_WqzTTwBfIq2TUA'

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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