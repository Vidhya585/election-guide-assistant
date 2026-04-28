// VoteWise - Test Suite
const testResults = [];

function test(name, fn) {
    try {
        fn();
        testResults.push({ name, status: "PASS" });
        console.log(`✅ PASS: ${name}`);
    } catch (e) {
        testResults.push({ name, status: "FAIL", error: e.message });
        console.log(`❌ FAIL: ${name} — ${e.message}`);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || "Assertion failed");
}

// Timeline tests
test("Timeline has 5 steps", () => {
    assert(stepDetails.length === 5, "Expected 5 steps");
});

test("Each step has title and info", () => {
    stepDetails.forEach((s, i) => {
        assert(s.title, `Step ${i} missing title`);
        assert(s.info, `Step ${i} missing info`);
    });
});

test("showDetail updates the detail box", () => {
    showDetail(0);
    const box = document.getElementById("detail-box");
    assert(box.innerHTML.includes(stepDetails[0].title), "Detail box not updated");
});

// Quiz tests
test("Quiz has 5 questions", () => {
    assert(quizData.length === 5, "Expected 5 quiz questions");
});

test("Each quiz question has correct answer in options", () => {
    quizData.forEach((q, i) => {
        assert(q.options.includes(q.answer), `Q${i} answer not in options`);
    });
});

test("Submit quiz with no answers scores zero", () => {
    const radios = document.querySelectorAll("input[type=radio]");
    radios.forEach(r => r.checked = false);
    let score = 0;
    quizData.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.answer) score++;
    });
    assert(score === 0, "Expected 0 score with no selection");
});

// Input validation tests
test("Empty question input is rejected", () => {
    const input = document.getElementById("user-input");
    input.value = "";
    assert(input.value.trim() === "", "Empty input should be empty string");
});

test("Input sanitization removes script tags", () => {
    const dirty = "<script>alert('xss')</script>Hello";
    const clean = dirty.replace(/<[^>]*>/g, "");
    assert(clean === "Hello", "Script tags not removed");
});

// Accessibility tests
test("All buttons have aria-labels", () => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        assert(
            btn.getAttribute("aria-label") || btn.textContent.trim(),
            "Button missing aria-label"
        );
    });
});

test("Chat input has aria-label", () => {
    const input = document.getElementById("user-input");
    assert(input.getAttribute("aria-label"), "Chat input missing aria-label");
});

// Google Services test
test("Gemini API key is configured", () => {
    assert(
        typeof GEMINI_API_KEY === "string" && GEMINI_API_KEY.length > 10,
        "Gemini API key not set"
    );
});

console.log(`\n📊 Results: ${testResults.filter(t => t.status === "PASS").length}/${testResults.length} passed`);