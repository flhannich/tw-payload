# Timeless Wisdom Payload CMS

A Next.js application with Payload CMS deployed on Cloudflare Workers.

## Development

Start the development server:
```bash
pnpm dev
```

## Deployment

### Full Deployment (Database + App)

Deploy to development:
```bash
pnpm run deploy:development
```

Deploy to staging:
```bash
pnpm run deploy:staging
```

Deploy to production:
```bash
pnpm run deploy:production
```

### App-Only Deployment

For quick updates without database changes:

```bash
pnpm run deploy:app:development
pnpm run deploy:app:staging
pnpm run deploy:app:production
```

### Database-Only Operations

Run migrations only:
```bash
CLOUDFLARE_ENV=development pnpm run deploy:db
CLOUDFLARE_ENV=staging pnpm run deploy:db
CLOUDFLARE_ENV=production pnpm run deploy:db
```

## Environment URLs

- Development: https://tw-payload-development.flha.workers.dev
- Staging: https://tw-payload-staging.flha.workers.dev
- Production: https://tw-payload-production.flha.workers.dev

## Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+
- Cloudflare account with R2 configured
- Turso account with databases created for each environment
- PAYLOAD_SECRET set in Cloudflare Workers environment variables
- TURSO_URI and TURSO_AUTH_TOKEN configured for each environment

You can enable read replicas by adding `readReplicas: 'first-primary'` in the DB adapter and then enabling it on your D1 Cloudflare dashboard. Read more about this feature on [our docs](https://payloadcms.com/docs/database/sqlite#d1-read-replicas).

## Working with Cloudflare

Firstly, after installing dependencies locally you need to authenticate with Wrangler by running:

```bash
pnpm wrangler login
```

This will take you to Cloudflare to login and then you can use the Wrangler CLI locally for anything, use `pnpm wrangler help` to see all available options.

Wrangler is pretty smart so it will automatically bind your services for local development just by running `pnpm dev`.

## Deployments

When you're ready to deploy, first make sure you have created your migrations:

```bash
pnpm payload migrate:create
```

Then run the following command:

```bash
pnpm run deploy
```

This will spin up Wrangler in `production` mode, run any created migrations, build the app and then deploy the bundle up to Cloudflare.

That's it! You can if you wish move these steps into your CI pipeline as well.

## Enabling logs

By default logs are not enabled for your API, we've made this decision because it does run against your quota so we've left it opt-in. But you can easily enable logs in one click in the Cloudflare panel, [see docs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs).

## Known issues

### GraphQL

We are currently waiting on some issues with GraphQL to be [fixed upstream in Workers](https://github.com/cloudflare/workerd/issues/5175) so full support for GraphQL is not currently guaranteed when deployed.

### Worker size limits

We currently recommend deploying this template to the Paid Workers plan due to bundle [size limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size) of 3mb. We're actively trying to reduce our bundle footprint over time to better meet this metric.

This also applies to your own code, in the case of importing a lot of libraries you may find yourself limited by the bundle.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
