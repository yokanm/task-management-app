import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { tasksAPI } from '../../services/api';

type TaskStatus = 'All' | 'To do' | 'In Progress' | 'Completed';

export default function TodayTasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus>('All');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, selectedFilter]);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTodayTasks();
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterTasks = () => {
    if (selectedFilter === 'All') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task: any) => task.status === selectedFilter);
      setFilteredTasks(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return Colors.success;
      case 'In Progress':
        return Colors.warning;
      case 'To do':
        return Colors.text.secondary;
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#E8F5E9';
      case 'In Progress':
        return '#FFF3E0';
      case 'To do':
        return Colors.primaryLight;
      default:
        return Colors.background.secondary;
    }
  };

  const filters: TaskStatus[] = ['All', 'To do', 'In Progress', 'Completed'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Tasks</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}
      >
        {getWeekDates().map((date, index) => {
          const { month, day, dayName } = formatDate(date);
          const isSelected = isToday(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>
                {month}
              </Text>
              <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                {day}
              </Text>
              <Text style={[styles.dateDayName, isSelected && styles.dateTextSelected]}>
                {dayName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView
        style={styles.tasksList}
        contentContainerStyle={styles.tasksListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.text.disabled} />
            <Text style={styles.emptyStateText}>No tasks for today</Text>
          </View>
        ) : (
          filteredTasks.map((task: any) => (
            <TouchableOpacity key={task._id} style={styles.taskItem}>
              <View style={styles.taskLeft}>
                <View style={[styles.taskIcon, { backgroundColor: task.project?.color || Colors.taskGroups.office }]}>
                  <Ionicons name="briefcase" size={16} color={Colors.text.white} />
                </View>
                
                <View style={styles.taskInfo}>
                  <Text style={styles.taskProject}>{task.project?.name || 'No Project'}</Text>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.dueTime && (
                    <View style={styles.taskTime}>
                      <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                      <Text style={styles.taskTimeText}>{task.dueTime}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={[styles.taskStatus, { backgroundColor: getStatusBgColor(task.status) }]}>
                <Text style={[styles.taskStatusText, { color: getStatusColor(task.status) }]}>
                  {task.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Task FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color={Colors.text.white} />
      </TouchableOpacity>
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
  
  // Date Selector
  dateScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dateCard: {
    width: 70,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 4,
  },
  dateCardSelected: {
    backgroundColor: Colors.primary,
  },
  dateMonth: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  dateDay: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  dateDayName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  dateTextSelected: {
    color: Colors.text.white,
  },
  
  // Filters
  filtersScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.text.white,
  },
  
  // Tasks List
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskProject: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskTimeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  taskStatus: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  taskStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyStateText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});