import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native';

import GridView from 'react-native-gridview';

const itemsPerRow = 10;


const data = Array(20)
  .fill(null)
  .map((item, index) => index + 1);

const randomData = [];
for (let i = 0; i < data.length; i) {
  const endIndex = Math.max(Math.round(Math.random() * itemsPerRow), 1) + i;
  randomData.push(data.slice(i, endIndex));
  i = endIndex;
}

const dataSource = new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(randomData);

export default class TableEntryView extends Component{

render(){

	return(
		<View style={{flex:1,padding:6,flexDirection:'row'}}>

<ScrollView showsHorizontalScrollIndicator={true} horizontal={true}>

 <GridView
      data={data}
      dataSource={dataSource}
      itemsPerRow={itemsPerRow}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
        	<Cell/>
        );
      }}
    ></GridView>
</ScrollView>
			

		</View>

		);
}

}


class Cell extends Component{

	constructor(props){

		super(props);

	}
	render(){


		return(

			<View style={styles.cell}>	
			<TextInput
          style={{height: 20,width:65 ,textAlign:'center'}}
          placeholder="..."
        />
			</View>

				)
	}
}


const styles = StyleSheet.create({
  cell:{
  	width:70,height:30,marginLeft:4,backgroundColor:'white',marginTop:4,marginBottom:4,borderRadius: 4,
    borderWidth:1,
    borderColor: '#000000',
    alignItems:'center',
    justifyContent:'center'
  }
});

