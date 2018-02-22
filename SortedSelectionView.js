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
  Dimensions,
  Alert
} from 'react-native';

import GridView from 'react-native-gridview';
import { Button } from 'react-native';
import SettingsView from './SettingSelectableView';
import TableSettingsView from './TablesSelectableView';


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
firebase.initializeApp(config);


import Modal from 'react-native-modal'




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



const averageCellWidth=70;



const allTableFilters=["T1A","T1B","T2A","T2B","T3A","T3B","T4A","T4B","T5A","T5B","T6A","T6B","T7A","T7B","T8A","T8B","T9A","T9B","T10A","T10B","T11A","T11B","T12A","T12B"];


const subheadings=[]
subheadings.push([]);

for(let i=0;i<tables*2;i++){

  if(i%2==0)
subheadings[0].push(" Group A ");
else
  subheadings[0].push(" Group B ");
}

const subheadingSource=new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(subheadings);


export default class SectionHeaderView extends Component{


  constructor(props){

    super(props);


    let headerFilters=[];
    headerFilters.push([]);
    headerFilters[0]=allTableFilters;

    this.state={
          organs:[],
          entireOrgans:[],
        isSettingsModalVisible:false,
        settingsModalTitle:'Organs Filter ',
        activeFilter:'organs',
        organFilters:[],
        tableFilters:[allTableFilters],
        isTableModalVisible:false,
        tableModalTitle:'Table Filter ',
        alreadySelected:[],
        headerFilters:headerFilters

    }
    this.renderSectionHeader=this.renderSectionHeader.bind(this);
    this.getOrgansRow=this.getOrgansRow.bind(this);



   this.getOrgansRow();

    this.changesList=[]

    this.saveRecentChanges=this.saveRecentChanges.bind(this);
    this.clearRecentChanges=this.clearRecentChanges.bind(this);
    this.getSettingsModal=this.getSettingsModal.bind(this);
    this.getTablesModal=this.getTablesModal.bind(this);

  }




getTablesModal(){


 if(this.state.isTableModalVisible){

    return(
        <View style={{flex:1,marginTop:10,width:Dimensions.get('window').width}}>
          <Modal isVisible={true} backdropOpacity={1.0} backdropColor="white" supportedOrientations={['portrait', 'landscape']}>
          <Text style={{alignSelf:'center',color:'black',fontWeight:'bold',fontSize:16}}>
          {this.state.tableModalTitle}
          </Text>
          <TableSettingsView  optionsArray={allTableFilters} applySettings={(value)=>{

            let newOptions=[];

            for(let i=0;i<value.length;i++)
              newOptions.push(value[i].name);


            console.log("Changing State ",newOptions);

             let headerFilters=[];
           headerFilters.push([]);
            headerFilters[0]=newOptions;

            this.setState({
              tableFilters:newOptions,isTableModalVisible:false,headerFilters:headerFilters},(prev,props)=>{
                          this.getOrgansRow(); //because Organs Row contains stuff for table filtering also 

            })


          }}/>
          </Modal>
        </View>
      )

  }


}

getSettingsModal(){

 if(this.state.isSettingsModalVisible){

    return(
        <View style={{flex:1,marginTop:10,width:Dimensions.get('window').width}}>
          <Modal isVisible={true} backdropOpacity={1.0} backdropColor="white" supportedOrientations={['portrait', 'landscape']}>
          <Text style={{alignSelf:'center',color:'black',fontWeight:'bold',fontSize:16}}>
          {this.state.settingsModalTitle}
          </Text>
          <SettingsView  optionsArray={this.state.entireOrgans}  alreadySelected={this.state.alreadySelected} applySettings={(value)=>{

            let newOptions=[];

            for(let i=0;i<value.length;i++)
              newOptions.push(value[i].name);


            console.log("Changing State ",newOptions);

            this.setState({organFilters:newOptions,isSettingsModalVisible:false,organs:[],alreadySelected:newOptions},(prev,props)=>{
                          this.getOrgansRow();

            })
          }}/>
          </Modal>
        </View>
      )

  }

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


  Alert.alert(
  'Succesful',
  'Updated Data Were Saved',
  [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ],
  { cancelable: true }
)


}


clearRecentChanges(){

this.changesList=[]; // clear the changeList 

}



getOrgansRow(){

let organsEntryRef=firebase.database().ref('structures');

let root=this;

organsEntryRef.on("value",function(snapshot){
let organEntry=snapshot.val();
let key;

let selectionFilters=['Points of muscle insertion','femur']

let studyOrgans=[];
let entireOrgans=[];


//No Selection filter : normal case 

console.log("Organ Filters ",root.state.organFilters);

if(root.state.organFilters.length==0){

for(var name in snapshot.val()){
  let childs=snapshot.val()[name];
   for(var childname in childs){
      studyOrgans.push({name:childname,category:name});
      entireOrgans.push({name:childname,category:name});
    }

  }

}else{
for(var name in snapshot.val()){
  //console.log("Parent",name);
  let childs=snapshot.val()[name];




    for(let i=0;i<root.state.organFilters.length;i++){
     if(name==root.state.organFilters[i]){

  for(var childname in childs){
      studyOrgans.push({name:childname,category:name});
      entireOrgans.push({name:childname,category:name});
    }
  }else{

    for(var childname in childs){
      entireOrgans.push({name:childname,category:name});
    }
  }


  }

}

}//end of parameterized 
//Now update the state 



root.setState({organs:studyOrgans,entireOrgans:entireOrgans});

})

}



  renderSectionHeader(sectionData,category){
    return (
      <View style={{borderRadius: 2,
    borderWidth:1,
    borderColor: '#000000',width:130}}>
    <View style={{flex:1,flexDirection:'row',width:50}}>
     <Image
     style={{width:20,height:20}}
          source={require('./resources/more.png')}
        ></Image>

    <Text style={{fontWeight: "300",marginLeft:4,width:100,color:'blue'}} numberOfLines={1}>{category}</Text>
    </View>
    </View>
  )


  }




  render(){

//headerFilters
let headerDataSource=new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(this.state.headerFilters);
    return(


<ScrollView>
      <View>
  


<View style={{width:Dimensions.get('window').width,flexDirection:'row',justifyContent: 'space-between'}}>


  {this.getSettingsModal()}


  {this.getTablesModal()}

     <TouchableHighlight style={styles.cancelButton} onPress={this.clearRecentChanges} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableHighlight>




<TouchableHighlight onPress={()=>{this.setState({isSettingsModalVisible:true})}}>
<View style={{flexDirection:'row',marginTop:4}}>
<Text style={{alignSelf:'center',textAlign:'center',fontWeight:'bold',fontSize:12}}> Filter Organs : </Text>
<Image
     source={require('./resources/settings.png')}
          style={{width:25,height:25,alignSelf:'center',padding:4,marginLeft:4,marginRight:4}}
    ></Image>
</View>
</TouchableHighlight>


<TouchableHighlight onPress={()=>{this.setState({isTableModalVisible:true})}}>
<View style={{flexDirection:'row',marginTop:4}}>
<Text style={{alignSelf:'center',textAlign:'center',fontWeight:'bold',fontSize:12}}> Filter Tables : </Text>
<Image
     source={require('./resources/settings.png')}
          style={{width:25,height:25,alignSelf:'center',padding:4,marginLeft:4,marginRight:4}}
    ></Image>
</View>
</TouchableHighlight>



   <TouchableHighlight style={styles.button} onPress={this.saveRecentChanges} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>



</View>
    <View style={{height:30,marginTop:6,marginLeft:6,justifyContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start'}}>
      <TableHeadersView dataSource={headerDataSource} data={this.state.headerFilters}  gridCount={this.state.gridWidthCount}/>
</View>

<View style={{flex:1,marginTop:6,marginLeft:6,marginTop:10,justifyContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start'}}>
<ListView
            dataSource={ds.cloneWithRowsAndSections(convertFoodArrayToMap(this.state.organs))}
            renderRow={(rowData) => <OrgansRow organItem={rowData} changesList={this.changesList} tablesFilter={this.state.tableFilters}/>}
            renderSectionHeader={this.renderSectionHeader}
          ></ListView>
</View>


        
        </View>

        </ScrollView>
      );

  }
}



class OrgansRow extends Component{


  constructor(props){
    super(props);
    //Download data from firebase 


    this.state={
      dataList:[],
      tableFilter:this.props.tablesFilter,
      gridWidthCount:0
    }
    
    this.fetchFireBase=this.fetchFireBase.bind(this);

this.keys=[]

this.teamTables=[];

}

componentDidMount(){

        this.keys=[];
      this.fetchFireBase(this.props.tablesFilter[0]);

}

componentWillReceiveProps(newProps){



this.keys=[];
  this.fetchFireBase(newProps.tablesFilter);
 

}

fetchFireBase(table){


let dataEntryRef=firebase.database().ref('record').child(this.props.organItem.name);
    const root=this;


if(this.props.organItem.name=='gracillis muscle'){


}


dataEntryRef.on("value",function(snapshot){
let records=[];
records.push([]);
let gridCount=0;

 
for(var name in snapshot.val()){
  

for(let i=0;i<table.length;i++){
  

  if(snapshot.val()[name].table==table[i])
    {
      root.keys.push(name);
records[0].push(String(snapshot.val()[name].value));
gridCount=gridCount+1;

    }
}




}

  root.setState({dataList:records,gridWidthCount:gridCount});


  })



}

  render(){




this.dataSource=new GridView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
}).cloneWithRows(this.state.dataList)
      return (
        <View style={{marginTop:6,flexDirection:'row'}}>
      <Text style={{fontSize:13,width:130}} numberOfLines={1}>{this.props.organItem.name}</Text>
      <View>
       <GridView
      data={this.state.dataList}
      dataSource={this.dataSource}
      itemsPerRow={itemsPerRow}
      style={{width:averageCellWidth*this.state.gridWidthCount,height:35,marginLeft:4}}
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



class TableHeadersView extends Component{



constructor(props){
  super(props);
  console.log("Grid Width Count",this.props.data[0].length);

}
componentWillReceiveProps(nextProps){
    console.log("Grid Width Count",nextProps.data[0].length);

}
  render(){



    return(
              <View style={{marginTop:6,flexDirection:'row'}}>


              <View style={{borderRadius: 2,
    borderWidth:1,
    borderColor: '#000000',width:130,height:25}}>
    <View style={{flex:1,flexDirection:'row',width:50}}>
 

    <Text style={{fontWeight: "100",marginLeft:4,width:100,color:'blue'}} numberOfLines={1}>{"Table Groups"}</Text>
        <Image
     style={{width:20,height:20}}
          source={require('./resources/more.png')}
        ></Image>
    </View>
    </View>

           <View>
       <GridView
      data={this.props.data}
      dataSource={this.props.dataSource}
      itemsPerRow={itemsPerRow}
      style={{width:averageCellWidth*this.props.data[0].length,height:35,marginLeft:4}}
      renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
        return (
          <DataCell data={item}/>
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
   this.state={
    text:this.props.data
   }
  }


  componentWillReceiveProps(nextProps){

    this.setState({text:nextProps.data});
    
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

class DataCell extends Component{

  constructor(props){

    super(props);
   this.state={
    text:this.props.data
   }
  }


  componentWillReceiveProps(nextProps){

    this.setState({text:nextProps.data});
    
  }
  render(){

    return(

      <View style={styles.cell}>  
           <Text
          style={{height: 20,width:65 ,textAlign:'center'}}
        >{this.state.text}</Text>
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