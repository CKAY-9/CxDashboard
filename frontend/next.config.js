/** @type {import('next').NextConfig} */
const nextConfig = {
    "reactStrictMode": false,
    "experimental": {
        "appDir": true,
        "typedRoutes": false,
        "serverActions": true
    },
    "images": {
        "remotePatterns": [
            {   
                "protocol": "https",
                "hostname": "avatars.githubusercontent.com"
            }
        ]
    }
}

module.exports = nextConfig
