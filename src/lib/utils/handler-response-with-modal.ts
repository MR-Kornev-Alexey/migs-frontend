// responseHandlers.ts
import {type ApiResult} from "@/types/result-api"; // Adjust the import path as necessary
import {type AppDispatch} from '@/store/store';
import {addSensors} from "@/store/sensors-reducer";

interface HandleResponseProps {
  response: ApiResult;
  successMessage: string;
  errorMessage: string;
  dispatch: AppDispatch;
  setIsMessageAlertModal: (message: string) => void;
  setIsAlertModalColor: (color: "success" | "error") => void;
}

export const handleResponse = ({
                                 response,
                                 successMessage,
                                 errorMessage,
                                 dispatch,
                                 setIsMessageAlertModal,
                                 setIsAlertModalColor,
                               }: HandleResponseProps): boolean => {
  if (response?.statusCode === 200) {
    dispatch(addSensors(response?.allSensors));
    setIsMessageAlertModal(response?.message || successMessage);
    setIsAlertModalColor("success");
    return true;
  } 
    setIsAlertModalColor("error");
    setIsMessageAlertModal(response?.message || errorMessage);
    return false;
  
};

interface HandleErrorProps {
  error: any;
  setIsMessageAlertModal: (message: string) => void;
  setIsAlertModalColor: (color: "success" | "error") => void;
}

export const handleError = ({
                              error,
                              setIsMessageAlertModal,
                              setIsAlertModalColor,
                            }: HandleErrorProps) => {
  setIsAlertModalColor("error");
  setIsMessageAlertModal(error?.message || 'Ошибка при выполнении запроса');
};
