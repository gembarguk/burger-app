import React, { Component } from 'react';

import classes from './Modal.css';
import Auxilary from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../Backdrop/Backdrop';

const modal = props =>  {
    return (
     <Auxilary>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show? '1' : 0
                }}>
                {props.children}
            </div>
        </Auxilary>
    )
}

export default React.memo(
    modal,
    (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);