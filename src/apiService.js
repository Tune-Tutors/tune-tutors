// apiService.js
//const axios = require('axios');
import axios from 'axios';
const React = require('react');
const { useRef, useEffect } = React;

const apiService = async (songTopic)=>{
    axios.post('https://studio-api.suno.ai/api/external/generate/', 
        {
          topic: songTopic,
          tags: "pop"
        }, 
        {
          headers: {
            'accept-language': 'en-US,en;q=0.9',
            'authorization': 'Bearer vZ2kwEe9VMsbD8y42h7j67WYtAfmvW1n',
            'content-type': 'text/plain;charset=UTF-8',
          }
        }
      )
    .then(async (response) => {
        console.log(response);
        await new Promise(r => setTimeout(r, 3000));        
        const url = `https://studio-api.suno.ai/api/external/clips/`;
        const token = 'vZ2kwEe9VMsbD8y42h7j67WYtAfmvW1n';
        const clip_id= response.data.id;
      axios.get(url, 
        {params: { 

        ids: clip_id },
        headers: {
          'Authorization': `Bearer ${token}`,
          //'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          //'Accept': 'application/json'
        }
    })
      .then(async(response) => {
        console.log(response);   
        let status= response.data[0].status;
        while(status!= "complete"){
            response= await axios.get(url, 
                {params: { 
        
                ids: clip_id },
                headers: {
                  'Authorization': `Bearer ${token}`,
                  //'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                  //'Accept': 'application/json'
                }
            })
            status= response.data[0].status;
            await new Promise(r => setTimeout(r, 3000)); 
            console.log(response);       
        }
        console.log(response.data[0].audio_url);
        const audio_url=response.data[0].audio_url;
        return audio_url;
      })
      
    })
    
    };

//module.exports = apiService;
export default apiService;

