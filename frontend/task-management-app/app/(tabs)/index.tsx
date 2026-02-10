import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import type { TaskGroup } from '@/store/taskStore';

// ── Circular Progress ──────────────────────────────────────────────────────
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  textColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = '#fff',
  textColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const labelColor = textColor ?? color;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="rgba(255,255,255,0.2)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.circleLabel}>
          <Text style={[styles.circleLabelText, { color: labelColor, fontSize: size * 0.2 }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
};

// ── Colour palette for task-group / project cards ──────────────────────────
const CARD_PALETTES = [
  { bg: '#FCE7F3', accent: '#EC4899' },
  { bg: '#EDE9FE', accent: '#7C3AED' },
  { bg: '#FFEDD5', accent: '#F97316' },
  { bg: '#D1FAE5', accent: '#10B981' },
  { bg: '#DBEAFE', accent: '#3B82F6' },
];

/** Returns a stable colour palette based on any string ID */
const paletteFor = (id?: string) => {
  const idx = id
    ? Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
      CARD_PALETTES.length
    : 0;
  return CARD_PALETTES[idx];
};

// ── Screen ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const {
    tasks,
    projects,
    taskGroups,
    fetchTasks,
    fetchProjects,
    fetchTaskGroups,
    loadFromStorage,
    isLoading,
  } = useTaskStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFromStorage();
    fetchTasks();
    fetchProjects();
    fetchTaskGroups();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTasks(), fetchProjects(), fetchTaskGroups()]);
    setRefreshing(false);
  };

  // ── Derived data ───────────────────────────────────────────────────────
  const todayProgress = (() => {
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => t.status === 'Completed' || t.isCompleted).length;
    return Math.round((done / tasks.length) * 100);
  })();

  const inProgressTasks = tasks
    .filter((t) => t.status === 'In Progress')
    .slice(0, 2);

  /** Completion % for a task group based on its tasks */
  const groupProgress = (group: TaskGroup) => {
    const groupTasks = tasks.filter(
      (t) => t.parent?.id === group.id && t.parent?.type === 'TaskGroup'
    );
    if (!groupTasks.length) return group.completionPercentage ?? 0;
    const done = groupTasks.filter((t) => t.status === 'Completed' || t.isCompleted).length;
    return Math.round((done / groupTasks.length) * 100);
  };

  /** Task count for a project from local tasks */
  const projectTaskCount = (projectId: string) =>
    tasks.filter(
      (t) => t.parent?.id === projectId && t.parent?.type === 'Project'
    ).length;

  /** Completion % for a project */
  const projectProgress = (projectId: string) => {
    const pt = tasks.filter(
      (t) => t.parent?.id === projectId && t.parent?.type === 'Project'
    );
    if (!pt.length) return 0;
    const done = pt.filter((t) => t.status === 'Completed' || t.isCompleted).length;
    return Math.round((done / pt.length) * 100);
  };

  // ── Loading splash ─────────────────────────────────────────────────────
  if (isLoading && !tasks.length && !projects.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading…
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0).toUpperCase() ?? 'U'}
              </Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Hello!
              </Text>
              <Text style={[styles.username, { color: colors.textPrimary }]}>
                {user?.username ?? 'User'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellWrap}>
            <Text style={styles.bellEmoji}>🔔</Text>
            <View style={[styles.bellDot, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>

        {/* ── Progress card ───────────────────────────────────────── */}
        <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
          {/* Left column */}
          <View style={styles.progressLeft}>
            <Text style={styles.progressSub}>Your today&apos;s task</Text>
            <Text style={styles.progressTitle}>
              {todayProgress === 100 ? 'All done! 🎉' : 'almost done!'}
            </Text>
            <TouchableOpacity
              style={styles.viewTaskBtn}
              onPress={() => router.push('/(tabs)/tasks')}
              activeOpacity={0.8}
            >
              <Text style={[styles.viewTaskText, { color: colors.primary }]}>
                View Task
              </Text>
            </TouchableOpacity>
          </View>
          {/* Right column — circular ring */}
          <CircularProgress
            percentage={todayProgress}
            size={88}
            strokeWidth={9}
            color="#fff"
            textColor="#fff"
          />
        </View>

        {/* ── In Progress ─────────────────────────────────────────── */}
        {inProgressTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                In Progress
              </Text>
              <View style={[styles.badge, { backgroundColor: colors.border }]}>
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                  {inProgressTasks.length}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {inProgressTasks.map((task) => {
                const project = projects.find(
                  (p) => p.id === task.parent?.id
                );
                const palette = paletteFor(project?.taskGroup);
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.inProgressCard,
                      { backgroundColor: colors.cardBackground },
                    ]}
                    onPress={() => router.push(`/task/${task.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.inProgressMeta}>
                      <View
                        style={[
                          styles.inProgressIcon,
                          { backgroundColor: palette.bg },
                        ]}
                      >
                        <Text>{project?.logo ?? '📋'}</Text>
                      </View>
                      <Text
                        style={[styles.inProgressProject, { color: colors.textSecondary }]}
                      >
                        {project?.name ?? 'No Project'}
                      </Text>
                    </View>
                    <Text
                      style={[styles.inProgressTitle, { color: colors.textPrimary }]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>
                    {/* Progress bar derived from task completion flag */}
                    <View
                      style={[styles.progressBarTrack, { backgroundColor: colors.border }]}
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: task.isCompleted ? '100%' : '40%',
                            backgroundColor: palette.accent,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── Task Groups ─────────────────────────────────────────── */}
        {taskGroups.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Task Groups
              </Text>
              <View style={[styles.badge, { backgroundColor: colors.border }]}>
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                  {taskGroups.length}
                </Text>
              </View>
            </View>

            {taskGroups.map((group) => {
              const palette = paletteFor(group.id);
              const pct = groupProgress(group);
              const count = group.taskCount ?? 0;

              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupRow,
                    { backgroundColor: colors.cardBackground },
                  ]}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.groupIconWrap,
                      { backgroundColor: palette.bg },
                    ]}
                  >
                    <Text style={styles.groupIconEmoji}>
                      {group.icon ?? '📋'}
                    </Text>
                  </View>
                  <View style={styles.groupInfo}>
                    <Text
                      style={[styles.groupName, { color: colors.textPrimary }]}
                    >
                      {group.name}
                    </Text>
                    <Text
                      style={[styles.groupCount, { color: colors.textSecondary }]}
                    >
                      {count} Task{count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <CircularProgress
                    percentage={pct}
                    size={52}
                    strokeWidth={5}
                    color={palette.accent}
                    textColor={palette.accent}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Projects ────────────────────────────────────────────── */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Projects
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.border }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                {projects.length}
              </Text>
            </View>
          </View>

          {projects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📁</Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No Projects Yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Tap + to create your first project
              </Text>
            </View>
          ) : (
            projects.map((project) => {
              const palette = paletteFor(project.taskGroup);
              const pct = projectProgress(project.id);
              const count = projectTaskCount(project.id);

              return (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.groupRow,
                    { backgroundColor: colors.cardBackground },
                  ]}
                  onPress={() => router.push(`/project/${project.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.groupIconWrap,
                      { backgroundColor: palette.bg },
                    ]}
                  >
                    <Text style={styles.groupIconEmoji}>
                      {project.logo ?? '📋'}
                    </Text>
                  </View>
                  <View style={styles.groupInfo}>
                    <Text
                      style={[styles.groupName, { color: colors.textPrimary }]}
                    >
                      {project.name}
                    </Text>
                    <Text
                      style={[styles.groupCount, { color: colors.textSecondary }]}
                    >
                      {count} Task{count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <CircularProgress
                    percentage={pct}
                    size={52}
                    strokeWidth={5}
                    color={palette.accent}
                    textColor={palette.accent}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ── FAB ───────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-project')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  greeting: { fontSize: 12 },
  username: { fontSize: 18, fontWeight: '700' },
  bellWrap: { position: 'relative' },
  bellEmoji: { fontSize: 24 },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Progress card
  progressCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLeft: { flex: 1, marginRight: 12 },
  progressSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 },
  progressTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  viewTaskBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  viewTaskText: { fontWeight: '600', fontSize: 13 },

  // Circular label
  circleLabel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circleLabelText: { fontWeight: '700' },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },

  // In Progress cards (horizontal scroll)
  inProgressCard: {
    width: 200,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
  },
  inProgressMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  inProgressIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inProgressProject: { fontSize: 12 },
  inProgressTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  progressBarTrack: { width: '100%', height: 4, borderRadius: 2 },
  progressBarFill: { height: 4, borderRadius: 2 },

  // Task group / Project rows
  groupRow: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  groupIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupIconEmoji: { fontSize: 22 },
  groupInfo: { flex: 1 },
  groupName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  groupCount: { fontSize: 12 },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});