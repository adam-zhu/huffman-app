import {
  ALL_PROJECTS_DATA_GET_REQUESTS_START,
  ALL_PROJECTS_DATA_GET_REQUESTS_END,
  PROJECTS_GET_REQUEST_START,
  PROJECTS_GET_REQUEST_END,
  PROJECT_IMAGES_GET_REQUEST_START,
  PROJECT_IMAGES_GET_REQUEST_END,
  PACKAGES_GET_REQUEST_START,
  PACKAGES_GET_REQUEST_END,
  CONSULTATIONS_GET_REQUEST_START,
  CONSULTATIONS_GET_REQUEST_END,
  MESSAGES_GET_REQUEST_START,
  MESSAGES_GET_REQUEST_END,
  LIVE_QUERIES_SUBSCRIBED,
  LIVE_QUERIES_UNSUBSCRIBED,
  LIVE_QUERIES_DATA_UPDATED,
} from "./reducer";
import {
  PRODUCTS_REQUEST_START,
  PRODUCTS_REQUEST_END,
} from "Store/products/reducer";
import { add_app_error } from "Store/errors/thinks";

export const get_data_and_listen_for_changes = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  dispatch({
    type: ALL_PROJECTS_DATA_GET_REQUESTS_START,
  });
  dispatch({
    type: PROJECTS_GET_REQUEST_START,
  });
  dispatch({
    type: PRODUCTS_REQUEST_START,
  });

  const { user } = getState();
  const projects_query = new Parse.Query("project");

  if (!user.data.is_admin) {
    projects_query.equalTo("created_by", Parse.User.current());
  }

  projects_query.include("created_by");
  projects_query.descending("createdAt");
  projects_query.equalTo("paid", true);
  projects_query.limit(99999999999);

  try {
    const [project_results, packages_product_data] = await Promise.all([
      projects_query.find(),
      Parse.Cloud.run("get_products"),
    ]);
    const projects_data = project_results.map((r) => r.toJSON());

    dispatch({
      type: PROJECTS_GET_REQUEST_END,
      payload: projects_data,
    });

    dispatch({
      type: PRODUCTS_REQUEST_END,
      payload: packages_product_data,
    });

    dispatch(get_and_attach_project_images_and_packages());
    dispatch(get_and_attach_consultations());
  } catch (e) {
    dispatch({
      type: PROJECTS_GET_REQUEST_END,
    });

    dispatch({
      type: PRODUCTS_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_project_images_and_packages = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { projects } = getState();

  dispatch({
    type: PROJECT_IMAGES_GET_REQUEST_START,
  });

  dispatch({
    type: PACKAGES_GET_REQUEST_START,
  });

  const project_images_query = new Parse.Query("project_image");
  const packages_query = new Parse.Query("package");

  project_images_query.include("created_by");
  project_images_query.include("project");
  project_images_query.include("message");
  project_images_query.ascending("createdAt");
  project_images_query.containedIn(
    "project",
    projects.data.map((p) =>
      Parse.Object.extend("project").createWithoutData(p.objectId)
    )
  );
  project_images_query.limit(99999999999);

  packages_query.include("project");
  packages_query.ascending("createdAt");
  packages_query.containedIn(
    "project",
    projects.data.map((p) =>
      Parse.Object.extend("project").createWithoutData(p.objectId)
    )
  );
  packages_query.limit(99999999999);

  try {
    const [project_images_results, packages_results] = await Promise.all([
      project_images_query.find(),
      packages_query.find(),
    ]);
    const project_images_data = project_images_results.map((r) => r.toJSON());
    const packages_data = packages_results.map((r) => r.toJSON());

    dispatch({
      type: PROJECT_IMAGES_GET_REQUEST_END,
      payload: project_images_data,
    });

    dispatch({
      type: PACKAGES_GET_REQUEST_END,
      payload: packages_data,
    });
  } catch (e) {
    dispatch({
      type: PROJECT_IMAGES_GET_REQUEST_END,
    });

    dispatch({
      type: PACKAGES_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_consultations = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { projects } = getState();

  dispatch({
    type: CONSULTATIONS_GET_REQUEST_START,
  });

  const consultations_query = new Parse.Query("consultation");

  consultations_query.include("created_by");
  consultations_query.include("project");
  consultations_query.ascending("createdAt");
  consultations_query.containedIn(
    "project",
    projects.data.map((p) =>
      Parse.Object.extend("project").createWithoutData(p.objectId)
    )
  );
  consultations_query.limit(99999999999);

  try {
    const consultations_results = await consultations_query.find();
    const consultations_data = consultations_results.map((r) => r.toJSON());

    dispatch({
      type: CONSULTATIONS_GET_REQUEST_END,
      payload: consultations_data,
    });

    dispatch(get_and_attach_messages());
  } catch (e) {
    dispatch({
      type: CONSULTATIONS_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const get_and_attach_messages = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { projects } = getState();
  const consultations_data = projects.data.flatMap((p) => p.consultations);
  const messages_query = new Parse.Query("message");

  messages_query.include("author");
  messages_query.include("consultation");
  messages_query.ascending("createdAt");
  messages_query.containedIn(
    "consultation",
    consultations_data.map((c) =>
      Parse.Object.extend("consultation").createWithoutData(c.objectId)
    )
  );
  messages_query.limit(99999999999);

  dispatch({
    type: MESSAGES_GET_REQUEST_START,
  });

  try {
    const results = await messages_query.find();
    const messages_data = results.map((r) => r.toJSON());

    dispatch({
      type: MESSAGES_GET_REQUEST_END,
      payload: messages_data,
    });

    dispatch({
      type: ALL_PROJECTS_DATA_GET_REQUESTS_END,
    });

    dispatch(listen_for_changes());
  } catch (e) {
    dispatch({
      type: MESSAGES_GET_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const listen_for_changes = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { user, projects } = getState();
  const projects_query = new Parse.Query("project");
  const project_images_query = new Parse.Query("project_image");
  const packages_query = new Parse.Query("package");
  const consultations_query = new Parse.Query("consultation");
  const messages_query = new Parse.Query("message");
  const project_pointers = projects.data.map((p) =>
    Parse.Object.extend("project").createWithoutData(p.objectId)
  );
  const consultation_pointers = projects.data.flatMap((p) =>
    p.consultations.map((c) => c.objectId)
  );

  if (!user.data.is_admin) {
    projects_query.containedIn(
      "objectId",
      projects.data.map((p) => p.objectId)
    );
  }

  project_images_query.include("message");
  project_images_query.include("project");
  project_images_query.containedIn("project", project_pointers);
  project_images_query.limit(99999999999);

  packages_query.include("project");
  packages_query.containedIn("project", project_pointers);
  packages_query.limit(99999999999);

  consultations_query.include("project");
  consultations_query.containedIn("project", project_pointers);
  consultations_query.limit(99999999999);

  messages_query.include("consultation");
  messages_query.containedIn("consultation", consultation_pointers);
  messages_query.limit(99999999999);

  const [
    projects_subscription,
    packages_subscription,
    project_images_subscription,
    consultations_subscription,
    messages_subscription,
  ] = await Promise.all([
    projects_query.subscribe(),
    packages_query.subscribe(),
    project_images_query.subscribe(),
    consultations_query.subscribe(),
    messages_query.subscribe(),
  ]);
  const subscriptions = {
    project: projects_subscription,
    project_image: project_images_subscription,
    package: packages_subscription,
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
      (data_type === "project" ||
        data_type === "consultation" ||
        data_type === "package") &&
      event_type === "create"
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
  { Parse, StripePromise }
) => {
  const { subscriptions } = getState().projects;

  if (subscriptions !== undefined) {
    Object.entries(subscriptions).forEach(([data_type, subscription]) =>
      subscription.unsubscribe()
    );

    dispatch({ type: LIVE_QUERIES_UNSUBSCRIBED });
  }
};
