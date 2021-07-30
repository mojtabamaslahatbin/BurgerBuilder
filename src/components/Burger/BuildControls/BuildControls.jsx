import React from "react";
import BuildControl from "./BuildControl/BuildControl";

import classes from "./BuildControls.css";

const controls = [
    { label: "Salad", type: "salad", price: 0.5 },
    { label: "Meat", type: "meat", price: 1.3 },
    { label: "Bacon", type: "bacon", price: 0.4 },
    { label: "Cheese", type: "cheese", price: 0.7 },
];

const BuildControls = props => {
    return (
        <div className={classes.BuildControls}>
            <p>
                Total Price is : <strong>{props.price.toFixed(2)} $</strong>
            </p>
            {controls.map(ctrl => {
                return (
                    <BuildControl
                        key={ctrl.label}
                        label={ctrl.label}
                        price={ctrl.price}
                        added={() => props.ingredientAdded(ctrl.type)}
                        removed={() => props.ingredientRemoved(ctrl.type)}
                        disabled={props.disabled[ctrl.type]}
                    />
                );
            })}
            <button
                className={classes.OrderButton}
                disabled={!props.purchaseable}
                onClick={props.clicked}
            >
                {props.isAuth ? "ORDER NOW" : "SIGNUP TO ORDER"}
            </button>
        </div>
    );
};

export default BuildControls;
