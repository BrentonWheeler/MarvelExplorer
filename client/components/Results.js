import React, { Component } from "react";
import { connect } from "react-redux";
import cacheResults from "../redux/actions/cacheResultsAction";
import { bindActionCreators } from "redux";
import marvelAPI from "../api/marvelAPI";
import { Link } from "react-router-dom";
import Truncate from "react-truncate";
import Pagination from "./Pagination";

class Results extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            storageString: null
        };

        this.convertResultToJSX = this.convertResultToJSX.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.cacheCheck = this.cacheCheck.bind(this);
    }

    componentWillMount () {
        this.cacheCheck();
    }

    componentWillReceiveProps (nextProps) {
        if (
            nextProps.search.pageNumber !== this.props.search.pageNumber ||
            nextProps.search.sliderValue !== this.props.search.sliderValue
        ) {
            this.cacheCheck(
                nextProps.search.sliderValue,
                nextProps.search.sliderValue * (nextProps.search.pageNumber - 1)
            );
        }
    }

    cacheCheck (
        limit = this.props.search.sliderValue,
        offset = this.props.search.sliderValue * (this.props.search.pageNumber - 1)
    ) {
        // If relevant data has been stored already, load it otherwise request it from the API
        this.setState(
            {
                storageString: this.props.search.exploreBy + this.props.search.id + this.props.filter + limit + offset
            },
            () => {
                if (!this.props.search.cachedResults.hasOwnProperty(this.state.storageString)) {
                    this.setState({ loading: true });
                    marvelAPI
                        .getFilteredSearch(
                            this.props.search.exploreBy,
                            this.props.search.id,
                            this.props.filter,
                            limit,
                            offset
                        )
                        .then(res => {
                            // Cache result agaisnt identifiable name
                            this.props.cacheResults(this.state.storageString, res.data.data.results);
                            this.setState({ loading: false });
                        });
                }
            }
        );
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
                            "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_small.jpg"
                    }
                    alt={header + " thumbnail"}
                />
                <img
                    className="hide-on-small-only col l2"
                    src={
                        result.hasOwnProperty("thumbnail") && result.thumbnail != null ?
                            result.thumbnail.path + "/portrait_uncanny." + result.thumbnail.extension :
                            "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_uncanny.jpg"
                    }
                    alt={header + " thumbnail"}
                />
                <span className="title hide-on-large-only flow-text">
                    <b>{header}</b>
                </span>
                <span className="title hide-on-small-only flow-text">
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
                <div>
                    <div className="center-align">
                        <Pagination />
                    </div>
                    <div
                        className="row valign-wrapper"
                        style={{
                            marginTop: "15%"
                        }}
                    >
                        <div className="col s6 offset-s3 center-align ">
                            <div className="progress">
                                <div className="indeterminate" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (source === undefined) {
            html = <div />;
        } else if (source.length > 0) {
            html = (
                <div>
                    <div className="center-align">
                        <Pagination />
                    </div>
                    <h2 className="center-align">Results</h2>
                    <ul className="collection">
                        {source.map(result => {
                            return this.convertResultToJSX(result);
                        })}
                    </ul>
                </div>
            );
        } else if (source.length === 0) {
            html = (
                <div>
                    <div className="center-align">
                        <Pagination />
                    </div>
                    No results for that.
                </div>
            );
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
