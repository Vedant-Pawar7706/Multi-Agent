import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.api.routes import auth, trips, planning, export, demo

# Auto-create tables if running in simple SQLite mode
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Autonomous Multi-Agent Travel Planning Platform API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins and "*" not in origins else ["*"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include Router Modules
app.include_router(auth.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(planning.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(demo.router, prefix="/api")

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "llm_provider": settings.LLM_PROVIDER,
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
