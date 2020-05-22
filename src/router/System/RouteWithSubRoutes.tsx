import {Route} from "react-router-dom";
import React from "react";
interface IRoute {
   routes: string[];
   path: string;
   component: any;
}

export function RouteWithSubRoutes(route: IRoute) {
    console.log('Create route with subroutes', route.routes);
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} className="div-content"/>
            )}
        />
    );
}
