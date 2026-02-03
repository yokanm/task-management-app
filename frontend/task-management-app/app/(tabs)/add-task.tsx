import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { tasksAPI, projectsAPI } from '../../services/api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { taskSchema, type TaskInput } from '../../utils/validationSchemas';

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = useFormValidation<TaskInput>({
    schema: taskSchema,
    onSubmit: async (data) => {
      try {
        // Remove empty optional fields
        const taskData = {
          ...data,
          description: data.description || undefined,
          dueDate: data.dueDate || undefined,
          dueTime: data.dueTime || undefined,
          project: selectedProject || undefined,
        };

        await tasksAPI.createTask(taskData);
        
        Alert.alert('Success', 'Task created successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } catch (error: any) {
        console.error('Error creating task:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to create task');
      }
    },
    mode: 'onChange',
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High':
        return colors.error;
      case 'Medium':
        return colors.warning;
      case 'Low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const priorities: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
  const statuses: Array<'To do' | 'In Progress' | 'Completed'> = ['To do', 'In Progress', 'Completed'];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row justify-between items-center p-6 pt-12 border-b" style={{ borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Add Task
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        className="flex-1 p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Task Title */}
        <AuthInput
          label="Task Title *"
          placeholder="Enter task title"
          value={values.title || ''}
          onChangeText={(text) => handleChange('title', text)}
          onBlur={() => handleBlur('title')}
          error={errors.title}
          icon="create-outline"
        />

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
            Description
          </Text>
          <View 
            className="flex-row rounded-xl p-4 min-h-24 border"
            style={{
              backgroundColor: colors.inputBackground,
              borderColor: errors.description ? colors.error : 'transparent',
            }}
          >
            <Ionicons 
              name="document-text-outline" 
              size={20} 
              color={colors.textSecondary} 
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <RNTextInput
              className="flex-1 text-base"
              style={{ 
                color: colors.textPrimary,
                textAlignVertical: 'top',
              }}
              placeholder="Enter task description..."
              placeholderTextColor={colors.placeholderText}
              value={values.description || ''}
              onChangeText={(text) => handleChange('description', text)}
              onBlur={() => handleBlur('description')}
              multiline
              numberOfLines={4}
            />
          </View>
          {errors.description && (
            <Text className="text-xs mt-1 ml-1" style={{ color: colors.error }}>
              {errors.description}
            </Text>
          )}
        </View>

        {/* Status */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Status
          </Text>
          <View className="flex-row gap-2">
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{
                  backgroundColor: (values.status || 'To do') === status 
                    ? colors.primary 
                    : colors.inputBackground,
                }}
                onPress={() => handleChange('status', status)}
              >
                <Text 
                  className="text-sm font-semibold"
                  style={{ 
                    color: (values.status || 'To do') === status 
                      ? colors.white 
                      : colors.textPrimary 
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Priority
          </Text>
          <View className="flex-row gap-2">
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{
                  backgroundColor: (values.priority || 'Medium') === priority 
                    ? getPriorityColor(priority)
                    : colors.inputBackground,
                }}
                onPress={() => handleChange('priority', priority)}
              >
                <Text 
                  className="text-sm font-semibold"
                  style={{ 
                    color: (values.priority || 'Medium') === priority 
                      ? colors.white 
                      : colors.textPrimary 
                  }}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.priority && (
            <Text className="text-xs mt-1 ml-1" style={{ color: colors.error }}>
              {errors.priority}
            </Text>
          )}
        </View>

        {/* Project Selection */}
        {projects.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Project (Optional)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              <TouchableOpacity
                className="py-3 px-4 rounded-xl mr-2"
                style={{
                  backgroundColor: !selectedProject ? colors.primary : colors.inputBackground,
                }}
                onPress={() => setSelectedProject('')}
              >
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: !selectedProject ? colors.white : colors.textPrimary }}
                >
                  No Project
                </Text>
              </TouchableOpacity>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project._id}
                  className="py-3 px-4 rounded-xl mr-2"
                  style={{
                    backgroundColor: selectedProject === project._id 
                      ? colors.primary 
                      : colors.inputBackground,
                  }}
                  onPress={() => setSelectedProject(project._id)}
                >
                  <Text 
                    className="text-sm font-semibold"
                    style={{ 
                      color: selectedProject === project._id 
                        ? colors.white 
                        : colors.textPrimary 
                    }}
                  >
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Due Date & Time */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <AuthInput
              label="Due Date (YYYY-MM-DD)"
              placeholder="2026-12-31"
              value={values.dueDate || ''}
              onChangeText={(text) => handleChange('dueDate', text)}
              onBlur={() => handleBlur('dueDate')}
              error={errors.dueDate}
              icon="calendar-outline"
            />
          </View>
          
          <View className="flex-1">
            <AuthInput
              label="Due Time (HH:MM)"
              placeholder="14:30"
              value={values.dueTime || ''}
              onChangeText={(text) => handleChange('dueTime', text)}
              onBlur={() => handleBlur('dueTime')}
              error={errors.dueTime}
              icon="time-outline"
            />
          </View>
        </View>

        {/* Create Button */}
        <AuthButton
          title="Create Task"
          onPress={handleSubmit}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </View>
  );
}