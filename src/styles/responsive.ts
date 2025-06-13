import { getScreenCategory } from "@/utils/screenUtils";

const screenWidth = getScreenCategory();
const isSmallScreen = screenWidth === "small";
const isMediumScreen = screenWidth === "medium";
const isLargeScreen = screenWidth === "large";

export function stylesScreen(): string {
  if (isSmallScreen) {
    return "max-[380px]:border-green-500";
  }
  if (isMediumScreen) {
    return "max-[580px]:border-yellow-500";
  }
  if (isLargeScreen) {
    return "max-[780px]:border-pink-500";
  }
  return "";
}
