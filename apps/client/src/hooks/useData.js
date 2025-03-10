import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../services/AuthProvider";
import { apiConfig } from "../config/api.config";
import { auth } from "../config/firebase.config";

function useData(urlPath, queryParams) {
  const { authenticatedUser } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const fullUrl = queryParams ? `${urlPath}?${queryParams}` : urlPath;
  useEffect(() => {
    async function getData() {
      try {
        if (authenticatedUser) {
          const idToken = await auth.currentUser.getIdToken();
          const response = await apiConfig.get(fullUrl, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (response.status == 200) {
            const data = await response.data;
            setData(data);
          } else {
            console.error("Error fetching user data:", response);
            setFetchError({
              message: `Server response failed with status code ${response.status}`,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setFetchError({ message: err.message });
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [authenticatedUser, fullUrl]);
  return {
    data,
    setData,
    loading,
    fetchError,
  };
}

export { useData };
