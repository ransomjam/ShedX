import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

type Props = {
  initialQuery?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  onApply: (q: string, minPrice?: number, maxPrice?: number) => void;
};

export default function SearchFilters({ initialQuery = "", initialMinPrice = "", initialMaxPrice = "", onApply }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  return (
    <View style={{ gap: 8, marginBottom: 12 }}>
      <TextInput
        placeholder="Search products..."
        value={q}
        onChangeText={setQ}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }}
      />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="Min price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }}
        />
        <TextInput
          placeholder="Max price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }}
        />
      </View>
      <Button
        title="Apply filters"
        onPress={() => onApply(q.trim(), minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined)}
      />
    </View>
  );
}
