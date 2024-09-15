// apiService.js
import axios from 'axios';

const apiService = async (songTopic) => {
  try {
    // Make the POST request to generate the song
    const postResponse = await axios.post(
      'https://studio-api.suno.ai/api/external/generate/',
      {
        topic: `a song that teaches ${songTopic} that is solely focused on education, and has as many words as possible`,
        tags: 'pop',
      },
      {
        headers: {
          'accept-language': 'en-US,en;q=0.9',
          authorization: 'Bearer vZ2kwEe9VMsbD8y42h7j67WYtAfmvW1n',
          'content-type': 'text/plain;charset=UTF-8',
        },
      }
    );

    console.log('Post Response:', postResponse.data);

    const url = 'https://studio-api.suno.ai/api/external/clips/';
    const token = 'vZ2kwEe9VMsbD8y42h7j67WYtAfmvW1n';
    const clip_id = postResponse.data.id;

    // Poll the GET endpoint until the status is "complete"
    let status = '';
    let getResponse = null;

    do {
      // Wait a bit before each poll to avoid overwhelming the server
      await new Promise((r) => setTimeout(r, 3000)); // Wait 1 second between polls

      // Get the clip data
      getResponse = await axios.get(url, {
        params: { ids: clip_id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Get Response:', getResponse.data);

      status = getResponse.data[0]?.status;
    } while (status !== 'complete');

    const clipData = getResponse.data[0];
    console.log('Clip Data:', clipData);

    // Return the url and lyrics
    return { url: clipData.audio_url, lyrics: clipData.metadata.prompt };
  } catch (error) {
    console.error('Error in apiService:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default apiService;
