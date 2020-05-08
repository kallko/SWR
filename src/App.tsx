import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams
} from "react-router-dom";
import "./App.css";
import homeImg from "./img/StarwarsFinal28.4.jpg";
import underConstruction from "./img/UnderConstruction.jpg";
import { useTable, useExpanded } from 'react-table'

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
const routes = [
    {
        path: "/home",
        component: Home
    },
    {
        path: "/mods",
        component: Mods,
        routes: [
            {
                path: "/mods/gacheck",
                component: GACheck
            },
            {
                path: "/mods/colorup",
                component: Colorup
            }
        ]
    },
    {
        path: "/guild",
        component: Guild
    },
    {
        path: "/apidoc",
        component: Apidoc
    },
    {
        path: "/sysadmin",
        component: Sysadmin
    }
];

export default function RouteConfig() {
    return (
      <div className={"App"}>
        <Router>
          <div >
            <ul className={"nav-main"}>
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
            </ul>

            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} className="div-left"/>
              ))}
            </Switch>
          </div>
        </Router>
      </div>
    );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route: any) {
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

function Home() {
  return (
    <div className="div-content">
        <img src={homeImg} alt="logo" width="60%"/>
    </div>
  );
}

function Mods({ routes }: any) {
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

function GACheck() {
    return <h3>GACheck</h3>;
}

function Colorup() {
    const [colorUpMods, setcolorUpMods] = React.useState('');
    const [data, setData] = React.useState([]);
    const columns: any = React.useMemo(
        () => [
            {
                Header: 'Column 1',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Column 2',
                accessor: 'col2',
            },
        ],
        [],
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    React.useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!colorUpMods) {
            let result = getColorUpMods();
        }
    }, []);

    const getColorUpMods = async () => {
        const data2 = await fetch("http://localhost:1976/mods/colorup");
        const serverStartTime = await data2.json();
        console.log('Data ', serverStartTime.result);
        setcolorUpMods(serverStartTime.result[0].character);
        setData(serverStartTime.result);
    };
    if (!!data) {
        return  (
            <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
                <thead>
                {headerGroups.map((headerGroup: any) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: 'solid 3px red',
                                    background: 'aliceblue',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row: any) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: '10px',
                                            border: 'solid 1px gray',
                                            background: 'papayawhip',
                                        }}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    } else {
        return (            <div className="div-right">
            <img src={underConstruction} alt="logo" width="60%"/>
        </div>)
    }

}

function Guild() {
    return <h3>Guild</h3>;
}

function Apidoc() {
    return <h3>Apidoc</h3>;
}

function Sysadmin() {
    return <h3>Sysadmin</h3>;
}





// import React, { Component } from "react";
// import ModsRoute from "./router/modsRoute";
//
// import { guildRoute } from "./router/guildRoute";
// import { homeRoute } from "./router/homeRoute";
// import { TestChild } from "./router/testChild";
// import { config } from "./config/configService";
// import "./App.css";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useParams,
//   useRouteMatch,
//   Redirect,
//     useHistory,
//     useLocation
// } from "react-router-dom";
// import { ApiDocRoute } from "./router/apidocRoute";
// type appStateType = { status: string; serverStartTime: Date | null };
// const url = config.get('url');
//
//
// export class App extends Component<{}, appStateType> {
//   constructor(props: appStateType) {
//     super(props);
//     this.state = { status: "Server connection failed", serverStartTime: null };
//   }
//   componentDidMount() {
//     (async () => {
//       const data = await fetch(url + "/api");
//       const status = await data.json();
//       const data2 = await fetch(url + "/serverStatus");
//       const serverStartTime = await data2.json();
//       console.log(status, serverStartTime);
//       this.setState({
//         status: status.response,
//         serverStartTime: serverStartTime.response,
//       });
//     })();
//   }
//   render() {
//     return (
//       <div className="App">
//         <Router>
//           <div>
//             <nav className="nav-main">
//               <Link className="nav-link" to="/home">
//                 Home
//               </Link>
//               <Link className="nav-link" to="/mods">
//                 Unit-mods
//               </Link>
//               <Link className="nav-link" to="/guild">
//                 Guild
//               </Link>
//               <Link className="nav-link" to="/apidoc">
//                 API-documentation
//               </Link>
//             </nav>
//               <Topic />
//             <Switch>
//               <Route path="/home">
//                 <Redirect to="/" />
//               </Route>
//               <Route path="/mods">
//                    < ModsRoute text='just text' click={false}/>
//               </Route>
//               <Route path="/guild">{guildRoute({ data: "100" })}</Route>
//               <Route path="/apidoc">
//                 {ApiDocRoute({ data: "apiDocumentation" })}
//               </Route>
//               <Route
//                 path="/:id"
//                 children={
//                   <TestChild
//                     text={"text fro main"}
//                     addText={"additional text"}
//                   />
//                 }
//               />
//
//               <Route path="/">
//                 {homeRoute(this.state.status, this.state.serverStartTime)}
//               </Route>
//             </Switch>
//             <SuperTest />
//           </div>
//         </Router>
//       </div>
//     );
//   }
// }
//
// class SuperTest extends Component {
//   constructor(props: any) {
//     super(props);
//   }
//   componentDidMount() {
//     this.testFunction();
//       // const [isOnline, setIsOnline] = React.useState(null);
//   }
//   testFunction() {
//     console.log("testFunction");
//   }
//   render() {
//     const text = "(c) Kalko Andrii";
//     return <div className="footer"> {text} </div>;
//   }
// }
//
//
//
// function Topic() {
//     // The <Route> that rendered this component has a
//     // path of `/topics/:topicId`. The `:topicId` portion
//     // of the URL indicates a placeholder that we can
//     // get from `useParams()`
//     let  {topicId}  = useParams();
//     let history = useHistory();
//     let location = useLocation();
//     let { url } = useRouteMatch();
//     console.log('TOPIC ID !!!!', topicId, );
//     console.log('history !!!!', history, );
//     console.log('location', location);
//     console.log('url',  url);
//     return (
//         <div>
//            ID: {topicId}
//         </div>
//     );
// }

// class ModsRoute extends Component<{}, colorupStateType> {
//     constructor(props: any) {
//         super(props);
//         this.setState({data: 'No data'});
//     }
//     componentDidMount() {
//         (async () => {
//             const data = await fetch(url + "/mods/colorup");
//             const status = await data.json();
//             console.log('Colorup ', status);
//             this.setState({data : status});
//         })();
//     }
//
//     render() {
//         return (
//             <div> TEST </div>
//         )
//
//     }
// }

// export default App;
