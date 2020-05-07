import * as React  from "react";
import logo from "../logo.svg";
import img from "../img/UnderConstruction.jpg";
import {Link, useRouteMatch} from "react-router-dom";

export function ApiDocRoute(inputData: { data: string }) {
  console.log("Key", inputData);
    // const [isOnline, setIsOnline] = React.useState(null);
    // console.log('TEST 1', isOnline);
    return (
    <div className="div-content">
      {/*<h2>Users {inputData.data}</h2>*/}
      {/*<header className="App-header">      */}
      {/*</header>*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">*/}
        {/*  <i className="App-link" aria-hidden="true" />*/}
        {/*</a>*/}
        <div className="div-left">
            <nav >
                <Link className="nav-link" to={`/12`}>Option 2</Link>
            </nav>
        </div>
        <div className="div-right">
            <img src={img}  alt="logo" width="100%" >
            </img>
        </div>
    </div>
  );
}
