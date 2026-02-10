import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { AuthButton } from '../../components/auth/AuthButton';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Stay organized. Get more done.',
    description: 'Organize your workflow, prioritize with ease, and accomplish more every day.',
    image: null,
  },
  {
    id: '2',
    title: 'Track your progress',
    description: 'Monitor your tasks and projects with intuitive dashboards and insights.',
    image: null,
  },
  {
    id: '3',
    title: 'Collaborate seamlessly',
    description: 'Work together with your team and achieve goals faster.',
    image: null,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setHasSeenOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await setHasSeenOnboarding(true);
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={{ width, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
      {/* Image placeholder */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <View style={{ width: 280, height: 280, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.primary + '30',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 80 }}>📋</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{ width: '100%', paddingBottom: 40 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: 16,
        }}>
          {item.title}
        </Text>
        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 24,
        }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Skip button */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 50,
          right: 24,
          zIndex: 10,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        onPress={handleSkip}
      >
        <Text style={{ fontSize: 16, color: colors.textSecondary, fontWeight: '500' }}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination dots */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
      }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === currentIndex ? colors.primary : colors.border,
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={{ paddingHorizontal: 40, paddingBottom: 40, gap: 16 }}>
        <AuthButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
        />
        
        {currentIndex === slides.length - 1 && (
          <AuthButton
            title="Sign In"
            onPress={() => router.replace('/(auth)/login')}
            variant="outline"
          />
        )}
      </View>
    </View>
  );
}