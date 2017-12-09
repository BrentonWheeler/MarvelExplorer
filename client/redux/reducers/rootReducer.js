import { combineReducers } from "redux";
import SearchReducer from "./searchReducer";

export default combineReducers({
    searchState: SearchReducer,
    reducer: function reducer (state = {}, action) {
        switch (action.type) {
            case "message":
                return Object.assign({}, { message: action.data });
            default:
                return state;
        }
    }
});
