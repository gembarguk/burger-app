import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxilary from '../Auxilary/Auxilary';


const withErrorHandler = ( WrappedComponent, axios ) => {
    return props => {
        const [error, setError] = useState(null);

            const reqInterceptor = axios.interceptors.request.use(req => {
                setError(null);
                return req;
            });
            const resInterceptor = axios.interceptors.response.use(res => res, err => {
                setError(err);
            });

        const errorConfirmedHandler = () => {
            setError(null);
        };

        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(reqInterceptor);
                axios.interceptors.response.eject(resInterceptor);
            }
            // in return there is a cleanup function which runs when component unmounts
        }, [reqInterceptor, resInterceptor]);

        return  (
            <Auxilary>
                <Modal show={error}
                       modalClosed={errorConfirmedHandler}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Auxilary>
        );
    }

}

export default withErrorHandler;