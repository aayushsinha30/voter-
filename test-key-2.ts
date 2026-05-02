import { personalVotingRoadmap } from './src/ai/flows/personal-voting-roadmap-flow';

async function test() {
  console.log("Testing new API key...");
  try {
    const res = await personalVotingRoadmap({
      country: "India",
      location: "Mumbai",
      age: 25,
      voterStatus: "registered"
    });
    console.log("Success! Output:", JSON.stringify(res).substring(0, 50) + "...");
  } catch (e) {
    console.error("Failed:", e);
  }
}

test();
