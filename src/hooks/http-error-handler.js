import { useState, useEffect} from 'react';

export default httpClient => {
        const [error, setError] = useState(null);

        const reqInterceptor = httpClient.interceptors.request.use(req => {
            setError(null);
            return req;
        });
        const resInterceptor = httpClient.interceptors.response.use(res => res, err => {
            setError(err);
        });

        const errorConfirmedHandler = () => {
            setError(null);
        };

        useEffect(() => {
            return () => {
                httpClient.interceptors.request.eject(reqInterceptor);
                httpClient.interceptors.response.eject(resInterceptor);
            }
            // in return there is a cleanup function which runs when component unmounts
        }, [reqInterceptor, resInterceptor]);

        return [error, errorConfirmedHandler];
}