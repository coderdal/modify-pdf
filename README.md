# PDF Toolkit - Frontend

![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20TypeScript%20%7C%20Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, feature-rich PDF manipulation web application built with Next.js and TypeScript. This application provides a comprehensive suite of PDF tools with a beautiful, responsive user interface.

🔗 **Live Demo**: [https://pdf.erdal.net.tr](https://pdf.erdal.net.tr)

> **Note**: This is the frontend part of the PDF Toolkit application. For the backend service that powers this application, please visit [PDF Toolkit Backend](https://github.com/coderdal/modify-pdf-service).

## ✨ Features

- 📄 **PDF Conversion** - Convert PDFs to Word, images, and other formats
- 🗜️ **PDF Compression** - Reduce PDF size while maintaining quality
- 🔍 **OCR Processing** - Convert scanned documents to searchable PDFs
- 🔒 **PDF Protection** - Add and remove password protection
- ✂️ **PDF Manipulation**
  - Split PDFs into smaller documents
  - Merge multiple PDFs
  - Remove pages
  - Reorder pages with drag-and-drop
  - Rotate pages
  - Add page numbers
- 📋 **Text Extraction** - Extract text content from PDFs
- 🎨 **Modern UI/UX**
  - Responsive design
  - Drag-and-drop file upload
  - Real-time processing status
  - Clean and intuitive interface

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with modern design
- **File Handling**: react-dropzone
- **PDF Processing**: PDF.js for client-side preview
- **State Management**: React Hooks
- **API Integration**: Axios

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/coderdal/modify-pdf.git
   cd modify-pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env`:
   ```
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🐳 Docker Support

The application can be containerized using Docker:

```bash
# Build the image
docker build -t pdf-toolkit-frontend .

# Run the container
docker run -p 3001:3000 -e NEXT_PUBLIC_API_URL="your_backend_url" pdf-toolkit-frontend:latest
```

## 📦 Project Structure

```
pdf-toolkit-frontend/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utility functions and API clients
│   └── [feature]/         # Feature-specific pages
├── public/                # Static assets
├── styles/                # Global styles
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Check out our [GitHub repository](https://github.com/coderdal/modify-pdf) for more information.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Muhammed Erdal**
- LinkedIn: [muhammederdal](https://linkedin.com/in/muhammederdal)
- GitHub: [coderdal](https://github.com/coderdal)
