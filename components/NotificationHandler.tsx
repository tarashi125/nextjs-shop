'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { clearNotification } from '@/store/notificationSlice';

import type { AppDispatch, RootState } from '@/store';

export default function NotificationHandler() {
    const dispatch = useDispatch<AppDispatch>();
    const notify = useSelector((state: RootState) => state.notification);

    const [notificationApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (notify) {
            notificationApi.open({
                type: notify.type || 'info',
                message: notify.message,
                description: notify.description,
            });
            dispatch(clearNotification());
        }
    }, [notify, dispatch, notificationApi]);

    return contextHolder;
}