import {
  FORM_STATE_CHANGED,
  NEW_PROJECT_CREATE_REQUEST_START,
  NEW_PROJECT_CREATE_REQUEST_END,
  NEW_PROJECT_CANCELLATION_REQUEST_START,
  NEW_PROJECT_CANCELLATION_REQUEST_END,
  RESET_REDUCER_STATE,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import { get_data_and_listen_for_changes } from "Store/projects/thinks";
import { PUBLIC_URL, DEV_URL } from "Constants";

export const set_form_field_value = (payload) => ({
  type: FORM_STATE_CHANGED,
  payload,
});

export const create_new_project_and_check_out = ({
  selected_package,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const createProject = async () => {
    const { new_project } = getState();
    const Project = Parse.Object.extend("project");
    const NewProjectObject = new Project();

    NewProjectObject.set("name", new_project.name);
    NewProjectObject.set("description", new_project.description);
    NewProjectObject.set("room_width", new_project.room_width);
    NewProjectObject.set("room_length", new_project.room_length);
    NewProjectObject.set("room_height", new_project.room_height);
    NewProjectObject.set("created_by", Parse.User.current());

    try {
      const result = await NewProjectObject.save();
      const new_project_data = result.toJSON();

      return new_project_data;
    } catch (e) {
      dispatch({
        type: NEW_PROJECT_CREATE_REQUEST_END,
      });
      dispatch(add_app_error(e.message));
    }
  };
  const createImagesAndPackage = async (new_project_data) => {
    const [project_images_error, packages_error] = await Promise.all([
      dispatch(create_project_images({ new_project_data })),
      dispatch(create_package({ new_project_data, selected_package })),
    ]);
    const is_success = project_images_error === null && packages_error === null;

    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    if (!is_success) {
      if (project_images_error) {
        dispatch(add_app_error(project_images_error.message));
      }

      if (packages_error) {
        dispatch(add_app_error(packages_error.message));
      }

      dispatch(delete_project(new_project_data.objectId));
    }

    return is_success;
  };

  dispatch({
    type: NEW_PROJECT_CREATE_REQUEST_START,
  });

  const new_project_data = await createProject();
  const project_materials_creation_success = await createImagesAndPackage(
    new_project_data
  );

  dispatch({
    type: NEW_PROJECT_CREATE_REQUEST_END,
  });

  if (project_materials_creation_success) {
    dispatch(
      redirect_to_stripe_checkout({
        new_project_data,
        selected_package,
      })
    );
  }
};

const create_project_images = ({ new_project_data }) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { new_project } = getState();
  const ProjectImageObjects = new_project.project_images.map((p) => {
    const { base64, filepath } = p;
    const ProjectImage = Parse.Object.extend("project_image");
    const ProjectImageObject = new ProjectImage();

    ProjectImageObject.set(
      "project",
      Parse.Object.extend("project").createWithoutData(
        new_project_data.objectId
      )
    );
    ProjectImageObject.set("image", new Parse.File(filepath, { base64 }));

    return ProjectImageObject;
  });

  try {
    await Promise.all(ProjectImageObjects.map((o) => o.save()));

    return null;
  } catch (e) {
    return e;
  }
};

const create_package = ({ new_project_data, selected_package }) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const Package = Parse.Object.extend("package");
  const NewPackageObject = new Package();

  NewPackageObject.set(
    "project",
    Parse.Object.extend("project").createWithoutData(new_project_data.objectId)
  );
  NewPackageObject.set("stripe_product_id", selected_package.objectId);
  NewPackageObject.set("stripe_price_id", selected_package.price.id);
  NewPackageObject.set("name", selected_package.name);
  NewPackageObject.set("description", selected_package.description);
  NewPackageObject.set(
    "included_consultations_count",
    selected_package.included_consultations_count
  );
  NewPackageObject.set("price_cents", selected_package.price_cents);
  NewPackageObject.set("image_url", selected_package.image.url);

  try {
    await NewPackageObject.save();

    return null;
  } catch (e) {
    return e;
  }
};

const delete_project = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const project_query = new Parse.Query("project");
  const project_images_query = new Parse.Query("project_image");
  const packages_query = new Parse.Query("package");

  project_images_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(project_objectId)
  );
  packages_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(project_objectId)
  );

  try {
    const [project, project_images, packages] = await Promise.all([
      project_query.get(project_objectId),
      project_images_query.find(),
      packages_query.find(),
    ]);

    await Promise.all([
      project.destroy(),
      ...project_images.map((project_image) => project_image.destroy()),
      ...packages.map((p) => p.destroy()),
    ]);

    return { is_success: true };
  } catch (e) {
    dispatch(add_app_error(e.message));

    return { is_success: false };
  }
};

const create_stripe_session = ({
  new_project_data,
  selected_package,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const { user } = getState();
  const appUrlBase =
    process.env.NODE_ENV === "production" ? PUBLIC_URL : DEV_URL;
  const success_url = `${appUrlBase}/stripe_callback/new_project/success?project_objectId=${new_project_data.objectId}`;
  const cancel_url = `${appUrlBase}/stripe_callback/new_project/cancelled?project_objectId=${new_project_data.objectId}`;
  const price_id = selected_package.price.id;
  const customer_email = user.data.email;
  const session_id = await Parse.Cloud.run("create_stripe_checkout_session", {
    success_url,
    cancel_url,
    price_id,
    customer_email,
  });

  return session_id;
};

const redirect_to_stripe_checkout = ({
  new_project_data,
  selected_package,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const [Stripe, sessionId] = await Promise.all([
    StripePromise,
    dispatch(create_stripe_session({ new_project_data, selected_package })),
  ]);
  const { error } = await Stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    dispatch(add_app_error(error.message));
  }
};

export const new_project_payment_cancelled = ({
  project_objectId,
  history,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  dispatch({ type: NEW_PROJECT_CANCELLATION_REQUEST_START });

  const { is_success } = await dispatch(delete_project(project_objectId));

  dispatch({
    type: NEW_PROJECT_CANCELLATION_REQUEST_END,
    payload: is_success,
  });

  if (is_success) {
    dispatch(get_data_and_listen_for_changes());
    history.replace("/new?cancelled=true");
  }
};
