import React, { useState,useEffect } from "react";
import $ from 'jquery';
import { render } from "react-dom";
import { Pie } from 'react-chartjs-2';
import './index.css'
import {ApolloClient,InMemoryCache,createHttpLink,ApolloProvider,useQuery,gql} from "@apollo/client";
const token = process.env.REACT_APP_GITHUB_TOKEN
const link = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers : {authorization : `Bearer ${token}`}
});
console.log("token",token)
let data_languages = []

let filteredArray = []

let nameRepo = []

const GET_LOGIN = gql`
query{ 
  viewer { 
    login,
    avatarUrl,
    bio,
    following{
      totalCount
    },
    followers{
      totalCount
    },
    contributionsCollection{
      totalCommitContributions
      commitContributionsByRepository(maxRepositories:100){
        repository{
          name
          primaryLanguage{
            name
          }
        }
        contributions(first:1){
          totalCount
        }
      }
    }
    repositories{
      totalCount
    },
    repositories{
      nodes{
        nameWithOwner
        languages(first:1){
          totalCount
          nodes{
            name,
            color,
          }
        }
      }
    }
  }, 
}
`;
const COMMIT_INFO = gql`
query($name:String!,$owner:String!){
  response: repository(owner: $owner, name: $name) {
    ...RepoFragment
  }
}

fragment RepoFragment on Repository {
  name
  defaultBranchRef {
    name
    target {
      ... on Commit {
        id
        history(first: 0) {
          totalCount
        }
      }
    }
  }
} 
  
`

function testbis(owner,name){
  console.log("call parameter",name,owner)
  const data = gql `
  {
    gson: repository(owner: sosniik, name:$name") {
      ...RepoFragment
    }
  }  
    fragment RepoFragment on Repository {
      name
      defaultBranchRef {
        name
        target {
          ... on Commit {
            id
            history(first: 0) {
              totalCount
            }
          }
        }
      }
    } 
    `
    // variables:`{
    //   "name":"${name}",
    //   "owner":"${owner}"
    // }`
}
// console.log("test bis",testbis("sosniik","Cine-steet"))
console.log(data_languages,filteredArray)


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});




function GetCommitInfo(name,owner){
  console.log("pppp",name,owner)
  const { loading, error, data} = useQuery(COMMIT_INFO,{
    variables:{
      name : name,
      owner :owner
    }
  })
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log("aller faut que ca marche : ",data.response.defaultBranchRef.target.history.totalCount)
  return(
    data.response.defaultBranchRef.target.history.totalCount,
    console.log("oihefuizhfhezfhez",data.response.defaultBranchRef.target.history.totalCount)
    // <div>
    //   ccoucou tout ca pour dire que cela marche
    //   {data.response.defaultBranchRef.target.history.totalCount}
    // </div>
  )

}
function LOC(){
  // const queryMultiple = () =>{
  //   const res1 = useQuery(GET_LOGIN),
  //   const res2
  // }
  // <Query query={queryLogin}>
  //   {({ loading: loadingOne, data: { one } }) => (
  //     <Query query={QueryTwo}>
  //       {({ loading: loadingTwo, data: { two }}) => {
  //         if (loadingOne || loadingTwo) return <span>loading...</span>
  //         return <h3>{one} is less than {two}</h3>
  //       }}
  //     </Query>
  //   )}

  // </Query>
  const { loading : loadingLogin, error:errorLogin, data:dataLogin } = useQuery(GET_LOGIN);
  // const { loading : loadingInfo, error:errorInfo,data,dataInfo}= useQuery(COMMIT_INFO,{
  //   variables : {
  //     name:"sosniik",
  //     owner:"Cine-Street"
  //   }
  // })
  if (loadingLogin) return <p>Loading...</p>;
  if (errorLogin) return <p>Error :(</p>;
  // const Countlanguage = {}
  // let Countlanguage
  let array = []
  dataLogin.viewer.repositories.nodes.forEach(name => {if(name.nameWithOwner.includes(`${dataLogin.viewer.login}`) == true){
    nameRepo.push(name.nameWithOwner)
    if(name.languages.nodes[0] !== undefined){
      console.log("test LOC LOC :", name.languages.nodes[0].name)
      let nameRepo = name.nameWithOwner.split("/")
      console.log("abcdefghijklmnopqrstuvwxyzn",nameRepo[1])
      const Countlanguage = <GetCommitInfo namee={nameRepo[1]} owner={dataLogin.viewer.login}/>
      console.log(Countlanguage)
      // let saveInformation = ()=>dataCount({name : "nameRepo[1]",
      //   owner : "data.viewer.login"})
      // console.log("je ten supllie",saveInformation)
      // let Countlanguage = <GetCommitInfo name="sosniik" owner="uiehf"/>
      // console.log("leo leo leo ",Countlanguage)
      // array.push(Countlanguage)
      // let test = this.GetCommitInfo('sosniik','Cine-Street')
      // console.log("please graph me soule pas",test)
    }else{
      console.log(errorLogin)
    }
    }
  })
  console.log("hjbfbffffhbhbhbhbhbhbhbhb",array)
  // nameRepo.forEach(name => {let url =`https://api.codetabs.com/v1/loc?github=${name}`
  //   setTimeout(await fetch(url)
  //   .then(response => response.json())
  //   .then()
  //   ,5000)
  // })
  // let url = `https://api.codetabs.com/v1/loc?github=${data.viewer.login}/API_Node`
  // function countGithub(repo) {
  //   fetch('https://api.github.com/repos/'+repo+'/stats/contributors')
  //       .then(response => response.json())
  //       .then(contributors => contributors
  //           .map(contributor => contributor.weeks
  //               .reduce((lineCount, week) => lineCount + week.a - week.d, 0)))
  //       .then(lineCounts => lineCounts.reduce((lineTotal, lineCount) => lineTotal + lineCount))
  //       .then(lines => window.alert(lines));
  //   }
  // countGithub("sosniik/CX-ALGO-OAV")

  console.log("test nameREPO :", nameRepo)
  console.log(JSON.stringify(dataLogin.viewer.contributionsCollection.commitContributionsByRepository))
  return(
    <div>
      {nameRepo}
      {/* {Countlanguage} */}
    </div>
  )
}

function UserLogin() {
  const { loading, error, data } = useQuery(GET_LOGIN);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data.viewer.repositories.nodes[1].languages.nodes[0].name)
  return (
    <div className="userInformation">
      <img src={data.viewer.avatarUrl}
      style={{width : 150, borderRadius:200/2}}
      />
      {data.viewer.repositories.nodes.nameWithOwner}
      <div className="information">
        Commits <br/>
        {data.viewer.contributionsCollection.totalCommitContributions}
      </div>
      <div className="information">
        Repos <br/>
        {data.viewer.repositories.totalCount}
      </div>
      <div className="information">
        Followers <br/>
        {data.viewer.followers.totalCount}
      </div>
      <div className="information">
        following <br/>
        {data.viewer.following.totalCount}
      </div>
    </div>
  )
}

function Summary() {
  const { loading, error, data } = useQuery(GET_LOGIN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return(
    <div className="Summary">
      <h1>{data.viewer.login}</h1>
      <h4>{data.viewer.bio}</h4>
    </div>
  )
}

function Languages(){
  const { loading, error, data } = useQuery(GET_LOGIN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const dataPie = {
    labels: filteredArray,
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  for(let i = 0; i <data.viewer.repositories.totalCount; i ++){
    if(data.viewer.repositories.nodes[i].languages.nodes.length === 0 ){
      console.log("test ok ok ")
    }else{
      data_languages.push(data.viewer.repositories.nodes[i].languages.nodes[0].name)
    }
    // console.log("efiuehfiehfiehfiefhei",data.viewer.contributionsCollection.commitContributionsByRepository[i].repository.primaryLanguage.name)
    // console.log("efiuehf",data.viewer.contributionsCollection.commitContributionsByRepository[i].contributions.totalCount)

    // if(data.viewer.contributionsCollection.commitContributionsByRepository){

    // }
  }
  console.log(data_languages)
  $.each(data_languages, function(i, el){
    if($.inArray(el, filteredArray) === -1) filteredArray.push(el);
});
  console.log("efyegfyg",filteredArray)
  console.log("ehfgueighfueigfyugrfyugvfyuegfyu",data.viewer.repositories.nodes.nameWithOwner)
  return(
    <div className="Languages">
      <Pie data={dataPie} />
    </div>
  )
}

function Overview(){
  const { loading, error, data } = useQuery(GET_LOGIN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return(
    <div className="Overview">
     
    </div>
  )
}
function App() {
  return (
    <div>
      <Summary/>
      <UserLogin />
      <Languages />
      <LOC />
      {/* <GetCommitInfo /> */}
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
