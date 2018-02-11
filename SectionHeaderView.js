import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ListView,
  Image
} from 'react-native';

import GridView from 'react-native-gridview';

var food = [
  {name: "Lettuce", category: "Vegetable"}, 
  {name: "Apple", category: "Fruit"},
  {name: "Orange", category: "Fruit"},
  {name: "Potato", category: "Vegetable"}
];


import firebase from 'firebase';

const API_KEY='AIzaSyDU2kEs5p-wnstlymlR1EGqwpk9JBsdohw';
const APP_NAME='williamcareymedical';


const config={
  apiKey:API_KEY,
  authDomain:'williamcareymedical.firebaseapp.com',
  databaseURL:'https://williamcareymedical.firebaseio.com',
  storageBucket:"gs://williamcareymedical.appspot.com"
}

const ds=new ListView.DataSource({
				 rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
			})


function convertFoodArrayToMap(sourceArray) {
  var organCategoryMap = {}; // Create the blank map
  sourceArray.forEach(function(organItem) {
    if (!organCategoryMap[organItem.category]) {
      organCategoryMap[organItem.category] = [];
    }
    
    organCategoryMap[organItem.category].push(organItem);
     
  });
  
  return organCategoryMap;
  
}


const tables=12;
const itemsPerRow = 12;

const itemsValue=[]
itemsValue.push([]);

for(let i=0;i<tables*2;i++){
  itemsValue[0].push("...");
}

const valueSource = new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(itemsValue);


export default class SectionHeaderView extends Component{


	constructor(props){

		super(props);
		this.state={
          organs:[]
		}
		this.renderSectionHeader=this.renderSectionHeader.bind(this);
    this.getOrgansRow=this.getOrgansRow.bind(this);



    this.getOrgansRow();
	}



getOrgansRow(){

firebase.initializeApp(config);
let organsEntryRef=firebase.database().ref('structures');

let root=this;

organsEntryRef.on("value",function(snapshot){
let organEntry=snapshot.val();
let key;

let studyOrgans=[];
for(var name in snapshot.val()){
  //console.log("Parent",name);
  let childs=snapshot.val()[name];
  for(var childname in childs){

    //console.log("Child ",childname);
    studyOrgans.push({name:childname,category:name});
  }

}

//Now update the state 



root.setState({organs:studyOrgans});

})

}



	renderSectionHeader(sectionData,category){
		return (
			<View style={{borderRadius: 2,
    borderWidth:1,
    borderColor: '#000000',width:150}}>
		<View style={{flex:1,flexDirection:'row',width:50}}>
		 <Image
		 style={{width:20,height:20}}
          source={require('./resources/more.png')}
        ></Image>

    <Text style={{fontWeight: "500",marginLeft:4}} numberOfLines={1}>{category}</Text>
    </View>
    </View>
  )


	}

	render(){

		return(
				<View style={{flex:1,marginTop:6,marginLeft:6,justifyContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start'}}>
<ListView
            dataSource={ds.cloneWithRowsAndSections(convertFoodArrayToMap(this.state.organs))}
            renderRow={(rowData) => <OrgansRow organItem={rowData}/>}
            renderSectionHeader={this.renderSectionHeader}
          ></ListView>

				</View>
			);

	}
}



class OrgansRow extends Component{


  constructor(props){
    super(props);
    //Download data from firebase 


    this.state={
      dataList:itemsValue
    }
    this.dataSource=new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(itemsValue);

    this.fetchFireBase=this.fetchFireBase.bind(this);
//}

}

componentDidMount(){
      this.fetchFireBase();

}
fetchFireBase(){

let dataEntryRef=firebase.database().ref('record').child(this.props.organItem.name);
    const root=this;

//if(this.props.organItem.name=='Intercondylar fossa'){
dataEntryRef.on("value",function(snapshot){
let records=[];
records.push([]);
for(var name in snapshot.val()){
  //console.log("Parent",name);
   console.log(snapshot.val()[name].table)
   console.log(snapshot.val()[name].value)
   records[0].push(snapshot.val()[name].value);

}


  //root.setState({dataList:records});


  })



}

  render(){

this.dataSource=new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(this.state.dataList)
      return (
        <View style={{margin:4,flexDirection:'row'}}>
      <Text style={{fontSize:13}} numberOfLines={1}>{this.props.organItem.name}</Text>
      <View>
       <GridView
      data={this.state.dataList}
      dataSource={this.dataSource}
      itemsPerRow={itemsPerRow}
      style={{width:2000,height:35,marginLeft:4}}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
          <ValueCell data={item}/>
        );
      }}
    ></GridView>
      </View>

      </View>
    )
  }
}

class ValueCell extends Component{

  constructor(props){

    super(props);

  }
  render(){

    console.log("Rendering Value Cell ");
    return(

      <View style={styles.cell}>  
          <TextInput
          style={{height: 20,width:65 ,textAlign:'center'}}
          placeholder="..."
        ></TextInput>

      </View>

        )
  }
}

const styles = StyleSheet.create({
  cell:{
    width:63,height:30,backgroundColor:'white',borderRadius: 4,
    borderWidth:1,
    borderColor: '#000000',
    alignItems:'center',
    justifyContent:'center'
  },
  headingCell:{
  width:125,height:30,marginLeft:1,backgroundColor:'white',borderRadius: 4,
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

