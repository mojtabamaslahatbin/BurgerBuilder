import React from "react";
import classes from "./SideDrawer.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Auxiliary from "../../../HOC/Auxiliary";
import Backdrop from "../../UI/Backdrop/Backdrop";

const SideDrawer = props => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Auxiliary>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachedClasses.join(" ")}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav onClick={props.closed}>
                    <NavigationItems isAuth={props.isAuth} />
                </nav>
            </div>
        </Auxiliary>
    );
};

export default SideDrawer;
