
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function SafeScreen({ children}: {children: React.ReactNode}) {
    const inserts = useSafeAreaInsets();
  return (
    <View className='flex-1 bg-orange-400' style={{paddingTop: inserts.top}}>
      {children}
    </View>
  )
}