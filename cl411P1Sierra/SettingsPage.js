import React, {useContext, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppContext from './AppContext';

const SettingsPage = () => {
  const navigation = useNavigation();
  const context = useContext(AppContext);

  const soundData = [
    {id: 'wet_fart.mp3', label: 'WET FART'},
    {id: 'baby_cry.mp3', label: 'CRY BABY'},
    {id: 'snore.mov', label: 'SNORE'},
    {id: 'alarm.mp3', label: 'SIREN'},
    {id: 'brother_gone.mp3', label: 'THAT BROTHER GONE'},
  ];

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
        <Text>WET FART</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('baby_cry.mp3');
          console.log('Sound changed');
        }}>
        <Text>CRY BABY</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('snore.mov');
          console.log('Sound changed');
        }}>
        <Text>SNORE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('siren.mp3');
          console.log('Sound changed');
        }}>
        <Text>SIREN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('brother_gone.mp3');
          console.log('Sound changed');
        }}>
        <Text>THAT BROTHER GONE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('bruh.mp3');
          console.log('Sound changed');
        }}>
        <Text>BRUH</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('mimis.mp3');
          console.log('Sound changed');
        }}>
        <Text>SLEEPY</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('my_hero.mp3');
          console.log('Sound changed');
        }}>
        <Text>MY HERO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('oh_my_god.mp3');
          console.log('Sound changed');
        }}>
        <Text>OH MY GOD</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('pain_and_agony.mp3');
          console.log('Sound changed');
        }}>
        <Text>PAIN AND AGONY</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.changeSound('thud.mp3');
          console.log('Sound changed');
        }}>
        <Text>THUD</Text>
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
