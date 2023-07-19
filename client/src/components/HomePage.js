import { useEffect, useState } from "react";
import { getApiRequest } from "../services/apiServices";

export default function HomePage() {
    const [apiResponse, setApiResponse] = useState({});
    const [awaitingApiResponse, setAwaitingApiResponse] = useState(true)

    useEffect(() => {
      const getApiResponse = async () => {
        try {
          const response = await getApiRequest(`/`);
          setApiResponse(response);
        } catch (error) {
          //handleError(error, setErrorInfo);
        } finally {
          setAwaitingApiResponse(false);
        }
      };
      getApiResponse();
    }, []);

  return (
    <div>
      <h1>HomePage</h1>
      <p>{awaitingApiResponse.toString()}</p>
      <p>{JSON.stringify(apiResponse)}</p>
    </div>
  )
}
