export const mockFetchResult = (data: any) => {
  jest.spyOn(global, 'fetch')
    .mockImplementationOnce(() => {
      const response = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(data),
      } as Response;
      return Promise.resolve(response);
    });
};
