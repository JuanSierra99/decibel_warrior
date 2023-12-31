import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {Text, View, FlatList, Pressable} from 'react-native';
import style from './style';
import {useNavigation} from '@react-navigation/native';
const saveScores = async score => {
  try {
    const storedScoresString = await AsyncStorage.getItem('leaderboard');
    const storedScores = storedScoresString
      ? JSON.parse(storedScoresString)
      : [];
    storedScores.push(score);
    const sortedScores = storedScores.sort((a, b) => b - a);
    // Take only the top 10 scores
    const top10Scores = storedScores.slice(0, 5);
    await AsyncStorage.setItem('leaderboard', JSON.stringify(top10Scores));
  } catch (error) {
    console.log('Error updating leaderboard: ', error);
  }
};

const HighScores = () => {
  const navigation = useNavigation();
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardString = await AsyncStorage.getItem('leaderboard');
        if (leaderboardString != null) {
          const leaderboardData = leaderboardString
            ? JSON.parse(leaderboardString)
            : [];
          setLeaderboard(leaderboardData);
        } else {
          console.log('leaderboard is null');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View style={style.body}>
      <Pressable
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text style={style.returnButton}>Back</Text>
      </Pressable>
      <Text style={style.decibelWarriorText}>TOP 5 SCORES:</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <Text style={style.Buttons}>{`${index + 1}. Score: ${item}`}</Text>
        )}
      />
    </View>
  );
};

export {saveScores, HighScores};
