import { useState } from 'react';

const ProfileTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="timeline-wrapper">
      <div className="profile-tabs-nav">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-button${activeTab === index ? ' active' : ''}`}
            onClick={() => setActiveTab(index)}
            title={tab.title}
          >
            <span className={`tab-icon ${tab.icon}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default ProfileTabs;
