import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
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
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email })
      });
      setStudentId('');
      setName('');
      setEmail('');
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản lý Sinh viên</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="MSSV" value={studentId} onChange={(e) => setStudentId(e.target.value)} required style={{ marginRight: '8px', padding: '6px' }} />
        <input type="text" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} required style={{ marginRight: '8px', padding: '6px' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginRight: '8px', padding: '6px' }} />
        <button type="submit" style={{ padding: '6px 12px' }}>Thêm Sinh viên</button>
      </form>

      <h3>Danh sách Sinh viên</h3>
      <ul>
        {students.map((st) => (
          <li key={st._id}>{st.studentId} - {st.name} - {st.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
