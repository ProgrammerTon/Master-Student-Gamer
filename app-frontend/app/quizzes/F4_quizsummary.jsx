import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import CommentBox from "../Quiz_Component/CommentBlock";
import RatingBlock from "../Quiz_Component/Rating";
import SumButton from "../Quiz_Component/SummaryButton";
import CommentBar from "../Quiz_Component/CommentBar";
import RatingBar from "../Quiz_Component/RatingBar";
import { TimeDateBlock, UsernameBlock } from "../Quiz_Component/Time_Username";
import AnswerButton from "./AnswersButton";
import ScoreProgress from "./ScoreProgressBar";
import { useGlobalContext } from "../../context/GlobalProvider";
import { findQuiz } from "../../services/QuizService";
import { getCommentsQuiz } from "../../services/CommentService";
import StatButton from "../Quiz_Component/StatButton";
import { createCommentSource } from "../../services/CommentService";
import { router } from "expo-router";
import { ratingQuiz } from "../../services/QuizService";
import { getUserRatingQuiz } from "../../services/QuizService";
import colors from "../../constants/color";
import fonts from "../../constants/font";
import Entypo from "@expo/vector-icons/Entypo";

const { width, height } = Dimensions.get("window");

const QuizSummaryPage = ({
  score,
  userAnswers,
  quizData,
  eachQuestionAnswers,
  id,
  handlesetUserState,
}) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [quiz, setQuiz] = useState(null);
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);

  const handleSubmitComment = async () => {
    if (commentInput.trim() === "") return; // Prevent empty comments

    // Create a new comment object
    const newComment = {
      username: user.username, // Replace with dynamic username if available
      date: new Date().toLocaleDateString(),
      comment: commentInput,
    };

    // Add the new comment to the top of the comments list
    setComments([newComment, ...comments]);

    const data = await createCommentSource(null, id, commentInput);
    if (!data) {
      Alert.alert("Failed");
    }

    // Clear the comment input
    setCommentInput("");
  };

  const fetchQuiz = async () => {
    const data = await findQuiz(id);
    if (!data) {
      return null;
    }
    console.log("Quiz", data);
    const date = new Date(data.updatedAt);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    }).format(date);
    data.date = formattedDate;
    setQuiz(data);
  };

  const fetchComments = async () => {
    const data = await getCommentsQuiz(id);
    const newComment = data.map((com) => ({
      username: com.parentComment.username, // Replace with dynamic username if available
      date: new Date(com.parentComment.updatedAt).toLocaleDateString(),
      comment: com.parentComment.content,
    }));
    const reversedComments = newComment.reverse();
    setComments([...reversedComments]);
  };

  const fetchRating = async () => {
    const data = await getUserRatingQuiz(user._id, id);
    setRatingScore(data);
  };

  const onRefresh = async () => {
    await fetchQuiz();
    await fetchComments();
    await fetchRating();
  };

  const handleRating = async (sc) => {
    await ratingQuiz(id, user._id, sc);
    setRatingScore(sc);
    fetchQuiz();
  };

  useEffect(() => {
    if (user && quiz) {
      fetchRating();
    }
  }, [user, quiz]);

  useEffect(() => {
    setRefreshing(true);
    fetchQuiz();
    fetchComments();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#9Bd35A", "#689F38"]} // Optional: Customize refresh colors
        />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Entypo name="chevron-left" size={30} color={colors.blue} />
        </TouchableOpacity>
        <Text style={[fonts.EngBold22, styles.headerText]}>Finished</Text>
      </View>

      {/* Score and progress bar container */}
      <View style={styles.scoreProgressContainer}>
        <Text style={[fonts.EngBold22, styles.scoreText]}>
          {score} / {quizData.length}
        </Text>
        <ScoreProgress percent={(score / quizData.length) * 100} />
      </View>

      <StatButton handleOnPress={() => handlesetUserState("Statistic")} />
      <AnswerButton
        eachQuestionAnswers={eachQuestionAnswers}
        userAnswers={userAnswers}
        quizData={quizData}
      />
      <View style={styles.ratingContainer}>
        <RatingBlock
          ScoreRating={Math.round(quiz?.averageScore)}
          numComment={quiz?.count}
        />
        <RatingBar onRatingChange={handleRating} initialRating={ratingScore} />
      </View>

      {/* CommentBar with input */}
      <View style={styles.commentContainer}>
      <CommentBar
        value={commentInput}
        handleChangeText={setCommentInput}
        onSubmit={handleSubmitComment} // Submits on pressing "Done" on keyboard
      />

      {/* Render all comments */}
        {comments.map((comment, index) => (
          <CommentBox
            key={index}
            username={comment.username}
            date={comment.date}
            comment={comment.comment}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default QuizSummaryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray_bg,
  },
  header: {
    backgroundColor: colors.green,
    height: height * 0.1,
    padding: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: width * 0.05,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 5,
  },
  headerText: {
    color: colors.black,
  },
  scoreProgressContainer: {
    alignItems: "center", // Center contents horizontally
    marginVertical: 20,
  },
  scoreText: {
    color: colors.black,
    fontSize: 40,
    marginBottom: 20,
    textAlign: "center", // Center the text
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 16,
  },
  correctText: {
    fontSize: 16,
    color: colors.green,
  },
  commentContainer: {
    marginTop: 12,
    marginHorizontal: width * 0.05,
  },
  ratingContainer: {
    marginHorizontal: width * 0.05,
    marginTop: 10,
  },
});