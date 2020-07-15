import {
  MAIN_ION_CONTENT_MOUNTED,
  MAIN_ION_CONTENT_UNMOUNTED,
} from "./reducer";

export const ion_content_mounted = (payload) => ({
  type: MAIN_ION_CONTENT_MOUNTED,
  payload,
});

export const ion_content_unmounted = () => ({
  type: MAIN_ION_CONTENT_UNMOUNTED,
});
