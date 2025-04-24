import pdfplumber
from docx import Document
import spacy
import re
from PIL import Image
import pytesseract
from pdf2image import convert_from_path

nlp = spacy.load("en_core_web_sm")


def extract_text_with_ocr(file_path):
    images = convert_from_path(file_path)
    return '\n'.join([pytesseract.image_to_string(img) for img in images])


def extract_text_from_pdf(file_path):
    with pdfplumber.open(file_path) as pdf:
        return '\n'.join([page.extract_text() for page in pdf.pages if page.extract_text()])


def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return '\n'.join([para.text for para in doc.paragraphs])


def extract_entities(text):
    doc = nlp(text)
    entities = {
        "NAME": None,
        "EMAIL": None,
        "PHONE": None,
        "EDUCATION": [],
        "EXPERIENCE": [],
        "SKILLS": []
    }

    # EMAIL
    email = re.findall(r'[\w\.-]+@[\w\.-]+', text)
    if email:
        entities["EMAIL"] = email[0]

    # PHONE
    phone = re.findall(r'\+?\d[\d\-\(\) ]{7,}\d', text)
    if phone:
        entities["PHONE"] = phone[0]

    # NAME (first PERSON label with <=4 words)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not entities["NAME"]:
            if len(ent.text.split()) <= 4:
                entities["NAME"] = ent.text.strip()

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    # EDUCATION
    education_keywords = [
        "university", "institute", "college", "school", "bachelor",
        "master", "b.tech", "m.tech", "phd", "cbse", "icse"
    ]
    for line in lines:
        if any(keyword in line.lower() for keyword in education_keywords):
            entities["EDUCATION"].append(line)

    # EXPERIENCE
    experience_keywords = [
        "intern", "developer", "engineer", "designer", "manager", "freelancer",
        "analyst", "project", "experience", "worked", "built", "developed"
    ]
    for line in lines:
        if any(keyword in line.lower() for keyword in experience_keywords):
            entities["EXPERIENCE"].append(line)

    # SKILLS
    skill_keywords = [
        "react", "django", "flask", "python", "java", "javascript", "mysql",
        "postgresql", "sqlite", "c++", "c/c++", "nextjs", "typescript", "git", "html", "css", "rest", "api"
    ]
    found_skills = set()
    for line in lines:
        for keyword in skill_keywords:
            if re.search(rf'\b{re.escape(keyword)}\b', line, re.IGNORECASE):
                found_skills.add(keyword.lower())
    entities["SKILLS"] = sorted(found_skills)

    return entities
