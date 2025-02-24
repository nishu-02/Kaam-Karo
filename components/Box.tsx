import { Text, View, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

export default function Box({ name }) {
  return (
    <View
      style={{
        height: 60,
        width: '100%',
        backgroundColor: '#f0f0f0',
        // justifyContent: 'center',
        alignItems: 'left',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
        padding: 8,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
    </View>
  );
}
