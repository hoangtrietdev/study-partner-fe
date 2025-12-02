'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Badge,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from '@/contexts/SessionContext';
import Layout from '@/components/Layout';
import { useMatches } from '@/hooks/useMatches';
import { Match, User } from '@/types';

export default function MatchesPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: isSessionLoading } = useSession();
  const { data: matches, isLoading } = useMatches();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isSessionLoading, isAuthenticated, router]);

  if (isSessionLoading || !isAuthenticated) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const getMatchedUser = (match: Match): User | undefined => {
    // API returns otherUser field with populated user data
    if (match.otherUser) {
      return match.otherUser;
    }
    
    // Fallback to old logic if otherUser not present
    const userAId = typeof match.userAId === 'string' ? match.userAId : match.userAId._id;
    if (userAId === user?._id) {
      return typeof match.userBId === 'string' ? undefined : match.userBId;
    }
    return typeof match.userAId === 'string' ? undefined : match.userAId;
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading>Your Matches</Heading>

        {isLoading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
          </Box>
        )}

        {!isLoading && matches?.length === 0 && (
          <Text color="gray.500" textAlign="center" py={8}>
            No matches yet. Keep swiping!
          </Text>
        )}

        {!isLoading &&
          matches?.map((match) => {
            const matchedUser = getMatchedUser(match);
            if (!matchedUser || !matchedUser.name) return null;

            return (
              <Box
                key={match._id}
                bg={bgColor}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                onClick={() => {
                  const matchId = typeof match._id === 'string' ? match._id : match._id;
                  console.log('Navigating to match:', matchId);
                  router.push(`/messages/${matchId}`);
                }}
              >
                <HStack spacing={4}>
                  <Avatar src={matchedUser.imageUrl || ''} name={matchedUser.name} size="lg" />
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack>
                      <Text fontSize="xl" fontWeight="bold">
                        {matchedUser.name}
                      </Text>
                      <Badge colorScheme="purple">Matched</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {matchedUser.major} • {matchedUser.faculty}
                    </Text>
                    {match.score && (
                      <Text fontSize="xs" color="purple.500">
                        🤖 Compatibility: {match.score}/100
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            );
          })}
      </VStack>
    </Layout>
  );
}
