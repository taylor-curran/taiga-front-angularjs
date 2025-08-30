# Taiga Frontend

This is the AngularJS frontend application for Taiga, an agile project management platform. This frontend connects to Taiga's public API to provide full functionality.

## Prerequisites

- **Node.js**: Version 14.x recommended (for compatibility with node-sass)
- **Python 3**: For running the development server
- **npm**: Comes with Node.js
- **Taiga.io Account**: Create one at https://taiga.io or use existing credentials

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Fix node-sass compatibility (required on ARM64/M1 Macs)
npm rebuild node-sass

# 3. Build the project
npx gulp deploy

# 4. Configure to use Taiga's public API
cp dist/conf.example.json dist/conf.json
# Edit dist/conf.json and set "api": "https://api.taiga.io/api/v1/"

# 5. Start the server
cd dist
python3 -m http.server 9001

# 6. Open http://localhost:9001 in your browser
# 7. Log in with your Taiga.io account
```

## Detailed Setup Instructions

### 1. Installing Dependencies

```bash
npm install
```

**Common Issues:**
- **node-sass binary incompatibility**: If you see errors about node-sass not having a binding for your environment (especially on ARM64/M1 Macs), run:
  ```bash
  npm rebuild node-sass
  ```

### 2. Building the Project

The project uses Gulp for building. The build process compiles CoffeeScript, SCSS, and Jade templates.

```bash
# Full production build (REQUIRED before running)
npx gulp deploy

# Development build with watch mode (optional for development)
npx gulp
```

**What the build does:**
- Compiles CoffeeScript files to JavaScript
- Compiles SCSS to CSS  
- Processes Jade templates
- Copies assets (images, fonts, emojis)
- Creates versioned directories (e.g., `v-1756578595879/`)
- Generates `dist/` directory with all production files

**Build Output Structure:**
```
dist/
├── conf.json                 # API configuration (you create this)
├── conf.example.json        # Template for conf.json
├── index.html               # Main HTML file
├── v-[timestamp]/           # Versioned assets
│   ├── js/                  # Compiled JavaScript
│   │   ├── app.js          # Application code
│   │   ├── libs.js         # Third-party libraries
│   │   └── templates.js    # Compiled templates
│   ├── styles/             # Compiled CSS
│   ├── images/             # Images
│   ├── emojis/             # Emoji assets
│   └── fonts/              # Web fonts
```

### 3. Configuring the API (REQUIRED)

The frontend must be configured to connect to Taiga's public API. Without this, the UI will not function.

Create `dist/conf.json` with the following content:

```json
{
    "api": "https://api.taiga.io/api/v1/",
    "eventsUrl": null,
    "baseHref": "/",
    "debug": true,
    "debugInfo": true,
    "defaultLanguage": "en",
    "themes": ["taiga"],
    "defaultTheme": "taiga",
    "defaultLoginEnabled": true,
    "publicRegisterEnabled": true,
    "feedbackEnabled": true,
    "supportUrl": "https://community.taiga.io/",
    "privacyPolicyUrl": null,
    "termsOfServiceUrl": null,
    "maxUploadFileSize": null,
    "contribPlugins": [],
    "tagManager": {
        "accountId": null
    },
    "tribeHost": null,
    "enableAsanaImporter": false,
    "enableGithubImporter": false,
    "enableJiraImporter": false,
    "enableTrelloImporter": false,
    "gravatar": false,
    "rtlLanguages": ["ar", "fa", "he"]
}
```

**Important**: The `"api": "https://api.taiga.io/api/v1/"` line is critical. This connects your local frontend to Taiga's cloud backend.

### 4. Running the Application

After building and configuring, serve the `dist` directory with a static file server:

```bash
# Using Python (recommended)
cd dist
python3 -m http.server 9001

# Alternative: Using Node.js http-server
npx http-server dist -p 9001
```

Open http://localhost:9001 in your browser.

### 5. Using the Application

With the public API configured:
- **Log in** with your existing Taiga.io account
- **Create a new account** if you don't have one
- **Browse** public projects
- **Create and manage** your own projects
- All data is stored on Taiga's cloud servers

## Running Tests

The project includes 474 unit tests written in CoffeeScript.

```bash
# Build first (REQUIRED - tests need dist files)
npx gulp deploy

# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run ci:test
```

**Test Configuration:**
- Test runner: Karma
- Test framework: Mocha with Chai
- Browsers: Chrome and HeadlessChrome
- Test files: `app/**/*.spec.coffee`

## Common Issues and Solutions

### 1. Blank Page on Load

**Symptoms:** Page loads but shows blank white screen

**Solutions:**
- **Build not run**: Always run `npx gulp deploy` before starting
- **Missing conf.json**: Ensure `dist/conf.json` exists with correct API endpoint
- **Browser cache**: Hard refresh with `Cmd+Shift+R` (Mac) or `Ctrl+F5` (PC)
- **Version mismatch**: Try incognito mode or different port if you rebuilt recently

### 2. 404 Errors in Console

**Common 404s and fixes:**
- `conf.json 404`: Create it in `dist/` directory (see step 3 above)
- `v-*/js/libs.js 404`: Run `npx gulp deploy` to build the project
- `emojis-data.json 404`: Build incomplete, run `npx gulp deploy` again

### 3. node-sass Build Errors

**Error:** `Error: Node Sass does not yet support your current environment`

**Solution:**
```bash
npm rebuild node-sass
```

If rebuild doesn't work:
```bash
npm uninstall node-sass
npm install node-sass@4.14.1
```

### 4. Cannot Log In

**Issue:** Login fails or hangs

**Check:**
- Ensure `conf.json` has `"api": "https://api.taiga.io/api/v1/"` (with trailing slash)
- Verify you're using correct Taiga.io credentials
- Check browser console for CORS or network errors
- Try creating a new account to test connectivity

### 5. Tests Fail to Run

**Error:** `Can't find dist/js/app.js`

**Solution:** Always build before testing:
```bash
npx gulp deploy && npm test
```

## Development Workflow

### For UI Development

1. Build the project:
   ```bash
   npx gulp deploy
   ```

2. Start development watch (optional):
   ```bash
   npx gulp
   ```

3. Serve the dist directory:
   ```bash
   cd dist
   python3 -m http.server 9001
   ```

4. Open http://localhost:9001
5. Log in with Taiga.io credentials
6. Make changes to source files
7. Rebuild or let watch mode rebuild
8. Refresh browser to see changes

### Browser Cache Issues

If changes aren't appearing:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (PC)
- Open in incognito/private mode
- Change port number: `python3 -m http.server 9002`
- Clear browser cache completely

## Project Structure

```
taiga-front/
├── app/                     # Source code
│   ├── coffee/             # CoffeeScript application code
│   │   └── modules/        # Feature modules
│   ├── styles/             # SCSS styles
│   ├── partials/           # Jade templates
│   ├── images/             # Source images
│   └── **/*.spec.coffee    # Unit tests
├── dist/                   # Built application (git-ignored)
│   └── conf.json           # API configuration (you create)
├── conf/                   # Configuration examples
├── e2e/                    # End-to-end tests
├── gulpfile.js            # Build configuration
├── karma.conf.js          # Test runner configuration
└── package.json           # Dependencies
```

## Available npm Scripts

- `npm test` - Run tests in watch mode
- `npm start` - Start development build with watch
- `npm run ci:test` - Run tests once for CI
- `npm run e2e` - Run end-to-end tests  
- `npm run scss-lint` - Lint SCSS files

## Additional Resources

- [Taiga.io](https://taiga.io) - Create account and manage projects
- [Taiga Documentation](https://docs.taiga.io/)
- [Taiga API Documentation](https://docs.taiga.io/api.html)
- [Taiga Community](https://community.taiga.io/)
- [Backend Repository](https://github.com/taigaio/taiga-back) (not needed for this setup)

## License

See LICENSE file for details.
