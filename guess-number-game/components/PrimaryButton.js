import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

function PrimaryButton({ children, bg, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        pressed
          ? tw`${bg}-600  px-4 py-3 rounded-full w-[50%]`
          : tw`${bg}-500 px-4 py-3 rounded-full w-[50%]`
      }
    >
      <View>
        <Text style={tw`font-semibold text-white text-center`}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default PrimaryButton;
