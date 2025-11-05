import { useState, useEffect, useRef } from 'react';

export function useStreamingText(fullText: string, speed: number = 20) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!fullText) {
      setDisplayedText('');
      setIsStreaming(false);
      return;
    }

    console.log('🎬 Starting streaming for:', fullText.substring(0, 30) + '...', 'Length:', fullText.length);
    
    // Reset state
    setDisplayedText('');
    setIsStreaming(true);
    currentIndexRef.current = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const currentIndex = currentIndexRef.current;
      
      if (currentIndex < fullText.length) {
        const nextText = fullText.slice(0, currentIndex + 1);
        console.log('📝 Streaming char:', currentIndex, nextText.slice(-1));
        setDisplayedText(nextText);
        currentIndexRef.current++;
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
