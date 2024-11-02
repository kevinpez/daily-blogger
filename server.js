// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to handle the interview data and generate the blog post
app.post('/generate', async (req, res) => {
  const { answers } = req.body;

  // Create a prompt for GPT-4
  const prompt = `Using the following details, write a first-person blog post summarizing the user's day in an engaging and positive tone.\n\nDetails:\n${answers.join('\n')}`;

  try {
    // Generate the blog post
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
    });

    const blogPost = completion.choices[0].message.content.trim();

    // Replace the image prompt generation with a safer version
    const imagePrompt = `A safe, family-friendly illustration of a daily life scene with a positive mood`;

    // Generate the image using DALL·E
    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '512x512',
    });

    const imageUrl = imageResponse.data[0].url;

    // Send the blog post and image URL back to the client
    res.json({ blogPost, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating content.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
