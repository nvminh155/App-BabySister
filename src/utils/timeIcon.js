import { AppImage } from "../components";
import formatDateTime from "./formatDatetime";

function timeIcon(timestamp) {
  const timeSunset = { start: "05:00:00", end: "05:59:59" };
  const timeMorning = { start: "06:00:00", end: "11:30:00" };
  const timeAfternoon = { start: "11:30:01", end: "18:00:00" };
  const timeNight = { start: "18:00:01", end: "23:59:59" };
  const currentTime = formatDateTime(timestamp).TS;
  return (
    <>
      {currentTime >= timeSunset.start && currentTime <= timeSunset.end && (
        <AppImage width={32} height={32} source={require("images/sunset.png")} />
      )}
      {currentTime >= timeMorning.start && currentTime <= timeMorning.end && (
        <AppImage width={32} height={32} source={require("images/morning.png")} />
      )}
      {currentTime >= timeAfternoon.start && currentTime <= timeAfternoon.end && (
        <AppImage width={32} height={32} source={require("images/afternoon.png")} />
      )}
      {currentTime >= timeNight.start && currentTime <= timeNight.end && (
        <AppImage width={32} height={32} source={require("images/night.png")} />
      )}
    </>
  );
}


export default timeIcon;