# OmniAds - AI-Powered Advertising Intelligence Agent

OmniAds is an end-to-end full-stack application that provides unified advertising intelligence across multiple platforms (Meta, Google, TikTok) with AI-powered recommendations to maximize ROAS.

## Features

- **Multi-Platform Integration**: Unified view of Meta Ads, Google Ads, and TikTok Ads campaigns
- **E-commerce Integration**: Deep integration with Tienda Nube for product and sales data
- **AI-Powered Recommendations**: Intelligent action items based on campaign performance and sales correlation
- **Actionable Insights**:
  - Campaign pause/scale recommendations
  - Cross-platform budget shift suggestions
  - Competitor price monitoring
  - Organic product promotion opportunities
  - Bundle creation suggestions
- **Mobile-First Dashboard**: Responsive design optimized for mobile devices
- **Real-time Analytics**: ROAS trends, platform performance, and campaign rankings

## Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful endpoints with validation

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Routing**: React Router v6

### External Services (Mocked for MVP)
- Meta Ads API
- Google Ads API
- TikTok Ads API
- Tienda Nube API
- Twilio API (WhatsApp notifications)
- AI Core (Python microservice using LangChain/LangGraph)

## Project Structure

```
omniads/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── user/        # User management
│   │   ├── dashboard/   # Dashboard endpoints
│   │   ├── recommendations/  # Recommendations module
│   │   ├── database/    # TypeORM entities & config
│   │   └── services/    # Mock APIs & AI Core client
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities & API client
│   │   └── store/       # Zustand stores
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=omniads
DB_PASSWORD=your_password
DB_DATABASE=omniads
JWT_SECRET=your-secret-key
```

5. Create the PostgreSQL database:
```bash
createdb omniads
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will be running at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
echo "VITE_API_URL=http://localhost:3000" > .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Initial Data Setup

The application uses mocked data from external APIs. To populate the database with initial data:

1. Make sure the backend is running
2. Register a user account through the frontend or API
3. Trigger a data sync (admin only):
```bash
curl -X POST http://localhost:3000/api/v1/sync \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

This will:
- Fetch campaign data from mocked ad platforms
- Fetch product and sales data from mocked e-commerce API
- Generate AI recommendations based on the data

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Dashboard
- `GET /api/v1/dashboard/kpis?period=7d` - Get KPIs
- `GET /api/v1/dashboard/roas-trends?period=30d` - Get ROAS trends
- `GET /api/v1/dashboard/platform-summary?period=7d` - Platform summary
- `GET /api/v1/dashboard/campaigns/top` - Top campaigns
- `GET /api/v1/dashboard/campaigns/bottom` - Bottom campaigns
- `GET /api/v1/dashboard/insight` - AI global insight

### Recommendations
- `GET /api/v1/recommendations/action-items` - Get action items
- `POST /api/v1/recommendations/:id/archive` - Archive recommendation
- `GET /api/v1/opportunities/organic` - Organic product opportunities
- `GET /api/v1/opportunities/bundles` - Bundle opportunities

## Default Credentials

For testing, you can create a user via the registration endpoint or use the login page.

## Architecture

### Backend Architecture
The backend follows a modular NestJS architecture:
- **Auth Module**: JWT-based authentication with bcrypt password hashing
- **Dashboard Module**: Aggregates campaign data and provides analytics
- **Recommendations Module**: Manages AI-generated action items
- **Services Module**: Contains mock API clients and AI Core client

### Frontend Architecture
The frontend uses a component-based architecture:
- **Pages**: Top-level route components
- **Components**: Reusable UI components (shadcn/ui)
- **Store**: Zustand stores for global state
- **Lib**: Utilities, API client, and helpers

### Data Flow
1. Mock APIs provide campaign and e-commerce data
2. Data Sync Service fetches and stores data in PostgreSQL
3. AI Core Client generates recommendations based on data
4. Dashboard aggregates and presents data
5. Frontend displays insights and action items

## Mock Data

All external APIs are mocked for the MVP:
- **Meta Ads**: Returns 4 sample campaigns
- **Google Ads**: Returns 4 sample campaigns + merchant data
- **TikTok Ads**: Returns 3 sample campaigns
- **Tienda Nube**: Returns 5 products and recent sales
- **AI Core**: Generates 6 types of recommendations

## Testing

OmniAds uses comprehensive unit testing to ensure code quality and prevent regressions.

### Running Tests

**Backend (Jest)**:
```bash
cd backend
npm test                  # Run all tests
npm run test:watch        # Watch mode for development
npm run test:cov          # Generate coverage report
npm run test:debug        # Debug mode
```

**Frontend (Vitest)**:
```bash
cd frontend
npm test                  # Run tests in watch mode
npm run test:run          # Run once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Open Vitest UI
```

### Coverage Requirements

The project enforces minimum code coverage thresholds:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

Coverage reports are generated in the `coverage/` directory for both frontend and backend.

### Pre-commit Hooks

Tests are automatically run before each commit via Husky pre-commit hooks. If any tests fail, the commit will be blocked. This ensures that only tested, working code is committed to the repository.

To bypass the pre-commit hook in emergencies (not recommended):
```bash
git commit --no-verify -m "message"
```

### Writing Tests

Test templates are available to help you write consistent tests:

**Backend**:
- `backend/test-templates/service.spec.ts.template` - Service test template
- `backend/test-templates/controller.spec.ts.template` - Controller test template

**Frontend**:
- `frontend/test-templates/component.test.tsx.template` - React component test template

### Test Structure

**Backend tests** use Jest with the following conventions:
- Test files: `*.spec.ts`
- Mock external dependencies (repositories, services)
- Use `@nestjs/testing` for module creation
- Follow Arrange-Act-Assert pattern

**Frontend tests** use Vitest + React Testing Library:
- Test files: `*.test.tsx` or `*.test.ts`
- Use `@testing-library/react` for component testing
- Mock external dependencies with `vi.fn()`
- Test user interactions and accessibility

### Example Test

```typescript
// Backend service test
describe('UserService', () => {
  it('should find a user by id', async () => {
    // Arrange
    const userId = '123';
    repository.findOne.mockResolvedValue(mockUser);

    // Act
    const result = await service.findById(userId);

    // Assert
    expect(result).toEqual(mockUser);
  });
});
```

### Test Coverage

Current test coverage includes:
- ✅ Auth module (service, controller, guards)
- ✅ User module (service)
- ✅ Dashboard service (KPIs, trends, campaigns)
- 🔄 Additional modules being added incrementally

### Best Practices

1. **Write tests first** (TDD) when possible
2. **Test behavior, not implementation** - focus on what the code does, not how
3. **Keep tests isolated** - no shared state between tests
4. **Use descriptive test names** - clearly state what is being tested
5. **Mock external dependencies** - databases, APIs, file systems
6. **Test edge cases** - error conditions, empty inputs, boundary values

## Development Notes

- TypeORM is set to auto-synchronize in development mode
- All API endpoints (except auth) require JWT authentication
- CORS is enabled for the frontend URL
- Input validation is enabled globally via class-validator
- **Tests must pass before committing** - enforced by pre-commit hooks

## Future Enhancements

- Connect to real external APIs (Meta, Google, TikTok, Tienda Nube)
- Implement actual Python AI Core microservice with LangChain/LangGraph
- Add WhatsApp notifications via Twilio
- Implement scheduled data syncs (cron jobs)
- Add more sophisticated analytics and forecasting
- Multi-tenancy support for agencies

## License

MIT

## Contact

For questions or support, please contact the development team.
