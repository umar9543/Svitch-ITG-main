import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import React from 'react';
import { Font } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  footerContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: "space-between",
    border: '1px solid #ccc',
    padding: 10,
    borderRadius: 8,
    gap: 140,
    marginBottom: 15,
  },
  leftSection: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
  rightSection: {
    flex: 1,
    fontSize: 10,
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
  },
  sectionContainer: {
    border: '1px solid #ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    marginBottom: 15,
    borderBottom: 1,
  },
  questionText: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    marginBottom: 0,
    marginTop: 2,
    maxWidth: 420,
  },
  answerText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    marginBottom: 15,
    paddingLeft: 2,
  },
  linkStyle: {
    fontSize: 10,
    color: 'blue',
    textDecoration: 'underline',
    marginLeft: 5,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 2,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
// const allQuestions = [
//     {
//         "Title": "Test ",
//         "Questions": [
//             {
//                 "QuestionnaireMstID": "1",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "DO YOU HAVE STAFF UNDER 15 YEARS OF AGE",
//                 "Guide": "No Instructions",
//                 "MaxChoices": "2",
//                 "ChoiceType": "Single Choice (Radio Buttons)",
//                 "Choices": [
//                     {
//                         "ChoiceText": "YES",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "1",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "249",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Founding Date",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Date",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "384",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": "12/1/2024 12:00:00 AM"
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "249",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Founding Date",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Date",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "384",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": "12/1/2024 12:00:00 AM"
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "249",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Founding Date",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Date",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "384",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": "12/1/2024 12:00:00 AM"
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "249",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Founding Date",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Date",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "384",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": "12/1/2024 12:00:00 AM"
//                     }
//                 ]
//             },

//             {
//                 "QuestionnaireMstID": "249",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Founding Date",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Date",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "384",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": "12/1/2024 12:00:00 AM"
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "239",
//                 "Marks": "5.00",
//                 "QuestionType": "0",
//                 "AttemptStatus": "Not Attempted",
//                 "Question": "New Question ",
//                 "Guide": "No Instructions",
//                 "MaxChoices": "2",
//                 "ChoiceType": "Multiple Choice (Checkboxes)",
//                 "Choices": [
//                     {
//                         "ChoiceText": "YES",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "250",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     },
//                     {
//                         "ChoiceText": "NO",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "251",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "Title": "Text Input",
//         "Questions": [
//             {
//                 "QuestionnaireMstID": "2",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "New Question ",
//                 "Guide": "no Instructions",
//                 "MaxChoices": "",
//                 "ChoiceType": "Text",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "PDF",
//                         "QuestionnaireDtlID": "3",
//                         "FileURL": "https://svitchapi.swtcloud.net/API_Docs/SupplierAssessmentDocs/2/3/58cc0e59-9283-4046-b144-0ee50bea2f7e.pdf",
//                         "ResponseText": "This is valid",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     }
//                 ]
//             },
//             {
//                 "QuestionnaireMstID": "256",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Total turnover of last year (USD)",
//                 "Guide": "N/A",
//                 "MaxChoices": "",
//                 "ChoiceType": "Numeric",
//                 "Choices": [
//                     {
//                         "ChoiceText": "",
//                         "FileType": "NA",
//                         "QuestionnaireDtlID": "391",
//                         "FileURL": "",
//                         "ResponseText": "",
//                         "ResponseNumeric": "100653.00",
//                         "ResponseDate": null
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "Title": "Test Question",
//         "Questions": [
//             {
//                 "QuestionnaireMstID": "232",
//                 "Marks": "5.00",
//                 "QuestionType": "1",
//                 "AttemptStatus": "Attempted",
//                 "Question": "Test Multiple select Question",
//                 "Guide": "Select options ",
//                 "MaxChoices": "3",
//                 "ChoiceType": "Multiple Choice (Checkboxes)",
//                 "Choices": [
//                     {
//                         "ChoiceText": "YES",
//                         "FileType": "PDF",
//                         "QuestionnaireDtlID": "237",
//                         "FileURL": "https://svitchapi.swtcloud.net/API_Docs/SupplierAssessmentDocs/232/237/ce7fb04b-5860-478e-b48d-dcd50f9de3fc.pdf",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     },
//                     {
//                         "ChoiceText": "Maybe",
//                         "FileType": "PDF",
//                         "QuestionnaireDtlID": "239",
//                         "FileURL": "https://svitchapi.swtcloud.net/API_Docs/SupplierAssessmentDocs/232/239/101b8075-c455-4ccd-8ad7-8f8b59af0483.pdf",
//                         "ResponseText": "",
//                         "ResponseNumeric": null,
//                         "ResponseDate": null
//                     }
//                 ]
//             }
//         ]
//     }
// ]

const Conrad = ({ allQuestions, mstData, marksData }) => {
  // console.log("allQuestions", allQuestions);
  // console.log("mstData", mstData);
  // console.log("marksData", marksData);
  function wrapText(text, maxCharsPerLine) {
    if (!text) return '';

    const words = text.split(' '); // Split by spaces
    let lines = [];
    let currentLine = '';

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word; // Add word with space if not first
      } else {
        lines.push(currentLine); // Store the current line
        currentLine = word; // Start new line with current word
      }
    });

    if (currentLine) lines.push(currentLine); // Add the last line

    return lines.join('\n'); // Join with line breaks
  }

  return (
    <Document title="Answer Sheet">
      <Page size="A4" style={styles.page} x>
        {/* Logo */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Image source={'/logo/fullLogo.png'} style={{ height: 35, width: 120 }} />
          </View>
          <View>
            <Text style={{ fontSize: 8, fontFamily: 'Roboto-Medium' }}>
              <Text>Questionnaire: </Text>
              <Text style={{ fontSize: 8, fontFamily: 'Roboto-Regular' }}>
                {mstData?.ProjectName}
              </Text>
            </Text>
            {/* <Text style={{ fontSize: 8, fontFamily: 'Roboto-Medium', textAlign: 'left' }}>
              Survey No. :
              <Text style={{ fontSize: 8, fontFamily: 'Roboto-Regular', textAlign: 'left' }}>
                {' '}
                QAS-25-001
              </Text>
            </Text> */}
            <Text style={{ fontSize: 8, fontFamily: 'Roboto-Medium', textAlign: 'left' }}>
              <Text>Context: </Text>
              <Text style={{ fontSize: 8, fontFamily: 'Roboto-Regular', textAlign: 'left' }}>
                {wrapText(mstData?.Context, 40)}
              </Text>
            </Text>
          </View>
        </View>

        {/* Main Title */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 14,
            fontFamily: 'Roboto-Bold',
            marginTop: 10,
          }}
        >
          <Text>Survey No : {mstData?.SurveyNo}</Text>
        </View>

        {/* Main Header */}
        <View style={styles.headerContainer}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Company Name: </Text>
              {mstData?.CompanyName}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Responded By: </Text>
              {mstData?.RespondBy}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Job Title: </Text>
              {mstData?.JobTitle}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Country: </Text>
              {mstData?.CountryName}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Assessment Date: </Text>
              {fDate(mstData?.AssessmentDate)}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Total Questions: </Text>
              {mstData?.TotalQuestions}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Mandatory: </Text>
              {mstData?.TotalMandatory}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Optional: </Text>
              {mstData?.TotalOptional}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Attempted: </Text>
              {mstData?.TotalAttempted}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Total Obtained Marks: </Text>{' '}
              {marksData?.reduce((sum, mark) => {
                return sum + parseFloat(mark?.Marks); // Convert string to number and add to sum
              }, 0) || 0}
            </Text>
          </View>
        </View>

        {/* Render Questions */}
        {allQuestions.map((section, index) => (
          <View key={index} style={styles.sectionContainer} wrap={false}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Title : {section.Title}</Text>

            {/* Questions */}
            {section.Questions.map((q, qIndex) => (
              <View key={qIndex} wrap={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    gap: 5,
                  }}
                >
                  <Text style={styles.questionText}>
                    Q{qIndex + 1}. {q.Question}
                    {q.QuestionType === '1' && <Text style={{ color: 'red' }}> *</Text>}
                  </Text>
                  <Text style={styles.marksText}>
                    ({parseFloat(q.Marks) % 1 === 0 ? parseInt(q.Marks) : 0} Marks)
                  </Text>
                </View>

                {/* Check Attempt Status */}
                {q.AttemptStatus === 'Not Attempted' ? (
                  <Text style={[styles.answerText, {fontFamily: 'Roboto-Bold',  marginBottom: 20 }]  }>
                    Ans :<Text style={{ color: 'red'}}> Not Attempted</Text>
                  </Text>
                ) : (
                  /* If the question is attempted, check for Choices */
                  q.Choices &&
                  q.Choices.length > 0 && (
                    <View style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
                      {/* If Multiple Choice (Checkboxes), display checkboxes first */}
                      {q.ChoiceType === 'Multiple Choice (Checkboxes)' ? (
                        <View>
                          {/* Display "Ans:" only once before the checkboxes */}
                          <Text style={[styles.answerText, { marginBottom: 2 }]}>Ans:</Text>

                          {q.Choices.map((choice, cIndex) => (
                            <View
                              key={cIndex}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                marginBottom: 5,
                                paddingLeft: 5,
                              }}
                            >
                              {/* Display Checkbox Symbol */}
                              <Text style={{ marginRight: 2 }}>☑</Text>

                              {/* Answer Text */}
                              <Text style={styles.answerText}>{choice.ChoiceText}</Text>

                              {/* Display File Link if Exists */}
                              {choice.FileType !== 'NA' && choice.FileURL && (
                                <Link src={choice.FileURL} style={styles.linkStyle}>
                                  View File
                                </Link>
                              )}
                            </View>
                          ))}
                        </View>
                      ) : (
                        /* If not Multiple Choice (Checkboxes), display as normal */
                        q.Choices.map((choice, cIndex) => (
                          <View
                            key={cIndex}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              marginBottom: 5,
                            }}
                          >
                            {/* Answer Text */}
                            <Text style={styles.answerText}>
                              Ans: {choice.ChoiceText || choice.ResponseText}
                              {choice.ResponseNumeric
                                ? ` ${
                                    parseFloat(choice.ResponseNumeric) % 1 === 0
                                      ? parseInt(choice.ResponseNumeric)
                                      : choice.ResponseNumeric
                                  }`
                                : ''}
                              {choice.ResponseDate
                                ? ` ${new Date(choice.ResponseDate).toLocaleDateString('en-US')}`
                                : ''}
                            </Text>

                            {/* Display File Link if Exists */}
                            {choice.FileType !== 'NA' && choice.FileURL && (
                              <Link src={choice.FileURL} style={styles.linkStyle}>
                                View File
                              </Link>
                            )}
                          </View>
                        ))
                      )}
                    </View>
                  )
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footerContainer} fixed>
          <Link href="https://www.itginnovators.com/" style={{ textDecoration: 'none' }}>
            <Text style={{ color: '#000' }}>Developed by: www.itginnovators.com</Text>
          </Link>
        </View>
      </Page>
    </Document>
    // </PDFViewer>
  );
};

// Register Fonts

Font.register({ family: 'Roboto-Regular', src: '/fonts/Roboto-Regular.ttf' });
Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' });
Font.register({ family: 'Roboto-Medium', src: '/fonts/Roboto-Medium.ttf' });
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});
export default Conrad;
