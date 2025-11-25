const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let users = [];
let operations = [];

app.post("/api/register", (req, res) => {
    const { phone, pass } = req.body;
    if (!phone || !pass) return res.json({ ok: false, msg: "بيانات ناقصة" });

    if (users.find(u => u.phone === phone))
        return res.json({ ok: false, msg: "الحساب موجود مسبقاً" });

    users.push({ phone, pass });
    res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
    const { phone, pass } = req.body;

    let user = users.find(u => u.phone === phone && u.pass === pass);
    if (!user) return res.json({ ok: false, msg: "بيانات الدخول غير صحيحة" });

    res.json({ ok: true, token: phone });
});

app.post("/api/operation", (req, res) => {
    const { token, amount, opNum } = req.body;

    if (!token) return res.json({ ok: false, msg: "مستخدم غير مسجل" });

    operations.push({
        phone: token,
        amount,
        opNum,
        date: new Date().toLocaleString("ar-EG")
    });

    res.json({ ok: true });
});

app.get("/api/operations", (req, res) => {
    const phone = req.query.token;
    let ops = operations.filter(o => o.phone === phone);
    res.json(ops.slice(-30).reverse());
});

app.get("/", (req, res) => {
    res.send("Server running ✔️");
});

const PORT = 10000;
app.listen(PORT, () => console.log("Running on " + PORT));
