'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Switch,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from '@/contexts/SessionContext';
import Layout from '@/components/Layout';
import { useUpdateUser } from '@/hooks/useUsers';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, updateUser, isLoading: isSessionLoading } = useSession();
  const updateUserMutation = useUpdateUser();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    schoolName: user?.schoolName || '',
    age: user?.age || 18,
    major: user?.major || '',
    faculty: user?.faculty || '',
    interests: user?.interests?.join(', ') || '',
    bio: user?.bio || '',
    aiSuggestionsEnabled: user?.settings?.aiSuggestionsEnabled ?? true,
  });

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isSessionLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        schoolName: user.schoolName,
        age: user.age,
        major: user.major,
        faculty: user.faculty,
        interests: user.interests?.join(', ') || '',
        bio: user.bio || '',
        aiSuggestionsEnabled: user.settings?.aiSuggestionsEnabled ?? true,
      });
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user._id,
        data: {
          name: formData.name,
          schoolName: formData.schoolName,
          age: formData.age,
          major: formData.major,
          faculty: formData.faculty,
          interests: formData.interests
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean),
          bio: formData.bio,
          settings: {
            ...user.settings,
            aiSuggestionsEnabled: formData.aiSuggestionsEnabled,
          },
        },
      });

      updateUser(updatedUser);

      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
        <HStack spacing={4}>
          <Avatar src={user.imageUrl} name={user.name} size="xl" />
          <VStack align="start" spacing={0}>
            <Heading size="lg">{user.name}</Heading>
            <Text color="gray.500">{user.email}</Text>
          </VStack>
        </HStack>

        <Box as="form" onSubmit={handleSubmit} bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>School/University</FormLabel>
              <Input
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              />
            </FormControl>

            <HStack w="100%">
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Major</FormLabel>
                <Input
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Faculty/Department</FormLabel>
              <Input
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Interests (comma-separated)</FormLabel>
              <Input
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g., coding, math, music"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell others about yourself..."
                rows={4}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Enable AI-powered match suggestions</FormLabel>
              <Switch
                isChecked={formData.aiSuggestionsEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, aiSuggestionsEnabled: e.target.checked })
                }
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              w="100%"
              isLoading={updateUserMutation.isPending}
            >
              Save Changes
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}
