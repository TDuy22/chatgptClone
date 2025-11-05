import { useState, useEffect, useRef } from 'react';

export function useStreamingText(fullText: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const currentWordIndexRef = useRef(0);

  useEffect(() => {
    if (!fullText) {
      setDisplayedText('');
      setIsStreaming(false);
      return;
    }

    console.log('🎬 Starting streaming for:', fullText.substring(0, 30) + '...', 'Length:', fullText.length);
    
    // Split text into words (keeping spaces)
    const words = fullText.split(/(\s+)/);
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
  }, [fullText, speed]);

  return { displayedText, isStreaming };
}
