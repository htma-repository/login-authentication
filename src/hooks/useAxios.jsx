import { useState, useCallback } from "react";
import axios from "axios";

const useAxios = () => {
  const [error, setError] = useState({
    isError: false,
    errorMessage: "",
  });

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "",
  });

  const requestHttp = useCallback(async (requestFunc, requestConfig) => {
    setLoading({
      isLoading: true,
      loadingMessage: "Loading...",
    });

    try {
      const response = await axios({
        method: requestFunc.method,
        url: requestFunc.url,
        data: requestFunc.data ? requestFunc.data : null,
      });

      if (response.status !== 200) {
        throw new Error("Authentication Failed");
      }

      const data = await response.data;
      localStorage.setItem(
        "token",
        JSON.stringify({
          idToken: data.idToken,
          email: data.email,
        })
      );
      requestConfig(data);
    } catch (error) {
      const errorData = error.response.data;
      let errorMessage = error.message;

      if (errorData.error?.code === 400) {
        errorMessage = errorData.error?.message;
      }

      setError({
        errorMessage,
        isError: true,
      });
    }
    setLoading({
      isLoading: false,
      loadingMessage: "",
    });
  }, []);

  return { requestHttp, loading, error };
};

export default useAxios;
