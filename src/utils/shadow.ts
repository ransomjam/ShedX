import { Platform } from "react-native";

export const shadow = (level: 1|2|3 = 1) => {
  const map = {
    1: { elevation: 2, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    2: { elevation: 4, shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    3: { elevation: 8, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  } as const;
  return Platform.OS === "android" ? { elevation: map[level].elevation } : { ...map[level] };
};
