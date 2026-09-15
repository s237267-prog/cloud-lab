import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [mssv, setMssv] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const getApiUrl = () => {
    const host = window.location.hostname;
    if (host.includes('app.github.dev')) {
      const backendHost = host.replace('-3000.', '-5000.');
      return `${window.location.protocol}//${backendHost}/api/students`;
    }
    return '/api/students';
  };

  const API_URL = getApiUrl();

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mssv, name, email }),
      });
      if (res.ok) {
        setMssv(''); setName(''); setEmail('');
        fetchStudents();
      } else {
        const errorData = await res.json();
        alert('Lỗi Server: ' + (errorData.error || 'Không thể thêm sinh viên'));
      }
    } catch (err) {
      alert('Lỗi kết nối API Backend');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2>Quản lý Sinh viên (MERN Stack - Docker Compose)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input placeholder="MSSV" value={mssv} onChange={e => setMssv(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Thêm Sinh viên</button>
      </form>

      <h3>Danh sách Sinh viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.length === 0 ? (
          <li>Chưa có sinh viên nào trong danh sách.</li>
        ) : (
          students.map((s) => (
            <li key={s._id || s.mssv} style={{ padding: '10px 0', borderBottom: '1px solid #444' }}>
              <strong>{s.mssv}</strong> - {s.name} - <em>{s.email}</em>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
