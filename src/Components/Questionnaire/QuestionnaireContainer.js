import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import qs from "query-string";
import {
  IonButton,
  IonTextarea,
  IonList,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonToast,
  IonText,
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
  const location = useLocation();
  const dispatch = useDispatch();
  const { new_project, saved } = qs.parse(location.search);
  const is_new_project = new_project;
  const is_save_success = saved;

  useEffect(() => {
    dispatch(get_questions());
    dispatch(get_answers(match.params.project_objectId));
  }, [match.params.project_objectId]);

  return (
    <PageContainer id="questionnaire" pageContainerClassName="questionnaire">
      <QuestionnaireForm is_new_project={is_new_project} />
      {is_new_project && (
        <IonToast
          className="questionnaire-toast"
          isOpen={true}
          header="Your project was successfully created!"
          message="Answer the questions below to help us get to know your needs better."
          duration={4000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
      {is_save_success && (
        <IonToast
          className="questionnaire-toast"
          isOpen={true}
          header="Answers successfully saved!"
          message="Your answers were successfully saved."
          duration={2000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
    </PageContainer>
  );
};

const QuestionnaireForm = ({ is_new_project }) => {
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

    await dispatch(
      submit_answers({
        project_objectId,
        history,
      })
    );

    if (is_new_project) {
      history.push(`/projects/${project_objectId}?new_project=true`);
    }
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
          Save Answers{is_new_project && <IonText>&nbsp;&rarr;</IonText>}
        </IonButton>
      </form>
    </>
  );
};

const Question = ({ index, question, answer, change_handler, busy }) => {
  return (
    <IonItem>
      <IonLabel
        position="stacked"
        className="ion-text-wrap questionnaire-question"
      >
        {question.string_content}
      </IonLabel>
      <IonTextarea
        className="field"
        placeholder="type answer..."
        type="text"
        value={answer ? answer.string_content : ""}
        onIonChange={change_handler(question)}
        autofocus={index === 0}
        disabled={busy}
      />
    </IonItem>
  );
};

export default QuestionnaireContainer;
