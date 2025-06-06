import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { useToast } from "@/components/shared/Toast";
import { Input } from "@/components/shared/Input";
import { validateEmail, validatePassword } from "@/utils/validations";
import Register from "@/app/register";

interface FormProps {
  showRegister: boolean;
  setShowRegister: (show: boolean) => void;
}

export default function LoginForm({
  showRegister,
  setShowRegister,
}: FormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { toast } = useToast();

  const handleLogin = () => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast(emailValidation.message!, "destructive");
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast(passwordValidation.message!, "destructive");
      return;
    }

    // TODO: Implement login logic here
    // ! { email, password, rememberMe }
    toast(`Dados validados`, "success");
  };

  if (showRegister) {
    return <Register />;
  }

  return (
    <View className="w-full px-6 bottom-32">
      <View className="items-center gap-4 p-6 bg-white rounded-xl dark:bg-neutral-800">
        {/* Social Login Buttons */}
        <TouchableOpacity
          onPress={() => console.log("Login with Google")}
          className="flex-row items-center justify-center w-full py-3 bg-white border rounded-lg dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600"
        >
          <Image
            source={require("@/assets/google.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="ml-2 font-medium text-neutral-700 dark:text-neutral-200">
            Continue com o Google
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center justify-between w-full my-2">
          <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-600" />
          <Text className="mx-2 text-sm text-neutral-500 dark:text-neutral-400">
            ou faça login com
          </Text>
          <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-600" />
        </View>

        {/* Email and Password Inputs */}
        <View className="w-full gap-4 space-y-4">
          <Input
            placeholder="E-mail"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Senha"
            autoComplete="password"
            secureTextEntry={!showPassword}
            icon={showPassword ? "eye" : "eye-off"}
            onIconPress={() => setShowPassword((v) => !v)}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-row items-center justify-between w-full">
          <Checkbox
            label="Lembrar de mim"
            initialValue={rememberMe}
            onChange={setRememberMe}
          />
          <TouchableOpacity>
            <Text className="text-sm font-medium text-blue-600">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          className="w-full mt-2"
          label="Conecte-se"
          onPress={handleLogin}
        />

        <View className="flex-row justify-center mt-2">
          <Text className="text-sm text-neutral-600 dark:text-neutral-300">
            Não tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => setShowRegister(true)}>
            <Text className="text-sm font-semibold text-blue-600">
              Registre-se
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-center text-neutral-500 dark:text-neutral-400">
          Ao se inscrever, você concorda com os{" "}
          <Text className="text-blue-600">Termos de Serviço</Text> e o{" "}
          <Text className="text-blue-600">
            Contrato de Processamento de Dados
          </Text>
        </Text>
      </View>
    </View>
  );
}
