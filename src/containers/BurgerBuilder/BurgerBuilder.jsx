import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Auxiliary from "../../HOC/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../HOC/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as actions from "../../store/actions/indexActions";

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = ingName => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = ingredients => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            props.history.push("/auth");
        }
    };

    const cancelPurchasingHandler = () => {
        setPurchasing(false);
    };

    const continuePurchasingHandler = () => {
        onInitPurchase();
        props.history.push("/checkout");
    };

    const disabledInfo = {
        ...ings,
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = error ? (
        <p style={{ textAlign: "center" }}>ingredients can't be loaded</p>
    ) : (
        <Spinner />
    );

    if (ings) {
        burger = (
            <Auxiliary>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo} //disabledInfo = { salad: boolean, bacon: boolean, meat: boolean, cheese: boolean}
                    purchaseable={updatePurchaseState(ings)}
                    isAuth={isAuthenticated}
                    price={price}
                    clicked={purchaseHandler}
                />
            </Auxiliary>
        );
        orderSummary = (
            <OrderSummary
                ingredients={ings}
                cancelPurchasing={cancelPurchasingHandler}
                continuePurchasing={continuePurchasingHandler}
                totalPrice={price}
            />
        );
    }

    return (
        <Auxiliary>
            <Modal show={purchasing} modalClosed={cancelPurchasingHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Auxiliary>
    );
};

export default withErrorHandler(BurgerBuilder, axios);
