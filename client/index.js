import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducers/rootReducer";
import Search from "./components/Search";
import Details from "./components/Details";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <div>
                <Switch>
                    <Route exact path="/" component={Search} />
                    <Route exact path="/search" component={Search} />
                    <Route exact path="/:entityType/:id" component={Details} />
                </Switch>
            </div>
        </Provider>
    </BrowserRouter>,
    document.getElementById("root")
);
