import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SearchInput from "./SearchInput";
import Results from "./Results";
import getFilteredSearch from "../redux/actions/getFilteredSearchAction";
import resetFilteredSearch from "../redux/actions/resetFilteredSearchAction";

class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entities: {
                Characters: ["Comics", "Events", "Series", "Stories"],
                Comics: ["Characters", "Creators", "Events", "Stories"],
                //Creators: ["Comics", "Events", "Series", "Stories"],
                Events: ["Characters", "Comics", "Creators", "Series", "Stories"],
                Series: ["Characters", "Comics", "Creators", "Events", "Stories"] //,
                //Stories: ["Characters", "Comics", "Creators", "Events", "Series"]
            },
            searchBy: this.props.match.params.searchBy,
            loadingResults: false
        };
        this.filterBy = this.filterBy.bind(this);
    }

    componentDidMount () {
        this.props.resetFilteredSearch();
    }

    filterBy (filter) {
        this.setState({ loadingResults: true });
        let id;
        let searchByValue;

        if (this.state.searchBy === "Characters") {
            searchByValue = "name";
        } else {
            searchByValue = "title";
        }

        for (let i = 0; i < this.props.search[this.state.searchBy].length; i++) {
            if (this.props.search[this.state.searchBy][i][searchByValue] === this.props.search.inputValue) {
                id = this.props.search[this.state.searchBy][i].id;
                break;
            }
        }

        this.props.getFilteredSearch(this.state.searchBy, id, filter).then(res => {
            // TODO: put loading state here
            this.setState({ loadingResults: false });
        });
        //getFilteredSearch action here
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
                <Results history={this.props.history} loading={this.state.loadingResults} />
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

// Redux Connections
const matchDispatchToProps = dispatch => {
    return bindActionCreators(
        { getFilteredSearch: getFilteredSearch, resetFilteredSearch: resetFilteredSearch },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(Search);
