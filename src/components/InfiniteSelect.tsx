import React from "react";
import { parseCookies } from "nookies";
import { useInView } from "react-intersection-observer";
import { Select } from "@components/Select";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData, fetchDataNoSubdomain } from "@utilities/api";
import { getInitialValue as getFieldInitialValue } from "@utilities/helpers";

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
  setSelectedDetail?: Function;
  returnAllValue?: boolean;
  initialValue?: string;
}

export function InfiniteSelect({
  children,
  className,
  queryKey,
  displayValueKey,
  returnAllValue,
  returnValueKey,
  api,
  CustomizedOption,
  getInitialValue,
  setSelectedDetail,
  initialValue,
  ...rest
}: InfiniteSelectProps) {
  let [search, setSearch] = React.useState("");
  let [initialFetch, setInitialFetch] = React.useState(true);

  let searchParameterAPI =
    api.split("?").length <= 1
      ? `${api}?search=${search}`
      : `${api}&search=${search}`;

  let initialValueParameterAPI = "";

  if (initialValue) {
    if (searchParameterAPI.includes("?")) {
      initialValueParameterAPI = `${searchParameterAPI}&initial_value=${initialValue}`;
    } else {
      initialValueParameterAPI = `${searchParameterAPI}?initial_value=${initialValue}`;
    }
  } else {
    initialValueParameterAPI =
      searchParameterAPI +
      (getFieldInitialValue
        ? getFieldInitialValue(
            getInitialValue?.form,
            getInitialValue?.initialValue ?? ""
          )
        : "");
  }

  const { ref: listRef, inView: listRefInView } = useInView({
    triggerOnce: false,
    rootMargin: "0px",
  });

  const subdomainCookie = parseCookies().subdomain;

  const fetchData = ({ pageParam = 1 }) => {
    let subdomain = "";
    if (initialValueParameterAPI.includes("?")) {
      subdomain = `&subdomain=${subdomainCookie}`;
    } else {
      subdomain = `?subdomain=${subdomainCookie}`;
    }
    return fetchDataNoSubdomain({
      url: `${initialValueParameterAPI}${subdomain}&page=${pageParam}`,
      options: {
        noBaseURL: true,
      },
    });
  };

  const {
    data: listData,
    isFetching: isListLoading,
    hasNextPage: listHasNextPage,
    fetchNextPage: listFetchNextPage,
  } = useInfiniteQuery([...queryKey, search], fetchData, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage?.meta?.last_page) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  React.useEffect(() => {
    let dataLength = listData?.pages?.length ?? 0;
    if (dataLength > 0 && initialFetch) {
      setInitialFetch(false);
    }
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
    search,
  ]);

  return !initialFetch ? (
    <Select
      loading={isListLoading}
      lastChildRef={listRef}
      noFilter={true}
      onSearch={(e: any) => setSearch(e)}
      {...rest}
      className=" pr-[3.5rem]"
      aria-autocomplete="none"
      infiniteSelect={true}
    >
      {listData?.pages?.map(({ data }) => {
        return data?.map((props: any, index: number) => {
          return (
            <Select.Option
              displayValue={props[displayValueKey]}
              value={returnAllValue ? props : props[returnValueKey]}
              key={index}
              onClick={() => setSelectedDetail && setSelectedDetail(props)}
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
