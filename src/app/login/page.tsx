'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import api from '@/lib/api';
import { useSession } from '@/contexts/SessionContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleGuestLogin = () => {
    const guestUser: any = {
      id: 'guest-user-' + Date.now(),
      email: 'guest@groq.app',
      name: 'Guest User',
      imageUrl: '',
      _id: 'guest-' + Date.now(),
      googleId: 'guest',
      schoolName: 'Demo University',
      age: 20,
      major: 'Computer Science',
      faculty: 'Engineering',
      interests: ['Programming', 'AI', 'Web Development'],
      bio: 'Guest user exploring the app',
      settings: {
        aiSuggestionsEnabled: true,
        notifications: true,
        darkMode: false,
      },
      lastSeenAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const guestToken = 'guest-token-' + Date.now();

    login(guestToken, guestUser);

    toast({
      title: 'Welcome Guest!',
      description: 'You are browsing in guest mode (some features may be limited)',
      status: 'info',
      duration: 3000,
    });

    router.push('/');
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google login success:', credentialResponse);
    if (!credentialResponse.credential) {
      toast({
        title: 'Authentication error',
        description: 'No credential received',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending token to backend...');
      const { data } = await api.post('/auth/google', {
        token: credentialResponse.credential,
      });

      console.log('Backend response:', data);

      // Store refresh token in localStorage if provided
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      login(data.accessToken, data.user);

      toast({
        title: 'Welcome!',
        description: 'Successfully logged in',
        status: 'success',
        duration: 3000,
      });

      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center">
      <Container maxW="md">
        <VStack spacing={8} align="center" py={12}>
          <VStack spacing={2}>
            <Heading size="2xl" color="purple.500">
              Groq
            </Heading>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              Find your perfect study partner
            </Text>
          </VStack>

          <VStack spacing={4} w="100%">
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Sign in with your Google account to get started
            </Text>

            <Box>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast({
                    title: 'Authentication error',
                    description: 'Failed to authenticate with Google',
                    status: 'error',
                    duration: 5000,
                  });
                }}
                useOneTap
                theme="filled_blue"
                size="large"
              />
            </Box>

            <Button
              w="full"
              colorScheme="gray"
              variant="outline"
              onClick={handleGuestLogin}
              isLoading={isLoading}
            >
              Continue as Guest
            </Button>
          </VStack>

          <Text fontSize="xs" color="gray.500" textAlign="center" maxW="sm">
            By signing in, you agree to match with study partners based on your interests and
            academic profile.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
