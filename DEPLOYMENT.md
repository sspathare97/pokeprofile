# GitHub Pages Deployment Guide

## Quick Start

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `pokeprofile` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### Step 2: Push Your Code

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/pokeprofile.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### Step 4: Update Repository Name (If Different)

If your repository name is NOT `pokeprofile`, update `vite.config.ts`:

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/',
```

Replace `your-repo-name` with your actual repository name.

### Step 5: Trigger Deployment

The deployment will automatically trigger when you push to `main`. You can also manually trigger it:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### Step 6: Access Your Site

Once deployed, your site will be available at:
```
https://YOUR_USERNAME.github.io/pokeprofile/
```

Replace `YOUR_USERNAME` with your GitHub username.

## Troubleshooting

### Build Fails

- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version is 20 or higher

### Site Shows 404

- Verify the repository name matches the base path in `vite.config.ts`
- Check that GitHub Pages is enabled and using **GitHub Actions** as source
- Wait a few minutes after deployment (can take up to 10 minutes)

### Assets Not Loading

- Ensure the base path in `vite.config.ts` matches your repository name
- Check browser console for 404 errors
- Clear browser cache

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build with GitHub Pages base path
GITHUB_PAGES=true pnpm build

# Deploy using gh-pages package (install first: pnpm add -D gh-pages)
pnpm add -D gh-pages
# Add to package.json scripts: "deploy": "gh-pages -d dist"
pnpm deploy
```

## Custom Domain

To use a custom domain:

1. Update `vite.config.ts`:
   ```typescript
   base: '/',
   ```

2. Create `public/CNAME` file with your domain:
   ```
   yourdomain.com
   ```

3. Configure DNS as per GitHub Pages documentation

4. In repository Settings → Pages, add your custom domain

