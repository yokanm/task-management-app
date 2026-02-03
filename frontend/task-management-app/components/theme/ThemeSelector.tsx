import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { THEME_SCHEMES, ThemeScheme, ThemeMode } from '../../store/themeStore';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
  const { colors, scheme, mode, setScheme, setMode } = useTheme();

  const themeSchemes: { key: ThemeScheme; name: string; icon: string; previewColor: string }[] = [
    { key: 'nature', name: 'Nature', icon: '🌿', previewColor: '#4CAF50' },
    { key: 'retro', name: 'Retro', icon: '🎨', previewColor: '#e17055' },
    { key: 'ocean', name: 'Ocean', icon: '🌊', previewColor: '#1976D2' },
    { key: 'blossom', name: 'Blossom', icon: '🌸', previewColor: '#EC407A' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity 
          className="flex-1" 
          activeOpacity={1} 
          onPress={onClose}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        
        {/* Modal Content */}
        <View 
          className="rounded-t-3xl p-6 max-h-3/4"
          style={{ backgroundColor: colors.cardBackground }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Choose Theme
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mode Toggle */}
            <View className="mb-6">
              <Text className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
                APPEARANCE
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center"
                  style={{
                    backgroundColor: mode === 'light' ? colors.primary : colors.inputBackground,
                    borderColor: mode === 'light' ? colors.primary : colors.border,
                  }}
                  onPress={() => setMode('light')}
                >
                  <Ionicons 
                    name="sunny" 
                    size={20} 
                    color={mode === 'light' ? colors.white : colors.textSecondary} 
                    style={{ marginRight: 8 }}
                  />
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: mode === 'light' ? colors.white : colors.textPrimary }}
                  >
                    Light
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center"
                  style={{
                    backgroundColor: mode === 'dark' ? colors.primary : colors.inputBackground,
                    borderColor: mode === 'dark' ? colors.primary : colors.border,
                  }}
                  onPress={() => setMode('dark')}
                >
                  <Ionicons 
                    name="moon" 
                    size={20} 
                    color={mode === 'dark' ? colors.white : colors.textSecondary}
                    style={{ marginRight: 8 }}
                  />
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: mode === 'dark' ? colors.white : colors.textPrimary }}
                  >
                    Dark
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Color Schemes */}
            <View>
              <Text className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
                COLOR SCHEME
              </Text>
              <View className="gap-3">
                {themeSchemes.map((themeScheme) => (
                  <TouchableOpacity
                    key={themeScheme.key}
                    className="p-4 rounded-xl border-2 flex-row items-center"
                    style={{
                      backgroundColor: scheme === themeScheme.key ? colors.primary + '20' : colors.inputBackground,
                      borderColor: scheme === themeScheme.key ? colors.primary : colors.border,
                    }}
                    onPress={() => setScheme(themeScheme.key)}
                  >
                    {/* Icon */}
                    <View 
                      className="w-12 h-12 rounded-xl justify-center items-center mr-4"
                      style={{ backgroundColor: themeScheme.previewColor }}
                    >
                      <Text className="text-2xl">{themeScheme.icon}</Text>
                    </View>

                    {/* Name */}
                    <View className="flex-1">
                      <Text 
                        className="text-lg font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {themeScheme.name}
                      </Text>
                    </View>

                    {/* Selected Check */}
                    {scheme === themeScheme.key && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View className="mt-6 p-4 rounded-xl" style={{ backgroundColor: colors.inputBackground }}>
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                PREVIEW
              </Text>
              <View className="flex-row gap-2">
                <View 
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                />
                <View 
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: colors.success }}
                />
                <View 
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: colors.warning }}
                />
                <View 
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: colors.error }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};