import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function UserImageUploadScreen({ navigation }) {
  const [uploading, setUploading] = useState(false);

  const simulateUpload = async () => {
    try {
      setUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigation.navigate('OutfitSelection', {
        userImage: 'https://placehold.co/720x1280/png?text=User+Photo',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 px-6 py-8">
      <Text className="text-2xl font-bold text-white">Upload Full-Body Photo</Text>
      <Text className="mt-2 text-zinc-400">Use camera or choose from your gallery.</Text>

      <View className="mt-8 gap-4">
        <PrimaryButton title="Take Photo" onPress={simulateUpload} loading={uploading} />
        <PrimaryButton title="Choose from Gallery" onPress={simulateUpload} loading={uploading} />
      </View>

      {uploading ? <Text className="mt-4 text-zinc-300">Uploading image…</Text> : null}
    </SafeAreaView>
  );
}
