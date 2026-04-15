import React, { memo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface VerifiedBadgeProps {
  size?: number;
}

export const VerifiedBadge = memo(function VerifiedBadge({ size = 14 }: VerifiedBadgeProps) {
  return <MaterialIcons name="verified" size={size} color="#7C3AED" />;
});
