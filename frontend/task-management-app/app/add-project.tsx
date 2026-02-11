import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/useTheme';
import { useTaskStore } from '@/store/taskStore';

/**
 * AddProjectScreen
 * Matches the "Add Project" screen in the design:
 *   • Task Group selector (picks an existing TaskGroup by name)
 *   • Project Name
 *   • Description
 *   • Start Date / End Date
 *   • Logo URL (optional)
 *   • "Add Project" CTA button
 */
export default function AddProjectScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    createProject,
    fetchTaskGroups,
    createTaskGroup,
    taskGroups,
    isLoading,
  } = useTaskStore();

  // ── Form state ────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from today
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  // ── Load task groups ──────────────────────────────────────────────────
  useEffect(() => {
    fetchTaskGroups();
  }, [fetchTaskGroups]);

  // ── Helpers ───────────────────────────────────────────────────────────
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    const result = await createTaskGroup({
      name: newGroupName.trim(),
      icon: '📋',
      color: '#6C5DD3',
    });
    if (result.success && result.data) {
      setSelectedGroupId(result.data.id);
      setShowNewGroupInput(false);
      setNewGroupName('');
    } else {
      Alert.alert('Error', result.error || 'Failed to create group');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a project name');
      return;
    }
    if (endDate <= startDate) {
      Alert.alert('Validation Error', 'End date must be after start date');
      return;
    }

    const projectData: any = {
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      color: '#6C5DD3',
      ...(logoUrl.trim() && { logo: logoUrl.trim() }),
      ...(selectedGroupId && { taskGroup: selectedGroupId }),
    };

    const result = await createProject(projectData);

    if (result.success) {
      Alert.alert('Success', 'Project created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to create project');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.backArrow, { color: colors.textPrimary }]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Add Project
          </Text>
          <TouchableOpacity>
            <Text style={styles.bell}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* ── Task Group ───────────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Task Group
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupScroll}
          >
            {taskGroups.map((group) => {
              const isSelected = selectedGroupId === group.id;
              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupChip,
                    {
                      backgroundColor: isSelected
                        ? `${colors.primary}15`
                        : colors.inputBackground,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedGroupId(group.id)}
                  activeOpacity={0.7}
                >
                  {group.icon ? (
                    <Text style={styles.groupIcon}>{group.icon}</Text>
                  ) : null}
                  <Text
                    style={[
                      styles.groupName,
                      {
                        color: isSelected
                          ? colors.primary
                          : colors.textPrimary,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Add new group inline */}
            <TouchableOpacity
              style={[
                styles.groupChip,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  borderStyle: 'dashed',
                },
              ]}
              onPress={() => setShowNewGroupInput(true)}
              activeOpacity={0.7}
            >
              <Text style={{ color: colors.primary, fontSize: 18 }}>+</Text>
              <Text style={[styles.groupName, { color: colors.primary }]}>
                New Group
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {showNewGroupInput && (
            <View style={styles.newGroupRow}>
              <TextInput
                style={[
                  styles.newGroupInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Group name"
                placeholderTextColor={colors.placeholderText}
                value={newGroupName}
                onChangeText={setNewGroupName}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.newGroupBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreateGroup}
              >
                <Text style={styles.newGroupBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.newGroupBtn,
                  {
                    backgroundColor: colors.cardBackground,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setShowNewGroupInput(false);
                  setNewGroupName('');
                }}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Project Name ─────────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Project Name
          </Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="e.g. Grocery Shopping App"
            placeholderTextColor={colors.placeholderText}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ── Description ──────────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Description
          </Text>
          <TextInput
            style={[styles.textArea, { color: colors.textPrimary }]}
            placeholder="What is this project about?"
            placeholderTextColor={colors.placeholderText}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* ── Start Date ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.card, styles.dateRow, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.dateIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={styles.dateEmoji}>📅</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              Start Date
            </Text>
            <Text style={[styles.dateValue, { color: colors.textPrimary }]}>
              {formatDate(startDate)}
            </Text>
          </View>
          <Text style={{ color: colors.primary, fontSize: 18 }}>▾</Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(_, date) => {
              setShowStartPicker(Platform.OS === 'ios');
              if (date) setStartDate(date);
            }}
          />
        )}

        {/* ── End Date ─────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.card, styles.dateRow, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.dateIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={styles.dateEmoji}>📅</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              End Date
            </Text>
            <Text style={[styles.dateValue, { color: colors.textPrimary }]}>
              {formatDate(endDate)}
            </Text>
          </View>
          <Text style={{ color: colors.primary, fontSize: 18 }}>▾</Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={startDate}
            onChange={(_, date) => {
              setShowEndPicker(Platform.OS === 'ios');
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* ── Logo URL (optional) ───────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Logo URL (optional)
          </Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="https://example.com/logo.png"
            placeholderTextColor={colors.placeholderText}
            value={logoUrl}
            onChangeText={setLogoUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        {/* Bottom spacer so content isn't hidden behind FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Add Project Button ──────────────────────────────────────── */}
      <View
        style={[styles.footer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Add Project</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 24,
  },
  backArrow: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  bell: { fontSize: 22 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 4,
  },
  textArea: {
    fontSize: 14,
    minHeight: 80,
    lineHeight: 22,
  },
  groupScroll: { marginTop: 4 },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    gap: 6,
  },
  groupIcon: { fontSize: 16 },
  groupName: { fontSize: 13 },
  newGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  newGroupInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  newGroupBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGroupBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateEmoji: { fontSize: 22 },
  dateInfo: { flex: 1 },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5DD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});