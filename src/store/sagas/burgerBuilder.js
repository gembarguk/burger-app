import axios from "../../axios-orders";
import {put} from 'redux-saga/effects';
import * as actions from '../actions';

export function* initIngredinetsSaga(action) {
    try {
        const response = yield axios.get('https://react-my-burger-b8c8f.firebaseio.com/ingridients.json');
        yield put(actions.setIngredients(response.data));
    } catch (error) {
        yield put(actions.fetchIngredientsFailed());
    }
}