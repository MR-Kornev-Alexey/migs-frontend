import {ApiResult} from "@/types/result-api";
type SuccessCallback = (result: ApiResult) => void;
type SetAlertColor = (color: 'success' | 'error') => void;
type SetIsMessage = (message: string) => void;

const handleApiResponseSample = ({
                                   result,
                                   successCallback,
                                   setAlertColor,
                                   setIsMessage
                                 }: {
  result: ApiResult;
  successCallback: SuccessCallback;
  setAlertColor: SetAlertColor;
  setIsMessage: SetIsMessage;
}) => {
  switch (result?.data?.statusCode) {
    case 200:
      setAlertColor('success');
      setIsMessage(result?.message || 'Успех');
      successCallback(result);
      break;
    case 400:
    case 500:
      setAlertColor('error');
      setIsMessage(result?.message || 'Произошла ошибка');
      break;
    default:
      setAlertColor('error');
      setIsMessage(result?.message || 'Произошла ошибка');
      break;
  }
};

export default handleApiResponseSample;


