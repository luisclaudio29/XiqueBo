/**
 * Divider - "Risca" para separar seções
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DividerProps {
  marginVertical?: number;
  color?: string;
  thickness?: number;
}

export function Divider({ 
  marginVertical = 12, 
  color = '#EAEAEA',
  thickness = 1 
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical,
          backgroundColor: color,
          height: thickness,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

