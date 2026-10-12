/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    const privateRoutes = ["login", "dashboard", "companies", "leads", "previews", "products", "setup", "preview", "demo", "design-preview", "design-review", "api"];
    return process.env.VERCEL_ENV === "preview"
      ? [{ source: "/:path*", headers: noindex }]
      : privateRoutes.map(route => ({ source: `/${route}/:path*`, headers: noindex }));
  },
};
export default nextConfig;
