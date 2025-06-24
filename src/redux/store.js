import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSilce"
import userReducer from "./userSlice" 


const store = configureStore({
    reducer: { loaderReducer, userReducer }
});

export default store;