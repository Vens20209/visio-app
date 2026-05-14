import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomeOnboardingScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950 px-6">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-black tracking-tight text-white">Visio</Text>
        <Text className="mt-3 text-lg text-zinc-300">Your AI Wardrobe</Text>
      </View>

      <View className="pb-10">
        <PrimaryButton title="Style Me" onPress={() => navigation.navigate('Upload')} />
      </View>
    </SafeAreaView>
  );
}
