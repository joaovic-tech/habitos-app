import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../Button';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';

export default function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    // E-mail obrigatório
    if (!email) {
      newErrors.email = 'Digite seu e-mail';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    } else if (email.length > 50) {
      newErrors.email = 'E-mail muito longo';
    } else if (email.length < 5) {
      newErrors.email = 'E-mail muito curto';
    }

    // Senha obrigatória
    if (!password) {
      newErrors.password = 'Digite sua senha';
    } else if (password.length < 3) {
      newErrors.password = 'Senha muito curta';
    } else if (password.length > 32) {
      newErrors.password = 'Senha muito longa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      // Dados válidos
      console.log('Dados enviados:', { email, password });
    }
  };

  return (
    <View className="w-full px-6 bottom-32">
      <View className='items-center gap-4 p-6 bg-gray-500 rounded-xl dark:bg-gray-900'>
        {/* Social Login Buttons */}
        <TouchableOpacity
          onPress={() => console.log('Login with Google')}
          className="flex-row items-center justify-center w-full py-3 bg-gray-500 border border-gray-200 rounded-lg"
        >
          <Image
            source={require('@/assets/google.png')}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
          <Text className="ml-2 font-medium text-gray-700">Continue com o Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center justify-between w-full my-2">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-2 text-sm text-gray-400">ou faça login com</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Email and Password Inputs */}
        <View className='w-full gap-4 space-y-4'>
          <Input
            placeholder='E-mail'
            autoComplete='email'
            keyboardType='email-address'
            value={email}
            onChangeText={setEmail}
            onFocus={() => errors.email = ''}
            error={errors.email}
            maxLength={50}
          />
          <Input
            placeholder='Senha'
            autoComplete='password'
            onFocus={() => errors.password = ''}
            secureTextEntry={!showPassword}
            icon={showPassword ? 'eye' : 'eye-off'}
            onIconPress={() => setShowPassword((v) => !v)}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            maxLength={32}
          />
        </View>

        <View className='flex-row items-center justify-between w-full'>
          <Checkbox label="Lembrar de mim" />
          <TouchableOpacity>
            <Text className="text-sm font-medium text-primary">Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>

        <Button
          className='w-full mt-2'
          label='Conecte-se'
          onPress={handleLogin}
        />

        <View className="flex-row justify-center mt-2">
          <Text className="text-sm text-gray-600">Não tem uma conta? </Text>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-primary">Registre-se</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-center text-gray-400">
          Ao se inscrever, você concorda com os{' '}
          <Text className="text-primary">Termos de Serviço</Text> e o{' '}
          <Text className="text-primary">Contrato de Processamento de Dados</Text>
        </Text>
      </View>
    </View>
  );
}