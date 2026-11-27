import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const students = [
  { id: 1, name: "Karthick Kishore", department: "CSE", year: 3, email: "karthick@example.com" },
  { id: 2, name: "Kanthan S", department: "CSE", year: 3, email: "kanthan@example.com" },
  { id: 3, name: "Jayakanth R", department: "ECE", year: 2, email: "jayakanth@example.com" }
];

app.get("/", (req, res) => {
  res.json({ message: "Student API is running" });
});


app.get("/api/students", (req, res) => {
  const { department } = req.query;

  if (department) {
    const filtered = students.filter(
      (s) => s.department.toLowerCase() === String(department).toLowerCase()
    );
    res.json({ count: filtered.length, students: filtered });
    return;
  }

  res.json({ count: students.length, students });
});


app.get("/api/students/:id", (req, res) => {
  const studentId = Number(req.params.id);

  if (!Number.isInteger(studentId) || studentId <= 0) {
    res.status(400).json({ error: "Invalid student ID. Must be a positive integer." });
    return;
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    res.status(404).json({ error: `Student with ID ${studentId} not found.` });
    return;
  }

  res.json({ student });
});

app.listen(PORT, () => {
  console.log(`Student API running at http://localhost:${PORT}`);
});