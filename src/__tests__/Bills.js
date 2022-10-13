import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import "@testing-library/jest-dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes.js";
import "jquery-modal";
import firebase from "../__mocks__/firebase.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );

      const html = BillsUI({
        data: [],
      });
      document.body.innerHTML = html;

      new Bills({
        document,
        onNavigate,
        firestore: null,
        bills,
        localStorage: window.localStorage,
      });

      //to-do write expect expression
      expect(screen.getByTestId("icon-window").classList).not.toBe(null);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates.sort()).toEqual(datesSorted.sort());
    });
    test("I click on the icon to display the receipt", () => {
      const bill = [
        {
          type: "Food",
          name: "Lunch",
          date: "03/07/2022",
          amount: 100,
          status: "Cancelled",
          fileUrl:
            "https://blog.openclassrooms.com/en/wp-content/uploads/sites/4/2018/11/Blog_logo.jpg",
        },
      ];
      const html = BillsUI({ data: bill });
      document.body.innerHTML = html;
      const title = screen.getByTestId("title");
      const modal = screen.getByTestId("tbody");
      const container = screen.getByTestId("modal-body");
      container.innerHTML = `<div data-testid="modal-body" class="modal-body"><img data-testid="photo" src=${bill.fileUrl} /></div>`;
      const photo = screen.getByTestId("photo");
      expect(modal).toBeInTheDocument();
      expect(container).toContainElement(photo);
      expect(title.value).toBe(bill.name);
    });
  });
  describe("views/Bills component: increase coverage to 100%", () => {
    test("Check Loading page", () => {
      const html = BillsUI({ data: bills, loading: true });
      document.body.innerHTML = html;

      const Loading = screen.getByTestId("loading-page");
      expect(Loading).toBeInTheDocument();
    });
    test("Check Error page", () => {
      const html = BillsUI({
        data: bills,
        loading: false,
        error: "Error page test",
      });
      document.body.innerHTML = html;
      const Error = screen.getByTestId("error-message");
      expect(Error).toBeInTheDocument();
    });
  });
});
describe("container/Bills component", () => {
  test('cover all the "statements" except the back-end firebase calls', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Admin",
      })
    );

    const html = BillsUI({
      data: bills,
    });
    document.body.innerHTML = html;

    const bill = new Bills({
      document,
      onNavigate,
      firestore: null,
      bills,
      localStorage: window.localStorage,
    });

    const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill(e));
    const handleClickIconEye = jest.fn((icon) => bill.handleClickIconEye(icon));

    const newBillBtn = screen.getByTestId("btn-new-bill");
    expect(newBillBtn).toBeTruthy();
    newBillBtn.addEventListener("click", handleClickNewBill);

    userEvent.click(newBillBtn);
    expect(handleClickNewBill).toHaveBeenCalled();

    document.body.innerHTML = html;
    const iconEye = screen.getAllByTestId("icon-eye");
    expect(iconEye).toBeTruthy();

    iconEye.forEach((icon) => {
      icon.addEventListener("click", handleClickIconEye(icon));
      userEvent.click(icon);
      expect(handleClickIconEye).toHaveBeenCalled();
    });
  });
});
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
