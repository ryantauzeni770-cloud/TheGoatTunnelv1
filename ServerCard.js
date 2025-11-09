import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ServerCard({server, onSelect, selected, ping}){
  return (
    <TouchableOpacity onPress={()=>onSelect(server)} style={{padding:12, backgroundColor: selected ? '#111':'#0b0b0b', borderRadius:10, marginBottom:8}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Image source={require('../assets/flags/'+server.flag)} style={{width:34,height:22,marginRight:12}} />
        <View style={{flex:1}}>
          <Text style={{color:'#fff', fontWeight:'700'}}>{server.country}</Text>
          <Text style={{color:'#aaa', fontSize:12}}>{server.host}:{server.port} • {server.mode}</Text>
        </View>
        <View>
          <Text style={{color:'#cfa84b', fontWeight:'700'}}>{ping==null? '—' : (ping < 100 ? 'Fast' : (ping<300 ? 'Med' : 'Slow'))}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
