'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { type RootState } from '@/store/store';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import { BASE_URL } from '@/config';
import Button from "@mui/material/Button";

interface ObjectInfo {
  id: string;
  organization_id: string;
  objectsType: string;
  objectsMaterial: string;
  geo: string;
  name: string;
  address: string;
  notation: string;
}

interface Sensor {
  id: string;
  object_id: string;
  sensor_type: string;
  sensor_key: string;
  model: string;
  ip_address: string;
  designation: string;
  network_number: number;
  notation: string;
  run: boolean;
  object: ObjectInfo;
  additional_sensor_info: any[];
  sensor_operation_log: any[];
  files: any[];
}

function findSensorById(sensors: Sensor[], id: string): Sensor | undefined {
  return sensors.find((sensor) => sensor.id === id);
}

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const allSensors = useSelector((state: RootState) => state.allSensors.value);

  function getSensorsName(id: string) {
    const foundSensor = findSensorById(allSensors, id);
    return `${foundSensor?.sensor_type  } ${  foundSensor?.designation}`;
  }

  function addSpacesEveryTwoChars(input: string): string {
    return input.replace(/(.{2})/g, '$1 ').trim();
  }

  const startTerminal = () => {
    if (!isTerminalRunning) {
      const newEventSource = new EventSource(`${BASE_URL}/sse/events`);
      newEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };
      newEventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        newEventSource.close();
        setIsTerminalRunning(false);
      };

      setEventSource(newEventSource);
      setIsTerminalRunning(true);
    }
  };

  const stopTerminal = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setIsTerminalRunning(false);
      console.log('Terminal stopped');
    }
  };

  const toggleTerminal = () => {
    if (isTerminalRunning) {
      stopTerminal();
    } else {
      startTerminal();
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Терминал</Typography>
      </Box>
      <Button
        variant="contained"
        onClick={toggleTerminal}
        sx={{ width: 260, marginTop: 1 }}
      >
        {isTerminalRunning ? 'Стоп терминала' : 'Старт терминала'}
      </Button>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 700,
          overflow: 'hidden',
          overflowY: 'scroll',
        }}
      >
        {messages.map((msg, index) => (
          <Box key={index} sx={{ my: 1 }}>
            <Typography variant="body2">{getSensorsName(msg?.sensor_id)} </Typography>
            <Typography variant="body2">{msg?.request_code}</Typography>
            <Typography variant="body2">{addSpacesEveryTwoChars(msg?.answer_code)}</Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
