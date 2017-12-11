import { UPDATE_SEARCH_ID } from "./types";

export default function updateSearchIDAction (id) {
    return dispatch => {
        dispatch(updateSearchIDActionAsync(id));
    };
}

function updateSearchIDActionAsync (id) {
    return {
        type: UPDATE_SEARCH_ID,
        id: id
    };
}
