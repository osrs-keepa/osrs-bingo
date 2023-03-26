/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        API_URL: 'https://ly5iq0dyzd.execute-api.us-east-2.amazonaws.com/staging',
        ADMIN_KEY: 'd6d732aa-21ee-42f5-99f6-12a74827fa26',
    },
    images: {
        domains: [
            'rsbingo-files.s3.us-east-2.amazonaws.come6e2ef15-6411-43af-88ea-ff08258e1e1f',
            'rsbingo-files.s3.us-east-2.amazonaws.com'
        ],
    },
};

module.exports = nextConfig;
