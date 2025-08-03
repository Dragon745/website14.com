import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

export default function TestClient() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Test Client Portal</title>
            </Head>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Test Client Portal</h1>
                {user ? (
                    <div>
                        <p>User is logged in: {user.email}</p>
                        <p>User ID: {user.uid}</p>
                        <a href="/client" className="text-blue-600 hover:underline">
                            Go to Client Portal
                        </a>
                    </div>
                ) : (
                    <div>
                        <p>No user logged in</p>
                        <a href="/login" className="text-blue-600 hover:underline">
                            Go to Login
                        </a>
                    </div>
                )}
            </div>
        </>
    );
} 