/** @type {import('next').NextConfig} */
const nextConfig = {
  // The transcript mentions a build error due to linting generated files.
  // While we solve this in eslint.config.mjs, another way is to disable
  // linting during builds entirely. Uncomment the lines below for that approach.
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;