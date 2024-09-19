from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import models, database

app = FastAPI()

app.mount("/static", StaticFiles(directory="api/static"), name="static")

@app.on_event("startup")
async def startup():
    await database.create_tables()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(database.get_db)):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            count = int(data)
            firework = models.Firework(client_id=str(id(websocket)), count=count)
            db.add(firework)
            db.commit()
            await websocket.send_text(f"Fireworks: {count}")
    except WebSocketDisconnect:
        pass

@app.get("/")
async def read_root():
    return {"Hello": "World"}