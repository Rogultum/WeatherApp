import React from "react"
// import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ImageStyle } from "react-native"
// import { StackScreenProps } from "@react-navigation/stack"
// import { AppStackScreenProps } from "../navigators"
import { AutoImage, Icon, Screen, Text } from "../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `<%= props.pascalCaseName %>: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="<%= props.pascalCaseName %>" component={<%= props.pascalCaseName%>Screen} />`
// Hint: Look for the 🔥!

export const WeatherScreen = () => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  //   const navigation = useNavigation()

  // source={require("../../assets/images/sun.png")}
  return (
    <Screen contentContainerStyle={$container} safeAreaEdges={["top"]} preset="scroll">
      <View style={$container}>
        <Text style={$degree} text="35°" size="xxl" />
        <AutoImage style={$image} maxWidth={300} source={require("../../assets/images/sun.png")} />
        <Text text="ANK" size="xl" />
        <View style={$iconContainer}>
          <Icon containerStyle={$icon} size={32} icon="humidity" />
          <Icon containerStyle={$icon} size={32} icon="wind" />
          <Icon containerStyle={$icon} size={32} icon="air" />
        </View>
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,

  justifyContent: "center",
  alignItems: "center",
  paddingTop: 5,
  paddingHorizontal: 5,
}
const $degree: TextStyle = {
  zIndex: 2,
}
const $iconContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
}
const $icon: ViewStyle = {
  borderWidth: 0.7,
  borderRadius: 20,
  padding: 5,
}
const $image: ImageStyle = {
  zIndex: 1,
  position: "absolute",
}
