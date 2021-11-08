import React from "react";
import $ from 'jquery';
import { render } from "react-dom";
import { Doughnut } from 'react-chartjs-2';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
const token = process.env.REACT_APP_GITHUB_TOKEN
const link = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers : {authorization : `Bearer ${token}`}
});
let data_languages = []
let filteredArray = []
const GET_LOGIN = gql`
query { 
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
      commitContributionsByRepository{
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
console.log(data_languages,filteredArray)
const data = {
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});


function UserLogin() {
  const { loading, error, data } = useQuery(GET_LOGIN);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
    console.log(data.viewer.repositories.nodes[1].languages.nodes[0].name)
    for(let i = 0; i <data.viewer.repositories.totalCount; i ++){
      if(data.viewer.repositories.nodes[i].languages.nodes.length === 0 ){
        console.log("test ok ok ")
      }else{
        data_languages.push(data.viewer.repositories.nodes[i].languages.nodes[0].name)
      }
      console.log("efiuehfiehfiehfiefhei",data.viewer.contributionsCollection.commitContributionsByRepository[i].repository.primaryLanguage.name)
      console.log("efiuehf",data.viewer.contributionsCollection.commitContributionsByRepository[i].contributions.totalCount)

      // if(data.viewer.contributionsCollection.commitContributionsByRepository){

      // }
    }
    console.log(data_languages)
    $.each(data_languages, function(i, el){
      if($.inArray(el, filteredArray) === -1) filteredArray.push(el);
  });
    console.log("efyegfyg",filteredArray)
  return (
    <div>
      {data.viewer.login}
      <img src={data.viewer.avatarUrl}/>
      {data.viewer.repositories.nodes.nameWithOwner}
    </div>
  )
}
function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <UserLogin />
      <Doughnut data={data} />
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
