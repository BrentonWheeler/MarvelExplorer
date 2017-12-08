import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducers/rootReducer";
import Home from "./components/Home";
import Search from "./components/Search";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/:searchBy/" component={Search} />
                </Switch>
            </div>
        </Provider>
    </BrowserRouter>,
    document.getElementById("root")
);
