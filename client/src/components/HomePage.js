import { useEffect, useState } from "react";
import { getApiRequest } from "../services/apiServices";
import { useErrorBoundary } from "react-error-boundary";

export default function HomePage() {
    const [apiResponse, setApiResponse] = useState({});
    const [awaitingApiResponse, setAwaitingApiResponse] = useState(true)
    const { showBoundary } = useErrorBoundary();


    useEffect(() => {
      const getApiResponse = async () => {
        try {
          const response = await getApiRequest(`/`);
          setApiResponse(response);
        } catch (error) {
          showBoundary(error);
        } finally {
          setAwaitingApiResponse(false);
        }
      };
      getApiResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // showBoundary dependency is delibratly excluded 

    console.log(apiResponse.headers)

  return (
    <div>
      <h1>HomePage</h1>
      <p>{awaitingApiResponse.toString()}</p>
      <p>{JSON.stringify(apiResponse)}</p>
    </div>
  )
}
