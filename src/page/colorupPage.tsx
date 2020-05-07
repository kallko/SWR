import * as React from "react";
import {config} from "../config/configService";



const url = config.get('url');
export type Props = { text: string };

export default class ColorupPage extends React.Component<Props> {
    componentDidMount() {
        (async () => {
            const data = await fetch(url + "/mods/colorup");
            const status = await data.json();
            this.setState({data : status});
        })();
    }
    render() {
        const { text } = this.props;

        return <div style={{ color: "red" }}>Hello {text}</div>;
    }
}
