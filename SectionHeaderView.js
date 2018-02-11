import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ListView,
  Image,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import GridView from 'react-native-gridview';
import { Button } from 'react-native';

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

    this.changesList=[]

    this.saveRecentChanges=this.saveRecentChanges.bind(this);
    this.clearRecentChanges=this.clearRecentChanges.bind(this);


	}

saveRecentChanges(){

  console.log("Changes List",this.changesList);



  for(let i=0;i<this.changesList.length;i++){


let organ=this.changesList[i].organ;
let value=this.changesList[i].value;
let key=this.changesList[i].key;

    let dataUpdateRef=firebase.database().ref('record').child(organ);

    dataUpdateRef.child(key).update({
      value:value
    },function(error){


      if(error)
        console.log("Update error",error);
      else
        console.log("Update succceded");

    })




  }

}


clearRecentChanges(){

this.changesList=[]; // clear the changeList 

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

      <View>
  

<View style={{width:Dimensions.get('window').width,flexDirection:'row'}}>
     <TouchableHighlight style={styles.cancelButton} onPress={this.clearRecentChanges} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableHighlight>



   <TouchableHighlight style={styles.button} onPress={this.saveRecentChanges} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
</View>

				<View style={{flex:1,marginTop:6,marginLeft:6,justifyContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start'}}>
<ListView
            dataSource={ds.cloneWithRowsAndSections(convertFoodArrayToMap(this.state.organs))}
            renderRow={(rowData) => <OrgansRow organItem={rowData} changesList={this.changesList}/>}
            renderSectionHeader={this.renderSectionHeader}
          ></ListView>
</View>

				</View>
			);

	}
}



class OrgansRow extends Component{


  constructor(props){
    super(props);
    //Download data from firebase 


    this.state={
      dataList:[]
    }
    this.dataSource=new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(itemsValue);

    this.fetchFireBase=this.fetchFireBase.bind(this);
//}

this.keys=[]

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

//for(let i=0;i<24;i++)
//records[0].push("0");

for(var name in snapshot.val()){
  


root.keys.push(name);
records[0].push(String(snapshot.val()[name].value));
}


console.log(root.props.organItem.name);

  root.setState({dataList:records});


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
          <ValueCell data={item} changesList={this.props.changesList} organ={this.props.organItem.name} keyIndex={this.keys[itemIndex]}/>
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
  // console.log(this.props.keyIndex)
   //changesList
   this.state={
    text:this.props.data
   }
  }
  render(){

    return(

      <View style={styles.cell}>  
          <TextInput
          style={{height: 20,width:65 ,textAlign:'center'}}
          value={this.state.text}
          onEndEditing={()=>this.props.changesList.push({key:this.props.keyIndex,value:this.state.text,organ:this.props.organ})}
          onChangeText={(text)=>this.setState({text:text})}
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

  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 20,
    width:60,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop:4,
    marginBottom:4,
    marginLeft:4,
    marginRight:4
  },
  cancelButton:{
    height: 20,
    width:60,
    backgroundColor: '#47041f',
    borderColor: '#47041f',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginTop:4,
    marginBottom:4,
    marginLeft:4,
    marginRight:4

  }
});

