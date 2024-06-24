import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./services/index";
import { setupListeners } from "@reduxjs/toolkit/query";


const combinedReducer = combineReducers({
  [api.reducerPath] : api.reducer
})

export const store = configureStore({
  reducer: combinedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([api.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
