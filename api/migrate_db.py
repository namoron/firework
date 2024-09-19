from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from api.database import Base
import asyncio
from api.config import Settings
settings = Settings()

ASYNC_DB_URL = settings.SQLALCHEMY_DATABASE_URI
# PostgreSQL + asyncpg の接続URL

# 非同期エンジンの作成
async_engine = create_async_engine(ASYNC_DB_URL, echo=True)

# 非同期セッションの作成
async_session = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# データベースをリセットする非同期関数
async def reset_database():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

# メイン関数
async def main():
    await reset_database()

if __name__ == "__main__":
    asyncio.run(main())