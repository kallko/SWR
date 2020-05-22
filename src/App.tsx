import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import './App.css';
import { RouteWithSubRoutes } from './router/System/RouteWithSubRoutes';
import { InputPlayerId } from './component/InputPlayerCode';
import { ROUTES } from './router/routesConfig';

export default function App() {
    const [playerId, setPlayerId] = React.useState('');
	return (
		<div className={'App'}>
			<Router>
				<div>
					<ul className={'nav-main'}>
						<Link to="/home" className="nav-link">
							Home
						</Link>

						<Link to="/mods" className="nav-link">
							Mods
						</Link>

						<Link to="/guild" className="nav-link">
							Guild
						</Link>

						<Link to="/apidoc" className="nav-link">
							API-Doc
						</Link>
						<Link to="/sysadmin" className="nav-link">
							Sysadmin
						</Link>
						<InputPlayerId passChildData={setPlayerId}/>
					</ul>

					<Switch>
						{ROUTES.map((route, i) => (
							<RouteWithSubRoutes key={i} playerId={playerId} {...route}  className="div-left" />
						))}
					</Switch>
				</div>
			</Router>
		</div>
	);
}
