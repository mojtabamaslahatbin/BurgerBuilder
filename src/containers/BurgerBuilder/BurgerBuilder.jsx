import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

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
    const { onInitIngredients } = props;
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
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.history.push("/auth");
        }
    };

    const cancelPurchasingHandler = () => {
        setPurchasing(false);
    };

    const continuePurchasingHandler = () => {
        props.onInitPurchase();
        props.history.push("/checkout");
    };

    const disabledInfo = {
        ...props.ings,
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = props.error ? (
        <p style={{ textAlign: "center" }}>ingredients can't be loaded</p>
    ) : (
        <Spinner />
    );

    if (props.ings) {
        burger = (
            <Auxiliary>
                <Burger ingredients={props.ings} />
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo} //disabledInfo = { salad: boolean, bacon: boolean, meat: boolean, cheese: boolean}
                    purchaseable={updatePurchaseState(props.ings)}
                    isAuth={props.isAuthenticated}
                    price={props.price}
                    clicked={purchaseHandler}
                />
            </Auxiliary>
        );
        orderSummary = (
            <OrderSummary
                ingredients={props.ings}
                cancelPurchasing={cancelPurchasingHandler}
                continuePurchasing={continuePurchasingHandler}
                totalPrice={props.price}
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
