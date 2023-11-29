import {useNavigation} from '@react-navigation/native';
import {Text, View, TouchableOpacity} from 'react-native';
import style from './style';

const AboutPage = () => {
  const navigation = useNavigation();
  return (
    <View style={style.body}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text style={style.returnButton}>Back</Text>
      </TouchableOpacity>
      <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
        Juan Sierra
      </Text>
      <Text style={{color: 'white'}}>
        https://docs.google.com/spreadsheets/d/124H73mvv7G6EfrJwA-zIdJReDiOmnpNedTeeuUa_l4A/edit
      </Text>
    </View>
  );
};

export default AboutPage;
