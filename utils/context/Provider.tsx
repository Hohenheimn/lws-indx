import React, { createContext, useReducer } from "react";

export const Context = createContext<any>(null);

function reducer(state: any, action: { type: any; value: any }) {
  switch (action.type) {
    case "SET_OPEN_DRAWER":
      return { ...state, isDrawerOpen: action.value };
    default:
      return state;
  }
}

const initialState = {
  isDrawerOpen: false,
};

export default function AppProvider({ children, ...rest }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialDispatch = {
    setIsDrawerOpen: (value: boolean) => {
      dispatch({ type: "SET_OPEN_DRAWER", value });
    },
  };

  const value = {
    ...state,
    ...initialDispatch,
    ...rest,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
