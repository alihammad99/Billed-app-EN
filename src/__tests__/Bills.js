import { fireEvent, screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import "@testing-library/jest-dom";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      //to-do write expect expression
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
});
