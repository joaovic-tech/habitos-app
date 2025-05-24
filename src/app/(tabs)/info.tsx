import { View, Text, ScrollView, Linking, Pressable } from 'react-native';
import { Header } from '@/components/Header';
import { colors } from '@/styles/colors';
import { Wrench, Info, GithubLogo, Copyright, FileText, LockKey } from 'phosphor-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';

const icon = <Info size={20} color={colors.secondary} weight="duotone" />;

export default function InfoScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 px-6 bg-gray-200 dark:bg-gray-900">
      <Header title='Sobre o App' icon={icon} />
      <View className="flex-col gap-4 px-4 py-6 bg-white shadow dark:bg-gray-800 rounded-2xl shadow-gray-800">
        <View className="flex-col gap-2 text-start">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Sobre o Hábitos+</Text>
          <Text className="text-base leading-6 text-gray-600 dark:text-gray-300">
            Aplicativo desenvolvido para auxiliar na identificação e redução de hábitos prejudiciais à saúde e bem-estar, promovendo uma vida mais equilibrada e saudável.
          </Text>
        </View>

        <View className="border-t border-gray-100 dark:border-gray-800"></View>

        {/* <View className="flex-col gap-2 dark:border-gray-800">
          <View className="flex-row items-center gap-2">
            <Wrench size={20} color={colors.secondary} weight="duotone" />
            <Text className="font-semibold text-gray-800 dark:text-gray-200">Desenvolvido por:</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/79641024?v=4',
                }}
              />
              <AvatarFallback>JV</AvatarFallback>
            </Avatar>
            <View className='flex-1'>
              <Text className="font-medium text-gray-900 dark:text-white">João Victor Carvalho Alves</Text>
              <View className='flex-row items-center justify-start gap-4'>
                <Text className="text-sm text-gray-400">Desenvolvedor</Text>
                <Pressable
                  className="flex-row items-center gap-1"
                  onPress={() => openLink('https://github.com/joaovic-tech')}
                >
                  <GithubLogo size={14} color={colors.secondary} weight='duotone' />
                  <Text className="text-sm text-secondary">@joaovic-tech</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View> */}

        <View className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl ">
          <Text className="text-sm text-blue-700 dark:text-blue-300">
            <Text className="font-semibold">Versão:</Text> 1.0.0
          </Text>
          <Text className="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80">
            Projeto desenvolvido para o Centro Universitário Sagrado Coração – UNISAGRADO (Bauru/SP).
          </Text>
        </View>

        <View className="flex-col items-center gap-8">
          <View className="flex-row items-center">
            <Copyright size={12} color={colors.gray[400]} weight="bold" />
            <Text className="text-xs text-gray-400">
              {new Date().getFullYear()} UNISAGRADO. Todos os direitos reservados.
            </Text>
          </View>

          <View className="flex-row items-center justify-around w-full">
            <Pressable
              className="flex-row items-center"
              onPress={() => openLink('https://seusite.com/termos-de-uso')}
            >
              <FileText size={24} color={colors.gray[400]} weight="duotone" />
              <Text className="text-base text-gray-400 underline">Termos de Uso</Text>
            </Pressable>
            <Text className='text-gray-400' >|</Text>
            <Pressable
              className="flex-row items-center"
              onPress={() => openLink('https://seusite.com/politica-de-privacidade')}
            >
              <LockKey size={24} color={colors.gray[400]} weight="duotone" />
              <Text className="text-base text-gray-400 underline">Privacidade</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}