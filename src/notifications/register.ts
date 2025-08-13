import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import client from "@/api/client";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Must use physical device for Push Notifications");
    return null;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for push notifications!");
    return null;
  }

  const projectId = (await Notifications.getExpoPushTokenAsync()).data.split("ExpoPushToken[")[1]
    ? (await Notifications.getExpoPushTokenAsync()).data
    : (await Notifications.getExpoPushTokenAsync({ projectId: (Notifications as any).projectId })).data;

  // projectId logic above is a safeguard; usually one call is enough.
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX
    });
  }

  try {
    // Send token to backend for this user (backend should map token->user)
    await client.post("/devices", { token });
  } catch (e) {
    console.warn("Failed to register device token on server");
  }

  return token;
}
