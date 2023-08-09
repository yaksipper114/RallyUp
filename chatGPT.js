async function runCompletion(prompt) {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt
    });
    return completion.data.choices[0].text;
}