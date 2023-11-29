import React, {useContext, useState, useEffect, useRef} from 'react';
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
import {saveScores, HighScores} from './HighScores';
import HowToPlay from './HowToPlayPage';
import style from './style';

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

  // Giving me issues when i try to navigte to GameOverScreen
  useEffect(() => {
    // console.log('here1');
    checkIfWithinRadius();
    return () => {
      // Cleanup code here
    };
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
        if (Math.random() <= 0.01) {
          velocityX *= -1; // Adjust the factor as needed
        }
        if (Math.random() <= 0.01) {
          velocityY *= -1; // Adjust the factor as needed
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
      setFingerX(gestureState.moveX);
      setFingerY(gestureState.moveY);
    },
  });

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
    // console.log('X', fingerX);
    // console.log('y', fingerY);
    const distance = Math.sqrt(
      Math.pow(fingerX - radiusX, 2) + Math.pow(fingerY - radiusY, 2),
    );
    const radiusThreshold = 150;
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
        // props.onGameOver(state.score);
        saveScores(state.score);
        return navigation.navigate('TitleScreen', state.score);
      } else {
        const sound = soundRef.current;
        if (sound && !sound.isPlaying()) {
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
        {/* <Text>{String(state.inRadius)}</Text> */}
        {/* <Text>{String(state.gameOverMeter)}</Text> */}
        <Text
          style={[
            style.TitleScreenButtons,
            {color: 'white', textAlign: 'center'},
          ]}>
          Score: {state.score}
        </Text>
        <Line
          x1="0"
          y1="10"
          x2={state.gameOverMeter}
          y2="10"
          stroke="blue"
          strokeWidth="20"
        />
        {/* <Circle
          cx={state.radiusX}
          cy={state.radiusY}
          r="30"
          fill="blue"
          name="Safe Zone"
        /> */}
        {/* <Circle
          cx={fingerX}
          cy={fingerY}
          r="15"
          fill="white"
          name="Finger Zone"
        /> */}
      </Svg>
    </View>
  );
};

const Game = ({}) => {
  const context = useContext(AppContext);
  return (
    // If i wrap in view i dont see background. WHYYYYY ?!??!?!?!?
    <FollowRadiusGame soundEffect={context.soundEffect}></FollowRadiusGame>
  );
};

const TitleScreen = ({route}) => {
  const score = route.params ? route.params : 0;
  const navigation = useNavigation();
  return (
    <View style={style.body}>
      <Text style={style.decibelWarriorText}>Decible Warrior</Text>
      <View style={style.buttonsContainer}>
        <Text style={[style.Buttons, {color: 'white'}]}>
          {/*Show last score if there is one*/}
          {score > 0 && `Last Score ${score}`}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GameScreen');
          }}>
          <Text style={[style.Buttons, {color: '#3499E0'}]}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SettingsPage');
          }}>
          <Text style={[style.Buttons, {color: '#A73ADF'}]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HighScores');
          }}>
          <Text style={[style.Buttons, {color: '#F57838'}]}>High Scores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HowToPlay');
          }}>
          <Text style={[style.Buttons, {color: 'lavender'}]}>HowToPlay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AboutScreen');
          }}>
          <Text style={[style.Buttons, {color: '#27DF4E'}]}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  // The sound that will play when user finger leaves safe zone radius
  const [soundEffect, setSoundEffect] = useState(null);
  // set default sound. updates soundEffect state
  useEffect(() => {
    Sound.setCategory('Playback');
    const sound = new Sound('snore.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('failed to load the sound', error);
      } else {
        setSoundEffect(sound);
      }
    });
  }, []);

  useEffect(() => {
    if (soundEffect) {
      soundEffect.play();
    }
  }, [soundEffect]);

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
        setSoundEffect(newSound);
      }
    });
  };
  // // Context to be shared between pages
  const context = {soundEffect, changeSound};
  return (
    <AppContext.Provider value={context}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TitleScreen"
            component={TitleScreen}
            options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen
            name="GameScreen"
            component={Game}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AboutScreen"
            component={AboutPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SettingsPage"
            options={{headerShown: false}}
            component={SettingsPage}></Stack.Screen>
          <Stack.Screen
            name="HighScores"
            component={HighScores}
            options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen
            name="HowToPlay"
            component={HowToPlay}
            options={{headerShown: false}}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
