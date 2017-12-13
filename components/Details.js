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
            storageString: this.props.search.exploreBy + this.props.search.id,
            APIfromURL: null,
            possibleRelationships: ["characters", "comics", "creators", "events", "series", "stories"]
        };
        this.convertDetailsToJSX = this.convertDetailsToJSX.bind(this);
    }

    componentWillMount () {
        // Load details from direct URL access
        if (this.props.match !== undefined) {
            marvelAPI.getDetails(this.props.match.params.entityType, this.props.match.params.id).then(res => {
                this.setState({ loading: false, APIfromURL: res.data.data.results[0] });
            });
        } else if (this.props.search.cachedResults.hasOwnProperty(this.state.storageString)) {
            // If relevant data has been stored already, load it otherwise request it from the API
            this.setState({ loading: false });
        } else {
            marvelAPI
                .getDetails(this.props.search.exploreBy, this.props.search.id)
                .then(res => {
                    // Cache result agaisnt identifiable name
                    this.props.cacheResults(this.state.storageString, res.data.data.results[0]);
                    this.setState({ loading: false });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ loading: false });
                });
        }
    }

    // TODO: link back to marvel at bottom
    convertDetailsToJSX (source) {
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
            if (source.description !== null && source.description !== "") {
                description = (
                    <div>
                        <h3>Description</h3>
                        <p className="flow-text">{source.description}</p>
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
        let stats = this.state.possibleRelationships.map(rel => {
            if (source.hasOwnProperty(rel)) {
                return (
                    <div>
                        <div className="flow-text">
                            {source[rel].hasOwnProperty("available") ? source[rel].available : 1} {rel}
                        </div>
                    </div>
                );
            }
        });

        return (
            <div className="container center-align">
                <h1>{header}</h1>
                {thumbnail}
                {description}
                <h3>Stats</h3>
                {stats}
            </div>
        );
    }

    render () {
        let source;
        if (this.state.APIfromURL !== null) {
            source = this.state.APIfromURL;
        } else {
            source = this.props.search.cachedResults[this.state.storageString];
        }
        let html;
        if (this.state.loading === true) {
            html = (
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
            );
        } else if (source === undefined) {
            html = <div />;
        } else if (source !== undefined) {
            html = this.convertDetailsToJSX(source);
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
