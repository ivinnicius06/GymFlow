import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface UserAvatarProps {
  initials: string;
  onPress?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.avatar}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <Text style={styles.initials}>{initials}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
