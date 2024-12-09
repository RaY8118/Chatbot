import requests
import json

# Define the endpoint URL for TensorZero inference
TENSORZERO_URL = "http://localhost:3000/inference"

def get_chatbot_response(user_input):
    # Prepare the payload for the request
    payload = {
        "function_name": "chatbot",  # Match the function name in tensorzero.toml
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        }
    }

    # Make the POST request to TensorZero
    response = requests.post(TENSORZERO_URL, headers={"Content-Type": "application/json"}, json=payload)

    if response.status_code == 200:
        # Check if 'content' is present and not empty
        content = response.json().get('content', [])
        if content:
            return content[0]['text']  # Extract text from the first content item
        else:
            return "Sorry, I couldn't generate a response for that."
    else:
        return f"Error: {response.status_code} - {response.text}"

def main():
    print("Welcome to the Chatbot! Type 'exit' or 'quit' to end the conversation.")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            break
        
        bot_response = get_chatbot_response(user_input)
        print(f"Bot: {bot_response}")

if __name__ == "__main__":
    main()