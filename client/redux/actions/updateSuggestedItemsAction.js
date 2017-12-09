import { UPDATE_SUGGESTED_ITEMS } from "./types";

export default function updateSuggestedItemsAction (entityType, newItemArray) {
    return dispatch => {
        dispatch(updateSuggestedItemsActionAsync(entityType, newItemArray));
    };
}

function updateSuggestedItemsActionAsync (entityType, newItemArray) {
    return {
        type: UPDATE_SUGGESTED_ITEMS,
        entityType: entityType,
        newItemArray: newItemArray
    };
}
