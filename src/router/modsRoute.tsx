import * as React from "react";
import img from "../img/DeathStarConstruction.jpg";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

export function modsRoute()  {
    return <div className="div-content">

            <div className="div-left">
                <nav >
                            <Link className="nav-link" to={`/12`}>GA Squad check</Link>
                            <Link className="nav-link" to={`/13`}>
                                Mods for colorUP
                            </Link>
                </nav>
            </div>
            <div className="div-right">
                <img src={img}  alt="logo" />
            </div>



        {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
        <Switch>
            <Route path="mods/:id" children={<Child />} />
        </Switch>

    </div>;
}

function Topic() {
    let { topicId } = useParams();
    let { path, url } = useRouteMatch();
    return <div>
        <h3>Requested topic ID: {topicId}</h3>
    </div>
}

function Child() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
    return (
        <div>
            <h3>ID: {id}</h3>
        </div>
    );
}
