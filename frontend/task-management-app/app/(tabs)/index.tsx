import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuthStore } from '../../store/authStore';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

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
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
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
          subtitle: 'Light, Dark, or System',
          onPress: () => Alert.alert('Coming Soon', 'Theme settings'),
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
        {
          icon: 'document-text-outline',
          title: 'Terms & Privacy',
          subtitle: 'Legal information',
          onPress: () => Alert.alert('Coming Soon', 'Terms & Privacy'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color={Colors.warning} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="folder" size={32} color={Colors.primary} />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, item.color && { backgroundColor: item.color }]}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.color ? Colors.text.white : Colors.primary}
                    />
                  </View>
                  
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  
  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  editButton: {
    padding: Spacing.sm,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  
  // Menu
  menuSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.error,
  },
});