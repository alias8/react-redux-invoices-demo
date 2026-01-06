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
   - Platform: Node.js 18
   - Setup SSH: Yes (recommended)

2. Create an environment:
   ```bash
   eb create react-redux-invoices-env
   ```

## Deployment

Build and deploy your application:
```bash
npm run deploy
```

Or manually:
```bash
npm run build
eb deploy
```

## Useful Commands

- `eb status` - Check environment status
- `eb health` - Check application health
- `eb logs` - View application logs
- `eb open` - Open application in browser
- `eb terminate` - Terminate environment (when done)

## Configuration

The deployment is configured with:
- **Platform**: Node.js 18
- **Server**: Express.js serving static files from `dist/`
- **Port**: 8080 (configurable via PORT environment variable)

## Environment Variables

To set environment variables:
```bash
eb setenv KEY=value
```

## Troubleshooting

If deployment fails:
1. Check logs: `eb logs`
2. Verify build succeeded locally: `npm run build`
3. Test server locally: `npm start`
4. Ensure AWS credentials are configured correctly
