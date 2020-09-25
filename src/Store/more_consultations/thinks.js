import {
  ADD_PACKAGE_REQUEST_START,
  ADD_PACKAGE_REQUEST_END,
  DELETE_PACKAGE_REQUEST_START,
  DELETE_PACKAGE_REQUEST_END,
} from "./reducer";
import { add_app_error } from "Store/errors/thinks";
import { PUBLIC_URL, DEV_URL } from "Constants";

export const create_and_attach_package = ({
  selected_package,
  project_data,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  const Package = Parse.Object.extend("package");
  const NewPackageObject = new Package();

  dispatch({
    type: ADD_PACKAGE_REQUEST_START,
  });

  NewPackageObject.set(
    "project",
    Parse.Object.extend("project").createWithoutData(project_data.objectId)
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
    const result = await NewPackageObject.save();

    dispatch({
      type: ADD_PACKAGE_REQUEST_END,
    });

    dispatch(
      redirect_to_stripe_checkout({
        project_data,
        package_data: result.toJSON(),
      })
    );
  } catch (e) {
    dispatch(add_app_error(e.message));

    dispatch({
      type: ADD_PACKAGE_REQUEST_END,
    });
  }
};

const create_stripe_session = ({ project_data, package_data }) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const { user } = getState();
  const appUrlBase =
    process.env.NODE_ENV === "production" ? PUBLIC_URL : DEV_URL;
  const success_url = `${appUrlBase}/stripe_callback/more_consultations/success?project_objectId=${project_data.objectId}&=true`;
  const cancel_url = `${appUrlBase}/stripe_callback/more_consultations/cancelled?project_objectId=${project_data.objectId}&package_objectId=${package_data.objectId}`;
  const price_id = package_data.stripe_price_id;
  const customer_email = user.data.email;
  const session_id = await Parse.Cloud.run("create_stripe_checkout_session", {
    success_url,
    cancel_url,
    price_id,
    customer_email,
  });

  return session_id;
};

const redirect_to_stripe_checkout = ({ project_data, package_data }) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const [Stripe, sessionId] = await Promise.all([
    StripePromise,
    dispatch(create_stripe_session({ project_data, package_data })),
  ]);
  const { error } = await Stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    dispatch(add_app_error(error.message));
    dispatch(delete_package(package_data.objectId));
  }
};

const delete_package = (package_objectId) => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  const package_query = new Parse.Query("package");

  dispatch({ type: DELETE_PACKAGE_REQUEST_START });

  try {
    const package_result = await package_query.get(package_objectId);

    await package_result.destroy();

    dispatch({
      type: DELETE_PACKAGE_REQUEST_END,
      payload: true,
    });
  } catch (e) {
    dispatch(add_app_error(e.message));

    dispatch({
      type: DELETE_PACKAGE_REQUEST_END,
      payload: false,
    });
  }
};

export const more_consultations_payment_cancelled = ({
  package_objectId,
}) => async (dispatch, getState, { Parse, StripePromise }) => {
  await dispatch(delete_package(package_objectId));
};
