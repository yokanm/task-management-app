import { View, ActivityIndicator } from 'react-native';
import './globals.css';

export default function Index() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#000' 
    }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}