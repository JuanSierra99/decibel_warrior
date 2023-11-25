import React, {Component, useContext, useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {withNavigation} from 'react-navigation';
import SettingsPage from './SettingsPage';
import Svg, {Circle, Line} from 'react-native-svg';
import Sound from 'react-native-sound';
import AppContext from './AppContext';
import AboutPage from './AboutPage';

const Stack = createNativeStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const percent = windowWidth * 0.0025; //Get half of 1 percent of window width

// This is a class component. Serves similar purpose as functional component
// Im writing this as a class component just to learn how to write them. All my
// Other components will be functional components. Functional components are the new way.
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
      gameOverMeter: 0,
      score: 0,
      velocityX: 2,
      velocityY: 2,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      {
        /*It's recommended to use the functional form of setState
        when the new state depends on the previous state. */
      }
      if (this.state.radiusX >= windowWidth || this.state.radiusX <= 0) {
        this.setState(prevState => ({velocityX: prevState.velocityX * -1}));
      }
      if (this.state.radiusY >= windowHeight || this.state.radiusY <= 0) {
        this.setState(prevState => ({velocityY: prevState.velocityY * -1}));
      }
      this.setState(prevState => ({
        radiusX: prevState.radiusX + this.state.velocityX,
        radiusY: prevState.radiusY + this.state.velocityY,
      }));
      this.checkIfWithinRadius();
    }, 30);
  }

  componentWillUnmount() {
    console.log('FollowRadiusGame is unmounting');

    // Remove the blur listener when the component is unmounted
    this.blurListener && this.blurListener();
    clearInterval(this.interval);
    this.state.sound.stop(() => {
      console.log('Sound stopped successfully');
    });
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
      // this.checkIfWithinRadius();
      // Check if the finger is within the radius
    },
  });

  resetGame = () => {
    this.setState({
      radiusX: 300,
      radiusY: 300,
      fingerX: 0,
      fingerY: 0,
      inRadius: false,
      gameOverMeter: 0,
      score: 0,
      velocityX: 2,
      velocityY: 2,
    });
  };

  checkIfWithinRadius() {
    const {radiusX, radiusY, fingerX, fingerY, sound} = this.state;
    const distance = Math.sqrt(
      Math.pow(fingerX - radiusX, 2) + Math.pow(fingerY - radiusY, 2),
    );

    // Define a threshold for being within the radius
    const radiusThreshold = 100;

    // User is within the radius
    if (distance < radiusThreshold) {
      sound.stop(() => {});
      // Update the radius position
      this.setState(prevState => ({
        inRadius: true,
        score: prevState.score + 5,
      }));
    } else {
      this.setState(prevState => ({
        inRadius: false,
        gameOverMeter: prevState.gameOverMeter + percent,
      }));
      if (this.state.gameOverMeter >= windowWidth) {
        sound.stop(() => {
          console.log('Sound stopped successfully');
        });
        this.resetGame();
        this.props.onGameOver(this.state.score);
        // Reset the game after calling onGameOver
        return;
      } else if (!sound.isPlaying()) {
        sound.play(success => {
          if (success) {
            console.log('sound play succesfully');
          } else {
            console.log('Sound failed to play');
          }
        });
      }
    }
  }

  render() {
    const {radiusX, radiusY, fingerX, fingerY, inRadius, gameOverMeter} =
      this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: inRadius ? 'green' : 'red',
        }}
        {...this.panResponder.panHandlers}>
        <Svg height={windowHeight} width={windowWidth}>
          <Text>{String(this.state.inRadius)}</Text>
          <Text>{String(this.state.gameOverMeter)}</Text>
          <Text>{windowWidth}</Text>
          <Text>{windowHeight}</Text>
          <Text>Score: {this.state.score}</Text>
          <Line
            x1="0"
            y1="10"
            x2={this.state.gameOverMeter}
            y2="10"
            stroke="blue"
            strokeWidth="20"
          />
          {/* <Circle
            cx={radiusX}
            cy={radiusY}
            r="30"
            fill="blue"
            name="Safe Zone"
          /> */}
          <Circle
            cx={fingerX}
            cy={fingerY}
            r="15"
            fill="blue"
            name="Finger Zone"
          />
        </Svg>
      </View>
    );
  }
}

const Game = ({navigation}) => {
  const handleGameOver = score => {
    // Navigate to GameOverScreen and pass the score as a parameter
    navigation.navigate('GameOverScreen', {score});
  };
  const context = useContext(AppContext);
  return (
    // If i wrap in view i dont see background. WHYYYYY ?!??!?!?!?
    <FollowRadiusGame
      soundEffect={context.soundEffect}
      onGameOver={handleGameOver}></FollowRadiusGame>
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

const GameOverScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text>Title</Text>
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
        // sound.setNumberOfLoops(-1);
        setSoundEffect(sound);
      }
    });
  }, []);

  // Function to change sound given the file name
  const changeSound = file_name => {
    // If we have a sound then stop and release it.
    if (soundEffect) {
      soundEffect.stop(); // Stop the current sound
      soundEffect.release(); // Release resources
    }
    // Create new Sound, then update soundEffect State
    const newSound = new Sound(file_name, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('failed to load the sound', error);
      } else {
        // newSound.setNumberOfLoops(-1);
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
            name="GameOverScreen"
            component={GameOverScreen}></Stack.Screen>
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
