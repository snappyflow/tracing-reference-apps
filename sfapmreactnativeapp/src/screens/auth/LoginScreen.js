import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Button, SocialIcon } from 'react-native-elements';
import LoginScreen, {SocialButton} from 'react-native-login-screen';
import LoadingModal from '../../components/LoadingModal';
import {useAuth} from '../../contexts/Auth';

export default function LoginScreen2() {
  const [loading, isLoading] = useState(false);
  const auth = useAuth();
  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);
  let username = '';
  let password1 = '';
//   const [username1, setUserName1] = useState('');
//   const [password1, setPassword1] = useState('')

  const onHandleLogin = async () => {
    // console.log('user', username);
    // console.log('pass', password1);
    // AsyncStorage.setItem("auth", JSON.stringify(auth));
    isLoading(true);
    await auth.signIn(username, password1);
    isLoading(false);
  }

  return (
    // <TouchableWithoutFeedback
    //   onPress={() => {
    //     Keyboard.dismiss();
    //   }}
    // >
      <View
        colors={['#222', '#222', '#111']}
        style={styles.container}
      >
        {/* <Text style={styles.welcomeText}>SnappyFlow</Text>
        <Text style={styles.loginText}>Login</Text> */}
        <LoginScreen
            logoImageSource={require('../../images/login-logo-new.png')}
            onLoginPress={() => {
                onHandleLogin();
            }}
            // onSignupPress={() => {}}
            onEmailChange={(value) => {
            username = value;
            // console.log('username: ', username);
            // setUserName(value)
            }}
            disableSignup={true}
            onPasswordChange={(password) => {
              password1 = password;
            //   setPassword(value)
            //   console.log('password: ', password);
            }}
            emailPlaceholder={'Username'}
        >
            <SocialButton text="Continue with Google" onPress={() => {}} imageSource={require('../../images/google.png')} />
            {/* <Button
              
              icon={
                <Icon
                  size={10}
                  color="white"
                  name='google'
                />
              }
              title="Continue with Google"
            /> */}
        </LoginScreen>
        {loading ? (
        // <ActivityIndicator color={'#000'} animating={true} size="large" />
        <LoadingModal />
        ) : null }
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#808e9b',
  },
  fpText: {
    alignSelf: 'flex-end',
    color: '#B33771',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#833471',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fafafa',
    alignSelf: 'center',
  },
  loginWithBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  iconButton: {
    backgroundColor: '#333',
    padding: 14,
    marginHorizontal: 10,
    borderRadius: 100,
  },
  signUpTextView: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#808e9b',
    fontSize: 20,
    fontWeight: '500',
  },
});