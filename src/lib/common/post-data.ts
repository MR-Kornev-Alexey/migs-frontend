// Define a type for the possible response errors
interface ErrorResponse {
  error: string;
}

// Define a type for the response data, which can be any type or an error
type ResponseData<T> = T | ErrorResponse;

export default async function postData<T>(
  url: string,
  data: any, // Adjust this if you know the specific type of data you're sending
  headers: Record<string, string> = {}
): Promise<ResponseData<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Ensure that the response data is parsed and returned as the expected type
    return await response.json() as ResponseData<T>;
  } catch (error) {
    console.error('Произошла ошибка:', (error as Error).message);
    return { error: (error as Error).message } as ResponseData<T>;
  }
}
