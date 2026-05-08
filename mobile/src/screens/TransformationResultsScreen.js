import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, Text, View, Pressable } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function TransformationResultsScreen({ navigation, route }) {
  const [showTransformed, setShowTransformed] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const originalImage = route?.params?.originalImage || 'https://placehold.co/720x1280/png?text=Original';
  const transformedImage = route?.params?.transformedImage || 'https://placehold.co/720x1280/png?text=AI+Look';

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      Alert.alert('Saved', 'Your transformed look was saved to camera roll.');
    } catch {
      Alert.alert('Save failed', 'We could not save your image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      Alert.alert('Shared', 'Share dialog opened.');
    } catch {
      Alert.alert('Share failed', 'Unable to open sharing options.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 px-4 py-6">
      <Text className="px-2 text-2xl font-bold text-white">Your New Look</Text>
      <Text className="px-2 pt-2 text-zinc-400">Tap Original / AI Styled to compare.</Text>

      <View className="mt-4 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
        <View className="flex-row border-b border-zinc-800">
          <Pressable className="flex-1 px-4 py-3" onPress={() => setShowTransformed(false)}>
            <Text className={`text-center font-semibold ${!showTransformed ? 'text-emerald-400' : 'text-zinc-400'}`}>
              Original
            </Text>
          </Pressable>
          <Pressable className="flex-1 px-4 py-3" onPress={() => setShowTransformed(true)}>
            <Text className={`text-center font-semibold ${showTransformed ? 'text-emerald-400' : 'text-zinc-400'}`}>
              AI Styled
            </Text>
          </Pressable>
        </View>

        <Image source={{ uri: showTransformed ? transformedImage : originalImage }} className="h-[460px] w-full" resizeMode="cover" />
      </View>

      <View className="mt-6 gap-3 px-1">
        <PrimaryButton title="Save to Camera Roll" onPress={handleSave} loading={isSaving} />
        <PrimaryButton title="Share" onPress={handleShare} loading={isSharing} />
        <Pressable
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Upload' }] })}
          className="rounded-2xl border border-zinc-700 px-5 py-4"
        >
          <Text className="text-center text-base font-semibold text-zinc-100">Try Another Look</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
