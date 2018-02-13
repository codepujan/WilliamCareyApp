import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ListView
} from 'react-native';



const  timeSettingsValues=[
{text:"1 hour",unit:"hour",value:1,selected:false,index:0},
{text:"4 hour",unit:"hour",value:4,selected:false,index:1},
{text:"10 hour",unit:"hour",value:10,selected:false,index:2},
{text:"24 hour",unit:"hour",value:24,selected:false,index:3},
{text:"1 days",unit:"day",value:1,selected:false,index:4},
{text:"2 days",unit:"day",value:2,selected:false,index:5},
{text:"5 days",unit:"day",value:5,selected:true,index:6},
{text:"10 days",unit:"day",value:10,selected:false,index:7}
];
const placeSettingsValues=[
{text:"0.5 km ",unit:"km",value:0.5,selected:false,index:0},
{text:"1 km ",unit:"km",value:1,selected:false,index:1},
{text:"2 km ",unit:"km",value:2,selected:false,index:2},
{text:"5 km ",unit:"km",value:5,selected:true,index:3},
{text:"10 km ",unit:"km",value:10,selected:false,index:4},
{text:"20 km ",unit:"km",value:20,selected:false,index:5}
];

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class SettingsSelectableView extends Component{


constructor(props)
{
super(props);



let categories=[];
for(let i=0;i<this.props.optionsArray.length;i++)
categories.push(this.props.optionsArray[i]["category"]);


let refinedSet=new Set(categories);

this.refinedArray=[];
let index=0;

for(let item of refinedSet){
this.refinedArray.push({index:index,name:item,selected:false});
index=index+1;
}

this.state={
	      dataSource: ds.cloneWithRows(this.refinedArray),
        selected:[]
}


this.changeSelected=this.changeSelected.bind(this);

}


changeSelected(index){


let newValues=this.refinedArray;
let selection=[];

for(var i=0;i<newValues.length;i++){
	if(i==index){
		newValues[i]['selected']=true;
		selection.push(newValues[i]);
  }
}

this.setState({selected:selection,dataSource: ds.cloneWithRows(newValues)})


}
render(){

	return(
			<View style={{flex:1}}>

       <ActionButton buttonColor="rgba(231,76,60,1)" icon={<Icon name="check" style={styles.actionButtonIcon} />} onPress={() =>this.props.applySettings(this.state.selected)}> 
  
</ActionButton>

 <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row settingsData={data} changeSelected={this.changeSelected}></Row>}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      ></ListView>


     
			</View>

		)
}


}


class Row extends Component{

render(){

	if(this.props.settingsData.selected){
	return(
				<TouchableOpacity onPress={()=>this.props.changeSelected(this.props.settingsData.index)}>
		<View style={{flexDirection:'row', justifyContent: 'space-between',margin:4,padding:4}}>
			<Text>{this.props.settingsData.name}</Text>
			 <Image
     source={require('./resources/tick.png')}
          style={{width:25,height:25,alignSelf:'center',padding:4}}
    ></Image>
		</View>
		    </TouchableOpacity>

		)
}else{
	return(
<TouchableOpacity onPress={()=>this.props.changeSelected(this.props.settingsData.index)}>
		<View style={{flexDirection:'row', justifyContent: 'space-between',margin:4,padding:4}}>
			<Text>{this.props.settingsData.name}</Text>
			
		</View>
		    </TouchableOpacity>
);
}
}

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  actionButtonIcon: {
    fontSize: 24,
    height: 22,
    color: 'white',
    alignSelf:'center'
  }
  
});