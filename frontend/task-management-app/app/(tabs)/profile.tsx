import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { ThemeSelector } from '../../components/theme/ThemeSelector';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, scheme, mode } = useTheme();
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
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const getThemeName = () => {
    const themes: any = {
      nature: 'Nature',
      retro: 'Retro',
      ocean: 'Ocean',
      blossom: 'Blossom',
    };
    return `${themes[scheme]} • ${mode === 'light' ? 'Light' : 'Dark'}`;
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: () => Alert.alert('Coming Soon', 'Edit Profile feature'),
        },
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          subtitle: 'Update your password',
          onPress: () => Alert.alert('Coming Soon', 'Change Password feature'),
        },
        {
          icon: 'notifications-outline',
          title: 'Notifications',
          subtitle: 'Manage notification preferences',
          onPress: () => Alert.alert('Coming Soon', 'Notifications settings'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'color-palette-outline',
          title: 'Theme',
          subtitle: getThemeName(),
          onPress: () => setShowThemeSelector(true),
          showBadge: true,
          badgeText: 'NEW',
        },
        {
          icon: 'language-outline',
          title: 'Language',
          subtitle: 'English',
          onPress: () => Alert.alert('Coming Soon', 'Language settings'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help or contact us',
          onPress: () => Alert.alert('Coming Soon', 'Help & Support'),
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'Version 1.0.0',
          onPress: () => Alert.alert('Task Manager', 'Version 1.0.0\n\n© 2026 Task Manager'),
        },
      ],
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-6 pt-12">
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Profile
        </Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pb-8" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View 
          className="flex-row items-center mx-6 mb-6 p-4 rounded-2xl shadow-sm"
          style={{ 
            backgroundColor: colors.cardBackground,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View 
            className="w-16 h-16 rounded-full justify-center items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-3xl font-bold" style={{ color: colors.white }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
              {user?.username || 'User'}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          
          <TouchableOpacity className="p-2">
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-6 mb-6 gap-2">
          <View 
            className="flex-1 p-4 rounded-xl items-center gap-1"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>24</Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>Completed</Text>
          </View>
          
          <View 
            className="flex-1 p-4 rounded-xl items-center gap-1"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Ionicons name="time" size={32} color={colors.warning} />
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>12</Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>In Progress</Text>
          </View>
          
          <View 
            className="flex-1 p-4 rounded-xl items-center gap-1"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Ionicons name="folder" size={32} color={colors.primary} />
            <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>8</Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>Projects</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="px-6 mb-6">
            <Text 
              className="text-sm font-semibold mb-2 uppercase"
              style={{ color: colors.textSecondary }}
            >
              {section.title}
            </Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                className="flex-row justify-between items-center p-4 rounded-xl mb-1"
                style={{ backgroundColor: colors.cardBackground }}
                onPress={item.onPress}
              >
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-10 h-10 rounded-full justify-center items-center mr-4"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                        {item.title}
                      </Text>
                      {item.showBadge && item.badgeText && (
                        <View 
                          className="px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-xs font-bold" style={{ color: colors.white }}>
                            {item.badgeText}
                          </Text>
                        </View>
                      )}
                    </View>
                    {item.subtitle && (
                      <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          className="flex-row items-center justify-center gap-2 mx-6 p-4 rounded-xl border"
          style={{ borderColor: colors.error }}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
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