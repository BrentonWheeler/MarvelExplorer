import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Details from "./Details";
import Results from "./Results";

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
    }

    render () {
        return (
            <Tabs>
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
                            <Results filter={relationship} />
                        </TabPanel>
                    );
                })}
            </Tabs>
        );
    }
}

// Redux Connections
const mapStateToProps = state => {
    return {
        search: state.searchState
    };
};

export default connect(mapStateToProps, null)(ResultsContainer);
