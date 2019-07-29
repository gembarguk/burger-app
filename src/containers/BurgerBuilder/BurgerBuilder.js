import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxilary from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
        state = {
            purchasing: false,
            loading: false,
            error: false
        }

        componentDidMount () {
            this.props.onInitIngredients();
        }

        updatePurschaseState(ingredients) {
            const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey]
                })
                .reduce((sum, el) => {
                    return sum + el;
                }, 0);
            return sum > 0;
        }

        purchaseHandler = () => {
            if (this.props.isAuthenticated) {
                this.setState({purchasing: true});
            } else {
                this.props.onSetAuthRedirectPath('/checkout');
                this.props.history.push('/auth');
            }
        }

        purchaseCancelHandler =() => {
            this.setState({purchasing:false});
        }

        purchaseContinueHandler = () => {
            this.props.onInitPurchase();
            this.props.history.push('/checkout');
        }

        render() {
            const disabledInfo = {
                ...this.props.ings
            };
            for (let key in disabledInfo) {
                disabledInfo[key] = disabledInfo[key] <= 0
            }
            let orderSummary = null;

            let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

            if (this.props.ings) {
                burger =  (
                    < Auxilary>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disabledInfo}
                            purchasable={this.updatePurschaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                            isAuth={this.props.isAuthenticated}
                            price={this.props.price}/>
                    </ Auxilary>
                );
                orderSummary = <OrderSummary
                    price={this.props.price}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.props.ings} />
            }

            if (this.state.loading) {
                orderSummary = <Spinner />;
            }

            return (
                < Auxilary>
                    <Modal
                        show={this.state.purchasing}
                        modalClosed={this.purchaseCancelHandler}>
                        {orderSummary}
                    </Modal>
                    {burger}
                </ Auxilary>
            );
        }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actions.addIngredient(ingName).type, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actions.removeIngredient(ingName).type, ingredientName: ingName}),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));