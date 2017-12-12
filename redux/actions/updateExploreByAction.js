import { UPDATE_EXPLORE_BY } from "./types";

export default function updateExploreByAction (entityType) {
    return dispatch => {
        dispatch(updateExploreByActionAsync(entityType));
    };
}

function updateExploreByActionAsync (entityType) {
    return {
        type: UPDATE_EXPLORE_BY,
        exploreBy: entityType
    };
}
