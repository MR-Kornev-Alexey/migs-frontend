import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';

// Определите интерфейс для пропсов
interface DatePickerValueProps {
  emitDateToParent: (period: { startDate: string; endDate: string }) => void;
}

export default function DatePickerValue({ emitDateToParent }: DatePickerValueProps) {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs('2024-05-01'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  // Типизированный объект для периодов
  const [allPeriod, setAllPeriod] = React.useState<{ startDate: string; endDate: string }>({
    startDate: dayjs('2024-04-01').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const minDate: Dayjs = dayjs('2024-04-01');
  const maxDate: Dayjs = dayjs();

  const setFreePeriod = (flag: number, input: Dayjs | null) => {
    if (input) {
      const formattedDate = input.format('YYYY-MM-DD');
      if (flag === 0) {
        setAllPeriod((prev) => ({ ...prev, startDate: formattedDate }));
      } else {
        setAllPeriod((prev) => ({ ...prev, endDate: formattedDate }));
      }
      emitDateToParent(allPeriod);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          sx={{ width: 260 }}
          label="Начало периода"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            setFreePeriod(0, newValue);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
        <DatePicker
          sx={{ width: 260 }}
          label="Конец периода"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            setFreePeriod(1, newValue);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
