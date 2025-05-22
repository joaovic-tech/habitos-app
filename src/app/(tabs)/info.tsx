import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { colors } from '@/styles/colors';
import { Wrench } from 'phosphor-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';

export default function InfoScreen() {
  return (
    <ScrollView className="flex-1 px-6 bg-background">
      <Header title='Informações' icon='info-circle' />

      <View className="flex-col gap-6 p-4 border rounded-md bg-background2 border-background3">
        <Text className='text-sm'>
          <Text className="text-base font-semibold text-secondary">Objetivo: </Text>
          <Text className="text-text">
            Hábitos+ é um aplicativo criado para auxiliar na identificação e redução de hábitos prejudiciais à saúde e bem-estar.
          </Text>
        </Text>

        <View>
          <View className='flex-row items-center gap-2'>
            <Wrench size={20} color={colors.secondary} />
            <Text className="ont-semibold text-secondary">Desenvolvido por:</Text>
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
              <Text className="text-sm text-text">João Victor Carvalho Alves</Text>
              <Text className="text-xs text-text2">@joaovic-tech</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 mt-2">
            <Avatar>
              <AvatarImage
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/112734393?v=4',
                }}
              />
              <AvatarFallback>Dev</AvatarFallback>
            </Avatar>
            <View className='flex-col'>
              <Text className="text-sm text-text">Weericsson Marconn da Silva Santos</Text>
              <Text className="text-xs text-text2">@Werricsson-Santos</Text>
            </View>
          </View>
        </View>

        <Text className='text-sm'>
          <Text className="font-semibold text-secondary">Versão:</Text>
          <Text className="text-sm text-text">1.0.0</Text>
        </Text>

        <Text className="text-xs text-text2">
          Projeto desenvolvido para o Centro Universitário Sagrado Coração – UNISAGRADO (Bauru/SP).
        </Text>
      </View>

      <View className="items-center mt-6">
        <Text className="text-[10px] text-primary">
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
          <Text className="text-[10px] text-text">|</Text>
          <Text
            className="text-[10px] text-secondary underline"
            onPress={() => {
              // Substitua pelo link real da Licença
              window.open('https://seusite.com/licenca', '_blank');
            }}
          >
            Licença
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
