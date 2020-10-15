import React, { useEffect, useState } from "react";
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
  IonInput,
} from "@ionic/react";
import PageContainer from "Components/Global/PageContainer";
import "Styles/Questionnaire/QuestionnaireContainer.scss";
import {
  get_questions,
  get_answers,
  update_question_answer,
  submit_answers,
} from "Store/questionnaire/thinks";
import { submit_phone } from "Store/user/thinks";
import { select_project_data } from "Store/projects/selectors";
import { resolve_input_element_value } from "Utils";

const QuestionnaireContainer = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const { is_new_project, saved } = qs.parse(location.search);
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
          header="Your project details were successfully saved!"
          message="Answer the questions below to help us get to know your needs better."
          duration={3000}
          position="top"
          buttons={[
            {
              text: "OK",
              role: "cancel",
            },
          ]}
        />
      )}
      {is_save_success && !is_new_project && (
        <IonToast
          className="questionnaire-toast"
          isOpen={true}
          header="Answers successfully saved!"
          message="Your answers were successfully saved."
          duration={1000}
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
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const state = useSelector((state) => state);
  const { questionnaire, user } = state;
  const {
    questions,
    answers,
    questions_loading,
    answers_loading,
    answer_submission_busy,
  } = questionnaire;
  const project_data = select_project_data({ state, match });
  const { project_objectId } = match.params;
  const { is_phone_submission_request_busy } = user;
  const { phone } = user.data.is_admin ? project_data.created_by : user.data;
  const [inputted_phone_value, set_inputted_phone_value] = useState(phone);
  const answer_change_handler = (question) => (e) => {
    const value = resolve_input_element_value(e.target);

    dispatch(update_question_answer({ question, value }));
  };
  const phone_change_handler = (e) => {
    const value = resolve_input_element_value(e.target);

    set_inputted_phone_value(value);
  };
  const submit_handler = async (e) => {
    e.preventDefault();

    await Promise.all([
      dispatch(
        submit_answers({
          project_objectId,
          history,
        })
      ),
      dispatch(submit_phone(inputted_phone_value)),
    ]);

    if (is_new_project) {
      history.push(`/projects/${project_objectId}?is_new_project=true`);
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
          <PhoneField
            value={inputted_phone_value}
            change_handler={phone_change_handler}
            busy={is_phone_submission_request_busy}
          />
        </IonList>
        <br />
        <IonButton
          className="submit-button"
          expand="block"
          disabled={answer_submission_busy || is_phone_submission_request_busy}
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

const PhoneField = ({ value, change_handler, busy }) => {
  return (
    <IonItem className="phone-field">
      <IonLabel
        position="stacked"
        className="ion-text-wrap questionnaire-question"
      >
        Enter your phone number if you would like to receive SMS notifications
        when you have new messages.
      </IonLabel>
      <IonInput
        className="phone-input"
        value={value}
        onIonChange={change_handler}
        type="tel"
        autocomplete="tel"
        inputMode="tel"
        pattern="\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|
          2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|
          4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$"
        placeholder="+15555555555"
        disabled={busy}
      />
      <IonText className="format-tooltip" color="secondary">
        Include a plus, the country code, and the area code without dashes{" "}
        <em>(+15555555555)</em>.
      </IonText>
    </IonItem>
  );
};

export default QuestionnaireContainer;
