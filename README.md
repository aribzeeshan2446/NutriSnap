# NutriSnap 🥗

<div align="center">


![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

NutriSnap is a cutting-edge web application that revolutionizes nutritional tracking through AI-powered image recognition. Built with modern web technologies, it helps users make informed decisions about their diet and health.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Food Recognition**: Instantly identify food items from photos using Google Gemini (Gemini 2.0 Flash) via Genkit.
- **Detailed Nutritional Analysis**: Get comprehensive breakdown of calories, macros, and micronutrients.
- **Personalized Tracking**: Monitor your daily nutritional goals and progress 
- **Daily Progress & Activity Overview**: Visualize your daily calorie intake, progress toward your goal, and recent meal entries with nutritional breakdowns.
- **Global AI Assistant**: Access a conversational AI assistant powered by Eleven Labs Convai for nutritional advice and support.

### 🛠️ Technical Features
- **Real-time Processing**: Instant food recognition and analysis.
- **Responsive Design**: Seamless experience across all devices.

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **AI Integration**: Google Gemini (Gemini 2.0 Flash) via Genkit
- **State Management**: React Context + Custom Hooks

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/aribzeeshan2446/NutriSnap.git
cd NutriSnap
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# API Configuration
GEMINI_API_KEY=your_gemini_api_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
NutriSnap/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── tests/              # Test files
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow the TypeScript and ESLint configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Arib Zeeshan** - [GitHub Profile](https://github.com/aribzeeshan2446)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors who have helped shape this project

## 📞 Support

If you need help or have questions:
- Open an issue in the repository
- Contact the maintainers
---

<div align="center">
Made with ❤️ by the NutriSnap Team
</div>
