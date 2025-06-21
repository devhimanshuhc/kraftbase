import React, { useState, useEffect } from "react";
import { View, StyleSheet, PanResponder, Dimensions } from "react-native";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  trackColor?: string;
  thumbColor?: string;
  activeTrackColor?: string;
}

const { width: screenWidth } = Dimensions.get("window");
const TRACK_HEIGHT = 4;
const THUMB_SIZE = 16;
const BORDER_WIDTH = 2;

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  values,
  onChange,
  trackColor = "#EEEEEE",
  thumbColor = "#D1FC56",
  activeTrackColor = "#D1FC56",
}) => {
  // Calculate slider width based on screen size with padding
  const sliderWidth = screenWidth - 60; // assuming 30px padding on each side
  const range = max - min;

  // State for thumb positions (in pixels)
  const [leftPosition, setLeftPosition] = useState(
    ((values[0] - min) / range) * sliderWidth
  );
  const [rightPosition, setRightPosition] = useState(
    ((values[1] - min) / range) * sliderWidth
  );

  // Function to convert position to value
  const posToValue = (pos: number): number => {
    // Calculate raw value
    let value = min + (pos / sliderWidth) * range;

    // Apply step, making sure we respect the min/max boundaries
    if (step) {
      value = Math.round(value / step) * step;
    }

    // Clamp value to min/max
    value = Math.max(min, Math.min(max, value));

    return value;
  };

  // Create pan responders for both thumbs
  const leftPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gestureState) => {
      const newPosition = gestureState.moveX - 30; // Adjust for padding

      // Restrict thumb movement
      const clampedPosition = Math.max(
        0,
        Math.min(newPosition, rightPosition - THUMB_SIZE)
      );
      setLeftPosition(clampedPosition);

      // Update values
      const leftValue = posToValue(clampedPosition);
      const rightValue = posToValue(rightPosition);
      onChange([leftValue, rightValue]);
    },
    onPanResponderRelease: () => {},
  });

  const rightPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gestureState) => {
      const newPosition = gestureState.moveX - 30; // Adjust for padding

      // Restrict thumb movement
      const clampedPosition = Math.min(
        sliderWidth,
        Math.max(newPosition, leftPosition + THUMB_SIZE)
      );
      setRightPosition(clampedPosition);

      // Update values
      const leftValue = posToValue(leftPosition);
      const rightValue = posToValue(clampedPosition);
      onChange([leftValue, rightValue]);
    },
    onPanResponderRelease: () => {},
  });

  // Update thumb positions when external values change
  useEffect(() => {
    setLeftPosition(((values[0] - min) / range) * sliderWidth);
    setRightPosition(((values[1] - min) / range) * sliderWidth);
  }, [values, min, max, sliderWidth, range]);

  return (
    <View className="h-10 justify-center">
      {/* Background Track */}
      <View
        className={`h-1 rounded-full bg-${trackColor}`}
        // style={[
        //   styles.track,
        //   { backgroundColor: trackColor, width: sliderWidth },
        // ]}
      />

      {/* Active Track */}
      <View
        style={{
          backgroundColor: activeTrackColor,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          left: leftPosition,
          width: rightPosition - leftPosition,
        }}
        className="absolute"
      />

      {/* Left Thumb */}
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbColor,
            borderColor: "#FFF",
            transform: [{ translateX: leftPosition - THUMB_SIZE / 2 }],
          },
        ]}
        {...leftPanResponder.panHandlers}
      />

      {/* Right Thumb */}
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbColor,
            borderColor: "#FFF",
            transform: [{ translateX: rightPosition - THUMB_SIZE / 2 }],
          },
        ]}
        {...rightPanResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  activeTrack: {
    position: "absolute",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    // borderWidth: BORDER_WIDTH,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default RangeSlider;
