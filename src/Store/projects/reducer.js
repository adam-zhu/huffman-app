import { unique_by_objectId } from "Utils";
import { format_last_active_date, by_last_active_date } from "./utils";

const initialState = {
  data: undefined,
  data_loaded: false,
  data_loading: false,
  projects_data_loading: false,
  project_images_data_loading: false,
  packages_data_loading: false,
  consultations_data_loading: false,
  messages_data_loading: false,
  subscriptions: undefined,
};

export const ALL_PROJECTS_DATA_GET_REQUESTS_START =
  "projects/ALL_PROJECTS_DATA_GET_REQUESTS_START";
export const ALL_PROJECTS_DATA_GET_REQUESTS_END =
  "projects/ALL_PROJECTS_DATA_GET_REQUESTS_END";
export const PROJECTS_GET_REQUEST_START = "projects/PROJECTS_GET_REQUEST_START";
export const PROJECTS_GET_REQUEST_END = "projects/PROJECTS_GET_REQUEST_END";
export const PROJECT_IMAGES_GET_REQUEST_START =
  "projects/PROJECT_IMAGES_GET_REQUEST_START";
export const PROJECT_IMAGES_GET_REQUEST_END =
  "projects/PROJECT_IMAGES_GET_REQUEST_END";
export const PACKAGES_GET_REQUEST_START = "projects/PACKAGES_GET_REQUEST_START";
export const PACKAGES_GET_REQUEST_END = "projects/PACKAGES_GET_REQUEST_END";
export const CONSULTATIONS_GET_REQUEST_START =
  "projects/CONSULTATIONS_GET_REQUEST_START";
export const CONSULTATIONS_GET_REQUEST_END =
  "projects/CONSULTATIONS_GET_REQUEST_END";
export const MESSAGES_GET_REQUEST_START = "projects/MESSAGES_GET_REQUEST_START";
export const MESSAGES_GET_REQUEST_END = "projects/MESSAGES_GET_REQUEST_END";
export const LIVE_QUERIES_SUBSCRIBED = "projects/LIVE_QUERIES_SUBSCRIBED";
export const LIVE_QUERIES_UNSUBSCRIBED = "projects/LIVE_QUERIES_UNSUBSCRIBED";
export const LIVE_QUERIES_DATA_UPDATED = "projects/LIVE_QUERIES_DATA_UPDATED";
export const MARK_PROJECT_PAID = "projects/MARK_PROJECT_PAID";
export const MARK_PACKAGE_PAID = "projects/MARK_PACKAGE_PAID";

export default (state = initialState, action) => {
  switch (action.type) {
    case ALL_PROJECTS_DATA_GET_REQUESTS_START:
      return {
        ...state,
        data_loading: true,
      };

    case ALL_PROJECTS_DATA_GET_REQUESTS_END:
      return {
        ...state,
        data_loaded: true,
        data_loading: false,
      };

    case PROJECTS_GET_REQUEST_START:
      return {
        ...state,
        projects_data_loading: true,
      };

    case PROJECTS_GET_REQUEST_END:
      return {
        ...state,
        data: action.payload,
        projects_data_loading: false,
      };

    case PROJECT_IMAGES_GET_REQUEST_START:
      return {
        ...state,
        project_images_data_loading: true,
      };

    case PROJECT_IMAGES_GET_REQUEST_END:
      return {
        ...state,
        data: state.data.map((p) => ({
          ...p,
          project_images: action.payload.filter(
            (d) => d.project.objectId === p.objectId
          ),
        })),
        project_images_data_loading: false,
      };

    case PACKAGES_GET_REQUEST_START:
      return {
        ...state,
        packages_data_loading: true,
      };

    case PACKAGES_GET_REQUEST_END:
      return {
        ...state,
        data: state.data.map((p) => ({
          ...p,
          packages: action.payload.filter(
            (d) => d.project.objectId === p.objectId
          ),
        })),
        packages_data_loading: false,
      };

    case CONSULTATIONS_GET_REQUEST_START:
      return {
        ...state,
        consultations_data_loading: true,
      };

    case CONSULTATIONS_GET_REQUEST_END:
      return {
        ...state,
        data: state.data.map((p) => ({
          ...p,
          consultations: action.payload.filter(
            (d) => d.project.objectId === p.objectId
          ),
        })),
        consultations_data_loading: false,
      };

    case MESSAGES_GET_REQUEST_START:
      return {
        ...state,
        messages_data_loading: true,
      };

    case MESSAGES_GET_REQUEST_END:
      return {
        ...state,
        data: state.data.map((p) => {
          const consultations_with_messages = p.consultations.map((c) => {
            const consultation_messages = action.payload.filter(
              (m) => m.consultation.objectId === c.objectId
            );

            return {
              ...c,
              messages: consultation_messages,
            };
          });

          return {
            ...p,
            consultations: consultations_with_messages
              .map(format_last_active_date)
              .sort(by_last_active_date("desc")),
          };
        }),
        messages_data_loading: false,
      };

    case LIVE_QUERIES_SUBSCRIBED:
      return {
        ...state,
        subscriptions: action.payload,
      };

    case LIVE_QUERIES_UNSUBSCRIBED:
      return {
        ...state,
        subscriptions: undefined,
      };

    case LIVE_QUERIES_DATA_UPDATED:
      return {
        ...state,
        data: update_projects_data({
          projects_data: state.data,
          ...action.payload,
        }),
      };

    case MARK_PROJECT_PAID:
      return {
        ...state,
        data: state.data.map((p) =>
          p.objectId === action.payload ? { ...p, paid: true } : p
        ),
      };

    case MARK_PACKAGE_PAID:
      return {
        ...state,
        data: state.data.map((p) =>
          p.packages.find((_p) => _p.objectId === action.payload) !== undefined
            ? {
                ...p,
                packages: p.packages.map((_p) =>
                  _p.objectId === action.payload ? { ..._p, paid: true } : _p
                ),
              }
            : p
        ),
      };

    default:
      return state;
  }
};

const update_projects_data = ({
  projects_data,
  event_type,
  data_type,
  data,
}) => {
  if (data_type === "project") {
    return update_data({
      data: projects_data,
      event_type,
      updated_piece: data,
    });
  }

  if (data_type === "project_image") {
    return projects_data.map((p) => {
      if (p.objectId === data.project.objectId) {
        return {
          ...p,
          project_images: update_data({
            data: p.project_images,
            event_type,
            updated_piece: data,
          }),
        };
      }

      return p;
    });
  }

  if (data_type === "package") {
    return projects_data.map((p) => {
      if (p.objectId === data.project.objectId) {
        return {
          ...p,
          packages: update_data({
            data: p.packages,
            event_type,
            updated_piece: data,
          }),
        };
      }

      return p;
    });
  }

  if (data_type === "consultation") {
    return projects_data.map((p) => {
      if (p.objectId === data.project.objectId) {
        return {
          ...p,
          consultations: update_data({
            data: p.consultations,
            event_type,
            updated_piece: data,
          }),
        };
      }

      return p;
    });
  }

  if (data_type === "message") {
    return projects_data.map((p) => {
      const { consultations } = p;

      if (
        consultations.find((c) => c.objectId === data.consultation.objectId)
      ) {
        return {
          ...p,
          consultations: consultations.map((c) => {
            const { messages } = c;

            if (c.objectId === data.consultation.objectId) {
              return {
                ...c,
                messages: update_data({
                  data: messages,
                  event_type,
                  updated_piece: data,
                }),
              };
            }

            return c;
          }),
        };
      }

      return p;
    });
  }

  throw new Error(`unsupported \`data_type\`: ${data}`);
};

const update_data = ({ data, event_type, updated_piece }) => {
  switch (event_type) {
    case "create":
      return unique_by_objectId(data.concat([updated_piece]));

    case "update":
      return unique_by_objectId(
        data.map((d) =>
          d.objectId === updated_piece.objectId ? { ...d, ...updated_piece } : d
        )
      );

    case "delete":
      return unique_by_objectId(
        data.filter((d) => d.objectId !== updated_piece.objectId)
      );

    default:
      throw new Error("unsupported `event_type`");
  }
};
