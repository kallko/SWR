import {Route} from "react-router-dom";
import React from "react";

export function RouteWithSubRoutes(props) {
    const route = props;
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} playerId={route.playerId} className="div-content"/>
            )}
        />
    );
}
