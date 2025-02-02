import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "대한민국 법안 정보 플랫폼",
  description: "발의된 법안을 검색하고, 요약된 내용을 확인하며 의견을 나누는 공간입니다.",
};

interface Bill {
  id: number;
  title: string;
  status: string;
  summary: string;
  votes: { agree: number; disagree: number };
  comments: { id: number; text: string }[];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState<Bill | null>(null);
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const { id } = useParams();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("http://localhost:5000") // 백엔드 API 요청
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }
        return response.text();
      })
      .then((data) => {
        setMessage(data);
        setBackendStatus("✅ 백엔드 정상 작동 중");
      })
      .catch((error) => {
        setError(error.message);
        setBackendStatus("❌ 백엔드 연결 실패");
      });
  }, []);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = (query = "") => {
    const url = query ? `http://localhost:5000/api/bills/search?q=${query}` : "http://localhost:5000/api/bills";
    setLoading(true);
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      });
  };

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

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold">법안 정보 플랫폼</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">{backendStatus}</p>
          {error ? <p className="text-red-500">❌ {error}</p> : <p>{message}</p>}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">발의된 법안 목록</h1>
          <input
            type="text"
            placeholder="법안 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <ul className="space-y-4">
            {bills.map((bill) => (
              <li key={bill.id} className="p-4 border rounded-lg shadow">
                <h2 className="text-lg font-semibold">
                  <Link href={`/bills/${bill.id}`} className="text-blue-600 hover:underline">
                    {bill.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">{bill.status}</p>
                <p className="text-gray-700">{bill.summary}</p>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </body>
    </html>
  );
}
