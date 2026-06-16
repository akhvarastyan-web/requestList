import { RequestItem } from '../../type/requestItem';
import './RequestList.css';

interface RequestListProps {
  items: RequestItem[];
  onSelect: (request: RequestItem) => void;
  onClear: () => void;
  selectedRequestId?: number;
}

export const RequestList: React.FC<RequestListProps> = ({
  items,
  onSelect,
  onClear,
  selectedRequestId,
}) => {
  return (
    <div className="request-list">
      {items.length === 0 ? (
        <p className="empty-text">No requests created yet.</p>
      ) : (
        <ul className="request-ul">
          {[...items]
            .sort((a, b) => b.id - a.id)
            .map(req => (
              <li
                key={req.id}
                className={`request-item ${req.id === selectedRequestId ? 'active' : ''}`}
                onClick={() => onSelect(req)}
              >
                <div className="title-item">
                  {req.title}
                  {req.status === 'new' && (
                    <span className="new-label">NEW</span>
                  )}
                </div>
                <span
                  className="delete-btn"
                  onClick={e => {
                    e.stopPropagation();
                    onClear();
                  }}
                >
                  ×
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
