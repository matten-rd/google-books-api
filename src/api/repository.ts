import axios from "axios";
import { useEffect, useState } from "react";
import { ApiSchema } from "./schema";
import { ShelfSchema } from "./shelfSchema";

interface IState<
  T extends ApiSchema.RootObject | ShelfSchema.RootObject | ApiSchema.Item
> {
  data: T;
  loading: boolean;
  error: any;
}

export function useFetch<
  T extends ApiSchema.RootObject | ShelfSchema.RootObject | ApiSchema.Item
>(url: string, token: string | null = null, cacheData: boolean = true) {
  const [state, setState] = useState<IState<T>>({
    data: {} as T,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    const fetchData = () => {
      setState((state) => ({ data: state.data, loading: true, error: null }));

      if (sessionStorage.getItem(url) && cacheData) {
        const data: T = JSON.parse(sessionStorage.getItem(url)!);
        setState({ data: data, loading: false, error: null });
      } else {
        axios
          .get(url, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            sessionStorage.setItem(url, JSON.stringify(response.data)); // cache in sessionStorage
            setState({ data: response.data, loading: false, error: null });
          })
          .catch((error) =>
            setState({ data: {} as T, loading: false, error: error })
          );
      }
    };

    fetchData();
  }, [url, token, cacheData]);

  return state;
}

export function addVolumeToBookShelf(
  shelfId: number,
  volumeId: string,
  token: string
) {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  axios.post(
    `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/addVolume?volumeId=${volumeId}&key=${API_KEY}`,
    null,
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );
}
