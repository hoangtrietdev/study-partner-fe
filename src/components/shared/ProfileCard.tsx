'use client';

import React from 'react';
import { Box, VStack, HStack, Text, Avatar, Badge, useColorModeValue } from '@chakra-ui/react';
import { User } from '@/types';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  //   const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack w="100%" h="100%" spacing={4} p={6} align="stretch">
      <Box position="relative" h="200px" borderRadius="lg" overflow="hidden" bg="gray.100">
        <Avatar
          src={user?.imageUrl || ''}
          name={user?.name || 'User'}
          size="full"
          w="100%"
          h="100%"
          borderRadius="lg"
        />
      </Box>

      <VStack align="start" spacing={2} flex={1}>
        <HStack justify="space-between" w="100%">
          <Text fontSize="2xl" fontWeight="bold">
            {user?.name}
          </Text>
          <Badge colorScheme="blue" fontSize="md">
            {user?.age}
          </Badge>
        </HStack>

        <Text fontSize="sm" color={textColor}>
          🏫 {user?.schoolName}
        </Text>

        <Text fontSize="sm" color={textColor}>
          📚 {user?.major}
        </Text>

        <Text fontSize="sm" color={textColor}>
          🎓 {user?.faculty}
        </Text>

        <Box>
          <Text fontSize="xs" fontWeight="semibold" mb={1} color={textColor}>
            Interests:
          </Text>
          <HStack flexWrap="wrap" spacing={2}>
            {user?.interests.slice(0, 5).map((interest, idx) => (
              <Badge key={idx} colorScheme="purple" variant="subtle">
                {interest}
              </Badge>
            ))}
          </HStack>
        </Box>

        {user?.bio && (
          <Box>
            <Text fontSize="xs" fontWeight="semibold" mb={1} color={textColor}>
              Bio:
            </Text>
            <Text fontSize="sm" noOfLines={3}>
              {user?.bio}
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
