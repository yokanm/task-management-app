import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTaskStore } from '@/store/taskStore';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Simple Circular Progress for Analytics
const AnalyticsCircle = ({ 
  percentage, 
  size = 100, 
  strokeWidth = 10, 
  color = '#6C5DD3',
  label = '',
  value = 0
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
      <View style={{ width: size, height: size, marginBottom: 8 }}>
        <Svg width={size} height={size}>
          <Circle
            stroke="rgba(108, 93, 211, 0.1)"
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
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color }}>{value}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>{label}</Text>
    </View>
  );
};

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { tasks, projects, isLoading, fetchTasks, fetchProjects } = useTaskStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    completionRate: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Completed' || t.isCompleted).length;
      const inProgress = tasks.filter(t => t.status === 'In Progress').length;
      const todo = tasks.filter(t => t.status === 'To do').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      const highPriority = tasks.filter(t => t.priority === 'High').length;
      const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
      const lowPriority = tasks.filter(t => t.priority === 'Low').length;

      setStats({
        total,
        completed,
        inProgress,
        todo,
        completionRate,
        highPriority,
        mediumPriority,
        lowPriority
      });
    }
  }, [tasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.textSecondary }}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-2.5 pb-5">
          <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Analytics
          </Text>
          <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            Track your productivity
          </Text>
        </View>

        {/* Overall Progress Card */}
        <View 
          className="rounded-3xl p-6 mb-6"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-lg font-bold mb-4">Overall Progress</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-4xl font-bold mb-2">
                {stats.completionRate}%
              </Text>
              <Text className="text-white opacity-90 text-sm">
                {stats.completed} of {stats.total} tasks completed
              </Text>
            </View>
            <View style={{ width: 80, height: 80 }}>
              <Svg width={80} height={80}>
                <Circle
                  stroke="rgba(255,255,255,0.2)"
                  fill="none"
                  cx={40}
                  cy={40}
                  r={32}
                  strokeWidth={8}
                />
                <Circle
                  stroke="white"
                  fill="none"
                  cx={40}
                  cy={40}
                  r={32}
                  strokeWidth={8}
                  strokeDasharray={`${2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - stats.completionRate / 100)}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="40, 40"
                />
              </Svg>
            </View>
          </View>
        </View>

        {/* Task Status Breakdown */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Task Status
          </Text>
          <View className="flex-row justify-around">
            <AnalyticsCircle
              percentage={stats.total > 0 ? (stats.todo / stats.total) * 100 : 0}
              color="#3B82F6"
              label="To Do"
              value={stats.todo}
              size={90}
            />
            <AnalyticsCircle
              percentage={stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}
              color="#F97316"
              label="In Progress"
              value={stats.inProgress}
              size={90}
            />
            <AnalyticsCircle
              percentage={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
              color="#10B981"
              label="Completed"
              value={stats.completed}
              size={90}
            />
          </View>
        </View>

        {/* Priority Breakdown */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Priority Levels
          </Text>
          
          <View className="rounded-2xl p-4 mb-3" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">🔴</Text>
                <Text style={{ color: colors.textPrimary }}>High Priority</Text>
              </View>
              <Text className="font-bold" style={{ color: colors.textPrimary }}>
                {stats.highPriority}
              </Text>
            </View>
            <View className="w-full rounded-full h-2" style={{ backgroundColor: colors.border }}>
              <View 
                className="h-2 rounded-full"
                style={{ 
                  width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%`,
                  backgroundColor: '#EF4444'
                }}
              />
            </View>
          </View>

          <View className="rounded-2xl p-4 mb-3" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">🟡</Text>
                <Text style={{ color: colors.textPrimary }}>Medium Priority</Text>
              </View>
              <Text className="font-bold" style={{ color: colors.textPrimary }}>
                {stats.mediumPriority}
              </Text>
            </View>
            <View className="w-full rounded-full h-2" style={{ backgroundColor: colors.border }}>
              <View 
                className="h-2 rounded-full"
                style={{ 
                  width: `${stats.total > 0 ? (stats.mediumPriority / stats.total) * 100 : 0}%`,
                  backgroundColor: '#F59E0B'
                }}
              />
            </View>
          </View>

          <View className="rounded-2xl p-4 mb-3" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">🟢</Text>
                <Text style={{ color: colors.textPrimary }}>Low Priority</Text>
              </View>
              <Text className="font-bold" style={{ color: colors.textPrimary }}>
                {stats.lowPriority}
              </Text>
            </View>
            <View className="w-full rounded-full h-2" style={{ backgroundColor: colors.border }}>
              <View 
                className="h-2 rounded-full"
                style={{ 
                  width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%`,
                  backgroundColor: '#10B981'
                }}
              />
            </View>
          </View>
        </View>

        {/* Projects Summary */}
        <View className="mb-24">
          <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Projects
          </Text>
          <View className="rounded-2xl p-6" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {projects.length}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Total Projects
                </Text>
              </View>
              <Text className="text-5xl">📁</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}