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
import updateSearchID from "../redux/actions/updateSearchIDAction";

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
        width: 100%;
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
            value: "",
            entityArray: [],
            cancelPreviousRequest: null,
            delayedSearch: null
        };

        if (this.props.exploreBy === "Characters") {
            this.state.searchByValue = "name";
        } else {
            this.state.searchByValue = "title";
        }

        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.escapeRegexCharacters = this.escapeRegexCharacters.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.searchAPIForSuggestions = this.searchAPIForSuggestions.bind(this);
        this.checkForMatch = this.checkForMatch.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.exploreBy !== this.props.exploreBy) {
            if (nextProps.exploreBy === "Characters") {
                this.setState({ searchByValue: "name" });
            } else {
                this.setState({ searchByValue: "title" });
            }

            this.onSuggestionsClearRequested();
            this.searchAPIForSuggestions(this.state.value, nextProps.exploreBy);
        }
    }

    checkForMatch (value) {
        this.props.updateSearchID(null);
        for (let i = 0; i < this.props.search[this.props.search.exploreBy].length; i++) {
            if (
                this.props.search[this.props.search.exploreBy][i][this.state.searchByValue].toLowerCase() ===
                this.props.search.inputValue.toLowerCase()
            ) {
                this.props.updateSearchID(this.props.search[this.props.search.exploreBy][i].id);
            }
        }
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
        // Checking that the user did not just click a suggestion which would change capitalization
        if (this.props.search.inputValue.toLowerCase() !== newValue.toLowerCase()) {
            // Maintaining a running timer to send a request to API after the user has stopped typing
            if (this.state.delayedSearch !== null) {
                clearTimeout(this.state.delayedSearch);
            }

            this.setState({
                delayedSearch: setTimeout(() => {
                    this.searchAPIForSuggestions(newValue, this.props.exploreBy);
                }, 500)
            });

            this.setState({
                value: newValue
            });
            // Passing to redux store to use search value outside this component
            this.props.updateSearchValue(newValue);
        }
    }

    searchAPIForSuggestions (newValue, exploreBy) {
        // Cancleing the previous request if their is one pending
        if (this.state.cancelPreviousRequest !== null) {
            this.state.cancelPreviousRequest();
        }

        // Searching the api for suggestions if user given value is more than 0 characters
        if (newValue.length > 0) {
            // If search has been done before, load from memory
            if (this.props.search.cachedSearches.includes(this.props.search.exploreBy + newValue)) {
                this.onSuggestionsFetchRequested({ value: newValue });
                this.checkForMatch(newValue);
                // Else load from API
            } else {
                let tempRequest = marvelAPI.getEntityStartingWith(exploreBy, newValue);
                tempRequest.get
                    .then(res => {
                        let optimizedArray = res.data.data.results.map(dataItem => {
                            return { [this.state.searchByValue]: dataItem[this.state.searchByValue], id: dataItem.id };
                        });
                        this.setState({ entityArray: optimizedArray });
                        this.onSuggestionsFetchRequested({ value: newValue });
                        this.props.updateSuggestedItems(exploreBy, optimizedArray, [
                            this.props.search.exploreBy + newValue
                        ]);
                        // Shows suggestions that might be hidden under keyboard for mobile
                        document.activeElement.scrollIntoView({
                            behaviour: "smooth",
                            block: "start",
                            inline: "nearest"
                        });
                        this.checkForMatch(newValue);
                    })
                    .catch(thrown => {
                        if (axios.isCancel(thrown)) {
                            // intentional cancle of request
                        }
                    });

                this.setState({ cancelPreviousRequest: tempRequest.cancleFunc });
            }
        }
    }

    renderSuggestion (suggestion) {
        return <span className="l12 s12">{suggestion[this.state.searchByValue]}</span>;
    }

    render () {
        const { suggestions } = this.state;
        const value = this.props.search.inputValue;

        const inputProps = {
            placeholder: "Search " + this.props.exploreBy,
            value,
            onChange: this.onChange
        };

        return (
            <SearchInputStyledDiv className="row center-align">
                <Autosuggest
                    focusInputOnSuggestionClick={false}
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
        {
            updateSearchValue: updateSearchValue,
            updateSuggestedItems: updateSuggestedItems,
            updateSearchID: updateSearchID
        },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(SearchInput);
