from fastapi import APIRouter, UploadFile, File, Form
from typing import List
import shutil
import os

from schemas.submission_schema import SubmissionCreate, SubmissionUpdate
from services.submission_service import *

router = APIRouter(prefix="/api/submissions", tags=["Submissions"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# CREATE SUBMISSION
@router.post("/")
async def create_submission_api(
    event_id: str = Form(...),
    user_id: str = Form(...),
    description: str = Form(""),
    files: List[UploadFile] = File(...)
):
    file_urls = []

    for file in files:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_urls.append(file_path)

    data = SubmissionCreate(
        event_id=event_id,
        user_id=user_id,
        description=description
    )

    return await create_submission(data, file_urls)


# GET ALL
@router.get("/")
async def get_all():
    return await get_all_submissions()


# GET BY ID
@router.get("/{submission_id}")
async def get_one(submission_id: str):
    return await get_submission_by_id(submission_id)


# UPDATE
@router.put("/{submission_id}")
async def update(submission_id: str, data: SubmissionUpdate):
    return await update_submission(submission_id, data)


# DELETE
@router.delete("/{submission_id}")
async def delete(submission_id: str):
    return await delete_submission(submission_id)


# APPROVE
@router.put("/{submission_id}/approve")
async def approve(submission_id: str):
    return await approve_submission(submission_id, "manager_1")


# REJECT
@router.put("/{submission_id}/reject")
async def reject(submission_id: str, reason: str):
    return await reject_submission(submission_id, "manager_1", reason)