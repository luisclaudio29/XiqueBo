import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface Activity {
  id: string;
  type: 'corrida' | 'entrega';
  origin: string;
  destination: string;
  date: string;
  status: 'concluida' | 'cancelada' | 'em_andamento';
  value: number;
  driver?: string;
}

export default function ActivitiesScreen() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'corrida',
      origin: 'Rua Principal, Centro',
      destination: 'Av. Getúlio Vargas',
      date: '2024-10-20 14:30',
      status: 'concluida',
      value: 12.50,
      driver: 'João Silva',
    },
    {
      id: '2',
      type: 'corrida',
      origin: 'Casa',
      destination: 'Shopping',
      date: '2024-10-19 10:15',
      status: 'concluida',
      value: 18.00,
      driver: 'Maria Santos',
    },
    {
      id: '3',
      type: 'corrida',
      origin: 'Trabalho',
      destination: 'Casa',
      date: '2024-10-18 18:45',
      status: 'cancelada',
      value: 15.00,
    },
  ];

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'concluida':
        return COLORS.success;
      case 'cancelada':
        return COLORS.error;
      case 'em_andamento':
        return COLORS.primary;
      default:
        return COLORS.grayDark;
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      case 'em_andamento':
        return 'Em andamento';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Atividades</Text>
        <Text style={styles.headerSubtitle}>Histórico de corridas e entregas</Text>
      </View>

      {/* Activities List */}
      <ScrollView style={styles.content}>
        {activities.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.activityTypeContainer}>
                <Text style={styles.activityTypeIcon}>
                  {activity.type === 'corrida' ? '🚗' : '📦'}
                </Text>
                <Text style={styles.activityType}>
                  {activity.type === 'corrida' ? 'Corrida' : 'Entrega'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(activity.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(activity.status) },
                  ]}
                >
                  {getStatusText(activity.status)}
                </Text>
              </View>
            </View>

            <View style={styles.activityRoute}>
              <View style={styles.routePoint}>
                <View style={styles.originDot} />
                <View style={styles.routeLine} />
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.routeInfo}>
                <View style={styles.routeItem}>
                  <Text style={styles.routeLabel}>Origem</Text>
                  <Text style={styles.routeText}>{activity.origin}</Text>
                </View>
                <View style={styles.routeItem}>
                  <Text style={styles.routeLabel}>Destino</Text>
                  <Text style={styles.routeText}>{activity.destination}</Text>
                </View>
              </View>
            </View>

            <View style={styles.activityFooter}>
              <Text style={styles.activityDate}>{activity.date}</Text>
              <Text style={styles.activityValue}>
                R$ {activity.value.toFixed(2)}
              </Text>
            </View>

            {activity.driver && (
              <Text style={styles.driverName}>Motorista: {activity.driver}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  activityCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityTypeIcon: {
    fontSize: 20,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityRoute: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  routePoint: {
    alignItems: 'center',
    marginRight: 12,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 4,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
  },
  routeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeItem: {
    marginBottom: 8,
  },
  routeLabel: {
    fontSize: 12,
    color: COLORS.grayDark,
    marginBottom: 2,
  },
  routeText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  activityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  driverName: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
  },
});





