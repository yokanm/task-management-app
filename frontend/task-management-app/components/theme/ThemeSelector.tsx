import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { THEME_SCHEMES } from '@/constants/theme';
import type { ThemeScheme, ThemeMode } from '@/store/themeStore';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * ThemeSelector
 * Bottom-sheet modal that lets users pick a colour scheme and light/dark mode.
 * Previously excluded 'purple' from the list even though it is the default theme.
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { colors, scheme, mode, setScheme, setMode } = useTheme();

  // All available themes — 'purple' is now included
  const themes: ThemeScheme[] = ['purple', 'nature', 'retro', 'ocean', 'blossom'];
  const modes: ThemeMode[] = ['light', 'dark'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Theme Settings
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ── Colour Scheme ──────────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
              Colour Scheme
            </Text>
            <View style={styles.grid}>
              {themes.map((themeKey) => {
                const themeName = THEME_SCHEMES[themeKey].name;
                const themeColor = THEME_SCHEMES[themeKey].light.primary;
                const isSelected = scheme === themeKey;

                return (
                  <TouchableOpacity
                    key={themeKey}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: isSelected
                          ? `${colors.primary}20`
                          : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setScheme(themeKey)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.swatch, { backgroundColor: themeColor }]}
                    />
                    <Text
                      style={[
                        styles.themeLabel,
                        {
                          color: isSelected
                            ? colors.primary
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {themeName}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary}
                        style={styles.check}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Light / Dark Mode ──────────────────────────────── */}
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textPrimary, marginTop: 24 },
              ]}
            >
              Appearance
            </Text>
            <View style={styles.row}>
              {modes.map((modeOption) => {
                const isSelected = mode === modeOption;
                const icon = modeOption === 'light' ? 'sunny' : 'moon';

                return (
                  <TouchableOpacity
                    key={modeOption}
                    style={[
                      styles.modeCard,
                      {
                        backgroundColor: isSelected
                          ? `${colors.primary}20`
                          : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setMode(modeOption)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={icon}
                      size={32}
                      color={isSelected ? colors.primary : colors.textSecondary}
                      style={{ marginBottom: 8 }}
                    />
                    <Text
                      style={[
                        styles.modeLabel,
                        {
                          color: isSelected
                            ? colors.primary
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary}
                        style={styles.check}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Live Preview ───────────────────────────────────── */}
            <View
              style={[
                styles.preview,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                style={[styles.previewHeading, { color: colors.textSecondary }]}
              >
                PREVIEW
              </Text>
              <View
                style={[
                  styles.previewText,
                  { backgroundColor: colors.inputBackground },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                  Sample text in {THEME_SCHEMES[scheme].name} theme
                </Text>
              </View>
              <View style={styles.row}>
                {(
                  [
                    { key: 'primary', label: 'Primary' },
                    { key: 'success', label: 'Success' },
                    { key: 'error', label: 'Error' },
                  ] as const
                ).map(({ key, label }) => (
                  <View
                    key={key}
                    style={[
                      styles.chip,
                      { backgroundColor: colors[key] },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  modeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  preview: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  previewHeading: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  previewText: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});