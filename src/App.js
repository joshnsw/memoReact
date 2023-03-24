
import './App.css';

import { useState } from 'react';

const Main = () => {

  const [input, setInput] = useState("");

  const [category, setCategory] = useState();

  const [memo, setMemo] = useState();

  const [form, setForm] = useState();

  const [editform, setEditForm] = useState(false);

  const [newitem, setNewItem] = useState(false);

  const [categoryid, setCategoryId] = useState();


  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;



  const isAccessInputValid = uuidRegex.test(input);



  const handleAccessInputChange = (event) => {
    setInput(event.target.value);
    console.log(input)
  };


  const getCategory = () => {

    const accessToken = input;

    fetch('https://challenge-server.tracks.run/memoapp/category', {
        headers: {
            'X-ACCESS-TOKEN': accessToken
        }
    })
    .then(response => response.json())
    .then((data) => {
        setCategory(data)
        console.log(data)
    })
    .catch(error => console.error(error));

  }

  const memoAll = (id) => {

    const accessToken = input;

    fetch(`https://challenge-server.tracks.run/memoapp/memo?category_id=${id}`, {
        headers: {
            'X-ACCESS-TOKEN': accessToken
        }
    })
    .then(response => response.json())
    .then((data) => {
        setMemo(data)
        console.log(data)
    })
    .catch(error => console.error(error));

  }

  const memoGet = (id) => {

    const accessToken = input;

    fetch(`https://challenge-server.tracks.run/memoapp/memo/${id}`, {
        headers: {
            'X-ACCESS-TOKEN': accessToken
        }
    })
    .then(response => response.json())
    .then((data) => {
        setForm(data)

        console.log(data)
    })
    .catch(error => console.error(error));

  }

  const handleTitleChange = (event) => {
    const title = event.target.value;

    setForm(prevState => ({
      ...prevState,
      title: title
    }));
  };

  const handleContentChange = (event) => {
    const content = event.target.value;

    setForm(prevState => ({
      ...prevState,
      content: content
    }));
  };


  const patchMemo = () => {

    const accessToken = input;

    fetch(`https://challenge-server.tracks.run/memoapp/memo/${form.id}`, {
    method: "PUT",
    headers: {
      "X-ACCESS-TOKEN": accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: form.id,
      category_id: form.category_id,
      title: form.title,
      content: form.content
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
      setForm(data);
      memoAll(categoryid);
    })
    .catch(error => console.error("Error saving memo:", error));

  }

  const postMemo = () => {
    const accessToken = input;

    fetch('https://challenge-server.tracks.run/memoapp/memo', {
      method: "POST",
      headers: {
        "X-ACCESS-TOKEN": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category_id: categoryid,
        title: form.title,
        content: form.content
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from server:", data);
        setForm(data);
        console.log(form);
        memoAll(categoryid);
      })
      .catch(error => console.error("Error saving memo:", error));
  }

  const deleteMemo = () => {
    const accessToken = input;

    fetch(`https://challenge-server.tracks.run/memoapp/memo/${form.id}`, {
      method: "DELETE",
      headers: {
        "X-ACCESS-TOKEN": accessToken
      }
    })
      .then(() => {
        console.log("Memo deleted successfully");
        setForm({title:"", content:""});
        setEditForm(false);
        memoAll(categoryid);
      })
      .catch(error => console.error("Error deleting memo:", error));
  };

  return(
    <>
      <nav className="bg-primary py-3 text-white">
        <div className="p-2">
        <div className="row d-flex ">
        <div className="col d-flex align-items-center gap-3">
        <i className="fa-solid fa-bars"></i> <div>Memo App</div>

        </div>

        <div className="col">
        <label for="access_token">Access Token:&nbsp;</label>
        <input type="text" id="access_token" value={input}
              onChange={handleAccessInputChange}/>
        </div>

        <div className="col d-flex justify-content-end">
        <button type="submit" className="btn btn-primary" id="login"  disabled={!isAccessInputValid} onClick={getCategory}>Login</button>
        </div>

        </div>
        </div>
      </nav>


    <div>
     <div className="row">

      <div className="col-4 p-5">
      <div className="accordion" id="accordionExample">
            {
            category && category.map((item) => (
          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header" id={`heading${item.id}`}>

              <button  className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${item.id}`} aria-expanded="true" aria-controls={`collapse${item.id}`} onClick={() => {memoAll(item.id);setNewItem(!newitem);setCategoryId(item.id)}}>
              <i className={`fa fa-folder${newitem && item.id == categoryid ? '-open' : ''}`} aria-hidden="true"></i> <div>&nbsp;{item.name}</div>
              </button>
            </h2>
            <div id={`collapse${item.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${item.id}`} data-bs-parent="#accordionExample">

              { memo && memo.map((item) => ( <div className="accordion-body" id={item.id}>
              <button className="btn btn-white d-flex align-items-center" onClick={() => {memoGet(item.id);setEditForm(true);}}>
              <i class="fa-sharp fa-solid fa-file"></i><div>&nbsp;  {item.title}</div>
              </button>
              </div>))
               }
            </div>
          </div>
        ))
        }
       <div className="col d-flex justify-content-end my-2">
      {category && <button type="submit" className="btn btn-primary mr-auto" id="new-memo"  disabled={!newitem} onClick={() => {setForm({title:"new memo",category_id:categoryid, content:""});setEditForm(true);}}>New</button>}
      </div>
      </div>

      </div>

      <div className="col-8 py-2 ">
          <div className="py-3">
            <label for="memo-title" className="d-flex flex-column align-items-left">Title:</label>
              <input type="text" id="memo-title" value={form && form.title} onChange={handleTitleChange} disabled={!editform}/>
          </div>

          <div className="py-3">
          <label for="memo-content" className="d-flex flex-column align-items-left">Content:</label>
          <textarea id="memo-content" name="story"
                      rows="5" cols="33" value={form && form.content} onChange={handleContentChange} disabled={!editform}>

            </textarea>
          </div>

          <div className="py-3">
          <button type="submit" className="btn btn-success" id="save-memo"  onClick={form && form.id ? patchMemo : postMemo} disabled={!editform}>Save</button>
          <button type="submit" className="btn btn-danger mx-3" id="delete-memo"  onClick={() => {deleteMemo();setEditForm(true);}} disabled={!editform}>Delete</button>
          </div>



      </div>


     </div>

    </div>



      </>
  )

}


function App() {
  return (
    <div className="App">
    <Main/>
    </div>
  );
}

export default App;
