from fastapi import FastAPI
from app.database import engine
from app.models import user, message
from app.api import auth, message

# Create all database tables
user.Base.metadata.create_all(bind=engine)
message.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth.router)
app.include_router(message.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AnoChat API"}
