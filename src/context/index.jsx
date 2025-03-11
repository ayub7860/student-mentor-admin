import React from "react";
import PropTypes from "prop-types";

const LOCAL_STORAGE_KEY = "materialTailwindState";
export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "SET_ONLINE": {
      return { ...state, isOnline: action.value };
    }
    case "SET_THEME": {
      return { ...state, theme: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY);
  const storedState = localStorageState ? JSON.parse(localStorageState) : null;
  let localStorageStateTheme = 'light';
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
    localStorageStateTheme = 'dark';

  const initialState = storedState || {
    openSidenav: false,
    sidenavColor: "red",
    sidenavType: "white",
    fixedNavbar: true,
    openConfigurator: false,
    isOnline: true,
    // theme: localStorageStateTheme
    theme: 'light'
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(controller));
  }, [controller]);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setOnline = (dispatch, value) =>
  dispatch({ type: "SET_ONLINE", value });
export const setTheme = (dispatch, value) =>
  dispatch({ type: "SET_THEME", value });