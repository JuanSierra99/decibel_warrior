import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  body: {
    backgroundColor: 'rgb(40, 40, 40)',
    height: '100%',
    width: '100%',
  },
  decibelWarriorText: {
    fontFamily: 'Frijole-Regular',
    textAlign: 'center',
    color: 'red',
    fontSize: 32,
    paddingTop: 32,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  Buttons: {
    fontFamily: 'Frijole-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  returnButton: {
    color: 'white',
  },
});

export default style;
