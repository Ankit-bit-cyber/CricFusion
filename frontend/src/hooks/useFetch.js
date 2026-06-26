import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFn, deps = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchFn();
            setData(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        if (immediate) execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
};

export default useFetch;