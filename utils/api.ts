import { notification } from "antd";
import axios from "axios";
import { parseCookies } from "nookies";

export const sample = {};

const statusType = (status: any) => {
    if (status <= 100) {
        return "info";
    }

    if (status <= 200) {
        return "success";
    }

    if (status <= 300) {
        return "warning";
    }

    if (status <= 500) {
        return "error";
    }

    return "info";
};

export const fetchData = async ({ url, options }: any) => {
    const token = parseCookies().a_t;

    if (options?.isLoading) {
        options?.isLoading(true);
    }

    return await axios
        .get(
            `${
                options?.noBaseURL ? "" : process.env.REACT_APP_API_BASE_URL
            }${url}${
                !token ? `?api_key=${process.env.REACT_APP_API_KEY}` : ""
            }`,
            {
                headers: {
                    // api_key: !token ? process.env.REACT_APP_API_KEY : "",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }
            // notification[`${statusType(err.response.status)}`]({
            //   message: err.response.data[0].title,
            //   description: `${err.response.data[0].message}`,
            // });
            throw "Something Went Wrong";
        });
};

export const postData = async ({ url, payload, options }: any) => {
    const token = parseCookies().a_t;

    if (options?.isLoading) {
        options?.isLoading(true);
    }

    const formDataPayload = new FormData();
    const arrayData: any = [];
    const keys = Object.keys(payload);
    await keys.forEach((key) => {
        arrayData.push({
            key: key,
            keyData: payload[key],
        });
    });
    arrayData.map(({ key, keyData }: any) =>
        formDataPayload.append(key, keyData)
    );

    return await axios
        .post(
            `${process.env.REACT_APP_API_BASE_URL}${url}${
                !token ? `?api_key=${process.env.REACT_APP_API_KEY}` : ""
            }`,
            formDataPayload,
            {
                headers: {
                    api_key: !token ? process.env.REACT_APP_API_KEY : "",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(async (res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            notification[`${statusType(err.response.status)}`]({
                message: err.response.data[0].title,
                description: err.response.data[0].message,
            });

            throw "Something Went Wrong";
        });
};

export const postDataNoFormData = async ({ url, payload, options }: any) => {
    const token = parseCookies().a_t;

    if (options?.isLoading) {
        options?.isLoading(true);
    }

    return await axios
        .post(
            `${process.env.REACT_APP_API_BASE_URL}${url}${
                !token ? `?api_key=${process.env.REACT_APP_API_KEY}` : ""
            }`,
            payload,
            {
                headers: {
                    api_key: !token ? process.env.REACT_APP_API_KEY : "",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(async (res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            notification[`${statusType(err.response.status)}`]({
                message: err.response.data[0].title,
                description: err.response.data[0].message,
            });

            throw "Something Went Wrong";
        });
};

export const postDataMultipleFile = async ({ url, payload, options }: any) => {
    const token = parseCookies().a_t;

    if (options?.isLoading) {
        options?.isLoading(true);
    }
    return await axios
        .post(
            `${process.env.REACT_APP_API_BASE_URL}${url}${
                !token ? `?api_key=${process.env.REACT_APP_API_KEY}` : ""
            }`,
            payload,
            {
                headers: {
                    api_key: !token ? process.env.REACT_APP_API_KEY : "",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        .then(async (res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            notification[`${statusType(err.response.status)}`]({
                message: err.response.data[0].title,
                description: err.response.data[0].message,
            });

            throw "Something Went Wrong";
        });
};

export const updateData = async ({ url, payload, options }: any) => {
    if (options?.isLoading) {
        options?.isLoading(true);
    }

    const formDataPayload = new FormData();
    const arrayData: any = [];
    const keys = Object.keys(payload);
    await keys.forEach((key) => {
        arrayData.push({
            key: key,
            keyData: payload[key],
        });
    });
    arrayData.map(({ key, keyData }: any) =>
        formDataPayload.append(key, keyData)
    );

    return await axios
        .put(`${process.env.REACT_APP_API_BASE_URL}${url}`, formDataPayload, {
            headers: {
                Authorization: `Bearer ${parseCookies().a_t}`,
            },
        })
        .then((res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }
            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }

            notification[`${statusType(err.response.status)}`]({
                message: err.response.data[0].title,
                description: `${err.response.data[0].message}`,
            });
            throw "Something Went Wrong";
        });
};

export const deleteData = async ({ url, options }: any) => {
    if (options?.isLoading) {
        options?.isLoading(true);
    }
    return await axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${parseCookies().a_t}`,
            },
        })
        .then((res) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }
            return res.data;
        })
        .catch((err) => {
            if (options?.isLoading) {
                options?.isLoading(false);
            }
            notification[`${statusType(err.response.status)}`]({
                message: err.response.data[0].title,
                description: `${err.response.data[0].message}`,
            });
            throw "Something Went Wrong";
        });
};

export const fetchExport = async ({ url, options }: any) => {
    const { setExportData, isFetching, download } = options;
    isFetching(true);

    return await axios
        .get(`${process.env.REACT_APP_API_BASE_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${parseCookies().a_t}`,
            },
        })
        .then(async (res) => {
            await setExportData(res.data);
            return res;
        })
        .then(() => {
            isFetching(false);
            download();
        })
        .catch(async (err) => {
            isFetching(false);

            notification[`${statusType(err?.response?.status)}`]({
                key: err?.response?.data[Object.keys(err?.response?.data)[0]],
                message: err?.response?.data.title,
                description: `${err?.response?.data.error}`,
            });
            throw "Something Went Wrong";
        });
};
