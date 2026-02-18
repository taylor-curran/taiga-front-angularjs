import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersService } from '../../services/users.service';

const ProfileContacts = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    usersService
      .getUserContacts(user.id)
      .then((data) => setContacts(data))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="empty-tab">
        <p>No contacts yet.</p>
      </div>
    );
  }

  return (
    <div className="profile-contacts">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact-item">
          <img
            src={contact.photo || '/images/default-avatar.png'}
            alt={contact.full_name_display}
            className="contact-avatar"
          />
          <div className="contact-info">
            <Link to={`/profile/${contact.username}`} className="contact-name">
              {contact.full_name_display}
            </Link>
            <span className="contact-username">@{contact.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileContacts;
