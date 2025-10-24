/**
 * ClientCard - Card do cliente (para motoristas verem)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from '../ui/rating-stars';
import { COLORS } from '@/constants/colors';
import type { Client } from '@/contexts/OrderContext';

interface ClientCardProps {
  client: Client;
  onMessage?: () => void;
  onCall?: () => void;
}

export function ClientCard({ client, onMessage, onCall }: ClientCardProps) {
  const handleCall = () => {
    if (onCall) {
      onCall();
    } else {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage();
    } else {
      // Mock: abrir WhatsApp
      const phone = client.phone.replace(/\D/g, '');
      Linking.openURL(`https://wa.me/55${phone}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Foto ou Iniciais */}
        <View style={styles.photoContainer}>
          {client.photo ? (
            <Image source={{ uri: client.photo }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.initials}>
                {client.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{client.name}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={client.rating} size={14} showNumber={true} />
          </View>
          <Text style={styles.trips}>{client.totalTrips} viagens</Text>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
            <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4DD0E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingRow: {
    marginBottom: 4,
  },
  trips: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

