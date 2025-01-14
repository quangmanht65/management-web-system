import redis.asyncio as aioredis

from src.config import Settings

JTI_SETTINGS = 3600

token_blocklists = aioredis.from_url(Settings.REDIS_URL)

async def add_token_to_blocklist(jti: str) -> None:
    await token_blocklists.set(jti, value="", ex=JTI_SETTINGS)

async def is_token_revoked(jti: str) -> bool:
    jti = await token_blocklists.get(jti)

    return jti is not None