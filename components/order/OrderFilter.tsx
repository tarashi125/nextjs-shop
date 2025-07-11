import { DatePicker, Select } from 'antd';
import { orderStatus } from '@/constants/defaults';

import type { OrderFilterParams } from '@/types/order';
import type { Dayjs } from 'dayjs';

interface IProps {
    params: OrderFilterParams,
    setParams: React.Dispatch<React.SetStateAction<OrderFilterParams>>;
}

const OrderFilter = ({params, setParams}: IProps) => {

    const handleDateChange = (date: Dayjs | null) => {
        if (!date) {
            // Clear params if not select date
            setParams((prev) => {
                const updated = { ...prev };
                delete updated.startDate;
                delete updated.endDate;
                delete updated.date;
                return updated;
            });
            return;
        }

        setParams((prev) => ({
            ...prev,
            date,
            startDate: date.startOf('day').toISOString(),
            endDate: date.endOf('day').toISOString(),
        }));
    };

    const handleStatusChange = (value: string | undefined) => {
        setParams((prev) => ({
            ...prev,
            status: value || 'all',
        }));
    };

    return (
        <div className="flex gap-4 mb-5">
            <DatePicker
                value={params.date}
                onChange={handleDateChange}
            />
            <Select
                allowClear
                style={{ width: 240 }}
                placeholder="Filter by status"
                value={params.status !== 'all' ? params.status : undefined}
                onChange={handleStatusChange}
                options={Object.entries(orderStatus).map(([key, value]) => ({
                    label: value,
                    value: key,
                }))}
            />
        </div>
    );

};

export default OrderFilter;