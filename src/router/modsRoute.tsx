import * as React from "react";
import img from "../img/UnderConstruction.jpg";
import img2 from "../img/DeathStarConstructionII.jpg";
import { config } from "../config/configService";
import ColorUpPage from "../page/colorupPage";

//
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { Component } from "react";
import {Simulate} from "react-dom/test-utils";
// type colorupStateType = { data: any };
const url = config.get('url');
//
//
// export default class ModsRoute extends Component<{}, colorupStateType> {
//   constructor(props: any) {
//     super(props);
//     this.setState({data: 'No data'});
//   }
//     componentDidMount() {
//         (async () => {
//             const data = await fetch(url + "/mods/colorup");
//             const status = await data.json();
//             console.log('Colorup ', status);
//             this.setState({data : status});
//         })();
//     }
//
//   render() {
//     return (
//       {/*<div> TEST </div> */}
//     )
//     //   <div className="div-content">
//     //     <div className="div-left">
//     //       <nav>
//     //         <Link className="nav-link" to={`/12`}>
//     //           GA Squad check
//     //         </Link>
//     //         <Link className="nav-link" to={`/13`}>
//     //           Mods for colorUP
//     //         </Link>
//     //       </nav>
//     //     </div>
//     //     <div className="div-right">
//     //       <img src={img} alt="logo" width="100%"></img>
//     //     </div>
//     //
//     //     {/* The Topics page has its own <Switch> with more routes
//     //       that build on the /topics URL path. You can think of the
//     //       2nd <Route> here as an "index" page for all topics, or
//     //       the page that is shown when no topic is selected */}
//     //     <Switch>
//     //       <Route path="mods/:id" children={<Child />} />
//     //     </Switch>
//     //   </div>
//     // );
//   }
// }
// // return
// // }
// //
// // function Topic() {
// //     let { topicId } = useParams();
// //     let { path, url } = useRouteMatch();
// //     return <div>
// //         <h3>Requested topic ID: {topicId}</h3>
// //     </div>
// // }
// //
function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  console.log('!!!!! Check');
  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}



// import * as React from "react";

type Props = { text: string, click: boolean};

export default class ModsRoute extends React.Component<Props> {
    constructor(props: Props) {
      super(props);
    }
    handleClick(event: any) {


        // event.preventDefault();
        // alert(event.currentTarget.tagName); // alerts BUTTON
        console.log('Click!');
        this.setState({click: true});
    }
    componentDidMount(){
        // let { path, url } = useRouteMatch();
    }
    render() {
        const { text } = this.props;
        console.log('Render ', this.state);
        let data: any = this.state;
        let display;
        data && data.click
            ? display = img2
            : display = img;
        return (
          <div>
            {/*<div style={{ color: "red" }}>Hello {text}</div>*/}
            <div className="div-content">
              <div className="div-left">
                <Link className="nav-link" to={`/mods/gamodcheck`}>
                  GA Squad check
                </Link>
                <Link
                  className="nav-link"
                  to={`mods/colorup`}
                  onClick={(event) => this.handleClick(event)}
                >
                  Mods for colorUP
                </Link>
                <Switch>
                  <Route path="/mods/colorup">
                    <ColorUpPage text=" new just text" />
                  </Route>
                </Switch>
              </div>

              <div className="div-right">
                <img src={display} alt="logo" width="100%"></img>
              </div>
            </div>
          </div>
        );
    }
}


function testFunction() {
    // let { path, url } = useRouteMatch();
    return true;
}
