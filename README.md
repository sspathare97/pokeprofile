# PokéProfile Lab

A single-page web application that lets you create a custom Pokémon-style profile card based on your professional skills and traits. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Trainer & Pokémon Creation**: Create a trainer name and matching Pokémon name
- **Type Selection**: Choose up to two Pokémon types
- **Species Selection**: Pick from various Pokémon species
- **Ability Selection**: Choose from categorized abilities with descriptions
- **Base Stats**: Distribute up to 600 points across six signature traits:
  - Strategy
  - Focus
  - Expression
  - Collaboration
  - Grit
  - Adaptability
- **Image Generation**: Get AI-ready prompts for generating your Pokémon image
- **JSON Export/Import**: Save and load your profile
- **Live Preview**: See your PokéProfile card update in real-time

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **pnpm** - Package manager

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pokeprofile
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Initial Setup

1. **Create a GitHub Repository**
   - Create a new repository on GitHub (e.g., `pokeprofile`)
   - Push your code to the `main` branch

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Update Repository Name in Config** (if needed)
   - If your repository name is NOT `pokeprofile`, update the base path in `vite.config.ts`:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/',
   ```

### Automatic Deployment

Once set up, the site will automatically deploy when you:
- Push to the `main` branch
- Manually trigger the workflow from the **Actions** tab

The workflow will:
1. Build the project with the correct base path
2. Deploy to GitHub Pages
3. Make your site available at: `https://<your-username>.github.io/pokeprofile/`

### Manual Deployment (Alternative)

If you prefer to deploy manually:

1. Build the project:
```bash
GITHUB_PAGES=true pnpm build
```

2. Push the `dist` folder to the `gh-pages` branch:
```bash
git subtree push --prefix dist origin gh-pages
```

Or use the GitHub Pages deployment tool of your choice.

### Custom Domain (Optional)

If you want to use a custom domain:

1. Update `vite.config.ts`:
   ```typescript
   base: '/',
   ```

2. Add a `CNAME` file in the `public` directory with your domain name

3. Configure DNS settings as per GitHub Pages documentation

## Project Structure

```
pokeprofile/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/                     # Static assets
├── src/
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Sagar Pathare**
- GitHub: [@sspathare97](https://github.com/sspathare97)

## Acknowledgments

- Inspired by the layout on [PokemonDB](https://pokemondb.net)
- Built with modern web technologies
