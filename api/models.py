from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class Firework(Base):
    __tablename__ = "fireworks"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, index=True)
    count = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Firework(id={self.id}, client_id={self.client_id}, count={self.count})>"