import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DraggableFloatingButtonProps {
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  size?: number;
  pulse?: boolean; // Nova prop para ativar animação de pulso
}

export default function DraggableFloatingButton({
  onPress,
  icon = 'location',
  backgroundColor = '#FF8C00',
  size = 60,
  pulse = false,
}: DraggableFloatingButtonProps) {
  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - size - 20, // Posição inicial: canto direito
      y: SCREEN_HEIGHT / 2 - 150, // NO MEIO DA TELA, BEM ALTA!
    })
  ).current;
  
  // Animação de pulso
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Efeito de pulso quando há nova corrida
  useEffect(() => {
    if (pulse) {
      // Animação de pulso (aumenta e diminui)
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Animação de brilho (opacidade)
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    } else {
      // Reset animações quando não houver pulso
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [pulse]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        // Armazena a posição atual ao iniciar o arrasto
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        // Se o movimento foi muito pequeno, considera como clique
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          onPress?.();
          return;
        }

        // Limites da tela
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        let newX = currentX;
        let newY = currentY;

        // Limitar movimento horizontal
        if (currentX < 0) {
          newX = 0;
        } else if (currentX > SCREEN_WIDTH - size) {
          newX = SCREEN_WIDTH - size;
        }

        // Limitar movimento vertical
        if (currentY < 0) {
          newY = 0;
        } else if (currentY > SCREEN_HEIGHT - size - 100) {
          newY = SCREEN_HEIGHT - size - 100;
        }

        // Animar para a posição corrigida
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }).start();
      },
    })
  ).current;

  return (
    <>
      {/* Círculo de Brilho (apenas quando pulse=true) */}
      {pulse && (
        <Animated.View
          style={[
            styles.glowCircle,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: pulseAnim },
              ],
              opacity: glowAnim,
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              left: -10,
              top: -10,
            },
          ]}
        />
      )}

      {/* Botão Principal */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.container,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: pulse ? pulseAnim : 1 },
            ],
            width: size,
            height: size,
            backgroundColor,
          },
        ]}
      >
        <Ionicons name={icon} size={size * 0.5} color="#FFF" />
        
        {/* Badge de Notificação */}
        {pulse && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>!</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 1000, // Garante que seja circular
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 9999,
  },
  glowCircle: {
    position: 'absolute',
    backgroundColor: '#FFD700', // Amarelo brilhante
    zIndex: 9998,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

