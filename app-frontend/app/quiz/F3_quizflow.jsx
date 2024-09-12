import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import QuizFill from "../quizzes/F3_quizfill";
import QuizChoices from "../quizzes/F3_quizchoice";
import QuizSummaryPage from "../quizzes/F4_quizsummary";
import { useQuestionContext } from "../../context/QuestionProvider";

const QuizFlow = () => {
  const { questions } = useQuestionContext();
  // const quizData = [
  //   {
  //     question: "Charay Cool or not?",
  //     qtype: "choice",
  //     choice: ["Not", "Cool"],
  //     answer: [0], // Correct choice is 'Cool'
  //   },
  //   {
  //     question: "2+2",
  //     qtype: "fill",
  //     choice: [], // No choices, since it's a fill-in question
  //     answer: [4], // The correct answer is 4
  //   },
  //   {
  //     question: "2+5 and 4+5",
  //     qtype: "choice",
  //     choice: ["0", "7", "9", "1"],
  //     answer: [1, 2], // Correct answers are '7' and '9'
  //   },
  //   {
  //     question: "2+5 and 3+2 and 1+8",
  //     qtype: "choice",
  //     choice: ["0", "7", "9", "1", "5"],
  //     answer: [1, 2, 4], // Correct answers are '7' and '9' and '5'
  //   },
  // ];
  const [quizData, setQuizData] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswerSubmit = (userAnswer) => {
    const correctAnswer = quizData[currentQuestion].answer;
    const isCorrect =
      JSON.stringify(correctAnswer) === JSON.stringify(userAnswer.map(Number));

    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, userAnswer]);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  useEffect(() => {
    if (questions.length !== 0) {
      setQuizData([...questions]);
    }
  }, [questions]);

  if (quizData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!quizFinished ? (
        quizData[currentQuestion]?.qtype === "choice" ? (
          <QuizChoices
            questionData={quizData[currentQuestion]}
            onSubmit={handleAnswerSubmit}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizData.length}
          />
        ) : (
          <QuizFill
            questionData={quizData[currentQuestion]}
            onSubmit={handleAnswerSubmit}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizData.length}
          />
        )
      ) : (
        <QuizSummaryPage
          score={score}
          userAnswers={userAnswers}
          quizData={quizData}
        />
      )}
    </View>
  );
};

export default QuizFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
