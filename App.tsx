/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  Platform, Button
} from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

declare const global: { HermesInternal: null | {} };

const DATA = new Array(50);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 26,
    color: '#25242A',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 8,
  },
});

const generateColor = (price: number, index: number): string => Math.floor(price * index).toString(16);

const Item: React.FC<{ index: number, price: number }> = ({ index, price }) => (
  <View style={[styles.item, { backgroundColor: '#' + generateColor(price, index + 8) }]}>
    <Text style={styles.text}>{`${Platform.OS} - ${price}`}</Text>
  </View>
);

const useGetData = (): { price?: number } => {
  const [price, setPrice] = useState<number>();
  const currencyPair = 'ethbtc';

  useEffect(() => {
    const subscribe = {
      event: 'bts:subscribe',
      data: {
        channel: `live_trades_${currencyPair}`
      }
    };
    const ws = new WebSocket('wss://ws.bitstamp.net');

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      const price = parseFloat((1/data.price).toFixed(5));
      if (price) setPrice(price);
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [currencyPair]);

  return { price }
};

const App: React.FC = () => {
  const { price } = useGetData();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text style={styles.title}>BTC/ETH live trades</Text>
        {!price && <Text style={styles.text}>waiting for some trades to happen...</Text>}
        {price && <FlatList
          data={DATA}
          renderItem={({item, index}) => <Item price={price} index={index}/>}
          keyExtractor={(_, index) => `${index}`}
          stickyHeaderIndices={[19]}
        />}
      </SafeAreaView>
    </>
  );
};

export default App;
