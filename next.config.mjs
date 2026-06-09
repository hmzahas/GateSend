/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp", "canvas", "pdfjs-dist", "mupdf", "pdf-parse", "tesseract.js"],
  },
};

export default nextConfig;
