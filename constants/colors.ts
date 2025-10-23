// Cores do tema XiqueGo baseadas no branding
export const COLORS = {
  primary: '#FFC529', // Amarelo principal
  primaryDark: '#E6A600',
  secondary: '#3D2817', // Marrom escuro
  secondaryLight: '#5C3D28',
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  text: '#333333',
  textLight: '#666666',
  textWhite: '#FFFFFF',
  error: '#DC2626',
  success: '#16A34A',
  gray: '#E5E7EB',
  grayDark: '#6B7280',
} as const;

export const THEME = {
  light: {
    background: COLORS.background,
    text: COLORS.text,
    textSecondary: COLORS.textLight,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    card: '#F9FAFB',
    border: COLORS.gray,
  },
  dark: {
    background: COLORS.backgroundDark,
    text: COLORS.textWhite,
    textSecondary: COLORS.grayDark,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    card: '#262626',
    border: '#404040',
  },
} as const;


