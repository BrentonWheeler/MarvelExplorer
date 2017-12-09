import { GET_FILTERED_SEARCH } from "./types";
import marvelAPI from "../../api/marvelAPI";

export default function getFilteredSearchAction (entityType, id, filter) {
    return dispatch => {
        return marvelAPI.getFilteredSearch(entityType, id, filter).then(res => {
            dispatch(getFilteredSearchActionAsync(res.data.data.results, filter));
        });
    };
}

function getFilteredSearchActionAsync (filteredSearch, filter) {
    return {
        type: GET_FILTERED_SEARCH,
        filteredSearch: filteredSearch,
        filter: filter
    };
}
