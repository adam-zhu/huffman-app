import { PACKAGES_REQUEST_START, PACKAGES_REQUEST_END } from "./reducer";
import { add_app_error } from "Store/errors/thinks";

export const load_packages = () => async (dispatch, getState, Parse) => {
  const Package = Parse.Object.extend("package");
  const query = new Parse.Query(Package);

  dispatch({
    type: PACKAGES_REQUEST_START,
  });

  try {
    const results = await query.find();

    dispatch({
      type: PACKAGES_REQUEST_END,
      payload: results.map((r) => r.toJSON()),
    });
  } catch (e) {
    dispatch({
      type: PACKAGES_REQUEST_END,
    });

    dispatch(add_app_error(e.message));
  }
};
