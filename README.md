Gift Recommender 🎁
An intelligent AI-powered web application that delivers personalized gift recommendations tailored to recipient preferences, personality traits, and special occasions.
Built with modern web technologies and powered by Gemini AI, this application provides real-time, data-driven gift suggestions through an intuitive questionnaire interface.
🌟 Live Demo
Try the Gift Recommender App →
Experience personalized gift recommendations powered by AI in real-time.
✨ Key Features
🎯 Intelligent Recommendations

AI-Powered Analysis: Leverages Gemini AI for sophisticated gift matching algorithms
Personalization Engine: Considers recipient personality, interests, and relationship dynamics
Occasion-Specific: Tailored suggestions for birthdays, holidays, anniversaries, and more

👤 User Experience

Interactive Questionnaire: Intuitive step-by-step preference collection
Recipient Profiles: Save and manage multiple recipient preferences
Responsive Design: Seamless experience across desktop, tablet, and mobile devices
Real-time Results: Instant gift suggestions with detailed explanations

🔐 Security & Management

JWT Authentication: Secure user registration and login system
Admin Dashboard: Comprehensive user management and analytics
Data Protection: Secure handling of personal preferences and user data

🛍️ Shopping Integration

Live Product Data: Real-time pricing and availability through retail APIs
Direct Purchase Links: Seamless transition from recommendation to purchase
Price Comparison: Multiple retailer options when available

🛠️ Technology Stack
ComponentTechnologyPurposeFrontendReact.js, HTML5, CSS3Interactive user interfaceBackendNode.js, Express.jsRESTful API and server logicDatabaseMongoDBUser data and preference storageAI EngineGemini AI APIGift recommendation algorithmsAuthenticationJWTSecure user sessionsExternal APIsRetail APIsReal-time product information
🚀 Getting Started
Prerequisites
Ensure you have the following installed:

Node.js (v14.0 or higher)
npm or yarn
MongoDB (local installation or cloud instance)
Git

Installation

Clone the Repository
bashgit clone https://github.com/Shankar-176/GiftRecomender.git
cd GiftRecomender

Backend Setup
bashcd backend
npm install

# Create environment variables file
cp .env.example .env
# Configure your API keys and database connection

# Start the backend server
npm start
# or for development with auto-reload
npm run dev

Frontend Setup
bashcd frontend
npm install

# Start the development server
npm run dev

Access the Application

Frontend: http://localhost:3000
Backend API: http://localhost:5000



Environment Configuration
Create a .env file in the backend directory with the following variables:
envPORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_AI_API_KEY=your_gemini_ai_key
RETAIL_API_KEY=your_retail_api_key
📁 Project Architecture
GiftRecomender/
├── 📁 backend/
│   ├── 📁 controllers/     # Request handlers
│   ├── 📁 models/          # Database schemas
│   ├── 📁 routes/          # API endpoints
│   ├── 📁 middleware/      # Authentication & validation
│   ├── 📁 services/        # AI and external API integrations
│   └── server.js           # Main application entry
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   ├── 📁 pages/       # Main application pages
│   │   ├── 📁 services/    # API communication
│   │   ├── 📁 utils/       # Helper functions
│   │   └── App.js          # Main React component
│   └── public/             # Static assets
├── 📄 README.md
└── 📄 package.json
🎯 How It Works

User Registration: Create an account with secure JWT authentication
Recipient Setup: Add recipient details and relationship information
Interactive Questionnaire: Answer questions about preferences, interests, and occasion
AI Processing: Gemini AI analyzes responses and generates personalized recommendations
Results Display: View curated gift suggestions with explanations and purchase options
Profile Management: Save recipients and preferences for future use

🤝 Contributing
We welcome contributions from the community! Here's how you can help:
Getting Involved

Fork the Repository
bashgit fork https://github.com/Shankar-176/GiftRecomender.git

Create a Feature Branch
bashgit checkout -b feature/amazing-new-feature

Make Your Changes

Follow existing code style and conventions
Add tests for new functionality
Update documentation as needed


Commit Your Changes
bashgit commit -m "feat: add amazing new feature"

Push to Your Fork
bashgit push origin feature/amazing-new-feature

Open a Pull Request

Provide a clear description of your changes
Include screenshots for UI changes
Reference any related issues



Development Guidelines

Follow Conventional Commits for commit messages
Ensure all tests pass before submitting
Maintain code coverage above 80%
Update documentation for any API changes

🐛 Issues & Support
Found a bug or have a feature request? Please check our Issues page and create a new issue if needed.
When reporting bugs, please include:

Your operating system and browser version
Steps to reproduce the issue
Expected vs actual behavior
Screenshots if applicable

📈 Roadmap

 Mobile App: Native iOS and Android applications
 Social Features: Gift sharing and collaborative wishlists
 Advanced AI: Machine learning improvements and preference learning
 Multi-language Support: Internationalization for global users
 Voice Integration: Voice-powered questionnaire interface

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Author & Contact
Shankar

🌐 GitHub: @Shankar-176
📧 Email: Contact via GitHub
💼 LinkedIn: Connect on LinkedIn


⭐ Found this project helpful? Give it a star!
