import { UPDATE_SEARCH_VALUE } from "./types";

export default function updateSearchValueAction (value) {
    return dispatch => {
        dispatch(updateSearchValueActionAsync(value));
    };
}

function updateSearchValueActionAsync (value) {
    return {
        type: UPDATE_SEARCH_VALUE,
        value: value
    };
}
