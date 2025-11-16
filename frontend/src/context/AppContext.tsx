import React, { createContext, useContext, useReducer } from 'react';
import type { AppState, AppAction } from './types';
import { appReducer, initialState } from './reducer';
import { ERROR_MESSAGES } from '../constants/app.constants';

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(ERROR_MESSAGES.USE_APP_ERROR);
  }
  return context;
};

