import React, { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';

export default function LoadingProcessingScreen() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-zinc-950 px-6">
      <Animated.View
        style={{ transform: [{ rotate: spin }] }}
        className="h-14 w-14 rounded-full border-4 border-emerald-500 border-t-zinc-700"
      />
      <Text className="mt-8 text-xl font-semibold text-white">Crafting your new look…</Text>
      <Text className="mt-3 text-center text-zinc-400">This may take up to 20 seconds depending on queue volume.</Text>
    </SafeAreaView>
  );
}
