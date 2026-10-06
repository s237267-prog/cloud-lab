import React, { useState, useEffect } from 'react';

const API_BASE = 'https://musical-train-qv95rrwjqqggh46jj-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [mssv, setMssv] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_BASE}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mssv, name, email })
        });
        setEditingId(null);
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mssv, name, email })
        });
      }
      setMssv('');
      setName('');
      setEmail('');
      fetchStudents();
    } catch (err) {
      alert('Lỗi kết nối Backend!');
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
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', color: '#000000', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#000000' }}>Quản lý Sinh viên - MERN Stack (v2.0)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input placeholder="MSSV" value={mssv} onChange={e => setMssv(e.target.value)} required style={{ padding: '8px', flex: 1, color: '#000', backgroundColor: '#fff', border: '1px solid #ccc' }} />
        <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px', flex: 1, color: '#000', backgroundColor: '#fff', border: '1px solid #ccc' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px', flex: 1, color: '#000', backgroundColor: '#fff', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', color: '#000', fontWeight: 'bold' }}>
          {editingId ? 'Cập nhật' : 'Thêm Sinh viên'}
        </button>
        {editingId && <button onClick={() => { setEditingId(null); setMssv(''); setName(''); setEmail(''); }} style={{ color: '#000' }}>Hủy</button>}
      </form>

      <h3 style={{ color: '#000000' }}>Danh sách Sinh viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.length === 0 ? (
          <li style={{ color: '#000000', fontStyle: 'italic' }}>Không có sinh viên trong danh sách.</li>
        ) : (
          students.map(s => (
            <li key={s._id} style={{ padding: '10px 0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000000' }}>
              <span style={{ color: '#000000', fontWeight: 'bold' }}>
                {s.mssv} - {s.name} - <span style={{ color: '#000000', fontStyle: 'italic', fontWeight: 'normal' }}>{s.email}</span>
              </span>
              <div>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '5px', padding: '4px 8px', cursor: 'pointer', color: '#000' }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)} style={{ padding: '4px 8px', cursor: 'pointer', color: '#000' }}>Xóa</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
