import {
  QUESTIONS_GET_REQUEST_START,
  QUESTIONS_GET_REQUEST_END,
  ANSWERS_GET_REQUEST_START,
  ANSWERS_GET_REQUEST_END,
  QUESTION_ANSWER_VALUE_CHANGED,
  ANSWER_SUBMISSION_REQUEST_START,
  ANSWER_SUBMISSION_REQUEST_END,
  PHONE_NUMBER_CHANGE,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_questions = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const questions_query = new Parse.Query("question");

  questions_query.ascending("order");

  dispatch({
    type: QUESTIONS_GET_REQUEST_START,
  });

  try {
    const results = await questions_query.find();
    const questions = results.map((r) => r.toJSON());

    dispatch({
      type: QUESTIONS_GET_REQUEST_END,
      payload: questions,
    });
  } catch (e) {
    dispatch({
      type: QUESTIONS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const get_answers = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const answers_query = new Parse.Query("answer");

  answers_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(project_objectId)
  );
  answers_query.include("project");
  answers_query.include("question");

  dispatch({
    type: ANSWERS_GET_REQUEST_START,
  });

  try {
    const results = await answers_query.find();
    const answers = results.map((r) => r.toJSON());

    dispatch({
      type: ANSWERS_GET_REQUEST_END,
      payload: answers,
    });
  } catch (e) {
    dispatch({
      type: ANSWERS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

export const update_question_answer = ({ question, value }) => ({
  type: QUESTION_ANSWER_VALUE_CHANGED,
  payload: { question, value },
});

export const submit_answers = ({
  project_objectId,
  history,
  is_new_project,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const { answers } = getState().questionnaire;
  const AnswerObjects = answers.map(({ question, string_content }) => {
    const Answer = Parse.Object.extend("answer");
    const AnswerObject = new Answer();

    AnswerObject.set(
      "project",
      Parse.Object.extend("project").createWithoutData(project_objectId)
    );
    AnswerObject.set(
      "question",
      Parse.Object.extend("question").createWithoutData(question.objectId)
    );
    AnswerObject.set("string_content", string_content);

    return AnswerObject;
  });

  dispatch({
    type: ANSWER_SUBMISSION_REQUEST_START,
  });

  try {
    await Promise.all(AnswerObjects.map((obj) => obj.save()));

    dispatch({
      type: ANSWER_SUBMISSION_REQUEST_END,
    });

    is_new_project
      ? history.push(`/projects/${project_objectId}?new_project=true`)
      : history.replace(`/questionnaire/${project_objectId}?saved=true`);
  } catch (e) {
    dispatch({
      type: ANSWER_SUBMISSION_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
