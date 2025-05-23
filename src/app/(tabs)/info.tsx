import { View, Text, ScrollView } from 'react-native';
import { Header } from '@/components/Header';
import { colors } from '@/styles/colors';
import { Wrench } from 'phosphor-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { FontAwesome } from '@expo/vector-icons';

const iconHeader = <FontAwesome name='info-circle' size={20} color={colors.secondary} />

export default function InfoScreen() {
  return (
    <ScrollView className="flex-1 px-6 bg-gray-200 dark:bg-gray-900">
      <Header title='Informações' icon={iconHeader} />

      <View className="flex-col gap-6 p-4 bg-white border-2 border-gray-300 rounded-md dark:bg-gray-900">
        <Text className='text-sm'>
          <Text className="text-base font-semibold text-blue-600">Objetivo: </Text>
          <Text className="text-text-light dark:text-text-dark">
            Hábitos+ é um aplicativo criado para auxiliar na identificação e redução de hábitos prejudiciais à saúde e bem-estar.
          </Text>
        </Text>

        <View>
          <View className='flex-row items-center gap-2'>
            <Wrench size={20} color={colors.secondary} />
            <Text className="font-semibold text-secondary">Desenvolvido por:</Text>
          </View>

          <View className="flex-row items-center gap-2 mt-2">
            <Avatar>
              <AvatarImage
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/79641024?v=4',
                }}
              />
              <AvatarFallback>Dev</AvatarFallback>
            </Avatar>
            <View className='flex-col'>
              <Text className="text-sm text-text-light dark:text-text-dark">João Victor Carvalho Alves</Text>
              <Text className="text-xs dark:text-gray-600">@joaovic-tech</Text>
            </View>
          </View>
        </View>

        <Text className='text-sm'>
          <Text className="font-semibold text-blue-600">Versão:</Text>
          <Text className="text-sm text-text-light dark:text-text-dark"> 1.0.0</Text>
        </Text>

        <Text className="text-xs dark:text-gray-600">
          Projeto desenvolvido para o Centro Universitário Sagrado Coração – UNISAGRADO (Bauru/SP).
        </Text>
      </View>

      <View className="items-center mt-6">
        <Text className="text-[10px] text-blue-600">
          Todos os direitos reservados à UNISAGRADO
        </Text>
        <View className="flex-row gap-2 mt-2">
          <Text
            className="text-[10px] text-secondary underline"
            onPress={() => {
              // Substitua pelo link real dos Termos de Uso
              window.open('https://seusite.com/termos-de-uso', '_blank');
            }}
          >
            Termos de Uso
          </Text>
          <Text className="text-[10px] text-text2">|</Text>
          <Text
            className="text-[10px] text-secondary underline"
            onPress={() => {
              // Substitua pelo link real da Política de Privacidade
              window.open('https://seusite.com/politica-de-privacidade', '_blank');
            }}
          >
            Política de Privacidade
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}