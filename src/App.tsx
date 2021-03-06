import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import './App.css';
import { RouteWithSubRoutes } from './router/System/RouteWithSubRoutes';
import { InputPlayerId, logout } from './component/loginLogout';
import { ROUTES } from './router/routesConfig';

export default function App() {
	const storedPlayerId = localStorage.getItem('playerId');
	const storedPlayerNAme = localStorage.getItem('playerName');
	const [playerId, setPlayerId] = React.useState((storedPlayerId || ''));
	const [playerName, setPlayerName] = React.useState((storedPlayerNAme || ''));
	return (
		<div className={'App'}>
			<Router>
				<div>
					<ul className={'nav-main'}>
						<Link to="/home" className="nav-link">
							Home
						</Link>

						<Link to="/mods" className="nav-link">
							Player
						</Link>

						<Link to="/guild" className="nav-link">
							Guild
						</Link>

						{/*<Link to="/apidoc" className="nav-link">*/}
							{/*API-Doc*/}
						{/*</Link>*/}
						{/*<Link to="/sysadmin" className="nav-link">*/}
							{/*Sysadmin*/}
						{/*</Link>*/}
						{playerId.length !== 9 ? (
							<InputPlayerId
								passPlayerId={setPlayerId}
								definePlayerName={setPlayerName}
							/>
						) : (
							<div className="nav-link">
								<a >{playerName} </a>
								<a style={{cursor: 'pointer'}} onClick={() => logout(setPlayerName, setPlayerId)}>logout </a>
							</div>

						)}
					</ul>

					<Switch>
						{ROUTES.map((route, i) => (
							<RouteWithSubRoutes
								key={i}
								playerId={playerId}
								{...route}
								className="div-left"
							/>
						))}
					</Switch>
				</div>
			</Router>
		</div>
	);
}
