import axios from "axios";
import { NextPageContext } from "next";
import { parseCookies, destroyCookie, setCookie } from "nookies";

// import axios from "axios";

type ggspTypes = {
  profile: any;
  openMenus: string;
  subdomain: string;
  domainExist: boolean;
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

    let domainExist: boolean = true;

    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/api/domain-checker?api_key=${process.env.REACT_APP_API_KEY}`,
        {
          domain: subdomain,
        }
      )
      .then((response) => {
        domainExist = response.data;
      })
      .catch((error) => {
        domainExist = false;
      });

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

    return await gssp(ctx, { profile, openMenus, subdomain, domainExist });
  };
}
