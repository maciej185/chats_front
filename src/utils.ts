import configData from "./config.json";

export function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export function setCookie(cname: string, cvalue: string | number) {
  document.cookie = cname + "=" + cvalue;
}

export function deleteCookie(cname: string) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

export function getErrorFromResponse(
  resData: {
    detail: Array<{ msg: string }> | string;
  },
  defaultError: string = "There was an error"
): string {
  type resDetailType = string | Array<{ msg: string }>;
  const resDataDetail = resData.detail as any as resDetailType;
  if (Array.isArray(resDataDetail)) {
    return resDataDetail[0]["msg"];
  } else if (typeof resDataDetail === "string") {
    return resDataDetail;
  } else {
    return defaultError;
  }
}

export function getBackendAddress() {
  return `${
    process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL
      : configData.API_URL
  }:${
    process.env.REACT_APP_API_PORT
      ? process.env.REACT_APP_API_PORT
      : configData.API_PORT
  }`;
}

// function formatTime(date) {
//   const options = {
//       hour: "numeric",
//       minute: "numeric"
//     };
//   const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
//   return dateTimeFormat.format(date)
// }

// function getDay(date) {
//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   return dayNames[date.getDay()]
// }

// export function formatDate(timestamp) {
//   const date = new Date(timestamp)
//   return `${getDay(date)}, ${formatTime(date)}`
// }

// export function getShortDay(date) {
//   const dateObj = new Date(date)
//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//   return dayNames[dateObj.getDay()]
// }

// export function capitalize(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
