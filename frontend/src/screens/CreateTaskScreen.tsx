import React, { useState } from 'react';
import { Alert } from 'react-native';
import { NewTask } from '../types';
import { TaskForm } from '../components/Form/TaskForm';
import taskService from '../services/taskService';

interface CreateTaskScreenProps {
  navigation: any;
}

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (taskData: NewTask) => {
    setLoading(true);
    try {
      const response = await taskService.createTask(taskData);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <TaskForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
};