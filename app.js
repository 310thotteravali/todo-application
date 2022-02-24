const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const databasePath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");

let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB error:${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const hasCategoryAndPriorityAndStatusProperties = (requestQuery) => {
  return (
     requestQuery.category !== undefined&&
     requestQuery.priority !== undefined &&
    requestQuery.status !== undefined 
    
  );
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hatsPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};



const due_date = format(new Date(2021, 1, 21), "dd/MM/yyyy");

if due_date{
    isValid(new Date(2021, 1, 21))
}else{
    isValid(new Date(''))
}

app.get("/todos/",async(request,response)=>{
    let data=null;
    let getTodoQuery="";
    const {search_q=" ",category,priority,status,due_date}=request.query;
    switch(true){
        case hasCategoryAndPriorityAndStatusProperties(requestQuery);
        getTodoQuery=`select * from todo where todo like '%${search_q}%' and category='${category}' and priority='${priority}' and status='${status}' and due_date='${due_date}';`;
        break;
        case hasPriorityProperty(requestQuery);
        getTodoQuery=`select * from todo where todo like '%${search_q}%' and priority='${priority}';`;
        break;
        case hasStatusProperty(requestQuery);
        getTodoQuery=`select * from todo where todo like '%${search_q}%' and status='${status}';`;
        break;
        case hasCategoryProperty(requestQuery);
        getTodoQuery=`select * from todo where todo like '%${search_q}%' and category='${category};`;
        break;
        default 
        getTodoQuery=`select * from todo where todo like '%${search_q}%';`;
     
    }
    data=await database.all(getTodoQuery);
    response.send(data);
});

app.get("/todo/:todoId/",async(request,response)=>{
    const {todoId}=request.params;
    const getTodoQuery=`select * from todo where id=${todoId};`;
    const todo=await database.get(getTodoQuery);
    response.send(todo);
});

app.get("/agenda/",async(request,response)=>{
    const date=format(new Date(2021,1,21),'yyyy-MM-dd');
    const getQuery=`select * from todo where due_date=${date};`;
    const result=await database.get(getQuery);
    response.send(result);
});

app.post("/todos/",async(request,response)=>{
    const {id,todo,category,priority,status,due_date}=request.body;
    const postTodoQuery=`insert into todo(id,todo,category,priority,status,due_date)values
    (${id},'${todo}','${category}','${priority}','${status}');`;
    await.database.run(postTodoQuery);
    response.send("Todo Successfully Added");
});

app.put("/todos/:todoId",async(request,response)=>{
    const {todoId}=request.params;
    let updateColumn="";
    const requestBody=request.body;
    switch(true){
        case requestBody.category!==undefined:
            updateColumn="Category";
            else{
                response.status(400);
                response.send("Invalid Todo Category");
            
            }
            break;
        case requestBody.priority!==undefined:
            updateColumn="Priority";
            else{
                response.status(400);
                response.send("Invalid Todo Priority");
            }
            break;
        case requestBody.status!==undefined:
            updateColumn="Status";
            else{
                response.status(400);
                response.send("Invalid Todo Status");
            }
            break;
        case requestBody.due_date!==undefined:
            updateColumn="Due_date";
            else{
                response.status(400);
                response.send("Invalid Due Date");
            }
            break;
    }
    const previousTodoQuery=`select * from todo where id=${todoId};`;
    const previousTodo=await database.get(previousTodoQuery);
    const {
        todo=previousTodo.todo,
        category=previousTodo.category,
        priority=previousTodo.priority,
        status=previousTodo.status,
        due_date=previousTodo.due_date,
    }=request.body;

    const updateTodoQuery=`update todo set todo='${todo}',category='${category}',priority='${priority}',status='${status}',due_date='${due_date}';`;
    await database.run(updateTodoQuery);
    response.send(`${updateColumn} Updates`);
});

app.delete("/todo/:todoId",async(request,response)=>{
    const {todoId}=request.params;
    const deleteTodoQuery=`Delete from todo where id=${todoId};`;
    await database.run(deleteTodoQuery);
    response.send("Todo Deleted");
});

module.exports=app;