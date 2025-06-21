import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { propertiesDetails } from "@/constants/propetries";
import { BlurView } from "expo-blur";

export default function PropertyDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const property = propertiesDetails.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState("overview");
  const [showContactForm, setShowContactForm] = useState(false); // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(50)).current;

  const { height: screenHeight } = Dimensions.get("window");
  const defaultCardHeight = screenHeight * 0.2;
  const fullCardHeight = screenHeight * 0.55;
  const animatedValue = useRef(new Animated.Value(defaultCardHeight)).current;
  const lastGestureDy = useRef(0);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const imageHeight = animatedValue.interpolate({
    inputRange: [-fullCardHeight + defaultCardHeight, 0],
    outputRange: [screenHeight * 0.25, screenHeight * 0.5],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 5;
      },
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
        animatedValue.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        if (
          (!isCardExpanded && gesture.dy < 0) ||
          (isCardExpanded && gesture.dy > 0)
        ) {
          animatedValue.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        animatedValue.flattenOffset();

        const currentValue = lastGestureDy.current + gesture.dy;

        // If card is dragged up by more than 50 pixels when collapsed, expand it
        if (!isCardExpanded && gesture.dy < -50) {
          Animated.spring(animatedValue, {
            toValue: -fullCardHeight + defaultCardHeight,
            useNativeDriver: false,
            tension: 50,
            friction: 10,
          }).start();
          lastGestureDy.current = -fullCardHeight + defaultCardHeight;
          setIsCardExpanded(true);
        }
        // If card is dragged down by more than 50 pixels when expanded, collapse it
        else if (isCardExpanded && gesture.dy > 50) {
          Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          lastGestureDy.current = 0;
          setIsCardExpanded(false);
        }
        // Otherwise, revert to the previous position
        else {
          Animated.spring(animatedValue, {
            toValue: isCardExpanded ? -fullCardHeight + defaultCardHeight : 0,
            useNativeDriver: false,
          }).start();
          lastGestureDy.current = isCardExpanded
            ? -fullCardHeight + defaultCardHeight
            : 0;
        }
      },
    })
  ).current;

  // Handle back button
  const goBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else {
      router.back();
    }
  };

  // Handle contact agent
  const contactAgent = () => {
    setShowContactForm(true);
  };
  // Show toast notification with animation
  const showToastNotification = () => {
    setShowToast(true);

    // Reset animation values
    toastOpacity.setValue(0);
    toastTranslateY.setValue(50);

    // Animate toast in
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(toastTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide toast after 3 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
      });
    }, 3000);
  };

  // Handle send inquiry
  const sendInquiry = () => {
    console.log("Sending inquiry with:", {
      firstName,
      lastName,
      phone,
      email,
      message,
    });
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setShowContactForm(false);
    showToastNotification();
  };

  if (!property) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Property not found</Text>
        <TouchableOpacity
          onPress={goBack}
          className="mt-4 px-4 py-2 bg-black rounded-lg"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white">
        <StatusBar style="light" />
        {!showContactForm && (
          <Animated.View
            className="relative w-full"
            style={{ height: imageHeight }}
          >
            <Image
              source={{ uri: property.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Animated.View>
        )}
        {showContactForm && (
          <View className="relative h-[30%]">
            <Image
              source={{ uri: property.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}
        <TouchableOpacity
          onPress={goBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white items-center justify-center shadow-md"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        {showContactForm ? (
          <View className="flex-1 bg-white rounded-t-3xl -mt-6 pt-6 px-5">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <Text className="text-xl font-bold mb-3">Contact Agent</Text>
              <View className="flex-row items-center mb-0">
                <Ionicons name="location-outline" size={15} color="#717171" />
                <Text className="ml-1 text-gray-600 text-sm">
                  {property.location}
                </Text>
                <View className="flex-1 items-end">
                  <Text className="font-bold text-2xl">${property.price}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-start mb-3">
                <View className="mb-2 flex-[0.85]">
                  <Text className="text-3xl font-bold">{property.title}</Text>
                </View>
                <Text className="flex-[0.15] text-xs text-[#717171] text-right">
                  month
                </Text>
              </View>
              <Text className="text-xs text-gray-700 mb-5">
                {property.baths} Baths • {property.beds} Beds • {property.sqft}
                sqft
              </Text>
              <View className="mb-6 mt-2">
                <View className="flex-row space-x-3 mb-6 gap-x-3">
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor={"#A0A0A0"}
                    value={firstName}
                    onChangeText={setFirstName}
                    className={`flex-1 border ${focusedInput === "firstName" ? "border-black" : "border-gray-200"} rounded-md px-4 py-5 text-base`}
                    onFocus={() => setFocusedInput("firstName")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TextInput
                    placeholder="Sec Name"
                    placeholderTextColor={"#A0A0A0"}
                    value={lastName}
                    onChangeText={setLastName}
                    className={`flex-1 border ${focusedInput === "lastName" ? "border-black" : "border-gray-200"} rounded-md px-4 py-3 text-base`}
                    onFocus={() => setFocusedInput("lastName")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
                <TextInput
                  placeholder="You Phone Number"
                  placeholderTextColor={"#A0A0A0"}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  className={`border ${focusedInput === "phone" ? "border-black" : "border-gray-200"} rounded-md px-4 py-3 text-base mb-6`}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                  placeholder="You Email"
                  placeholderTextColor={"#A0A0A0"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`border ${focusedInput === "email" ? "border-black" : "border-gray-200"} rounded-md px-4 py-3 text-base mb-6`}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                  placeholder="Message"
                  placeholderTextColor={"#A0A0A0"}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className={`border ${focusedInput === "message" ? "border-black" : "border-gray-200"} rounded-md px-4 py-3 text-base h-32`}
                  onFocus={() => setFocusedInput("message")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              <TouchableOpacity
                onPress={sendInquiry}
                className="bg-[#D1FC56] rounded-full py-4 items-center mb-8"
              >
                <Text className="text-black font-semibold">Send Inquiry</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <Animated.View
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-6 px-5"
            style={{
              minHeight: defaultCardHeight,
              maxHeight: fullCardHeight,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [-fullCardHeight + defaultCardHeight, 0],
                    outputRange: [-(fullCardHeight - defaultCardHeight), 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
              zIndex: 10,
            }}
            {...panResponder.panHandlers}
          >
            <View className="absolute top-2 left-0 right-0 flex items-center">
              <View className="w-16 h-1 bg-gray-300 rounded-full"></View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#717171" />
                  <Text className="ml-1 text-gray-600">
                    {property.location}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="mr-1 font-medium">{property.rating}</Text>
                  <Ionicons name="star" size={16} color="#FFB800" />
                </View>
              </View>
              <Text className="text-3xl font-bold mb-3">{property.title}</Text>
              <Text className="text-gray-700 mb-4">
                {property.baths} Baths • {property.beds} Beds • {property.sqft}
                sqft
              </Text>
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setActiveTab("overview")}
                  className={`px-4 py-2 mr-4 rounded-full pb-1 ${activeTab === "overview" ? "bg-[#D1FC56]" : "bg-[#CFD2D930]"}`}
                >
                  <Text
                    className={`font-medium pb-1  ${activeTab === "overview" ? "text-black" : "text-gray-400"}`}
                  >
                    Overview
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("features")}
                  className={`px-4 py-2 mr-4 rounded-full pb-1 ${activeTab === "features" ? "bg-[#D1FC56]" : "bg-[#CFD2D930]"}`}
                >
                  <Text
                    className={`font-medium pb-1 ${activeTab === "features" ? "text-black" : "text-gray-400"}`}
                  >
                    Features
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("reviews")}
                  className={`px-4 py-2 mr-4 rounded-full pb-1 ${activeTab === "reviews" ? "bg-[#D1FC56]" : "bg-[#CFD2D930]"}`}
                >
                  <Text
                    className={`font-medium pb-1 ${activeTab === "reviews" ? "text-black" : "text-gray-400"}`}
                  >
                    Reviews
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab("directions")}
                  className={`px-4 py-2 mr-4 rounded-full pb-1 ${activeTab === "directions" ? "bg-[#D1FC56]" : "bg-[#CFD2D930]"}`}
                >
                  <Text
                    className={`font-medium pb-1 ${activeTab === "directions" ? "text-black" : "text-gray-400"}`}
                  >
                    Directions
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text className="text-lg font-bold mb-2">Property Details</Text>

                {activeTab === "overview" && (
                  <Text className="text-gray-700 leading-6">
                    {property.description}
                  </Text>
                )}

                {activeTab === "features" && (
                  <View>
                    <Text className="text-gray-700">
                      • Modern kitchen appliances{"\n"}• High ceilings{"\n"}•
                      Hardwood floors{"\n"}• Energy-efficient windows{"\n"}•
                      Central heating and cooling{"\n"}• In-unit washer and
                      dryer{"\n"}• Balcony with city views
                    </Text>
                  </View>
                )}

                {activeTab === "reviews" && (
                  <View>
                    <Text className="text-gray-700 mb-4">
                      No reviews available yet.
                    </Text>
                  </View>
                )}

                {activeTab === "directions" && (
                  <View>
                    <Text className="text-gray-700 mb-4">
                      Located in the heart of downtown, easily accessible by
                      subway lines A, B, and C. Walking distance to Central Park
                      and major shopping centers.
                    </Text>
                  </View>
                )}
              </View>
              <View className="h-24" />
            </ScrollView>
          </Animated.View>
        )}
        {!showContactForm && (
          <View className="absolute z-50 bottom-6 left-5 right-5 flex-row justify-between items-center bg-black py-4 rounded-xl shadow-lg">
            <View className="ml-4">
              <Text className="text-white text-sm">Rent</Text>
              <View className="flex-row items-end">
                <Text className="text-2xl font-bold text-white">
                  ${property.price}
                </Text>
                <Text className="text-gray-500 ml-1 mb-1">/Month</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={contactAgent}
              className="bg-[#D1FC56] rounded-xl py-4 px-5 mr-4"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="call-outline"
                  size={18}
                  color="black"
                  className="mr-2"
                />
                <Text className="text-black font-semibold ml-1">
                  Contact Agent
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {showToast && (
          <Animated.View
            style={{
              position: "absolute",
              bottom: 100,
              left: 20,
              right: 20,
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
              zIndex: 999,
            }}
          >
            <BlurView
              intensity={75}
              tint="dark"
              className="rounded-xl overflow-hidden"
            >
              <View className="bg-black bg-opacity-70 px-4 py-4 rounded-xl flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#D1FC56] items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={24} color="black" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">
                    Success!
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    Your inquiry has been sent to the agent
                  </Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
