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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

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
  }
  console.log(data_languages)
  $.each(data_languages, function(i, el){
    if($.inArray(el, filteredArray) === -1) filteredArray.push(el);
});
  return(
    <div className="Languages">
      <Pie data={dataPie} />
    </div>
  )
}


function App() {
  return (
    <div>
      <Summary/>
      <UserLogin />
      <Languages />
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
