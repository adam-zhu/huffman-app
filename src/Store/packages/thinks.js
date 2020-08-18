import { PACKAGES_REQUEST_START, PACKAGES_REQUEST_END } from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const load_packages = () => async (
  dispatch,
  getState,
  { Parse, StripePromise }
) => {
  dispatch({
    type: PACKAGES_REQUEST_START,
  });

  try {
    const packages_product_data = await Parse.Cloud.run("get_products");

    dispatch({
      type: PACKAGES_REQUEST_END,
      payload: packages_product_data,
    });
  } catch (e) {
    dispatch({
      type: PACKAGES_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
