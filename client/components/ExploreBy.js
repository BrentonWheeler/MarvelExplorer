import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import updateExploreBy from "../redux/actions/updateExploreByAction";

class ExploreBy extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entities: ["Characters", "Comics", "Events", "Series"]
        };
        this.searchBy = this.searchBy.bind(this);
    }

    searchBy (entity) {
        // Update redux here this.props.searchType
        this.props.updateExploreBy(entity);
    }

    render () {
        return (
            <div>
                <h3>Explore By</h3>
                {this.state.entities.map((entity, i) => {
                    return (
                        <button
                            disabled={this.props.search.exploreBy === entity}
                            onClick={this.searchBy.bind(this, entity)}
                            key={i}
                        >
                            {entity}
                        </button>
                    );
                })}
            </div>
        );
    }
}

ExploreBy.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

// Redux Connections
const matchDispatchToProps = dispatch => {
    return bindActionCreators({ updateExploreBy: updateExploreBy }, dispatch);
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(ExploreBy);
