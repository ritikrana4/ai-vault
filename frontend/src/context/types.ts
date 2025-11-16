
export const ActionTypes = {
  SET_SELECTED_FOLDER: 'SET_SELECTED_FOLDER',
} as const;

export interface AppState {
  selectedFolder: string | null;
}

export interface SetSelectedFolderAction {
  type: typeof ActionTypes.SET_SELECTED_FOLDER;
  payload: string | null;
}

export type AppAction = SetSelectedFolderAction;
