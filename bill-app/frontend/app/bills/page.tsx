"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Bill {
  id: number;
  title: string;
  status: string;
  summary: string;
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchBills(e.target.value);
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">발의된 법안 목록</h1>
      
      {/* 🔍 검색 입력창 */}
      <input
        type="text"
        placeholder="법안 검색..."
        value={searchTerm}
        onChange={handleSearch}
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
  );
}