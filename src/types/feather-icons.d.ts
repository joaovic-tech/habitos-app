import { Feather } from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

// This type declaration file enhances TypeScript support for Feather icons

// Common Feather icon names used in the application
// Only allow specific icon names that are used in the app
export type FeatherIconName = 
  | "activity"
  | "hand"
  | "edit-3"
  | "meh"
  | "frown"
  | "smile"
  | "wind"
  | "thumbs-up"
  | "chevron-right"
  | "sun"
  | "check"
  | "settings";

// Extend the module declaration to improve type checking
declare module "@expo/vector-icons/Feather" {
  export interface FeatherIconProps {
    name: FeatherIconName;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }
}
