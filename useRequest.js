import { useEffect, useState, useRef } from "react";

const useFetch = (fetcher, userOptions={}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);
    const firstExecute = useRef(true);
    const options = {
        enable: true,
        enableParam: true,
        ...userOptions
    };

    const start = (newParams) => {
        return fetcher(newParams).
            then(res=>{
                setData(res);
                options.onSuccess && options.onSuccess(res);
            }).catch(err=>{
                setError(err);
                options.onError && options.onError(err);
            }).finally(()=>{
                setLoading(false);
                options.onFinish && options.onFinish();
            });
    }

    const refetch = (newParams) => {
        setLoading(true);
        return start(newParams);
    }

    useEffect(()=>{
        if (options.enable) {
            refetch(options.params);
        }
    }, []);

    useEffect(()=>{
        if(firstExecute.current) {
            firstExecute.current = false;
        } else {
            if (options.enableParam) {
                refetch(options.params);
            }
        }
    }, [options.params]);

    return { loading, data, error, refetch };
}

export default useFetch;