const cl =console.log;
const spinner = document.getElementById('spinner');
const postContainer = document.getElementById('postContainer');
const form = document.getElementById("form");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const addPostBtn = document.getElementById("addPostBtn");
const updatePostBtn = document.getElementById("updatePostBtn");


let BASE_URL = "https://fetch-api-crud-e52ad-default-rtdb.asia-southeast1.firebasedatabase.app"
let POST_URL = `${BASE_URL}/post1.json`;

//functions 
//swalfire
function snackaBar(msg, icon){
  Swal.fire({
    text:msg,
    icon:icon,
    timer:2500
  })
}
//spinner
  function showHideSpinner(){
    spinner.classList.toggle("d-none");
  }

//state
  const state = {
    postsArr :[],
    EDIT_ID :null
  }

//read

function showUi(){
 showHideSpinner();
 fetch(POST_URL,{
  method:"GET",
  body:null,
  headers:{
    "content-type":"application/json",
    "authorization":"JWT token"
  }
 })
 .then((res)=>{
  return res.json()
 })
 .then((data)=>{
  cl(data);
   for(const key in data){
    data[key].id = key
    state.postsArr.push(data[key]);
    cl(state.postsArr)
   }
  templeting(state.postsArr);
 })
 .catch((err)=>{
  cl("somthing went wrong",err);
 })
 .finally(()=>{
  showHideSpinner()
 })
}

function templeting(arr){
let result =  ``;
arr.forEach(ele => {
  result+=  `<div class="col-md-3 mb-5" id="${ele.id}">
                <div class="card shadow h-100">
                    <div class="card-header">
                        <h3 class="m-0">${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>`
});
postContainer.innerHTML = result;
}
showUi();

// //create
function onAddPost(eve){
eve.preventDefault();
let newObj = {
  title:titleControl.value,
  content:bodyControl.value,
  userId:userIdControl.value
}
showHideSpinner();
fetch(POST_URL,{
  method:"POST",
  body:JSON.stringify(newObj),
  headers:{
    "content-type":"application/json",
    "authorization":"JWT token"
}
})
.then((res)=>{
  if(!res.ok){
    throw new Error("something went wrong")
  }
  return res.json();
})
.then((data)=>{
  cl(data);
   newObj.id = data.name;
   state.postsArr.push(newObj);
   templeting(state.postsArr);
  snackaBar("Post added successfully", "success");
  form.reset();
})
.catch((err)=>{
  cl(err);
  snackaBar("Error adding post","error");
})
.finally(()=>{
  showHideSpinner();
});
}

//edit 
function onEdit(ele){
  let EDIT_ID = ele.closest(".col-md-3").id;
  state.EDIT_ID = EDIT_ID;
  let edit_Obj = state.postsArr.find(obj => obj.id === EDIT_ID);
 titleControl.value = edit_Obj.title;
 bodyControl.value = edit_Obj.content;
 userIdControl.value = edit_Obj.userId;
updatePostBtn.classList.remove("d-none");
addPostBtn.classList.add("d-none");
}

//update 
function onUpdate(eve){
  let update_ID = state.EDIT_ID;
  UPDATE_URL = `${BASE_URL}/post1/${update_ID}.json`
  let update_Obj = {
    title:title.value,
    content:body.value,
    userId:userId.value,
    id:update_ID
  }
  showHideSpinner();
  fetch(UPDATE_URL,{
    method:"PATCH",
    body:JSON.stringify(update_Obj),
    headers:{
      "content-type":"application/json",
      "authorization":"JWT token"
    }
  })
  .then((res)=>{
    if(!res.ok){
      throw new Error("something went wrong");
    }
    return res.json();
  })
  .then((data)=>{
    let getIndex = state.postsArr.findIndex(obj => obj.id === update_ID);
    state.postsArr[getIndex] = update_Obj;
    let div = document.getElementById(update_ID);
    div.querySelector("h3").innerHTML = update_Obj.title;
    div.querySelector("p").innerHTML = update_Obj.content;
    addPostBtn.classList.remove("d-none");
    updatePostBtn.classList.add("d-none");
    form.reset();
  })
  .catch((err)=>{
    snackaBar("something went wrong");
  })
  .finally(()=>{
    showHideSpinner();
  })
}
//delete 
function onRemove(ele){
 Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let remove_id = ele.closest(".col-md-3").id;
    let remove_url = `${BASE_URL}/post1/${remove_id}.json`;
      showHideSpinner();
    fetch(remove_url,{
       method:"DELETE",
       body:null,
       headers:{
        "content-type":"application/json",
        "authontication":"JWT token"
       }
    })
    .then((res)=>{
      if(!res.ok){
        throw new Error("somethinf went wrong")
      }
      return res.json();
    })
    .then((data)=>{
      cl(data);
      let getIndex = state.postsArr.findIndex(obj=> obj.id === remove_id);
      state.postsArr.splice(getIndex, 1);
      ele.closest(".col-md-3").remove();
    })
    .catch((err)=>{
      snackaBar("somthing went wrong");
    })
    .finally(()=>{
        showHideSpinner();
    })
     Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  }
});

}
  

updatePostBtn.addEventListener("click",onUpdate);
form.addEventListener("submit",onAddPost);



