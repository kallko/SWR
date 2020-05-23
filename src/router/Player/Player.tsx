import { Link, Switch } from 'react-router-dom';
import React from 'react';
import { RouteWithSubRoutes } from '../System/RouteWithSubRoutes';

export function Player(props) {
	const routes = props.routes;
	return (
		<div className="div-content">
			<ul className="div-left">
				<Link to="/mods/gacheck" className="nav-link">
					GA-Check
				</Link>
				<br />
				<Link to="/mods/colorup" className="nav-link">
					ColorUp
				</Link>
			</ul>

			<Switch>
				{routes.map((route: any, i: number) => (
					<RouteWithSubRoutes key={i} {...route} playerId={props.playerId} />
				))}
			</Switch>
		</div>
	);
}
