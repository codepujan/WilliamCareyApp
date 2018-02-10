let firebase =require('firebase');

const API_KEY='AIzaSyDU2kEs5p-wnstlymlR1EGqwpk9JBsdohw';
const APP_NAME='williamcareymedical';

const config={
  apiKey:API_KEY,
  authDomain:'williamcareymedical.firebaseapp.com',
  databaseURL:'https://williamcareymedical.firebaseio.com',
  storageBucket:"gs://williamcareymedical.appspot.com"
}



firebase.initializeApp(config);


//Idea : 
//The COLUMNS of insertion are T1A ,T1B,T2A,T2A,T2B,T3A,T3B,T4A,T4B ....
//the rows are the  key names 
//insert in the record place 


getOrgansName();

function getOrgansName(){

let organsEntryRef=firebase.database().ref('structures');


organsEntryRef.on("value",function(snapshot){
let organEntry=snapshot.val();
let key;

let studyOrgans=[];
for(var name in snapshot.val()){
  //console.log("Parent",name);
  let childs=snapshot.val()[name];
  for(var childname in childs){

    //console.log("Child ",childname);
    studyOrgans.push(childname);
  }

}


//Now : call the fill Value function 
fillOrganData(studyOrgans)

})


}

let teamTables=["T1A","T1B","T2A","T2B","T3A","T3B","T4A","T4B","T5A","T5B","T6A","T6B","T7A","T7B","T8A","T8B","T9A","T9B","T10A","T10B","T11A","T11B","T12A","T12B"];


function fillOrganData(names){

let dataEntry=firebase.database().ref('record');

for(let i=0;i<names.length;i++){

for(let j=0;j<teamTables.length;j++){
dataEntry.child(names[i]).push({
table:teamTables[j],
value:0
},function(error){

if(!error)
		console.log("Filled ",names[i]," In ",teamTables[j]);
else
		console.log(error);

})

}
}


}
