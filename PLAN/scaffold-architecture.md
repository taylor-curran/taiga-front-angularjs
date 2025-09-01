# React Scaffold Architecture

## Project Structure

```
taiga-react/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── cards/
│   │   │   ├── ProjectCard.jsx
│   │   │   └── TaskCard.jsx
│   │   └── forms/
│   │       ├── LoginForm.jsx
│   │       └── ProjectForm.jsx
│   ├── pages/               # Page-level components (routes)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Backlog.jsx
│   │   └── KanbanBoard.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── UserContext.jsx
│   │   └── ProjectContext.jsx
│   ├── services/            # API service layer
│   │   ├── api.js          # Base API configuration
│   │   ├── auth.service.js
│   │   ├── projects.service.js
│   │   └── tasks.service.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useProjects.js
│   │   └── useApi.js
│   ├── utils/               # Helper functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── styles/              # Global styles
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── components/
│   ├── App.jsx              # Main app component
│   ├── App.css
│   └── main.jsx            # Entry point
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Base Components

### Layout Component
```jsx
// src/components/common/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
```

### Router Setup
```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

## API Service Layer

### Base API Configuration
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.taiga.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    const lang = localStorage.getItem('lang') || 'en';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Service
```javascript
// src/services/auth.service.js
import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth', {
      type: 'normal',
      username,
      password,
    });
    const { auth_token, ...userData } = response.data;
    localStorage.setItem('token', auth_token);
    localStorage.setItem('user', JSON.stringify(userData));
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async refreshToken(token) {
    const response = await api.post('/auth/refresh', { token });
    localStorage.setItem('token', response.data.auth_token);
    return response.data;
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
```

## Context Providers

### Auth Context
```jsx
// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Migration Pattern Example

### Original AngularJS Directive (CoffeeScript)
```coffeescript
# app/modules/components/project-card/project-card.directive.coffee
ProjectCardDirective = ($rootScope, $tgAuth) ->
    return {
        templateUrl: "components/project-card/project-card.html"
        scope: {
            project: "="
        }
        link: (scope, el, attrs) ->
            scope.isOwner = ->
                return scope.project.owner == $tgAuth.getUser().id
            
            scope.goToProject = ->
                $rootScope.$broadcast("project:selected", scope.project)
    }

angular.module("taigaComponents").directive("tgProjectCard", ProjectCardDirective)
```

### Migrated React Component (JavaScript)
```jsx
// src/components/cards/ProjectCard.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isOwner = () => {
    return project.owner === user?.id;
  };
  
  const goToProject = () => {
    navigate(`/project/${project.slug}`);
  };
  
  return (
    <div className="project-card" onClick={goToProject}>
      <div className="project-card-header">
        <img src={project.logo_small_url} alt={project.name} />
        <h3>{project.name}</h3>
      </div>
      <div className="project-card-body">
        <p>{project.description}</p>
      </div>
      <div className="project-card-footer">
        {isOwner() && <span className="owner-badge">Owner</span>}
        <span className="project-members">{project.members.length} members</span>
      </div>
    </div>
  );
};

export default ProjectCard;
```

## Environment Configuration

### .env.example
```env
# API Configuration
VITE_API_URL=https://api.taiga.io/api/v1

# Optional: Development API
# VITE_API_URL=http://localhost:8000/api/v1

# App Configuration
VITE_APP_TITLE=Taiga
VITE_APP_DEFAULT_LANGUAGE=en

# Feature Flags (optional)
VITE_ENABLE_GITHUB_LOGIN=false
VITE_ENABLE_GITLAB_LOGIN=false
```

## Package.json Dependencies
```json
{
  "name": "taiga-react",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "moment": "^2.29.0",
    "lodash": "^4.17.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react": "^7.0.0"
  }
}
```

## Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.taiga.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```
