import React, { useState } from "react";
import { connect } from "react-redux";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";

import * as actions from "../../store/actions/indexActions.js";
import classes from "./Auth.css";
import { Redirect } from "react-router-dom";

const Auth = (props) => {
    const [controls, setControls] = useState({
        email: {
            elementType: "input",
            elementConfig: {
                type: "email",
                placeholder: "Your email",
            },
            value: "",
            validation: {
                required: true,
                isEmail: true,
            },
            valid: false,
            touched: false,
        },
        password: {
            elementType: "input",
            elementConfig: {
                type: "password",
                placeholder: "Your password",
            },
            value: "",
            validation: {
                required: true,
                minLength: 6,
            },
            valid: false,
            touched: false,
        },
    })
    const [isSignup, setIsSignup] = useState(true)

    const checkValidity = (value, rules) => {
        let isValid = true;

        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== "" && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if (rules.isEmail) {
            const pattern =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = pattern.test(value) && isValid;
            // isValid = value.match(pattern) && isValid;  //another way of validation email field
        }
        return isValid;
    };

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...controls,
            [controlName]: {
                ...controls[controlName],
                value: event.target.value,
                valid: checkValidity(
                    event.target.value,
                    controls[controlName].validation
                ),
                touched: true,
            },
        };
        setControls(updatedControls)
    };

    const submitHandler = event => {
        event.preventDefault();
        props.onAuth(
            controls.email.value,
            controls.password.value,
            isSignup
        );
    };

    const switchAuthMethodHandler = () => {
        setIsSignup(!isSignup)
    };

    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key],
        });
    }

    let form = formElementsArray.map(formElement => {
        return (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={event => inputChangedHandler(event, formElement.id)}
            />
        );
    });
    if (props.loading) {
        form = <Spinner />;
    }
    let errorMessage = null;
    if (props.error) {
        errorMessage = <p style={{ color: "red" }}>{props.error.message}</p>;
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        if (props.isBuilding) {
            authRedirect = <Redirect to="/checkout" />;
        } else {
            authRedirect = <Redirect to="/" />;
        }
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">{isSignup ? "SIGN-UP" : "SIGN-IN"}</Button>
            </form>
            <Button btnType="Danger" clicked={switchAuthMethodHandler}>
                SWITCH TO {isSignup ? "SIGN-IN" : "SIGN-UP"}
            </Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        isBuilding: state.burgerBuilder.building,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
