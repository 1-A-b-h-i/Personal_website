# Personal Portfolio Website

A modern portfolio website for Abhinav Paidisetti built with React and Firebase.

## Project Structure

```
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
├── frontend/            # React frontend application
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # Service functions for API calls
│   │   ├── data/        # Static data files
│   │   └── ...
│   └── functions/       # Firebase Cloud Functions
│       ├── index.js     # JavaScript functions
│       └── main.py      # Python functions
└── scripts/             # Utility scripts
    ├── upload-firebase-data.js  # Data upload script
    └── website_data.json        # Website content data
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhinavpaidisetti/personal-website.git
   cd personal-website
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../frontend/functions && npm install
   cd ../..
   ```

3. Set up environment variables:
   - Create a `.env` file in the `frontend` directory
   - Add the following Firebase configurations:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
     REACT_APP_GEMINI_API_KEY=your_gemini_api_key
     ```

4. Run the development server:
   ```bash
   npm start
   ```

### Firebase Functions

This project uses Firebase Cloud Functions for the backend. To run the functions locally:

```bash
npm run dev:functions
```

### Deployment

Deploy to Firebase:

```bash
npm run deploy
```

## Features

- Responsive design
- Work experience showcase
- Projects portfolio
- Achievements section
- Blog with Markdown support
- Contact form
- AI-powered chat assistant
- Firebase authentication
- Firestore database

## Data Management

The website content is stored in Firebase Firestore. To update the content:

1. Edit the `scripts/website_data.json` file
2. Run the upload script:
   ```bash
   npm run upload
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- React
- Firebase
- Google Gemini AI
- React Router
- React Icons 