import { formatTime, formatCurrency } from '@/lib/utils';
import { getStatusColor } from '@/constants/defaults';
import { Tag } from 'antd';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import type { Order } from '@/types/order';

interface IProps {
    order: Order;
}

export default function OrderCard({ order }: IProps) {
    const { t } = useTranslation();
    return (
        <Link href={`orders/edit?id=${order._id}`}>
            <div className="break-inside-avoid rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md p-6 mb-4 space-y-6 transition duration-150 ease-in-out cursor-pointer">
                {/* Header */}
                <div className="m-0">
                    <Tag
                        className="uppercase"
                        color={getStatusColor(order.status) || 'gray'}
                    >
                        {t(`order.status.${order.status}`)}
                    </Tag>
                    <div className="mt-3">
                        <h3 className="text-xl font-semibold text-gray-800" style={{margin: 0}}>#{order.title}</h3>
                        <p className="text-sm text-gray-500" style={{margin: 0}}>{t('order.card.time')}: {formatTime(order.createdAt)}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="py-2 mb-2">
                    <div className="py-1 text-gray-800 border-y border-gray-200 mb-1">
                        <div className="grid grid-cols-9 text-sm mt-1 text-gray-600">
                            <div className="text-nowrap col-span-2">{t('order.card.header.name')}</div>
                            <div className="text-nowrap col-span-1 text-center">{t('order.card.header.qty')}</div>
                            <div className="text-nowrap col-span-3 text-right">{t('order.card.header.price')}</div>
                            <div className="text-nowrap col-span-3 text-right text-gray-800">{t('order.card.header.total')}</div>
                        </div>
                    </div>
                    {order.items.map((item) => (
                        <div key={item._id} className="py-1 text-gray-800">
                            <div className="text-left">{item.name}</div>
                            <div className="grid grid-cols-9 text-sm mt-1 text-gray-600">
                                <div className="col-span-2">{item.tax ? `VAT${item.tax}%` : ''}</div>
                                <div className="col-span-1 text-center">{item.qty}</div>
                                <div className="col-span-3 text-right">{formatCurrency(item.price - item.discount)}</div>
                                <div className="col-span-3 text-right text-gray-800">
                                    {formatCurrency((item.price - item.discount) * item.qty)}
                                </div>
                            </div>
                            {item.discount > 0 && (
                                <>
                                    <div className="grid grid-cols-9 text-sm mt-1 text-gray-600">
                                        <div className="col-span-1"/>
                                        <div className="col-span-5">{t('order.card.item.discount')}:</div>
                                        <div className="col-span-3 text-right">{formatCurrency(item.discount * item.qty)}</div>
                                    </div>
                                    <div className="grid grid-cols-9 text-sm mt-1 text-gray-600">
                                        <div className="col-span-1"/>
                                        <div className="col-span-5">{t('order.card.item.regular')}:</div>
                                        <div className="col-span-3 text-right">{formatCurrency(item.price)}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-2 mb-2">
                    <div className="flex items-center justify-between">
                        <p style={{marginBottom: 0}} className="text-gray-700">{t('order.card.bottom.total')}:</p>
                        <p style={{marginBottom: 0}} className="text-base font-semibold text-gray-900">{formatCurrency(order.total + order.totalDiscount - order.totalTax)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p style={{marginBottom: 0}} className="text-gray-700">{t('order.card.bottom.discount')}:</p>
                        <p style={{marginBottom: 0}} className="text-base font-semibold text-gray-900">{formatCurrency(order.totalDiscount)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p style={{marginBottom: 0}} className="text-gray-700">{t('order.card.bottom.tax')}:</p>
                        <p style={{marginBottom: 0}} className="text-base font-semibold text-gray-900">{formatCurrency(order.totalTax)}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-2 mb-0">
                    <div className="flex items-center justify-between">
                        <p style={{marginBottom: 0}} className="text-gray-700">{t('order.card.bottom.payment')}:</p>
                        <p style={{marginBottom: 0}} className="text-base font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}