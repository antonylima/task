import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Config, debugApiUrl } from '../../utils/config';
import { CustomButton } from './index';

export const NetworkDebugger: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setIsConnected(null);
    
    try {
      debugApiUrl(); // Log debug info to console
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${Config.API_BASE_URL.replace('/api', '')}/`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsConnected(true);
        Alert.alert('✅ Success', 'Successfully connected to the backend server!');
      } else {
        setIsConnected(false);
        Alert.alert('⚠️ Error', `Server responded with status: ${response.status}`);
      }
    } catch (error: any) {
      setIsConnected(false);
      let errorMessage = 'Connection failed';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Connection timeout - check if server is running and IP is correct';
      } else if (error.message?.includes('Network request failed')) {
        errorMessage = 'Network error - check your WiFi connection and server IP address';
      } else {
        errorMessage = error.message || 'Unknown connection error';
      }
      
      Alert.alert('❌ Connection Failed', errorMessage);
      console.error('Connection test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Network Diagnostics</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>API URL:</Text>
        <Text style={styles.value}>{Config.API_BASE_URL}</Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Connection Status:</Text>
        <View style={styles.statusIndicator}>
          {isConnected === null && (
            <Text style={styles.statusPending}>Testing...</Text>
          )}
          {isConnected === true && (
            <Text style={styles.statusSuccess}>✅ Connected</Text>
          )}
          {isConnected === false && (
            <Text style={styles.statusError}>❌ Failed</Text>
          )}
        </View>
      </View>
      
      <CustomButton
        title={isLoading ? "Testing..." : "Test Connection"}
        onPress={testConnection}
        disabled={isLoading}
        variant="primary"
        fullWidth
      />
      
      <View style={styles.troubleshooting}>
        <Text style={styles.troubleshootingTitle}>💡 Troubleshooting:</Text>
        <Text style={styles.troubleshootingText}>
          • Make sure backend server is running{'\n'}
          • Check that your device is on the same WiFi network{'\n'}
          • Verify the IP address in config.ts is correct{'\n'}
          • Try accessing http://192.168.3.109:3000 in your browser
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1C1C1E',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1C1C1E',
    fontFamily: 'monospace',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPending: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '500',
  },
  statusSuccess: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '500',
  },
  statusError: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  troubleshooting: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  troubleshootingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  troubleshootingText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});