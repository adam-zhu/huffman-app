const initialState = {
  loading: false,
  data: undefined,
  subscription: undefined,
  message_input_value: "",
  is_message_sending: false,
};

export const PROJECT_GET_REQUEST_START = "PROJECT_GET_REQUEST_START";
export const PROJECT_GET_REQUEST_END = "PROJECT_GET_REQUEST_END";
export const MESSAGE_ENTERED = "MESSAGE_ENTERED";
export const SEND_MESSAGE_REQUEST_START = "SEND_MESSAGE_REQUEST_START";
export const SEND_MESSAGE_REQUEST_END = "SEND_MESSAGE_REQUEST_END";
export const SUBSCRIBED = "SUBSCRIBED";
export const UNSUBSCRIBED = "UNSUBSCRIBED";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";

export default (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_GET_REQUEST_START:
      return {
        ...state,
        loading: true,
      };

    case PROJECT_GET_REQUEST_END:
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

    case SUBSCRIBED:
      return {
        ...state,
        subscription: action.payload,
      };

    case UNSUBSCRIBED:
      return {
        ...state,
        subscription: undefined,
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          messages: state.data.messages.concat([action.payload]),
        },
      };

    default:
      return state;
  }
};
