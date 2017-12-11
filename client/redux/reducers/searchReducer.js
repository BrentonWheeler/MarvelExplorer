import {
    GET_FILTERED_SEARCH,
    UPDATE_SEARCH_VALUE,
    UPDATE_SUGGESTED_ITEMS,
    RESET_FILTERED_SEARCH,
    UPDATE_EXPLORE_BY,
    UPDATE_SEARCH_ID,
    CACHE_RESULTS
} from "../actions/types";

const initialState = {
    filteredSearch: null,
    filter: null,
    inputValue: null,
    exploreBy: null,
    searchID: null,
    cachedResults: {},
    Characters: [],
    Comics: [],
    Events: [],
    Series: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_FILTERED_SEARCH:
            return Object.assign({}, state, {
                filteredSearch: action.filteredSearch,
                filter: action.filter
            });
            break;
        case RESET_FILTERED_SEARCH:
            return Object.assign({}, state, {
                filteredSearch: null,
                filter: null
            });
            break;
        case UPDATE_SEARCH_VALUE:
            return Object.assign({}, state, {
                inputValue: action.value
            });
            break;
        case UPDATE_SEARCH_ID:
            return Object.assign({}, state, {
                searchID: action.id
            });
            break;
        case UPDATE_SUGGESTED_ITEMS:
            return Object.assign({}, state, {
                [action.entityType]: addNewItemsToArray(state[action.entityType], action.newItemArray)
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
