import React from "react";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {

    const ingredientsSummary = Object.keys(props.ingredients).map(igKey => {
        return (
            <li key={igKey}>
                <span style={{ textTransform: "capitalize" }}>{igKey}</span>:
                {props.ingredients[igKey]}
            </li>
        );
    });
    return (
        <div>
            <h3>your order</h3>
            <p>A delicious burger with :</p>
            <ul>{ingredientsSummary}</ul>
            <strong>Total Price is : {props.totalPrice.toFixed(2)} $</strong>
            <p>Continue to Checkout ?</p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button btnType="Success" clicked={props.continuePurchasing}>
                    Continue
                </Button>
                <Button btnType="Danger" clicked={props.cancelPurchasing}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
export default OrderSummary;
