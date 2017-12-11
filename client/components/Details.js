import React, { Component } from "react";
import marvelAPI from "../api/marvelAPI";
import { connect } from "react-redux";
import cacheResults from "../redux/actions/cacheResultsAction";
import { bindActionCreators } from "redux";

class Details extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            storageString: this.props.search.exploreBy + this.props.search.searchID
        };
        this.convertDetailsToHTML = this.convertDetailsToHTML.bind(this);
    }

    componentWillMount () {
        // If relevant data has been stored already, load it otherwise request it from the API
        if (this.props.search.cachedResults.hasOwnProperty(this.state.storageString)) {
            this.setState({ loading: false });
        } else {
            marvelAPI.getDetails(this.props.search.exploreBy, this.props.search.searchID).then(res => {
                // Cache result agaisnt identifiable name
                this.props.cacheResults(this.state.storageString, res.data.data.results[0]);
                this.setState({ loading: false });
            });
        }
    }

    // TODO: link back to marvel at bottom
    convertDetailsToHTML (source) {
        console.log("source");
        console.log(source);
        let header;
        let description = <div />;
        let thumbnail = <div />;
        if (source.hasOwnProperty("name")) {
            header = source.name;
        } else if (source.hasOwnProperty("title")) {
            header = source.title;
        } else {
            header = source.fullName;
        }
        if (source.hasOwnProperty("description")) {
            if (source.thumbnail != null) {
                description = (
                    <div>
                        <h3>Description: {source.description}</h3>
                    </div>
                );
            }
        }
        if (source.hasOwnProperty("thumbnail")) {
            if (source.thumbnail != null) {
                thumbnail = (
                    <div>
                        <img
                            src={source.thumbnail.path + "/standard_fantastic." + source.thumbnail.extension}
                            alt={header + " thumbnail"}
                        />
                    </div>
                );
            }
        }

        return (
            <div>
                <h1>{header}</h1>
                <h1>{description}</h1>
                <h3>{thumbnail}</h3>
            </div>
        );
    }

    render () {
        let source = this.props.search.cachedResults[this.state.storageString];
        let html;
        if (this.state.loading === true) {
            html = <h1> loading... </h1>;
        } else if (source === undefined) {
            html = <div />;
        } else if (source !== undefined) {
            html = this.convertDetailsToHTML(source);
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

export default connect(mapStateToProps, matchDispatchToProps)(Details);