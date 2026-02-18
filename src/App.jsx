import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectCard from './components/cards/ProjectCard';

function App() {
  const sampleProject = {
    id: 1,
    name: 'Sample Project',
    slug: 'sample-project',
    description: 'A sample project to demonstrate style migration from AngularJS to React.',
    logo_small_url: null,
    owner: 1,
    members: [{ id: 1 }, { id: 2 }, { id: 3 }],
    tags: [
      ['design', '#E44057'],
      ['frontend', '#93C45D'],
    ],
    is_private: false,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <div className="wrapper">
              <div className="main">
                <div className="header-with-actions">
                  <header>
                    <h1>Style Migration Demo</h1>
                  </header>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  <ProjectCard project={sampleProject} />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
