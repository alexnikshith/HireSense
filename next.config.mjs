/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.VERCEL
            ? "/api/index.py"
            : "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
