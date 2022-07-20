import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const requestHttp = useCallback(
    async (requestFunc, requestConfig, navigateRouter) => {
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
        requestConfig(data);
        navigate(navigateRouter.path, navigateRouter.replaceTo);
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
    },
    [navigate]
  );

  return { requestHttp, loading, error };
};

export default useAxios;
