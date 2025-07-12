import StartGameScreen from "@/screens/StartGameScreen.js";
import {  ImageBackground } from "react-native";
import tw from "twrnc";


export default function HomeScreen() {
  return  (
      <ImageBackground source={require('../../assets/images/1650480060448.jpeg')} resizeMode="cover" style={tw`flex-1 px-5 py-10`} imageStyle={tw`opacity-90`}>
      <StartGameScreen />;
    </ImageBackground>
  )
}
