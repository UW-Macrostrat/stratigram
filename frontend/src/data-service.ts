import {
  PostgrestClient,
  PostgrestFilterBuilder,
} from "@supabase/postgrest-js";
import { useState, useEffect } from "react";

const apiClient = new PostgrestClient(process.env.API_URL);

function useAPIQuery<T>(
  builder: (q: PostgrestClient) => PostgrestFilterBuilder<T>,
  deps: any[]
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    builder(apiClient)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, deps);

  return { data, error, loading };
}

export { apiClient, useAPIQuery };
