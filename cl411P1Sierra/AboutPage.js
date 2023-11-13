import {useNavigation} from '@react-navigation/native';
import {Text, View, TouchableOpacity} from 'react-native';

const AboutPage = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('TitleScreen');
        }}>
        <Text>Title Page</Text>
      </TouchableOpacity>
      <Text>Juan Sierra</Text>
      <Text>
        https://docs.google.com/spreadsheets/d/124H73mvv7G6EfrJwA-zIdJReDiOmnpNedTeeuUa_l4A/edit
      </Text>
    </View>
  );
};

export default AboutPage;
