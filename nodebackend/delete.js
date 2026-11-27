import { error } from "node:console";
import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const students = [
    { id: 1, name: "ram", age: 20, course: "Computer Science" },
    { id: 2, name: "sree", age: 21, course: "Information Technology" },
    { id: 3, name: "naveen", age: 22, course: "Electronics" }
];

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
    try {
        const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
        const pathname = url.pathname;

        if (req.method === "GET" && pathname === "/students") {
            sendJson(res, 200, { students });
            return;
        }
        const studentMatch = pathname.match(/^\/students\/(\d+)$/);

        if (req.method === "DELETE" && studentMatch) {
          const studentId = Number(studentMatch[1]);
          const studentIndex = students.findIndex((s) => s.id === studentId);

          if (studentIndex === -1) {
            sendJson(res, 404, { error: `Student with id ${studentId} not found` });
            return;
          }

          const [deletedStudent] = students.splice(studentIndex, 1);
          sendJson(res, 200, {
            message: "Student deleted",
            deletedStudent
          });
          return;
        }


        sendJson(res, 404, { error: "Route not found" });
    } catch (err) {
        console.error("Server error:", err);
        sendJson(res, 500, { error: "Internal server error" });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});