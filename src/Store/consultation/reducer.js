const initialState = {
  loading: false,
  data: undefined,
  consultation_subscription: undefined, // this stores the Parse LiveQuery object
  message_subscription: undefined, // this stores the Parse LiveQuery object
  message_input_value: "",
  message_images: [],
  is_message_sending: false,
  message_viewed_request_busy: false,
};

export const NEW_CONSULTATION_START_SUCCESS =
  "consultation/NEW_CONSULTATION_START_SUCCESS";
export const CONSULTATION_GET_REQUEST_START =
  "consultation/CONSULTATION_GET_REQUEST_START";
export const CONSULTATION_GET_REQUEST_END =
  "consultation/CONSULTATION_GET_REQUEST_END";
export const MESSAGE_ENTERED = "consultation/MESSAGE_ENTERED";
export const MESSAGE_IMAGES_CHANGED = "consultation/MESSAGE_IMAGES_CHANGED";
export const SEND_MESSAGE_REQUEST_START =
  "consultation/SEND_MESSAGE_REQUEST_START";
export const SEND_MESSAGE_REQUEST_END = "consultation/SEND_MESSAGE_REQUEST_END";
export const MESSAGES_SUBSCRIBED = "consultation/MESSAGES_SUBSCRIBED";
export const MESSAGES_UNSUBSCRIBED = "consultation/MESSAGES_UNSUBSCRIBED";
export const RECEIVE_MESSAGE = "consultation/RECEIVE_MESSAGE";
export const CONSULTATION_CLOSE_REQUEST_START =
  "consultation/CONSULTATION_CLOSE_REQUEST_START";
export const CONSULTATION_CLOSE_REQUEST_END =
  "consultation/CONSULTATION_CLOSE_REQUEST_END";
export const CONSULTATION_SUBSCRIBED = "consultation/CONSULTATION_SUBSCRIBED";
export const CONSULTATION_UNSUBSCRIBED =
  "consultation/CONSULTATION_UNSUBSCRIBED";
export const CONSULATION_CLOSED = "consultation/CONSULATION_CLOSED";
export const MESSAGE_VIEWED_REQUEST_START =
  "consultation/MESSAGE_VIEWED_REQUEST_START";
export const MESSAGE_VIEWED_REQUEST_END =
  "consultation/MESSAGE_VIEWED_REQUEST_END";

export default (state = initialState, action) => {
  switch (action.type) {
    case NEW_CONSULTATION_START_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };

    case CONSULTATION_GET_REQUEST_START:
      return {
        ...state,
        loading: true,
      };

    case CONSULTATION_GET_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    case MESSAGE_ENTERED:
      return {
        ...state,
        message_input_value: action.payload,
      };

    case MESSAGE_IMAGES_CHANGED:
      return {
        ...state,
        message_images: action.payload,
      };

    case SEND_MESSAGE_REQUEST_START:
      return {
        ...state,
        is_message_sending: true,
      };

    case SEND_MESSAGE_REQUEST_END:
      return {
        ...state,
        is_message_sending: false,
        message_input_value: "",
      };

    case MESSAGES_SUBSCRIBED:
      return {
        ...state,
        message_subscription: action.payload,
      };

    case MESSAGES_UNSUBSCRIBED:
      return {
        ...state,
        message_subscription: undefined,
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          messages: state.data.messages.concat([action.payload]),
        },
      };

    case CONSULTATION_CLOSE_REQUEST_START:
      return {
        ...state,
        loading: true,
      };

    case CONSULTATION_CLOSE_REQUEST_END:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case CONSULTATION_SUBSCRIBED:
      return {
        ...state,
        consultation_subscription: action.payload,
      };

    case CONSULTATION_UNSUBSCRIBED:
      return {
        ...state,
        consultation_subscription: undefined,
      };

    case CONSULATION_CLOSED:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case MESSAGE_VIEWED_REQUEST_START:
      return {
        ...state,
        message_viewed_request_busy: true,
      };

    case MESSAGE_VIEWED_REQUEST_END:
      return {
        ...state,
        message_viewed_request_busy: false,
      };

    default:
      return state;
  }
};
