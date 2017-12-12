import { UPDATE_PAGE_OPTIONS } from "./types";

export default function updatePageOptionsAction (sliderValue, pageNumber) {
    return dispatch => {
        dispatch(updatePageOptionsActionAsync(sliderValue, pageNumber));
    };
}

function updatePageOptionsActionAsync (sliderValue, pageNumber) {
    return {
        type: UPDATE_PAGE_OPTIONS,
        sliderValue: sliderValue,
        pageNumber: pageNumber
    };
}
