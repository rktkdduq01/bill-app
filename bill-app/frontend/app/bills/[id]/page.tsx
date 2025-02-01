"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Bill {
  id: number;
  title: string;
  status: string;
  summary: string;
  votes: { agree: number; disagree: number };
  comments: { id: number; text: string }[];
}

export default function BillDetailPage() {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch(`http://localhost:5000/api/bills/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("법안을 찾을 수 없습니다.");
        }
        return res.json();
      })
      .then((data) => {
        setBill(data);
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleVote = (voteType: "agree" | "disagree") => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:5000/api/bills/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteType }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "이미 투표하셨습니다.") {
          alert("이미 투표하셨습니다.");
        } else {
          setBill((prev) => prev ? { ...prev, votes: data.votes } : null);
        }
      });
  };

  const handleCommentSubmit = () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`http://localhost:5000/api/bills/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
        setNewComment("");
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{bill?.title}</h1>
      <p className="text-lg text-gray-500">{bill?.status}</p>
      <p className="text-gray-700">{bill?.summary}</p>

      <div className="mt-4 flex gap-4">
        <button onClick={() => handleVote("agree")} className="bg-green-500 text-white px-4 py-2 rounded">
          👍 찬성 ({bill?.votes.agree})
        </button>
        <button onClick={() => handleVote("disagree")} className="bg-red-500 text-white px-4 py-2 rounded">
          👎 반대 ({bill?.votes.disagree})
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">댓글</h2>
        <ul className="mt-2 space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="p-2 border rounded-lg">
              {comment.text}
            </li>
          ))}
        </ul>
        {token && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="댓글 입력..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button onClick={handleCommentSubmit} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              댓글 작성
            </button>
          </div>
        )}
      </div>

      <a href="/bills" className="text-blue-600 hover:underline mt-4 block">← 법안 목록으로 돌아가기</a>
    </div>
  );
}