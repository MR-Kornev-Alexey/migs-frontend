const handleApiResponseSample = ({ result, successCallback, setAlertColor, setIsMessage }) => {
  switch (result?.data?.statusCode) {
    case 200:
      setAlertColor('success');
      setIsMessage(result?.data?.message);
      successCallback(result);
      break;
    case 400:
    case 500:
      setAlertColor('error');
      setIsMessage(result?.data?.message);
      break;
    default:
      setAlertColor('error');
      setIsMessage(result?.error?.message || 'Произошла ошибка');
      break;
  }
};

export default handleApiResponseSample;
