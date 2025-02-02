import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState("Checking...");

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
        {children}
      </body>
    </html>
  );
}
