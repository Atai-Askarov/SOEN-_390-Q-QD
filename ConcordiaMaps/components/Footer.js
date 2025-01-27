
import React from 'react'
import { StyleSheet,View ,Text,Image} from 'react-native';

function Footer() {
  return (
    <View style={styles.bottom}>
    <Text style={styles.text}>Loyola Campus | Map Mode</Text>
    </View>
  );
}
const styles=StyleSheet.create({
    bottom:{
        width:"100%",
        backgroundColor:"#912338",
        bottom:0,
        height:"5%",
        display:"flex",
        // alignItems:"center",
        justifyContent:"center",

    },
    text:{
        color:"white",
        fontWeight:"bold",
        fontFamily:"Arial",
        fontSize:14,
        justifyContent:"flex-start",
        marginLeft:"8%"
            
        
    }
});
export default Footer
