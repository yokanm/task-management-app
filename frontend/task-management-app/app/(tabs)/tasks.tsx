import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTaskStore, type Task } from '@/store/taskStore';

type StatusFilter = 'All' | 'To do' | 'In Progress' | 'Completed';

const STATUS_FILTERS: StatusFilter[] = ['All', 'To do', 'In Progress', 'Completed'];

/** Label shown on badges — "Completed" → "Done" to match design */
const STATUS_DISPLAY: Record<string, string> = {
  'To do': 'To-do',
  'In Progress': 'In Progress',
  Completed: 'Done',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Completed:   { bg: '#10B98120', text: '#10B981' },
  'In Progress': { bg: '#F9730620', text: '#F97316' },
  'To do':     { bg: '#3B82F620', text: '#3B82F6' },
};

/** Stable colour for a task's project icon */
const CARD_PALETTES = [
  '#FCE7F3', '#EDE9FE', '#FFEDD5', '#D1FAE5', '#DBEAFE',
];
const bgFor = (id?: string) => {
  const idx = id
    ? Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
      CARD_PALETTES.length
    : 0;
  return CARD_PALETTES[idx];
};

/** Returns array of 5 dates centred on today */
const buildDateRange = () => {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - 2));
    return {
      date: d,
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 2,
    };
  });
};

/** Returns true if `task.dueDate` falls on the same calendar day as `date` */
const isOnDate = (task: Task, date: Date): boolean => {
  if (!task.dueDate) return false;
  const d = new Date(task.dueDate);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
};

export default function TasksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, projects, updateTask, loadFromStorage, fetchTasks, isLoading } =
    useTaskStore();

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');
  const [selectedDateIdx, setSelectedDateIdx] = useState(2); // today
  const [refreshing, setRefreshing] = useState(false);

  const dates = useMemo(() => buildDateRange(), []);

  useEffect(() => {
    loadFromStorage();
    fetchTasks();
  }, [fetchTasks, loadFromStorage]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  /** Filter tasks by both selected date and status tab */
  const getFilteredTasks = useCallback((): Task[] => {
    const selectedDate = dates[selectedDateIdx].date;

    let filtered = tasks;

    // Date filter: only tasks with a dueDate on the selected day are shown.
    // Tasks with no dueDate are shown when 'today' (index 2) is selected.
    filtered = filtered.filter((t) => {
      if (!t.dueDate) return selectedDateIdx === 2; // undated → show only on today
      return isOnDate(t, selectedDate);
    });

    if (activeFilter !== 'All') {
      filtered = filtered.filter((t) => t.status === activeFilter);
    }

    return filtered;
  }, [tasks, selectedDateIdx, activeFilter, dates]);

  /** Cycle task through To do → In Progress → Completed */
  const handleTaskPress = async (task: Task) => {
    const flow: Task['status'][] = ['To do', 'In Progress', 'Completed'];
    const next = flow[(flow.indexOf(task.status) + 1) % flow.length];

    const result = await updateTask(task.id, {
      status: next,
      isCompleted: next === 'Completed',
      completedAt:
        next === 'Completed' ? new Date().toISOString() : undefined,
    });

    if (!result.success) {
      Alert.alert('Error', result.error ?? 'Failed to update task');
    }
  };

  const filtered = getFilteredTasks();

  if (isLoading && tasks.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading tasks…
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
          {/* Tasks is a tab — we don't go "back". Show title only. */}
          <View style={{ width: 32 }} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Today&apos;s Tasks
          </Text>
          <TouchableOpacity style={styles.bellWrap}>
            <Text style={styles.bellEmoji}>🔔</Text>
            <View
              style={[styles.bellDot, { backgroundColor: colors.primary }]}
            />
          </TouchableOpacity>
        </View>

        {/* ── Date Selector ────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateScrollContent}
        >
          {dates.map((d, idx) => {
            const isSelected = selectedDateIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.datePill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.cardBackground,
                  },
                ]}
                onPress={() => setSelectedDateIdx(idx)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dateMonth,
                    {
                      color: isSelected
                        ? 'rgba(255,255,255,0.8)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {d.month}
                </Text>
                <Text
                  style={[
                    styles.dateDay,
                    { color: isSelected ? '#fff' : colors.textPrimary },
                  ]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[
                    styles.dateWeekday,
                    {
                      color: isSelected
                        ? 'rgba(255,255,255,0.8)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Status Filter Tabs ────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {STATUS_FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.cardBackground,
                  },
                ]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    {
                      color: isActive ? '#fff' : colors.textSecondary,
                    },
                  ]}
                >
                  {/* Show "Done" in the badge but keep the internal value as
                      "Completed" so it matches the backend enum */}
                  {f === 'Completed' ? 'Done' : f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Task List ─────────────────────────────────────────────── */}
        <View style={styles.taskList}>
          {filtered.map((task) => {
            const project = projects.find((p) => p.id === task.parent?.id);
            const statusColor =
              STATUS_COLORS[task.status] ?? {
                bg: colors.border,
                text: colors.textSecondary,
              };
            const cardBg = bgFor(project?.taskGroup);

            return (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: colors.cardBackground },
                ]}
                onPress={() => handleTaskPress(task)}
                activeOpacity={0.85}
              >
                {/* Top row */}
                <View style={styles.taskTop}>
                  <View style={styles.taskTopLeft}>
                    <Text
                      style={[styles.taskProject, { color: colors.textSecondary }]}
                    >
                      {project?.name ?? 'No Project'}
                    </Text>
                    <Text
                      style={[styles.taskTitle, { color: colors.textPrimary }]}
                    >
                      {task.title}
                    </Text>
                    {task.description ? (
                      <Text
                        style={[styles.taskDesc, { color: colors.textSecondary }]}
                        numberOfLines={2}
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={[styles.taskIconWrap, { backgroundColor: cardBg }]}
                  >
                    <Text>{project?.logo ?? '📋'}</Text>
                  </View>
                </View>

                {/* Bottom row */}
                <View style={styles.taskBottom}>
                  <View style={styles.taskMeta}>
                    {task.dueTime ? (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaEmoji}>🕐</Text>
                        <Text
                          style={[styles.metaText, { color: colors.primary }]}
                        >
                          {task.dueTime}
                        </Text>
                      </View>
                    ) : null}
                    {task.priority ? (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaEmoji}>
                          {task.priority === 'High'
                            ? '🔴'
                            : task.priority === 'Medium'
                            ? '🟡'
                            : '🟢'}
                        </Text>
                        <Text
                          style={[styles.metaText, { color: colors.textSecondary }]}
                        >
                          {task.priority}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Status badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusColor.text }]}
                    >
                      {STATUS_DISPLAY[task.status] ?? task.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>
                {activeFilter === 'Completed' ? '🎉' : '📋'}
              </Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {activeFilter === 'Completed'
                  ? 'No completed tasks yet'
                  : 'No tasks for this day'}
              </Text>
              <Text
                style={[styles.emptySub, { color: colors.textSecondary }]}
              >
                {activeFilter === 'All'
                  ? 'Tap + to add a task'
                  : `No tasks with status: ${activeFilter}`}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FAB ──────────────────────────────────────────────────── */}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  bellWrap: { position: 'relative' },
  bellEmoji: { fontSize: 22 },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  dateScroll: { marginBottom: 16 },
  dateScrollContent: { paddingVertical: 4, gap: 8 },
  datePill: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 68,
  },
  dateMonth: { fontSize: 10, marginBottom: 2 },
  dateDay: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  dateWeekday: { fontSize: 10 },

  filterScroll: { marginBottom: 20 },
  filterScrollContent: { gap: 8, paddingVertical: 2 },
  filterPill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterLabel: { fontSize: 13, fontWeight: '600' },

  taskList: {},
  taskCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  taskTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskTopLeft: { flex: 1 },
  taskProject: { fontSize: 11, marginBottom: 4 },
  taskTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  taskDesc: { fontSize: 12, lineHeight: 18 },
  taskIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  taskBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMeta: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaEmoji: { fontSize: 12 },
  metaText: { fontSize: 12 },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center' },

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