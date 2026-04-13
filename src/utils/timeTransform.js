export function timeTransform(time, format = `yyyy-MM-dd hh:mm:ss`) {
  let date = new Date(time);
  let dateMap = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + ``).substr(4 - RegExp.$1.length),
    );
  }

  for (let key in dateMap) {
    RegExp(`(` + key + `)`).test(format) &&
      (format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? dateMap[key]
          : (`00` + dateMap[key]).substr(`` + dateMap[key].length),
      ));
  }

  return format;
}
