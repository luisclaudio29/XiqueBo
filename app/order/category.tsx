/**
 * Tela: Seleção de Categoria
 * Primeiro passo do fluxo de pedido
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder, RideCategory, DeliveryCategory, ExpressoSubtype } from '@/contexts/OrderContext';

export default function CategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = (params.mode as 'corrida' | 'entrega') || 'corrida';
  
  const { selectCategory } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<ExpressoSubtype>(null);

  const rideCategories = [
    {
      id: 'moto',
      name: 'Moto',
      icon: 'bicycle',
      eta: '~3 min',
      price: 'A partir de R$ 5',
      description: 'Rápido e econômico',
    },
    {
      id: 'mototaxi',
      name: 'Mototáxi',
      icon: 'bicycle',
      eta: '~3 min',
      price: 'A partir de R$ 6',
      description: 'Licenciado para passageiros',
    },
    {
      id: 'carro',
      name: 'Carro',
      icon: 'car',
      eta: '~5 min',
      price: 'A partir de R$ 8',
      description: 'Mais conforto',
    },
    {
      id: 'expresso',
      name: 'Expresso',
      icon: 'flash',
      eta: '~2 min',
      price: 'A partir de R$ 10',
      description: 'Prioritário (1.3x)',
    },
  ];

  const deliveryCategories = [
    {
      id: 'bicicleta',
      name: 'Bicicleta',
      icon: 'bicycle',
      eta: '~10 min',
      price: 'A partir de R$ 4',
      description: 'Pequenas entregas',
    },
    {
      id: 'moto',
      name: 'Moto',
      icon: 'bicycle',
      eta: '~5 min',
      price: 'A partir de R$ 6',
      description: 'Entregas médias',
    },
    {
      id: 'carro',
      name: 'Carro',
      icon: 'car',
      eta: '~7 min',
      price: 'A partir de R$ 10',
      description: 'Entregas grandes',
    },
    {
      id: 'expresso',
      name: 'Expresso',
      icon: 'flash',
      eta: '~3 min',
      price: 'A partir de R$ 12',
      description: 'Urgente ou Mudança/Animais',
    },
  ];

  const categories = mode === 'corrida' ? rideCategories : deliveryCategories;

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // Se for Expresso em Entrega, perguntar subtipo
    if (mode === 'entrega' && categoryId === 'expresso') {
      Alert.alert(
        'Tipo de Expresso',
        'Escolha o tipo de entrega expressa:',
        [
          {
            text: 'Expresso Urbano (urgente)',
            onPress: () => {
              setSelectedSubtype('urbano');
              confirmSelection(categoryId, 'urbano');
            },
          },
          {
            text: 'Mudança/Animais (rural)',
            onPress: () => {
              setSelectedSubtype('mudanca_animais');
              confirmSelection(categoryId, 'mudanca_animais');
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } else {
      confirmSelection(categoryId, null);
    }
  };

  const confirmSelection = (categoryId: string, subtype: ExpressoSubtype) => {
    selectCategory(categoryId as RideCategory | DeliveryCategory, subtype);
    router.push('/order/origin');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'corrida' ? 'Escolha sua corrida' : 'Escolha sua entrega'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Selecione a categoria que melhor atende sua necessidade:
        </Text>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.card,
              selectedCategory === category.id && styles.cardSelected,
            ]}
            onPress={() => handleSelectCategory(category.id)}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name={category.icon as any}
                size={32}
                color={selectedCategory === category.id ? '#FFF' : COLORS.primary}
              />
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{category.name}</Text>
                <Text style={styles.cardEta}>{category.eta}</Text>
              </View>
              <Text style={styles.cardDescription}>{category.description}</Text>
              <Text style={styles.cardPrice}>{category.price}</Text>
            </View>

            <View style={styles.cardArrow}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={selectedCategory === category.id ? '#FFF' : '#999'}
              />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: COLORS.primary,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardEta: {
    fontSize: 13,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardArrow: {
    marginLeft: 8,
  },
});

