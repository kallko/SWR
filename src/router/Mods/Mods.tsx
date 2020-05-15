import {Link, Switch} from "react-router-dom";
import React from "react";
import {RouteWithSubRoutes} from "../System/RouteWithSubRoutes";

export function Mods({ routes }: any) {
    return (
        <div className="div-content">
            <ul className="div-left">
                <Link to="/mods/gacheck" className="nav-link">GA-Check</Link>
                <Link to="/mods/colorup" className="nav-link">Colorup</Link>
            </ul>

            <Switch>
                {routes.map((route: any, i: number) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
            </Switch>
        </div>
    );
}