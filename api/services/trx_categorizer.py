import os
import json
from json_repair import repair_json

from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

chat_model = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.001,
    openai_api_key=os.getenv("OPENAI_API_KEY"),
)


def categorize_transaction(prompt_str, user_message):
    """
    Categorizes a financial transaction using GPT-4 and returns the parsed response.

    Parameters:
        prompt_str (str): The prompt template string.
        user_message (str): The user's transaction description.

    Returns:
        dict: Parsed JSON response from the model.
    """
    try:
        prompt_template = ChatPromptTemplate.from_template(prompt_str)
        prompt = prompt_template.format_messages(user_message=user_message)
        response = chat_model(prompt)

        response_dict = repair_json(response.content, return_objects=True)
        return response_dict
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse response JSON. Check the model output or input format."
        }
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}
