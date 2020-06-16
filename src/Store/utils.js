export const mockService = (mockData, latencyMs, errProbabiility) => {
  const networkLatency = latencyMs || Math.random() * 1000;
  const errorProbability =
    typeof errProbabiility === "number" ? errProbabiility : 0;
  const isError = Math.random() < errorProbability;
  const responsify = (data) => ({
    ok: isError ? false : true,
    json: () =>
      new Promise((resolve) => resolve(isError ? "mock error message" : data)),
  });

  return new Promise((resolve) =>
    setTimeout(() => resolve(responsify(mockData)), networkLatency)
  );
};
