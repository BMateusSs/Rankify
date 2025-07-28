import React, { useState } from 'react'
import { useEffect } from 'react'

interface useInfoFetchResult<T> {
    data: T | null,
    loading: boolean,
    error: string | null
}

export function useInfoFetch<T>(url: string, artist: string, album: string): useInfoFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artist, album })
                });

                if (!response.ok) {
                    throw new Error(`Erro: ${response.status}`);
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (err: any) {
                setError(err.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, artist, album]);

    return { data, loading, error };
}
