import { useEffect, useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('Loading...');
    const [error, setError] = useState(null);
    const [backendStatus, setBackendStatus] = useState('Checking...');

    useEffect(() => {
        fetch('http://localhost:5000')  // 백엔드 API 요청
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }
                return response.text();
            })
            .then(data => {
                setMessage(data);
                setBackendStatus('✅ 백엔드 정상 작동 중');
            })
            .catch(error => {
                setError(error.message);
                setBackendStatus('❌ 백엔드 연결 실패');
            });
    }, []);

    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold">법안 정보 플랫폼</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">{backendStatus}</p>
            {error ? <p className="text-red-500">❌ {error}</p> : <p>{message}</p>}
        </div>
    );
}