//https://github.com/moroshko/react-autosuggest ~60% of code in this Component was taken from docs
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import PropTypes from "prop-types";
import axios from "axios";
import marvelAPI from "../api/marvelAPI";
import updateSearchValue from "../redux/actions/updateSearchValueAction";
import updateSuggestedItems from "../redux/actions/updateSuggestedItemsAction";

const SearchInputStyledDiv = styled.div`
    body {
        font-family: Helvetica, sans-serif;
    }

    .react-autosuggest__container {
        position: relative;
    }

    .react-autosuggest__input {
        width: 240px;
        height: 30px;
        padding: 10px 20px;
        font-family: Helvetica, sans-serif;
        font-weight: 300;
        font-size: 16px;
        border: 1px solid #aaa;
        border-radius: 4px;
    }

    .react-autosuggest__input--focused {
        outline: none;
    }

    .react-autosuggest__input--open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .react-autosuggest__suggestions-container {
        display: none;
    }

    .react-autosuggest__suggestions-container--open {
        display: block;
        position: absolute;
        top: 51px;
        width: 280px;
        border: 1px solid #aaa;
        background-color: #fff;
        font-family: Helvetica, sans-serif;
        font-weight: 300;
        font-size: 16px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 2;
    }

    .react-autosuggest__suggestions-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .react-autosuggest__suggestion {
        cursor: pointer;
        padding: 10px 20px;
    }

    .react-autosuggest__suggestion--highlighted {
        background-color: #ddd;
    }
`;

class SearchInput extends Component {
    constructor (props) {
        super(props);

        this.state = {
            suggestions: [],
            entityType: this.props.entityType,
            value: "",
            entityArray: [],
            cancelPreviousRequest: null,
            delayedSearch: null
        };

        // TODO: flip this statement
        if (
            this.props.entityType === "Comics" ||
            this.props.entityType === "Series" ||
            this.props.entityType === "Events"
        ) {
            this.state.searchByValue = "title";
        } else {
            this.state.searchByValue = "name";
        }

        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.escapeRegexCharacters = this.escapeRegexCharacters.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.searchAPIForSuggestions = this.searchAPIForSuggestions.bind(this);
    }

    escapeRegexCharacters (str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    getSuggestions (value) {
        const escapedValue = this.escapeRegexCharacters(value.trim());

        if (escapedValue === "") {
            return [];
        }

        const regex = new RegExp("^" + escapedValue, "i");

        return this.state.entityArray.filter(entity => regex.test(entity[this.state.searchByValue]));
    }

    getSuggestionValue (suggestion) {
        return suggestion[this.state.searchByValue];
    }

    onSuggestionsFetchRequested ({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    }

    onSuggestionsClearRequested () {
        this.setState({
            suggestions: []
        });
    }

    onChange (event, { newValue }) {
        // Maintaining a running timer to send a request to API after the user has stopped typing
        if (this.state.delayedSearch !== null) {
            clearTimeout(this.state.delayedSearch);
        }
        this.setState({
            delayedSearch: setTimeout(() => {
                this.searchAPIForSuggestions(newValue);
            }, 700)
        });
        this.setState({
            value: newValue
        });

        // Passing to redux store to use outside this component
        this.props.updateSearchValue(newValue);

        // TODO: Enable buttons here by styling
    }

    searchAPIForSuggestions (newValue) {
        // Cancleing the previous request if their is one pending
        if (this.state.cancelPreviousRequest !== null) {
            this.state.cancelPreviousRequest();
        }

        // Searching the api for suggestions if user given value is more than 0 characters
        if (newValue.length >= 1) {
            // Checking if current seach has been Cached to not unnecessarily draw from API
            // if (sessionStorage.getItem(this.state.entityType + "/" + newValue) !== null) {
            //     this.setState({
            //         entityArray: JSON.parse(sessionStorage.getItem(this.state.entityType + "/" + newValue))
            //     });
            // } else {
            // Otherwise request suggestions from API and then cache them
            let tempRequest = marvelAPI.getEntityStartingWith(this.state.entityType, newValue);
            tempRequest.get
                .then(res => {
                    let optimizedArray = res.data.data.results.map(dataItem => {
                        return { [this.state.searchByValue]: dataItem[this.state.searchByValue], id: dataItem.id };
                    });
                    this.setState({ entityArray: optimizedArray });
                    sessionStorage.setItem(this.state.entityType + "/" + newValue, JSON.stringify(optimizedArray));
                    this.onSuggestionsFetchRequested({ value: newValue });
                    this.props.updateSuggestedItems(this.state.entityType, optimizedArray);
                })
                .catch(thrown => {
                    if (axios.isCancel(thrown)) {
                        // intentional cancle of request
                    } else {
                        // handle error
                    }
                });

            this.setState({ cancelPreviousRequest: tempRequest.cancleFunc });
            //}
        }
    }

    renderSuggestion (suggestion) {
        return <span>{suggestion[this.state.searchByValue]}</span>;
    }

    render () {
        const { suggestions } = this.state;
        const { value } = this.state;

        const inputProps = {
            placeholder: "Select " + this.state.entityType,
            value,
            onChange: this.onChange
        };

        return (
            <SearchInputStyledDiv className="row center-align">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </SearchInputStyledDiv>
        );
    }
}

// TODO: add redux func proptype
SearchInput.propTypes = {
    entityType: PropTypes.string.isRequired
};

// Redux Connections
const matchDispatchToProps = dispatch => {
    return bindActionCreators(
        { updateSearchValue: updateSearchValue, updateSuggestedItems: updateSuggestedItems },
        dispatch
    );
};

export default connect(null, matchDispatchToProps)(SearchInput);
