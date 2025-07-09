// store/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification: (_, action) => action.payload,
        clearNotification: () => null,
    },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;