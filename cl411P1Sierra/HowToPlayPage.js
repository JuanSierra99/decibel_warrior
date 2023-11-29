import {useNavigation} from '@react-navigation/native';
import {Text, View, TouchableOpacity} from 'react-native';
import style from './style';

const HowToPlay = () => {
  const navigation = useNavigation();
  return (
    <View style={style.body}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text style={style.returnButton}>Back</Text>
      </TouchableOpacity>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        HOW TO PLAY
      </Text>
      <Text style={{color: 'white', paddingBottom: 20}}>
        INSTRUCTIONS: Theres an invisible radius thats moving around in your
        screen, try to find it and follow it with your finger
      </Text>
      <Text style={{color: 'white', paddingBottom: 20}}>
        TIP: When the background is red, and the sound is playing, that means
        that you are not near the radius
      </Text>
      <Text style={{color: 'white', paddingBottom: 20}}>
        TIP: When the background is green and the sound stops or isnt playing,
        that means you are withing the radisu. Dont lose it !
      </Text>
      <Text style={{color: 'white', paddingBottom: 20}}>
        SCORING: You can increase your score by staying within the moving radius
      </Text>
      <Text style={{color: 'white'}}>
        GAME OVER: If the bar up top reaches the edge of your screen, you will
        lose !
      </Text>
    </View>
  );
};

export default HowToPlay;
