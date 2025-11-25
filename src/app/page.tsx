'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  useToast,
  HStack,
  Switch,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { useSession } from '@/contexts/SessionContext';
import Layout from '@/components/Layout';
import SwipeCard from '@/components/shared/SwipeCard';
import ProfileCard from '@/components/shared/ProfileCard';
import { useMatchSuggestions, useCreateMatch } from '@/hooks/useMatches';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, accessToken, isLoading: isSessionLoading } = useSession();
  const isGuest = accessToken?.startsWith('guest-token');
  const [matchMode, setMatchMode] = useState<'strict' | 'random'>('random');
  const {
    data: suggestions,
    isLoading,
    refetch,
  } = useMatchSuggestions(10, true, isAuthenticated && !isGuest, matchMode);
  const createMatch = useCreateMatch();
  const toast = useToast();

  // Mock data for guest mode
  const mockSuggestions = [
    {
      candidateId: 'mock-1',
      score: 95,
      explanation: 'Both studying Computer Science with interest in AI and Machine Learning',
      candidate: {
        _id: 'mock-1',
        googleId: 'mock-1',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        imageUrl: '',
        schoolName: 'Tech University',
        age: 21,
        major: 'Computer Science',
        faculty: 'Engineering',
        interests: ['AI', 'Machine Learning', 'Python', 'Web Development'],
        bio: 'Passionate about AI and building cool projects. Looking for study partners for advanced algorithms!',
        settings: { aiSuggestionsEnabled: true, notifications: true, darkMode: false },
        lastSeenAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      candidateId: 'mock-2',
      score: 88,
      explanation: 'Similar interests in web development and shared study schedule',
      candidate: {
        _id: 'mock-2',
        googleId: 'mock-2',
        name: 'Alex Kumar',
        email: 'alex@example.com',
        imageUrl: '',
        schoolName: 'Tech University',
        age: 22,
        major: 'Software Engineering',
        faculty: 'Engineering',
        interests: ['React', 'Node.js', 'Full Stack', 'UI/UX'],
        bio: 'Full-stack developer looking to collaborate on projects and study together!',
        settings: { aiSuggestionsEnabled: true, notifications: true, darkMode: false },
        lastSeenAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];

  useEffect(() => {
    console.log(
      'HomePage - isSessionLoading:',
      isSessionLoading,
      'isAuthenticated:',
      isAuthenticated,
      'user:',
      user,
      'isGuest:',
      isGuest,
    );
    if (!isSessionLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isSessionLoading, isAuthenticated, router, user, isGuest]);

  if (isSessionLoading || !isAuthenticated) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const currentSuggestion = isGuest ? mockSuggestions[0] : suggestions?.[0];
  const displayLoading = isLoading && !isGuest;

  const handleSwipeRight = async () => {
    if (!currentSuggestion) return;

    if (isGuest) {
      toast({
        title: 'Guest Mode',
        description: 'Sign in with Google to create real matches!',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createMatch.mutateAsync(currentSuggestion.candidateId);
      toast({
        title: 'Match created!',
        description: 'You liked this profile',
        status: 'success',
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create match',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSwipeLeft = () => {
    if (isGuest) {
      toast({
        title: 'Skipped',
        description: 'This is demo mode - sign in to see real suggestions',
        status: 'info',
        duration: 2000,
      });
      return;
    }
    refetch();
    toast({
      title: 'Skipped',
      status: 'info',
      duration: 1000,
    });
  };

  return (
    <Layout>
      <VStack spacing={8} align="center" py={8}>
        <Heading>Discover Study Partners</Heading>
        {isGuest && (
          <Text fontSize="sm" color="orange.500" fontWeight="bold">
            👋 Guest Mode - Sign in with Google to access all features
          </Text>
        )}

        {!isGuest && (
          <HStack spacing={4} align="center">
            <Text fontSize="sm" fontWeight="medium">
              Match Mode:
            </Text>
            <HStack spacing={2}>
              <Tooltip label="Show all students from any university" placement="top">
                <Badge
                  colorScheme={matchMode === 'random' ? 'purple' : 'gray'}
                  fontSize="sm"
                  px={3}
                  py={1}
                  cursor="pointer"
                  onClick={() => setMatchMode('random')}
                >
                  🌍 Random
                </Badge>
              </Tooltip>
              <Switch
                colorScheme="purple"
                isChecked={matchMode === 'strict'}
                onChange={(e) => setMatchMode(e.target.checked ? 'strict' : 'random')}
              />
              <Tooltip label="Only show students from your school" placement="top">
                <Badge
                  colorScheme={matchMode === 'strict' ? 'purple' : 'gray'}
                  fontSize="sm"
                  px={3}
                  py={1}
                  cursor="pointer"
                  onClick={() => setMatchMode('strict')}
                >
                  🎓 My School
                </Badge>
              </Tooltip>
            </HStack>
          </HStack>
        )}

        {displayLoading && <Spinner size="xl" />}

        {!displayLoading && !currentSuggestion && (
          <Text fontSize="lg" color="gray.500">
            No more suggestions. Check back later!
          </Text>
        )}

        {currentSuggestion && (
          <SwipeCard onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
            <ProfileCard user={currentSuggestion.candidate} />
          </SwipeCard>
        )}

        {currentSuggestion?.explanation && (
          <Box maxW="400px" textAlign="center">
            <Text fontSize="sm" color="purple.500" fontStyle="italic">
              🤖 AI Match: {currentSuggestion.explanation}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Compatibility Score: {currentSuggestion.score}/100
            </Text>
          </Box>
        )}
      </VStack>
    </Layout>
  );
}
