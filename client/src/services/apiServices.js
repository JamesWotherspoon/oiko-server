import axios from "axios";

const sendRequest = async (method, endpoint, payload = null) => {
  try {
    const response = await axios({
      method,
      url: `${process.env.REACT_APP_API_BASE_URL}${endpoint}`,
      data: payload,
    });
    // Return response data
    return response.data;
  } catch (error) {
    if (error.response) {
      // Request was sent and the server responded
      console.error(`Server responded with status ${error.response.status}`);
      console.error(error.response.data);
    } else if (error.request) {
      // Request was sent but no response was received
      console.error("No response received from the server");
    } else {
      // Request was not sent
      console.error("Error occurred while making the request:", error.message);
    }
    // Reject promise so calling code can handle error
    return Promise.reject(error);
  }
};

export const getApiRequest = (endpoint) =>
  sendRequest('get', endpoint);

export const postApiRequestt = (endpoint, payload) =>
  sendRequest('post', endpoint, payload);

export const putApiRequest = (endpoint, payload) =>
  sendRequest('put', endpoint, payload);

export const deleteApiRequest = (endpoint, payload) =>
  sendRequest('delete', endpoint, payload);