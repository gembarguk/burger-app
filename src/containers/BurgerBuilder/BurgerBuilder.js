import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxilary from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
        // constructor(props) {
        //     super(props);
        //     this.state = {...};
        // }
        state = {
            purchasing: false,
            loading: false,
            error: false
        }

        componentDidMount () {
            // axios.get('https://react-my-burger-b8c8f.firebaseio.com/ingridients.json')
            //     .then(response => {
            //         this.setState({ingredients: response.data});
            //     })
            //     .catch( error => {
            //         this.setState( {error: true} );
            //     });
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
            this.setState({purchasing: true});
        }

        purchaseCancelHandler =() => {
            this.setState({purchasing:false});
        }

        purchaseContinueHandler = () => {
            this.props.history.push('/checkout');
        }

        render() {
            const disabledInfo = {
                ...this.props.ings.state.ingredients
            };
            for (let key in disabledInfo) {
                disabledInfo[key] = disabledInfo[key] <= 0
            }
            let orderSummary = null;

            let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

            if (this.props.ings.state.ingredients) {
                burger =  (
                    < Auxilary>
                        <Burger ingredients={this.props.ings.ingredients}/>
                        <BuildControls
                            ingredientAdded={this.props.onIngredientAdded()}
                            ingredientRemoved={this.props.onIngredientRemoved()}
                            disabled={disabledInfo}
                            purchasable={this.updatePurschaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                            price={this.props.price}/>
                    </ Auxilary>
                );
                orderSummary = <OrderSummary
                    price={this.props.price}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.props.ings.ingredients} />
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
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
}


export default connect(mapDispatchToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));