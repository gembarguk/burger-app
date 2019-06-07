import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingreidentName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingreidentName: name
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
}


export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-my-burger-b8c8f.firebaseio.com/ingridients.json')
            .then(response => {
                dispatch(setIngredients(response.data));
            })
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            });
    };
};