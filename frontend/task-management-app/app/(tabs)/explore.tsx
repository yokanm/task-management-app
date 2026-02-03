import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { tasksAPI } from '../../services/api';

type TaskStatus = 'All' | 'To do' | 'In Progress' | 'Completed';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  dueTime?: string;
  parent: {
    id: {
      _id: string;
      name: string;
      color?: string;
      icon?: string;
    };
    type: string;
  };
  isCompleted: boolean;
}

export default function TodayTasksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus>('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'All') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === selectedFilter);
      setFilteredTasks(filtered);
    }
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
        return colors.success;
      case 'In Progress':
        return colors.warning;
      case 'To do':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return colors.success + '20';
      case 'In Progress':
        return colors.warning + '20';
      case 'To do':
        return colors.info + '20';
      default:
        return colors.cardBackground;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return { name: 'alert-circle' as const, color: colors.error };
      case 'Medium':
        return { name: 'remove-circle' as const, color: colors.warning };
      case 'Low':
        return { name: 'checkmark-circle' as const, color: colors.success };
      default:
        return { name: 'ellipse' as const, color: colors.textSecondary };
    }
  };

  const filters: TaskStatus[] = ['All', 'To do', 'In Progress', 'Completed'];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Today&apos;s Tasks
          </Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
      >
        {getWeekDates().map((date, index) => {
          const { month, day, dayName } = formatDate(date);
          const isSelected = isToday(date);
          
          return (
            <TouchableOpacity
              key={index}
              className="items-center py-3 px-4 rounded-2xl min-w-16"
              style={{
                backgroundColor: isSelected ? colors.primary : colors.cardBackground,
              }}
              onPress={() => {}}
            >
              <Text 
                className="text-xs mb-1"
                style={{ color: isSelected ? colors.white : colors.textSecondary }}
              >
                {month}
              </Text>
              <Text 
                className="text-2xl font-bold mb-1"
                style={{ color: isSelected ? colors.white : colors.textPrimary }}
              >
                {day}
              </Text>
              <Text 
                className="text-xs"
                style={{ color: isSelected ? colors.white : colors.textSecondary }}
              >
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
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            className="py-2.5 px-5 rounded-full"
            style={{
              backgroundColor: selectedFilter === filter ? colors.primary : colors.cardBackground,
            }}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color: selectedFilter === filter ? colors.white : colors.textPrimary,
              }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTasks.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.textSecondary} />
            <Text className="text-base mt-4" style={{ color: colors.textSecondary }}>
              No tasks for today
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const parentProject = task.parent?.id;
            const projectColor = parentProject?.color || colors.primary;
            const priorityIcon = getPriorityIcon(task.priority);

            return (
              <TouchableOpacity
                key={task._id}
                className="mb-3 p-4 rounded-2xl"
                style={{ backgroundColor: colors.cardBackground }}
                onPress={() => {/* Navigate to task detail */}}
              >
                {/* Header: Project Name */}
                <View className="flex-row items-center mb-2">
                  <View 
                    className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                    style={{ backgroundColor: projectColor + '20' }}
                  >
                    <Ionicons 
                      name={parentProject?.icon as any || 'briefcase'} 
                      size={16} 
                      color={projectColor} 
                    />
                  </View>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    {parentProject?.name || 'No Project'}
                  </Text>
                  <View className="flex-1" />
                  <Ionicons name={priorityIcon.name} size={16} color={priorityIcon.color} />
                </View>

                {/* Task Title */}
                <Text 
                  className="text-base font-semibold mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  {task.title}
                </Text>

                {/* Footer: Time and Status */}
                <View className="flex-row items-center justify-between mt-2">
                  {task.dueTime && (
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                        {task.dueTime}
                      </Text>
                    </View>
                  )}
                  
                  <View 
                    className="py-1 px-3 rounded-full"
                    style={{ backgroundColor: getStatusBgColor(task.status) }}
                  >
                    <Text 
                      className="text-xs font-semibold"
                      style={{ color: getStatusColor(task.status) }}
                    >
                      {task.status === 'To do' ? 'To-do' : task.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ 
          backgroundColor: colors.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => router.push('/(tabs)/add-task')}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}