from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  # Import the CORS module

# Set the URL for the TensorZero service
TENSORZERO_URL = "http://localhost:3000/inference"

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all origins. You can customize it if needed (e.g., allowing specific origins).

def get_chatbot_response(user_input):
    """
    Function to get the response from the TensorZero service.
    """
    payload = {
        "function_name": "my_function_name",  # Replace with your actual function name in tensorzero.toml
        "input": {
	    "system" :"You are a medical professinal so answer the questions with outmost care and importance.You will be answering the questions for to elder peoples mostly suffering from alzheimer's or some memory lossing diseases",
            "messages": [
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        }
    }

    # Make a POST request to the TensorZero service
    response = requests.post(TENSORZERO_URL, headers={"Content-Type": "application/json"}, json=payload)

    # Check if the response from TensorZero is successful
    if response.status_code == 200:
        content = response.json().get('content', [])

        if content:
            return content[0]['text']
        else:
            return f"Error: {response.status_code}, no content in the response"
    else:
        return f"Error: {response.status_code}"

@app.route('/chat', methods=['POST'])
def chat():
    """
    Route that handles the POST request from the frontend and gets the chatbot response.
    """
    data = request.get_json()  # Get JSON data from the request
    user_input = data.get('message')  # Extract the message from the payload

    # Check if a message is provided
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400

    # Get the response from the chatbot
    bot_response = get_chatbot_response(user_input)
    
    # Return the response as JSON
    return jsonify({'response': bot_response})

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
