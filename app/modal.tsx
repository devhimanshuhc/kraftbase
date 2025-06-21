import { StatusBar } from "expo-status-bar";
import {
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RangeSlider from "@/components/RangeSlider";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

// Filter options data
const listingTypes = [
  { id: "sale", label: "For Sale" },
  { id: "rent", label: "For Rent" },
  { id: "buy", label: "For Buy" },
];

const categories = [
  { id: "apartments", label: "Apartments" },
  { id: "house", label: "House" },
  { id: "all", label: "All" },
  { id: "hotel", label: "Hotel" },
  { id: "penthouse", label: "Penthouse" },
  { id: "land", label: "Land" },
  { id: "villa", label: "Villa" },
];

const facilities = [
  { id: "parking", label: "Parking" },
  { id: "kitchen", label: "Kitchen" },
  { id: "wifi", label: "Free Wifi" },
  { id: "garden", label: "Garden" },
  { id: "pool", label: "Pool" },
];

export default function ModalScreen() {
  const router = useRouter();
  const [selectedListingType, setSelectedListingType] = useState("rent");
  const [selectedCategories, setSelectedCategories] = useState(["apartments"]);
  const [selectedFacilities, setSelectedFacilities] = useState([
    "parking",
    "pool",
  ]);
  const [priceRange, setPriceRange] = useState([250, 5000]);
  const [city, setCity] = useState("New York");
  const [country, setCountry] = useState("United States");
  const [bedrooms, setBedrooms] = useState("3 Rooms");
  const [bathrooms, setBathrooms] = useState("2 Bathrooms");
  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);
  const [showBathroomsDropdown, setShowBathroomsDropdown] = useState(false);

  // Options for dropdowns
  const bedroomOptions = [
    "1 Room",
    "2 Rooms",
    "3 Rooms",
    "4 Rooms",
    "5+ Rooms",
  ];
  const bathroomOptions = [
    "1 Bathroom",
    "2 Bathrooms",
    "3 Bathrooms",
    "4+ Bathrooms",
  ];

  // Toggle category selection
  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      if (selectedCategories.length > 1) {
        // Don't allow removing all categories
        setSelectedCategories(
          selectedCategories.filter((catId) => catId !== id)
        );
      }
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  // Toggle facility selection
  const toggleFacility = (id: string) => {
    if (selectedFacilities.includes(id)) {
      setSelectedFacilities(selectedFacilities.filter((facId) => facId !== id));
    } else {
      setSelectedFacilities([...selectedFacilities, id]);
    }
  };

  // Handle apply filters
  const applyFilters = () => {
    // You would typically pass these filters to the main screen or store them
    console.log("Applying filters:", {
      listingType: selectedListingType,
      categories: selectedCategories,
      facilities: selectedFacilities,
      priceRange,
      city,
      country,
      bedrooms,
      bathrooms,
    });
    router.back();
  };

  // Handle clear all filters
  const clearAllFilters = () => {
    setSelectedListingType("rent");
    setSelectedCategories(["apartments"]);
    setSelectedFacilities([]);
    setPriceRange([250, 1000]);
    setCity("New York");
    setCountry("United States");
    setBedrooms("3 Rooms");
    setBathrooms("2 Bathrooms");
  };

  // Close dropdowns when tapping outside
  const closeDropdowns = () => {
    setShowBedroomsDropdown(false);
    setShowBathroomsDropdown(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["bottom", "left", "right"]}
      >
        <StatusBar style="dark" />

        {/* Header with title and Clear All option */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
          <Text className="text-xl font-bold">Filters</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text className="text-gray-400 text-base">Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
        >
          {/* Listing Type (For Sale, For Rent, For Buy) */}
          <View className="my-4">
            <View className="flex-row">
              {listingTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  className={`rounded-full py-2 px-5 mr-3 ${
                    selectedListingType === type.id ? "bg-black" : "bg-gray-100"
                  }`}
                  onPress={() => setSelectedListingType(type.id)}
                >
                  <Text
                    className={`${
                      selectedListingType === type.id
                        ? "text-white"
                        : "text-gray-700"
                    } font-medium`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* City and Country Input Fields */}
          <View className="flex-row justify-between my-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-base font-medium">City</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base"
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="mb-2 text-base font-medium">Country</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-base"
                value={country}
                onChangeText={setCountry}
                placeholder="Enter country"
              />
            </View>
          </View>

          {/* Category Selection */}
          <View className="my-4">
            <Text className="mb-2 text-base font-medium">Select Category</Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`rounded-full py-2 px-4 mr-3 mb-3 ${
                    selectedCategories.includes(category.id)
                      ? "bg-black"
                      : "bg-gray-100"
                  }`}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text
                    className={`${
                      selectedCategories.includes(category.id)
                        ? "text-white"
                        : "text-gray-700"
                    } font-medium`}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Slider */}
          <View className="my-4">
            <Text className="mb-2 text-base font-medium">Price Range</Text>
            <View className="flex-row justify-between mb-4">
              <View className="bg-black rounded-md px-4 py-2">
                <Text className="text-white font-bold">${priceRange[0]}</Text>
              </View>
              <View className="bg-black rounded-md px-4 py-2">
                <Text className="text-white font-bold">${priceRange[1]}</Text>
              </View>
            </View>
            <RangeSlider
              min={250}
              max={5000}
              step={50}
              values={priceRange as [number, number]}
              onChange={(values: [number, number]) => setPriceRange(values)}
              trackColor="#EEEEEE"
              activeTrackColor="#D1FC56"
              thumbColor="#000"
            />
          </View>

          {/* Bed Room and Bathroom Selection */}
          <View className="flex-row justify-between my-4">
            <View className="flex-1 mr-2">
              <Text className="mb-2 text-base font-medium">Bed Room</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
                onPress={() => {
                  setShowBedroomsDropdown(!showBedroomsDropdown);
                  setShowBathroomsDropdown(false);
                }}
              >
                <Text>{bedrooms}</Text>
                <Ionicons
                  name={showBedroomsDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>

              {/* Bedrooms Dropdown */}
              {showBedroomsDropdown && (
                <View className="absolute top-[72px] left-0 right-0 border border-gray-200 rounded-md bg-white shadow-md z-50 max-h-52 overflow-y-scroll">
                  {bedroomOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className={`p-3 border-b border-gray-100 ${option === bedrooms ? "bg-gray-100" : ""}`}
                      onPress={() => {
                        setBedrooms(option);
                        setShowBedroomsDropdown(false);
                      }}
                    >
                      <Text
                        className={`${option === bedrooms ? "font-medium" : ""}`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="flex-1 ml-2">
              <Text className="mb-2 text-base font-medium">Bathrooms</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
                onPress={() => {
                  setShowBathroomsDropdown(!showBathroomsDropdown);
                  setShowBedroomsDropdown(false);
                }}
              >
                <Text>{bathrooms}</Text>
                <Ionicons
                  name={showBathroomsDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>

              {/* Bathrooms Dropdown */}
              {showBathroomsDropdown && (
                <View className="absolute top-[72px] left-0 right-0 border border-gray-200 rounded-md bg-white shadow-md z-50 max-h-52 overflow-y-scroll">
                  {bathroomOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className={`p-3 border-b border-gray-100 ${option === bathrooms ? "bg-gray-100" : ""}`}
                      onPress={() => {
                        setBathrooms(option);
                        setShowBathroomsDropdown(false);
                      }}
                    >
                      <Text
                        className={`${option === bathrooms ? "font-medium" : ""}`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Facility Options */}
          <View className="my-4">
            <Text className="mb-2 text-base font-medium">Facility Place</Text>
            <View className="flex-row flex-wrap">
              {facilities.map((facility) => (
                <TouchableOpacity
                  key={facility.id}
                  className={`rounded-full py-2 px-4 mr-3 mb-3 ${
                    selectedFacilities.includes(facility.id)
                      ? "bg-black"
                      : "bg-gray-100"
                  }`}
                  onPress={() => toggleFacility(facility.id)}
                >
                  <Text
                    className={`${
                      selectedFacilities.includes(facility.id)
                        ? "text-white"
                        : "text-gray-700"
                    } font-medium`}
                  >
                    {facility.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bottom spacing */}
          <View className="h-24" />
        </ScrollView>

        {/* Apply Filters Button */}
        <View className="absolute bottom-10 left-5 right-5">
          <TouchableOpacity
            className="bg-[#D1FC56] rounded-2xl py-4 items-center"
            onPress={applyFilters}
          >
            <Text className="text-black font-bold text-lg">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
