import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import TodoListScreen from "./TodoListScreen";
import AddTodoScreen from "./AddTodoScreen";
import ProfileScreen from "./ProfileScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#fff", height: 60 },
        }}
      >
        <Tab.Screen
          name="Todos"
          component={TodoListScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="format-list-bulleted" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddTodoScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="plus-circle" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="account-circle" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
  
)};

export default HomeScreen;
