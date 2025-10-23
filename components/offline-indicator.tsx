/**
 * Indicador de Conexão Offline/Online
 * Mostra status da internet em tempo real
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '@/constants/colors';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected ?? true;
      setIsOnline(online);
      
      // Mostra indicador sempre que offline
      if (!online) {
        setShowIndicator(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Quando voltar online, mostra brevemente e some
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setShowIndicator(false));
      }
    });

    return () => unsubscribe();
  }, []);

  if (!showIndicator) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
        isOnline ? styles.online : styles.offline,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>
          {isOnline ? '✅' : '📵'}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isOnline ? 'Online' : 'Modo Offline'}
          </Text>
          <Text style={styles.subtitle}>
            {isOnline
              ? 'Sincronizando dados...'
              : 'Suas solicitações serão sincronizadas quando a internet voltar'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  offline: {
    backgroundColor: '#FF5252',
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
});

