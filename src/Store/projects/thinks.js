import {
  ALL_PROJECTS_DATA_GET_REQUESTS_START,
  ALL_PROJECTS_DATA_GET_REQUESTS_END,
  PROJECTS_GET_REQUEST_START,
  PROJECTS_GET_REQUEST_END,
  PROJECT_IMAGES_GET_REQUEST_START,
  PROJECT_IMAGES_GET_REQUEST_END,
  CONSULTATIONS_GET_REQUEST_START,
  CONSULTATIONS_GET_REQUEST_END,
  MESSAGES_GET_REQUEST_START,
  MESSAGES_GET_REQUEST_END,
  LIVE_QUERIES_SUBSCRIBED,
  LIVE_QUERIES_UNSUBSCRIBED,
  LIVE_QUERIES_DATA_UPDATED,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import { format_last_active_date, by_last_active_date } from "./utils";

export const get_data_and_listen_for_changes = () => async (
  dispatch,
  getState,
  Parse
) => {
  const { user } = getState();
  const projects_query = new Parse.Query("project");

  if (!user.data.is_admin) {
    projects_query.equalTo("created_by", Parse.User.current());
  }

  projects_query.include("package");
  projects_query.include("created_by");
  projects_query.descending("createdAt");

  dispatch({
    type: ALL_PROJECTS_DATA_GET_REQUESTS_START,
  });
  dispatch({
    type: PROJECTS_GET_REQUEST_START,
  });

  try {
    const results = await projects_query.find();
    const projects_data = results.map((r) => r.toJSON());

    dispatch(get_and_attach_project_images(projects_data));

    dispatch({
      type: PROJECTS_GET_REQUEST_END,
      payload: projects_data,
    });
  } catch (e) {
    dispatch({
      type: PROJECTS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_project_images = (projects_data) => async (
  dispatch,
  getState,
  Parse
) => {
  const project_images_query = new Parse.Query("project_image");

  project_images_query.include("created_by");
  project_images_query.include("project");
  project_images_query.include("message");
  project_images_query.descending("createdAt");
  project_images_query.containedIn(
    "project",
    projects_data.map((p) =>
      Parse.Object.extend("project").createWithoutData(p.objectId)
    )
  );

  dispatch({
    type: PROJECT_IMAGES_GET_REQUEST_START,
  });

  try {
    const results = await project_images_query.find();
    const project_images_data = results.map((r) => r.toJSON());
    const projects_data_with_images = projects_data.map((p) => {
      return {
        ...p,
        project_images: project_images_data.filter(
          (c) => c.project.objectId === p.objectId
        ),
      };
    });

    dispatch(get_and_attach_consultations(projects_data_with_images));

    dispatch({
      type: PROJECT_IMAGES_GET_REQUEST_END,
      payload: projects_data_with_images,
    });
  } catch (e) {
    dispatch({
      type: PROJECT_IMAGES_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_consultations = (projects_data_with_images) => async (
  dispatch,
  getState,
  Parse
) => {
  const consultations_query = new Parse.Query("consultation");

  consultations_query.include("created_by");
  consultations_query.include("project");
  consultations_query.ascending("createdAt");
  consultations_query.containedIn(
    "project",
    projects_data_with_images.map((p) =>
      Parse.Object.extend("project").createWithoutData(p.objectId)
    )
  );

  dispatch({
    type: CONSULTATIONS_GET_REQUEST_START,
  });

  try {
    const results = await consultations_query.find();
    const consultations_data = results.map((r) => r.toJSON());
    const projects_data_with_images_consultations = projects_data_with_images.map(
      (p) => {
        return {
          ...p,
          consultations: consultations_data.filter(
            (c) => c.project.objectId === p.objectId
          ),
        };
      }
    );

    dispatch(get_and_attach_messages(projects_data_with_images_consultations));

    dispatch({
      type: CONSULTATIONS_GET_REQUEST_END,
      payload: projects_data_with_images_consultations,
    });
  } catch (e) {
    dispatch({
      type: CONSULTATIONS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_messages = (
  projects_data_with_images_consultations
) => async (dispatch, getState, Parse) => {
  const consultations_data = projects_data_with_images_consultations.flatMap(
    (p) => p.consultations
  );
  const messages_query = new Parse.Query("message");

  messages_query.include("created_by");
  messages_query.include("consultation");
  messages_query.ascending("createdAt");
  messages_query.containedIn(
    "consultation",
    consultations_data.map((c) =>
      Parse.Object.extend("consultation").createWithoutData(c.objectId)
    )
  );

  dispatch({
    type: MESSAGES_GET_REQUEST_START,
  });

  try {
    const results = await messages_query.find();
    const messages_data = results.map((r) => r.toJSON());
    const projects_data_with_images_consultations_messages = projects_data_with_images_consultations.map(
      (p) => {
        const consultations_with_messages = p.consultations.map((c) => {
          const consultation_messages = messages_data.filter(
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
      }
    );

    dispatch({
      type: MESSAGES_GET_REQUEST_END,
      payload: projects_data_with_images_consultations_messages,
    });

    dispatch({
      type: ALL_PROJECTS_DATA_GET_REQUESTS_END,
      payload: projects_data_with_images_consultations_messages,
    });

    dispatch(
      listen_for_changes(projects_data_with_images_consultations_messages)
    );
  } catch (e) {
    dispatch({
      type: MESSAGES_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const listen_for_changes = (projects_data) => async (
  dispatch,
  getState,
  Parse
) => {
  const { user } = getState();
  const projects_query = new Parse.Query("project");
  const project_images_query = new Parse.Query("project_image");
  const consultations_query = new Parse.Query("consultation");
  const messages_query = new Parse.Query("message");
  const project_pointers = projects_data.map((p) =>
    Parse.Object.extend("project").createWithoutData(p.objectId)
  );
  const consultation_pointers = projects_data.flatMap((p) =>
    p.consultations.map((c) => c.objectId)
  );

  if (!user.data.is_admin) {
    projects_query.containedIn(
      "objectId",
      projects_data.map((p) => p.objectId)
    );
  }

  project_images_query.include("message");
  project_images_query.include("project");
  project_images_query.containedIn("project", project_pointers);

  consultations_query.include("project");
  consultations_query.containedIn("project", project_pointers);

  messages_query.include("consultation");
  messages_query.containedIn("consultation", consultation_pointers);

  const projects_subscription = await projects_query.subscribe();
  const project_images_subscription = await project_images_query.subscribe();
  const consultations_subscription = await consultations_query.subscribe();
  const messages_subscription = await messages_query.subscribe();
  const subscriptions = {
    project: projects_subscription,
    project_image: project_images_subscription,
    consultation: consultations_subscription,
    message: messages_subscription,
  };

  dispatch({
    type: LIVE_QUERIES_SUBSCRIBED,
    payload: subscriptions,
  });

  const event_types = ["create", "update", "delete"];
  const handler = (event_type) => (data_type) => async (data) => {
    if (
      event_type === "create" &&
      (data_type === "project" || data_type === "consultation")
    ) {
      await dispatch(stop_listening_for_changes());
      await dispatch(get_data_and_listen_for_changes());
    } else {
      dispatch({
        type: LIVE_QUERIES_DATA_UPDATED,
        payload: {
          event_type,
          data_type,
          data: data.toJSON(),
        },
      });
    }
  };

  Object.entries(subscriptions).forEach(([data_type, subscription]) =>
    event_types.forEach((event_type) =>
      subscription.on(event_type, handler(event_type)(data_type))
    )
  );
};

export const stop_listening_for_changes = () => async (
  dispatch,
  getState,
  Parse
) => {
  const { subscriptions } = getState().projects;

  if (subscriptions !== undefined) {
    Object.entries(subscriptions).forEach(([data_type, subscription]) =>
      subscription.unsubscribe()
    );

    dispatch({ type: LIVE_QUERIES_UNSUBSCRIBED });
  }
};
