import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { AuthButton } from '../../components/auth/AuthButton';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any; // In production, use actual images
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Stay organized. Get more done.',
    description: 'Organize your workflow, prioritize with ease, and accomplish more every day.',
    image: null, // Replace with actual image from assets
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

  const handleGetStarted = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/sign-in');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {/* Image placeholder - Replace with actual illustration */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          {/* Illustration of task management (plants, people working) */}
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationText}>📋</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
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
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <AuthButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
        />
        
        {currentIndex === slides.length - 1 && (
          <AuthButton
            title="Sign In"
            onPress={() => router.replace('/(auth)/sign-in')}
            variant="outline"
            style={styles.signInButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    zIndex: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imagePlaceholder: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    fontSize: 80,
  },
  content: {
    width: '100%',
    paddingBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  signInButton: {
    marginTop: Spacing.sm,
  },
});