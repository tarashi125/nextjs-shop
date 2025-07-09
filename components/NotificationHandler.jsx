'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { clearNotification } from '@/store/notificationSlice';

export default function NotificationHandler() {
    const notify = useSelector((state) => state.notification);
    const dispatch = useDispatch();

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
    }, [notify]);

    return contextHolder;
}