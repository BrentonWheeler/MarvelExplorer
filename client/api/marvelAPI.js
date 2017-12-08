import axios from "axios";

let marvelAPI = {
    getComics: () => axios.get("http://gateway.marvel.com/v1/public/comics?apikey=" + process.env.MARVEL_PUBLIC_KEY),
    getCharacters: () =>
        axios.get("http://gateway.marvel.com/v1/public/characters?apikey=" + process.env.MARVEL_PUBLIC_KEY)
};

export default marvelAPI;
