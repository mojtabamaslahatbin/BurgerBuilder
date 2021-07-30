import React from "react";
import classes from "./Order.css";
import Burger from "../Burger/Burger";

const Order = props => {
    const ingredients = [];
    for (let ingName in props.ingredients) {
        ingredients.push({ name: ingName, amount: props.ingredients[ingName] });
    }

    const ingredientsOutput = ingredients.map(ig => {
        return (
            <span
                style={{ textTransform: "capitalize", display: "inline-block", margin: "0 8px" }}
                key={ig.name}
            >
                {ig.name} ({ig.amount})
            </span>
        );
    });

    return (
        <div className={classes.Order}>
            <p>Ingredients : {ingredientsOutput} </p>
            <p>
                Price <strong>USD {props.price.toFixed(2)} $</strong>
            </p>
            <span>
                <Burger ingredients={props.ingredients} />
            </span>
        </div>
    );
};

export default Order;
