'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Avatar,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import { useSession } from '@/contexts/SessionContext';
import Layout from '@/components/Layout';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { format } from 'date-fns';

export default function MessagesPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params?.matchId as string;
  const { isAuthenticated, user, isLoading: isSessionLoading } = useSession();
  const { data: messages, isLoading } = useMessages(matchId);
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const myMessageBg = useColorModeValue('purple.500', 'purple.600');
  const theirMessageBg = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isSessionLoading, isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isSessionLoading || !isAuthenticated) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage.mutateAsync({ matchId, content: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <VStack spacing={0} h="calc(100vh - 200px)">
        <HStack w="100%" p={4} bg={bgColor} borderRadius="lg" boxShadow="sm" mb={4}>
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            onClick={() => router.push('/matches')}
            variant="ghost"
          />
          <Text fontSize="lg" fontWeight="bold">
            Messages
          </Text>
        </HStack>

        <Box flex={1} w="100%" overflowY="auto" bg={bgColor} borderRadius="lg" p={4} boxShadow="sm">
          {isLoading && (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" />
            </Box>
          )}

          {!isLoading && messages?.length === 0 && (
            <Text color="gray.500" textAlign="center" py={8}>
              No messages yet. Start the conversation!
            </Text>
          )}

          <VStack spacing={3} align="stretch">
            {messages?.map((message) => {
              const isMyMessage = message.senderId === user?._id;
              return (
                <HStack
                  key={message._id}
                  justify={isMyMessage ? 'flex-end' : 'flex-start'}
                  align="flex-end"
                >
                  {!isMyMessage && <Avatar size="sm" />}
                  <Box
                    maxW="70%"
                    bg={isMyMessage ? myMessageBg : theirMessageBg}
                    color={isMyMessage ? 'white' : 'inherit'}
                    px={4}
                    py={2}
                    borderRadius="lg"
                  >
                    <Text>{message.content}</Text>
                    <Text fontSize="xs" opacity={0.7} mt={1}>
                      {format(new Date(message.createdAt), 'HH:mm')}
                    </Text>
                  </Box>
                  {isMyMessage && <Avatar size="sm" src={user?.imageUrl} />}
                </HStack>
              );
            })}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <HStack w="100%" mt={4}>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            bg={bgColor}
          />
          <IconButton
            aria-label="Send message"
            icon={<FiSend />}
            colorScheme="purple"
            onClick={handleSend}
            isLoading={sendMessage.isPending}
          />
        </HStack>
      </VStack>
    </Layout>
  );
}
