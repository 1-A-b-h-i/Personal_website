# Personal Portfolio Website

A modern portfolio website for Abhinav Paidisetti built with React.

## Project Structure

```
├── frontend/            # React frontend application
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── ...
└── scripts/             # Utility scripts
    └── website_data.json        # Website content data
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhinavpaidisetti/personal-website.git
   cd personal-website
   ```

2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ..
   ```

3. Run the development server:
   ```bash
   npm start
   ```

### Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

## Features

- Responsive design
- Work experience showcase
- Projects portfolio
- Achievements section
- Contact form
- Static data management

## Data Management

The website content is stored in `scripts/website_data.json`. To update the content, simply edit this file and rebuild the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- React
- React Router
- React Icons 