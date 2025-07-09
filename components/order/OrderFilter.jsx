import {DatePicker, Select} from 'antd';
import { orderStatus } from '@/constants/defaults'

const OrderFilter = ({params, setParams}) => {

    const handleDateChange = (date) => {
        if (!date) {
            // Clear params if not select date
            setParams((prev) => {
                const updated = { ...prev };
                delete updated.startDate;
                delete updated.endDate;
                return updated;
            });
            return;
        }

        setParams((prev) => ({
            ...prev,
            date: date,
            startDate: date.startOf('day').toISOString(),
            endDate: date.endOf('day').toISOString(),
        }));
    };

    const handleStatusChange = (value) => {
        setParams((prev) => ({
            ...prev,
            status: value || 'all',
        }));
    }

    return (
        <div className={'flex gap-4 mb-5'}>
            <DatePicker
                defaultValue={params?.date}
                onChange={handleDateChange}
            />
            <Select
                allowClear
                style={{ width: 240 }}
                placeholder="Filter by status"
                defaultValue={params.status !== 'all' ? params.status : undefined}
                onChange={handleStatusChange}
                options={Object.entries(orderStatus).map(([key, value]) => ({
                    label: value,
                    value: key,
                }))}
            />
        </div>
    )

}

export default OrderFilter;