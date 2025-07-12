import { TextInput, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import tw from "twrnc";
import { useState } from "react";


function StartGameScreen() {
  const [enteredNumber, setEnteredNumber] = useState("");

  const numberInputHandler = (inputText) => {
    setEnteredNumber(inputText);
  }

  const resetInputHandler = () => {
    setEnteredNumber("");
  }

  const confirmInputHandler = () => { 
    const chosenNumber = parseInt(enteredNumber);
    if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
      console.warn("Invalid number! Please enter a number between 1 and 99.");
      return;
    }
    console.log("Confirmed number:", chosenNumber);
    setEnteredNumber(""); 
  }

  return (
    <View style={tw`justify-center mt-10 flex-col gap-4 items-center bg-blue-200 shadow-md p-6 rounded-lg`}>
      <TextInput value={enteredNumber} onChangeText={numberInputHandler} autoCapitalize="none" autoCorrect={false} style={tw`p-2 text-center text-4xl border-b-2 border-blue-500 text-blue-500 px-3 font-bold w-[30%]`} maxLength={2} keyboardType="number-pad"/>
      <View style={tw`flex-row justify-center gap-4 w-full`}>
        <PrimaryButton bg="bg-red" onPress={resetInputHandler}>Reset</PrimaryButton>
        <PrimaryButton bg="bg-purple" onPress={confirmInputHandler}>Confirm</PrimaryButton>
      </View>
    </View>
  );
}
export default StartGameScreen;
