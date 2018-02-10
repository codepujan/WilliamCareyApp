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


export default class SectionHeaderView extends Component{


	constructor(props){

		super(props);
		this.state={
          organs:[]
		}
		this.renderRow=this.renderRow.bind(this);
		this.renderSectionHeader=this.renderSectionHeader.bind(this);
    this.getOrgansRow=this.getOrgansRow.bind(this);


//console.log(convertFoodArrayToMap());

    //firebase data capture stuffy 
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

console.log(studyOrgans);


console.log("Changing State ");

root.setState({organs:studyOrgans});

})

}

	renderRow(foodItem){
		 return (
      	<View style={{margin:4}}>
      <Text style={{fontSize:13}}>{foodItem.name}</Text>
      </View>
    )

	}

	renderSectionHeader(sectionData,category){
		return (
			<View style={{borderRadius: 2,
    borderWidth:1,
    borderColor: '#000000'}}>
		<View style={{flex:1,flexDirection:'row',width:100}}>
		 <Image
		 style={{width:20,height:20}}
          source={require('./resources/more.png')}
        ></Image>

    <Text style={{fontWeight: "500",marginLeft:4}}>{category}</Text>
    </View>
    </View>
  )


	}

	render(){

		return(
				<View style={{flex:1,marginTop:6}}>
<ListView
            dataSource={ds.cloneWithRowsAndSections(convertFoodArrayToMap(this.state.organs))}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
          ></ListView>

				</View>
			);

	}
}