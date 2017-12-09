import React, { Component } from "react";
import { connect } from "react-redux";

class Results extends Component {
    constructor (props) {
        super(props);
        this.convertResultToHTML = this.convertResultToHTML.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
    }

    goToDetails (id) {
        //save url here
        this.props.history.push("/" + this.props.search.filter + "/" + id);
    }

    convertResultToHTML (result) {
        switch (this.props.search.filter) {
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
        let results;
        if (this.props.loading === true) {
            results = <h1> loading... </h1>;
        } else if (this.props.search.filteredSearch === null) {
            results = <div />;
        } else if (this.props.search.filteredSearch.length > 0) {
            results = (
                <div>
                    <h2>Results</h2>
                    {this.props.search.filteredSearch.map(result => {
                        return this.convertResultToHTML(result);
                    })}
                </div>
            );
        } else if (this.props.search.filteredSearch.length === 0) {
            results = <h2>No results for that.</h2>;
        }

        return <div>{results}</div>;
    }
}

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, null)(Results);
