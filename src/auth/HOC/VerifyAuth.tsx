import axios from "axios";
import { NextPageContext } from "next";
import { parseCookies, destroyCookie } from "nookies";
// import axios from "axios";

type ggspTypes = {
  profile: any;
  openMenus: string;
  subdomain: string;
};

export default function VerifyAuth(gssp: {
  (ctx: NextPageContext, { profile, openMenus, subdomain }: ggspTypes): {};
}) {
  return async (ctx: any) => {
    const { req, res } = ctx;

    let profile = req?.profile ?? null;
    let openMenus = req?.cookies?.om ?? null;
    let token = await parseCookies(ctx).a_t;
    let subdomain =
      req.headers.host.split(".").length > 1
        ? req.headers.host.split(".")[0]
        : null;

    // if (subdomain && subdomain === "lws-dentist") {
    //   return {
    //     notFound: true,
    //   };
    // }

    if (!subdomain || subdomain !== "lws-dentist") {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    if (token) {
      await axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          profile = res.data;
        })
        .catch((err) => {
          profile = null;
          destroyCookie(ctx, "a_t", {
            path: "/",
          });
          throw err;
        });
    }

    return await gssp(ctx, { profile, openMenus, subdomain });
  };
}
