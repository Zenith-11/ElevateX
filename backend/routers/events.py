from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.event import EventCreate, EventUpdate, Event
import services.event_service as service

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("/")
async def get_all_events(
    department: Optional[str] = None,
    difficulty: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None
):
    return await service.list_events(department, difficulty, type, status)

@router.get("/{event_id}")
async def get_event(event_id: str):
    event = await service.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/")
async def create_event(event: EventCreate):
    return await service.create_event(event)

@router.put("/{event_id}")
async def update_event(event_id: str, event: EventUpdate):
    return await service.update_event(event_id, event)

@router.delete("/{event_id}")
async def delete_event(event_id: str):
    success = await service.delete_event(event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

@router.post("/{event_id}/join")
async def join_event(event_id: str):
    await service.join_event(event_id, "MockUserID")
    return {"message": "Successfully joined"}
