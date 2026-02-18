const TeamFilters = ({ roles, activeRole, onRoleSelect }) => {
  return (
    <ul className="team-filters">
      <li className={!activeRole ? 'active' : ''}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onRoleSelect(null);
          }}
        >
          <span className="title">All</span>
          <span className="icon-arrow-right" />
        </a>
      </li>
      {roles.map((role) => (
        <li
          key={role.id}
          className={activeRole?.id === role.id ? 'active' : ''}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRoleSelect(role);
            }}
          >
            <span className="title">{role.name}</span>
            <span className="icon-arrow-right" />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default TeamFilters;
