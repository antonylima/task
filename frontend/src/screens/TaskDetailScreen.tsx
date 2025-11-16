import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Task, UpdateTask } from '../types';
import { CustomButton } from '../components/Common/index';
import { TaskForm } from '../components/Form/TaskForm';
import taskService from '../services/taskService';

interface TaskDetailScreenProps {
  navigation: any;
  route: {
    params: {
      task: Task;
    };
  };
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { task } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (taskData: UpdateTask) => {
    setLoading(true);
    try {
      const response = await taskService.updateTask(task.id, taskData);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      
      Alert.alert('Success', 'Task updated successfully!', [
        { text: 'OK', onPress: () => {
          setIsEditing(false);
          navigation.goBack();
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
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
              const response = await taskService.deleteTask(task.id);
              if (response.error) {
                Alert.alert('Error', response.error);
                return;
              }
              
              Alert.alert('Success', 'Task deleted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'in_progress':
        return '#007AFF';
      case 'completed':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onSubmit={handleUpdate}
        onCancel={handleCancelEdit}
        isLoading={loading}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}
          >
            <Text style={styles.statusText}>
              {getStatusText(task.status)}
            </Text>
          </View>
        </View>

        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>
              {new Date(task.created_at).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Updated:</Text>
            <Text style={styles.detailValue}>
              {new Date(task.updated_at).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title="Edit Task"
            onPress={handleEdit}
            variant="primary"
            fullWidth
          />
          <CustomButton
            title="Delete Task"
            onPress={handleDelete}
            variant="danger"
            fullWidth
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
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  actions: {
    gap: 12,
  },
});