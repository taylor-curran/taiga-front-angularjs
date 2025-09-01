# Task: Implement Public Projects Page for Taiga React Migration

## Context
You're working on migrating the Taiga frontend from AngularJS to React. The scaffold and home page have been completed. Now we need to implement the Public Projects page that lists all public projects with search and filtering capabilities.

## Current State
- **Working Directory**: `/Users/taylorcurran/Documents/demos/homemade/taiga-front-migration-target`
- **Tech Stack**: React 18, Vite 5, React Router 6, Axios
- **API Base URL**: `https://api.taiga.io/api/v1` (configured in `.env` as `VITE_API_URL`)
- **Dev Server**: Runs on port 3001 (`npm run dev`)
- **Existing Components**: Home page with `FeaturedProjects`, `HighlightedProjects`, `ProjectCard` components already implemented

## Requirements

### 1. Public Projects Page (`/projects` route)
Update the existing placeholder at `src/pages/Projects.jsx` to implement:

#### Core Features:
- Display all public projects using the `/projects` endpoint
- Reuse the existing `ProjectCard` component from `src/components/common/ProjectCard.jsx`
- Implement pagination (API returns paginated results)
- Show total project count
- Loading state while fetching data

#### Search & Filter Functionality:
- **Search bar**: Filter projects by name/description (use `?q=searchterm` query param)
- **Sorting options**: 
  - Most liked (`order_by=-total_fans`)
  - Most active (`order_by=-total_activity`)
  - Recently created (`order_by=-created_date`)
  - Alphabetical (`order_by=name`)
- **Filter by tags**: If project has tags (check `tags_colors` field)
- **Filter toggles**:
  - Looking for contributors (`is_looking_for_people=true`)
  - Featured projects (`is_featured=true`)

#### Layout Requirements:
- **Grid layout**: 4 columns on desktop, 2 on tablet, 1 on mobile
- Projects should use the same card style as the home page
- Add proper spacing between cards (use `gap: 1rem`)
- Ensure cards are uniform height with flexbox

### 2. API Service Functions
Add these functions to `src/services/api.js`:

```javascript
// Fetch paginated public projects
export const fetchPublicProjects = async (params = {}) => {
  const queryParams = {
    page_size: 20,
    ...params
  };
  const response = await api.get('/projects', { params: queryParams });
  return {
    projects: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    nextPage: response.headers['x-pagination-next'],
    prevPage: response.headers['x-pagination-prev']
  };
};

// Search projects
export const searchProjects = async (query, filters = {}) => {
  const params = {
    q: query,
    ...filters,
    page_size: 20
  };
  return fetchPublicProjects(params);
};
```

### 3. Styling Requirements
Create `src/styles/pages/Projects.css`:
- **IMPORTANT**: Implement CSS styling from the start, not as an afterthought
- Match the visual style of the home page
- Use CSS Grid or Flexbox for the project grid
- Ensure responsive breakpoints work properly
- Add hover effects consistent with existing ProjectCard component

### 4. Component Structure
```jsx
// Main structure for Projects.jsx
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({});
  
  // Fetch projects on mount and when filters change
  // Implement search with debouncing
  // Handle pagination
  
  return (
    <div className="projects-page">
      {/* Search bar */}
      {/* Filter controls */}
      {/* Results count */}
      {/* Projects grid */}
      {/* Pagination controls */}
    </div>
  );
};
```

## Important Notes & Pitfalls to Avoid

### From Previous Session:
1. **Test frequently**: Run `npm run dev` and check the browser after each major change
2. **Style as you go**: Don't leave CSS for the end - implement visual design alongside functionality
3. **Grid layout**: Ensure the 4-column grid works on desktop (use `display: grid` or `flex` with proper calculations)
4. **API response structure**: The projects API returns an array directly, pagination info is in headers

### API Response Example:
```json
[
  {
    "id": 123,
    "name": "Project Name",
    "slug": "project-slug",
    "description": "Project description",
    "logo_small_url": "https://...",
    "tags_colors": {"tag1": "#color1"},
    "total_fans": 42,
    "total_watchers": 10,
    "is_private": false,
    "is_looking_for_people": false,
    "is_featured": false
  }
]
```

### Testing Checklist:
- [ ] Page loads without errors
- [ ] Projects display in 4-column grid on desktop
- [ ] Search functionality works
- [ ] Sorting changes results appropriately  
- [ ] Filters apply correctly
- [ ] Pagination works
- [ ] Responsive design works on mobile/tablet
- [ ] Loading states display properly
- [ ] Empty state when no results

## Success Criteria
1. The page successfully fetches and displays public projects from the Taiga API
2. Search and filter functionality works as expected
3. Visual layout matches the existing home page style with proper grid layout
4. The page is responsive and works on different screen sizes
5. Code follows the existing patterns in the codebase (hooks, API service, CSS organization)

## Files to Create/Modify:
- `src/pages/Projects.jsx` - Main implementation
- `src/styles/pages/Projects.css` - Styling
- `src/services/api.js` - Add new API functions

Remember to commit your changes with clear commit messages and test thoroughly before marking the task complete!
