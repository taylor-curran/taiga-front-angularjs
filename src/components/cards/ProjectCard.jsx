import { useNavigate } from 'react-router-dom';
import './ProjectCard.scss';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const goToProject = () => {
    navigate(`/project/${project.slug}`);
  };

  return (
    <div className="project-card" onClick={goToProject}>
      {project.tags && project.tags.length > 0 && (
        <div className="tags-container">
          {project.tags.map(([name, color]) => (
            <span
              key={name}
              className="project-tag"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
      <div className="project-card-inner">
        <div className="project-card-header">
          <div className="project-card-logo">
            {project.logo_small_url ? (
              <img src={project.logo_small_url} alt={project.name} />
            ) : (
              <div className="project-card-logo-empty" />
            )}
          </div>
          <div className="project-card-name">
            <a>{project.name}</a>
          </div>
        </div>
        <div className="project-card-description">
          <p>{project.description}</p>
        </div>
        <div className="project-card-statistics">
          <span className="statistic">
            {project.members.length} members
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
