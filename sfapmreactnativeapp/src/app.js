import {NavigationContainer} from '@react-navigation/native';
import React, {memo} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
// import Player from './components/Player';
// import {Provider} from './recontext/store';
import {AuthProvider} from './contexts/Auth';
import TabbarStack from './tabbar';
import {colors} from './utils/themes';

import './rum-adapter'

import 'react-native-get-random-values'

import * as sfApm from 'sf-apm-rum-reactnative';
import LoginScreen2 from './screens/auth/LoginScreen';
import {Router} from './routes/Router';


if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor(colors.transparent);
} else {
  StatusBar.setBarStyle('light-content');
}

console.log(sfApm)

const apmRum = new sfApm.apmRum();
const apmData = {
    baseUrl: 'https://apmmanager.snappyflow.io',
    profileKey: 'FAnpQXipWx2Smt8yej3UA038ryvEPFyZbbVZi7giuWb6D27h6iAIU3nB4H/AN+kKLla0FfthToLrQWhKU8srBcqHSzTGiMSZPK7/ptq8DOCetncNOndVC2XuMbz0Tf3MIiZqJNP1FpEzXvaFuErYIjljQQZlpuq6ejV4j55nbIx6+wX1p1no6UuH0aEY8L51oi6AnR4xVsYzoU+WYtBJlhrILit9eHMkIPFY+wveLDuCE8f14eJ8N4FFPKTb7zF76Qr3oqtyRlOSWj6jzyVJNXQdYlWxXUs2vbKqxu/xbSr6pgGryW25vzEHMXTO1GyEfqdLuglQaRP7aG/S5pqFtrjb0R/DeS0k6WUmpLzLYnG3TEiNPgL/F6yD6vJfj/vXo0++mvNxO/R9JxpRCcOD24v/m7tcQUj8/U9onK6X/7XyfjfOWjTRvyZ/clrtXnTXoK5dluQxOR1L4mf7HCjlHyaJzuI6PZtL6dnLgZ2sNkvUWqwc87Vqe0e1pgksGn2pYqxwEv/umFWogJDvd8jMGece/KGqFJXbGs6SXNNk+yk9WRhuYgJ9tn4vx8qK13681alr83j6T8ycrjJSEZFKVLsK6/gqh4b9RRI65lrip4lIXo2Ktm/6QjlATa0Kt1G0YWDGQYgHLrwBHwN2aQIkr1Jk5dE2WWSeDFoj1MutJPf3YGmm05kX+CXah+tfF1ouzdyUh9k8PlDk5hpzu8+UmxdgVaAxVdL4pqyzCdkSyIS4jCnH/wKH5/RSowTRuQIr1GWn+42ytB+gaDZX4mrthDLsx8zjR8qRYzsE2veNDjOji28l6V4vNLCj6I3g+lnHqomYMzdKQuqvLc6n/Vrvof6BBZOwfTgrfwpFSw9VF3I=',
    serviceName: 'mobile-client',
    projectName: 'apmmanager-opensearch',
    appName: 'sf-portal-app',
};
apmRum.init(apmData);

// const isLoggedIn = false;

const App = () => {
  return (
    <View style={styles.container}>
       <AuthProvider>
        {/* <NavigationContainer>
          {isLoggedIn ? <TabbarStack /> : <LoginScreen2 />}
          
        </NavigationContainer> */}
        <Router />
        {/* <Player /> */}
      </AuthProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(App, () => true);
