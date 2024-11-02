// public/app.js
document.getElementById('interview-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const answers = [
    e.target.answer1.value,
    e.target.answer2.value,
    e.target.answer3.value,
  ];

  // Show a loading message or spinner here if desired

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { blogPost, imageUrl } = await response.json();

    // Display the results
    document.getElementById('blog-post').textContent = blogPost;
    document.getElementById('blog-image').src = imageUrl;
    document.getElementById('result').style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while generating your blog post.');
  }
});
