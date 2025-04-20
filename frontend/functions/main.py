# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import os
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
import google.generativeai as genai
import json
from flask import jsonify
from firebase_functions import config

# Initialize Firebase app
initialize_app()

# Get Gemini API key from Firebase config
firebase_config = config()
GEMINI_API_KEY = firebase_config.get('gemini', {}).get('key')

if not GEMINI_API_KEY:
    # Fallback to environment variable
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    
# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["POST"]
    )
)
def process_gemini_message(req: https_fn.Request) -> https_fn.Response:
    """
    Cloud Function to handle Gemini API requests.
    This keeps the API key secure on the server side.
    """
    # Check if request method is POST
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405,
            content_type="application/json"
        )
    
    # Get request data
    try:
        request_data = req.get_json()
        if not request_data:
            return https_fn.Response(
                json.dumps({"error": "No data provided"}),
                status=400, 
                content_type="application/json"
            )
        
        # Extract needed data
        user_message = request_data.get("message")
        history = request_data.get("history", [])
        system_prompt = request_data.get("systemPrompt", "")
        
        if not user_message:
            return https_fn.Response(
                json.dumps({"error": "No message provided"}),
                status=400,
                content_type="application/json"
            )
        
        # Initialize Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Create chat session with history
        chat = model.start_chat(history=history)
        
        # Add system prompt if provided
        if system_prompt:
            chat = model.start_chat(
                history=history,
                system_instruction=system_prompt
            )
        
        # Generate response
        response = chat.send_message(user_message)
        response_text = response.text
        
        # Return response
        return https_fn.Response(
            json.dumps({
                "response": response_text,
                "success": True
            }),
            status=200,
            content_type="application/json"
        )
    
    except Exception as e:
        # Handle any errors
        return https_fn.Response(
            json.dumps({
                "error": f"Error processing request: {str(e)}",
                "success": False
            }),
            status=500,
            content_type="application/json"
        )

#
#
# @https_fn.on_request()
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     return https_fn.Response("Hello world!")