// import axios from "axios";
// import { parseCookies } from "nookies";
// import { notification } from "antd";
// import React from "react";

export const sample = {};

// const statusType = (status: any) => {
//   if (status <= 100) {
//     return "info";
//   }

//   if (status <= 200) {
//     return "success";
//   }

//   if (status <= 300) {
//     return "warning";
//   }

//   if (status <= 500) {
//     return "error";
//   }

//   return "info";
// };

// export const fetchData = async ({ url, options }: any) => {
//   if (options?.isLoading) {
//     options?.isLoading(true);
//   }
//   return await axios
//     .get(`${process.env.MY_API_URL}${url}`, {
//       headers: {
//         // Authorization: `Bearer ${parseCookies().a_t}`,
//         Authorization: process.env.API_ACCESS_TOKEN,
//       },
//     })
//     .then((res) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }

//       return res.data;
//     })
//     .catch((err) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }
//       throw err;
//     });
// };

// export const postData = async ({ url, payload, options }: any) => {
//   if (options?.isLoading) {
//     options?.isLoading(true);
//   }
//   return await axios
//     .post(
//       `${process.env.MY_API_URL}${url}`,
//       {
//         api_key: process.env.MY_API_KEY,
//         ...payload,
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${parseCookies().a_t}`,
//           Authorization: process.env.API_ACCESS_TOKEN,
//         },
//       }
//     )
//     .then(async (res) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }

//       return res.data;
//     })
//     .catch((err) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }

//       notification[`${statusType(err.response.status)}`]({
//         key: err.response.data[Object.keys(err.response.data)[0]],
//         message: err.response.data.title,
//         description: `${err.response.data.error}`,
//       });

//       throw err;
//     });
// };

// export const updateData = async ({ url, payload, options }: any) => {
//   if (options?.isLoading) {
//     options?.isLoading(true);
//   }
//   return await axios
//     .put(`${process.env.MY_API_URL}${url}`, payload, {
//       headers: {
//         Authorization: `Bearer ${parseCookies().a_t}`,
//       },
//     })
//     .then((res) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }
//       return res.data;
//     })
//     .catch((err) => {
//       if (options?.isLoading) {
//         options?.isLoading(false);
//       }
//       // notification[`${statusType(err.response.status)}`]({
//       //   key: err.response.data[Object.keys(err.response.data)[0]],
//       //   message: err.response.data.title,
//       //   description: `${err.response.data.error}`,
//       // });
//       throw err;
//     });
// };

// export const fetchExport = async ({ url, options }: any) => {
//   const { setExportData, isFetching, download } = options;
//   isFetching(true);

//   return await axios
//     .get(`${process.env.MY_API_URL}${url}`, {
//       headers: {
//         Authorization: `Bearer ${parseCookies().a_t}`,
//       },
//     })
//     .then(async (res) => {
//       await setExportData(res.data);
//       return res;
//     })
//     .then(() => {
//       isFetching(false);
//       download();
//     })
//     .catch(async (err) => {
//       isFetching(false);

//       notification[`${statusType(err?.response?.status)}`]({
//         key: err?.response?.data[Object.keys(err?.response?.data)[0]],
//         message: err?.response?.data.title,
//         description: `${err?.response?.data.error}`,
//       });
//       throw err;
//     });
// };
