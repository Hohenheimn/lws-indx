import { parse, differenceInYears, isValid } from "date-fns";
import lodash from "lodash";

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
  switch (status?.toLowerCase()) {
    case "pending":
    case "no payment":
      return "text-default-text bg-slate-300";
    case "partial payment":
    case "for billing":
    case "void":
      return "text-white bg-danger-300";
    case "paid":
    case "billed":
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

export function removeNumberFormatting(number: string) {
  return Number(number?.toString()?.replace(/[^0-9\.-]+/g, ""));
}

export function numberSeparator(currency: string | number, decimal?: number) {
  if (!currency) {
    return parseFloat(0?.toString())
      .toFixed(decimal ?? 2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return parseFloat(currency?.toString())
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
  const regex = /^.*(youtu.be|v|embed|watch\?|youtube.comuser[^#]*#([^]*?)*)\??v?=?([^#]*).*/g;
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

export function getInitialValue(form: any, name: string, initial?: boolean) {
  if (!name) {
    return "";
  }

  let initialValue = form.getFieldValue(name);

  if (!initialValue) {
    return "";
  }

  return `${initial ? "?" : "&"}initial_value=${initialValue}`;
}

export function slugify(str: string) {
  let text = str ? str : "";
  text = text?.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  text = text?.toLowerCase(); // convert to lower case
  text = text
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens

  return text;
}

export function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const getAge = (birthdate: string) => {
  let birthday = parse(
    birthdate,
    "EEE MMM dd yyyy HH:mm:ss 'GMT'xx",
    new Date()
  );
  if (!isValid(birthday)) {
    birthday = parse(birthdate, "MMMM dd, yyyy", new Date());
  }
  const age = differenceInYears(new Date(), birthday);
  return Number(age);
};

export const scrollToTarget = async (ref: any) => {
  ref?.current?.scrollIntoView({ top: -200 });
};

export const toothNumbers = (age: number) => {
  if (age <= 10) {
    return [
      55,
      54,
      53,
      52,
      51,
      61,
      62,
      63,
      64,
      65,
      85,
      84,
      83,
      82,
      81,
      71,
      72,
      73,
      74,
      75,
    ];
  } else {
    return [
      18,
      17,
      16,
      15,
      14,
      13,
      12,
      11,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      48,
      47,
      46,
      45,
      44,
      43,
      42,
      41,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
    ];
  }
};
