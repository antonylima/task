import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Task, NewTask, UpdateTask } from '../../types';
import { CustomButton } from '../Common/index';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: NewTask | UpdateTask) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'pending');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'normal');
  const [isUrgent, setIsUrgent] = useState(task?.is_urgent || false);

  const isEditMode = !!task;
  const isValid = title.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      is_urgent: isUrgent,
    };

    try {
      await onSubmit(taskData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const statusOptions: { value: Task['status']; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions: { value: Task['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: '#8E8E93' },
    { value: 'normal', label: 'Normal', color: '#007AFF' },
    { value: 'high', label: 'High', color: '#FF9500' },
    { value: 'urgent', label: 'Urgent', color: '#FF3B30' },
  ];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          multiline
          maxLength={200}
          editable={!isLoading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description (optional)"
          multiline
          numberOfLines={4}
          maxLength={500}
          editable={!isLoading}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                status === option.value && styles.statusOptionSelected,
              ]}
              onPress={() => setStatus(option.value)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  status === option.value && styles.statusOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Priority</Text>
        <View style={styles.statusContainer}>
          {priorityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                priority === option.value && { backgroundColor: option.color },
                priority === option.value && styles.statusOptionSelected,
              ]}
              onPress={() => setPriority(option.value)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  priority === option.value && styles.statusOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.urgentContainer}>
          <Text style={styles.label}>Mark as Urgent</Text>
          <TouchableOpacity
            style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
            onPress={() => setIsUrgent(!isUrgent)}
            disabled={isLoading}
          >
            <Text style={[styles.urgentToggleText, isUrgent && styles.urgentToggleTextActive]}>
              {isUrgent ? '🔥 URGENT' : 'Normal'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title="Cancel"
            onPress={onCancel}
            variant="secondary"
            disabled={isLoading}
          />
          <CustomButton
            title={isLoading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
            onPress={handleSubmit}
            variant="primary"
            disabled={!isValid || isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  statusOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  urgentContainer: {
    marginTop: 16,
  },
  urgentToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  urgentToggleActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  urgentToggleText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  urgentToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});