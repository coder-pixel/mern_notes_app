import { combineReducers, compose, applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { userLoginReducer } from "./reducers/userReducers";
import { noteListReducer } from "./reducers/notesReducer";

const rootReducer = combineReducers({
  // this will combine all reducers to one
  user: userLoginReducer,
  noteList: noteListReducer,
});

// const initialState = {};
// const middleware = [thunk];

const persistConfig = {
  key: "root",
  storage,
  keyPrefix: "",
  stateReconciler: hardSet,
  blacklist: ["loaderData"],
};

const pReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  pReducer,
  undefined,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
