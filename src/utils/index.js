import dayjs from "dayjs";

export function timestampFormat(t) {
  return dayjs(t).format("YYYY-MM-DD hh:mm:ss");
}
