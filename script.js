
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const questionEl = document.getElementById('question');
    const answersDiv = document.getElementById('answers');
    const resultEl = document.getElementById('result');
    const progressEl = document.getElementById('progress');
    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const skipBtn = document.getElementById('skipBtn');
    const restartBtn = document.getElementById('restartBtn');
    const stopBtn = document.getElementById('stopBtn');

    startBtn.onclick = async () => {
      currentQuestionIndex = 0;
      score = 0;
      questions = await fetchQuestions();
      showQuestion();
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      skipBtn.style.display = 'inline-block';
    };

    nextBtn.onclick = () => {
      currentQuestionIndex++;
      showQuestion();
    };

    skipBtn.onclick = () => {
      currentQuestionIndex++;
      resultEl.textContent = 'Question skipped.';
      showQuestion();
    };

    restartBtn.onclick = () => {
      score = 0;
      currentQuestionIndex = 0;
      showQuestion();
      restartBtn.style.display = 'none';
    };

    stopBtn.onclick = () => {
      questionEl.innerHTML = `<h2>Quiz Stopped</h2><p>Your Score: ${score}/${questions.length}</p>`;
      answersDiv.innerHTML = '';
      resultEl.textContent = '';
      nextBtn.style.display = 'none';
      skipBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      progressEl.textContent = '';
    };

    async function fetchQuestions() {
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=17&type=multiple');
      const data = await res.json();
      return data.results.map(q => ({
        question: decodeHTML(q.question),
        correct_answer: decodeHTML(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(ans => decodeHTML(ans))
      }));
    }

    function decodeHTML(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

    function showQuestion() {
      if (currentQuestionIndex >= questions.length) {
        questionEl.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
        answersDiv.innerHTML = '';
        resultEl.textContent = '';
        nextBtn.style.display = 'none';
        skipBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        progressEl.textContent = '';
        return;
      }

      const q = questions[currentQuestionIndex];
      const correctAnswer = q.correct_answer;
      const answers = [...q.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);

      progressEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
      questionEl.textContent = q.question;
      answersDiv.innerHTML = '';
      resultEl.textContent = '';
      nextBtn.style.display = 'none';

      answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(answer === correctAnswer, correctAnswer);
        answersDiv.appendChild(btn);
      });
    }

    function selectAnswer(correct, correctAnswer) {
      if (correct) {
        score++;
        resultEl.textContent = 'Correct!';
      } else {
        resultEl.innerHTML = `Wrong!<br><span style="color: #d32f2f; font-weight: bold;">Correct Answer: ${correctAnswer}</span>`;
      }

      Array.from(answersDiv.children).forEach(btn => btn.disabled = true);
      nextBtn.style.display = 'inline-block';
    }
  