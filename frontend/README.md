# Portfolio Website - Serverless Version

This is a serverless implementation of a personal portfolio website using Firebase's free tier.

## Features

- Experience/Work History
- Projects/Achievements
- Blog/Articles
- AI-powered Chat Assistant (using Firestore and client-side API calls)
- Contact Form 

## Architecture

This project uses a completely serverless architecture:

- **Firebase Hosting**: Serves the React frontend
- **Firebase Firestore**: Stores all website data and chat history
- **Firebase Authentication**: (Optional) For admin authentication
- **Client-side API Integration**: For AI features and dynamic content

## Setup & Deployment

### Prerequisites

- Node.js and npm
- Firebase CLI (`npm install -g firebase-tools`)

### Steps to Deploy

1. Clone the repository
   ```
   git clone <repository-url>
   cd Personal_website
   ```

2. Install dependencies
   ```
   cd frontend
   npm install
   ```

3. Log in to Firebase
   ```
   firebase login
   ```

4. Initialize Firebase (if not already done)
   ```
   firebase init
   ```
   - Select Firestore and Hosting
   - Choose your Firebase project
   - Accept default for Firestore rules
   - Set `build` as public directory
   - Configure as a single-page app

5. Build the frontend
   ```
   npm run build
   ```

6. Deploy to Firebase
   ```
   firebase deploy
   ```

## Updating Content

There are two ways to update website content:

1. **Admin Dashboard**: Implement an admin dashboard with authentication
2. **Direct Firestore Updates**: Use Firebase Console to update content in the `website_data` collection

## Environment Variables

Create a `.env` file in the frontend directory with these variables:

```
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

## Security Notes

- Be careful with API key usage in client-side code
- Consider using Firebase Security Rules to restrict access
- For production, implement rate limiting and additional security measures
- Consider Firebase Auth for protected admin features
