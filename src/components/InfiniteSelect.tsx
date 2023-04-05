import React from "react";
import { Select } from "./Select";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils/api";
import { getInitialValue as getFieldInitialValue } from "../../utils/helpers";

interface InfiniteSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  api: string;
  queryKey: string[];
  onChange?: (e: any) => void;
  getInitialValue?: {
    form: any;
    initialValue: string;
  };
  displayValueKey: string;
  returnValueKey: string;
  CustomizedOption?: any;
  disabled?: boolean;
  noData?: string;
}

export function InfiniteSelect({
  children,
  className,
  queryKey,
  displayValueKey,
  returnValueKey,
  api,
  CustomizedOption,
  getInitialValue,
  ...rest
}: InfiniteSelectProps) {
  let [search, setSearch] = React.useState("");
  let [initialFetch, setInitialFetch] = React.useState(true);
  let [isOpen, setIsOpen] = React.useState(false);
  let searchParameterAPI =
    api.split("?").length <= 1
      ? `${api}?search=${search}`
      : `${api}&search=${search}`;
  let initialValueParameterAPI =
    searchParameterAPI +
    (getFieldInitialValue
      ? getFieldInitialValue(
          getInitialValue?.form,
          getInitialValue?.initialValue ?? ""
        )
      : "");

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
    queryFn: ({ pageParam = initialValueParameterAPI }) => {
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
    // enabled: getInitialValue
    //   ? Boolean(
    //       getFieldInitialValue(
    //         getInitialValue?.form,
    //         getInitialValue?.initialValue
    //       )
    //     )
    //   : true,
  });

  React.useEffect(() => {
    let dataLength = listData?.pages?.length ?? 0;
    if (dataLength > 0 && initialFetch) setInitialFetch(false);
  }, [initialFetch, listData?.pages]);

  React.useEffect(() => {
    if (
      getInitialValue &&
      getFieldInitialValue(getInitialValue?.form, getInitialValue?.initialValue)
    ) {
      if (listHasNextPage && listRefInView && !isListLoading) {
        listFetchNextPage();
      }
    } else {
      if (listHasNextPage && listRefInView && !isListLoading) {
        listFetchNextPage();
      }
    }
  }, [
    listRefInView,
    listFetchNextPage,
    listHasNextPage,
    listData,
    getInitialValue?.form,
    getInitialValue?.initialValue,
    getInitialValue,
    isListLoading,
  ]);

  return !initialFetch ? (
    <Select
      loading={isListLoading}
      lastChildRef={listRef}
      noFilter={true}
      onSearch={(e: any) => setSearch(e)}
      {...rest}
    >
      {listData?.pages?.map(({ data }) => {
        return data?.map((props: any, index: number) => {
          return (
            <Select.Option
              displayValue={props[displayValueKey]}
              value={props[returnValueKey]}
              key={index}
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
  ) : (
    <Select disabled={true}>
      <Select.Option value="">Loading</Select.Option>
    </Select>
  );
}
