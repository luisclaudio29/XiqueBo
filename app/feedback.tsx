/**
 * Tela de Avaliação de Satisfação
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function FeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const rideId = params.ride as string || 'ride_test';

  const [rating, setRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [vehicleRating, setVehicleRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [routeRating, setRouteRating] = useState(0);
  const [nps, setNps] = useState(-1);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, avalie a corrida com estrelas.');
      return;
    }

    if (nps === -1) {
      Alert.alert('Atenção', 'Por favor, responda a pergunta sobre recomendação.');
      return;
    }

    try {
      setSubmitting(true);

      // Aqui você enviaria para o backend
      const feedback = {
        rideId,
        rating,
        categories: {
          driver: driverRating,
          vehicle: vehicleRating,
          punctuality: punctualityRating,
          route: routeRating,
        },
        nps,
        comment,
        submittedAt: new Date(),
      };

      console.log('📝 FEEDBACK ENVIADO:', feedback);

      // Simula envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        '✅ Obrigado!',
        'Sua avaliação foi enviada com sucesso. Ela nos ajuda a melhorar cada vez mais!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, onPress: (value: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress(star)}
            style={styles.starButton}
          >
            <Text style={styles.starIcon}>
              {star <= currentRating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderNPS = () => {
    return (
      <View style={styles.npsContainer}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => setNps(value)}
            style={[
              styles.npsButton,
              nps === value && styles.npsButtonActive,
              value <= 6 && styles.npsDetractor,
              value >= 7 && value <= 8 && styles.npsPassive,
              value >= 9 && styles.npsPromoter,
            ]}
          >
            <Text
              style={[
                styles.npsText,
                nps === value && styles.npsTextActive,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avalie sua Experiência</Text>
        <Text style={styles.subtitle}>
          Sua opinião é muito importante para nós! ⭐
        </Text>
      </View>

      {/* Overall Rating */}
      <View style={styles.section}>
        <Text style={styles.questionTitle}>
          Como foi sua corrida no geral?
        </Text>
        {renderStars(rating, setRating)}
        <Text style={styles.ratingLabel}>
          {rating === 0 && 'Clique nas estrelas para avaliar'}
          {rating === 1 && 'Muito Ruim'}
          {rating === 2 && 'Ruim'}
          {rating === 3 && 'Regular'}
          {rating === 4 && 'Bom'}
          {rating === 5 && 'Excelente'}
        </Text>
      </View>

      {/* Detailed Ratings */}
      {rating > 0 && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avalie por Categoria</Text>

            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>👤 Motorista</Text>
              {renderStars(driverRating, setDriverRating)}
            </View>

            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>🚗 Veículo</Text>
              {renderStars(vehicleRating, setVehicleRating)}
            </View>

            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>⏰ Pontualidade</Text>
              {renderStars(punctualityRating, setPunctualityRating)}
            </View>

            <View style={styles.categoryItem}>
              <Text style={styles.categoryLabel}>🗺️ Rota</Text>
              {renderStars(routeRating, setRouteRating)}
            </View>
          </View>

          {/* NPS */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>
              De 0 a 10, quanto você recomendaria o XiqueGO para um amigo?
            </Text>
            {renderNPS()}
            <View style={styles.npsLegend}>
              <Text style={styles.npsLegendText}>
                0 = Não recomendaria
              </Text>
              <Text style={styles.npsLegendText}>
                10 = Recomendaria muito
              </Text>
            </View>
          </View>

          {/* Comment */}
          <View style={styles.section}>
            <Text style={styles.questionTitle}>
              Quer deixar um comentário? (Opcional)
            </Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Conte-nos mais sobre sua experiência..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {comment.length}/500 caracteres
            </Text>
          </View>

          {/* Submit Button */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Enviando...' : '📤 Enviar Avaliação'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.skipButtonText}>Pular por agora</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Obrigado por usar o XiqueGO! 🚗💚
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  starButton: {
    padding: 5,
  },
  starIcon: {
    fontSize: 40,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  npsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 15,
  },
  npsButton: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  npsButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  npsDetractor: {
    // 0-6
  },
  npsPassive: {
    // 7-8
  },
  npsPromoter: {
    // 9-10
  },
  npsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  npsTextActive: {
    color: '#fff',
  },
  npsLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  npsLegendText: {
    fontSize: 11,
    color: '#999',
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  actions: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  skipButton: {
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});




