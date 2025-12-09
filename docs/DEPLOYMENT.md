# Deployment Guide

Production deployment guide for the Bitcoin UTXO Management Tool.

## Prerequisites

- Node.js 18+
- Git repository
- Hosting platform account (Vercel recommended)
- Domain name (optional)

---

## Environment Configuration

### Environment Variables

Create `.env.production`:

```bash
# Mempool.space API URLs
NEXT_PUBLIC_MEMPOOL_API_URL=https://mempool.space/api
NEXT_PUBLIC_TESTNET_MEMPOOL_API_URL=https://mempool.space/testnet4/api

# Network settings
NEXT_PUBLIC_ENABLE_TESTNET=true
NEXT_PUBLIC_DEFAULT_NETWORK=testnet4

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Security Checklist

Before deployment:

- [ ] No private keys in code
- [ ] No API keys in repository
- [ ] `.gitignore` includes `.env` files
- [ ] `.gitignore` includes `.claude_sessions/`
- [ ] HTTPS enabled
- [ ] Input validation implemented
- [ ] XSS prevention in place
- [ ] Rate limiting configured

---

## Vercel Deployment (Recommended)

### Initial Setup

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy to Preview**:
```bash
vercel
```

4. **Deploy to Production**:
```bash
vercel --prod
```

### GitHub Integration

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables
7. Deploy

### Environment Variables in Vercel

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `NEXT_PUBLIC_MEMPOOL_API_URL`
   - `NEXT_PUBLIC_TESTNET_MEMPOOL_API_URL`
   - `NEXT_PUBLIC_ENABLE_TESTNET`
4. Select environments (Production, Preview, Development)
5. Save

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   - Add CNAME record pointing to Vercel
4. Wait for SSL certificate (automatic)
5. Access via your domain

---

## Alternative Deployments

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t utxo-management .
docker run -p 3000:3000 utxo-management
```

### VPS (DigitalOcean, AWS, etc.)

1. SSH into server
2. Install Node.js 18+
3. Clone repository
4. Install dependencies: `npm ci`
5. Build: `npm run build`
6. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "utxo-management" -- start
pm2 save
pm2 startup
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      # Add tests when implemented
      # - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Pre-Deployment Testing

### Build Test

```bash
npm run build
npm start
```

Access `http://localhost:3000` and test:
- [ ] All pages load
- [ ] Wallet connection works
- [ ] Network switching functions
- [ ] No console errors
- [ ] Responsive on mobile

### Testnet4 Testing

1. Deploy to preview/staging
2. Switch to testnet4
3. Connect wallet
4. Test all features:
   - [ ] UTXO loading
   - [ ] Transaction building
   - [ ] Transaction signing
   - [ ] Broadcasting
   - [ ] RBF functionality

### Performance Testing

```bash
npm run build

# Check bundle size
du -sh .next

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## Monitoring and Analytics

### Error Tracking (Sentry)

1. Sign up at [sentry.io](https://sentry.io)
2. Create new project
3. Install SDK:
```bash
npm install @sentry/nextjs
```

4. Configure in `sentry.config.js`
5. Add DSN to environment variables

### Analytics (Vercel Analytics)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusPage.io

---

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring Checklist

Weekly:
- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor uptime
- [ ] Check API usage

Monthly:
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review

### Backup Strategy

- Git repository backed up
- Environment variables documented
- Database backups (if applicable)
- Disaster recovery plan

---

## Rollback Procedures

### Vercel Rollback

1. Go to Deployments
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

### Manual Rollback

```bash
git revert <commit-hash>
git push origin main
# CI/CD triggers automatic deployment
```

---

## Security Hardening

### Headers

Configure in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
```

### SSL/TLS

- Vercel provides automatic SSL
- For custom deployments, use Let's Encrypt
- Force HTTPS only

---

## Cost Optimization

### Vercel Free Tier

- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Edge network
- Sufficient for MVP

### Scaling Considerations

If traffic grows:
- Upgrade Vercel plan
- Implement caching
- Optimize bundle size
- Use CDN for assets

---

## Post-Deployment

### Launch Checklist

- [ ] Production deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Tested on testnet4
- [ ] Tested on mainnet (small amounts)
- [ ] Documentation published
- [ ] Support channels established

### Announcement

- Update README with live URL
- Announce on social media
- Post in Bitcoin communities
- Share with testers

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Netlify Docs](https://docs.netlify.com)

For more information:
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Security Guide](./SECURITY.md)
