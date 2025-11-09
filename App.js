import React, {useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native';
import serverList from './config/serverList.json';
import { probeAllServers, probeServer } from './services/connectionService';

export default function App(){
  const [servers, setServers] = useState(serverList);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState('Disconnected');
  const [pings, setPings] = useState({});
  const [connecting, setConnecting] = useState(false);

  useEffect(()=>{ // probe servers on load
    (async ()=>{ await probeAllServers(setPings); })();
  },[]);

  const selectServer = (index)=>{
    setSelectedIndex(index);
  };

  const handleConnect = async ()=>{
    const server = servers[selectedIndex];
    setConnecting(true);
    setStatus('Connecting...');
    // try to probe the selected server
    const result = await probeServer(server, 7000);
    if (result.ok) {
      setStatus('Connected ✅');
      Alert.alert('Connected', `Probe OK (${result.latency} ms)\nURL: ${result.url}`);
    } else {
      setStatus('Connection Failed');
      Alert.alert('Failed', 'Unable to reach server. Check host/port or server status.');
    }
    setConnecting(false);
  };

  const handleDisconnect = ()=>{
    setStatus('Disconnected');
  };

  return (
    <View style={{flex:1, backgroundColor:'#050505', padding:16, paddingTop: StatusBar.currentHeight||40}}>
      <StatusBar barStyle='light-content' />
      <View style={{alignItems:'center', marginBottom:16}}>
        <Image source={require('./assets/goat_logo.png')} style={{width:96, height:96}} />
        <Text style={{color:'#d4af37', fontSize:22, fontWeight:'800'}}>The Goat Tunnel</Text>
        <Text style={{color:'#cfa84b'}}>- Fast. Secure. The GOAT of VPNs.</Text>
      </View>

      <View style={{marginBottom:12}}>
        <Text style={{color:'#fff', marginBottom:8, fontWeight:'700'}}>Servers</Text>
        <FlatList data={servers} keyExtractor={(i)=>i.name} renderItem={({item, index})=> (
          <TouchableOpacity onPress={()=>selectServer(index)} style={{padding:12, backgroundColor: index===selectedIndex? '#111':'#0b0b0b', marginBottom:8, borderRadius:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={require('./assets/flags/'+item.flag)} style={{width:34,height:22,marginRight:12}} />
              <View style={{flex:1}}>
                <Text style={{color:'#fff', fontWeight:'700'}}>{item.country}</Text>
                <Text style={{color:'#aaa', fontSize:12}}>{item.host}:{item.port} • {item.mode}</Text>
              </View>
              <View><Text style={{color:'#cfa84b', fontWeight:'700'}}>{pings[item.name]==null? '—' : (pings[item.name] < 100 ? 'Fast' : (pings[item.name]<300 ? 'Med' : 'Slow'))}</Text></View>
            </View>
          </TouchableOpacity>
        )} />
      </View>

      <View style={{padding:12, backgroundColor:'#0b0b0b', borderRadius:12}}>
        <Text style={{color:'#fff', fontWeight:'700'}}>Selected: {servers[selectedIndex].country}</Text>
        <Text style={{color:'#ccc', marginTop:6}}>Status: {status}</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
          <TouchableOpacity onPress={handleConnect} style={{backgroundColor:'#d4af37', padding:12, borderRadius:10}} disabled={connecting}><Text style={{fontWeight:'800'}}>Connect</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleDisconnect} style={{backgroundColor:'#333', padding:12, borderRadius:10}}><Text style={{color:'#fff'}}>Disconnect</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
