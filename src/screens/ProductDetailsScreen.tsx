import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, ScrollView, Alert, Linking, ActivityIndicator, TextInput } from "react-native";
import client from "@/api/client";
import RatingStars from "@/components/RatingStars";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

type Review = {
  id: string;
  user?: { id: string; name: string };
  rating: number;
  comment?: string;
  created_at: string;
};

export default function ProductDetailsScreen({ route }: Props) {
  const { id } = route.params;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [prod, revs] = await Promise.all([
        client.get(`/products/${id}`),
        client.get(`/products/${id}/reviews`)
      ]);
      setItem(prod.data);
      const list = revs.data.items || revs.data;
      setReviews(list);
      const a = list.length ? list.reduce((sum: number, r: Review) => sum + (r.rating || 0), 0) / list.length : 0;
      setAvg(Number(a.toFixed(1)));
    } catch (err) {
      Alert.alert("Error", "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const startCheckout = async () => {
    try {
      const { data } = await client.post(`/orders/checkout`, { productId: id, quantity: 1 });
      Linking.openURL(data.checkoutUrl);
    } catch (e: any) {
      Alert.alert("Payment error", e?.message || "Could not start checkout");
    }
  };

  const submitReview = async () => {
    if (!myRating) return Alert.alert("Missing rating", "Please select a star rating.");
    try {
      setSubmitting(true);
      await client.post(`/reviews`, { productId: id, rating: myRating, comment: myComment });
      setMyRating(0);
      setMyComment("");
      await load();
      Alert.alert("Thanks!", "Your review has been submitted.");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!item) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0] }} style={{ width: "100%", height: 260, borderRadius: 12 }} />
      ) : (
        <View style={{ width: "100%", height: 260, backgroundColor: "#eee", borderRadius: 12 }} />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, justifyContent: "space-between" }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>{item.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RatingStars value={Math.round(avg)} />
          <Text style={{ marginLeft: 6, color: "#555" }}>{avg || 0}/5</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, marginTop: 6 }}>FCFA {item.price?.toLocaleString()}</Text>
      <Text style={{ marginTop: 10, lineHeight: 20 }}>{item.description}</Text>
      <View style={{ height: 16 }} />
      <Button title="Buy now" onPress={startCheckout} />
      <View style={{ height: 8 }} />
      <Button title="Message seller" onPress={async () => {
        try {
          const { data } = await client.post("/chats", { productId: id });
          const targetId = data.chatId || data.id;
          // navigate to Chat if global navigation available
          // @ts-ignore
          (global as any).navigation?.navigate("Chat", { chatId: targetId });
        } catch (e) {
          Alert.alert("Error", "Could not start chat");
        }
      }} />

      {/* Reviews */}
      <View style={{ height: 20 }} />
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Reviews</Text>
      {reviews.map((r) => (
        <View key={r.id} style={{ backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontWeight: "600" }}>{r.user?.name ?? "User"}</Text>
            <RatingStars value={r.rating} />
          </View>
          {r.comment ? <Text style={{ color: "#333" }}>{r.comment}</Text> : null}
          <Text style={{ color: "#999", marginTop: 4, fontSize: 12 }}>{new Date(r.created_at).toLocaleString()}</Text>
        </View>
      ))}

      {/* Add review */}
      <View style={{ height: 10 }} />
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>Add your review</Text>
      <RatingStars value={myRating} onChange={setMyRating} />
      <TextInput
        placeholder="Write a short comment (optional)"
        value={myComment}
        onChangeText={setMyComment}
        multiline
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, minHeight: 80, marginTop: 8 }}
      />
      <View style={{ height: 8 }} />
      <Button title={submitting ? "Submitting..." : "Submit review"} onPress={submitReview} />
    </ScrollView>
  );
}
