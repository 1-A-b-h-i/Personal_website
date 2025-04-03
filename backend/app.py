from flask import Flask, jsonify, request, session
from flask_cors import CORS
import json
import os
import uuid
from rag_assistant import get_response as rag_get_response, clear_conversation

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))
CORS(app, supports_credentials=True)  # Enable CORS with credentials support

# Load data from JSON file
def load_data():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'data.json'), 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading data: {e}")
        return {
            "experience": [],
            "achievements": [],
            "blog_posts": [],
            "ai_responses": {}
        }

# Routes
@app.route('/api/experience', methods=['GET'])
def get_experience():
    data = load_data()
    return jsonify(data.get("experience", []))

@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    data = load_data()
    return jsonify(data.get("achievements", []))

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    data = load_data()
    return jsonify(data.get("blog_posts", []))

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    data = load_data()
    blog_posts = data.get("blog_posts", [])
    post = next((post for post in blog_posts if post["id"] == post_id), None)
    if post:
        return jsonify(post)
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/chat/session', methods=['GET'])
def get_session():
    """Create or retrieve a chat session ID."""
    if 'chat_session_id' not in session:
        session['chat_session_id'] = str(uuid.uuid4())
    
    return jsonify({
        "session_id": session['chat_session_id']
    })

@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    """Clear the current chat session history."""
    session_id = request.json.get('session_id')
    
    if not session_id and 'chat_session_id' in session:
        session_id = session['chat_session_id']
    
    if session_id:
        clear_conversation(session_id)
        return jsonify({"message": "Conversation history cleared"})
    
    return jsonify({"error": "No session ID provided"}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
    
    user_message = data['message']
    
    # Get session ID from request or create a new one
    session_id = data.get('session_id')
    if not session_id and 'chat_session_id' in session:
        session_id = session['chat_session_id']
    if not session_id:
        session_id = str(uuid.uuid4())
        session['chat_session_id'] = session_id
    
    try:
        # Use the RAG assistant to generate response with session ID
        response = rag_get_response(user_message, session_id)
        return jsonify({
            "response": response,
            "session_id": session_id
        })
    except Exception as e:
        print(f"Error generating response: {e}")
        # Fallback to basic responses if there's an error
        ai_data = load_data()
        ai_responses = ai_data.get("ai_responses", {})
        fallback_response = ai_responses.get("default", "I'm having trouble processing your request right now.")
        return jsonify({
            "response": fallback_response,
            "session_id": session_id
        })

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    
    # In a real application, you would validate the data and save it to a database
    # or send an email with the contact information
    
    # For now, just acknowledge receipt
    return jsonify({"message": "Contact information received successfully"})

if __name__ == '__main__':
    app.run(debug=True) 