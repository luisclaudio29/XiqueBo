/**
 * VehicleBadge - Badge do veículo com todas as informações
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import type { Vehicle } from '@/contexts/OrderContext';

interface VehicleBadgeProps {
  vehicle: Vehicle;
  showMudancaAnimais?: boolean;
}

export function VehicleBadge({ vehicle, showMudancaAnimais = false }: VehicleBadgeProps) {
  const categoryIcons = {
    moto: 'bicycle',
    mototaxi: 'bicycle',
    carro: 'car',
    expresso: 'flash',
    bicicleta: 'bicycle',
  };

  const icon = categoryIcons[vehicle.category as keyof typeof categoryIcons] || 'car';

  // Placa mascarada (ABC•1D23)
  const maskedPlate = vehicle.plate
    ? `${vehicle.plate.substring(0, 3)}•${vehicle.plate.substring(3)}`
    : 'N/A';

  return (
    <View style={styles.badge}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.vehicle}>
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </Text>
          <Text style={styles.color}>{vehicle.color}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.plate}>
          <Text style={styles.plateText}>{maskedPlate}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {vehicle.category === 'mototaxi'
              ? 'Mototáxi'
              : vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
          </Text>
        </View>
      </View>

      {showMudancaAnimais && (
        <View style={styles.specialBadge}>
          <Text style={styles.specialText}>🚚 Mudança/Animais</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  vehicle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  color: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plate: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  plateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  categoryBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  specialBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  specialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
});

