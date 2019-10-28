import React, { useState, useEffect, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import Auxilary from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });

    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });

    const error = useSelector(state => {
       return  state.burgerBuilder.error;
    });

    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null;
    });

    const onIngredientAdded = ingName => dispatch({type: actions.addIngredient(ingName).type, ingredientName: ingName});
    const onIngredientRemoved = ingName => dispatch({type: actions.removeIngredient(ingName).type, ingredientName: ingName});
    const onInitIngredients = () => useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

        useEffect(() => {
           onInitIngredients();
        }, [onInitIngredients]);

        const updatePurschaseState = (ingredients) => {
            const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey]
                })
                .reduce((sum, el) => {
                    return sum + el;
                }, 0);
            return sum > 0;
        }

        const purchaseHandler = () => {
            if (isAuthenticated) {
                setPurchasing(true);
            } else {
                onSetAuthRedirectPath('/checkout');
                props.history.push('/auth');
            }
        };

        const purchaseCancelHandler =() => {
            setPurchasing(false);
        };

        const purchaseContinueHandler = () => {
            onInitPurchase();
            props.history.push('/checkout');
        };
        
        const disabledInfo = {
            ...ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;

        let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />

        if (ings) {
            burger =  (
                < Auxilary>
                    <Burger ingredients={ings}/>
                    <BuildControls
                        ingredientAdded={onIngredientAdded}
                        ingredientRemoved={onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={updatePurschaseState(ings)}
                        ordered={purchaseHandler}
                        isAuth={isAuthenticated}
                        price={price}/>
                </ Auxilary>
            );
            orderSummary = <OrderSummary
                price={price}
                purchaseCanceled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                ingredients={ings} />
        }

        return (
            < Auxilary>
                <Modal
                    show={purchasing}
                    modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </ Auxilary>
        );
};

export default withErrorHandler(burgerBuilder, axios);