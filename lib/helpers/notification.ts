import { setNotification } from '@/store/notificationSlice';
import type { AppDispatch } from '@/store';

export const notify = (
    dispatch: AppDispatch,
    t: (key: string) => string,
    type: 'success' | 'error' | 'info' | 'warning',
    msgKey: string,
    descriptionKey?: string
) => {
    dispatch(
        setNotification({
            type,
            message: t(msgKey),
            description: descriptionKey ? t(descriptionKey) : undefined,
        })
    );
};