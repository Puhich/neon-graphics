// Static responsive images without the Vercel image optimizer: every photo in
// public/images has pre-generated -640 and -1280 variants, and this loader
// maps next/image's requested width to one of them. Other assets (logos,
// icons, svg) are served as-is.
export default function imageLoader({ src, width }) {
  if (!src.startsWith("/images/") || !src.endsWith(".webp")) {
    return src;
  }

  const suffix = width <= 750 ? "-640" : "-1280";
  return src.replace(/\.webp$/, `${suffix}.webp`);
}
