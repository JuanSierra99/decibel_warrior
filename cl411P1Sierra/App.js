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

const FollowRadiusGame = props => {
  const navigation = useNavigation();
  const [fingerX, setFingerX] = useState(0);
  const [fingerY, setFingerY] = useState(0);
  const [state, setState] = useState({
    radiusX: 300,
    radiusY: 300,
    inRadius: false,
    sound: props.soundEffect,
    gameOverMeter: 0,
    score: 0,
    velocityX: 4,
    velocityY: 4,
  });

  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = state.sound;
  }, [state.sound]);

  useEffect(() => {
    checkIfWithinRadius();
  }, [state.radiusX, state.radiusY]);

  useEffect(() => {
    let animationId = null;
    const animate = () => {
      setState(prevState => {
        let {radiusX, radiusY, velocityX, velocityY, gameOverMeter, score} =
          prevState;

        if (radiusX >= windowWidth || radiusX <= 0) {
          velocityX = -velocityX;
        }
        if (radiusY >= windowHeight || radiusY <= 0) {
          velocityY = -velocityY;
        }

        radiusX += velocityX;
        radiusY += velocityY;

        return {
          ...prevState,
          radiusX,
          radiusY,
          velocityX,
          velocityY,
          gameOverMeter,
          score,
        };
      });
      animationID = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Initialize PanResponder for tracking finger movements
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Update the finger position
      console.log('Pans');
      console.log(gestureState.moveX);
      setFingerX(gestureState.moveX);
      console.log('New X', fingerX);
      setFingerY(gestureState.moveY);
    },
  });

  // ... (remaining code)

  const resetGame = () => {
    setState({
      radiusX: 300,
      radiusY: 300,
      inRadius: false,
      gameOverMeter: 0,
      score: 0,
      velocityX: 4,
      velocityY: 4,
    });
  };

  const checkIfWithinRadius = () => {
    const {radiusX, radiusY} = state;
    console.log('X', fingerX);
    console.log('y', fingerY);
    const distance = Math.sqrt(
      Math.pow(fingerX - radiusX, 2) + Math.pow(fingerY - radiusY, 2),
    );
    const radiusThreshold = 100;
    // User finger is within radius
    if (distance < radiusThreshold) {
      const sound = soundRef.current;
      if (sound.isPlaying()) {
        sound.stop(() => {
          console.log('Sound stopped successfully');
        });
      }
      setState(prevState => ({
        ...prevState,
        inRadius: true,
        score: prevState.score + 5,
      }));
    } else {
      // user finger not within radius
      setState(prevState => ({
        ...prevState,
        inRadius: false,
        gameOverMeter: prevState.gameOverMeter + percent,
      }));
      if (state.gameOverMeter >= windowWidth) {
        const sound = soundRef.current;
        resetGame();
        navigation.navigate('GameOverScreen');
        props.onGameOver(state.score);
      } else {
        const sound = soundRef.current;
        if (!sound || !sound.isPlaying()) {
          sound.play(success => {
            if (success) {
              console.log('sound play successfully');
            } else {
              console.log('Sound failed to play');
            }
          });
        }
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: state.inRadius ? 'green' : 'red',
      }}
      {...panResponder.panHandlers}>
      <Svg height={windowHeight} width={windowWidth}>
        <Text>{String(state.inRadius)}</Text>
        <Text>{String(state.gameOverMeter)}</Text>
        <Text>{windowWidth}</Text>
        <Text>{windowHeight}</Text>
        <Text>Score: {state.score}</Text>
        <Line
          x1="0"
          y1="10"
          x2={state.gameOverMeter}
          y2="10"
          stroke="blue"
          strokeWidth="20"
        />
        <Circle
          cx={state.radiusX}
          cy={state.radiusY}
          r="30"
          fill="blue"
          name="Safe Zone"
        />
        <Circle
          cx={fingerX}
          cy={fingerY}
          r="15"
          fill="white"
          name="Finger Zone"
        />
      </Svg>
    </View>
  );
};

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
