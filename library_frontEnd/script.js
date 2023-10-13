let takenBooks = [];
let returnedBooks = [];

async function postBook(event) {
  event.preventDefault();
  const title = document.getElementById("bookTitle").value;
  const takeDate = new Date();
  const returnDate = new Date(takeDate.getTime() + 60 * 60 * 1000);
  const fine =
    Math.floor((returnDate - takeDate - 1) / (60 * 60 * 1000)) * 10;

  const obj = {
    title,
    takeDate,
    returnDate,
    status: "taken",
    fine,
    returnedDate: null,
  };

  try {
    // Post
    await axios.post("http://localhost:8000/api/library/add", obj);
    console.log("Data sent successfully");
    getBook();
    document.getElementById("bookTitle").value = "";
  } catch (err) {
    console.log("Error in posting book", err);
  }
}

async function getBook() {
  try {
    // Get
    const response = await axios.get(
      "http://localhost:8000/api/library/books"
    );
    takenBooks = response.data.filter((book) => book.status === "taken");
    returnedBooks = response.data.filter(
      (book) => book.status === "returned"
    );
    console.log("Response Data:", response.data);
    displayBooks();
  } catch (err) {
    console.log("Error in getting book from the server", err);
  }
}

function displayBooks() {
  displayTakenBooks();
  displayReturnedBooks();
}

function displayTakenBooks() {
  const takenBookList = document.getElementById("bookList");
  takenBookList.innerHTML = "";

  for (const book of takenBooks) {
    const currentDate = new Date();
    const returnDate = new Date(book.returnDate);
    const fine =
      Math.ceil((currentDate - returnDate) / (60 * 60 * 1000)) * 10;

    const takenBook = document.createElement("div");
    takenBook.id = `book-${book.id}`;
    takenBook.className = "book-item";
    takenBook.innerHTML = `
      <p><strong>Book name: ${book.title}</strong></p>
      <p>Book taken on: ${new Date(book.takeDate).toLocaleString()}</p>
      <p>Book return date: ${new Date(
        book.returnDate
      ).toLocaleString()}</p>
      <p>Current fine: <span style="font-weight: bold; color: red;">${fine}</span></p>
      <button onclick="returnBook('${book.id}', '${book.title}', '${
      book.takeDate
    }', '${fine}', '${book.status}')">Return book</button>
    `;
    //   takenBookList.appendChild(takenBook);
    const firstChild = takenBookList.firstChild;
    if (firstChild) {
      takenBookList.insertBefore(takenBook, firstChild);
    } else {
      takenBookList.appendChild(takenBook);
    }
  }
}

function displayReturnedBooks() {
  const returnBookList = document.getElementById("returnedBooks");
  returnBookList.innerHTML = "";
  for (const book of returnedBooks) {
    displayReturnBook(book);
  }
}

async function returnBook(id, title, takeDate, fine, status) {
  const returnBook = document.getElementById(`book-${id}`);
  returnBook.innerHTML = "";

  const returnedDate = new Date();

  if (status === "taken" && fine > 0) {
    const fineDiv = document.createElement("div");
    fineDiv.innerHTML = `
      <p><input type="text" value="${fine}" readonly></p>
      <p><button id="fineAmount" onclick="payFine('${id}', '${title}', ${fine}, '${status}', '${returnedDate}')">Pay Fine</button></p>
    `;
    returnBook.appendChild(fineDiv);
  } else {
    try {
      const updatedData = {
        status: "returned",
        fine: fine,
        returnedDate: returnedDate,
      };
      await axios.put(
        `http://localhost:8000/api/library/updateBook/${id}`,
        updatedData
      );
      console.log("Book status updated to 'returned'");
      returnBook.remove();
      displayReturnBook({ id, title, fine, status, returnedDate }); /// remember when more argument to pass , pass as obj
    } catch (err) {
      console.log("Error in updating book status", err);
    }
  }
}

async function payFine(id, title, fine, status, returnedDate) {
  try {
    const updatedData = {
      status: "returned",
      fine: fine,
      returnedDate: returnedDate,
    };
    await axios.put(
      `http://localhost:8000/api/library/updateBook/${id}`,
      updatedData
    );
    console.log("Book status and fine updated successfully");
    const returnBook = document.getElementById(`book-${id}`);
    returnBook.remove();
    displayReturnBook(id, title, fine, status, returnedDate);
  } catch (err) {
    console.log("Error in updating book status and fine", err);
  }
}

function displayReturnBook(book) {
  const returnBookList = document.getElementById("returnedBooks");
  const returnedBook = document.createElement("div");
  returnedBook.className = "return-book";
  returnedBook.innerHTML = `
    <p><strong> Book name: <span style="font-weight: bold; color: black;">${book.title}</span></strong></p>
    <p>Fine: ${book.fine}</p>
    <p>Book returned on: ${new Date(
      book.returnedDate
    ).toLocaleString()}</p>
  `;
  // returnBookList.appendChild(returnedBook);

  const firstChild = returnBookList.firstChild;
  if (firstChild) {
    returnBookList.insertBefore(returnedBook, firstChild);
  } else {
    returnBookList.appendChild(returnedBook);
  }
}

window.addEventListener("load", function () {
  console.log("Page has finished loading or refreshing");
  getBook();
});