import { createServer } from "node:http";

const PORT = 3000;
const students = [
  { id: 1, name: "Ram", department: "CSE" },
  { id: 2, name: "Sree", department: "ECE" },
  { id: 3, name: "Naveen", department: "Mech" },
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function parseJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    // GET

    if (req.method === "GET" && url.pathname === "/students") {
      sendJson(res, 200, { students });
      return;
    }
// POST
    if (req.method === "POST" && url.pathname === "/students") {
      const body = await parseJsonBody(req);

      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        sendJson(res, 400, { error: "Student 'name' is required." });
        return;
      }

      if (!body.department || typeof body.department !== "string" || !body.department.trim()) {
        sendJson(res, 400, { error: "Student 'department' is required." });
        return;
      }

      const newStudent = {
        id: students.length + 1,
        name: body.name.trim(),
        department: body.department.trim()
      };

      students.push(newStudent);
      sendJson(res, 201, { message: "Student Added successfully", student: newStudent });
      return;
    }

    // Put

    const studentMatch = pathname.match(/^\/students\/(\d+)$/);

    if (req.method === "PUT" && studentMatch) {
      const studentId = Number(studentMatch[1]);
      const studentIndex = students.findIndex((s) => s.id === studentId);

      if (studentIndex === -1) {
        sendJson(res, 404, { error: `Student with id ${studentId} not found` });
        return;
      }

      const body = await parseJsonBody(req);

      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        sendJson(res, 400, { error: "Name is required" });
        return;
      }

      if (!body.department || typeof body.department !== "string" || !body.department.trim()) {
        sendJson(res, 400, { error: "Student 'department' is required" });
        return;
      }

      const updatedStudent = {
        id: studentId,
        name: body.name.trim(),
        department: body.department.trim()
      };

      students[studentIndex] = updatedStudent;
      sendJson(res, 200, { message: "Updated successfully", student: updatedStudent });
      return;
    }



    sendJson(res, 404, { error: "Route not found" });
  } catch (err) {
    if (err instanceof SyntaxError) {
      sendJson(res, 400, { error: "Invalid JSON payload" });
      return;
    }
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});