import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { properties } from "@/constants/propetries";

const propertyTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Apartments" },
  { id: 3, name: "House" },
  { id: 4, name: "Villa" },
  { id: 5, name: "Hotel" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activePropertyType, setActivePropertyType] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([1]);

  const toggleFavorite = (propertyId: number) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter((id) => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  const openFilters = () => {
    router.push("/modal");
  };
  const openPropertyDetails = (property: any) => {
    router.push({
      pathname: "/property/[id]",
      params: { id: property.id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 mb-4 pt-3">
        <Image
          source={require("../../public/icon.png")}
          style={{
            width: 120,
            height: 32,
            alignSelf: "center",
          }}
          resizeMode="contain"
        />
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
              className="w-full h-full"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Search Bar */}
      <View className="flex-row items-center bg-[#F5F5F5] rounded-full mx-4 my-2 px-4 py-3">
        <Ionicons
          name="search-outline"
          size={20}
          color="#A0A0A0"
          className="mr-2"
        />
        <TextInput
          placeholder="Search Address, city, zip..."
          className="flex-1 text-base text-[#333]"
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity onPress={openFilters}>
          <Ionicons name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Property Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-14"
        contentContainerStyle={styles.propertyTypeContainer}
      >
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`px-4 py-2 mx-2 rounded-full  ${activePropertyType === type.name ? "bg-[#D1FC56]" : "bg-[#CFD2D930]"} `}
            onPress={() => setActivePropertyType(type.name)}
          >
            <Text
              className={`font-medium ${activePropertyType === type.name ? "text-black" : "text-[#717171] "}`}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listingsContainer}
        className="flex-1"
      >
        {properties.map((property) => (
          <TouchableOpacity
            key={property.id}
            className="mb-4 bg-white rounded-lg"
            activeOpacity={0.9}
            onPress={() => openPropertyDetails(property)}
          >
            <View className="relative h-[200px] rounded-3xl overflow-hidden">
              <Image
                source={{ uri: property.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <BlurView
                className="absolute top-3 left-3 bg-white bg-opacity-80 px-3 py-1 rounded-md overflow-hidden"
                tint="light"
                intensity={50}
              >
                <Text className="text-sm font-medium">{property.type}</Text>
              </BlurView>
              <TouchableOpacity
                className="absolute top-3 right-3 bg-opacity-30 w-9 h-9 rounded-full items-center justify-center"
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
              >
                <BlurView
                  className="absolute inset-0 rounded-full items-center justify-center overflow-hidden"
                  tint="light"
                  intensity={80}
                />
                <Ionicons
                  name={
                    favorites.includes(property.id) ? "heart" : "heart-outline"
                  }
                  size={24}
                  color={favorites.includes(property.id) ? "#FF5A5F" : "black"}
                />
              </TouchableOpacity>
            </View>
            <View className="p-4">
              {/* Baths, Beds, sqft and Price in the same line */}
              <View className="flex-row justify-between items-center mb-0">
                <Text className="text-xs text-[#717171]">
                  {property.baths} Baths • {property.beds} Beds •{property.sqft}
                  sqft
                </Text>
                <View className="items-end">
                  <Text className="text-xl font-bold">${property.price}</Text>
                </View>
              </View>
              {/* Title */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="mb-2 flex-[0.8]">
                  <Text
                    className="text-lg font-bold"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {property.title}
                  </Text>
                </View>
                <Text className="flex-[0.2] text-xs text-[#717171] text-right">
                  month
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-0">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="location-outline" size={16} color="#717171" />
                  <Text className="text-sm text-[#717171] ml-1">
                    {property.location}
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <Text className="text-md font-medium mr-1">
                    {property.rating}
                  </Text>
                  <Ionicons name="star" size={16} color="#FFB800" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Bottom Navigation */}
      <BlurView
        className="absolute bottom-12 left-6 right-6 bg-transparent shadow-md py-2 flex-row justify-around items-center rounded-full overflow-hidden"
        tint="systemChromeMaterialLight"
        intensity={60}
      >
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full m-1 my-0 bg-black">
          <Ionicons name="home" size={24} color="#D1FC56" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full m-1 bg-white border border-gray-200">
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full m-1 bg-white border border-gray-200">
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full m-1 bg-white border border-gray-200">
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full m-1 bg-white border border-gray-200">
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  propertyTypeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  listingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Increased padding at bottom to account for floating nav bar
  },
});
