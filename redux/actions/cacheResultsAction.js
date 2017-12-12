import { CACHE_RESULTS } from "./types";

export default function cacheResultsAction (storageString, results) {
    return dispatch => {
        dispatch(cacheResultsActionAsync(storageString, results));
    };
}

function cacheResultsActionAsync (storageString, results) {
    return {
        type: CACHE_RESULTS,
        storageString: storageString,
        results: results
    };
}
