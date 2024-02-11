import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Ensure this is the correct model for your use case
        messages: [
          {
            role: "user",
            content: req.body.message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Assuming the response structure might be slightly different from the completions endpoint
    // Adjust the following line if necessary based on the actual response structure
    const botResponse = response.data.choices[0].message.content.trim();
    res.json({ choices: [{ message: { content: botResponse } }] });
  } catch (error) {
    console.error(
      "Error calling OpenAI:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .send("An error occurred while fetching the response from OpenAI.");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
