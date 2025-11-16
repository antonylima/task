import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Task } from '../types';
import { TaskCard } from '../components/Task/TaskCard';
import { CustomButton, LoadingSpinner, EmptyState } from '../components/Common/index';
import { Config, debugApiUrl } from '../utils/config';
import taskService from '../services/taskService';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await taskService.getAllTasks();
      if (response.error) {
        setError(response.error);
        if (response.error.includes('Network request failed')) {
          Alert.alert(
            '🔌 Connection Error', 
            'Cannot connect to the server. Check network diagnostics.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Debug', onPress: () => navigation.navigate('Debug') }
            ]
          );
        } else {
          Alert.alert('Error', response.error);
        }
        return;
      }
      setTasks(response.data || []);
    } catch (error) {
      const errorMsg = 'Failed to load tasks';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    const response = await taskService.updateTaskStatus(taskId, status);
    if (response.error) {
      Alert.alert('Error', response.error);
      throw new Error(response.error);
    }
    
    // Use the actual updated task data from server instead of just updating status
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? response.data! : task
      )
    );
  };

  const handlePriorityChange = async (taskId: number, priority: Task['priority']) => {
    const response = await taskService.updateTaskPriority(taskId, priority);
    if (response.error) {
      Alert.alert('Error', response.error);
      throw new Error(response.error);
    }
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? response.data! : task
      )
    );
  };

  const handleToggleUrgent = async (taskId: number) => {
    const response = await taskService.toggleUrgent(taskId);
    if (response.error) {
      Alert.alert('Error', response.error);
      throw new Error(response.error);
    }
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? response.data! : task
      )
    );
  };

  const handleMoveUp = async (taskId: number) => {
    const response = await taskService.moveTaskUp(taskId);
    if (response.error) {
      Alert.alert('Error', response.error);
      throw new Error(response.error);
    }
    
    // Refresh the entire list to get the new ordering
    loadTasks();
  };

  const handleMoveDown = async (taskId: number) => {
    const response = await taskService.moveTaskDown(taskId);
    if (response.error) {
      Alert.alert('Error', response.error);
      throw new Error(response.error);
    }
    
    // Refresh the entire list to get the new ordering
    loadTasks();
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskService.deleteTask(taskId);
              if (response.error) {
                Alert.alert('Error', response.error);
                return;
              }
              
              setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { task });
  };

  const navigateToCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const navigateToDebug = () => {
    navigation.navigate('Debug');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() => handleTaskPress(item)}
      onStatusChange={(status) => handleStatusChange(item.id, status)}
      onPriorityChange={(priority) => handlePriorityChange(item.id, priority)}
      onToggleUrgent={() => handleToggleUrgent(item.id)}
      onMoveUp={() => handleMoveUp(item.id)}
      onMoveDown={() => handleMoveDown(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title={error ? "Connection Error" : "No tasks yet"}
      subtitle={
        error 
          ? "Cannot connect to server. Check your connection." 
          : "Create your first task to get started"
      }
      actionButton={
        <View>
          {error && (
            <CustomButton
              title="🔧 Network Debug"
              onPress={navigateToDebug}
              variant="secondary"
            />
          )}
          <CustomButton
            title="Create Task"
            onPress={navigateToCreateTask}
            variant="primary"
          />
        </View>
      }
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerButtons}>
        <CustomButton
          title="+ Create Task"
          onPress={navigateToCreateTask}
          variant="primary"
        />
        <TouchableOpacity style={styles.debugButton} onPress={navigateToDebug}>
          <Text style={styles.debugButtonText}>🔧</Text>
        </TouchableOpacity>
      </View>
      
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            API: {Config.API_BASE_URL}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={tasks.length > 0 ? renderHeader : undefined}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContent : styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    paddingVertical: 8,
  },
  emptyContent: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  debugButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugButtonText: {
    fontSize: 18,
  },
  debugInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#8E8E93',
  },
});