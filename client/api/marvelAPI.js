import axios from "axios";
let CancelToken = axios.CancelToken;
let cancel;

let marvelAPI = {
    getEntityStartingWith: (entityType, value) => {
        let startsWithPrefix;
        if (entityType === "Comics" || entityType === "Series") {
            startsWithPrefix = "title";
        } else {
            startsWithPrefix = "name";
        }

        return {
            get: axios.get(
                "http://gateway.marvel.com/v1/public/" +
                    entityType.toLowerCase() +
                    "?apikey=" +
                    process.env.MARVEL_PUBLIC_KEY +
                    "&" +
                    startsWithPrefix +
                    "StartsWith=" +
                    value,
                {
                    cancelToken: new CancelToken(function executor (c) {
                        // An executor function receives a cancel function as a parameter
                        cancel = c;
                    })
                }
            ),
            cancleFunc: cancel
        };
    }
};

export default marvelAPI;
