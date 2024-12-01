from fastapi import FastAPI, HTTPException

from api.model.trx_categorizer import CategorizeRequest
from .services.trx_categorizer import categorize_transaction
from .services.prompt import prompt_str

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


@app.post("/api/py/categorize")
def categorize_transaction_endpoint(request: CategorizeRequest):
    try:
        result = categorize_transaction(prompt_str, request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/py/health")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}
