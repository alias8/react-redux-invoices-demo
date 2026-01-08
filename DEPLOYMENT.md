# AWS Elastic Beanstalk Deployment Guide

## Prerequisites

1. Install the AWS CLI and EB CLI:

   ```bash
   pip install awsebcli
   ```

2. Configure AWS credentials:
   ```bash
   aws configure
   ```

## Initial Setup

1. Initialize Elastic Beanstalk application:

   ```bash
   eb init
   ```

   - Select your region (default: us-east-1)
   - Application name: react-redux-invoices
   - Platform: Node.js 20
   - Setup SSH: Yes (recommended)
   - CodeCommit: No (use S3 artifact upload)

2. Create an environment:
   ```bash
   eb create react-redux-invoices-env
   ```

## Deployment

**Important**: Always build the React app locally before deploying.

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy to Elastic Beanstalk:
   ```bash
   eb deploy
   ```

Or use the combined command:

```bash
npm run deploy
```

## How It Works

1. **Build Process**: Vite builds the React app into the `dist/` directory
2. **Deployment**: EB CLI packages and uploads the application to S3
3. **Server**: Express.js serves the built static files from `dist/`
4. **Port**: Application runs on port 8080 (required by EB)

## Application Structure

```
.
├── dist/              # Built React app (deployed)
├── src/               # React source files (not deployed)
├── server.js          # Express server
├── Procfile           # EB start command: "web: node server.js"
├── package.json       # Dependencies
└── .ebignore          # Files to exclude from deployment
```

## Useful Commands

- `eb status` - Check environment status
- `eb health` - Check application health
- `eb logs` - View application logs
- `eb logs -z` - Download all logs as zip
- `eb open` - Open application in browser
- `eb terminate` - Terminate environment (when done)

## Configuration

The deployment is configured with:

- **Platform**: Node.js 20 running on Amazon Linux 2023
- **Server**: Express.js serving static files from `dist/`
- **Port**: 8080 (required by Elastic Beanstalk)
- **Deployment Method**: S3 artifact upload
- **Process Manager**: systemd (via Procfile)

## Environment Variables

To set environment variables:

```bash
eb setenv KEY=value
```

To set multiple variables:

```bash
eb setenv KEY1=value1 KEY2=value2
```

## Troubleshooting

### Health Status is Red

1. Check logs: `eb logs -z`
2. Look for errors in `eb-engine.log` and `web.stdout.log`
3. Verify the `dist/` directory exists and contains built files
4. Ensure you ran `npm run build` before deploying

### Build Fails Locally

If `npm run build` fails with TypeScript errors:

- Ensure `tsconfig.node.json` has `"composite": true` in compilerOptions
- This is required for project references to work correctly

### Deployment Fails

1. Verify build succeeded locally: `npm run build`
2. Test server locally: `npm start`
3. Check that `dist/index.html` exists
4. Ensure AWS credentials are configured correctly

### App Not Loading

1. Check environment health: `eb status`
2. View logs: `eb logs`
3. Verify Express server is running: check `web.stdout.log`
4. Confirm `dist/` directory was included in deployment

## Current Deployment

- **Environment**: react-redux-invoices-env
- **URL**: http://react-redux-invoices-env.eba-dmqqucrm.us-east-1.elasticbeanstalk.com
- **Region**: us-east-1
- **Platform**: Node.js 20 on AL2023
