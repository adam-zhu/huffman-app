const initialState = {
  loading: false,
  data: undefined,
  consultation_subscription: undefined, // this stores the Parse LiveQuery object
  message_subscription: undefined, // this stores the Parse LiveQuery object
  message_input_value: "",
  message_images: [],
  is_message_sending: false,
};

export const NEW_CONSULTATION_START_SUCCESS = "NEW_CONSULTATION_START_SUCCESS";
export const CONSULTATION_GET_REQUEST_START = "CONSULTATION_GET_REQUEST_START";
export const CONSULTATION_GET_REQUEST_END = "CONSULTATION_GET_REQUEST_END";
export const MESSAGE_ENTERED = "MESSAGE_ENTERED";
export const MESSAGE_IMAGES_CHANGED = "MESSAGE_IMAGES_CHANGED";
export const SEND_MESSAGE_REQUEST_START = "SEND_MESSAGE_REQUEST_START";
export const SEND_MESSAGE_REQUEST_END = "SEND_MESSAGE_REQUEST_END";
export const MESSAGES_SUBSCRIBED = "MESSAGES_SUBSCRIBED";
export const MESSAGES_UNSUBSCRIBED = "MESSAGES_UNSUBSCRIBED";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const CONSULTATION_CLOSE_REQUEST_START =
  "CONSULTATION_CLOSE_REQUEST_START";
export const CONSULTATION_CLOSE_REQUEST_END = "CONSULTATION_CLOSE_REQUEST_END";
export const CONSULTATION_SUBSCRIBED = "CONSULTATION_SUBSCRIBED";
export const CONSULTATION_UNSUBSCRIBED = "CONSULTATION_UNSUBSCRIBED";
export const CONSULATION_CLOSED = "CONSULATION_CLOSED";

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
        data: action.payload,
      };

    default:
      return state;
  }
};
