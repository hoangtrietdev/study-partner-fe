'use client';

import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiUser, FiHeart, FiMessageCircle, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useSession();
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const navBg = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box as="nav" bg={navBg} px={4} py={3} boxShadow="sm" position="sticky" top={0} zIndex={100}>
        <Flex maxW="1200px" mx="auto" justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="purple.500">
            {process.env.NEXT_PUBLIC_APP_NAME || 'Study Partner'}
          </Text>

          <HStack spacing={2}>
            <IconButton
              aria-label="Home"
              icon={<FiHeart />}
              variant="ghost"
              onClick={() => router.push('/')}
            />
            <IconButton
              aria-label="Matches"
              icon={<FiMessageCircle />}
              variant="ghost"
              onClick={() => router.push('/matches')}
            />
            <IconButton
              aria-label="Profile"
              icon={<FiUser />}
              variant="ghost"
              onClick={() => router.push('/profile')}
            />
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
            />
            <Button leftIcon={<FiLogOut />} size="sm" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={4} py={8}>
        {children}
      </Box>
    </Box>
  );
}
