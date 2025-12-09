# Deploying to GitHub Pages

This project is configured for static export and can be deployed to GitHub Pages.

## Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages when you push to the `main` branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow complete
   - Your site will be available at: `https://[username].github.io/[repository-name]`

## Manual Deployment

If you prefer to deploy manually:

1. **Build the static export:**
   ```bash
   npm run build
   ```

2. **The static files will be in the `out` directory**

3. **Deploy the `out` directory to your hosting provider**

## Configuration for Subdirectory Deployment

If your GitHub Pages site is at `username.github.io/repo-name` (not a custom domain), you need to set the base path:

1. **Edit `next.config.js`** and uncomment these lines:
   ```javascript
   basePath: '/utxo-management',  // Replace with your repo name
   assetPrefix: '/utxo-management',
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

## Custom Domain

To use a custom domain:

1. **Add a `CNAME` file to the `public` directory:**
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS:**
   - Add a CNAME record pointing to `[username].github.io`
   - Or add A records pointing to GitHub's IPs

3. **In GitHub Settings → Pages:**
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Testing Locally

To test the static export locally:

```bash
# Build the static site
npm run build

# Serve the out directory with a static server
npx serve out
```

## Important Notes

- **Images:** The configuration uses `unoptimized: true` for images since GitHub Pages doesn't support Next.js Image Optimization
- **`.nojekyll`:** This file in `public/` prevents GitHub Pages from ignoring files starting with `_`
- **API Routes:** Static export doesn't support Next.js API routes - all data fetching must be done client-side
- **Dynamic Routes:** Dynamic routes need to be pre-rendered using `generateStaticParams`

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs in the **Actions** tab
- Ensure all dependencies are in `package.json`
- Test the build locally: `npm run build`

### 404 on Refresh
- Ensure `basePath` is set correctly if using a subdirectory
- GitHub Pages serves `index.html` for each route automatically with Next.js static export

### Styling Issues
- Clear your browser cache
- Check if asset paths are correct (use relative paths)
- Verify `basePath` and `assetPrefix` match your deployment URL
