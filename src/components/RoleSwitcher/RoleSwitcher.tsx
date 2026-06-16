import { UserRole } from '../../type/userRole';
import './RoleSwitcher.css';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onChange,
}) => {
  return (
    <div className="role-switcher">
      <span className={`label ${currentRole === 'user' ? 'active' : ''}`}>
        User
      </span>

      <div
        className="switch-track"
        onClick={() => onChange(currentRole === 'user' ? 'manager' : 'user')}
      >
        <div className={`switch-thumb ${currentRole}`} />
      </div>

      <span className={`label ${currentRole === 'manager' ? 'active' : ''}`}>
        Manager
      </span>
    </div>
  );
};
