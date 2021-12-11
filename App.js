import { StatusBar } from 'expo-status-bar';
import React,{useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert, Animated } from 'react-native';

export default function App() {
  const [player,setPlayer]=useState(true);
 
  const [winner,setWinner]=useState("");
  const [disabled,setDisabled]=useState(false);
  const [game,setGame]=useState(Array.from({length: 3},()=> Array.from({length: 3}, () => "")));
  const [button,setButton]=useState(Array.from({length: 3},()=> Array.from({length: 3}, () => "dodgerblue")));
  let animatedValue=new Animated.Value(1);
  const [animatedStyle,setAnimatedStyle]=useState(Array.from({length: 3},()=> Array.from({length: 3}, () => {transform:[{scale:animatedValue}]})));;
  const Restart=()=>{
    setPlayer(true);
    setWinner("");
    setMove(1);
    setGame(Array.from({length: 3},()=> Array.from({length: 3}, () => "")));
    setButton(Array.from({length: 3},()=> Array.from({length: 3}, () => "dodgerblue")));
    setDisabled(false); 
  }
  const calculateWinner=(copy)=>{
    const lines=[
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [[a,b], [c,d], [e,f]] = lines[i];
      if (copy[a][b] && copy[a][b] === copy[c][d] && copy[a][b] === copy[e][f]) { 
        button[a][b]="royalblue";
        button[c][d]="royalblue";
        button[e][f]="royalblue";
        setButton([...button]);    
        setDisabled(true);
        return copy[a][b];
      }
      
    }
    if(copy[0][0]!=="" && copy[0][1]!=="" && copy[0][2]!=="" && copy[1][0]!=="" && copy[1][1]!=="" && copy[1][2]!=="" && copy[2][0]!=="" && copy[2][1]!=="" && copy[2][2]!=="" ){
      setDisabled(true);
      return "DRAW";
    }else
      return null;
  }
  const Play=(row,column)=>{
    let copy=[...game];
    if(calculateWinner(copy) || copy[row][column]){
      return;
    }
    copy[row][column]=player?"X":"O";
    setPlayer(!player);
    setGame(copy);
    
  }
  const PressIn=(r,c)=>{
    Animated.timing(animatedValue, {
      toValue: .6,
      duration: 350,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    });
    animatedStyle[r][c]={transform:[{scale:animatedValue}]};
    setAnimatedStyle([...animatedStyle]);
  }
  useEffect(()=>{
    const w=calculateWinner(game);
    if(w){
      setWinner(w);
    }
  }
  ,[player])
  return (
    <View style={styles.container}>
      <Text style={{fontWeight:'bold',margin:20}}>TIC-TAC-TOE</Text>
      <Text style={{fontWeight:'bold',margin:20}}>
        {
          winner? 
            winner==="DRAW"?winner+"😅":"🎉🎉🎉Player "+winner+" wins!!!🎉🎉🎉🎉"
            :
            player?"Player X it's your turn":"Player O it's your turn"
        }
      </Text>
      <View style={styles.game}>
        {
          game.map((row,r)=>game.map((col,c)=>(
            <Animated.View style={[animatedStyle[r][c]]} key={`${r}-${c}`}>
              <TouchableHighlight 
                onPress={()=>{Play(r,c);}}
                onPressIn={()=>PressIn(r,c)} 
                style={[styles.buttons,styles.button,{backgroundColor:button[r][c]}]}
                underlayColor="royalblue"
               
                disabled={disabled}
              >
                <Text style={styles.text}>
                  {game[r][c] && game[r][c]}
                </Text>
              </TouchableHighlight>
            </Animated.View>
          )))
        }
        <TouchableHighlight 
          onPress={Restart} 
          style={[styles.button,{width:'90%',marginTop:10}]} 
          underlayColor="royalblue"
        >
          <Text style={styles.text}>Restart Game</Text>
        </TouchableHighlight>
        
      </View>     
      <StatusBar style="auto" />
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
  game:{
    flexDirection:'row',
    width:180,
    flexWrap:'wrap',
    justifyContent:'center'
  },
  buttons:{
    width:50,
    height:50,
  },
  button:{
    backgroundColor:'dodgerblue',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    margin:2,
    padding:10
  },
  text:{
    color:'white',
    fontWeight:'bold',
  },
});


