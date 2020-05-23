import { Route } from 'react-router-dom';
import React from 'react';

export function RouteWithSubRoutes(props) {
	const route = props;
	return (
		<Route
			path={route.path}
			render={(props) => (
				<route.component
					{...props}
					routes={route.routes}
					playerId={route.playerId}
					className="div-content"
				/>
			)}
		/>
	);
}
