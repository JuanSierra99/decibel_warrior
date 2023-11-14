import React, {Component, useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsPage from './SettingsPage';
import Svg, {Circle, Line} from 'react-native-svg';
import Sound from 'react-native-sound';
import AppContext from './AppContext';
import AboutPage from './AboutPage';

const Stack = createNativeStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// This is a class component. Serves similar purpose as functional component
// Im writing this as a class component just to learn how to write them. All my
// Other components will be functional components.
class FollowRadiusGame extends Component {
  // constructor to set the values for class
  constructor(props) {
    super(props);

    this.state = {
      radiusX: 300, // Initial radius X position
      radiusY: 300, // Initial radius Y position
      fingerX: 0, // Initial finger X position
      fingerY: 0, // Initial finger Y position
      inRadius: false,
      sound: props.soundEffect,
    };
  }

  // componentDidMount() {
  //   this.interval = setInterval(() => {
  //     {
  //       /*It's recommended to use the functional form of setState
  //       when the new state depends on the previous state. */
  //     }
  //     this.setState(prevState => ({radiusX: prevState.radiusX - 3}));
  //     if (this.state.radiusX == 0) {
  //       this.setState({radiusX: 300});
  //     }
  //   }, 10);
  // }

  // componentWillUnmount() {
  //   // Clear the interval when the component is unmounted
  //   clearInterval(this.interval);
  // }

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
    const {radiusX, radiusY, fingerX, fingerY, sound} = this.state;
    const distance = Math.sqrt(
      Math.pow(fingerX - radiusX, 2) + Math.pow(fingerY - radiusY, 2),
    );

    // Define a threshold for being within the radius
    const radiusThreshold = 45;

    // User is within the radius
    if (distance < radiusThreshold) {
      sound.stop(() => {});

      // Update the radius position
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
    const {radiusX, radiusY, fingerX, fingerY, inRadius} = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: inRadius ? 'green' : 'red',
        }}
        {...this.panResponder.panHandlers}>
        <Svg height={windowHeight} width={windowWidth}>
          <Text>{String(this.state.inRadius)}</Text>
          <Line
            x1="0"
            y1="10"
            x2={windowWidth}
            y2="10"
            stroke="blue"
            strokeWidth="20"
          />
          <Circle cx={radiusX} cy={radiusY} r="30" fill="blue" />
          <Circle cx={fingerX} cy={fingerY} r="15" fill="blue" />
        </Svg>
        {/* <View // The styling is what creates our little green circle so we can see where our finger is at
          style={{
            position: 'absolute',
            left: fingerX,
            top: fingerY,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'blue',
          }}
        /> */}
      </View>
    );
  }
}

const Game = () => {
  const context = useContext(AppContext);
  return (
    // If i wrap in view i dont see background. WHYYYYY ?!??!?!?!?
    <FollowRadiusGame soundEffect={context.soundEffect}></FollowRadiusGame>
  );
};

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

const App = () => {
  // The sound that will play when user finger leaves safe zone radius
  const [soundEffect, setSoundEffect] = useState(null);
  useEffect(() => {
    Sound.setCategory('Playback');
    const sound = new Sound('snore.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('failed to load the sound', error);
      } else {
        sound.setNumberOfLoops(-1);
        setSoundEffect(sound);
        // sound.play(success => {
        //   if (success) {
        //     console.log('Sound is playing');
        //   } else {
        //     console.log('Sound failed to play');
        //   }
        // });
      }
    });
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const changeSound = file_name => {
    if (soundEffect) {
      soundEffect.stop(); // Stop the current sound
      soundEffect.release(); // Release resources
    }
    const newSound = new Sound(file_name, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('failed to load the sound', error);
      } else {
        newSound.setNumberOfLoops(-1);
        // newSound.play();
        setSoundEffect(newSound);
      }
    });
  };
  // // Context shared between all pages
  const context = {soundEffect, changeSound};
  return (
    <AppContext.Provider value={context}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TitleScreen"
            component={TitleScreen}></Stack.Screen>
          <Stack.Screen
            name="GameScreen"
            component={Game}
            options={{headerShown: false}}
          />
          <Stack.Screen name="AboutScreen" component={AboutPage} />
          <Stack.Screen
            name="SettingsPage"
            component={SettingsPage}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
