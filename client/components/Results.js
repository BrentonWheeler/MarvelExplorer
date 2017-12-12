import React, { Component } from "react";
import { connect } from "react-redux";
import cacheResults from "../redux/actions/cacheResultsAction";
import { bindActionCreators } from "redux";
import marvelAPI from "../api/marvelAPI";
import { Link } from "react-router-dom";
import Truncate from "react-truncate";

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
            this.setState({ loading: false });
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
        this.props.history.push("/" + this.props.filter + "/" + id + "/");
    }

    convertResultToJSX (result) {
        let header;
        switch (this.props.filter) {
            case "Characters":
                header = result.name;
                break;
            case "Creators":
                header = result.firstName + " " + result.lastName;
                break;
            default:
                header = result.title;
                break;
        }
        // TODO: check if mobile so both image sets dont load
        return (
            <li key={result.id} className="collection-item avatar row">
                <img
                    className="hide-on-large-only circle"
                    src={
                        result.hasOwnProperty("thumbnail") && result.thumbnail != null ?
                            result.thumbnail.path + "/portrait_small." + result.thumbnail.extension :
                            ""
                    }
                    alt={header + " thumbnail"}
                />
                <img
                    className="hide-on-small-only col l2"
                    src={
                        result.hasOwnProperty("thumbnail") && result.thumbnail != null ?
                            result.thumbnail.path + "/portrait_uncanny." + result.thumbnail.extension :
                            ""
                    }
                    alt={header + " thumbnail"}
                />
                <span className="title hide-on-large-only ">
                    <b>{header}</b>
                </span>
                <span className="title hide-on-small-only ">
                    <h5>{header}</h5>
                </span>
                <p>
                    <Truncate lines={2} ellipsis={<span>...</span>}>
                        {result.hasOwnProperty("description") && result.description !== "" ?
                            result.description :
                            "No description."}
                    </Truncate>
                </p>
                <Link to={"/" + this.props.filter + "/" + result.id}>More Details</Link>
            </li>
        );
    }

    render () {
        let source = this.props.search.cachedResults[this.state.storageString];
        let html;
        if (this.state.loading === true) {
            html = (
                <div
                    className="App row valign-wrapper"
                    style={{
                        marginTop: "20%"
                    }}
                >
                    <div className="col s6 offset-s3 center-align ">
                        <div className="progress">
                            <div className="indeterminate" />
                        </div>
                    </div>
                </div>
            );
        } else if (source === undefined) {
            html = <div />;
        } else if (source.length > 0) {
            html = (
                <div>
                    <h3>Results</h3>
                    <ul className="collection">
                        {source.map(result => {
                            return this.convertResultToJSX(result);
                        })}
                    </ul>
                </div>
            );
        } else if (source.length === 0) {
            html = <h2>No results for that.</h2>;
        }

        return <div>{html}</div>;
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
