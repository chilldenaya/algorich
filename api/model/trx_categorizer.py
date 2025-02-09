from pydantic import BaseModel


class CategorizeRequest(BaseModel):
    message: str


class CategorizeResponse(BaseModel):
    type: str
    category: str
    value: float
    description: str
    location: str
