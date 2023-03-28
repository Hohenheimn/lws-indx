import React from "react";
import { AutoComplete } from "./AutoComplete";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils/api";

interface InfiniteAutoCompleteProps
  extends React.HTMLAttributes<HTMLDivElement> {
  api: string;
  queryKey: string[];
  onChange?: (e: any) => void;
  customRender?: React.ReactElement;
  displayValueKey: string;
  returnValueKey: string;
  noData?: string;
}
export function InfiniteAutoComplete({
  children,
  className,
  queryKey,
  api,
  displayValueKey,
  returnValueKey,
  ...rest
}: InfiniteAutoCompleteProps) {
  let [search, setSearch] = React.useState("");
  let [initialFetch, setInitialFetch] = React.useState(true);
  let searchParameterAPI =
    api.split("?").length <= 1
      ? `${api}?search=${search}`
      : `${api}&search=${search}`;
  const { ref: listRef, inView: listRefInView } = useInView({
    triggerOnce: false,
    rootMargin: "0px",
  });

  const {
    data: listData,
    isFetching: isListLoading,
    hasNextPage: listHasNextPage,
    fetchNextPage: listFetchNextPage,
  } = useInfiniteQuery({
    queryKey: [...queryKey, search],
    queryFn: ({ pageParam = searchParameterAPI }) => {
      return fetchData({
        url: pageParam,
        options: {
          noBaseURL: true,
        },
      });
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.slice(-1).pop().links.next) {
        return pages.slice(-1).pop().links.next;
      }
    },
  });

  React.useEffect(() => {
    if (listHasNextPage && listRefInView) {
      listFetchNextPage();
    }
  }, [listRefInView, listFetchNextPage, listHasNextPage, listData]);

  React.useEffect(() => {
    let dataLength = listData?.pages?.length ?? 0;
    if (dataLength > 0 && initialFetch) setInitialFetch(false);
  }, [initialFetch, listData?.pages]);

  return !initialFetch ? (
    <AutoComplete
      loading={isListLoading}
      lastChildRef={listRef}
      noFilter={true}
      onSearch={(e: any) => setSearch(e)}
      {...rest}
    >
      {listData?.pages?.map(({ data }) => {
        return data?.map((props: any, index: number) => {
          return (
            <AutoComplete.Option
              displayValue={props[displayValueKey]}
              value={props[returnValueKey]}
              key={index}
            >
              {props.name}
            </AutoComplete.Option>
          );
        });
      })}
      {isListLoading && (
        <AutoComplete.Option
          value="loading"
          key="loading"
          className="pointer-events-none p-4 text-sm"
        >
          Loading...
        </AutoComplete.Option>
      )}
    </AutoComplete>
  ) : (
    <AutoComplete disabled={true}>
      <AutoComplete.Option value="">Loading</AutoComplete.Option>
    </AutoComplete>
  );
}
