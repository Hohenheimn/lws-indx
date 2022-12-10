import { NextPageContext } from "next";
import { parseCookies, destroyCookie } from "nookies";
// import axios from "axios";

export default function VerifyAuth(gssp: {
  (ctx: NextPageContext, profile: any, openMenus: string): {};
}) {
  return async (ctx: any) => {
    const { req, res } = ctx;

    let profile = req?.profile ?? null;
    let openMenus = req?.cookies?.om ?? null;
    let token = parseCookies(ctx).a_t;

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

    return await gssp(ctx, profile, openMenus);
  };
}

// export default PrivateRoute;
