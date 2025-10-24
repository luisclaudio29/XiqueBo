/**
 * Tela: Detalhes e Extras
 * Quarta etapa do fluxo
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder, RideExtras, DeliveryDetails } from '@/contexts/OrderContext';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { order, setRideExtras, setDeliveryDetails, setObservations } = useOrder();
  
  // Para Corrida
  const [hasPet, setHasPet] = useState(false);
  const [hasLuggage, setHasLuggage] = useState(false);
  const [hasShopping, setHasShopping] = useState(false);
  const [needsPIN, setNeedsPIN] = useState(false);
  const [pin, setPin] = useState('');
  const [observations, setObservationsState] = useState('');

  // Para Entrega
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [hasFurniture, setHasFurniture] = useState(false);
  const [hasAppliances, setHasAppliances] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<('boi' | 'cavalo' | 'bode' | 'cabra' | 'ovelha')[]>([]);

  if (!order || !order.origin || !order.destination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Defina origem e destino primeiro</Text>
      </View>
    );
  }

  const handleToggleAnimal = (animal: 'boi' | 'cavalo' | 'bode' | 'cabra' | 'ovelha') => {
    if (selectedAnimals.includes(animal)) {
      setSelectedAnimals(selectedAnimals.filter(a => a !== animal));
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  const handleContinue = () => {
    // Para Entrega: descrição é obrigatória!
    if (order.mode === 'entrega' && !description.trim()) {
      Alert.alert('Atenção', 'Por favor, descreva o item a ser entregue.');
      return;
    }

    // Salvar no contexto
    if (order.mode === 'corrida') {
      const extras: RideExtras = {
        hasPet,
        hasLuggage,
        hasShopping,
        needsPIN,
        pin: needsPIN ? pin : undefined,
      };
      setRideExtras(extras);
    } else {
      const details: DeliveryDetails = {
        description,
        weight: weight ? parseFloat(weight) : undefined,
        hasFurniture: order.expressoSubtype === 'mudanca_animais' ? hasFurniture : undefined,
        hasAppliances: order.expressoSubtype === 'mudanca_animais' ? hasAppliances : undefined,
        animals: selectedAnimals.length > 0 ? selectedAnimals : undefined,
      };
      setDeliveryDetails(details);
    }

    if (observations.trim()) {
      setObservations(observations);
    }

    // Navegar para pagamento
    router.push('/order/payment');
  };

  const isRide = order.mode === 'corrida';
  const isMudancaAnimais = order.expressoSubtype === 'mudanca_animais';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* CORRIDA */}
        {isRide && (
          <>
            <Text style={styles.sectionTitle}>Extras (opcional)</Text>

            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Ionicons name="paw" size={24} color={COLORS.primary} />
                  <View style={styles.switchText}>
                    <Text style={styles.switchLabel}>Pet</Text>
                    <Text style={styles.switchSubtext}>Viajo com animal de estimação</Text>
                  </View>
                </View>
                <Switch value={hasPet} onValueChange={setHasPet} trackColor={{ true: COLORS.primary }} />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Ionicons name="briefcase" size={24} color={COLORS.primary} />
                  <View style={styles.switchText}>
                    <Text style={styles.switchLabel}>Mala grande</Text>
                    <Text style={styles.switchSubtext}>Tenho bagagem volumosa</Text>
                  </View>
                </View>
                <Switch value={hasLuggage} onValueChange={setHasLuggage} trackColor={{ true: COLORS.primary }} />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Ionicons name="cart" size={24} color={COLORS.primary} />
                  <View style={styles.switchText}>
                    <Text style={styles.switchLabel}>Compras grandes</Text>
                    <Text style={styles.switchSubtext}>Tenho sacolas volumosas</Text>
                  </View>
                </View>
                <Switch value={hasShopping} onValueChange={setHasShopping} trackColor={{ true: COLORS.primary }} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Segurança (opcional)</Text>

            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Ionicons name="key" size={24} color={COLORS.primary} />
                  <View style={styles.switchText}>
                    <Text style={styles.switchLabel}>Código PIN de embarque</Text>
                    <Text style={styles.switchSubtext}>Validar identidade ao embarcar</Text>
                  </View>
                </View>
                <Switch value={needsPIN} onValueChange={setNeedsPIN} trackColor={{ true: COLORS.primary }} />
              </View>

              {needsPIN && (
                <TextInput
                  style={styles.pinInput}
                  placeholder="Digite 4 dígitos"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              )}
            </View>
          </>
        )}

        {/* ENTREGA */}
        {!isRide && (
          <>
            <Text style={styles.sectionTitle}>Informações do item *</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>Descrição *</Text>
              <TextInput
                style={[styles.textArea, !description && styles.inputError]}
                placeholder="O que você está enviando? (obrigatório)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>Peso estimado (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 5"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Mudança/Animais */}
            {isMudancaAnimais && (
              <>
                <Text style={styles.sectionTitle}>Tipo de carga</Text>

                <View style={styles.card}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="cube" size={24} color={COLORS.primary} />
                      <View style={styles.switchText}>
                        <Text style={styles.switchLabel}>Móveis grandes</Text>
                      </View>
                    </View>
                    <Switch value={hasFurniture} onValueChange={setHasFurniture} trackColor={{ true: COLORS.primary }} />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="snow" size={24} color={COLORS.primary} />
                      <View style={styles.switchText}>
                        <Text style={styles.switchLabel}>Geladeira / Fogão</Text>
                      </View>
                    </View>
                    <Switch value={hasAppliances} onValueChange={setHasAppliances} trackColor={{ true: COLORS.primary }} />
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Transporte de animais</Text>

                <View style={styles.card}>
                  {(['boi', 'cavalo', 'bode', 'cabra', 'ovelha'] as const).map((animal) => (
                    <TouchableOpacity
                      key={animal}
                      style={[
                        styles.animalOption,
                        selectedAnimals.includes(animal) && styles.animalOptionSelected,
                      ]}
                      onPress={() => handleToggleAnimal(animal)}
                    >
                      <Text style={styles.animalEmoji}>
                        {animal === 'boi' && '🐂'}
                        {animal === 'cavalo' && '🐴'}
                        {animal === 'bode' && '🐐'}
                        {animal === 'cabra' && '🐐'}
                        {animal === 'ovelha' && '🐑'}
                      </Text>
                      <Text style={[
                        styles.animalText,
                        selectedAnimals.includes(animal) && styles.animalTextSelected,
                      ]}>
                        {animal.charAt(0).toUpperCase() + animal.slice(1)}
                      </Text>
                      {selectedAnimals.includes(animal) && (
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.warningCard}>
                  <Ionicons name="alert-circle" size={24} color="#FF9800" />
                  <Text style={styles.warningText}>
                    Transporte de animais requer veículo adequado e autorização do motorista.
                    Rotas exclusivas para povoados ↔ Xique-Xique.
                  </Text>
                </View>
              </>
            )}
          </>
        )}

        {/* Observações (comum para ambos) */}
        <Text style={styles.sectionTitle}>Observações (opcional)</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.textArea}
            placeholder={
              isRide
                ? 'Alguma informação adicional para o motorista?'
                : 'Alguma informação adicional para o entregador?'
            }
            value={observations}
            onChangeText={setObservationsState}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão Continuar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  switchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  switchSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  pinInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  animalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  animalOptionSelected: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  animalEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  animalText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  animalTextSelected: {
    color: COLORS.primary,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#F57C00',
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

