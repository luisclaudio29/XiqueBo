# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- Regra Cursor para documentação obrigatória (README e CHANGELOG)
- Regra Cursor para tratamento rigoroso de erros TypeScript
- Regra Cursor para implementação incremental e confirmação de escopo
- Regra Cursor para convenção de commits (feat:/fix:)

## [1.0.0] - 2024-10-24

### Added

#### Interface e Navegação
- Tela de Splash com animação
- Sistema de login (celular, e-mail, Facebook)
- Cadastro diferenciado para Cliente e Motorista
- Navegação com 4 tabs principais

#### Tela Inicial
- Input de origem e destino para solicitação de corridas
- 4 tipos de serviço (Comum, Expressa, Bagagem, Pets)
- 5 opções de extras personalizáveis
- Cálculo de estimativa de preço em tempo real
- Estimativa de distância e tempo de viagem
- Modal de confirmação completo
- Seleção de forma de pagamento
- Lista de locais recentes
- Botão de acesso rápido ao mapa

#### Mapa e Localização
- Componente de mapa interativo
- Sistema de permissões de localização
- Localização GPS em tempo real
- Marcadores personalizados no mapa
- Informações de cobertura regional (Xique-Xique e povoados)

#### Telas Secundárias
- Tela de Atividades (histórico de corridas)
- Tela de Perfil (dados pessoais editáveis)
- Tela de Menu (configurações e suporte)
- Estatísticas do usuário

#### Sistema de Preços
- Cálculo automático de preço por quilômetro (R$ 2,50/km)
- Multiplicadores por tipo de serviço (1.0x a 1.5x)
- Valores extras configuráveis
- Sistema de comissão (2%)
- Taxa de cancelamento (1%)
- Preço mínimo de R$ 5,00

#### Documentação
- README.md completo com todas as funcionalidades
- Guia de configuração do Google Maps
- Documentação de testes
- Estrutura de projeto documentada

### Technical

#### Stack
- React Native com Expo
- TypeScript para tipagem estática
- Expo Router para navegação file-based
- react-native-maps para mapas interativos
- expo-location para geolocalização

#### Arquitetura
- Estrutura baseada em componentes funcionais
- Separação de concerns (components, utils, constants)
- Sistema de cores centralizado
- Utilitários de cálculo de preços isolados

#### Qualidade de Código
- ESLint configurado
- TypeScript strict mode
- Componentes reutilizáveis
- Código modular e organizado

## [0.1.0] - 2024-10-01

### Added
- Estrutura inicial do projeto
- Configuração do Expo
- Setup do TypeScript
- Estrutura básica de pastas

