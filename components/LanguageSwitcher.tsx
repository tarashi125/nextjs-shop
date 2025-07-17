'use client';

import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const current = i18n.language === 'en';
        setEnabled(current);
        const handler = (lng: string) => setEnabled(lng === 'en');
        i18n.on('languageChanged', handler);
        return () => void i18n.off('languageChanged', handler);
    }, []);

    const onChange = (checked: boolean) => {
        i18n.changeLanguage(checked ? 'en' : 'vi');
    };

    return (
        <div
            className="flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="pr-1">{t('language')}:</span>
            <Switch
                checked={enabled}
                onChange={onChange}
                checkedChildren="EN"
                unCheckedChildren="VI"
                aria-label={t('switchLanguage') || 'Switch language'}
            />
        </div>
    );
}

export default LanguageSwitcher;