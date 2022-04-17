import testRender from '../../../../../../__test__/testRender';
import mockedAxios from '../../../../../../__test__/mockAxios';
import {RootState} from '../../../../../../lib/redux/store';
import ChangePassword from './ChangePassword';
import userEvent from "@testing-library/user-event";
import {fireEvent, waitFor} from "@testing-library/react";
import {SnackbarContext} from "../../../../../../lib";

describe('ChangePassword', () => {
  let resizeObserverMock: jest.Mock;

  beforeEach(() => {
    resizeObserverMock = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.ResizeObserver = resizeObserverMock;
  })

  it('renders correctly', () => {
    const {baseElement} = testRender(
      {} as RootState,
      <ChangePassword />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('click on edit, opens form to change password', () => {
    const {baseElement, queryByText} = testRender(
      {} as RootState,
      <ChangePassword />,
    );

    userEvent.click(queryByText('misc.edit')!);

    expect(baseElement).toMatchSnapshot();
  })

  describe('form to change password open', () => {
    it('confirm password has to be equal to new password', async() => {
      const {queryByText, queryByLabelText} = testRender(
        {} as RootState,
        <ChangePassword />,
      );

      userEvent.click(queryByText('misc.edit')!);

      userEvent.type(queryByLabelText('misc.currentPassword')!, 'password');
      userEvent.type(queryByLabelText('misc.newPassword')!, 'password');
      userEvent.type(queryByLabelText('misc.confirmNewPassword')!, 'oh no');
      fireEvent.blur(queryByLabelText('misc.confirmNewPassword')!);

      await waitFor(() => expect(queryByText('form.error.notConfirmed')).not.toBeNull());
    });

    it('new password has to be different than current password',  async () => {
      const {queryByText, queryByLabelText} = testRender(
        {} as RootState,
        <ChangePassword />,
      );

      userEvent.click(queryByText('misc.edit')!);

      userEvent.type(queryByLabelText('misc.currentPassword')!, 'password');
      userEvent.type(queryByLabelText('misc.newPassword')!, 'password');
      fireEvent.blur(queryByLabelText('misc.newPassword')!);

      await waitFor(() => expect(queryByText('form.error.notNew')).not.toBeNull());
    });

    it('clicking on cancel closes form to change password', () => {
      const {baseElement, queryByText} = testRender(
        {} as RootState,
        <ChangePassword />,
      );

      // Test before click
      expect(baseElement).toMatchSnapshot();

      // Open form
      userEvent.click(queryByText('misc.edit')!);

      // Test after click
      expect(baseElement).toMatchSnapshot();

      // Close form
      userEvent.click(queryByText('misc.cancel')!);

      // Final test if form closes
      expect(baseElement).toMatchSnapshot();
    });

    describe('if new password different than current password and password ' +
      'is confirmed', () => {
      it('on submit button enabled', async () => {
        const {baseElement, queryByText, queryByLabelText} = testRender(
          {} as RootState,
          <SnackbarContext.Provider value={{show: jest.fn()}}>
            <ChangePassword />
          </SnackbarContext.Provider>,
        );

        userEvent.click(queryByText('misc.edit')!);

        userEvent.type(queryByLabelText('misc.currentPassword')!, 'password');
        userEvent.type(queryByLabelText('misc.newPassword')!, 'newpassword');
        userEvent.type(queryByLabelText('misc.confirmNewPassword')!, 'newpassword');

        await waitFor(() => expect(queryByText('settings.account.security.changePassword')!).not.toBeDisabled);
        expect(baseElement).toMatchSnapshot();
      });

      it('clicking on submit button sends change password request and shows snack if successful', async () => {
        // Mock api call
        mockedAxios.post = jest.fn().mockResolvedValue(undefined);
        const showMock = jest.fn();

        const {baseElement, queryByText, queryByLabelText} = testRender(
          {} as RootState,
          <SnackbarContext.Provider value={{show: showMock}}>
            <ChangePassword />
          </SnackbarContext.Provider>,
        );

        userEvent.click(queryByText('misc.edit')!);

        // Fill form
        const oldPassword = 'password';
        const newPassword = 'new_password';
        userEvent.type(queryByLabelText('misc.currentPassword')!, oldPassword);
        userEvent.type(queryByLabelText('misc.newPassword')!, newPassword);
        userEvent.type(queryByLabelText('misc.confirmNewPassword')!, newPassword);

        // Submit
        userEvent.click(queryByText('settings.account.security.changePassword')!);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/user/settings/change-password',
            {
              oldPassword,
              newPassword,
            }
        );
        expect(showMock).toHaveBeenCalledWith(
          'success',
          'settings.account.security.successfullyChangedPassword',
        );

        expect(baseElement).toMatchSnapshot();
      });
    });
  });
});
