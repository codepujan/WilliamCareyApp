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


const ds=new ListView.DataSource({
				 rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
			})


function convertFoodArrayToMap() {
  var foodCategoryMap = {}; // Create the blank map
  food.forEach(function(foodItem) {
    if (!foodCategoryMap[foodItem.category]) {
      foodCategoryMap[foodItem.category] = [];
    }
    
    foodCategoryMap[foodItem.category].push(foodItem);
     
  });
  
  return foodCategoryMap;
  
}


export default class SectionHeaderView extends Component{


	constructor(props){

		super(props);
		this.state={
			        dataSource: ds.cloneWithRowsAndSections(convertFoodArrayToMap())
		}
		this.renderRow=this.renderRow.bind(this);
		this.renderSectionHeader=this.renderSectionHeader.bind(this);
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
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
          ></ListView>

				</View>
			);

	}
}