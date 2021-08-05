import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../../store/actions/indexActions";

const Logout = props => {
    const { onLogout } = props;
    useEffect(() => {
        onLogout();
    }, [onLogout]);

    return (
        <div>
            <Redirect to="/" />
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.authLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
