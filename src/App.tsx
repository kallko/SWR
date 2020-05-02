import React, { Component } from "react";
import { modsRoute } from "./router/modsRoute";
import { guildRoute } from "./router/guildRoute";
import { homeRoute } from "./router/homeRoute";
import { TestChild } from "./router/testChild";
import { config } from "./config/configService";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import { apiDocRoute } from "./router/apidocRoute";
type appStateType = { status: string; serverStartTime: Date | null };
const url = config.get('url');

export class App extends Component<{}, appStateType> {
  constructor(props: appStateType) {
    super(props);
    this.state = { status: "Server connection failed", serverStartTime: null };
  }
  componentDidMount() {
    (async () => {
      const data = await fetch(url + "/api");
      const status = await data.json();
      const data2 = await fetch(url + "/serverStatus");
      const serverStartTime = await data2.json();
      console.log(status, serverStartTime);
      this.setState({
        status: status.response,
        serverStartTime: serverStartTime.response,
      });
    })();
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <nav className="nav-main">
              <Link className="nav-link" to="/home">
                Home
              </Link>
              <Link className="nav-link" to="/mods">
                Unit-mods
              </Link>
              <Link className="nav-link" to="/guild">
                Guild
              </Link>
              <Link className="nav-link" to="/apidoc">
                API-documentation
              </Link>
            </nav>
            <Switch>
              <Route path="/home">
                <Redirect to="/" />
              </Route>
              <Route path="/mods">{modsRoute}</Route>
              <Route path="/guild">{guildRoute({ data: "100" })}</Route>
              <Route path="/apidoc">
                {apiDocRoute({ data: "apiDocumentation" })}
              </Route>
              <Route
                path="/:id"
                children={
                  <TestChild
                    text={"text fro main"}
                    addText={"additional text"}
                  />
                }
              />

              <Route path="/">
                {homeRoute(this.state.status, this.state.serverStartTime)}
              </Route>
            </Switch>
            <SuperTest />
          </div>
        </Router>
      </div>
    );
  }
}

class SuperTest extends Component {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    this.testFunction();
  }
  testFunction() {
    console.log("testFunction");
  }
  render() {
    const text = "(c) Kalko Andrii";
    return <div className="footer"> {text} </div>;
  }
}

export default App;
