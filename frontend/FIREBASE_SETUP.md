# Firebase Setup for Personal Productivity Tab

This guide will help you set up Firebase to power the Productivity tab in your portfolio website.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "portfolio-productivity")
4. Enable Google Analytics if desired (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. From the Firebase project dashboard, click the web icon (</>) to add a web app
2. Give your app a nickname (e.g., "Portfolio Website")
3. Check "Also set up Firebase Hosting" if you want to host your site on Firebase (optional)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need this for the `.env` file

## Step 3: Set Up Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose either "Start in production mode" or "Start in test mode" (For personal use, test mode is fine)
4. Select a location for your Firestore database
5. Click "Enable"

## Step 4: Configure Security Rules

1. In the Firestore Database section, go to the "Rules" tab
2. Update the rules to secure your data. For personal use, you can use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For a more secure setup:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todo} {
      allow read, write: if request.auth != null;
    }
    match /deadlines/{deadline} {
      allow read, write: if request.auth != null;
    }
    match /assistant_messages/{message} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Configure Environment Variables

1. Open the `.env` file in the root of your project
2. Fill in the Firebase configuration values:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 6: Set Up Gemini API

1. Go to the [Google AI Studio](https://ai.google.dev/) and create an account if you don't have one
2. Navigate to the API keys section
3. Create a new API key
4. Add it to your `.env` file:

```
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

## Step 7: Install and Deploy

1. Install the Firebase tools: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Select Firestore, Hosting, and Functions features
5. Choose your Firebase project
6. Deploy: `firebase deploy`

## Usage

Your Productivity tab is now set up with:

- **Task Management**: Add, edit, and track tasks with priority levels
- **Deadlines**: Keep track of important upcoming dates
- **Personal Assistant**: A smart AI assistant that remembers your conversations and helps you stay organized

The data is stored in Firebase and persists across sessions and devices.

## Troubleshooting

- **Firebase Connection Issues**: Make sure your API keys are correct in the `.env` file
- **CORS Errors**: Check Firebase security rules and ensure cross-origin access is allowed
- **API Limits**: The Gemini API has usage limits - check your quota if the assistant stops responding 