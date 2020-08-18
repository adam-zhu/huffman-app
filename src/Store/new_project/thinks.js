import {
  FORM_STATE_CHANGED,
  NEW_PROJECT_CREATE_REQUEST_START,
  NEW_PROJECT_CREATE_REQUEST_END,
  NEW_PROJECT_CANCELLATION_REQUEST_START,
  NEW_PROJECT_CANCELLATION_REQUEST_END,
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
  const { new_project } = getState();
  const Project = Parse.Object.extend("project");
  const NewProjectObject = new Project();

  NewProjectObject.set("name", new_project.name);
  NewProjectObject.set("description", new_project.description);
  NewProjectObject.set("room_width", new_project.room_width);
  NewProjectObject.set("room_length", new_project.room_length);
  NewProjectObject.set("room_height", new_project.room_height);
  NewProjectObject.set("created_by", Parse.User.current());
  NewProjectObject.set("stripe_product_id", selected_package.objectId);

  dispatch({
    type: NEW_PROJECT_CREATE_REQUEST_START,
  });

  try {
    const result = await NewProjectObject.save();
    const new_project_data = result.toJSON();

    dispatch(create_project_images({ new_project_data, selected_package }));
  } catch (e) {
    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};

const create_project_images = ({
  new_project_data,
  selected_package,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
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

    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(
      redirect_to_stripe_checkout({
        new_project_data,
        selected_package,
        StripePromise,
      })
    );
  } catch (e) {
    dispatch({
      type: NEW_PROJECT_CREATE_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
    dispatch(delete_project(new_project_data.objectId));
  }
};

const delete_project = (project_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const project_query = new Parse.Query("project");
  const project_images_query = new Parse.Query("project_image");

  project_images_query.equalTo(
    "project",
    Parse.Object.extend("project").createWithoutData(project_objectId)
  );

  try {
    const [project, project_images] = await Promise.all([
      project_query.get(project_objectId),
      project_images_query.find(),
    ]);

    await Promise.all(
      [project.destroy()].concat(
        project_images.map((project_image) => project_image.destroy())
      )
    );
  } catch (e) {
    dispatch(add_app_error(e.message));
  }
};

const redirect_to_stripe_checkout = ({
  new_project_data,
  selected_package,
  StripePromise,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const appUrlBase =
    process.env.NODE_ENV === "production" ? PUBLIC_URL : DEV_URL;
  const Stripe = await StripePromise;
  const { error } = await Stripe.redirectToCheckout({
    lineItems: [
      {
        price: selected_package.price.id, // Replace with the ID of your price
        quantity: 1,
      },
    ],
    mode: "payment",
    successUrl: `${appUrlBase}/stripe_callback/success?project_objectId=${new_project_data.objectId}`,
    cancelUrl: `${appUrlBase}/stripe_callback/cancelled?project_objectId=${new_project_data.objectId}`,
  });

  if (error) {
    dispatch(add_app_error(error.message));
  }
};

export const payment_cancelled = ({ project_objectId, history }) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  dispatch({ type: NEW_PROJECT_CANCELLATION_REQUEST_START });

  await dispatch(delete_project(project_objectId));

  dispatch({
    type: NEW_PROJECT_CANCELLATION_REQUEST_END,
    payload: { success: true },
  });

  dispatch(get_data_and_listen_for_changes());

  history.replace("/new?cancelled=true");
};
