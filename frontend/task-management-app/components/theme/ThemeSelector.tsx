import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { THEME_SCHEMES } from '../../constants/theme';
import type { ThemeScheme, ThemeMode } from '../../store/themeStore';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
  const { colors, scheme, mode, setScheme, setMode } = useTheme();

  const themes: ThemeScheme[] = ['nature', 'retro', 'ocean', 'blossom'];
  const modes: ThemeMode[] = ['light', 'dark'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View 
          className="rounded-t-3xl p-6 pb-8"
          style={{ backgroundColor: colors.background, maxHeight: '80%' }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Theme Settings
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Color Scheme */}
            <View className="mb-6">
              <Text className="text-base font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Color Scheme
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {themes.map((themeKey) => {
                  const themeName = THEME_SCHEMES[themeKey].name;
                  const themeColor = THEME_SCHEMES[themeKey].light.primary;
                  const isSelected = scheme === themeKey;

                  return (
                    <TouchableOpacity
                      key={themeKey}
                      className="flex-1 min-w-[45%] p-4 rounded-xl items-center border-2"
                      style={{
                        backgroundColor: isSelected ? colors.primary + '20' : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                      onPress={() => setScheme(themeKey)}
                    >
                      <View 
                        className="w-12 h-12 rounded-full mb-2"
                        style={{ backgroundColor: themeColor }}
                      />
                      <Text 
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? colors.primary : colors.textPrimary }}
                      >
                        {themeName}
                      </Text>
                      {isSelected && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={colors.primary}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Mode Selection */}
            <View className="mb-4">
              <Text className="text-base font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Appearance
              </Text>
              <View className="flex-row gap-3">
                {modes.map((modeOption) => {
                  const isSelected = mode === modeOption;
                  const icon = modeOption === 'light' ? 'sunny' : 'moon';

                  return (
                    <TouchableOpacity
                      key={modeOption}
                      className="flex-1 p-4 rounded-xl items-center border-2"
                      style={{
                        backgroundColor: isSelected ? colors.primary + '20' : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      }}
                      onPress={() => setMode(modeOption)}
                    >
                      <Ionicons 
                        name={icon} 
                        size={32} 
                        color={isSelected ? colors.primary : colors.textSecondary}
                        style={{ marginBottom: 8 }}
                      />
                      <Text 
                        className="text-sm font-semibold capitalize"
                        style={{ color: isSelected ? colors.primary : colors.textPrimary }}
                      >
                        {modeOption}
                      </Text>
                      {isSelected && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={colors.primary}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Preview */}
            <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
              <Text className="text-xs font-semibold mb-2" style={{ color: colors.textSecondary }}>
                PREVIEW
              </Text>
              <View className="p-3 rounded-lg mb-2" style={{ backgroundColor: colors.inputBackground }}>
                <Text className="text-sm" style={{ color: colors.textPrimary }}>
                  Sample text in {THEME_SCHEMES[scheme].name} theme
                </Text>
              </View>
              <View className="flex-row gap-2">
                <View 
                  className="flex-1 py-2 rounded-lg items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.white }}>
                    Primary
                  </Text>
                </View>
                <View 
                  className="flex-1 py-2 rounded-lg items-center"
                  style={{ backgroundColor: colors.success }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.white }}>
                    Success
                  </Text>
                </View>
                <View 
                  className="flex-1 py-2 rounded-lg items-center"
                  style={{ backgroundColor: colors.error }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.white }}>
                    Error
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};