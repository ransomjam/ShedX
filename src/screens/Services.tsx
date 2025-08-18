import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { optionalApi } from '../api/optional';

interface Service {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  category: string;
  description: string;
  provider: string;
  verified: 'pro' | 'basic';
  trust: number;
}

const FALLBACK: Service[] = [
  {
    id: 1,
    title: 'Plumbing & Repairs',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200',
    category: 'Plumbing',
    description: 'Fix leaks and install pipes for your home or office.',
    provider: 'John Tech',
    verified: 'pro',
    trust: 92,
  },
  {
    id: 2,
    title: 'House Painting',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
    category: 'Painting',
    description: 'Interior and exterior painting with premium finishes.',
    provider: 'ColorMax Co.',
    verified: 'basic',
    trust: 80,
  },
  {
    id: 3,
    title: 'Phone Repair',
    price: 10000,
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200',
    category: 'Electronics',
    description: 'Screen and hardware fixes for most smartphones.',
    provider: 'FixIt Hub',
    verified: 'pro',
    trust: 97,
  },
  {
    id: 4,
    title: 'Catering Service',
    price: 80000,
    image:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200',
    category: 'Catering',
    description: 'Delicious meals for events and celebrations.',
    provider: 'TasteBuds',
    verified: 'basic',
    trust: 76,
  },
];

const categories = ['All Services', 'Plumbing', 'Painting', 'Electronics', 'Catering'];
const priceRanges = ['Any Price', 'Under 25,000 FCFA', '25,000 - 50,000 FCFA', '50,000 - 100,000 FCFA', 'Above 100,000 FCFA'];
const sortOptions = ['Newest First', 'Highest Rated', 'Most Trusted'];

export default function Services() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState(priceRanges[0]);
  const [sortIndex, setSortIndex] = useState(0);

  const [showCat, setShowCat] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    (async () => {
      let data = await optionalApi.listServices();
      if (!Array.isArray(data) || !data.length) data = FALLBACK;
      setItems(data as Service[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const clearFilters = () => {
    setCategory(categories[0]);
    setPrice(priceRanges[0]);
    setSearch('');
  };

  const filtered = useMemo(() => {
    return items
      .filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
      )
      .filter((s) => {
        if (category !== 'All Services') return s.category === category;
        return true;
      })
      .filter((s) => {
        const p = s.price;
        switch (price) {
          case 'Under 25,000 FCFA':
            return p < 25000;
          case '25,000 - 50,000 FCFA':
            return p >= 25000 && p <= 50000;
          case '50,000 - 100,000 FCFA':
            return p > 50000 && p <= 100000;
          case 'Above 100,000 FCFA':
            return p > 100000;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const option = sortOptions[sortIndex];
        if (option === 'Most Trusted') return b.trust - a.trust;
        if (option === 'Highest Rated') return b.trust - a.trust;
        // Newest First – assume higher id is newer
        return Number(b.id) - Number(a.id);
      });
  }, [items, search, category, price, sortIndex]);

  if (loading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Animated.View key={i} style={[styles.skeletonCard, { opacity: pulse }]} />
        ))}
      </View>
    );
  }

  const cycleSort = () => setSortIndex((i) => (i + 1) % sortOptions.length);

  const renderCard = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>No image available</Text>
          </View>
        )}
        <View
          style={[
            styles.verifyBadge,
            item.verified === 'pro' ? styles.badgePro : styles.badgeBasic,
          ]}
        >
          <Text style={styles.verifyText}>
            {item.verified === 'pro' ? 'Pro Verified' : 'Basic Verified'}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.categoryRow}>
          <LinearGradient
            colors={['#7c3aed', '#3b82f6', '#0d9488']}
            style={styles.categoryDot}
          />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.providerRow}>
          <Text style={styles.providerText}>{item.provider}</Text>
          <Feather name="shield" size={14} color="#22c55e" style={{ marginHorizontal: 4 }} />
          <Text style={styles.trustText}>{item.trust}</Text>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>Professional Service</Text>
          </View>
          <Text style={styles.priceText}>
            XAF {Number(item.price).toLocaleString()}
          </Text>
          <Text style={styles.availableText}>Available</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={['#7c3aed', '#3b82f6', '#0d9488']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Verified Services</Text>
          <Text style={styles.headerSub}>
            Trusted professionals offering quality services in Bamenda.
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
          <Feather name="package" size={16} color="#fff" />
          <Text style={styles.headerBtnText}>List Service</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.filterBar}>
        <TextInput
          placeholder="Search by professional name, service type, or expertise…"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowCat(true)}
          >
            <Text style={styles.filterText}>{category}</Text>
            <Feather name="chevron-down" size={16} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowPrice(true)}
          >
            <Text style={styles.filterText}>{price}</Text>
            <Feather name="chevron-down" size={16} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={cycleSort}>
            <Text style={styles.filterText}>{sortOptions[sortIndex]}</Text>
            <Feather name="chevrons-down" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeadingWrap}>
        <Text style={styles.sectionHeading}>Verified Services</Text>
      </View>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filtered}
        keyExtractor={(m) => String(m.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, gap: 12 }}
        renderItem={renderCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather name="package" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No service listings found</Text>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
        stickyHeaderIndices={[1]}
      />

      <TouchableOpacity style={styles.floatingBtn} activeOpacity={0.8}>
        <LinearGradient
          colors={['#7c3aed', '#3b82f6', '#0d9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingInner}
        >
          <Feather name="package" size={20} color="#fff" />
          <Text style={styles.floatingText}>List Service</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal visible={showCat} transparent animationType="slide">
        <View style={styles.modalWrap}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.modalItem}
              onPress={() => {
                setCategory(c);
                setShowCat(false);
              }}
            >
              <Text style={styles.modalText}>{c}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalClose} onPress={() => setShowCat(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Price Modal */}
      <Modal visible={showPrice} transparent animationType="slide">
        <View style={styles.modalWrap}>
          {priceRanges.map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.modalItem}
              onPress={() => {
                setPrice(p);
                setShowPrice(false);
              }}
            >
              <Text style={styles.modalText}>{p}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalClose} onPress={() => setShowPrice(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  skeletonCard: {
    width: '48%',
    height: 160,
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    marginBottom: 16,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub: { color: '#e0f2fe', marginTop: 4, maxWidth: '80%' },
  headerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerBtnText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  filterBar: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  filterBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterText: { fontSize: 12, color: '#374151' },
  sectionHeadingWrap: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 120 },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  verifyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePro: { backgroundColor: '#a78bfa' },
  badgeBasic: { backgroundColor: '#bae6fd' },
  verifyText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  cardBody: { padding: 12 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  categoryText: { fontSize: 12, color: '#6b7280' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#111827' },
  cardDesc: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  providerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  providerText: { fontSize: 12, color: '#374151' },
  trustText: { fontSize: 12, color: '#374151' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  metaBadgeText: { fontSize: 10, color: '#374151' },
  priceText: { fontWeight: '700', fontSize: 12, color: '#111827', marginRight: 6 },
  availableText: { fontSize: 12, color: '#22c55e' },
  actionsRow: { flexDirection: 'row', gap: 8 },
  viewBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewBtnText: { color: '#374151', fontSize: 12, fontWeight: '600' },
  orderBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  orderBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: { marginTop: 8, color: '#6b7280' },
  clearBtn: {
    marginTop: 12,
    backgroundColor: '#7c3aed',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  clearBtnText: { color: '#fff', fontWeight: '600' },
  floatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  floatingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  floatingText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 40,
  },
  modalItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  modalText: { fontSize: 16, color: '#111827' },
  modalClose: {
    backgroundColor: '#7c3aed',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: { color: '#fff', fontWeight: '600' },
});
