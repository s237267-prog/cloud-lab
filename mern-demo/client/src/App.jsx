import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [mssv, setMssv] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Lấy domain hiện tại của Codespaces và đổi từ port 3000 sang 5000
  const API_BASE = window.location.origin.replace('-3000', '-5000');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/students`);
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
    const url = editingId ? `${API_BASE}/api/students/${editingId}` : `${API_BASE}/api/students`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mssv, name, email }),
      });
      if (res.ok) {
        setMssv(''); setName(''); setEmail(''); setEditingId(null);
        fetchStudents();
      } else {
        const errData = await res.json();
        alert('Lỗi từ Server: ' + (errData.error || 'Không thêm được'));
      }
    } catch (err) {
      alert('Lỗi kết nối API: ' + err.message);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setMssv(s.mssv);
    setName(s.name);
    setEmail(s.email);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2>Quản lý Sinh viên (MERN Stack Full CRUD)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input placeholder="MSSV" value={mssv} onChange={e => setMssv(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {editingId ? 'Cập nhật' : 'Thêm Sinh viên'}
        </button>
        {editingId && <button onClick={() => { setEditingId(null); setMssv(''); setName(''); setEmail(''); }}>Hủy</button>}
      </form>

      <h3>Danh sách Sinh viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.length === 0 ? (
          <li>Chưa có sinh viên nào trong danh sách.</li>
        ) : (
          students.map((s) => (
            <li key={s._id} style={{ padding: '10px 0', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>{s.mssv}</strong> - {s.name} - <em>{s.email}</em></span>
              <div>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)}>Xóa</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
