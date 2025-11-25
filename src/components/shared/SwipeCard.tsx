'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiX, FiHeart } from 'react-icons/fi';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const newX = clientX - startPos.current.x;
    const newY = clientY - startPos.current.y;

    setPosition({ x: newX, y: newY });
    setRotation(newX * 0.1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (Math.abs(position.x) > 150) {
      if (position.x > 0) {
        animateSwipe('right');
        onSwipeRight();
      } else {
        animateSwipe('left');
        onSwipeLeft();
      }
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? 1000 : -1000;
    setPosition({ x: targetX, y: position.y });
    setTimeout(() => {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }, 300);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, position]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      onSwipeLeft();
    } else if (e.key === 'ArrowRight') {
      onSwipeRight();
    }
  };

  return (
    <Box
      position="relative"
      w="100%"
      h="600px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        ref={cardRef}
        position="absolute"
        w={{ base: '90%', md: '400px' }}
        h="500px"
        bg={bgColor}
        borderRadius="xl"
        border="2px solid"
        borderColor={borderColor}
        boxShadow="2xl"
        cursor="grab"
        userSelect="none"
        transform={`translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`}
        transition={isDragging ? 'none' : 'transform 0.3s ease'}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Swipe card. Use arrow keys or drag to interact"
        overflow="hidden"
      >
        {children}
      </Box>

      <Box position="absolute" bottom="4" display="flex" gap={4} zIndex={10}>
        <IconButton
          aria-label="Reject"
          icon={<FiX />}
          colorScheme="red"
          size="lg"
          borderRadius="full"
          onClick={onSwipeLeft}
          boxShadow="lg"
        />
        <IconButton
          aria-label="Like"
          icon={<FiHeart />}
          colorScheme="green"
          size="lg"
          borderRadius="full"
          onClick={onSwipeRight}
          boxShadow="lg"
        />
      </Box>
    </Box>
  );
}
