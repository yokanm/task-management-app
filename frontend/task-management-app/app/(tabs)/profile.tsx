import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { ThemeSelector } from '../../components/theme/ThemeSelector';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: '👤', onPress: () => {} },
        { label: 'Email', icon: '📧', value: user?.email },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          label: 'Theme', 
          icon: '🎨', 
          onPress: () => setShowThemeSelector(true) 
        },
        { label: 'Notifications', icon: '🔔', onPress: () => {} },
      ],
    },
    {
      title: 'About',
      items: [
        { label: 'Version', icon: 'ℹ️', value: '1.0.0' },
        { label: 'Privacy Policy', icon: '🔒', onPress: () => {} },
      ],
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-2.5 pb-5">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Settings
          </Text>
        </View>

        {/* User Info Card */}
        <View className="rounded-2xl p-5 mb-6 shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-row items-center gap-4">
            <View 
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {user?.username || 'User'}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-xs font-semibold mb-3 uppercase" style={{ color: colors.textSecondary }}>
              {section.title}
            </Text>
            <View className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity
                    className="flex-row items-center justify-between p-4"
                    onPress={item.onPress}
                    disabled={!item.onPress}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-xl">{item.icon}</Text>
                      <Text className="text-base" style={{ color: colors.textPrimary }}>
                        {item.label}
                      </Text>
                    </View>
                    {item.value && (
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        {item.value}
                      </Text>
                    )}
                    {item.onPress && (
                      <Text className="text-lg ml-2" style={{ color: colors.textSecondary }}>
                        ›
                      </Text>
                    )}
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && (
                    <View className="h-px ml-14" style={{ backgroundColor: colors.border }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          className="rounded-2xl py-4 items-center mb-8"
          style={{ backgroundColor: colors.error + '20' }}
          onPress={handleLogout}
        >
          <Text className="text-base font-semibold" style={{ color: colors.error }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </View>
  );
}