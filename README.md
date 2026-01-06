# React Redux Invoices

A modern invoice management application built with React, TypeScript, and Redux.

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm 9+ or yarn

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-redux-invoices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Mode

Run the application in development mode with hot module replacement:

```bash
npm run dev
```

This will start the Vite development server. The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://192.168.x.x:5173

The page will automatically reload when you make changes to the source code.

### Building for Production

Build the optimized production bundle:

```bash
npm run build
```

This compiles TypeScript and bundles the React application into the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm start
```

This runs the Express server and serves the built application at:
- **URL**: http://localhost:8080

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

## Project Structure

```
react-redux-invoices/
├── src/                    # React application source code
│   ├── components/         # React components
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── dist/                  # Built files (generated)
├── server.js              # Express server for production
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm start` | Run production server locally |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build with Vite |
| `npm run deploy` | Build and deploy to AWS Elastic Beanstalk |

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Bundler**: Vite (Rollup)
- **Styling**: CSS
- **Linting**: ESLint
- **Server**: Express.js (production)
- **Deployment**: AWS Elastic Beanstalk

## Development

### Hot Module Replacement

The development server supports Hot Module Replacement (HMR), which means:
- Changes to React components update instantly without page refresh
- Component state is preserved during updates
- Fast feedback loop for development

### TypeScript

The project uses TypeScript for type safety. Type checking runs during:
- Development (in your IDE)
- Build process (`npm run build`)
- Linting (`npm run lint`)

### Code Style

This project uses ESLint with TypeScript rules. Configuration includes:
- React Hooks rules
- React Refresh rules
- Strict TypeScript checking

## Deployment

For production deployment to AWS Elastic Beanstalk, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Environment Variables

The application uses the following environment variables:

### Development
- `PORT` - Development server port (default: 5173, set by Vite)

### Production
- `PORT` - Server port (default: 8080)

To set environment variables, create a `.env` file in the root directory:
```
PORT=8080
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### TypeScript Errors

If you encounter TypeScript compilation errors:
1. Ensure `tsconfig.json` and `tsconfig.node.json` are properly configured
2. Run `npm install` to ensure all type definitions are installed
3. Restart your IDE's TypeScript server

### Build Fails

If the build fails:
1. Delete `node_modules` and `dist` directories
2. Run `npm install` again
3. Try building: `npm run build`

## License

This project is licensed under the MIT License.
