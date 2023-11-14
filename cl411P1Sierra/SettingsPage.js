import React, {useContext} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppContext from './AppContext';
import App from './App';

const SettingsPage = () => {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  // const context = useContext(AppContext);
  // const soundEnabled = context.soundEnabled;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity onPress={() => navigation.navigate('TitleScreen')}>
        <Text>Return to Title Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('wet_fart.mp3');
          console.log('Sound changed');
        }}>
        <Text>Wet Fart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('baby_cry.mp3');
          console.log('Sound changed');
        }}>
        <Text>Baby</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('snore.mov');
          console.log('Sound changed');
        }}>
        <Text>snore</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  soundToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsPage;
