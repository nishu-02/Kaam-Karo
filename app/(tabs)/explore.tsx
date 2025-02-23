import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Alert } from "react-native";
import { Card, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";

const STREAK_KEY = "streak";
const LAST_PLAYED_KEY = "last_played";

const challenges = [
  "🔥 Do 10 push-ups!",
  "😊 Say something nice to yourself!",
  "😂 Tell a joke to a friend!",
  "🤸 Stretch for 30 seconds!",
  "🎵 Dance to your favorite song!",
  "📖 Read 1 page of a book!",
];

const getRandomChallenge = () => challenges[Math.floor(Math.random() * challenges.length)];

const explore = () => {
  const [streak, setStreak] = useState<number>(0);
  const [challenge, setChallenge] = useState<string>("");
  const scaleAnim = new Animated.Value(0.9); // Animation for pop effect

  useEffect(() => {
    checkStreak();
    setChallenge(getRandomChallenge());
    animateCard();
  }, []);

  const animateCard = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const checkStreak = async () => {
    try {
      const lastPlayed = await AsyncStorage.getItem(LAST_PLAYED_KEY);
      const storedStreak = await AsyncStorage.getItem(STREAK_KEY);

      const today = new Date().setHours(0, 0, 0, 0);
      const lastDate = lastPlayed ? new Date(parseInt(lastPlayed)).setHours(0, 0, 0, 0) : null;

      if (!lastDate) {
        await AsyncStorage.setItem(STREAK_KEY, "1");
        await AsyncStorage.setItem(LAST_PLAYED_KEY, today.toString());
        setStreak(1);
        return;
      }

      const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        const newStreak = (storedStreak ? parseInt(storedStreak) : 0) + 1;
        await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
        setStreak(newStreak);
      } else if (diffDays > 1) {
        await AsyncStorage.setItem(STREAK_KEY, "1");
        setStreak(1);
      }
    } catch (error) {
      console.error("Error checking streak:", error);
    }
  };

  const completeChallenge = async () => {
    Alert.alert("🎉 Challenge Completed!", `You did: ${challenge}`, [
      {
        text: "Awesome!",
        onPress: async () => {
          const today = new Date().setHours(0, 0, 0, 0);
          await AsyncStorage.setItem(LAST_PLAYED_KEY, today.toString());

          const newStreak = streak + 1;
          await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());

          setStreak(newStreak);
          setChallenge(getRandomChallenge());
          animateCard();
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Card style={styles.card} elevation={5}>
          <Card.Title title="🔥 Streak Tracker" subtitle={`Current Streak: ${streak} days`} />
          <Card.Content>
            <Text style={styles.challengeText}>{challenge}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" icon="check-circle" onPress={completeChallenge} style={styles.button}>
              I Did It!
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "90%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
  },
  challengeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#ff4081",
  },
});

export default explore;
