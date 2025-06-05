import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { useToast } from "@/components/shared/Toast";
import { Input } from "@/components/shared/Input";
import { validateRegisterForm } from "@/utils/validations";

export default function RegisterForm({ onBack }: { onBack: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  const { toast } = useToast();

  // Format birth date with mask DD/MM/YYYY
  function formatDisplayDate(value: string) {
    let digits = value.replace(/\D/g, "");
    if (digits.length > 8) digits = digits.slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(
        4
      )}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setBirthDate(formatted);
  }

  const handleRegister = () => {
    const validationResult = validateRegisterForm(
      name,
      surname,
      birthDate,
      email,
      password,
      termsAccepted
    );

    if (validationResult) {
      toast(validationResult.message!, "destructive");
      return;
    }

    // If validation passes, proceed with registration
    console.log("Form is valid, proceeding with registration");
    toast("Conta criada com sucesso!", "success");
    // TODO: Add your registration logic here
  };

  return (
    <View className="w-full px-6 bottom-36">
      <View className="w-full px-6">
        <View className="items-center gap-4 p-6 bg-white rounded-xl dark:bg-neutral-800">
          {/* Google */}
          <TouchableOpacity
            onPress={() => console.log("Sign up with Google")}
            className="flex-row items-center justify-center w-full py-3 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg"
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
            <Text className="mx-2 text-sm text-neutral-600 dark:text-neutral-400">
              ou use seu e-mail
            </Text>
            <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-600" />
          </View>

          {/* Form Fields */}
          <View className="w-full gap-4">
            <View className="flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Ex: João"
                label={"Nome"}
                value={name}
                onChangeText={setName}
                isRequired
              />
              <Input
                className="flex-1"
                label={"Sobrenome"}
                placeholder="Ex: Silva"
                value={surname}
                onChangeText={setSurname}
                isRequired
              />
            </View>

            <Input
              placeholder="Data de Nascimento (DD/MM/AAAA)"
              keyboardType="numeric"
              icon="calendar"
              value={birthDate}
              onChangeText={(value) => formatDisplayDate(value)}
              isRequired
              maxLength={10}
            />

            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              isRequired
            />

            <Input
              placeholder="Senha"
              secureTextEntry={!showPassword}
              icon={showPassword ? "eye" : "eye-off"}
              onIconPress={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={setPassword}
              isRequired
            />
          </View>

          <View className="w-full mt-2">
            <Checkbox
              label={
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                  Concordo com os{" "}
                  <Text className="text-primary">Termos de Uso</Text> e{" "}
                  <Text className="text-primary">Política de Privacidade</Text>
                </Text>
              }
              initialValue={termsAccepted}
              onChange={setTermsAccepted}
            />
          </View>

          <Button
            className="w-full"
            label="Criar conta"
            onPress={handleRegister}
          />
        </View>
      </View>
    </View>
  );
}
