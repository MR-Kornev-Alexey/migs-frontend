import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import DatePickerValue from "@/components/picker/date-picker-value";

// Интерфейс для периода
interface Period {
  startDate: string; // Формат ISO 8601 для строковых дат
  endDate: string;
}

// Интерфейс для пропсов компонента
interface SelectTimePeriodProps {
  setPeriodToParent: (period: any) => void; // Ожидаем, что в функцию передается объект типа Period
  setOneHour: (isOneHour: boolean) => void;
}

export default function SelectTimePeriod({ setPeriodToParent, setOneHour }: SelectTimePeriodProps) {
  const [period, setPeriod] = useState<string>(''); // Типизация состояния как строки
  const [showSelfPicker, setShowSelfPicker] = useState<boolean>(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedPeriod = event.target.value;
    setPeriod(selectedPeriod);

    if (selectedPeriod === 'self') {
      setShowSelfPicker(true);
      setPeriodToParent({
        startDate: dayjs('2024-07-01').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
      });
    } else {
      setShowSelfPicker(false);
      updatePeriod(selectedPeriod);
    }
  };

  const updatePeriod = (selectedPeriod: string) => {
    let period: Period;

    switch (selectedPeriod) {
      case 'hour':
        period = {
          startDate: dayjs().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
          endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        };
        setOneHour(true);
        break;
      case 'day':
        period = {
          startDate: dayjs().startOf('day').format('YYYY-MM-DD'),
          endDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        };
        setOneHour(false);
        break;
      case 'week':
        period = {
          startDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        };
        setOneHour(false);
        break;
      case 'month':
        period = {
          startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        };
        setOneHour(false);
        break;
      default:
        period = {
          startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        };
        setOneHour(false);
    }

    setPeriodToParent(period);
  };

  return (
    <Box sx={{ minWidth: 260, flexDirection: 'column' }} display="flex" justifyContent="center">
      <FormControl sx={{ width: 260, my: 2 }}>
        <InputLabel id="select-period-label">Период</InputLabel>
        <Select
          labelId="select-period-label"
          id="select-period"
          value={period}
          label="Период"
          onChange={handleChange}
        >
          <MenuItem value="hour">Текущий час</MenuItem>
          <MenuItem value="day">Текущий день</MenuItem>
          <MenuItem value="week">Последняя неделя</MenuItem>
          <MenuItem value="month">Последний месяц</MenuItem>
          <MenuItem value="self">Самостоятельный ввод</MenuItem>
        </Select>
      </FormControl>
      {showSelfPicker ? <DatePickerValue emitDateToParent={setPeriodToParent} /> : null}
    </Box>
  );
}
