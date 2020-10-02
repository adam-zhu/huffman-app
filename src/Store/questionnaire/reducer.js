const initialState = {
  questions: [],
  answers: [],
  phone: "",
  questions_loading: false,
  answers_loading: false,
  answer_submission_busy: false,
};

export const QUESTIONS_GET_REQUEST_START =
  "questionnaire/QUESTIONS_GET_REQUEST_START";
export const QUESTIONS_GET_REQUEST_END =
  "questionnaire/QUESTIONS_GET_REQUEST_END";
export const ANSWERS_GET_REQUEST_START =
  "questionnaire/ANSWERS_GET_REQUEST_START";
export const ANSWERS_GET_REQUEST_END = "questionnaire/ANSWERS_GET_REQUEST_END";
export const QUESTION_ANSWER_VALUE_CHANGED =
  "questionnaire/QUESTION_ANSWER_VALUE_CHANGED";
export const ANSWER_SUBMISSION_REQUEST_START =
  "questionnaire/ANSWER_SUBMISSION_REQUEST_START";
export const ANSWER_SUBMISSION_REQUEST_END =
  "questionnaire/ANSWER_SUBMISSION_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case QUESTIONS_GET_REQUEST_START:
      return {
        ...state,
        questions_loading: true,
      };

    case QUESTIONS_GET_REQUEST_END:
      return {
        ...state,
        questions: action.payload || [],
        questions_loading: false,
      };

    case ANSWERS_GET_REQUEST_START:
      return {
        ...state,
        answers_loading: true,
      };

    case ANSWERS_GET_REQUEST_END:
      return {
        ...state,
        answers: action.payload || [],
        answers_loading: false,
      };

    case QUESTION_ANSWER_VALUE_CHANGED:
      return {
        ...state,
        answers: update_answers(state, action),
      };

    case ANSWER_SUBMISSION_REQUEST_START:
      return {
        ...state,
        answer_submission_busy: true,
      };

    case ANSWER_SUBMISSION_REQUEST_END:
      return {
        ...state,
        answer_submission_busy: false,
      };

    default:
      return state;
  }
};

const update_answers = (state, action) => {
  const { answers } = state;
  const { question, value } = action.payload;
  const updated_answer = { question, string_content: value };

  if (answers.find((a) => a.question.objectId === question.objectId)) {
    return answers.map((a) =>
      a.question.objectId === question.objectId ? updated_answer : a
    );
  }

  return answers.concat([updated_answer]);
};
