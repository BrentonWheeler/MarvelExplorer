import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import updateExploreBy from "../redux/actions/updateExploreByAction";
import updateSearchID from "../redux/actions/updateSearchIDAction";
import updateSearchValue from "../redux/actions/updateSearchValueAction";

class ExploreBy extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entities: [
                { type: "Characters", icon: "face" },
                { type: "Comics", icon: "picture_in_picture" },
                { type: "Events", icon: "event" },
                { type: "Series", icon: "format_list_numbered" }
            ]
        };
        this.searchBy = this.searchBy.bind(this);
    }

    searchBy (entity) {
        // TODO: re insert search value after resetting state
        //let tempSearchValue = this.props.search.inputValue;
        this.props.updateSearchValue("");
        this.props.updateSearchID(null);
        this.props.updateExploreBy(entity);
        //this.props.updateSearchValue(tempSearchValue);
    }

    render () {
        return (
            <div className="center-align ">
                <h3>Explore By</h3>
                <div className="row ">
                    <div className="row col s12 offset-l2">
                        {this.state.entities.map((entity, i) => {
                            return (
                                <button
                                    className="waves-effect waves-light btn-large col s6 l2"
                                    disabled={this.props.search.exploreBy === entity.type}
                                    onClick={this.searchBy.bind(this, entity.type)}
                                    key={i}
                                >
                                    <i className="material-icons left">{entity.icon}</i>
                                    {entity.type}
                                </button>
                            );
                        })}
                    </div>
                </div>
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
    return bindActionCreators(
        { updateExploreBy: updateExploreBy, updateSearchID: updateSearchID, updateSearchValue: updateSearchValue },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(ExploreBy);
