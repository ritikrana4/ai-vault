import { ActionTypes } from './types';
import type { AppState, AppAction } from './types';

export const initialState: AppState = {
  selectedFolder: null,
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_FOLDER:
      return { ...state, selectedFolder: action.payload };

    default:
      return state;
  }
};
