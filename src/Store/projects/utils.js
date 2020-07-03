export const format_last_active_date = (consultation) => {
  const most_recent_message = Array.isArray(consultation.messages)
    ? consultation.messages[consultation.messages.length - 1]
    : undefined;
  const last_active_date = most_recent_message
    ? most_recent_message.createdAt
    : consultation.createdAt;

  return {
    ...consultation,
    last_active_date,
  };
};

export const by_last_active_date = (asc_desc) => (a, b) => {
  const a_date = new Date(a.last_active_date);
  const b_date = new Date(b.last_active_date);

  return asc_desc === "asc" ? a_date - b_date : b_date - a_date;
};

export const get_open_closed = (consultations) =>
  (consultations || []).reduce(
    (acc, c) =>
      c.is_open ? [acc[0].concat([c]), acc[1]] : [acc[0], acc[1].concat([c])],
    [[], []]
  );
