import {
  PostgrestClient,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from "@supabase/postgrest-js";
import { useCallback, useState, useEffect } from "react";
import { definitions } from "../../generated/api-types";

const apiClient = new PostgrestClient(process.env.API_URL);

type APISchema = definitions;

function useAPIQuery<T extends keyof definitions, Data = definitions[T]>(
  relation: T,
  builder: (
    q: PostgrestQueryBuilder<definitions[T]>
  ) => PostgrestFilterBuilder<definitions[T] | Data>,
  deps: any[] = []
) {
  type Schema = definitions[T];
  const [data, setData] = useState<Data[]>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => {
    setRefreshToken(refreshToken + 1);
  }, [refreshToken]);

  useEffect(() => {
    setLoading(true);

    const queryBuilder = apiClient.from<Schema>(relation);

    builder(queryBuilder)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken, ...deps]);

  return { data, error, loading, refresh };
}

export { apiClient, useAPIQuery, APISchema };
