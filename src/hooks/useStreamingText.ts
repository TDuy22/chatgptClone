import { useState, useEffect, useRef, useMemo } from 'react';
import type { ContentBlock } from '@/services/demo-response-service';

// Overload signatures
export function useStreamingText(fullText: string, speed?: number): { displayedText: string; isStreaming: boolean };
export function useStreamingText(blocks: ContentBlock[], speed?: number): { displayedBlocks: ContentBlock[]; currentBlockIndex: number; isStreaming: boolean };

export function useStreamingText(input: string | ContentBlock[], speed: number = 50) {
  // For string input (legacy)
  if (typeof input === 'string') {
    const [displayedText, setDisplayedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(true);
    const intervalRef = useRef<number | null>(null);
    const currentWordIndexRef = useRef(0);

    useEffect(() => {
      if (!input) {
        setDisplayedText('');
        setIsStreaming(false);
        return;
      }

      console.log('🎬 Starting streaming for text:', input.substring(0, 30) + '...', 'Length:', input.length);
      
      // Split text into words (keeping spaces)
      const words = input.split(/(\s+)/);
      console.log('📚 Total words:', words.length);
      
      // Reset state
      setDisplayedText('');
      setIsStreaming(true);
      currentWordIndexRef.current = 0;

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const currentIndex = currentWordIndexRef.current;
        
        if (currentIndex < words.length) {
          const displayedWords = words.slice(0, currentIndex + 1).join('');
          console.log('📝 Streaming word:', currentIndex, words[currentIndex]);
          setDisplayedText(displayedWords);
          currentWordIndexRef.current++;
        } else {
          console.log('✅ Streaming complete!');
          setIsStreaming(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [input, speed]);

    return { displayedText, isStreaming };
  }

  // For ContentBlock[] input (new)
  const [displayedBlocks, setDisplayedBlocks] = useState<ContentBlock[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const currentBlockIndexRef = useRef(0);
  const currentWordIndexRef = useRef(0);
  const inputRef = useRef<ContentBlock[]>([]); // Store input for visibility handler

  // Track if this input has been fully displayed before
  const completedInputsRef = useRef<Set<string>>(new Set());

  // Create a simple hash for the input to track completion
  const inputHash = useMemo(() => {
    if (!input || input.length === 0) return '';
    return input.map(b => b.body.substring(0, 50)).join('|');
  }, [input]);

  // Update inputRef when input changes
  useEffect(() => {
    inputRef.current = input as ContentBlock[];
  }, [input]);

  // Handle tab visibility change - complete streaming when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && intervalRef.current !== null) {
        // Tab is now visible and we were streaming - complete immediately
        console.log('👁️ Tab became visible, completing streaming immediately');
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Show all content immediately
        if (inputRef.current && inputRef.current.length > 0) {
          setDisplayedBlocks([...inputRef.current]);
          setIsStreaming(false);
          completedInputsRef.current.add(inputHash);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inputHash]);

  useEffect(() => {
    if (!input || input.length === 0) {
      setDisplayedBlocks([]);
      setIsStreaming(false);
      return;
    }

    // If this content was already fully displayed, show it immediately
    if (completedInputsRef.current.has(inputHash)) {
      console.log('⏩ Content already seen, showing immediately');
      setDisplayedBlocks([...input]);
      setIsStreaming(false);
      return;
    }

    console.log('🎬 Starting streaming for blocks:', input.length);
    // Reset state for new input
    setDisplayedBlocks([]);
    setIsStreaming(true);
    currentBlockIndexRef.current = 0;
    currentWordIndexRef.current = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const blockIndex = currentBlockIndexRef.current;
      
      if (blockIndex >= input.length) {
        console.log('✅ All blocks streamed!');
        setIsStreaming(false);
        // Mark this content as completed so it shows immediately on re-mount
        completedInputsRef.current.add(inputHash);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const currentBlock = input[blockIndex];
      
      // Handle markdown blocks with word-by-word streaming
      if (currentBlock.type === 'markdown') {
        const words = currentBlock.body.split(/(\s+)/);
        const currentWordIndex = currentWordIndexRef.current;
        
        if (currentWordIndex < words.length) {
          // Still streaming current markdown block
          const displayedWords = words.slice(0, currentWordIndex + 1).join('');
          
          // Update displayed blocks with current streaming markdown
          setDisplayedBlocks([
            ...input.slice(0, blockIndex),
            { type: 'markdown', body: displayedWords }
          ]);
          
          currentWordIndexRef.current++;
        } else {
          // Finished streaming current markdown block, move to next block
          console.log('✅ Finished block', blockIndex);
          setDisplayedBlocks([...input.slice(0, blockIndex + 1)]);
          currentBlockIndexRef.current = blockIndex + 1;
          currentWordIndexRef.current = 0;
        }
      } else {
        // For table blocks, show immediately (no word-by-word streaming)
        console.log('📊 Showing table block', blockIndex);
        setDisplayedBlocks([...input.slice(0, blockIndex + 1)]);
        currentBlockIndexRef.current = blockIndex + 1;
        currentWordIndexRef.current = 0;
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [input, inputHash, speed]);

  return { displayedBlocks, currentBlockIndex: currentBlockIndexRef.current, isStreaming };
}

