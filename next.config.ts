import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@libsql/isomorphic-ws', '@libsql/client/web'],

    // Your Next.js config here
    webpack: (webpackConfig: any) => {
        webpackConfig.resolve.extensionAlias = {
            '.cjs': ['.cts', '.cjs'],
            '.js': ['.ts', '.tsx', '.js', '.jsx'],
            '.mjs': ['.mts', '.mjs'],
        }

        // Alias libSQL client to use web version for Cloudflare Workers
        webpackConfig.resolve.alias = {
            ...webpackConfig.resolve.alias,
            '@libsql/client$': '@libsql/client/web',
        }

        // Mark libsql packages as external to prevent bundling
        webpackConfig.externals = webpackConfig.externals || []
        webpackConfig.externals.push('@libsql/isomorphic-ws', '@libsql/client/web')

        return webpackConfig
    },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
