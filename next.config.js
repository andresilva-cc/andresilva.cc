const withNextIntl = require('next-intl/plugin')(
  './i18n.tsx'
);

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
})

module.exports = nextConfig
