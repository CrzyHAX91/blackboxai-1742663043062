const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testSocialPosts = async () => {
  try {
    // Post a new social post
    const postResponse = await fetch('http://localhost:3001/api/social/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test post content' }),
    });

    if (!postResponse.ok) {
      console.error('Post creation failed with status:', postResponse.status);
      const text = await postResponse.text();
      console.error('Response:', text);
      return;
    }

    const postData = await postResponse.json();
    console.log('Post created:', postData);

    // Get all social posts
    const getResponse = await fetch('http://localhost:3001/api/social/posts');
    if (!getResponse.ok) {
      console.error('Fetching posts failed with status:', getResponse.status);
      const text = await getResponse.text();
      console.error('Response:', text);
      return;
    }

    const posts = await getResponse.json();
    console.log('All posts:', posts);
  } catch (error) {
    console.error('Error during social posts test:', error);
  }
};

testSocialPosts();
