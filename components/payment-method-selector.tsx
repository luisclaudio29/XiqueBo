/**
 * Componente: Seletor de Método de Pagamento
 * Usado ao solicitar corrida
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type PaymentMethodOption = 'pix' | 'credit_card' | 'debit_card' | 'cash';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodOption | null;
  onSelect: (method: PaymentMethodOption) => void;
}

export function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'pix' as PaymentMethodOption,
      icon: '📱',
      name: 'PIX',
      description: 'Instantâneo',
    },
    {
      id: 'credit_card' as PaymentMethodOption,
      icon: '💳',
      name: 'Crédito',
      description: 'Até 12x',
    },
    {
      id: 'debit_card' as PaymentMethodOption,
      icon: '💳',
      name: 'Débito',
      description: 'À vista',
    },
    {
      id: 'cash' as PaymentMethodOption,
      icon: '💵',
      name: 'Dinheiro',
      description: 'Pagar ao motorista',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forma de Pagamento</Text>
      
      <View style={styles.methodsGrid}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected,
            ]}
            onPress={() => onSelect(method.id)}
          >
            <View style={styles.methodIcon}>
              <Text style={styles.methodEmoji}>{method.icon}</Text>
            </View>
            <Text style={[
              styles.methodName,
              selectedMethod === method.id && styles.methodNameSelected,
            ]}>
              {method.name}
            </Text>
            <Text style={styles.methodDescription}>{method.description}</Text>
            
            {selectedMethod === method.id && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  methodIcon: {
    marginBottom: 8,
  },
  methodEmoji: {
    fontSize: 32,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodNameSelected: {
    color: '#4CAF50',
  },
  methodDescription: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});




