import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
};

export default function RatingStars({ value, onChange, size = 20 }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {stars.map((s) => (
        <TouchableOpacity key={s} onPress={() => onChange && onChange(s)} activeOpacity={onChange ? 0.6 : 1}>
          <Text style={{ fontSize: size, marginRight: 4 }}>{s <= value ? "★" : "☆"}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
