/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Instagram / Meta CDN
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      // Uploadthing / common storage
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      // Google Places / Maps photos
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "streetviewpixels-pa.googleapis.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline (Next.js requires unsafe-inline for hydration) + analytics
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://maps.googleapis.com",
              // Styles: self + inline (Tailwind/CSS-in-JS)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + all configured remote patterns + data URIs
              "img-src 'self' data: blob: https:",
              // Connections: self + external APIs
              "connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com",
              // Frames: allow Google Maps embeds
              "frame-src https://www.google.com",
              // Objects: deny plugins
              "object-src 'none'",
              // Base URI: restrict to self
              "base-uri 'self'",
              // Form actions: restrict to self
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
