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
            latest_id = firework.id
            await websocket.send_text(f'{{"id": {latest_id}}}')
    except WebSocketDisconnect:
        pass

@app.get("/api/fireworks")
async def get_fireworks(db: Session = Depends(database.get_db)):
    latest_firework = db.query(models.Firework).order_by(models.Firework.id.desc()).first()
    if latest_firework:
        return {"latest_id": latest_firework.id}
    return {"latest_id": None}

@app.get("/")
async def read_root():
    return {"Hello": "World"}