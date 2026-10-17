const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Cấu hình CORS mở rộng cho phép kết nối cross-domain từ Frontend
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. Kết nối CSDL MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('LỖI: Chưa cấu hình MONGODB_URI trong file .env!');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Atlas connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// 3. Khai báo Schema và Model
const studentSchema = new mongoose.Schema({
  mssv: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// 4. Endpoint Health Check phục vụ Cloud Monitoring & Rolling Updates
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 5. Các Endpoint CRUD (Hỗ trợ cả tiền tố /api/students và /students)

// GET: Lấy danh sách sinh viên
app.get(['/api/students', '/students'], async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Thêm sinh viên mới
app.post(['/api/students', '/students'], async (req, res) => {
  try {
    const { mssv, name, email } = req.body;
    const newStudent = new Student({ mssv, name, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Cập nhật thông tin sinh viên
app.put(['/api/students/:id', '/students/:id'], async (req, res) => {
  try {
    const { mssv, name, email } = req.body;
    const updated = await Student.findByIdAndUpdate(req.params.id, { mssv, name, email }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Xóa sinh viên
app.delete(['/api/students/:id', '/students/:id'], async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));