/**
 * Botão Flutuante de Pontos de Interesse
 * Aparece só para motoristas/entregadores
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import HotspotsService, { Hotspot, EventoSazonal } from '@/services/hotspots.service';

interface HotspotsButtonProps {
  userType: 'cliente' | 'motorista';
}

export default function HotspotsButton({ userType }: HotspotsButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [eventos, setEventos] = useState<EventoSazonal[]>([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (userType === 'motorista') {
      loadHotspots();
      
      // Atualiza a cada 5 minutos
      const interval = setInterval(loadHotspots, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userType]);

  useEffect(() => {
    if (hasNotification) {
      // Animação de pulso
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasNotification]);

  const loadHotspots = () => {
    const top5 = HotspotsService.getTop5Hotspots();
    const eventosSazonais = HotspotsService.getEventosSazonais();
    
    setHotspots(top5);
    setEventos(eventosSazonais);
    setHasNotification(top5.length > 0 || eventosSazonais.length > 0);
  };

  // Não mostra para clientes
  if (userType !== 'motorista') {
    return null;
  }

  return (
    <>
      {/* Botão Flutuante */}
      <Animated.View
        style={[
          styles.floatingButton,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            hasNotification && styles.buttonActive,
          ]}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonIcon}>💰</Text>
          {hasNotification && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{hotspots.length + eventos.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Modal de Hotspots */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💰 Pontos de Interesse</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Eventos Sazonais */}
              {eventos.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎉 Eventos Especiais</Text>
                  {eventos.map((evento) => (
                    <View key={evento.id} style={styles.eventoCard}>
                      <View style={styles.eventoHeader}>
                        <Text style={styles.eventoIcon}>
                          {evento.tipo === 'enem' && '📚'}
                          {evento.tipo === 'regata' && '🚤'}
                          {evento.tipo === 'vaquejada' && '🐂'}
                          {evento.tipo === 'festejo' && '🎊'}
                          {evento.tipo === 'feira' && '🛒'}
                        </Text>
                        <View style={styles.eventoInfo}>
                          <Text style={styles.eventoNome}>{evento.nome}</Text>
                          <Text style={styles.eventoLocal}>{evento.local}</Text>
                        </View>
                        <View
                          style={[
                            styles.impactoBadge,
                            evento.impacto === 'muito-alto' && styles.impactoMuitoAlto,
                            evento.impacto === 'alto' && styles.impactoAlto,
                            evento.impacto === 'medio' && styles.impactoMedio,
                          ]}
                        >
                          <Text style={styles.impactoText}>
                            {evento.impacto === 'muito-alto' && '🔥🔥🔥'}
                            {evento.impacto === 'alto' && '🔥🔥'}
                            {evento.impacto === 'medio' && '🔥'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
                      <Text style={styles.eventoHorarios}>⏰ {evento.horarios}</Text>
                      <View style={styles.eventoFooter}>
                        <Text style={styles.eventoEstimativa}>
                          📊 ~{evento.estimativaCorridas} corridas estimadas
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Hotspots Ativos */}
              {hotspots.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎯 Hotspots Agora</Text>
                  {hotspots.map((hotspot) => (
                    <View key={hotspot.id} style={styles.hotspotCard}>
                      <View style={styles.hotspotHeader}>
                        <Text style={styles.hotspotIcon}>{hotspot.icone}</Text>
                        <View style={styles.hotspotInfo}>
                          <Text style={styles.hotspotNome}>{hotspot.nome}</Text>
                          <Text style={styles.hotspotEndereco}>
                            {hotspot.localizacao.endereco}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.nivelBadge,
                            {
                              backgroundColor: HotspotsService.getCorNivel(
                                hotspot.nivel as any
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.nivelText}>
                            {hotspot.nivel === 'muito-alto' && 'ALTO'}
                            {hotspot.nivel === 'alto' && 'ALTO'}
                            {hotspot.nivel === 'medio' && 'MÉDIO'}
                            {hotspot.nivel === 'baixo' && 'BAIXO'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.hotspotDescricao}>{hotspot.descricao}</Text>
                      
                      {hotspot.horarioPico && (
                        <Text style={styles.hotspotHorario}>
                          ⏰ Pico: {hotspot.horarioPico}
                        </Text>
                      )}

                      <View style={styles.hotspotFooter}>
                        <Text style={styles.hotspotEstimativa}>
                          📊 ~{hotspot.estimativaCorridas} corridas
                        </Text>
                        {hotspot.distanciaKm && (
                          <Text style={styles.hotspotDistancia}>
                            📍 {hotspot.distanciaKm.toFixed(1)} km
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Mensagem se não houver hotspots */}
              {hotspots.length === 0 && eventos.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>💤</Text>
                  <Text style={styles.emptyTitle}>Tudo Tranquilo</Text>
                  <Text style={styles.emptyText}>
                    Não há pontos de alta demanda no momento.
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Fique atento! Atualizamos a cada 5 minutos.
                  </Text>
                </View>
              )}

              {/* Dica */}
              <View style={styles.dica}>
                <Text style={styles.dicaIcon}>💡</Text>
                <Text style={styles.dicaText}>
                  <Text style={styles.dicaBold}>Dica:</Text> Fique próximo aos pontos de
                  alto interesse para receber mais corridas e ganhar mais!
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: '#FF6B00',
  },
  buttonIcon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    maxHeight: '80%',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  modalBody: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  eventoCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  eventoInfo: {
    flex: 1,
  },
  eventoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  eventoLocal: {
    fontSize: 13,
    color: COLORS.gray,
  },
  impactoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  impactoMuitoAlto: {
    backgroundColor: '#FFEBEE',
  },
  impactoAlto: {
    backgroundColor: '#FFF3E0',
  },
  impactoMedio: {
    backgroundColor: '#FFF9E6',
  },
  impactoText: {
    fontSize: 12,
  },
  eventoDescricao: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  eventoHorarios: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  eventoFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFE082',
  },
  eventoEstimativa: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  hotspotCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  hotspotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotspotIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  hotspotInfo: {
    flex: 1,
  },
  hotspotNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  hotspotEndereco: {
    fontSize: 12,
    color: COLORS.gray,
  },
  nivelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nivelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  hotspotDescricao: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  hotspotHorario: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  hotspotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  hotspotEstimativa: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  hotspotDistancia: {
    fontSize: 12,
    color: COLORS.gray,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  dica: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  dicaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dicaText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 20,
  },
  dicaBold: {
    fontWeight: 'bold',
  },
});

