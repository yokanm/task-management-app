import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput as RNTextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { tasksAPI, projectsAPI } from '../../services/api';
import { taskSchema } from '../../validation/validationSchemas';

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(''); // Empty = Inbox
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'To do' | 'In Progress' | 'Completed'>('To do');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  // Date/Time with pickers
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setDueTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Build task data - parent is now OPTIONAL
      const taskData: any = {
        title,
        status,
        priority,
      };

      // Add optional fields
      if (description) taskData.description = description;
      if (dueDate) taskData.dueDate = formatDate(dueDate);
      if (dueTime) taskData.dueTime = formatTime(dueTime);

      // Only add parent if a project is selected
      // If not selected, backend will default to Inbox
      if (selectedProject) {
        taskData.parent = {
          id: selectedProject,
          type: 'Project',
        };
      }

      await tasksAPI.createTask(taskData);
      
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error.message || 'Failed to create task';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const statuses: ('To do' | 'In Progress' | 'Completed')[] = ['To do', 'In Progress', 'Completed'];

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

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Task Title */}
        <AuthInput
          label="Task Title *"
          placeholder="Enter task title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
          }}
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
              style={{ color: colors.textPrimary, textAlignVertical: 'top' }}
              placeholder="Enter task description..."
              placeholderTextColor={colors.placeholderText}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Project Selection - OPTIONAL */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Project <Text style={{ color: colors.textSecondary }}>(Optional - defaults to Inbox)</Text>
          </Text>
          
          {/* Inbox Option */}
          <TouchableOpacity
            className="py-3 px-4 rounded-xl mb-2"
            style={{
              backgroundColor: selectedProject === '' 
                ? colors.primary 
                : colors.inputBackground,
            }}
            onPress={() => setSelectedProject('')}
          >
            <View className="flex-row items-center">
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={selectedProject === '' ? colors.white : colors.textPrimary}
              />
              <Text 
                className="text-sm font-semibold ml-2"
                style={{ 
                  color: selectedProject === '' 
                    ? colors.white 
                    : colors.textPrimary 
                }}
              >
                Project (Default)
              </Text>
            </View>
          </TouchableOpacity>

          {/* Project Options */}
          {projects.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
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
          )}
        </View>

        {/* Status */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Status
          </Text>
          <View className="flex-row gap-2">
            {statuses.map((s) => (
              <TouchableOpacity
                key={s}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{
                  backgroundColor: status === s ? colors.primary : colors.inputBackground,
                }}
                onPress={() => setStatus(s)}
              >
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: status === s ? colors.white : colors.textPrimary }}
                >
                  {s}
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
            {priorities.map((p) => (
              <TouchableOpacity
                key={p}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{
                  backgroundColor: priority === p ? getPriorityColor(p) : colors.inputBackground,
                }}
                onPress={() => setPriority(p)}
              >
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: priority === p ? colors.white : colors.textPrimary }}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date - With Native Picker */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Due Date
          </Text>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-xl"
            style={{ backgroundColor: colors.inputBackground }}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text className="flex-1 ml-2" style={{ color: dueDate ? colors.textPrimary : colors.placeholderText }}>
              {dueDate ? formatDate(dueDate) : 'Select date'}
            </Text>
            {dueDate && (
              <TouchableOpacity onPress={() => setDueDate(null)}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Due Time - With Native Picker */}
        <View className="mb-6">
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Due Time
          </Text>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-xl"
            style={{ backgroundColor: colors.inputBackground }}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text className="flex-1 ml-2" style={{ color: dueTime ? colors.textPrimary : colors.placeholderText }}>
              {dueTime ? formatTime(dueTime) : 'Select time'}
            </Text>
            {dueTime && (
              <TouchableOpacity onPress={() => setDueTime(null)}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={dueTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Create Button */}
        <AuthButton
          title="Create Task"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      </ScrollView>
    </View>
  );
}