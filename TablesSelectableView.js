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



import ActionButton from 'react-native-action-button';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class TableSettingsView extends Component{


constructor(props)
{
super(props);




this.refinedArray=[];
let index=0;

for(let item of this.props.optionsArray){
this.refinedArray.push({index:index,name:item,selected:false});
index=index+1;
}



console.log(this.refinedArray);


this.state={
	      dataSource: ds.cloneWithRows(this.refinedArray),
        selected:[]
}


this.changeSelected=this.changeSelected.bind(this);

}


changeSelected(index){


let newValues=this.refinedArray;
let selection=[];
let exportSelection=this.state.selected;

for(var i=0;i<newValues.length;i++){
	if(i==index){
		newValues[i]['selected']=true;
		selection.push(newValues[i]);
    exportSelection.push(newValues[i]);
  }
}


console.log("selected ",exportSelection);

this.setState({selected:exportSelection,dataSource: ds.cloneWithRows(newValues)})


}
render(){

	return(
			<View style={{flex:1}}>

   

 <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row settingsData={data} changeSelected={this.changeSelected}></Row>}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      ></ListView>

 <TouchableHighlight style={styles.button} onPress={()=>{this.props.applySettings(this.state.selected)}} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
     
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
  },buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }

  
});