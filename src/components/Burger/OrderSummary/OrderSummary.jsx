import React, { Component } from "react";
import Button from "../../UI/Button/Button";

class OrderSummary extends Component {

    render() {
        const ingredientsSummary = Object.keys(this.props.ingredients).map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: "capitalize" }}>{igKey}</span>:
                    {this.props.ingredients[igKey]}
                </li>
            );
        });
        return (
            <div>
                <h3>your order</h3>
                <p>A delicious burger with :</p>
                <ul>{ingredientsSummary}</ul>
                <strong>Total Price is : {this.props.totalPrice.toFixed(2)} $</strong>
                <p>Continue to Checkout ?</p>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Button btnType="Success" clicked={this.props.continuePurchasing}>
                        Continue
                    </Button>
                    <Button btnType="Danger" clicked={this.props.cancelPurchasing}>
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }
}
export default OrderSummary;
