import styles from './ProjectCardModule.module.scss';

const ProjectCardCSSModuleExample = ({ project }) => {
  return (
    <div className={styles.card}>
      {project.tags && project.tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {project.tags.map(([name, color]) => (
            <span
              key={name}
              className={styles.tag}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.logo}>
            {project.logo_small_url ? (
              <img src={project.logo_small_url} alt={project.name} />
            ) : (
              <div className={styles.logoEmpty} />
            )}
          </div>
          <div className={styles.name}>
            <a>{project.name}</a>
          </div>
        </div>
        <div className={styles.description}>
          <p>{project.description}</p>
        </div>
        <div className={styles.statistics}>
          <span className={styles.statistic}>
            {project.members.length} members
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardCSSModuleExample;
