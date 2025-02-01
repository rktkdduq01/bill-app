const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
