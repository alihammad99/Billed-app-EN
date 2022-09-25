import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("I can type in the information for a bill and add a receipt as proof.", () => {
    test("Category select input", () => {
      document.body.innerHTML = NewBillUI();
      const category = screen.getByTestId("expense-type");
      fireEvent.change(category, {
        target: { value: "Food" },
      });
      expect(category.value).toEqual("Food");
    });

    test("Expenses", () => {
      document.body.innerHTML = NewBillUI();
      //Expenses
      const expense = screen.getByTestId("expense-name");
      fireEvent.change(expense, { target: { value: "Anniversary lunch" } });
      expect(expense.value).toBe("Anniversary lunch");
    });

    test("Date", () => {
      const date = screen.getByTestId("datepicker");
      date.innerText = "02/13/2022";
      expect(date.innerText).toEqual("02/13/2022");
    });

    //Amount
    test("Amount", () => {
      const amount = screen.getByTestId("amount");
      fireEvent.change(amount, { target: { value: 5 } });
      expect(amount.value).toBe("5");
    });
    test("Vat", () => {
      const vat = screen.getByTestId("vat");
      fireEvent.change(vat, { target: { value: 20 } });
      expect(vat.value).toBe("20");
    });

    test("pct", () => {
      const pct = screen.getByTestId("pct");
      fireEvent.change(pct, { target: { value: 5 } });
      expect(pct.value).toBe("5");
    });

    test("Comments", () => {
      const comments = screen.getByTestId("commentary");
      fireEvent.change(comments, {
        target: { value: "A food celebration for employees" },
      });
      expect(comments.value).toBe("A food celebration for employees");
    });

    test("Fees", () => {
      const form = screen.getByTestId("form-new-bill");
      const file = screen.getByTestId("file");
      const photo =
        "https://blog.openclassrooms.com/en/wp-content/uploads/sites/4/2018/11/Blog_logo.jpg";
      fireEvent.change(file, {
        target: { filename: photo },
      });

      expect(file.filename).toBe(photo);

      fireEvent.submit(form);
      expect(form).toBeTruthy();
    });
  });
});
