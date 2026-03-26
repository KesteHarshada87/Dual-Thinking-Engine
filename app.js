const API_KEY = "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"; 

// Call Groq API
async function getAIResponse(prompt) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    return "Error fetching response";
  }
}

// Analyze input using AI
async function analyze(input) {
  const humanPrompt = `
You are a human who overthinks emotionally.
Respond in 4-5 short thoughts, each on new line.
Add emotions and confusion.
Input: ${input}
`;

  const machinePrompt = `
You are a logical AI system.
Analyze and give step-by-step decision in short lines.
Be precise and structured.
Input: ${input}
`;

  const humanText = await getAIResponse(humanPrompt);
  const machineText = await getAIResponse(machinePrompt);

  return {
    human: humanText.split("\n").filter(line => line.trim() !== ""),
    machine: machineText.split("\n").filter(line => line.trim() !== "")
  };
}

// UI helpers
function addToUI(type, text) {
  const container = document.getElementById(type + "Output");
  const div = document.createElement("div");
  div.innerText = text;
  container.appendChild(div);
}

function clearUI() {
  document.getElementById("humanOutput").innerHTML = "";
  document.getElementById("machineOutput").innerHTML = "";
}

// Show steps gradually
function showSteps(steps, type, speed) {
  steps.forEach((step, i) => {
    setTimeout(() => {
      addToUI(type, step);
    }, i * speed);
  });
}

// Main function
async function startThinking() {
  const input = document.getElementById("userInput").value;

  if (!input) {
    alert("Please enter something!");
    return;
  }

  clearUI();

  // Loading
  addToUI("human", "Thinking...");
  addToUI("machine", "Processing...");

  const result = await analyze(input);

  clearUI();

  // Human slower, Machine faster
  showSteps(result.human, "human", 1000);
  showSteps(result.machine, "machine", 400);
}