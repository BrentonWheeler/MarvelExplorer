import { CACHE_RESULTS } from "./types";

export default function updateExploreByAction (storageString, results) {
    return dispatch => {
        dispatch(updateExploreByActionAsync(storageString, results));
    };
}

function updateExploreByActionAsync (storageString, results) {
    return {
        type: CACHE_RESULTS,
        storageString: storageString,
        results: results
    };
}
