import {
  PostgrestClient,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from "@supabase/postgrest-js";
import { useState, useEffect } from "react";
import { definitions } from "../generated/api-types";

const apiClient = new PostgrestClient(process.env.API_URL);

function useAPIQuery<T extends keyof definitions, Data = definitions[T]>(
  relation: T,
  builder: (
    q: PostgrestQueryBuilder<definitions[T]>
  ) => PostgrestFilterBuilder<Data>,
  deps: any[]
) {
  type Schema = definitions[T];
  const [data, setData] = useState<Data[]>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
  }, deps);

  return { data, error, loading };
}

export { apiClient, useAPIQuery };
