/**
 * Tela: Selecionar Destino
 * Terceira etapa do fluxo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { getPovoados, getPovoadsNomes, getNomeOficial } from '@/constants/povoados';

export default function SelectDestinationScreen() {
  const router = useRouter();
  const { order, setDestination, calculateRoute } = useOrder();
  
  const [searchText, setSearchText] = useState('');
  const [showPovoadosModal, setShowPovoadosModal] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = () => {
    // Mock: endereços populares e recentes
    const popular = [
      {
        id: '1',
        label: 'Centro',
        address: 'Praça da Matriz - Centro, Xique-Xique',
        latitude: -10.8230,
        longitude: -42.7270,
      },
      {
        id: '2',
        label: 'Hospital',
        address: 'Hospital Municipal - Centro',
        latitude: -10.8245,
        longitude: -42.7265,
      },
      {
        id: '3',
        label: 'Feira Municipal',
        address: 'Centro de Xique-Xique',
        latitude: -10.8240,
        longitude: -42.7275,
      },
    ];

    setSuggestions(popular);
  };

  const handleSelectLocation = async (location: any) => {
    if (!location.latitude || !location.longitude || !location.address) {
      Alert.alert('Erro', 'Localização inválida.');
      return;
    }

    setDestination({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      label: location.label,
    });

    // Calcular rota automaticamente
    try {
      await calculateRoute();
      router.push('/order/details');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível calcular a rota.');
    }
  };

  const handleSelectPovoado = (povoadoNome: string) => {
    setShowPovoadosModal(false);

    const nomeOficial = getNomeOficial(povoadoNome);
    const povoado = getPovoados().find(p => p.nome === nomeOficial);

    if (povoado) {
      handleSelectLocation({
        latitude: povoado.coordenadas.latitude,
        longitude: povoado.coordenadas.longitude,
        address: `${povoado.nomeCompleto}, Xique-Xique - BA`,
        label: povoado.nomePopular || povoado.nome,
      });
    }
  };

  const handleManualEntry = () => {
    if (!searchText.trim()) {
      Alert.alert('Atenção', 'Digite um endereço para continuar.');
      return;
    }

    // Mock: geocoding
    handleSelectLocation({
      latitude: -10.8236 + (Math.random() - 0.5) * 0.01,
      longitude: -42.7273 + (Math.random() - 0.5) * 0.01,
      address: searchText,
      label: undefined,
    });
  };

  if (!order || !order.origin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Defina a origem primeiro</Text>
      </View>
    );
  }

  // Mostrar botão de povoados se for entrega rural
  const showPovoadosButton = order.mode === 'entrega' && 
    order.expressoSubtype === 'mudanca_animais';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Para onde você vai?</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Origem confirmada */}
        <View style={styles.originConfirmed}>
          <View style={styles.originDot} />
          <View style={styles.originInfo}>
            <Text style={styles.originLabel}>Origem</Text>
            <Text style={styles.originAddress} numberOfLines={1}>
              {order.origin.address}
            </Text>
          </View>
        </View>

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#999" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o endereço de destino..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleManualEntry}
            returnKeyType="search"
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botão Povoados (só para entrega rural) */}
        {showPovoadosButton && (
          <TouchableOpacity
            style={styles.povoadosButton}
            onPress={() => setShowPovoadosModal(true)}
          >
            <View style={styles.povoadosIcon}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.povoadosInfo}>
              <Text style={styles.povoadosTitle}>Povoados de Xique-Xique</Text>
              <Text style={styles.povoadosSubtitle}>
                Mesmo lado do rio • Rotas rurais
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}

        {/* Sugestões */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Lugares populares</Text>

          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectLocation(item)}
            >
              <View style={styles.suggestionIcon}>
                <Ionicons name="location" size={20} color="#4DD0E1" />
              </View>
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionLabel}>{item.label}</Text>
                <Text style={styles.suggestionAddress}>{item.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Povoados */}
      <Modal
        visible={showPovoadosModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPovoadosModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o povoado</Text>
              <TouchableOpacity onPress={() => setShowPovoadosModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              {getPovoadsNomes().map((nome, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelectPovoado(nome)}
                >
                  <Text style={styles.modalItemText}>{nome}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  originConfirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  originInfo: {
    flex: 1,
  },
  originLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 4,
  },
  originAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#000',
  },
  povoadosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  povoadosIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  povoadosInfo: {
    flex: 1,
  },
  povoadosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  povoadosSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  suggestionsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

