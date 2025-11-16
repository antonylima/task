import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onStatusChange: (status: Task['status']) => Promise<void>;
  onPriorityChange: (priority: Task['priority']) => Promise<void>;
  onToggleUrgent: () => Promise<void>;
  onMoveUp: () => Promise<void>;
  onMoveDown: () => Promise<void>;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onStatusChange,
  onPriorityChange,
  onToggleUrgent,
  onMoveUp,
  onMoveDown,
  onDelete,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

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

  const getPriorityColor = (priority: Task['priority'], isUrgent: boolean) => {
    if (isUrgent) return '#FF3B30';
    switch (priority) {
      case 'low':
        return '#8E8E93';
      case 'normal':
        return '#007AFF';
      case 'high':
        return '#FF9500';
      case 'urgent':
        return '#FF3B30';
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

  const getPriorityText = (priority: Task['priority'], isUrgent: boolean) => {
    if (isUrgent) return '🔥 URGENT';
    switch (priority) {
      case 'low':
        return 'Low';
      case 'normal':
        return 'Normal';
      case 'high':
        return 'High';
      case 'urgent':
        return '🔥 Urgent';
      default:
        return priority;
    }
  };

  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getNextPriority = (currentPriority: Task['priority']): Task['priority'] => {
    switch (currentPriority) {
      case 'low':
        return 'normal';
      case 'normal':
        return 'high';
      case 'high':
        return 'urgent';
      case 'urgent':
        return 'low';
      default:
        return 'normal';
    }
  };

  const handleStatusChange = async () => {
    if (isUpdatingStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const nextStatus = getNextStatus(task.status);
      await onStatusChange(nextStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async () => {
    if (isUpdatingPriority) return;
    
    setIsUpdatingPriority(true);
    try {
      const nextPriority = getNextPriority(task.priority);
      await onPriorityChange(nextPriority);
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleUrgentToggle = async () => {
    try {
      await onToggleUrgent();
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle urgent status');
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        task.is_urgent && styles.urgentCard
      ]} 
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.badges}>
            <TouchableOpacity
              style={[
                styles.priorityBadge, 
                { backgroundColor: isUpdatingPriority ? '#8E8E93' : getPriorityColor(task.priority, task.is_urgent) }
              ]}
              onPress={handlePriorityChange}
              disabled={isUpdatingPriority}
            >
              <Text style={styles.priorityText}>
                {isUpdatingPriority ? 'Updating...' : getPriorityText(task.priority, task.is_urgent)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.urgentButton, task.is_urgent && styles.activeUrgent]}
            onPress={handleUrgentToggle}
          >
            <Text style={styles.actionButtonText}>🔥</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.moveButton]}
            onPress={onMoveUp}
          >
            <Text style={styles.actionButtonText}>↑</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.moveButton]}
            onPress={onMoveDown}
          >
            <Text style={styles.actionButtonText}>↓</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {task.description && (
        <Text style={styles.description} numberOfLines={3}>
          {task.description}
        </Text>
      )}
      
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[
            styles.statusBadge, 
            { backgroundColor: isUpdatingStatus ? '#8E8E93' : getStatusColor(task.status) },
            isUpdatingStatus && styles.statusBadgeUpdating
          ]}
          onPress={handleStatusChange}
          disabled={isUpdatingStatus}
        >
          <Text style={styles.statusText}>
            {isUpdatingStatus ? 'Updating...' : getStatusText(task.status)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.date}>
          {new Date(task.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onStatusChange: (taskId: number, status: Task['status']) => Promise<void>;
  onPriorityChange: (taskId: number, priority: Task['priority']) => Promise<void>;
  onToggleUrgent: (taskId: number) => Promise<void>;
  onMoveUp: (taskId: number) => Promise<void>;
  onMoveDown: (taskId: number) => Promise<void>;
  onDeleteTask: (taskId: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onStatusChange,
  onPriorityChange,
  onToggleUrgent,
  onMoveUp,
  onMoveDown,
  onDeleteTask,
}) => {
  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onPress={() => onTaskPress(task)}
          onStatusChange={(status) => onStatusChange(task.id, status)}
          onPriorityChange={(priority) => onPriorityChange(task.id, priority)}
          onToggleUrgent={() => onToggleUrgent(task.id)}
          onMoveUp={() => onMoveUp(task.id)}
          onMoveDown={() => onMoveDown(task.id)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentButton: {
    backgroundColor: '#FF9500',
  },
  activeUrgent: {
    backgroundColor: '#FF3B30',
  },
  moveButton: {
    backgroundColor: '#8E8E93',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusBadgeUpdating: {
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
});