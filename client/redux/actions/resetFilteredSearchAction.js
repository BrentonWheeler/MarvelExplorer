import { RESET_FILTERED_SEARCH } from "./types";

export default function resetFilteredSearchAction () {
    return dispatch => {
        dispatch(resetFilteredSearchActionAsync());
    };
}

function resetFilteredSearchActionAsync () {
    return {
        type: RESET_FILTERED_SEARCH
    };
}
