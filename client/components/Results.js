import React, { Component } from "react";
import { connect } from "react-redux";
import cacheResults from "../redux/actions/cacheResultsAction";
import { bindActionCreators } from "redux";
import marvelAPI from "../api/marvelAPI";

class Results extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            limit: 20,
            offset: 0
        };
        //TODO: limit and offset from props
        this.state.storageString =
            this.props.search.exploreBy +
            this.props.search.id +
            this.props.filter +
            this.state.limit +
            this.state.offset;
        this.convertResultToJSX = this.convertResultToJSX.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
    }

    componentWillMount () {
        // If relevant data has been stored already, load it otherwise request it from the API
        if (this.props.search.cachedResults.hasOwnProperty(this.state.storageString)) {
            // TODO: google below line interation
            this.state.loading = false;
        } else {
            marvelAPI
                .getFilteredSearch(
                    this.props.search.exploreBy,
                    this.props.search.id,
                    this.props.filter,
                    this.state.limit,
                    this.state.offset
                )
                .then(res => {
                    // Cache result agaisnt identifiable name
                    this.props.cacheResults(this.state.storageString, res.data.data.results);
                    this.setState({ loading: false });
                });
        }
    }

    goToDetails (id) {
        this.props.history.push("/" + this.props.filter + "/" + id);
    }

    convertResultToJSX (result) {
        switch (this.props.filter) {
            case "Characters":
                return (
                    <div key={result.id}>
                        <h4>{result.name}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
            case "Comics":
                return (
                    <div key={result.id}>
                        <h4>{result.title}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
            case "Creators":
                return (
                    <div key={result.id}>
                        <h4>{result.firstName + " " + result.lastName}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
            case "Events":
                return (
                    <div key={result.id}>
                        <h4>{result.title}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
            case "Series":
                return (
                    <div key={result.id}>
                        <h4>{result.title}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
            case "Stories":
                return (
                    <div key={result.id}>
                        <h4>{result.title}</h4>
                        <button onClick={this.goToDetails.bind(this, result.id)}>More Details</button>
                    </div>
                );
                break;
        }
    }

    render () {
        let source = this.props.search.cachedResults[this.state.storageString];
        let results;
        if (this.state.loading === true) {
            results = <h1> loading... </h1>;
        } else if (source === undefined) {
            results = <div />;
        } else if (source.length > 0) {
            results = (
                <div>
                    <h2>Results</h2>
                    {source.map(result => {
                        return this.convertResultToJSX(result);
                    })}
                </div>
            );
        } else if (source.length === 0) {
            results = <h2>No results for that.</h2>;
        }

        return <div>{results}</div>;
    }
}

const matchDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            cacheResults: cacheResults
        },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(Results);
