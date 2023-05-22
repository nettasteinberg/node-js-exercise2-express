import fs from 'fs';

const todos = JSON.parse(fs.readFileSync("./todos.json", 'utf8'));

const argvArr = [...process.argv];
argvArr.splice(0, 2);

const keysArr = ['id', 'title', 'description', 'isCompleted'];

const findTodoById = (index) => {
    let ret = false;
    for (let i = 0; i < todos.length && !ret; i++) {
        if (todos[i].id === index) {
            ret = todos[i];
        }
        // todos.forEach(todo 
    }
    return ret;
}

const writeToFile = () => {
    fs.writeFile("todos.json", JSON.stringify(todos), err => {
        // Checking for errors 
        if (err) throw err;
        console.log("Done writing"); // Success 
    });
}

const deleteTodo = (args) => {
    console.log("enter update")
    const ind = parseInt(args[0]);
    let todo = findTodoById(ind);
    const todoIndex = todos.findIndex(element => element === todo);
    todos.splice(todoIndex, 1);
    writeToFile();
}

const updateTodo = (args) => {
    console.log("enter update")
    const ind = parseInt(args[0]);
    let todo = findTodoById(ind);
    if (!todo) {
        console.log(`todo with id ${ind} doesn't exist`)
        return;
    }
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case "title":
                todo["title"] = args[i + 1];
                i++;
                break;
            case "description":
                todo["description"] = args[i + 1];
                i++;
                break;
            case "isCompleted":
                todo["description"] = args[i + 1] === true;
                i++;
                break;
            default:
        }
    }
    writeToFile();
}

const addTodo = (args) => {
    console.log("args", args)
    let todo = {};
    const ind = parseInt(args[0]);
    if (findTodoById(ind)) {
        console.log(`id ${ind} already exist, the todo won't be added to the todos list`)
        return;
    }
    argvArr.forEach((arg, index) => {
        switch (index) {
            case 0:
                todo[keysArr[index]] = parseInt(arg);
                break;
            case 1:
            case 2:
                todo[keysArr[index]] = arg;
                break;
            case 3:
                todo[keysArr[index]] = (arg === true);
        }
    })
    todos.push(todo);
    writeToFile();
}

switch (argvArr[0]) {
    case "add":
        argvArr.splice(0, 1);
        addTodo(argvArr)
        break;
    case "update":
        argvArr.splice(0, 1);
        updateTodo(argvArr)
        break;
    case "delete":
        argvArr.splice(0, 1);
        deleteTodo(argvArr);
        break;
    default:
        console.log(`Help:
        The first argument should be one of add/update/delete/read/print
        - add <id (integer)> <title (string)> <description(string)> <isCompleted (boolean)>
        - update <id> [title <new title>] [description <new description>] [isCompleted <true | false>]
        - delete  id <id>
        `)

}