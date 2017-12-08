import React, { Component } from "react";
import PropTypes from "prop-types";

import SearchInput from "./SearchInput";

class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entities: {
                Characters: ["Comics", "Events", "Series", "Stories"],
                Comics: ["Characters", "Creators", "Events", "Stories"],
                Creators: ["Comics", "Events", "Series", "Stories"],
                Events: ["Characters", "Comics", "Creators", "Series", "Stories"],
                Series: ["Characters", "Comics", "Creators", "Events", "Stories"],
                Stories: ["Characters", "Comics", "Creators", "Events", "Series"]
            },
            searchBy: this.props.match.params.searchBy
        };
        this.filterBy = this.filterBy.bind(this);
    }

    filterBy (filter) {
        console.log(filter);
    }

    render () {
        let searchByEntity = this.state.searchBy;
        return (
            <div>
                <h1>Exploring By {searchByEntity}</h1>
                <SearchInput entityType={searchByEntity} />
                <h3>View Their...</h3>
                <div>
                    {this.state.entities[searchByEntity].map((filter, i) => {
                        return (
                            <button onClick={this.filterBy.bind(this, filter)} key={i}>
                                {filter}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
}

// TODO: add match proptype
Search.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default Search;
