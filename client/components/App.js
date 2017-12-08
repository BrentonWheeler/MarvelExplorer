import React, { Component } from "react";
import marvelAPI from "../api/marvelAPI";

class App extends Component {
    constructor (props) {
        super(props);
        this.state = { heros: [] };
    }

    componentWillMount () {
        marvelAPI.getCharacters().then(res => {
            console.log(res.data.data.results);
            this.setState({ heros: res.data.data.results });
        });
        //console.log(process.env.test);
    }

    render () {
        return <div>hello world</div>;
    }
}

export default App;
