from pydantic import BaseModel


class CategorizeRequest(BaseModel):
    message: str
