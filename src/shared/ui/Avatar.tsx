import React, { memo, useState } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  displayName: string;
}

function getAvatarColor(name: string): string {
  const colors = [
    '#7C3AED', '#2563EB', '#059669', '#DC2626',
    '#D97706', '#7C3AED', '#DB2777', '#0891B2',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const Avatar = memo(function Avatar({ uri, size = 40, displayName }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const bgColor = getAvatarColor(displayName);
  const fontSize = Math.round(size * 0.38);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.initials, { fontSize, color: '#FFFFFF' }]}>{initials}</Text>
      {!imageError && (
        <Image
          source={{ uri }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2 }]}
          onError={() => setImageError(true)}
          accessibilityLabel={`${displayName} avatar`}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { fontWeight: '600', letterSpacing: 0.5 },
});
