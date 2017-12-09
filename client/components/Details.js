import React, { Component } from "react";
import PropTypes from "prop-types";
import marvelAPI from "../api/marvelAPI";

class Details extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            html: <div />,
            possibleProperties: ["characters", "comics", "creators", "events", "series", "stories"]
        };
        this.convertDetailsToHTML = this.convertDetailsToHTML.bind(this);
    }

    componentWillMount () {
        //start loading state
        marvelAPI.getDetails(this.props.match.params.entityType, this.props.match.params.id).then(res => {
            console.log(res);
            this.convertDetailsToHTML(res);
        });
    }

    convertDetailsToHTML (responseJSON) {
        // link back to marvel at bottom
        let details = responseJSON.data.data.results[0];
        let pageHeader;
        let description = <div />;
        let thumbnail = <div />;
        if (details.hasOwnProperty("name")) {
            pageHeader = details.name;
        } else if (details.hasOwnProperty("title")) {
            pageHeader = details.title;
        } else {
            pageHeader = details.fullName;
        }
        if (details.hasOwnProperty("description")) {
            if (details.thumbnail != null) {
                description = (
                    <div>
                        <h3>Description: {details.description}</h3>
                    </div>
                );
            }
        }
        if (details.hasOwnProperty("thumbnail")) {
            if (details.thumbnail != null) {
                thumbnail = (
                    <div>
                        <img
                            src={details.thumbnail.path + "/standard_fantastic." + details.thumbnail.extension}
                            alt={pageHeader + " thumbnail"}
                        />
                    </div>
                );
            }
        }

        console.log(details);
        let html = (
            <div>
                <h1>{pageHeader}</h1>
                <h1>{description}</h1>
                <h3>{thumbnail}</h3>
                {this.state.possibleProperties.map(property => {
                    if (details.hasOwnProperty(property)) {
                        return (
                            <div>
                                <h5>{property}</h5>
                            </div>
                        );
                    }
                })}
            </div>
        );
        this.setState({ html: html });
    }

    render () {
        return <div>{this.state.html}</div>;
    }
}

Details.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default Details;
