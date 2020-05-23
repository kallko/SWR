import { Link, Switch } from 'react-router-dom';
import { RouteWithSubRoutes } from '../System/RouteWithSubRoutes';
import React from 'react';

export function Guild({ routes, id }) {
	console.log('Start Guild', id, routes);
	return (
		<div className="div-content">
			<ul className="div-left">
				<Link to="/guild/legendprogress" className="nav-link">
					Legend progress
				</Link>
				<br />
				<Link to="/guild/top" className="nav-link">
					Top
				</Link>
			</ul>
			<Switch>
				{routes.map((route: any, i: number) => (
					<RouteWithSubRoutes key={i} {...route} />
				))}
			</Switch>
		</div>
	);
}
