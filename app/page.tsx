export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">대한민국 법안 정보 플랫폼</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 text-center sm:text-left">
          발의된 법안을 검색하고, 요약된 내용을 확인하며 의견을 나누는 공간입니다.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/bills"
            >
          법안 목록 보기
          </a>

          <a
            className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/about"
          >
            플랫폼 소개
          </a>
          
          <a
            className="rounded-full border border-solid border-green-500 transition-colors flex items-center justify-center bg-green-600 text-white gap-2 hover:bg-green-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/login"
          >
            로그인 / 회원가입
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact"
        >
          문의하기
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/faq"
        >
          자주 묻는 질문
        </a>
      </footer>
    </div>
  );
}
