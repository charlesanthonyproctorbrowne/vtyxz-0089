# Task Management System

A full-stack task management application with complete CRUD operations, built for simplicity and maintainability.

## Tech Stack & Architecture

**Frontend**: React 18+, TypeScript, Tailwind CSS, Vite
**Backend**: Node.js, Express, TypeScript
**Database**: SQLite with migrations
**Testing**: Jest with Docker containers

**Architecture**: Unidirectional data flow using React Context + useReducer pattern. This ensures predictable state updates and makes debugging easier. Data flows from API → Context → Components, with actions flowing upward through custom hooks.

**Why this stack**: TypeScript provides type safety across the entire application. React's unidirectional flow prevents state inconsistencies. SQLite offers zero-configuration persistence perfect for development and small-scale production.

## Development Setup

**Prerequisites**: Docker (you can run this locally with `npm i` and running BE + FE with separate npm commands, but ideally, docker desktop and just run the make files should be better and more simple)

**To Start**:

```bash
make
```

Just run the make, that will build and run the application. If you want anything further, below is a list of make commands.

I'm using a make file for ease of running and testing the application.

**Quick start**:
```bash
# Production build and run
make

# Development with hot reloading
make dev

# View logs
make logs

# Stop application
make down

# Run tests
make test

# Run linting
make lint

# Full CI pipeline (lint + test)
make ci
```

**Local development** (requires Node.js 18+):
```bash
# Install dependencies first
cd backend && npm install && cd ../frontend && npm install

# Run services
cd backend && npm run dev  # Port 3001
cd frontend && npm run dev  # Port 3000
```

**Database**: Automatically initializes with migrations. For sample data, run `make dev` then `npm run db:seed` in backend directory.

## Testing

**Run all tests**: `make test`
**Backend only**: `make test-backend`
**Frontend only**: `make test-frontend`
**With coverage**: `make test-coverage`
**Watch mode**: `make test-watch`

Tests use in-memory databases for isolation and Docker for consistency across environments.

## API Endpoints

- `GET /api/tasks` - List tasks (sortable)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

All endpoints include comprehensive validation and error handling.

## Production Deployment

**Recommended: AWS Serverless Architecture**

I tend to favor AWS Serverless as it's what i've been using previously but happy to use any setup the org typically favours.

Here - having it setup with AWS serverless, you get the benefit of low cost on rollout and you can scale up - up until the point you hit a threshold of consistent volume of traffic then you can move over to dedicated instances if cost as a major driver.

Obviously, ECS Fargate can be used for serverless image deployment or just running locally with CDK IaC setup. Preference really both have their tradoffs.

**Infrastructure as Code**: AWS CDK for reproducible deployments
**CI/CD**: GitHub Actions with CDK integration
**Cost Strategy**: Start serverless, monitor usage, migrate to dedicated instances if volume consistently exceeds cost thresholds

### Deployment Architecture

**Frontend**:
- S3 bucket for static hosting
- CloudFront CDN for global distribution
- Route 53 for custom domain management

**Backend**:
- API Gateway for HTTP routing
- Lambda functions for business logic
- DynamoDB for task storage (replacing SQLite)
- CloudWatch for monitoring and logging

**CI/CD Pipeline**:
1. GitHub Actions triggers on push to main
2. Run tests and build applications
3. CDK synthesizes CloudFormation templates
4. Deploy infrastructure changes
5. Deploy application code using CDK outputs for configuration
6. Update DNS records via Route 53

**Security Considerations**:
- IAM roles with least-privilege access for Lambda functions
- API Gateway with throttling, burst limits & WAF protection
   - You may remove WAF for cost and have DDoS and other security measure inplace at the DNS level, say cloudflare or something
- Secrets Manager for environment variables and database credentials
   - You can have these rotated as well if needed
- VPC endpoints for secure service communication
   - Very much overkill and costly but maybe needed for some use cases depending on clients

**Scalability & Performance**:
- DynamoDB auto-scaling based on demand
- CloudFront edge caching for static assets
- Lambda provisioned concurrency for consistent performance at scale
   - Though concurrency provisioning eats at the region available lambda's so need to be very careful with this
- API Gateway caching for frequently accessed endpoints

**Operational Stuff**:
- Multi-environment deployment (dev/staging/prod) with separate AWS accounts
- Blue/green deployments via CodeDeploy for zero-downtime updates
   - Potentially, again might not be needed if your pre-deploy tests are good enough
- CloudWatch dashboards and alarms for proactive monitoring
- Automated backups and point-in-time recovery for DynamoDB
   - There's a few things to consider with dynamodb, your partition key and sort key, and the way you're using it
   - I got asked the question on Postgres during the first interview, so just using an sqllite instance at the moment

**Cost Monitoring**: CloudWatch alarms track Lambda invocations and DynamoDB usage. When monthly costs exceed predefined thresholds, automated reports trigger architecture review for potential migration to ECS Fargate or EC2.

**Benefits**: Zero server management, automatic scaling, pay-per-use pricing, built-in monitoring, and easy rollbacks through CloudFormation stack updates.
