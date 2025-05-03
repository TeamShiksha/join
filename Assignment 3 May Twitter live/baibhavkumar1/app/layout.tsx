import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Configure Inter font
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// Metadata for SEO
export const metadata: Metadata = {
    title: 'Image Processing Gallery',
    description: 'Upload and process images to 512x512 format with ease.',
    keywords: ['image processing', 'image resize', 'gallery', 'upload'],
    authors: [{ name: 'Your Name' }],
};

// Viewport configuration
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="antialiased bg-gray-50">
                {/* Page Content */}
                {children}

                {/* Footer */}
                <footer className="mt-12 pb-6 text-center text-sm text-gray-500">
                    <p>Created with Next.js and Tailwind CSS</p>
                </footer>
            </body>
        </html>
    );
}
