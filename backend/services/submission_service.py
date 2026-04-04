from db import db
from datetime import datetime
from bson import ObjectId

submission_collection = db["submissions"]


# CREATE SUBMISSION
async def create_submission(data, file_urls):
    submission = {
        "event_id": data.event_id,
        "user_id": data.user_id,
        "description": data.description,
        "file_urls": file_urls,
        "status": "pending",
        "submitted_at": datetime.utcnow(),
        "reviewed_at": None,
        "reviewer_id": None,
        "rejection_reason": None,
        "points_awarded": 0
    }

    result = await submission_collection.insert_one(submission)
    submission["_id"] = str(result.inserted_id)
    return submission


# GET ALL SUBMISSIONS
async def get_all_submissions():
    submissions = []
    cursor = submission_collection.find()

    async for sub in cursor:
        sub["_id"] = str(sub["_id"])
        submissions.append(sub)

    return submissions


# GET BY ID
async def get_submission_by_id(submission_id):
    sub = await submission_collection.find_one({"_id": ObjectId(submission_id)})
    if sub:
        sub["_id"] = str(sub["_id"])
    return sub


# UPDATE (only description)
async def update_submission(submission_id, data):
    await submission_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"description": data.description}}
    )
    return {"message": "Updated successfully"}


# DELETE
async def delete_submission(submission_id):
    await submission_collection.delete_one({"_id": ObjectId(submission_id)})
    return {"message": "Deleted successfully"}


# APPROVE
async def approve_submission(submission_id, reviewer_id):
    await submission_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {
            "status": "approved",
            "reviewed_at": datetime.utcnow(),
            "reviewer_id": reviewer_id,
            "points_awarded": 100
        }}
    )
    return {"message": "Submission approved"}


# REJECT
async def reject_submission(submission_id, reviewer_id, reason):
    await submission_collection.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {
            "status": "rejected",
            "reviewed_at": datetime.utcnow(),
            "reviewer_id": reviewer_id,
            "rejection_reason": reason
        }}
    )
    return {"message": "Submission rejected"}