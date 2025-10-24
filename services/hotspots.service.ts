/**
 * Serviço de Pontos de Interesse / Hotspots
 * Informa motoristas sobre locais com alta demanda
 */

export interface Hotspot {
  id: string;
  nome: string;
  tipo: 'escola' | 'restaurante' | 'evento' | 'festa' | 'bairro' | 'povoado' | 'hospital' | 'outro';
  localizacao: {
    latitude: number;
    longitude: number;
    endereco: string;
  };
  nivel: 'alto' | 'medio' | 'baixo'; // Nível de demanda
  icone: string;
  descricao: string;
  horarioPico?: string;
  diasAtivo?: string[];
  estimativaCorridas?: number;
  distanciaKm?: number;
}

export interface EventoSazonal {
  id: string;
  nome: string;
  tipo: 'enem' | 'regata' | 'vaquejada' | 'festa' | 'feira' | 'festejo' | 'outro';
  local: string;
  dataInicio: Date;
  dataFim: Date;
  horarios: string;
  povoado?: string;
  descricao: string;
  impacto: 'muito-alto' | 'alto' | 'medio';
  estimativaCorridas: number;
}

class HotspotsService {
  /**
   * Retorna hotspots ativos no momento
   */
  getHotspotsAtivos(horaAtual: number, diaAtual: number): Hotspot[] {
    const hotspots: Hotspot[] = [];

    // FEIRA LIVRE - Quarta e Sábado (6h-12h)
    if ((diaAtual === 3 || diaAtual === 6) && horaAtual >= 5 && horaAtual <= 12) {
      hotspots.push({
        id: 'feira-livre',
        nome: 'Feira Livre de Xique-Xique',
        tipo: 'feira',
        localizacao: {
          latitude: -10.8230,
          longitude: -42.7268,
          endereco: 'Centro - Praça da Feira',
        },
        nivel: 'muito-alto',
        icone: '🛒',
        descricao: 'FEIRA - Movimento intenso de feirantes e compradores',
        horarioPico: '6h-11h',
        diasAtivo: ['quarta', 'sábado'],
        estimativaCorridas: 120,
      });
    }

    // AVENIDA JJ SEABRA - Principal da cidade
    if (horaAtual >= 6 && horaAtual <= 22) {
      let nivelAvenida: 'alto' | 'medio' | 'baixo' = 'medio';
      let corridas = 25;
      
      // Picos na Av. JJ Seabra
      if ((horaAtual >= 6 && horaAtual <= 9) || (horaAtual >= 17 && horaAtual <= 19)) {
        nivelAvenida = 'alto';
        corridas = 45;
      }

      hotspots.push({
        id: 'av-jj-seabra',
        nome: 'Avenida JJ Seabra',
        tipo: 'outro',
        localizacao: {
          latitude: -10.8236,
          longitude: -42.7273,
          endereco: 'Av. JJ Seabra - Via Principal',
        },
        nivel: nivelAvenida,
        icone: '🛣️',
        descricao: 'Principal avenida da cidade - sempre movimentada',
        horarioPico: '7h-9h e 17h-19h',
        estimativaCorridas: corridas,
      });
    }

    // HORÁRIO MANHÃ (6h-9h) - Escolas
    if (horaAtual >= 6 && horaAtual <= 9) {
      hotspots.push(
        {
          id: 'colegio-estadual',
          nome: 'Colégio Estadual Luís Viana Filho',
          tipo: 'escola',
          localizacao: {
            latitude: -10.8242,
            longitude: -42.7265,
            endereco: 'Av. JJ Seabra, Centro',
          },
          nivel: 'alto',
          icone: '🏫',
          descricao: 'Entrada de estudantes - Ensino Médio',
          horarioPico: '6h30-7h30',
          estimativaCorridas: 42,
        },
        {
          id: 'escola-municipal-centro',
          nome: 'Escolas Municipais (Centro)',
          tipo: 'escola',
          localizacao: {
            latitude: -10.8238,
            longitude: -42.7270,
            endereco: 'Centro, Xique-Xique',
          },
          nivel: 'alto',
          icone: '🏫',
          descricao: 'Entrada de alunos',
          horarioPico: '6h45-7h30',
          estimativaCorridas: 35,
        }
      );
    }

    // HORÁRIO ALMOÇO (11h-14h) - Restaurantes e Centro
    if (horaAtual >= 11 && horaAtual <= 14) {
      hotspots.push(
        {
          id: 'centro-comercial',
          nome: 'Centro Comercial (Praça)',
          tipo: 'bairro',
          localizacao: {
            latitude: -10.8234,
            longitude: -42.7271,
            endereco: 'Praça Central, Centro',
          },
          nivel: 'muito-alto',
          icone: '🍽️',
          descricao: 'Horário de almoço - comércio e restaurantes',
          horarioPico: '11h30-13h30',
          estimativaCorridas: 55,
        },
        {
          id: 'restaurantes-jj-seabra',
          nome: 'Restaurantes - Av. JJ Seabra',
          tipo: 'restaurante',
          localizacao: {
            latitude: -10.8236,
            longitude: -42.7273,
            endereco: 'Av. JJ Seabra, Centro',
          },
          nivel: 'alto',
          icone: '🍴',
          descricao: 'Restaurantes da avenida principal',
          horarioPico: '12h-14h',
          estimativaCorridas: 38,
        },
        {
          id: 'prefeitura-camara',
          nome: 'Prefeitura / Câmara',
          tipo: 'outro',
          localizacao: {
            latitude: -10.8238,
            longitude: -42.7275,
            endereco: 'Centro Administrativo',
          },
          nivel: 'medio',
          icone: '🏛️',
          descricao: 'Saída de funcionários para almoço',
          horarioPico: '11h30-13h',
          estimativaCorridas: 22,
        }
      );
    }

    // TARDE (17h-19h) - Saída escolas, trabalho e comércio
    if (horaAtual >= 17 && horaAtual <= 19) {
      hotspots.push(
        {
          id: 'saida-escolas',
          nome: 'Região das Escolas',
          tipo: 'escola',
          localizacao: {
            latitude: -10.8240,
            longitude: -42.7268,
            endereco: 'Centro, Xique-Xique',
          },
          nivel: 'muito-alto',
          icone: '🏫',
          descricao: 'Saída de alunos - pico máximo de demanda',
          horarioPico: '17h-18h30',
          estimativaCorridas: 65,
        },
        {
          id: 'comercio-centro',
          nome: 'Comércio Centro (Av. JJ Seabra)',
          tipo: 'bairro',
          localizacao: {
            latitude: -10.8236,
            longitude: -42.7273,
            endereco: 'Av. JJ Seabra, Centro',
          },
          nivel: 'muito-alto',
          icone: '🏪',
          descricao: 'Fechamento do comércio - muito movimento',
          horarioPico: '17h30-19h',
          estimativaCorridas: 58,
        },
        {
          id: 'bancos-lotéricas',
          nome: 'Agências Bancárias / Lotéricas',
          tipo: 'outro',
          localizacao: {
            latitude: -10.8234,
            longitude: -42.7270,
            endereco: 'Centro',
          },
          nivel: 'alto',
          icone: '🏦',
          descricao: 'Horário final de pagamentos e saques',
          horarioPico: '15h-17h',
          estimativaCorridas: 32,
        }
      );
    }

    // RODOVIÁRIA - Dia todo com picos
    if (horaAtual >= 5 && horaAtual <= 22) {
      let nivelRodoviaria: 'alto' | 'medio' | 'baixo' = 'medio';
      let corridasRodoviaria = 18;
      
      // Picos: manhã cedo e tarde
      if ((horaAtual >= 5 && horaAtual <= 7) || (horaAtual >= 16 && horaAtual <= 18)) {
        nivelRodoviaria = 'alto';
        corridasRodoviaria = 35;
      }

      hotspots.push({
        id: 'rodoviaria',
        nome: 'Rodoviária de Xique-Xique',
        tipo: 'outro',
        localizacao: {
          latitude: -10.8228,
          longitude: -42.7285,
          endereco: 'Entrada da Cidade',
        },
        nivel: nivelRodoviaria,
        icone: '🚌',
        descricao: 'Chegada e saída de ônibus',
        horarioPico: '5h-7h e 16h-18h',
        estimativaCorridas: corridasRodoviaria,
      });
    }

    // ORLA DO RIO SÃO FRANCISCO - Lazer
    if (horaAtual >= 6 && horaAtual <= 21) {
      hotspots.push({
        id: 'orla-rio',
        nome: 'Orla do Rio São Francisco',
        tipo: 'outro',
        localizacao: {
          latitude: -10.8220,
          longitude: -42.7290,
          endereco: 'Beira do Rio',
        },
        nivel: horaAtual >= 17 ? 'alto' : 'medio',
        icone: '🌊',
        descricao: 'Área de lazer e pescadores',
        horarioPico: '17h-20h (fim de tarde)',
        estimativaCorridas: horaAtual >= 17 ? 28 : 12,
      });
    }

    // NOITE (19h-23h) - Lazer, festas, bares
    if (horaAtual >= 19 && horaAtual <= 23) {
      // Praça à noite
      hotspots.push({
        id: 'praca-noite',
        nome: 'Praça Central',
        tipo: 'bairro',
        localizacao: {
          latitude: -10.8234,
          longitude: -42.7271,
          endereco: 'Praça Central',
        },
        nivel: 'medio',
        icone: '🌃',
        descricao: 'Movimento noturno - jovens e famílias',
        horarioPico: '19h-22h',
        estimativaCorridas: 25,
      });

      // Sexta e Sábado - Bares e Festas
      if (diaAtual === 5 || diaAtual === 6) {
        hotspots.push({
          id: 'bares-jj-seabra',
          nome: 'Bares - Av. JJ Seabra',
          tipo: 'festa',
          localizacao: {
            latitude: -10.8236,
            longitude: -42.7273,
            endereco: 'Av. JJ Seabra',
          },
          nivel: 'muito-alto',
          icone: '🍺',
          descricao: 'Fim de semana - bares lotados',
          horarioPico: '20h-2h',
          estimativaCorridas: 75,
        });
      }
    }

    // SEMPRE ATIVO - Hospital
    hotspots.push({
      id: 'hospital',
      nome: 'Hospital Municipal de Xique-Xique',
      tipo: 'hospital',
      localizacao: {
        latitude: -10.8245,
        longitude: -42.7265,
        endereco: 'Centro',
      },
      nivel: 'medio',
      icone: '🏥',
      descricao: 'Emergências 24h - sempre com demanda',
      horarioPico: '24h',
      estimativaCorridas: 18,
    });

    // SEMPRE ATIVO - Igreja Matriz (eventos religiosos)
    if (diaAtual === 0 || (horaAtual >= 18 && horaAtual <= 20)) {
      hotspots.push({
        id: 'igreja-matriz',
        nome: 'Igreja Matriz',
        tipo: 'outro',
        localizacao: {
          latitude: -10.8235,
          longitude: -42.7272,
          endereco: 'Praça da Matriz, Centro',
        },
        nivel: diaAtual === 0 ? 'alto' : 'medio',
        icone: '⛪',
        descricao: diaAtual === 0 ? 'Domingo - Missas' : 'Cultos e eventos religiosos',
        horarioPico: diaAtual === 0 ? '8h-12h e 18h-20h' : '18h-20h',
        estimativaCorridas: diaAtual === 0 ? 42 : 18,
      });
    }

    return hotspots;
  }

  /**
   * Retorna eventos sazonais programados
   */
  getEventosSazonais(): EventoSazonal[] {
    const hoje = new Date();
    const eventos: EventoSazonal[] = [];

    // ENEM - Novembro
    if (hoje.getMonth() === 10) { // Novembro = mês 10
      eventos.push({
        id: 'enem-2025',
        nome: 'ENEM 2025',
        tipo: 'enem',
        local: 'Colégio Estadual - Centro',
        dataInicio: new Date(2025, 10, 5), // 5 de novembro
        dataFim: new Date(2025, 10, 12), // 12 de novembro
        horarios: '6h-8h (entrada) e 18h-20h (saída)',
        descricao: 'EXAME NACIONAL - Alta demanda de estudantes',
        impacto: 'muito-alto',
        estimativaCorridas: 150,
      });
    }

    // Regata de Marreca Velha - Janeiro
    if (hoje.getMonth() === 0) { // Janeiro
      eventos.push({
        id: 'regata-marreca-2025',
        nome: 'Regata de Marreca Velha',
        tipo: 'regata',
        local: 'Rio São Francisco - Marreca Velha',
        dataInicio: new Date(2025, 0, 15),
        dataFim: new Date(2025, 0, 17),
        horarios: '8h-18h',
        povoado: 'Marreca Velha',
        descricao: 'Evento anual - muitos turistas e moradores',
        impacto: 'muito-alto',
        estimativaCorridas: 200,
      });
    }

    // Vaquejada da Núvia - Julho
    if (hoje.getMonth() === 6) { // Julho
      eventos.push({
        id: 'vaquejada-nuvia-2025',
        nome: 'Vaquejada da Núvia',
        tipo: 'vaquejada',
        local: 'Parque de Vaquejada - Núvia',
        dataInicio: new Date(2025, 6, 20),
        dataFim: new Date(2025, 6, 23),
        horarios: '14h-23h',
        povoado: 'Núvia',
        descricao: 'Grande evento regional - muito movimento',
        impacto: 'muito-alto',
        estimativaCorridas: 180,
      });
    }

    // Festejo de São João - Junho
    if (hoje.getMonth() === 5) { // Junho
      eventos.push({
        id: 'sao-joao-2025',
        nome: 'Festejo de São João',
        tipo: 'festejo',
        local: 'Praça Central - Xique-Xique',
        dataInicio: new Date(2025, 5, 20),
        dataFim: new Date(2025, 5, 24),
        horarios: '18h-3h',
        descricao: 'Festas juninas - alta demanda noturna',
        impacto: 'muito-alto',
        estimativaCorridas: 220,
      });
    }

    // Feira Livre - Toda semana
    const diaSemana = hoje.getDay();
    if (diaSemana === 3 || diaSemana === 6) { // Quarta e Sábado
      eventos.push({
        id: 'feira-livre',
        nome: 'Feira Livre',
        tipo: 'feira',
        local: 'Centro - Xique-Xique',
        dataInicio: hoje,
        dataFim: hoje,
        horarios: '6h-12h',
        descricao: 'Dia de feira - muito movimento',
        impacto: 'alto',
        estimativaCorridas: 85,
      });
    }

    return eventos;
  }

  /**
   * Hotspots nos povoados
   */
  getHotspotsPovados(): Hotspot[] {
    return [
      {
        id: 'marreca-regata',
        nome: 'Marreca Velha - Área da Regata',
        tipo: 'povoado',
        localizacao: {
          latitude: -10.8234,
          longitude: -42.7189,
          endereco: 'Beira do Rio - Marreca Velha',
        },
        nivel: 'alto',
        icone: '🚤',
        descricao: 'Local da Regata Anual - Janeiro',
        horarioPico: 'Janeiro (todo o mês)',
        diasAtivo: ['todos'],
        estimativaCorridas: 45,
      },
      {
        id: 'nuvia-vaquejada',
        nome: 'Núvia - Parque de Vaquejada',
        tipo: 'povoado',
        localizacao: {
          latitude: -10.7923,
          longitude: -42.6845,
          endereco: 'Núvia',
        },
        nivel: 'muito-alto',
        icone: '🐂',
        descricao: 'Vaquejada - Julho (3 dias de evento)',
        horarioPico: 'Julho 20-23',
        estimativaCorridas: 60,
      },
      {
        id: 'vacaria-feira',
        nome: 'Vacaria - Dia de Feira',
        tipo: 'povoado',
        localizacao: {
          latitude: -10.7945,
          longitude: -42.7423,
          endereco: 'Centro - Vacaria',
        },
        nivel: 'medio',
        icone: '🛒',
        descricao: 'Feira semanal - Quinta-feira',
        horarioPico: 'Quinta 6h-12h',
        diasAtivo: ['quinta'],
        estimativaCorridas: 25,
      },
      {
        id: 'rumo-novo-festa',
        nome: 'Rumo Novo - Festa do Padroeiro',
        tipo: 'povoado',
        localizacao: {
          latitude: -10.8456,
          longitude: -42.6923,
          endereco: 'Praça - Rumo Novo',
        },
        nivel: 'alto',
        icone: '⛪',
        descricao: 'Festa Religiosa - Setembro',
        horarioPico: 'Setembro 8-10',
        estimativaCorridas: 35,
      },
    ];
  }

  /**
   * Analisa e retorna os TOP 5 hotspots do momento
   */
  getTop5Hotspots(): Hotspot[] {
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();

    const hotspots = this.getHotspotsAtivos(hora, dia);
    
    // Ordena por nível de demanda e número de corridas estimadas
    return hotspots
      .sort((a, b) => {
        const nivelA = a.nivel === 'muito-alto' ? 3 : a.nivel === 'alto' ? 2 : 1;
        const nivelB = b.nivel === 'muito-alto' ? 3 : b.nivel === 'alto' ? 2 : 1;
        
        if (nivelA !== nivelB) return nivelB - nivelA;
        return (b.estimativaCorridas || 0) - (a.estimativaCorridas || 0);
      })
      .slice(0, 5);
  }

  /**
   * Verifica se há eventos especiais hoje
   */
  hasEventosHoje(): boolean {
    return this.getEventosSazonais().length > 0;
  }

  /**
   * Retorna cor do nível de demanda
   */
  getCorNivel(nivel: 'muito-alto' | 'alto' | 'medio' | 'baixo'): string {
    switch (nivel) {
      case 'muito-alto': return '#FF0000'; // Vermelho
      case 'alto': return '#FF6B00'; // Laranja
      case 'medio': return '#FFA500'; // Amarelo
      case 'baixo': return '#4CAF50'; // Verde
      default: return '#9E9E9E';
    }
  }
}

export default new HotspotsService();

