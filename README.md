# Personal Portfolio Website

A full-stack personal portfolio website with a React frontend and Flask backend.

## Project Structure

- **frontend/**: React-based frontend application
- **backend/**: Flask-based API backend

## Frontend

The frontend is built with React and includes:

- Modern UI with responsive design
- Portfolio sections (Experience, Achievements, Blog)
- Interactive components
- Contact form
- AI chat assistant integration

### Setup

```bash
cd frontend
npm install
npm start
```

The development server will run on [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
cd frontend
npm run build
```

## Backend

The backend is a Flask API that provides:

- Experience data
- Achievements data
- Blog posts
- AI assistant chat functionality
- Contact form submissions

### Setup

1. Install Python (3.7 or higher)

2. Create a virtual environment:
```bash
cd backend
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: 
   ```bash
   venv\Scripts\activate
   ```
   - Mac/Linux: 
   ```bash
   source venv/bin/activate
   ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Start the server:
```bash
python app.py
```

The API will be available at [http://localhost:5000](http://localhost:5000).

## API Endpoints

- **GET** `/api/experience` - Get all work experience entries
- **GET** `/api/achievements` - Get all achievements
- **GET** `/api/blog` - Get all blog posts
- **GET** `/api/blog/<post_id>` - Get a specific blog post by ID
- **POST** `/api/chat` - Send a message to the AI assistant
- **POST** `/api/contact` - Submit contact information

## Deployment

### Frontend
The frontend is configured for GitHub Pages deployment:
```bash
cd frontend
npm run deploy
```

### Backend
For production deployment, consider:
- Using a production WSGI server (Gunicorn)
- Setting up proper error handling and logging
- Implementing database storage instead of JSON files
- Adding authentication for admin functionality

## Development

To run the full stack locally:
1. Start the backend server
2. Start the frontend development server
3. The frontend will communicate with the backend API

## License

[MIT License](LICENSE) 