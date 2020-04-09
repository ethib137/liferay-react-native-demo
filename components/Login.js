import React, {useState} from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';

import { Input } from 'react-native-elements';

import {login} from '../util/request';

function Login({onLogin}) {
  const [email, setEmail] = useState('ali@liferay.com');
  const [password, setPassword] = useState('test');

  const handleLogin = () => {
    login(email, password).then(
      () => onLogin(true)
    ).catch(
      () => onLogin(false)
    );
  }

  return (
    <View style={styles.container}>
      <Text>Liferay Auth!</Text>

      <Input
        label="Email Address"
        placeholder="test@liferay.com"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={val => setEmail(val)}
      />

      <Input
        label="Password"
        placeholder="test"
        value={password}
        secureTextEntry={true}
        textContentType="password"
        onChangeText={val => console.log(val)}
      />

      <Button onPress={() => handleLogin()} title="Login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;