import React, { useState } from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { generateVtonOutfit } from '../services/api';

const CATEGORIES = ['Streetwear', 'Business Casual', 'Formal'];

export default function OutfitSelectionScreen({ navigation, route }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const userImage = route?.params?.userImage;

  const handleGenerate = async () => {
    setError('');
    setIsProcessing(true);
    navigation.navigate('Loading');

    try {
      const result = await generateVtonOutfit({
        userImage,
        outfitCategory: selectedCategory,
      });

      navigation.replace('Results', {
        originalImage: userImage,
        transformedImage: result.outputImage,
      });
    } catch (err) {
      setError(err.message || 'Failed to generate look. Please try again.');
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 px-6 py-8">
      <Text className="text-2xl font-bold text-white">Choose Your Outfit</Text>
      <Text className="mt-2 text-zinc-400">Or upload a reference outfit image.</Text>

      <View className="mt-8 gap-3">
        {CATEGORIES.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`rounded-2xl border px-4 py-4 ${
              selectedCategory === category ? 'border-emerald-500 bg-zinc-900' : 'border-zinc-700 bg-zinc-900/50'
            }`}
          >
            <Text className="text-base font-medium text-white">{category}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text className="mt-4 text-red-400">{error}</Text> : null}

      <View className="mt-auto pb-4">
        <PrimaryButton title="Generate Look" onPress={handleGenerate} disabled={isProcessing} loading={isProcessing} />
      </View>
    </SafeAreaView>
  );
}
