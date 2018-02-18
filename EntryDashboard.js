import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import CardView from 'react-native-cardview'

import SortedSelectionView from './SortedSelectionView';


export default class EntryDashboard extends Component{


	constructor(props){

		super(props);

	}


	render(){

		return(
      <View style={styles.container}>
      
      <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={3}>

          <View style={{width:100,height:70,justifyContent:'center',alignItems:'center'}}>
          
		

          <TouchableHighlight style={styles.button} onPress={()=>{
            	this.props.navigator.push({
            		component:SortedSelectionView,
            		title:'Record Table',
            		passProps:{semestercode:'1'}
            	})
            }} underlayColor='grey'>
          <Text style={styles.buttonText}>Semester #1 </Text>
        </TouchableHighlight>
          </View>
    </CardView>




      <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={3}>

          <View style={{width:100,height:70,justifyContent:'center',alignItems:'center'}}>
          
    

          <TouchableHighlight style={styles.button} onPress={()=>{
              this.props.navigator.push({
                component:SortedSelectionView,
                title:'Record Table',
                passProps:{semestercode:'1'}
              })
            }} underlayColor='grey'>
          <Text style={styles.buttonText}>Semester #2 </Text>
        </TouchableHighlight>
          </View>
    </CardView>




      <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={3}>

          <View style={{width:100,height:70,justifyContent:'center',alignItems:'center'}}>
          
    

          <TouchableHighlight style={styles.button} onPress={()=>{
              this.props.navigator.push({
                component:SortedSelectionView,
                title:'Record Table',
                passProps:{semestercode:'1'}
              })
            }} underlayColor='grey'>
          <Text style={styles.buttonText}>Semester #3 </Text>
        </TouchableHighlight>
          </View>
    </CardView>



      <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={3}>

          <View style={{width:100,height:70,justifyContent:'center',alignItems:'center'}}>
          
    

          <TouchableHighlight style={styles.button} onPress={()=>{
              this.props.navigator.push({
                component:SortedSelectionView,
                title:'Record Table',
                passProps:{semestercode:'1'}
              })
            }} underlayColor='grey'>
          <Text style={styles.buttonText}>Semester #4 </Text>
        </TouchableHighlight>
          </View>
    </CardView>



    </View>
			);

	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop:10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
  	width:100,
    height: 50,
    backgroundColor: 'grey',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 4,
    marginRight:4,
    marginLeft:4,
    marginTop: 4,
    justifyContent: 'center'
  },
  buttonText:{
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    padding:2
  }
});

