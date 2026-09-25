import {moderateScale, scale} from 'react-native-size-matters';

export const colors = {
  background: '#F2F3F5',
  surface: '#FFFFFF',
  surfaceMuted: '#EBECEF',
  border: '#E4E5E9',
  borderSubtle: '#F0F1F3',
  text: '#111318',
  textSecondary: '#5A616C',
  textMuted: '#9096A1',
  primary: '#2B6DE8',
  primaryPressed: '#1F56C4',
  primarySoft: '#EAF1FD',
  success: '#1F8A55',
  successSoft: '#E7F6EE',
  danger: '#D14343',
  dangerSoft: '#FCEBEB',
  overlay: 'rgba(17, 19, 24, 0.4)',
  accentRing: '#D6E4FC',
};

export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  xxl: moderateScale(32),
};

export const radius = {
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  full: 999,
};

export const shadows = {
  card: {
    shadowColor: '#111318',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  raised: {
    shadowColor: '#111318',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  fab: {
    shadowColor: '#2B6DE8',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const typography = {
  hero: {
    fontSize: scale(28),
    fontWeight: '700' as const,
    lineHeight: scale(34),
    letterSpacing: -0.5,
  },
  title: {
    fontSize: scale(22),
    fontWeight: '700' as const,
    lineHeight: scale(28),
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: scale(17),
    fontWeight: '600' as const,
    lineHeight: scale(24),
    letterSpacing: -0.2,
  },
  body: {
    fontSize: scale(15),
    fontWeight: '400' as const,
    lineHeight: scale(22),
  },
  bodyStrong: {
    fontSize: scale(15),
    fontWeight: '600' as const,
    lineHeight: scale(22),
  },
  caption: {
    fontSize: scale(13),
    fontWeight: '500' as const,
    lineHeight: scale(18),
  },
  label: {
    fontSize: scale(12),
    fontWeight: '600' as const,
    lineHeight: scale(16),
    letterSpacing: 0.3,
  },
};
