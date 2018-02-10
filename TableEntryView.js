import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native';

import GridView from 'react-native-gridview';

const itemsPerRow = 12;


const data = Array(100)
  .fill(null)
  .map((item, index) => index + 1);

const randomData = [];
for (let i = 0; i < data.length; i) {
  const endIndex = Math.max(Math.round(Math.random() * itemsPerRow), 1) + i;
  randomData.push(data.slice(0, 10));
  i = endIndex;
}

const tables=12;



const headings=[]
headings.push([]);
for(let i=0;i<tables;i++){
  headings[0].push("Table "+i);
}

const subheadings=[]
subheadings.push([]);

for(let i=0;i<tables*2;i++){
  if(i%2==0)
  subheadings[0].push(" Group A ");
else
  subheadings[0].push(" Group B ");
}


const dataSource = new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(randomData);


const headingSource=new GridView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(headings);

const subheadingSource=new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(subheadings);


export default class TableEntryView extends Component{

render(){

console.log(randomData);

	return(
		<View style={{flex:1,padding:6}}>

<ScrollView showsHorizontalScrollIndicator={true} horizontal={true} vertical={true} showsVerticalScrollIndicator={true}>

<View>
<View>
 <GridView
      data={headings}
      dataSource={headingSource}
      itemsPerRow={itemsPerRow}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
        	<TitleCell data={item}/>
        );
      }}
    ></GridView>
</View>

<View>
     <GridView
      data={subheadings}
      dataSource={subheadingSource}
      itemsPerRow={itemsPerRow}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
          <SubHeadingCell data={item}/>
        );
      }}
    ></GridView>


    </View>
    </View>

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



class TitleCell extends Component{

constructor(props){

    super(props);
  }
  render(){


    return(

      <View style={styles.headingCell}>  
      <Text>{this.props.data}</Text>
      </View>

        )
  }

}


class SubHeadingCell extends Component{

  constructor(props){

    super(props);
    console.log("Sub Titles is ",this.props);

  }
  render(){


    return(

      <View style={styles.subheadingCell}>  
           <Text>{this.props.data}</Text>

      </View>

        )
  }

}

const styles = StyleSheet.create({
  cell:{
  	width:70,height:30,marginLeft:4,backgroundColor:'white',borderRadius: 4,
    borderWidth:1,
    borderColor: '#000000',
    alignItems:'center',
    justifyContent:'center'
  },
  headingCell:{
  width:125,height:30,marginLeft:4,backgroundColor:'white',borderRadius: 4,
    borderWidth:1,
    borderColor: '#000000',
    alignItems:'center',
    justifyContent:'center'

  },
  subheadingCell:{
  width:63,height:30,marginLeft:1,backgroundColor:'white',borderRadius: 4,
    borderWidth:1,
    borderColor: '#000000',
    alignItems:'center',
    justifyContent:'center',

  }
});

