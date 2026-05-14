import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

export default function PrimaryButton({ title, onPress, disabled = false, loading = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full rounded-2xl px-5 py-4 ${disabled || loading ? 'bg-zinc-700' : 'bg-emerald-500'}`}
    >
      {loading ? (
        <ActivityIndicator color="#111827" />
      ) : (
        <Text className="text-center text-base font-semibold text-zinc-900">{title}</Text>
      )}
    </Pressable>
  );
}
