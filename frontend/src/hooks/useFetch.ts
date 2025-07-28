import React, { useState } from 'react'
import { useEffect } from 'react'

interface useFetchResult<T> {
    data: T | null,
    loading: boolean,
    error: string | null
}

export function useFetch<T>(url: string, options?: RequestInit): useFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async  () => {
            try {
                const response = await fetch(url, options);
                if (!response.ok){
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setData(data)
            } catch(err:any){
                setError(err.message || 'Erro desconhecido')
            } finally{
                setLoading(false)
            }
        };
        fetchData()
    }, [url, options]);

    return {data, error, loading};
}