import {
    UPDATE_SEARCH_VALUE,
    UPDATE_SUGGESTED_ITEMS,
    UPDATE_EXPLORE_BY,
    UPDATE_SEARCH_ID,
    CACHE_RESULTS
} from "../actions/types";

const initialState = {
    filteredSearch: null,
    filter: null,
    inputValue: "",
    exploreBy: null,
    id: null,
    cachedResults: {},
    cachedSearches: [],
    Characters: [],
    Comics: [],
    Events: [],
    Series: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SEARCH_VALUE:
            return Object.assign({}, state, {
                inputValue: action.value
            });
            break;
        case UPDATE_SEARCH_ID:
            return Object.assign({}, state, {
                id: action.id
            });
            break;
        case UPDATE_SUGGESTED_ITEMS:
            return Object.assign({}, state, {
                [action.entityType]: addNewItemsToArray(state[action.entityType], action.newItemArray),
                cachedSearches: addNewItemsToArray(state.cachedSearches, action.searchStringArray)
            });
            break;
        case UPDATE_EXPLORE_BY:
            return Object.assign({}, state, {
                exploreBy: action.exploreBy
            });
            break;
        case CACHE_RESULTS:
            let newCache = Object.assign({}, state.cachedResults, {
                [action.storageString]: action.results
            });
            return Object.assign({}, state, {
                cachedResults: newCache
            });
            break;

        default:
            return state;
    }
};

// Helper functions
function addNewItemsToArray (baseArray, newItemArray) {
    // Check if its included first if not add it
    let newArray = baseArray.slice();
    let isIncluded;
    for (let i = 0; i < newItemArray.length; i++) {
        isIncluded = false;
        for (let j = 0; j < baseArray.length; j++) {
            if (baseArray[j].id === newItemArray[i].id) {
                isIncluded = true;
                break;
            }
        }
        if (!isIncluded) {
            newArray.push(newItemArray[i]);
        }
    }
    return newArray;
}
