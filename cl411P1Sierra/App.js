import React, {Component} from 'react';
import {Text, View, PanResponder, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsPage from './SettingsPage';
import Svg, {Circle} from 'react-native-svg';
import Sound from 'react-native-sound';

const Stack = createNativeStackNavigator();

//configure sound for playback
Sound.setCategory('Playback');
const sound = new Sound('scream_sound_effect.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.error('failed to load the sound', error);
  }
});
sound.setNumberOfLoops(-1);

class FollowRadiusGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radiusX: 150, // Initial radius X position
      radiusY: 150, // Initial radius Y position
      fingerX: 0, // Initial finger X position
      fingerY: 0, // Initial finger Y position
      inRadius: false,
    };
  }

  // Initialize PanResponder for tracking finger movements
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Update the finger position
      this.setState({
        fingerX: gestureState.moveX,
        fingerY: gestureState.moveY,
      });

      // Check if the finger is within the radius
      this.checkIfWithinRadius();
    },
  });

  checkIfWithinRadius() {
    const {radiusX, radiusY, fingerX, fingerY} = this.state;
    const distance = Math.sqrt(
      Math.pow(fingerX - radiusX, 2) + Math.pow(fingerY - radiusY, 2),
    );

    // Define a threshold for being within the radius
    const radiusThreshold = 30;

    if (distance < radiusThreshold) {
      sound.stop(() => {});

      // User is within the radius, update the radius position
      this.setState({
        radiusX: radiusX, // new X position,
        radiusY: radiusY, // new Y position,
        inRadius: true,
      });
    } else {
      this.setState({
        inRadius: false,
      });
      if (!sound.isPlaying()) {
        sound.play(success => {
          if (success) {
            console.log('sound played succesfully');
          } else {
            console.log('Sound failed to play');
          }
        });
      }
    }
  }

  render() {
    const {radiusX, radiusY, fingerX, fingerY} = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.inRadius ? 'blue' : 'red',
        }}
        {...this.panResponder.panHandlers}>
        <Svg height="300" width="300">
          <Text>{String(this.state.inRadius)}</Text>
          <Circle cx={radiusX} cy={radiusY} r="30" fill="blue" />
        </Svg>
        <View // The styling is what creates our little green circle so we can see where our finger is at
          style={{
            position: 'absolute',
            left: fingerX,
            top: fingerY,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'green',
          }}
        />
      </View>
    );
  }
}

const TitleScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('GameScreen');
        }}>
        <Text>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SettingsPage');
        }}>
        <Text>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AboutScreen');
        }}>
        <Text>About</Text>
      </TouchableOpacity>
    </View>
  );
};

const AboutPage = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text>Juan Sierra</Text>
        <Text>
          https://docs.google.com/spreadsheets/d/124H73mvv7G6EfrJwA-zIdJReDiOmnpNedTeeuUa_l4A/edit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TitleScreen" component={TitleScreen}></Stack.Screen>
        <Stack.Screen name="GameScreen" component={FollowRadiusGame} />
        <Stack.Screen name="AboutScreen" component={AboutPage} />
        <Stack.Screen
          name="SettingsPage"
          component={SettingsPage}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
