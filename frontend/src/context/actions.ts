import { ActionTypes } from './types';
import type { AppAction } from './types';

export const setSelectedFolder = (folder: string | null): AppAction => ({
  type: ActionTypes.SET_SELECTED_FOLDER,
  payload: folder,
});

