import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationPayload = {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    description?: string;
};

type State = NotificationPayload | null;

const initialState: State = null;

const notificationSlice = createSlice<State>({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (_state, action: PayloadAction<NotificationPayload>) => action.payload,
        clearNotification: () => null,
    },
});
export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;