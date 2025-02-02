import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const router = useRouter();

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

  const handleRegister = async () => {
    setRegisterError("");
    setRegisterSuccess("");

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setRegisterSuccess("✅ 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      setTimeout(() => {
        router.push("/login"); // 회원가입 후 로그인 페이지로 이동
      }, 2000);
    } else {
      setRegisterError(data.message);
    }
  };

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
        <div className="p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">회원가입</h1>
          {registerError && <p className="text-red-500">{registerError}</p>}
          {registerSuccess && <p className="text-green-500">{registerSuccess}</p>}
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md my-2"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md my-2"
          />
          <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded w-full">
            회원가입
          </button>
        </div>
        {children}
      </body>
    </html>
  );
}
