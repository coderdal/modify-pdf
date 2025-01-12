import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Toolkit - Modify PDFs Online',
  description: 'Powerful PDF modification tools including conversion, compression, protection, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur-sm bg-white/90">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-indigo-600">PDF Toolkit</a>
              </div>
              <div className="flex items-center">
                <a 
                  href="https://linkedin.com/in/muhammederdal" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </nav>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4 text-sm">
                  <a href="/legal/privacy-policy" className="text-gray-500 hover:text-gray-900">Privacy Policy</a>
                  <span className="text-gray-300">|</span>
                  <a href="/legal/terms-of-service" className="text-gray-500 hover:text-gray-900">Terms of Service</a>
                  <span className="text-gray-300">|</span>
                  <a href="/legal/cookie-policy" className="text-gray-500 hover:text-gray-900">Cookie Policy</a>
                  <span className="text-gray-300">|</span>
                  <a href="/legal/disclaimer" className="text-gray-500 hover:text-gray-900">Disclaimer</a>
                </div>
                <p className="text-center text-gray-500 text-sm">
                  © {new Date().getFullYear()} PDF Toolkit. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
