// Theme Configuration with Light and Dark modes for each color scheme

export const THEME_SCHEMES = {
  nature: {
    name: 'Nature',
    light: {
      primary: "#4CAF50",
      textPrimary: "#2e5a2e",
      textSecondary: "#688f68",
      textDark: "#1b361b",
      placeholderText: "#767676",
      background: "#e8f5e9",
      cardBackground: "#f1f8f2",
      inputBackground: "#f4faf5",
      border: "#c8e6c9",
      white: "#ffffff",
      black: "#000000",
      success: "#4CAF50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196F3",
    },
    dark: {
      primary: "#66BB6A",
      textPrimary: "#c8e6c9",
      textSecondary: "#a5d6a7",
      textDark: "#e8f5e9",
      placeholderText: "#9e9e9e",
      background: "#1b5e20",
      cardBackground: "#2e7d32",
      inputBackground: "#388e3c",
      border: "#4caf50",
      white: "#000000",
      black: "#ffffff",
      success: "#66BB6A",
      error: "#ef5350",
      warning: "#ffa726",
      info: "#42a5f5",
    }
  },
  
  retro: {
    name: 'Retro',
    light: {
      primary: "#e17055",
      textPrimary: "#784e2d",
      textSecondary: "#a58e7c",
      textDark: "#50372a",
      placeholderText: "#767676",
      background: "#ede1d1",
      cardBackground: "#faf5eb",
      inputBackground: "#f7f2ea",
      border: "#e2d6c1",
      white: "#ffffff",
      black: "#000000",
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    },
    dark: {
      primary: "#ff8a65",
      textPrimary: "#fbe9e7",
      textSecondary: "#ffccbc",
      textDark: "#fff3e0",
      placeholderText: "#9e9e9e",
      background: "#4e342e",
      cardBackground: "#5d4037",
      inputBackground: "#6d4c41",
      border: "#8d6e63",
      white: "#000000",
      black: "#ffffff",
      success: "#2ecc71",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    }
  },
  
  ocean: {
    name: 'Ocean',
    light: {
      primary: "#1976D2",
      textPrimary: "#1a4971",
      textSecondary: "#6d93b8",
      textDark: "#0d2b43",
      placeholderText: "#767676",
      background: "#e3f2fd",
      cardBackground: "#f5f9ff",
      inputBackground: "#f0f8ff",
      border: "#bbdefb",
      white: "#ffffff",
      black: "#000000",
      success: "#4CAF50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196F3",
    },
    dark: {
      primary: "#42a5f5",
      textPrimary: "#e3f2fd",
      textSecondary: "#90caf9",
      textDark: "#bbdefb",
      placeholderText: "#9e9e9e",
      background: "#0d47a1",
      cardBackground: "#1565c0",
      inputBackground: "#1976d2",
      border: "#1e88e5",
      white: "#000000",
      black: "#ffffff",
      success: "#66BB6A",
      error: "#ef5350",
      warning: "#ffa726",
      info: "#42a5f5",
    }
  },
  
  blossom: {
    name: 'Blossom',
    light: {
      primary: "#EC407A",
      textPrimary: "#7d2150",
      textSecondary: "#b06a8f",
      textDark: "#5a1836",
      placeholderText: "#767676",
      background: "#fce4ec",
      cardBackground: "#fff5f8",
      inputBackground: "#fef8fa",
      border: "#f8bbd0",
      white: "#ffffff",
      black: "#000000",
      success: "#4CAF50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196F3",
    },
    dark: {
      primary: "#f06292",
      textPrimary: "#fce4ec",
      textSecondary: "#f8bbd0",
      textDark: "#f48fb1",
      placeholderText: "#9e9e9e",
      background: "#880e4f",
      cardBackground: "#ad1457",
      inputBackground: "#c2185b",
      border: "#d81b60",
      white: "#000000",
      black: "#ffffff",
      success: "#66BB6A",
      error: "#ef5350",
      warning: "#ffa726",
      info: "#42a5f5",
    }
  }
};

export const DEFAULT_THEME = 'nature';
export const DEFAULT_MODE = 'light';

// Typography
export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Layout
export const Layout = {
  screenPadding: Spacing.lg,
  containerMaxWidth: 600,
};

// Task Group Colors (compatible with all themes)
export const TaskGroupColors = {
  office: '#FF6B9D',
  personal: '#5B67CA',
  study: '#FFA726',
  other: '#4CAF50',
};