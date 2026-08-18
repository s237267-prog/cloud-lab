const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Câu 35: Tạo Schema và Model Student (studentId, name, email)
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema, 'students');

// Câu 36: API GET /api/students (Lấy danh sách sinh viên)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Câu 37: API POST /api/students (Thêm sinh viên mới)
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Câu 38: API PUT /api/students/:id (Cập nhật sinh viên)
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Câu 39: API DELETE /api/students/:id (Xóa sinh viên)
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});