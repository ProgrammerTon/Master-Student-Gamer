import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput
} from "react-native";
import { React , useState , useEffect} from "react";
import QuizChoice from "../../components/QuizChoice";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import {Stack} from "expo-router";
import colors from "../../constants/color";
const { width, height } = Dimensions.get('window');

export default function QuizFill({ questionData, onSubmit, questionNumber, totalQuestions  }) {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState([]);
  const [closeQuiz, setCloseQuiz] = useState(false);
  const [userInput, setUserInput] = useState();
  /*
  const  questionData = [
    {
      totalQuestion: 5,
      questionId: 3,
      question: "2+2-1?",
      choicecount: 0,
      choice: [],
      isMultipleAnswer: false,
      answer : ["3"]
    }
  ];
  */
  useEffect(() => {
    setUserInput();
  }, [questionData]);

  return (
    <View style={styles.container}>
      <View style={styles.topPart}>
        <View style={styles.closeQuiz}>
          <TouchableOpacity style={{backgroundColor: colors.white, borderRadius:30}} onPress={()=>setCloseQuiz(true)}>
            <AntDesign name="closecircle" size={35} color={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={styles.quizNumber}>
            <Text style={styles.textNumber}>{questionNumber} / {totalQuestions}</Text>
        </View>
        <View style={styles.question}>
            <Text style={styles.textStyle}> {questionData.question} </Text>
        </View>
      </View>
      
      <View style={styles.bottomPart}>
        <View style={styles.choice}>
        <TextInput
          style={styles.textarea}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Answer"
          keyboardType="number-pad"
          multiline
        />
        </View>
        <View>
          <TouchableOpacity style={styles.nextButton} onPress={() => onSubmit([userInput])}>
            <Text style={{fontSize: 16, color: colors.white}}> Next </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent={true} visible={closeQuiz}>
        <View style={{flex: 1, backgroundColor: "rgba(145, 145, 145, 0.5)"}}>
          <View style={styles.leaveQuizPopUp}>
            <View>
              <Text style={{fontSize: 20, fontWeight: "bold"}}> Do you want to Leave Quiz? </Text>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity style={styles.closeQuizButton} onPress={()=>setCloseQuiz(false)}>
                <Text style={{fontSize: 16, fontWeight: "bold"}}> Cancel </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.leaveQuizButton} onPress={() => router.back()}>
                <Text style={{fontSize: 16, fontWeight: "bold", color: colors.white}}> Leave </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray_bg,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: '1%',
  },
  topPart:{
    height: height * 0.3,
    width: width,
    backgroundColor: colors.green,
  },
  bottomPart:{
    height: height * 0.7,
    width: width,
    justifyContent: "center",
  },
  closeQuiz: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-end",
    marginRight: width * 0.07,
    marginTop: height * 0.07
  },
  quizNumber:{
    alignSelf: "center",
    backgroundColor: colors.gray_button,
    padding: 8,
    paddingHorizontal: 15,
    marginTop: -height * 0.2,
    marginBottom: height * 0.08,
    zIndex: 1,
  },
  question: {
    //flex: 1,
    width: width * 0.9,
    height: height * 0.25,
    backgroundColor: colors.white,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginVertical: -height * 0.1,
    borderRadius:10,
    shadowColor: colors.gray_bgblur,
    shadowOffset: [{ width: 0, height: 0 }],
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textNumber:{
    fontSize: 20,
    fontWeight: "bold"
  },
  textStyle:{
    fontSize: 20,
    //fontWeight: "bold"
  },
  choice: {
    flex: 4,
    width: width * 0.9,
    padding: 10,
    marginTop: height * 0.12,
    marginBottom: height * 0.2,
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  nextButton:{
    paddingHorizontal: width * 0.05,
    paddingVertical:10,
    marginRight:20,
    marginVertical: -height * 0.15,
    backgroundColor: colors.blue, 
    borderRadius:20,
    alignSelf: "flex-end",
  },
  textarea: {
    height: 100,
    marginTop: 10,
    borderWidth: 3,
    borderColor: colors.green,
    borderStyle:"solid",
    borderRadius:10,
    fontSize: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.white,
    justifyContent: "center",
    //niggaalignSelf: "center",
  },
  headerText: {
    flex: 1,
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  closeQuizButton:{
    paddingHorizontal: width * 0.05,
    paddingVertical:10,
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor: colors.gray_button,
    paddingHorizontal: width * 0.05,
    borderRadius:20,
  },
  leaveQuizButton:{
    paddingHorizontal: width * 0.05,
    paddingVertical:10,
    marginVertical: 5,
    marginHorizontal: 20,
    backgroundColor: colors.red,
    paddingHorizontal: width * 0.05,
    borderRadius:20,
  },
  leaveQuizPopUp:{
    backgroundColor: colors.white, 
    marginTop: height*0.4, 
    margin:50, 
    padding: 20, 
    alignItems: "center", 
    borderRadius: 10, 
    height: height * 0.15
  }
})
{
  /* <FlatList
          data={quizData[currentQuestion].choice}
          renderItem={({item})=>(
            <QuizChoice content={item}/>
          )}
          keyExtractor={(item)=>item.id}
          ListHeaderComponent={<Text style={styles.headerText}>Choice</Text>}
        /> */}