import './App.scss';
import { useState, useEffect } from 'react';
import { RoleSwitcher } from './components/RoleSwitcher/RoleSwitcher';
import { RequestForm } from './components/RequestForm/RequestForm';
import { UserRole } from './type/userRole';
import { RequestItem } from './type/requestItem';
import { RequestList } from './components/RequestList/RequestList';

export const App = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [isListVisible, setIsListVisible] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const saved = localStorage.getItem('my-requests');

    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  );
  const [filter, setFilter] = useState<'all' | 'new' | 'in progress' | 'done'>(
    'all',
  );

  const handleSaveRequest = (request: RequestItem) => {
    setRequests(prev => {
      const exists = prev.find(r => r.id === request.id);

      if (exists) {
        return prev.map(r => (r.id === request.id ? request : r));
      } else {
        const newId =
          prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
        const newRequest = { ...request, id: newId };

        return [...prev, newRequest];
      }
    });

    setSelectedRequest(null);
  };

  useEffect(() => {
    localStorage.setItem('my-requests', JSON.stringify(requests));
  }, [requests]);

  const filteredRequests =
    filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const handleStatusChange = (
    id: number,
    newStatus: 'new' | 'in progress' | 'done',
  ) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)),
    );

    setSelectedRequest(prev => {
      if (prev && prev.id === id) {
        return { ...prev, status: newStatus };
      }

      return prev;
    });
  };

  const handleDelete = (id: number) => {
    setRequests(prev => prev.filter(req => req.id !== id));

    setSelectedRequest(null);
  };

  type FilterStatus = 'all' | 'new' | 'in progress' | 'done';

  return (
    <div className="container">
      <header className="main-header">
        <div className="header-content">
          <RoleSwitcher currentRole={role} onChange={setRole} />
        </div>
      </header>

      <div className="main-layout">
        <button
          className="mobile-toggle"
          onClick={() => setIsListVisible(true)}
        >
          Watch the list <span className="arrow-icon">→</span>
        </button>

        <section className={`list-section ${isListVisible ? 'visible' : ''}`}>
          <div className="list-content">
            <button
              className="mobile-close"
              onClick={() => setIsListVisible(false)}
            >
              ←
            </button>
            <h2>My requests</h2>
            <div className="list-wrapper">
              {role === 'manager' && (
                <select
                  onChange={e => setFilter(e.target.value as FilterStatus)}
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              )}
              <div style={{ height: '20px' }}></div>
              <RequestList
                items={filteredRequests}
                onSelect={req => {
                  setSelectedRequest(req);
                  setIsListVisible(false);
                }}
                onClear={() => setSelectedRequest(null)}
                selectedRequestId={selectedRequest?.id}
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Create your request</h2>
          <RequestForm
            onSave={handleSaveRequest}
            currentRequest={selectedRequest}
            role={role}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  );
};
