// responseHandler.ts
import {type ApiResult} from "@/types/result-api"; // Adjust the import path as necessary
import {type AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';
import {addSensors} from "@/store/sensors-reducer";

interface HandleResponseProps {
  response: ApiResult;
  setIsMessage: (message: string) => void;
  setAlertColor: (color: "success" | "error") => void;
  dispatch: AppDispatch;
}
export const handleResponseNoModal = ({ response, setIsMessage, setAlertColor, dispatch}: HandleResponseProps) => {
  if (response?.statusCode === 200) {
    setIsMessage(response?.message || "Успешное выполнение");
    setAlertColor("success");
    setTimeout(() => {
      dispatch(addSensors(response?.allSensors));
      setIsMessage('');
    }, 1000);
  } else {
    setAlertColor("error");
    setIsMessage(response?.message || "Ошибка выполнения");
    setTimeout(() => {
      setIsMessage('');
    }, 1000);
  }
};
