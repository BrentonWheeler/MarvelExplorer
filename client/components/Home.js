import React, { Component } from "react";
import PropTypes from "prop-types";

class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entities: ["Characters", "Comics", "Creators", "Events", "Series", "Stories"]
        };
        this.searchBy = this.searchBy.bind(this);
    }

    componentWillMount () {
        // marvelAPI.getCharacters().then(res => {
        //     console.log(res.data.data.results);
        //     this.setState({ heros: res.data.data.results });
        // });
    }

    searchBy (entity) {
        this.props.history.push(entity + "/");
    }

    render () {
        return (
            <div>
                <h1>Marvel Explorer</h1>
                <h3>Explore By</h3>
                {this.state.entities.map((entity, i) => {
                    return (
                        <button onClick={this.searchBy.bind(this, entity)} key={i}>
                            {entity}
                        </button>
                    );
                })}
            </div>
        );
    }
}

Home.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default Home;
