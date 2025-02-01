const express = require('express');
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// 샘플 법안 데이터
const bills = [
    { id: 1, title: '데이터 보호법 개정안', status: '발의', summary: '개인정보 보호 강화', votes: { agree: 0, disagree: 0 }, comments: [] },
    { id: 2, title: '노동법 개정안', status: '심사 중', summary: '근로시간 단축 조정', votes: { agree: 0, disagree: 0 }, comments: [] }
];

// 사용자별 투표 기록 저장 (실제 운영 시 DB 사용)
const userVotes = {};

router.get('/', (req, res) => {
    res.json(bills);
});

router.get('/:id', (req, res) => {
    const bill = bills.find(b => b.id == req.params.id);
    if (bill) {
        res.json(bill);
    } else {
        res.status(404).json({ message: '법안을 찾을 수 없습니다.' });
    }
});

router.get('/search', (req, res) => {
    const query = req.query.q?.toLowerCase();
    if (!query) {
        return res.status(400).json({ message: '검색어를 입력하세요.' });
    }

    const filteredBills = bills.filter(bill => 
        bill.title.toLowerCase().includes(query) || 
        bill.summary.toLowerCase().includes(query)
    );

    res.json(filteredBills);
});

// 찬반 투표 API (로그인 필요)
router.post('/:id/vote', authenticateToken, (req, res) => {
    const { voteType } = req.body;
    const bill = bills.find((b) => b.id == req.params.id);

    if (!bill) return res.status(404).json({ message: '법안을 찾을 수 없습니다.' });

    const userId = req.user.userId;
    if (!userVotes[userId]) userVotes[userId] = {};

    if (userVotes[userId][bill.id]) {
        return res.status(400).json({ message: '이미 투표하셨습니다.' });
    }

    if (voteType !== "agree" && voteType !== "disagree") {
        return res.status(400).json({ message: '잘못된 투표 유형입니다.' });
    }

    bill.votes[voteType]++;
    userVotes[userId][bill.id] = voteType;

    res.json({ message: '투표 완료!', votes: bill.votes });
});

// 댓글 추가 API (로그인 필요)
router.post('/:id/comments', authenticateToken, (req, res) => {
    const { text } = req.body;
    const bill = bills.find(b => b.id == req.params.id);

    if (!bill) {
        return res.status(404).json({ message: '법안을 찾을 수 없습니다.' });
    }

    if (!text) {
        return res.status(400).json({ message: '댓글 내용을 입력하세요.' });
    }

    const newComment = { id: bill.comments.length + 1, userId: req.user.userId, text };
    bill.comments.push(newComment);
    res.json({ message: '댓글 추가 완료!', comments: bill.comments });
});

module.exports = router;
