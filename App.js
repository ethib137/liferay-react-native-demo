import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';

import { Input } from 'react-native-elements';

import {request, removeAuth, isSignedIn} from './util/request';

import Login from './components/Login';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState(false);
  const [elementSets, setElementSets] = useState();

  useEffect(() => {
    isSignedIn().then(
      res => {
        console.log('signedIn', res)
        setSignedIn(res);
      }
    );
  }, [error]);

  useEffect(() => {
    request({
      url: 'http://127.0.0.1:8080/o/headless-delivery/v1.0/content-sets/332174/content-set-elements'
    })
    .then(res => {
      console.log('element-sets', res);

      setElementSets(res.items);
    });
  }, []);

  const handleSignOut = () => {
    removeAuth().then(
      () => {
        setSignedIn(false);
      }
    ).catch(() => {
      console.log('failed to logout');
    });
  }

  const handleLogin = loggedIn => {
    setSignedIn(loggedIn);
  }

  return (
    <View style={styles.container}>
      {!signedIn &&
        <Login onLogin={loggedIn => handleLogin(loggedIn)} />
      }
      {signedIn && elementSets &&
        <View>
          <Button onPress={() => handleSignOut()} title="Sign Out" />

          <ScrollView>
            {elementSets.map(element => (
              <View key={element.id} style={{margin: 8}}>
                <Text>{element.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
});
