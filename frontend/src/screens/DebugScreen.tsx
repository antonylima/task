import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NetworkDebugger } from '../components/Common/NetworkDebugger';

export const DebugScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <NetworkDebugger />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});