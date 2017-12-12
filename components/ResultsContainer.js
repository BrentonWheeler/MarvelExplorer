import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Details from "./Details";
import Results from "./Results";
import { bindActionCreators } from "redux";
import updatePageOptions from "../redux/actions/updatePageOptionsAction";

class ResultsContainer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            entitiesRelationship: {
                Characters: ["Comics", "Events", "Series", "Stories"],
                Comics: ["Characters", "Creators", "Events", "Stories"],
                Events: ["Characters", "Comics", "Creators", "Series", "Stories"],
                Series: ["Characters", "Comics", "Creators", "Events", "Stories"]
            }
        };
        this.resetPageNumber = this.resetPageNumber.bind(this);
    }

    resetPageNumber () {
        this.props.updatePageOptions(this.props.search.sliderValue, 1);
    }

    render () {
        return (
            <Tabs onSelect={this.resetPageNumber}>
                <TabList>
                    <Tab>Details</Tab>
                    {this.state.entitiesRelationship[this.props.search.exploreBy].map(relationship => {
                        return <Tab>{relationship}</Tab>;
                    })}
                </TabList>

                <TabPanel>
                    <Details />
                </TabPanel>
                {this.state.entitiesRelationship[this.props.search.exploreBy].map(relationship => {
                    return (
                        <TabPanel>
                            <Results history={this.props.history} filter={relationship} />
                        </TabPanel>
                    );
                })}
            </Tabs>
        );
    }
}

// Redux Connections
const matchDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            updatePageOptions: updatePageOptions
        },
        dispatch
    );
};

const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(ResultsContainer);
