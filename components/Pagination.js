import React, { Component } from "react";
import { connect } from "react-redux";
import updatePageOptions from "../redux/actions/updatePageOptionsAction";
import { bindActionCreators } from "redux";

class Pagination extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sliderValue: this.props.search.sliderValue
        };
        this.sliderOnChange = this.sliderOnChange.bind(this);
        this.pageOnChange = this.pageOnChange.bind(this);
    }

    sliderOnChange (event) {
        this.setState({ sliderValue: event.target.value });
        //this.props.updatePageOptions(event.target.value, this.props.search.pageNumber);
    }

    pageOnChange (event, number) {
        this.props.updatePageOptions(this.state.sliderValue, number);
    }

    render () {
        let displayPageButtons = () => {
            let buttons = [];
            for (var i = this.props.search.pageNumber - 2; i <= this.props.search.pageNumber + 2; i++) {
                if (i > 0) {
                    // TODO: check if its outside max range of that slider value
                    if (i === this.props.search.pageNumber) {
                        buttons.push(
                            <li key={i} className="waves-effect blue-grey  lighten-1">
                                <a onClick={this.pageOnChange.bind(this, event, i)}>{i}</a>
                            </li>
                        );
                    } else {
                        buttons.push(
                            <li key={i} className="waves-effect">
                                <a onClick={this.pageOnChange.bind(this, event, i)}>{i}</a>
                            </li>
                        );
                    }
                }
            }

            return buttons;
        };

        let html = (
            <div>
                <form>
                    <p className="range-field">
                        <input
                            onChange={this.sliderOnChange}
                            value={this.state.sliderValue}
                            type="range"
                            id="slider"
                            min="1"
                            max="100"
                        />
                    </p>
                    <div className="center-align">{this.state.sliderValue} results</div>
                </form>
                <ul className="pagination">{displayPageButtons()}</ul>
            </div>
        );
        return <div>{html}</div>;
    }
}

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

export default connect(mapStateToProps, matchDispatchToProps)(Pagination);
