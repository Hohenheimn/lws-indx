import axios from "axios";
import { NextPageContext } from "next";
import { parseCookies, destroyCookie, setCookie } from "nookies";

// import axios from "axios";

type ggspTypes = {
  profile: any;
  openMenus: string;
  subdomain: string;
  userToken: string;
  pathname: string;
};

export default function VerifyAuth(gssp: {
  (
    ctx: NextPageContext,
    { profile, openMenus, subdomain, userToken }: ggspTypes
  ): {};
}) {
  return async (ctx: any) => {
    const { req, res } = ctx;

    const pathname = req.url;

    let profile = req?.profile ?? null;

    let openMenus = req?.cookies?.om ?? null;
    let token = await parseCookies(ctx).a_t;
    const userToken = token ? token : "";
    let subdomain =
      req.headers.host.split(".").length > 1
        ? req.headers.host.replace("www.", "").split(".")[0]
        : null;

    if (token) {
      await axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/api/user/me?subdomain=${subdomain}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          profile = res.data;
        })
        .catch((err) => {
          profile = null;
          destroyCookie(ctx, "a_t", {
            path: "/",
          });
          destroyCookie(ctx, "currency", {
            path: "/",
          });
          destroyCookie(ctx, "subdomain", {
            path: "/",
          });
          throw err;
        });
    }

    return await gssp(ctx, {
      profile,
      openMenus,
      subdomain,
      pathname,
      userToken,
    });
  };
}
