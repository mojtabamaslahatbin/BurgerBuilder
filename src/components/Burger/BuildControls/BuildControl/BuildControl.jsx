import React from "react";

import classes from "./BuildControl.css";

const BuildControl = props => {
    return (
        <div className={classes.BuildControl}>
            <div className={classes.Label}>{props.label}</div>
            <button className={classes.Less} onClick={props.removed} disabled={props.disabled}>
                Less
            </button>
            <button className={classes.More} onClick={props.added}>
                More
            </button>
            <div className={classes.Price}>
                <strong>{props.price} $</strong>
            </div>
        </div>
    );
};

export default BuildControl;
