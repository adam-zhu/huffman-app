import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonSkeletonText,
} from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Questionnaire/QuestionnaireContainer.scss";
import {
  get_questions,
  get_answers,
  update_question_answer,
  submit_answers,
} from "Store/questionnaire/thinks";
import { resolve_input_element_value } from "Utils";

const QuestionnaireContainer = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_questions());
    dispatch(get_answers(match.params.project_objectId));
  }, [match.params.project_objectId]);

  return (
    <PageContainer className="questionnaire-page-container">
      <QuestionnaireForm />
    </PageContainer>
  );
};

const QuestionnaireForm = () => {
  const { questionnaire } = useSelector((state) => state);
  const {
    questions,
    answers,
    questions_loading,
    answers_loading,
    answer_submission_busy,
  } = questionnaire;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const { project_objectId } = match.params;
  const answer_change_handler = (question) => (e) => {
    const value = resolve_input_element_value(e.target);

    dispatch(update_question_answer({ question, value }));
  };
  const submit_handler = async (e) => {
    e.preventDefault();

    dispatch(
      submit_answers({
        project_objectId,
        history,
      })
    );
  };

  if (questions_loading || answers_loading) {
    return <IonSkeletonText animated />;
  }

  return (
    <>
      <form onSubmit={submit_handler}>
        <IonList lines="none">
          {questions.map((q, i) => {
            const answer = answers.find(
              (a) => a && a.question.objectId === q.objectId
            );

            return (
              <Question
                key={q.objectId}
                index={i}
                question={q}
                answer={answer}
                change_handler={answer_change_handler}
                busy={answer_submission_busy}
              />
            );
          })}
        </IonList>
        <IonButton
          className="submit-button"
          expand="block"
          disabled={answer_submission_busy}
          type="submit"
        >
          Save Answers &rarr;
        </IonButton>
      </form>
    </>
  );
};

const Question = ({ index, question, answer, change_handler, busy }) => {
  return (
    <IonItem>
      <IonLabel position="stacked" className="ion-text-wrap">
        {question.string_content} <IonText color="danger">*</IonText>
      </IonLabel>
      <IonInput
        className="field"
        placeholder="type answer..."
        type="text"
        value={answer ? answer.string_content : ""}
        onIonChange={change_handler(question)}
        autofocus={index === 0}
        disabled={busy}
        required
      />
    </IonItem>
  );
};

export default QuestionnaireContainer;
