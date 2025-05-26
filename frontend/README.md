# Portfolio Website

A modern personal portfolio website built with React featuring a clean, responsive design.

## Features

- Experience/Work History
- Projects/Achievements  
- Contact Form
- Responsive design for all screen sizes
- Fast static site performance

## Architecture

This is a static React application that:

- **GitHub Pages Hosting**: Serves the React frontend
- **Static Data**: All content stored in JSON files
- **No Backend Dependencies**: Fully client-side application

## Setup & Development

### Prerequisites

- Node.js and npm

### Steps to Run Locally

1. Clone the repository
   ```
   git clone <repository-url>
   cd Personal_website/frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start development server
   ```
   npm start
   ```

4. Build for production
   ```
   npm run build
   ```

## Deployment

Deploy to GitHub Pages:
```
npm run deploy
```

## Updating Content

To update website content:

1. Edit the JSON files in the `src/data/` directory
2. Rebuild and deploy the application

## Project Structure

```
src/
├── components/         # React components
├── pages/             # Page components  
├── data/              # Static data files
└── ...
```
