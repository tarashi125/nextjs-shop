'use client';

import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { t } = useTranslation('common');
    const [enabled, setEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        setEnabled(i18n.language === 'en');
    }, []);

    const onChange = (checked: boolean) => {
        i18n.changeLanguage(checked ? 'en' : 'vi');
        setEnabled(checked);
    };

    if (enabled === null) return null;

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
};

export default LanguageSwitcher;