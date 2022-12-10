export function statusPalette(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return {
        color: "#757575",
        background: "#E4E8F4",
      };
    case "valid":
      return {
        color: "#fff",
        background: "#5DA271",
      };
    case "invalid":
      return {
        color: "#fff",
        background: "#D54E43",
      };
    default:
      return {
        color: "#C9C9C9",
        background: "transparent",
        border: "1px solid #C9C9C9",
      };
  }
}

export function paymentStatusPalette(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-default-text bg-slate-300";
    case "partial payment":
      return "text-white bg-danger-300";
    case "paid":
      return "text-white bg-green-400";
    default:
      return "text-default-text bg-transparent";
  }
}

export function classNameMerge(
  ...classes: Array<boolean | string | undefined>
) {
  return classes.filter((value) => value).join(" ");
}

export function numberSeparator(currency: string | number, decimal?: number) {
  return parseFloat(currency.toString())
    .toFixed(decimal ?? 2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertNumber(number: number) {
  return ((Math.log10(number) / 3) | 0) === 0
    ? number
    : Number(
        (number / Math.pow(10, ((Math.log10(number) / 3) | 0) * 3)).toFixed(1)
      ) + ["", "K", "M", "B", "T"][(Math.log10(number) / 3) | 0];
}

export function contactNumberFormatter(number: string) {
  return number.replace(/\s+/g, "").replace(/#/g, "");
}

export function getYoutubeId(url: string) {
  const regex =
    /^.*(youtu.be|v|embed|watch\?|youtube.comuser[^#]*#([^]*?)*)\??v?=?([^#]*).*/g;
  const match = regex.exec(url);
  if (match === null) {
    return match;
  } else {
    return match[3];
  }
}

export function convertMobile(mobile: string) {
  let convertedMobile = mobile.toString();

  return convertedMobile
    .replace("+63", "0")
    .replace(/\s/g, "")
    .replace(/#/g, "");
}

export function capitalizeTitle(title: string, route: any) {
  let homepage = route === "/";
  let notFound = route === "/404";

  if (homepage) {
    route = "Home";
  } else if (notFound) {
    route = "Not Found";
  } else {
    route = route.split("/");

    route = route
      .filter((data: any) => data)
      .map((q: any) => {
        let string = q.replace(/[^a-zA-Z0-9 ]/g, " ");

        string = string.split(" ");
        string = string
          .filter((data: any) => data)
          .map((text: any) => {
            return text.charAt(0).toUpperCase() + text.substring(1);
          });

        return string.join(" ");
      });

    route = route.join(" | ");
  }
  return `${title} | ${route}`;
}

export function stripTags(text: string) {
  return text?.replace(/(<([^>]+)>)/gi, "");
}
