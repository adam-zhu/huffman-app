import {
  format_last_active_date,
  by_last_active_date,
} from "Store/projects/utils";

const select_projects_data = (state) => state.projects.data || [];

export const select_project_data = ({ match, state }) => {
  const project_data = select_projects_data(state).find(
    (p) => p.objectId === match.params.project_objectId
  );
  const consultations = project_data?.consultations || [];

  if (project_data === undefined) {
    return undefined;
  }

  return {
    ...project_data,
    consultations: consultations
      .map(format_last_active_date)
      .sort(by_last_active_date("desc")),
  };
};

export const select_consultation_data = ({ match, state }) => {
  const projects_data = select_projects_data(state);
  const project_data = projects_data.find((p) =>
    (p.consultations || []).find(
      (c) => c.objectId === match.params.consultation_objectId
    )
  );

  if (project_data === undefined || project_data.consultations === undefined) {
    return undefined;
  }

  const consultation_data = project_data.consultations.find(
    (c) => c.objectId === match.params.consultation_objectId
  );

  if (consultation_data === undefined) {
    return undefined;
  }

  return format_last_active_date(consultation_data);
};
