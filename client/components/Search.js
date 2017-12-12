import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchInput from "./SearchInput";
import ResultsContainer from "./ResultsContainer";
import ExploreBy from "./ExploreBy";

class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loadingResults: false
        };
    }

    render () {
        if (this.props.search.exploreBy === null) {
            return (
                <div className="container">
                    <ExploreBy />
                </div>
            );
        } else if (this.props.search.id === null) {
            return (
                <div className="container">
                    <ExploreBy />
                    <div className="row">
                        <div className="col s10 offset-s1 l6 offset-l3">
                            <SearchInput exploreBy={this.props.search.exploreBy} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <ExploreBy />
                    <div className="row">
                        <div className="col s10 offset-s1 l6 offset-l3 ">
                            <SearchInput exploreBy={this.props.search.exploreBy} />
                        </div>
                    </div>
                    <ResultsContainer history={this.props.history} />
                </div>
            );
        }
    }
}

// TODO: add match proptype
Search.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

// Redux Connections
const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, null)(Search);
