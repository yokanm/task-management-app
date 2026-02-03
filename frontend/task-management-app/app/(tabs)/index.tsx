import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { tasksAPI, projectsAPI, taskGroupsAPI } from '../../services/api';

interface TaskGroup {
  _id: string;
  name: string;
  icon?: string;
  color: string;
  taskCount: number;
  completionPercentage: number;
}

interface Project {
  _id: string;
  name: string;
  color: string;
  taskCount: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    completionPercentage: 0,
  });
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [inProgressProjects, setInProgressProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchTaskStats(),
          fetchTaskGroups(),
          fetchProjects(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setRefreshing(false);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchTaskStats(),
        fetchTaskGroups(),
        fetchProjects(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTaskStats = async () => {
    try {
      const response = await tasksAPI.getTaskStats();
      setTaskStats(response.data.data);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const fetchTaskGroups = async () => {
    try {
      const response = await taskGroupsAPI.getTaskGroups();
      setTaskGroups(response.data.data);
    } catch (error) {
      console.error('Error fetching task groups:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      const allProjects = response.data.data;
      
      // Filter projects with tasks in progress
      const inProgress = allProjects.filter((p: Project) => p.taskCount > 0).slice(0, 2);
      setInProgressProjects(inProgress);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View 
              className="w-12 h-12 rounded-full justify-center items-center mr-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-xl font-bold" style={{ color: colors.white }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {getGreeting()}!
              </Text>
              <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {user?.username || 'User'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Today's Task Progress Card */}
        <View 
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: colors.primary }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-base mb-1" style={{ color: colors.white, opacity: 0.9 }}>
                Your today&apos;s task
              </Text>
              <Text className="text-base" style={{ color: colors.white, opacity: 0.9 }}>
                almost done!
              </Text>
            </View>
            
            {/* Circular Progress */}
            <View className="items-center justify-center w-20 h-20 rounded-full border-4" 
              style={{ borderColor: colors.white + '40' }}
            >
              <View className="items-center justify-center w-16 h-16 rounded-full border-4"
                style={{ borderColor: colors.white }}
              >
                <Text className="text-lg font-bold" style={{ color: colors.white }}>
                  {taskStats.completionPercentage}%
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className="py-3 px-5 rounded-xl self-start"
            style={{ backgroundColor: colors.white }}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text className="font-semibold" style={{ color: colors.primary }}>
              View Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* In Progress Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              In Progress
            </Text>
            <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              {taskStats.inProgress}
            </Text>
          </View>

          <View className="flex-row gap-3">
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map((project) => (
                <TouchableOpacity
                  key={project._id}
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: colors.cardBackground }}
                  onPress={() => {/* Navigate to project details */}}
                >
                  <View className="flex-row items-center mb-3">
                    <View 
                      className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                      style={{ backgroundColor: project.color + '20' }}
                    >
                      <Ionicons name="briefcase" size={16} color={project.color} />
                    </View>
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      Office Project
                    </Text>
                  </View>
                  
                  <Text 
                    className="text-sm font-semibold mb-2" 
                    style={{ color: colors.textPrimary }}
                    numberOfLines={2}
                  >
                    {project.name}
                  </Text>
                  
                  {/* Progress Bar */}
                  <View className="h-1.5 rounded-full mb-1" style={{ backgroundColor: colors.border }}>
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: project.color,
                        width: `${Math.min(70, (project.taskCount / 10) * 100)}%` 
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="flex-1 p-4 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
                <Text style={{ color: colors.textSecondary }}>No projects in progress</Text>
              </View>
            )}
          </View>
        </View>

        {/* Task Groups Section */}
        <View className="px-6 mb-20">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              Task Groups
            </Text>
            <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              {taskGroups.length}
            </Text>
          </View>

          {taskGroups.length > 0 ? (
            taskGroups.map((group) => (
              <TouchableOpacity
                key={group._id}
                className="flex-row items-center justify-between p-4 rounded-xl mb-2"
                style={{ backgroundColor: colors.cardBackground }}
                onPress={() => {/* Navigate to task group */}}
              >
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: group.color + '20' }}
                  >
                    <Text className="text-xl">{group.icon || '📁'}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {group.name}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      {group.taskCount} Tasks
                    </Text>
                  </View>
                </View>

                {/* Circular Progress */}
                <View className="items-center justify-center w-12 h-12">
                  <View 
                    className="absolute w-12 h-12 rounded-full border-4"
                    style={{ 
                      borderColor: colors.border,
                      transform: [{ rotate: '-90deg' }]
                    }}
                  />
                  <View 
                    className="absolute w-12 h-12 rounded-full border-4"
                    style={{ 
                      borderColor: group.color,
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                      transform: [{ rotate: `${(group.completionPercentage / 100) * 360 - 90}deg` }]
                    }}
                  />
                  <Text className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                    {group.completionPercentage}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="p-8 rounded-xl items-center" style={{ backgroundColor: colors.cardBackground }}>
              <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
              <Text className="text-base mt-2" style={{ color: colors.textSecondary }}>
                No task groups yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-20 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
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