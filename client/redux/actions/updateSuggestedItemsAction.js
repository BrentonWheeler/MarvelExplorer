import { UPDATE_SUGGESTED_ITEMS } from "./types";

export default function updateSuggestedItemsAction (entityType, newItemArray, searchStringArray) {
    console.log(searchStringArray);
    return dispatch => {
        dispatch(updateSuggestedItemsActionAsync(entityType, newItemArray, searchStringArray));
    };
}

function updateSuggestedItemsActionAsync (entityType, newItemArray, searchStringArray) {
    return {
        type: UPDATE_SUGGESTED_ITEMS,
        entityType: entityType,
        newItemArray: newItemArray,
        searchStringArray: searchStringArray
    };
}
