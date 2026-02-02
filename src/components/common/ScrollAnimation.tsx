import { ReactNode, CSSProperties } from "react";
import { Box } from "@chakra-ui/react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  stagger?: boolean;
  staggerIndex?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollAnimation = ({
  children,
  delay = 0,
  direction = "up",
  stagger = false,
  staggerIndex = 0,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollAnimationProps) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: threshold ?? 0.15,
    rootMargin: "0px 0px -80px 0px",
    triggerOnce,
  });

  const calculatedDelay = stagger ? staggerIndex * 100 : delay;

  const getTransform = (): string => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(48px)";
        case "down":
          return "translateY(-48px)";
        case "left":
          return "translateX(-48px)";
        case "right":
          return "translateX(48px)";
        case "scale":
          return "scale(0.9)";
        case "fade":
        default:
          return "none";
      }
    }
    return "translate(0, 0) scale(1)";
  };

  const animationStyles: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `all 0.7s ease-out`,
    transitionDelay: calculatedDelay > 0 ? `${calculatedDelay}ms` : undefined,
  };

  return (
    <Box ref={elementRef} style={animationStyles}>
      {children}
    </Box>
  );
};

export default ScrollAnimation;
