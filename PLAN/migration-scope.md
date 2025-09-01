# Taiga Frontend Migration Scope

## Executive Summary

This document defines the target architecture and technical decisions for migrating Taiga frontend from AngularJS to React while maintaining identical UI/UX to ensure zero user disruption.

## Pre-Migration State (Current)

### Technology Stack
- **Framework**: AngularJS 1.5.10
- **Language**: CoffeeScript 1.10.0
- **Templates**: Jade/Pug
- **Styling**: SCSS
- **Build Tool**: Gulp 4.0.2
- **Module System**: Angular modules
- **HTTP Client**: Angular $http with custom wrapper
- **Routing**: Angular $routeProvider
- **State Management**: Angular services & $scope

### Architecture
- Monolithic AngularJS application
- 200+ templates across 18+ modules
- 100+ directives, 30+ controllers, 36+ services
- CoffeeScript files organized by feature
- Build output: Concatenated JS/CSS bundles

## Post-Migration State (Target)

### Technology Stack
- **Framework**: React 18.x
- **Language**: JavaScript ES6+
- **Templates**: JSX
- **Styling**: CSS/SCSS (existing styles preserved)
- **Build Tool**: Vite 5.x
- **Module System**: ES6 modules
- **HTTP Client**: Axios 1.x
- **Routing**: React Router 6.x
- **State Management**: React Context API

### Architecture
- Component-based React application
- Reusable functional components
- Clear separation: components, pages, services
- Modern JavaScript with ES6+ features
- Build output: Optimized, code-split bundles

## Migration Goals

1. **Modernize Technology Stack**: Move from deprecated AngularJS to modern React
2. **Maintain User Experience**: Keep identical UI/UX to avoid user confusion
3. **Improve Developer Experience**: Use modern JavaScript instead of CoffeeScript
4. **Enable Future Growth**: Create a maintainable foundation for future features

## Development Environment

### System Requirements
- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher
- **OS**: macOS, Windows, or Linux

### Development Server
```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
```env
# .env.local (for development)
VITE_API_URL=https://api.taiga.io/api/v1
VITE_APP_TITLE=Taiga
VITE_APP_DEFAULT_LANGUAGE=en
```

### Connecting to Taiga API
- **Production API**: `https://api.taiga.io/api/v1`
- **Authentication**: Bearer token in Authorization header
- **CORS**: Handled by Vite proxy in development
- **Token Storage**: localStorage (matching current implementation)

## Minimal Scaffold Architecture

The React application will follow a standard component-based architecture:

- **Components**: Reusable UI elements
- **Pages**: Route-level components
- **Services**: API communication layer
- **Contexts**: Global state management
- **Hooks**: Custom React logic
- **Utils**: Helper functions

*See [scaffold-architecture.md](./scaffold-architecture.md) for detailed implementation.*

## Migration Approach

- **Complete Rewrite**: Full migration from AngularJS to React
- **Incremental Delivery**: Start with core features, expand gradually
- **UI/UX Preservation**: Maintain exact visual appearance
- **API Compatibility**: Use existing Taiga public API without changes

*See [migration-phases.md](./migration-phases.md) for detailed timeline and phases.*

## Component Migration Strategy

### CoffeeScript to JavaScript Conversion
1. Convert CoffeeScript files to ES6 JavaScript
2. Replace AngularJS directives with React components
3. Convert services to React hooks or context
4. Replace $scope with React state/props

### Style Migration
1. Keep existing SCSS structure initially
2. Extract component-specific styles
3. Gradually move to CSS modules if needed
4. Maintain exact visual appearance

### API Integration Pattern
```javascript
// Example service structure
class TaigaAPI {
  constructor() {
    this.baseURL = 'https://api.taiga.io/api/v1/';
    this.token = localStorage.getItem('token');
  }
  
  async getProjects() {
    const response = await axios.get(`${this.baseURL}projects`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }
}
```

## Feature Mapping

| AngularJS Feature | React Equivalent |
|------------------|------------------|
| Controllers | Function Components |
| Directives | Components |
| Services | Context/Hooks/Classes |
| Filters | Utility functions |
| $scope | useState/useContext |
| $http | Axios |
| ng-repeat | Array.map() |
| ng-if | Conditional rendering |
| ng-model | Controlled components |

## Testing Strategy

### Initial Phase (Minimal)
- Unit tests for critical business logic
- API service tests
- Authentication flow tests

### Later Phases
- Component testing with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress (future)

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|-------------------|
| Feature parity issues | Detailed feature inventory before migration |
| Style inconsistencies | Use existing CSS with minimal changes |
| API compatibility | Test against public API early |
| User disruption | Maintain identical UI/UX |
| Timeline slippage | Focus on core features first |

## Success Criteria

1. **Functional Parity**: All core features working identically
2. **Visual Parity**: UI looks exactly the same to users
3. **Developer Experience**: Easier to maintain and extend
4. **Testing Coverage**: Core flows have basic test coverage

## Out of Scope

- UI/UX redesign
- New features not in current application
- Backend API changes
- Mobile app development
- Accessibility improvements (initially)
- Browser compatibility beyond modern browsers
- Performance optimizations (initially)

## Appendix A: Current Module Inventory

### Core Modules (18+)
- Home/Dashboard
- Projects (List, Create, Detail)
- Backlog & Sprints
- Kanban Board
- Taskboard
- Epics
- Wiki
- Issues
- Team
- User Profile
- User Settings
- Admin Panel
- Search
- Notifications
- Authentication
- Discover
- External Apps
- Import/Export

### Component Count
- Controllers: 30+
- Directives: 100+
- Services: 36+
- Filters: Multiple
- Views/Templates: 200+

## Appendix B: API Endpoints

Primary API base: `https://api.taiga.io/api/v1/`

Key endpoints to integrate:
- `/auth` - Authentication
- `/projects` - Project management
- `/userstories` - User stories
- `/tasks` - Tasks
- `/issues` - Issues
- `/wiki` - Wiki pages
- `/users` - User management

---

**Document Status**: This is a living document and will be updated as the migration progresses.
