const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const users = []; // 임시 메모리 저장 (실제 운영 시 PostgreSQL 사용)

// JWT 비밀키
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// 회원가입 API
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (users.find((user) => user.username === username)) {
        return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);

    res.json({ message: "회원가입 성공!" });
});

// 로그인 API
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "로그인 성공!", token, username: user.username });
});

// 사용자 정보 조회 API
router.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "토큰이 필요합니다." });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
        res.json({ userId: user.userId, username: user.username });
    });
});

module.exports = router;
