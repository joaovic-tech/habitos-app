import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Animated, Text, View } from "react-native";
import { cn } from "@/lib/utils"; // função para concatenar classNames (opcional)

const toastVariantColors = {
  default: "bg-green-500",
  destructive: "bg-red-600",
  success: "bg-green-500",
  info: "bg-blue-500",
};

const toastTextColors = {
  default: "text-white",
  destructive: "text-white",
  success: "text-white",
  info: "text-white",
};

interface ToastProps {
  id: number;
  message: string;
  onHide: (id: number) => void;
  variant?: keyof typeof toastVariantColors;
  duration?: number;
  showProgress?: boolean;
}

function Toast({
  id,
  message,
  onHide,
  variant = "default",
  duration = 3000,
  showProgress = true,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: duration - 1000,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onHide(id);
      }
    });

    return () => {
      opacity.stopAnimation();
      progress.stopAnimation();
    };
  }, [duration, id, onHide]);

  return (
    <Animated.View
      className={cn("m-2 mb-1 p-4 rounded-lg", toastVariantColors[variant])}
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      <Text
        className={cn(
          "text-base font-bold text-left",
          toastTextColors[variant]
        )}
      >
        {message}
      </Text>

      {showProgress && (
        <View className="h-2 mt-2 overflow-hidden rounded bg-gray-900/10">
          <Animated.View
            className="h-full bg-gray-500 rounded"
            style={{
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>
      )}
    </Animated.View>
  );
}

// ---------------- CONTEXT / PROVIDER ----------------

type ToastVariant = keyof typeof toastVariantColors;

interface ToastMessage {
  id: number;
  text: string;
  variant: ToastVariant;
  duration?: number;
  position?: "top" | "bottom";
  showProgress?: boolean;
}

interface ToastContextProps {
  toast: (
    message: string,
    variant?: ToastVariant,
    duration?: number,
    position?: "top" | "bottom",
    showProgress?: boolean
  ) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

function ToastProvider({
  children,
  position = "top",
}: {
  children: React.ReactNode;
  position?: "top" | "bottom";
}) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast: ToastContextProps["toast"] = (
    message,
    variant = "default",
    duration = 3000,
    _position = position,
    showProgress = true
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: message,
        variant,
        duration,
        position: _position,
        showProgress,
      },
    ]);
  };

  const removeToast = useCallback((id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const filteredMessages = messages.filter((msg) => msg.position === position);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <View
        className={cn(
          "absolute left-0 right-0 z-[9999] items-center pointer-events-none",
          position === "top" ? "top-12" : "bottom-5"
        )}
      >
        {filteredMessages.map((message) => (
          <Toast
            key={message.id}
            id={message.id}
            message={message.text}
            variant={message.variant}
            duration={message.duration}
            showProgress={message.showProgress}
            onHide={removeToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider, ToastVariant, useToast };
