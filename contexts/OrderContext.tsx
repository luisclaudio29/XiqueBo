/**
 * Estado Global do Pedido (Corrida/Entrega)
 * Gerencia todo o fluxo de ponta a ponta
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ===========================
// TYPES
// ===========================

export type ServiceMode = 'corrida' | 'entrega';

export type RideCategory = 'moto' | 'mototaxi' | 'carro' | 'expresso';
export type DeliveryCategory = 'bicicleta' | 'moto' | 'carro' | 'expresso';

export type ExpressoSubtype = 'urbano' | 'mudanca_animais' | null;

export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';

export type OrderStatus = 
  | 'selecting_category'
  | 'selecting_origin'
  | 'selecting_destination'
  | 'adding_details'
  | 'selecting_payment'
  | 'reviewing'
  | 'matching'
  | 'driver_coming'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  label?: string; // "Casa", "Trabalho", etc
}

export interface RouteEstimate {
  distance: number; // km
  duration: number; // minutos
  basePrice: number;
  finalPrice: number;
  polyline?: string;
}

export interface RideExtras {
  hasPet: boolean;
  hasLuggage: boolean;
  hasShopping: boolean;
  needsPIN: boolean;
  pin?: string;
}

export interface DeliveryDetails {
  description: string; // obrigatório
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  photos?: string[];
  hasFurniture?: boolean;
  hasAppliances?: boolean;
  animals?: ('boi' | 'cavalo' | 'bode' | 'cabra' | 'ovelha')[];
}

export interface Driver {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  totalTrips: number;
  phone: string;
  location?: Location;
}

export interface Client {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  totalTrips: number;
  phone: string;
}

export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  category: string;
}

export interface Order {
  id: string;
  mode: ServiceMode;
  category: RideCategory | DeliveryCategory;
  expressoSubtype?: ExpressoSubtype;
  origin?: Location;
  destination?: Location;
  stops?: Location[];
  estimate?: RouteEstimate;
  rideExtras?: RideExtras;
  deliveryDetails?: DeliveryDetails;
  observations?: string;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
  discount?: number;
  status: OrderStatus;
  driver?: Driver;
  vehicle?: Vehicle;
  client?: Client; // Dados do cliente (para motorista ver)
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Avaliações
  clientRating?: number; // Cliente avalia motorista
  clientComment?: string;
  driverRating?: number; // Motorista avalia cliente
  driverComment?: string;
}

interface OrderContextData {
  order: Order | null;
  
  // Inicializar novo pedido
  startOrder: (mode: ServiceMode) => void;
  
  // Selecionar categoria
  selectCategory: (category: RideCategory | DeliveryCategory, subtype?: ExpressoSubtype) => void;
  
  // Definir localizações
  setOrigin: (location: Location) => void;
  setDestination: (location: Location) => void;
  addStop: (location: Location) => void;
  
  // Calcular rota
  calculateRoute: () => Promise<void>;
  
  // Adicionar detalhes
  setRideExtras: (extras: RideExtras) => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  setObservations: (text: string) => void;
  
  // Pagamento
  setPaymentMethod: (method: PaymentMethod) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  
  // Confirmar pedido
  confirmOrder: () => Promise<void>;
  
  // Matching
  searchDriver: () => Promise<boolean>;
  
  // Atualizar status
  updateStatus: (status: OrderStatus) => void;
  
  // Ações do motorista
  assignDriver: (driver: Driver, vehicle: Vehicle) => void;
  
  // Cancelar
  cancelOrder: (reason?: string) => void;
  
  // Finalizar
  completeOrder: (clientRating: number, clientComment?: string, driverRating?: number, driverComment?: string) => void;
  
  // Validações
  canProceed: () => boolean;
  getValidationErrors: () => string[];
}

const OrderContext = createContext<OrderContextData>({} as OrderContextData);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null);

  // ===========================
  // INICIALIZAR
  // ===========================
  const startOrder = (mode: ServiceMode) => {
    // Mock: dados do cliente
    const mockClient: Client = {
      id: 'CLI-001',
      name: 'Andreia Bastos',
      rating: 4.8,
      totalTrips: 45,
      phone: '71982633972',
    };

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      mode,
      category: mode === 'corrida' ? 'moto' : 'bicicleta',
      status: 'selecting_category',
      client: mockClient,
      createdAt: new Date(),
    };
    
    setOrder(newOrder);
    console.log('[OrderContext] Novo pedido iniciado:', newOrder.id, mode);
  };

  // ===========================
  // CATEGORIA
  // ===========================
  const selectCategory = (category: RideCategory | DeliveryCategory, subtype?: ExpressoSubtype) => {
    if (!order) return;
    
    setOrder({
      ...order,
      category,
      expressoSubtype: subtype,
      status: 'selecting_origin',
    });
    
    console.log('[OrderContext] Categoria selecionada:', category, subtype);
  };

  // ===========================
  // LOCALIZAÇÕES
  // ===========================
  const setOrigin = (location: Location) => {
    if (!order) return;
    
    setOrder({
      ...order,
      origin: location,
      status: 'selecting_destination',
    });
    
    console.log('[OrderContext] Origem definida:', location.address);
  };

  const setDestination = (location: Location) => {
    if (!order) return;
    
    setOrder({
      ...order,
      destination: location,
    });
    
    console.log('[OrderContext] Destino definido:', location.address);
  };

  const addStop = (location: Location) => {
    if (!order) return;
    
    const stops = order.stops || [];
    if (stops.length >= 1) {
      console.warn('[OrderContext] Máximo de 1 parada permitida');
      return;
    }
    
    setOrder({
      ...order,
      stops: [...stops, location],
    });
    
    console.log('[OrderContext] Parada adicionada:', location.address);
  };

  // ===========================
  // CALCULAR ROTA
  // ===========================
  const calculateRoute = async () => {
    if (!order?.origin || !order?.destination) {
      console.error('[OrderContext] Origem/destino não definidos');
      return;
    }

    console.log('[OrderContext] Calculando rota...');

    // Mock: cálculo simples baseado em coordenadas
    const distance = calculateDistance(
      order.origin.latitude,
      order.origin.longitude,
      order.destination.latitude,
      order.destination.longitude
    );

    const duration = Math.round(distance * 3); // ~3 min por km

    // Preços base por categoria
    const basePrices = {
      // Corrida
      moto: 5,
      mototaxi: 6,
      carro: 8,
      expresso: 10,
      // Entrega
      bicicleta: 4,
    };

    let basePrice = basePrices[order.category as keyof typeof basePrices] || 5;
    basePrice += distance * 2.5; // R$ 2,50 por km
    basePrice += duration * 0.5; // R$ 0,50 por min

    // Multiplicadores
    let multiplier = 1;
    if (order.category === 'expresso' && order.mode === 'corrida') {
      multiplier = 1.3;
    } else if (order.expressoSubtype === 'urbano') {
      multiplier = 1.4;
    } else if (order.expressoSubtype === 'mudanca_animais') {
      multiplier = 1.6;
    }

    const finalPrice = basePrice * multiplier;

    const estimate: RouteEstimate = {
      distance,
      duration,
      basePrice,
      finalPrice: Number(finalPrice.toFixed(2)),
    };

    setOrder({
      ...order,
      estimate,
      status: 'adding_details',
    });

    console.log('[OrderContext] Rota calculada:', estimate);
  };

  // ===========================
  // DETALHES
  // ===========================
  const setRideExtras = (extras: RideExtras) => {
    if (!order) return;
    setOrder({ ...order, rideExtras: extras });
    console.log('[OrderContext] Extras de corrida:', extras);
  };

  const setDeliveryDetails = (details: DeliveryDetails) => {
    if (!order) return;
    setOrder({ ...order, deliveryDetails: details });
    console.log('[OrderContext] Detalhes de entrega:', details);
  };

  const setObservations = (text: string) => {
    if (!order) return;
    setOrder({ ...order, observations: text });
  };

  // ===========================
  // PAGAMENTO
  // ===========================
  const setPaymentMethod = (method: PaymentMethod) => {
    if (!order) return;
    setOrder({ ...order, paymentMethod: method, status: 'reviewing' });
    console.log('[OrderContext] Forma de pagamento:', method);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!order) return false;

    // Mock: cupons válidos
    const validCoupons = {
      'PRIMEIRA': 0.12, // 12%
      'BEM-VINDO': 0.10, // 10%
      'XIQUE5': 5, // R$ 5 OFF
    };

    const discount = validCoupons[code as keyof typeof validCoupons];
    
    if (discount) {
      setOrder({
        ...order,
        couponCode: code,
        discount: typeof discount === 'number' && discount < 1 ? discount : undefined,
      });
      console.log('[OrderContext] Cupom aplicado:', code, discount);
      return true;
    }

    console.log('[OrderContext] Cupom inválido:', code);
    return false;
  };

  // ===========================
  // CONFIRMAR
  // ===========================
  const confirmOrder = async () => {
    if (!order) return;

    const errors = getValidationErrors();
    if (errors.length > 0) {
      console.error('[OrderContext] Validação falhou:', errors);
      throw new Error(errors.join(', '));
    }

    setOrder({ ...order, status: 'matching' });
    console.log('[OrderContext] Pedido confirmado:', order.id);
  };

  // ===========================
  // MATCHING
  // ===========================
  const searchDriver = async (): Promise<boolean> => {
    if (!order) return false;

    console.log('[OrderContext] Buscando motorista/entregador...');

    // Simular busca (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock: 80% de chance de encontrar
    const found = Math.random() > 0.2;

    if (found) {
      const mockDriver: Driver = {
        id: `DRV-${Date.now()}`,
        name: 'João Silva',
        rating: 4.7,
        totalTrips: 128,
        phone: '71982633972',
      };

      const mockVehicle: Vehicle = {
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2019,
        color: 'Prata',
        plate: 'ABC1D23',
        category: order.category,
      };

      assignDriver(mockDriver, mockVehicle);
      console.log('[OrderContext] Motorista encontrado:', mockDriver.name);
    } else {
      console.log('[OrderContext] Nenhum motorista disponível');
    }

    return found;
  };

  // ===========================
  // ATUALIZAR STATUS
  // ===========================
  const updateStatus = (status: OrderStatus) => {
    if (!order) return;
    setOrder({ ...order, status });
    console.log('[OrderContext] Status atualizado:', status);
  };

  const assignDriver = (driver: Driver, vehicle: Vehicle) => {
    if (!order) return;
    
    setOrder({
      ...order,
      driver,
      vehicle,
      status: 'driver_coming',
      startedAt: new Date(),
    });
  };

  // ===========================
  // CANCELAR
  // ===========================
  const cancelOrder = (reason?: string) => {
    if (!order) return;
    
    setOrder({ ...order, status: 'cancelled' });
    console.log('[OrderContext] Pedido cancelado:', reason);
  };

  // ===========================
  // FINALIZAR
  // ===========================
  const completeOrder = (clientRating: number, clientComment?: string, driverRating?: number, driverComment?: string) => {
    if (!order) return;
    
    setOrder({
      ...order,
      status: 'completed',
      completedAt: new Date(),
      clientRating,
      clientComment,
      driverRating,
      driverComment,
    });
    
    console.log('[OrderContext] Pedido concluído. Avaliação cliente:', clientRating, clientComment);
    if (driverRating) {
      console.log('[OrderContext] Avaliação motorista sobre cliente:', driverRating, driverComment);
    }
  };

  // ===========================
  // VALIDAÇÕES
  // ===========================
  const canProceed = (): boolean => {
    return getValidationErrors().length === 0;
  };

  const getValidationErrors = (): string[] => {
    if (!order) return ['Nenhum pedido iniciado'];

    const errors: string[] = [];

    if (!order.category) errors.push('Selecione uma categoria');
    if (!order.origin) errors.push('Defina a origem');
    if (!order.destination) errors.push('Defina o destino');
    if (!order.paymentMethod) errors.push('Selecione forma de pagamento');
    
    if (order.mode === 'entrega' && !order.deliveryDetails?.description) {
      errors.push('Descreva o item a ser entregue');
    }

    return errors;
  };

  // ===========================
  // PROVIDER
  // ===========================
  return (
    <OrderContext.Provider
      value={{
        order,
        startOrder,
        selectCategory,
        setOrigin,
        setDestination,
        addStop,
        calculateRoute,
        setRideExtras,
        setDeliveryDetails,
        setObservations,
        setPaymentMethod,
        applyCoupon,
        confirmOrder,
        searchDriver,
        updateStatus,
        assignDriver,
        cancelOrder,
        completeOrder,
        canProceed,
        getValidationErrors,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}

// ===========================
// HELPER: Haversine
// ===========================
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

