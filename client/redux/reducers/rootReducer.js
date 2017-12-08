import { combineReducers } from "redux";

export default combineReducers({
    reducer: function reducer (state = {}, action) {
        switch (action.type) {
            case "message":
                return Object.assign({}, { message: action.data });
            default:
                return state;
        }
    }
});
