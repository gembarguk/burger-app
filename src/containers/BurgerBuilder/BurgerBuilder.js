import React, { Component } from 'react';

import Auxilary from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
        // constructor(props) {
        //     super(props);
        //     this.state = {...};
        // }
        state = {
            ingredients: null,
            totalPrice: 4,
            purchasable: false,
            purchasing: false,
            loading: false,
            error: false
        }

        componentDidMount () {
            axios.get('https://react-my-burger-b8c8f.firebaseio.com/ingridients.json')
                .then(response => {
                    this.setState({ingredients: response.data});
                })
                .catch( error => {
                    this.setState( {error: true} );
                });
        }

        updatePurschaseState(ingredients) {
            const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey]
                })
                .reduce((sum, el) => {
                    return sum + el;
                }, 0);
            this.setState({purchasable: sum > 0});
        }


        addIngredientHandler = (type) => {
                const oldCount = this.state.ingredients[type];
                const updateCount = oldCount + 1;
                const updatedIngredients = {
                    ...this.state.ingredients
                };
                updatedIngredients[type] = updateCount;
                const priceAddition = INGREDIENT_PRICES[type];
                const oldPrice = this.state.totalPrice;
                const newPrice = oldPrice + priceAddition;
                this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
                this.updatePurschaseState(updatedIngredients);
            }

        removeIngredientHandler = (type) => {
            const oldCount = this.state.ingredients[type];
            if (oldCount <= 0) {
                return;
            }
            const updateCount = oldCount - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            };
            updatedIngredients[type] = updateCount;
            const priceDeduction = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceDeduction;
            this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
            this.updatePurschaseState(updatedIngredients);
        }

        purchaseHandler = () => {
            this.setState({purchasing: true});
        }

        purchaseCancelHandler =() => {
            this.setState({purchasing:false});
        }

        purchaseContinueHandler = () => {
            const queryParams = [];
            for (let i in this.state.ingredients) {
                queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
            }
            queryParams.push('price=' + this.state.totalPrice);
            const queryString = queryParams.join('&');
            this.props.history.push({
                    pathname: '/checkout',
                    search: '?' + queryString
                });
        }

        render() {
            const disabledInfo = {
                ...this.state.ingredients
            };
            for (let key in disabledInfo) {
                disabledInfo[key] = disabledInfo[key] <= 0
            }
            let orderSummary = null;

            let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

            if (this.state.ingredients) {
                burger =  (
                    < Auxilary>
                        <Burger ingredients={this.state.ingredients}/>
                        <BuildControls
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disabledInfo}
                            purchasable={this.state.purchasable}
                            ordered={this.purchaseHandler}
                            price={this.state.totalPrice}/>
                    </ Auxilary>
                );
                orderSummary = <OrderSummary
                    price={this.state.totalPrice}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.state.ingredients} />
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

export default withErrorHandler(BurgerBuilder, axios);