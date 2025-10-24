/**
 * RatingStars - Estrelas dinâmicas (cheia/meia/vazia)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingStarsProps {
  rating: number; // 0..5
  size?: number;
  showNumber?: boolean;
  color?: string;
}

export function RatingStars({ 
  rating, 
  size = 16, 
  showNumber = true,
  color = '#FDB913'
}: RatingStarsProps) {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Estrela cheia
      stars.push(
        <Ionicons key={i} name="star" size={size} color={color} />
      );
    } else if (rating >= i - 0.5) {
      // Meia estrela
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color={color} />
      );
    } else {
      // Estrela vazia
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color={color} />
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.stars}>{stars}</View>
      {showNumber && (
        <Text style={[styles.number, { fontSize: size * 0.875 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  number: {
    fontWeight: '600',
    color: '#333',
  },
});

