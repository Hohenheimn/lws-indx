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
    let token = parseCookies(ctx).a_t;
    let subdomain =
      req.headers.host.split(".").length > 1
        ? req.headers.host.split(".")[0]
        : null;

    // if (subdomain && subdomain !== "lws-dentist") {
    //   return {
    //     notFound: true,
    //   };
    // }

    if (!token) {
      profile = false;
    } else {
      profile = true;
      // await axios
      //   .get(`${process.env.MY_API_URL}/api/me/`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      //   .then((res) => {
      //     req.profile = res.data;
      //   })
      //   .catch((err) => {
      //     req.profile = null;
      //     // destroyCookie(ctx, "a_t");
      //     // throw err;
      //   });
    }

    return await gssp(ctx, { profile, openMenus, subdomain });
  };
}

// export default PrivateRoute;
