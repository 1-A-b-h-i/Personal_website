# Personal Website Backend

A Flask-based backend API for Abhinav's personal website.

## Setup

1. Install Python (3.7 or higher)

2. Create a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: 
   ```
   venv\Scripts\activate
   ```
   - Mac/Linux: 
   ```
   source venv/bin/activate
   ```

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Run the development server:
```
python app.py
```

The server will run on http://localhost:5000 by default.

## API Endpoints

### Experience
- GET `/api/experience` - Get all work experience entries

### Achievements
- GET `/api/achievements` - Get all achievements

### Blog
- GET `/api/blog` - Get all blog posts
- GET `/api/blog/<post_id>` - Get a specific blog post by ID

### AI Assistant
- POST `/api/chat` - Send a message to the AI assistant
  - Request body: `{ "message": "your message here" }`
  - Response: `{ "response": "AI response here" }`

### Contact
- POST `/api/contact` - Submit contact information
  - Request body: Contact form data

## Production Deployment

For production deployment, consider:
- Using a production WSGI server like Gunicorn
- Setting up proper error handling and logging
- Implementing database storage for data
- Adding authentication for admin functionality 