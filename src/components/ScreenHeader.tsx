import React, {ReactNode} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '../theme';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  right?: ReactNode;
};

export function ScreenHeader({title, onBack, right}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, {paddingTop: insets.top}]}>
      <View style={styles.bar}>
        <Pressable
          onPress={onBack}
          style={styles.side}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
}

const SIDE_WIDTH = 64;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  side: {
    width: SIDE_WIDTH,
    minHeight: 44,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  backIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    marginLeft: spacing.sm,
    tintColor: colors.text,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
});
