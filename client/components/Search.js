import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
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
                <div>
                    <ExploreBy />
                </div>
            );
        } else if (this.props.search.searchID === null) {
            return (
                <div>
                    <ExploreBy />
                    <SearchInput exploreBy={this.props.search.exploreBy} />
                </div>
            );
        } else {
            return (
                <div>
                    <ExploreBy />
                    <SearchInput exploreBy={this.props.search.exploreBy} />
                    <h5>View Their...</h5>
                    <ResultsContainer />
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
