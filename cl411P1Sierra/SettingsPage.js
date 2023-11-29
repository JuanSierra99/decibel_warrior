import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AppContext from './AppContext';
import style from './style';
import {useNavigation} from '@react-navigation/native';

const SoundButton = props => {
  const {name, file, color} = props;
  const context = useContext(AppContext);
  return (
    <TouchableOpacity
      onPress={() => {
        context.changeSound(file);
        console.log('Sound changed');
      }}>
      <Text style={[style.Buttons, {color}]}>{name}</Text>
    </TouchableOpacity>
  );
};

const SettingsPage = () => {
  const navigation = useNavigation();
  return (
    <View style={style.body}>
      <TouchableOpacity onPress={() => navigation.navigate('TitleScreen')}>
        <Text style={style.returnButton}>Return to Title Screen</Text>
      </TouchableOpacity>
      <Text style={style.decibelWarriorText}>SELECT A SOUND</Text>
      <SoundButton
        name="WET FART"
        file="wet_fart.mp3"
        color="white"></SoundButton>
      <SoundButton
        name="CRY BABY"
        file="baby_cry.mp3"
        color="white"></SoundButton>
      <SoundButton name="SNORE" file="snore.mov" color="white"></SoundButton>
      <SoundButton name="SIREN" file="siren.mp3" color="white"></SoundButton>
      <SoundButton
        name="BROTHER GONE"
        file="brother_gone.mp3"
        color="white"></SoundButton>
      <SoundButton name="BRUH" file="bruh.mp3" color="white"></SoundButton>
      <SoundButton name="SNOOZY" file="mimis.mp3" color="white"></SoundButton>
      <SoundButton name="HERO" file="my_hero.mp3" color="white"></SoundButton>
      <SoundButton
        name="OH MY GOD"
        file="oh_my_god.mp3"
        color="white"></SoundButton>
      <SoundButton
        name="PAIN AND AGONY !"
        file="pain_and_agony.mp3"
        color="white"></SoundButton>
      <SoundButton
        name="DORMHUB"
        file="dormhub.mp3"
        color="white"></SoundButton>
      <SoundButton name="THUD" file="thud.mp3" color="white"></SoundButton>
    </View>
  );
};

export default SettingsPage;
