import React from "react";
import { Select } from "./Select";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils/api";

interface InfiniteSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  api: string;
  queryKey: [string];
  onChange?: (e: any) => void;
  displayValueKey?: string;
  CustomizedOption?: any;
}

export function InfiniteSelect({
  children,
  className,
  queryKey,
  displayValueKey,
  api,
  CustomizedOption,
  ...rest
}: InfiniteSelectProps) {
  let [search, setSearch] = React.useState("");
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

  return (
    <Select
      loading={isListLoading}
      lastChildRef={listRef}
      noFilter={true}
      onSearch={(e: any) => setSearch(e)}
      displayValueKey={displayValueKey}
      {...rest}
    >
      {listData?.pages?.map(({ data }) => {
        return data?.map((props: any) => {
          return (
            <Select.Option
              value={displayValueKey ? props : props.name}
              key={props._id}
            >
              {CustomizedOption ? (
                <CustomizedOption data={props} />
              ) : (
                props.name
              )}
            </Select.Option>
          );
        });
      })}
      {isListLoading && (
        <Select.Option
          value="loading"
          key="loading"
          className="pointer-events-none p-4 text-sm"
        >
          Loading...
        </Select.Option>
      )}
    </Select>
  );
}
