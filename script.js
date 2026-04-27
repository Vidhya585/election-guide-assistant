// =============================================
// VOTEWISE — Election Guide Assistant
// Powered by Google Gemini AI
// =============================================

const GEMINI_API_KEY = "YOUAIzaSyBG0WZPan1E9T-3eCskIfsrFefZO2IvNxY"; // 🔑 Replace this

// --- TIMELINE DATA ---
const stepDetails = [
    {
        title: "📋 Step 1: Voter Registration",
        info: "Every citizen above 18 must register to vote. You need a valid ID proof (Aadhaar, passport, or driving licence). Registration happens through the Election Commission portal or offline at your local booth. Deadline is usually 4–6 weeks before the election date."
    },
    {
        title: "🗂️ Step 2: Candidate Filing",
        info: "Any eligible citizen can file a nomination to contest elections. They submit papers to the Returning Officer along with a security deposit. Nominations are verified and candidates can withdraw within a set window. The final candidate list is published officially."
    },
    {
        title: "📣 Step 3: Campaigning",
        info: "Candidates campaign by holding rallies, distributing pamphlets, and running ads. The Model Code of Conduct (MCC) applies here — parties cannot bribe voters or misuse government resources. Campaigning ends 48 hours before voting day (called the Silent Period)."
    },
    {
        title: "🗳️ Step 4: Voting Day",
        info: "Citizens visit their assigned polling booth with their Voter ID card. The process: show ID → verify name in list → finger ink mark → press EVM button. Voting is secret and protected. Booths are open usually from 7 AM to 6 PM. VVPAT machines let you verify your vote."
    },
    {
        title: "🏆 Step 5: Results & Oath",
        info: "Votes are counted on a declared date. EVMs are opened, votes tallied, and winner declared by Returning Officer. The winning candidate takes oath of office before assuming their role. Results are published officially by the Election Commission."
    }
];

function showDetail(index) {
    const box = document.getElementById("detail-box");
    const item = stepDetails[index];
    box.innerHTML = `<strong>${item.title}</strong><br/><br/>${item.info}`;

    // Highlight active step
    document.querySelectorAll(".step-icon").forEach((el, i) => {
        el.style.background = i === index ? "#fff" : "#f9d342";
        el.style.color = i === index ? "#302b63" : "#0f0c29";
    });
}

// --- AI CHAT ---
let lastBotMessage = "";

async function askAI() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const question = input.value.trim();

    if (!question) return;

    // Show user message
    chatBox.innerHTML += `<div class="message user">🙋 ${question}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show loading
    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="message bot" id="${loadingId}">⏳ Thinking...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are VoteWise, a friendly election guide assistant for Indian elections. 
Answer the following question clearly, simply, and in 3-5 sentences. 
Be factual, helpful, and easy to understand for a first-time voter.
Question: ${question}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't fetch an answer. Please try again.";

        // Replace loading with answer
        document.getElementById(loadingId).textContent = "🤖 " + answer;
        lastBotMessage = answer;

    } catch (err) {
        document.getElementById(loadingId).textContent = "❌ Something went wrong. Check your API key or internet connection.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Allow Enter key to send
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("user-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") askAI();
    });
    loadQuiz();
});

// --- TEXT TO SPEECH (Google Web Speech API) ---
function speakLast() {
    if (!lastBotMessage) {
        alert("Ask a question first so I can read the answer for you!");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(lastBotMessage);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}

// --- QUIZ ---
const quizData = [
    {
        question: "What is the minimum age to vote in India?",
        options: ["16", "18", "21", "25"],
        answer: "18"
    },
    {
        question: "What does EVM stand for?",
        options: ["Electronic Voting Machine", "Electoral Verification Method", "Election Vote Marker", "Electronic Voter Module"],
        answer: "Electronic Voting Machine"
    },
    {
        question: "How many hours before voting does campaigning stop?",
        options: ["12 hours", "24 hours", "48 hours", "72 hours"],
        answer: "48 hours"
    },
    {
        question: "What is VVPAT used for?",
        options: ["Voter registration", "Verifying your vote was cast correctly", "Counting final results", "Candidate filing"],
        answer: "Verifying your vote was cast correctly"
    },
    {
        question: "Who conducts elections in India?",
        options: ["Supreme Court", "Parliament", "Election Commission of India", "Prime Minister's Office"],
        answer: "Election Commission of India"
    }
];

function loadQuiz() {
    const container = document.getElementById("quiz-container");
    quizData.forEach((q, i) => {
        let html = `<div class="quiz-question"><p>Q${i + 1}. ${q.question}</p>`;
        q.options.forEach(opt => {
            html += `<label><input type="radio" name="q${i}" value="${opt}" /> ${opt}</label>`;
        });
        html += `</div>`;
        container.innerHTML += html;
    });
}

function submitQuiz() {
    let score = 0;
    quizData.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.answer) score++;
    });

    const result = document.getElementById("quiz-result");
    const percent = Math.round((score / quizData.length) * 100);

    if (percent === 100) {
        result.textContent = `🎉 Perfect! ${score}/${quizData.length} — You're a VoteWise champion!`;
    } else if (percent >= 60) {
        result.textContent = `👍 Good job! ${score}/${quizData.length} — Keep learning!`;
    } else {
        result.textContent = `📚 ${score}/${quizData.length} — Read through the steps above and try again!`;
    }
}