export function timeTransform(time, format = `yyyy-MM-dd hh:mm:ss`) {
  let date = new Date(time);
  let formatObj = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  for (let k in formatObj) {
    format = format.replace(new RegExp(`${k}+`, "g"), function (result) {
      let value = formatObj[k];
      if (k === "M" || k === "d" || k === "h" || k === "m" || k === "s") {
        if (result.length > 1) {
          value = "0" + value;
          value = value.substr(value.length - 2);
        }
      }
      return value;
    });
  }

  return format;
}
