import { useEffect, useState, useRef } from "react";

const useFetch = (fetcher, userOptions={}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);
    const firstExecute = useRef(true);
    const [options, setOptions] = useState({
        enable: true,
        enableParam: true,
        multiParam: false,
        ...userOptions,
    });

    const start = (newParams) => {
        let req;
        if (options.multiParam) {
            req = fetcher(...newParams)
        } else {
            req = fetcher(newParams)
        }
        return req.
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

    useEffect(() => {
        if (options.params !== userOptions.params) {
            setOptions({
                ...options,
                params: userOptions.params,
            });
        }
    }, [userOptions.params]);

    return { loading, data, error, refetch };
}

export default useFetch;